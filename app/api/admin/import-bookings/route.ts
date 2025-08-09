import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EventBooking from '@/models/EventBooking'
import { verifyAuthRequest } from '@/lib/auth-server'

// Helper function to parse dates from various formats
function parseDate(dateString: string): Date | null {
  if (!dateString || dateString.trim() === '') return null

  // Handle common date formats
  const dateFormats = [
    /(\w+)\s+(\d{1,2}),?\s+(\d{4})/, // "September 21, 2024" or "September 21 2024"
    /(\d{1,2})\/(\d{1,2})\/(\d{4})/, // "9/21/2024"
    /(\d{4})-(\d{1,2})-(\d{1,2})/, // "2024-09-21"
  ]

  const monthNames: { [key: string]: number } = {
    january: 0,
    jan: 0,
    february: 1,
    feb: 1,
    march: 2,
    mar: 2,
    april: 3,
    apr: 3,
    may: 4,
    june: 5,
    jun: 5,
    july: 6,
    jul: 6,
    august: 7,
    aug: 7,
    september: 8,
    sep: 8,
    october: 9,
    oct: 9,
    november: 10,
    nov: 10,
    december: 11,
    dec: 11,
  }

  for (const format of dateFormats) {
    const match = dateString.toLowerCase().match(format)
    if (match) {
      if (match[1] in monthNames) {
        // Format: "September 21, 2024"
        const month = monthNames[match[1]]
        const day = parseInt(match[2])
        const year = parseInt(match[3])
        return new Date(year, month, day)
      } else {
        // Format: "9/21/2024" or "2024-09-21"
        const parts = match.slice(1).map((p) => parseInt(p))
        if (parts[0] > 1000) {
          // Year first format
          return new Date(parts[0], parts[1] - 1, parts[2])
        } else {
          // Month first format
          return new Date(parts[2], parts[0] - 1, parts[1])
        }
      }
    }
  }

  return null
}

// Helper function to parse CSV with proper handling of quoted fields and multi-line cells
function parseCSVLine(line: string): string[] {
  const result = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]

    if (char === '"') {
      inQuotes = !inQuotes
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }

  result.push(current.trim())
  return result
}

// Helper function to clean and validate CSV values
function cleanCSVValue(value: string): string {
  if (!value) return ''

  // Remove extra quotes and whitespace
  let cleaned = value.trim()

  // Remove surrounding quotes if they exist
  if (cleaned.startsWith('"') && cleaned.endsWith('"')) {
    cleaned = cleaned.slice(1, -1)
  }

  // Clean up common CSV artifacts
  cleaned = cleaned
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .replace(/\r/g, ' ')
  cleaned = cleaned.replace(/\s+/g, ' ') // Replace multiple spaces with single space

  return cleaned.trim()
}

// Helper function to parse entire CSV content with multi-line cells
function parseCSVContent(content: string): string[][] {
  const lines: string[][] = []
  let currentLine = ''
  let inQuotes = false
  let lineBuffer = ''

  for (let i = 0; i < content.length; i++) {
    const char = content[i]

    if (char === '"') {
      inQuotes = !inQuotes
      lineBuffer += char
    } else if (char === '\n' && !inQuotes) {
      // End of line (not inside quotes)
      if (lineBuffer.trim()) {
        lines.push(parseCSVLine(lineBuffer))
      }
      lineBuffer = ''
    } else {
      lineBuffer += char
    }
  }

  // Add the last line if there's content
  if (lineBuffer.trim()) {
    lines.push(parseCSVLine(lineBuffer))
  }

  return lines
}

