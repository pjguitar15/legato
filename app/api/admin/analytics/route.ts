import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import EventBooking from '@/models/EventBooking'
import { verifyAuthRequest } from '@/lib/auth-server'

// GET - Fetch analytics data
export async function GET(request: NextRequest) {
  try {
    const authResult = await verifyAuthRequest(request)
    if (!authResult) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 },
      )
    }

    await connectToDatabase()

    // Get all bookings
    const bookings = await EventBooking.find({}).lean()

    // Calculate basic stats
    const totalBookings = bookings.length
    const totalRevenue = bookings.reduce(
      (sum, booking) => sum + (booking.agreedAmount || 0),
      0,
    )
    const totalExpenses = bookings.reduce(
      (sum, booking) => sum + (booking.expenses || 0),
      0,
    )
    const netProfit = totalRevenue - totalExpenses

    // Status distribution
    const statusStats = bookings.reduce((acc, booking) => {
      const status = booking.status || 'pending'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    // Convert statusStats to array format for frontend
    const statusDistribution = Object.entries(statusStats).map(
      ([status, count]) => ({
        status: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize first letter
        count,
      }),
    )

    // Monthly revenue for the last 12 months
    const monthlyRevenue = []
    const currentDate = new Date()
    for (let i = 11; i >= 0; i--) {
      const date = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - i,
        1,
      )
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthBookings = bookings.filter((booking) => {
        const bookingDate = new Date(booking.eventDate)
        return bookingDate >= monthStart && bookingDate <= monthEnd
      })

      const monthRevenue = monthBookings.reduce(
        (sum, booking) => sum + (booking.agreedAmount || 0),
        0,
      )

      monthlyRevenue.push({
        month: date.toLocaleDateString('en-US', {
          month: 'short',
          year: 'numeric',
        }),
        revenue: monthRevenue,
        bookings: monthBookings.length,
      })
    }

    // Top clients by revenue
    const clientRevenue = bookings.reduce((acc, booking) => {
      const client = booking.clientName || 'Unknown'
      acc[client] = (acc[client] || 0) + (booking.agreedAmount || 0)
      return acc
    }, {} as Record<string, number>)

    const topClients = Object.entries(clientRevenue)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([client, revenue]) => ({ client, revenue }))

    // Top event types
    const eventTypeStats = bookings.reduce((acc, booking) => {
      const eventType = booking.eventType || 'Unknown'
      acc[eventType] = (acc[eventType] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topEventTypes = Object.entries(eventTypeStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([eventType, count]) => ({ eventType, count }))

    // Crew statistics
    const allCrew = bookings.flatMap((booking) => booking.crew || [])
    const crewStats = allCrew.reduce((acc, crew) => {
      acc[crew] = (acc[crew] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topCrew = Object.entries(crewStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([crew, count]) => ({ crew, count }))

    // Driver statistics
    const driverStats = bookings.reduce((acc, booking) => {
      const driver = booking.driver || 'Unknown'
      acc[driver] = (acc[driver] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const topDrivers = Object.entries(driverStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([driver, count]) => ({ driver, count }))

    // Recent activity (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const recentBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.createdAt)
      return bookingDate >= thirtyDaysAgo
    })

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalBookings,
          totalRevenue,
          totalExpenses,
          netProfit,
          recentBookings: recentBookings.length,
        },
        statusDistribution,
        monthlyRevenue,
        topClients,
        topEventTypes,
        topCrew,
        topDrivers,
        recentActivity: recentBookings.slice(0, 10).map((booking) => ({
          id: booking._id,
          clientName: booking.clientName,
          eventType: booking.eventType,
          eventDate: booking.eventDate,
          status: booking.status,
          agreedAmount: booking.agreedAmount,
        })),
      },
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics' },
      { status: 500 },
    )
  }
}
