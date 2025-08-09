# CSV Import Format for Event Bookings

This document explains the format required for importing event bookings from CSV/Excel files (e.g., from Notion exports).

## Required CSV Headers

Your CSV file should have the following headers in the first row:

```csv
status,eventType,eventDate,clientName,agreedAmount,package,eventTime,ingress,expenses,location,mixerAndSpeaker,driver,crew,notes
```

## Field Descriptions

| Field             | Type   | Required | Description                    | Example                                          |
| ----------------- | ------ | -------- | ------------------------------ | ------------------------------------------------ |
| `status`          | String | No       | Booking status                 | `pending`, `confirmed`, `completed`, `cancelled` |
| `eventType`       | String | No       | Type of event                  | `Wedding`, `Birthday`, `Corporate Event`         |
| `eventDate`       | String | No       | Event date (YYYY-MM-DD)        | `2025-01-15`                                     |
| `clientName`      | String | No       | Client's name                  | `John Doe`                                       |
| `agreedAmount`    | Number | No       | Agreed payment amount          | `15000`                                          |
| `package`         | String | No       | Package name                   | `Full Package`, `Sounds and Lights`              |
| `eventTime`       | String | No       | Event start time               | `2:00 PM`, `14:00`                               |
| `ingress`         | String | No       | Setup/arrival time             | `12:00 PM`, `12:00`                              |
| `expenses`        | Number | No       | Event expenses                 | `2000`                                           |
| `location`        | String | No       | Event location                 | `Trece Martires City`                            |
| `mixerAndSpeaker` | String | No       | Equipment details              | `RCF Speakers, Allen & Heath Mixer`              |
| `driver`          | String | No       | Driver name                    | `Juan Dela Cruz`                                 |
| `crew`            | String | No       | Crew members (comma-separated) | `Crew 1, Crew 2, Crew 3`                         |
| `notes`           | String | No       | Additional notes               | `Special requirements: LED lights`               |

## Example CSV Content

```csv
status,eventType,eventDate,clientName,agreedAmount,package,eventTime,ingress,expenses,location,mixerAndSpeaker,driver,crew,notes
confirmed,Wedding,2025-01-15,John and Jane Doe,25000,Full Package,2:00 PM,12:00 PM,3000,Trece Martires City,RCF Speakers,Juan Dela Cruz,Crew 1; Crew 2,Outdoor wedding with LED lights
pending,Birthday Party,2025-01-20,Maria Santos,15000,Sounds and Lights,6:00 PM,4:00 PM,1500,Dasmarinas City,Shure Mics,Pedro Santos,Crew 3,Indoor party
completed,Corporate Event,2025-01-10,ABC Company,50000,Full Package with Projector,9:00 AM,7:00 AM,5000,Makati City,Professional Setup,Driver 1,Crew 1; Crew 2; Crew 3,Conference setup required
```

## Important Notes

1. **All fields are optional** - You can leave fields empty if you don't have the data
2. **Date format** - Use YYYY-MM-DD format for dates
3. **Time format** - Use 12-hour or 24-hour format (e.g., "2:00 PM" or "14:00")
4. **Crew members** - Separate multiple crew members with semicolons (;) or commas (,)
5. **Numbers** - Don't include currency symbols or commas in number fields
6. **Status values** - Use: `pending`, `confirmed`, `completed`, or `cancelled`

## Import Process

1. Prepare your CSV file with the headers and data
2. Go to the Event Bookings page in the admin panel
3. Click the "Import" button
4. Select your CSV file
5. The system will process the file and import the bookings
6. You'll see a success message with the number of imported bookings

## Troubleshooting

- **Encoding issues**: Make sure your CSV file is saved in UTF-8 encoding
- **Date format errors**: Ensure dates are in YYYY-MM-DD format
- **Number format errors**: Remove currency symbols and commas from number fields
- **Missing data**: Empty fields are allowed and will be set to default values

## From Notion Export

If you're exporting from Notion:

1. Export your Notion database as CSV
2. Rename the columns to match the required headers above
3. Clean up any formatting issues (remove currency symbols, fix dates)
4. Import the cleaned CSV file