// POST - Import bookings from CSV/Excel
export async function POST(request: NextRequest) {
  try {
    const authResult = await verifyAuthRequest(request)
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    await connectToDatabase()

    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 },
      )
    }

    // Read the file content
    const fileContent = await file.text()
    const parsedLines = parseCSVContent(fileContent)

    if (parsedLines.length < 2) {
      return NextResponse.json(
        { success: false, message: 'File is empty or has no data rows' },
        { status: 400 },
      )
    }

    // Parse headers (first line)
    const headers = parsedLines[0].map((h) => h.trim().toLowerCase())
    console.log('CSV Headers:', headers)

    const importedBookings = []
    const errors = []
    const skippedDuplicates = []

    // Process data rows (skip header)
    for (let i = 1; i < parsedLines.length; i++) {
      const values = parsedLines[i]

      try {
        // Create booking object from CSV row
        const bookingData: any = {}

        console.log(`\n--- Processing Row ${i + 1} ---`)
        console.log('Raw values:', values)
        console.log('Headers:', headers)

        headers.forEach((header, index) => {
          const rawValue = values[index] || ''
          const value = cleanCSVValue(rawValue)
          console.log(`  ${header}: "${rawValue}" → "${value}"`)

          switch (header) {
            case 'name':
              // This IS the client name! (not an internal identifier)
              bookingData.clientName = value
              console.log(
                `    → Mapped clientName from Name column: "${value}"`,
              )
              break
            case 'status':
              // Handle multiple statuses and prioritize "Done"
              let finalStatus = 'pending'
              if (value) {
                const statusLower = value.toLowerCase()
                if (statusLower.includes('cancelled')) {
                  // Skip cancelled bookings entirely
                  bookingData.skipBooking = true
                  console.log(`    → SKIPPING: Cancelled booking - "${value}"`)
                  break
                } else if (statusLower.includes('done')) {
                  finalStatus = 'completed'
                } else if (statusLower.includes('confirmed')) {
                  finalStatus = 'confirmed'
                } else if (statusLower.includes('tentative')) {
                  finalStatus = 'pending'
                } else if (statusLower.includes('full paid')) {
                  finalStatus = 'confirmed'
                } else if (statusLower.includes('dp:')) {
                  finalStatus = 'confirmed'
                } else {
                  finalStatus = 'pending'
                }
              } else {
                // Empty status defaults to pending
                finalStatus = 'pending'
              }
              bookingData.status = finalStatus
              console.log(`    → Status mapping: "${value}" → "${finalStatus}"`)
              break
            case 'package':
              bookingData.package = value
              break
            case 'event date':
            case 'eventdate':
              bookingData.eventDate = value
              break
            case 'location':
              bookingData.location = value
              break
            case 'agreed amount':
            case 'agreedamount':
              bookingData.agreedAmount = value
              break
            case 'event type':
            case 'eventtype':
              bookingData.eventType = value
              break
            case 'crew':
              bookingData.crew = value
              break
            case 'client name':
            case 'clientname':
              // Skip this column since we're using the "Name" column for client names
              console.log(
                `    → Skipped Client Name column: "${value}" (using Name column instead)`,
              )
              break
            case 'ingress':
              bookingData.ingress = value
              break
            case 'event time':
            case 'eventtime':
              bookingData.eventTime = value
              break
            case 'mixer and speaker':
            case 'mixer and notes':
            case 'mixerandnotes':
              bookingData.mixerAndSpeaker = value
              break
            case 'driver':
              bookingData.driver = value
              break
            case 'notes':
              if (value && !bookingData.notes) {
                bookingData.notes = value
              } else if (value) {
                bookingData.notes += ` | ${value}`
              }
              break
            case 'expenses':
              bookingData.expenses = value
              break
            case 'created date':
            case 'createddate':
              // This is just the year, we'll ignore it for now
              break
            default:
              // Store unknown fields in notes
              if (value && !bookingData.notes) {
                bookingData.notes = `${header}: ${value}`
              } else if (value) {
                bookingData.notes += ` | ${header}: ${value}`
              }
          }
        })

        console.log('Final bookingData:', bookingData)

        // Skip cancelled bookings
        if (bookingData.skipBooking) {
          console.log(`    → SKIPPED: Cancelled booking from row ${i + 1}`)
          continue
        }

        // No need for auto-fill since we're getting client name from the Name column

        // Parse and validate the booking data
        const parsedDate = parseDate(bookingData.eventDate)
        const parsedBooking = {
          status: bookingData.status || 'pending',
          eventType: bookingData.eventType || '',
          eventDate: parsedDate || new Date(),
          crew: bookingData.crew
            ? bookingData.crew.split(',').map((c: string) => c.trim())
            : [],
          clientName: bookingData.clientName || '',
          agreedAmount: parseFloat(bookingData.agreedAmount) || 0,
          package: bookingData.package || '',
          eventTime: bookingData.eventTime || '',
          ingress: bookingData.ingress || '',
          expenses: parseFloat(bookingData.expenses) || 0,
          location: bookingData.location || '',
          mixerAndSpeaker: bookingData.mixerAndSpeaker || '',
          driver: bookingData.driver || '',
          notes: bookingData.notes || `Imported from CSV - Row ${i + 1}`,
        }

        // Check for existing booking to avoid duplicates
        type DuplicateCriteria = {
          clientName: string
          eventDate: Date
          eventType?: string
        }
        const duplicateCriteria: DuplicateCriteria = {
          clientName: parsedBooking.clientName,
          eventDate: parsedBooking.eventDate,
        }

        // Add eventType to criteria if it exists
        if (parsedBooking.eventType) {
          duplicateCriteria.eventType = parsedBooking.eventType
        }

        const existingBooking = await EventBooking.findOne(duplicateCriteria)

        if (existingBooking) {
          const duplicateInfo = {
            row: i + 1,
            clientName: parsedBooking.clientName,
            eventDate: parsedBooking.eventDate,
            existingId: existingBooking._id,
          }
          skippedDuplicates.push(duplicateInfo)
          console.log(
            `⚠ SKIPPED: Duplicate booking found - "${parsedBooking.clientName}" on ${parsedBooking.eventDate} (ID: ${existingBooking._id})`,
          )
          continue // Skip this row
        }

        // Create the booking
        const newBooking = new EventBooking(parsedBooking)
        await newBooking.save()

        importedBookings.push(newBooking)
        console.log(
          `✓ Imported booking: "${parsedBooking.clientName}" - ${parsedBooking.eventDate}`,
        )
        if (!parsedBooking.clientName) {
          console.log(`⚠ WARNING: Empty clientName for row ${i + 1}`)
        }
      } catch (error) {
        console.error(`Error importing booking at row ${i + 1}:`, error)
        errors.push({
          row: i + 1,
          data: values,
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      success: true,
      message: `Successfully imported ${importedBookings.length} bookings${
        errors.length > 0 ? ` with ${errors.length} errors` : ''
      }${
        skippedDuplicates.length > 0
          ? ` and skipped ${skippedDuplicates.length} duplicates`
          : ''
      }`,
      importedCount: importedBookings.length,
      errorCount: errors.length,
      skippedCount: skippedDuplicates.length,
      errorDetails: errors,
      skippedDetails: skippedDuplicates,
    })
  } catch (error) {
    console.error('Error importing bookings:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to import bookings' },
      { status: 500 },
    )
  }
}
