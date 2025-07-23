'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Calendar,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Package,
  Music,
  Edit,
  Trash2,
  Eye,
  Filter,
  Search,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Combobox } from '@/components/ui/combobox'
import TagInput from '@/components/ui/tag-input'
import AmountCombobox from '@/components/ui/amount-combobox'

interface EventBooking {
  _id: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  eventType: string
  eventDate: string
  crew: string[]
  clientName: string
  agreedAmount: number
  package: string
  eventTime: string
  ingress: string
  expenses: number
  location: string
  mixerAndSpeaker: string
  notes: string
  createdAt: string
  updatedAt: string
}

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
}

const statusLabels = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export default function EventBookingsPage() {
  // Add custom styles for better form visibility
  useEffect(() => {
    const style = document.createElement('style')
    style.textContent = `
      .event-booking-dialog [data-radix-dialog-content] {
        background-color: hsl(var(--background)) !important;
        opacity: 1 !important;
      }
      .event-booking-dialog input,
      .event-booking-dialog select,
      .event-booking-dialog textarea {
        background-color: hsl(var(--background)) !important;
        border: 2px solid hsl(var(--border)) !important;
        opacity: 1 !important;
      }
      
      /* Remove number input spinners completely */
      input[type="text"][inputmode="numeric"]::-webkit-outer-spin-button,
      input[type="text"][inputmode="numeric"]::-webkit-inner-spin-button {
        -webkit-appearance: none !important;
        margin: 0 !important;
      }
      
      input[type="text"][inputmode="numeric"] {
        -moz-appearance: textfield !important;
        appearance: textfield !important;
      }
    `
    document.head.appendChild(style)
    return () => {
      document.head.removeChild(style)
    }
  }, [])
  const [bookings, setBookings] = useState<EventBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<EventBooking | null>(
    null,
  )
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [clients, setClients] = useState<string[]>([])
  const [packages, setPackages] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [equipment, setEquipment] = useState<string[]>([])
  const { toast } = useToast()

  // Form state
  const [formData, setFormData] = useState({
    status: 'pending',
    eventType: '',
    eventDate: '',
    crew: [] as string[],
    clientName: '',
    agreedAmount: '',
    package: '',
    eventTime: '',
    ingress: '',
    expenses: '',
    location: '',
    mixerAndSpeaker: '',
    notes: '',
  })

  // Separate state for date inputs to avoid conflicts
  const [monthInput, setMonthInput] = useState('')
  const [dayInput, setDayInput] = useState('')

  useEffect(() => {
    fetchBookings()
    fetchEventTypes()
    fetchClients()
    fetchPackages()
    fetchLocations()
    fetchEquipment()
  }, [filterStatus])

  const fetchBookings = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `/api/admin/event-bookings?status=${filterStatus}`,
      )
      const data = await response.json()

      if (data.success) {
        setBookings(data.data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch event bookings',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchEventTypes = async () => {
    try {
      const response = await fetch('/api/admin/event-types')
      const data = await response.json()

      if (data.success) {
        setEventTypes(data.data)
      }
    } catch (error) {
      console.error('Error fetching event types:', error)
    }
  }

  const addEventType = async (newType: string) => {
    try {
      const response = await fetch('/api/admin/event-types', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newType }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh event types list
        fetchEventTypes()
        toast({
          title: 'Success',
          description: `Event type "${newType}" added successfully`,
        })
      }
    } catch (error) {
      console.error('Error adding event type:', error)
      toast({
        title: 'Error',
        description: 'Failed to add event type',
        variant: 'destructive',
      })
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients')
      const data = await response.json()

      if (data.success) {
        setClients(data.data)
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
    }
  }

  const addClient = async (newClient: string) => {
    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newClient }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh clients list
        fetchClients()
        toast({
          title: 'Success',
          description: `Client "${newClient}" added successfully`,
        })
      }
    } catch (error) {
      console.error('Error adding client:', error)
      toast({
        title: 'Error',
        description: 'Failed to add client',
        variant: 'destructive',
      })
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/package-names')
      const data = await response.json()

      if (data.success) {
        setPackages(data.data)
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
    }
  }

  const addPackage = async (newPackage: string) => {
    try {
      const response = await fetch('/api/admin/package-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newPackage }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh packages list
        fetchPackages()
        toast({
          title: 'Success',
          description: `Package "${newPackage}" added successfully`,
        })
      }
    } catch (error) {
      console.error('Error adding package:', error)
      toast({
        title: 'Error',
        description: 'Failed to add package',
        variant: 'destructive',
      })
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/admin/locations')
      const data = await response.json()

      if (data.success) {
        setLocations(data.data)
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
    }
  }

  const addLocation = async (newLocation: string) => {
    try {
      const response = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newLocation }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh locations list
        fetchLocations()
        toast({
          title: 'Success',
          description: `Location "${newLocation}" added successfully`,
        })
      }
    } catch (error) {
      console.error('Error adding location:', error)
      toast({
        title: 'Error',
        description: 'Failed to add location',
        variant: 'destructive',
      })
    }
  }

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/admin/equipment-names')
      const data = await response.json()

      if (data.success) {
        setEquipment(data.data)
      }
    } catch (error) {
      console.error('Error fetching equipment:', error)
    }
  }

  const addEquipment = async (newEquipment: string) => {
    try {
      const response = await fetch('/api/admin/equipment-names', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newEquipment }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh equipment list
        fetchEquipment()
        toast({
          title: 'Success',
          description: `Equipment "${newEquipment}" added successfully`,
        })
      }
    } catch (error) {
      console.error('Error adding equipment:', error)
      toast({
        title: 'Error',
        description: 'Failed to add equipment',
        variant: 'destructive',
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const url = editingBooking
        ? `/api/admin/event-bookings/${editingBooking._id}`
        : '/api/admin/event-bookings'

      const method = editingBooking ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          agreedAmount: parseFloat(formData.agreedAmount),
          expenses: parseFloat(formData.expenses || '0'),
        }),
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: editingBooking
            ? 'Event booking updated successfully'
            : 'Event booking created successfully',
        })
        setIsDialogOpen(false)
        resetForm()
        fetchBookings()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error saving booking:', error)
      toast({
        title: 'Error',
        description: 'Failed to save event booking',
        variant: 'destructive',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking?')) return

    try {
      const response = await fetch(`/api/admin/event-bookings/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (data.success) {
        toast({
          title: 'Success',
          description: 'Event booking deleted successfully',
        })
        fetchBookings()
      } else {
        throw new Error(data.message)
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete event booking',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (booking: EventBooking) => {
    setEditingBooking(booking)
    const bookingDate = new Date(booking.eventDate)
    setFormData({
      status: booking.status,
      eventType: booking.eventType,
      eventDate: booking.eventDate,
      crew: booking.crew,
      clientName: booking.clientName,
      agreedAmount: booking.agreedAmount.toString(),
      package: booking.package,
      eventTime: booking.eventTime,
      ingress: booking.ingress,
      expenses: booking.expenses.toString(),
      location: booking.location,
      mixerAndSpeaker: booking.mixerAndSpeaker,
      notes: booking.notes,
    })
    setMonthInput((bookingDate.getMonth() + 1).toString())
    setDayInput(bookingDate.getDate().toString())
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      status: 'pending',
      eventType: '',
      eventDate: '',
      crew: [],
      clientName: '',
      agreedAmount: '',
      package: '',
      eventTime: '',
      ingress: '',
      expenses: '',
      location: '',
      mixerAndSpeaker: '',
      notes: '',
    })
    setMonthInput('')
    setDayInput('')
    setEditingBooking(null)
  }

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + booking.agreedAmount,
    0,
  )
  const totalExpenses = bookings.reduce(
    (sum, booking) => sum + booking.expenses,
    0,
  )
  const netProfit = totalRevenue - totalExpenses

  if (isLoading) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8'>
          <Skeleton className='h-8 w-64 mb-4' />
          <Skeleton className='h-4 w-96' />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className='h-32' />
          ))}
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className='h-64' />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className='container mx-auto px-4 py-8'>
      {/* Header */}
      <div className='mb-8'>
        <h1 className='text-3xl font-bold mb-2'>Event Bookings</h1>
        <p className='text-muted-foreground'>
          Manage all your event bookings and track your business performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-8'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Total Revenue</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-green-600'>
              ₱{totalRevenue.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>
              Total Expenses
            </CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold text-red-600'>
              ₱{totalExpenses.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>Net Profit</CardTitle>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                netProfit >= 0 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              ₱{netProfit.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className='flex flex-col sm:flex-row gap-4 mb-6'>
        <div className='flex-1'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input
              placeholder='Search bookings...'
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className='pl-10'
            />
          </div>
        </div>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className='w-full sm:w-48'>
            <SelectValue placeholder='Filter by status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Status</SelectItem>
            <SelectItem value='pending'>Pending</SelectItem>
            <SelectItem value='confirmed'>Confirmed</SelectItem>
            <SelectItem value='completed'>Completed</SelectItem>
            <SelectItem value='cancelled'>Cancelled</SelectItem>
          </SelectContent>
        </Select>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className='h-4 w-4 mr-2' />
              New Booking
            </Button>
          </DialogTrigger>
          <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto bg-black border-2 shadow-2xl'>
            <DialogHeader>
              <DialogTitle>
                {editingBooking ? 'Edit Event Booking' : 'New Event Booking'}
              </DialogTitle>
            </DialogHeader>

            <form onSubmit={handleSubmit} className='space-y-4 bg-background'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                <div className='bg-background'>
                  <Label htmlFor='status'>Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) =>
                      setFormData({
                        ...formData,
                        status: value as
                          | 'pending'
                          | 'confirmed'
                          | 'completed'
                          | 'cancelled',
                      })
                    }
                  >
                    <SelectTrigger className='bg-background border-2'>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className='bg-black border border-gray-600'>
                      <SelectItem value='pending'>Pending</SelectItem>
                      <SelectItem value='confirmed'>Confirmed</SelectItem>
                      <SelectItem value='completed'>Completed</SelectItem>
                      <SelectItem value='cancelled'>Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor='eventType'>Event Type</Label>
                  <Combobox
                    options={eventTypes}
                    value={formData.eventType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, eventType: value })
                    }
                    onAddNewOption={addEventType}
                    placeholder='Select or type event type...'
                    searchPlaceholder='Search event types...'
                    emptyText='No event types found. Type to add a new one.'
                    className='bg-background border-2'
                  />
                </div>

                <div>
                  <Label htmlFor='eventDate'>Event Date</Label>
                  <div className='flex gap-2'>
                    <Input
                      id='eventMonth'
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      placeholder='MM'
                      value={monthInput}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        setMonthInput(value)

                        if (value === '') {
                          setFormData({
                            ...formData,
                            eventDate: '',
                          })
                          return
                        }

                        const month = Math.min(
                          Math.max(parseInt(value) || 1, 1),
                          12,
                        )
                        const day = dayInput ? parseInt(dayInput) : 1
                        const year = new Date().getFullYear()
                        const newDate = new Date(year, month - 1, day)
                        setFormData({
                          ...formData,
                          eventDate: newDate.toISOString().split('T')[0],
                        })
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab' || e.key === 'Enter') {
                          e.preventDefault()
                          document.getElementById('eventDay')?.focus()
                        }
                      }}
                      className='w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'
                      required
                    />
                    <span className='flex items-center text-gray-400'>/</span>
                    <Input
                      id='eventDay'
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      placeholder='DD'
                      value={dayInput}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        setDayInput(value)

                        if (value === '') {
                          setFormData({
                            ...formData,
                            eventDate: '',
                          })
                          return
                        }

                        const day = Math.min(
                          Math.max(parseInt(value) || 1, 1),
                          31,
                        )
                        const month = monthInput ? parseInt(monthInput) : 1
                        const year = new Date().getFullYear()
                        const newDate = new Date(year, month - 1, day)
                        setFormData({
                          ...formData,
                          eventDate: newDate.toISOString().split('T')[0],
                        })
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab' || e.key === 'Enter') {
                          e.preventDefault()
                          document.getElementById('eventHour')?.focus()
                        }
                      }}
                      className='w-20 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'
                      required
                    />
                    <span className='flex items-center text-gray-400 text-sm'>
                      ({new Date().getFullYear()})
                    </span>
                  </div>
                </div>

                <div>
                  <Label htmlFor='eventTime'>Event Time</Label>
                  <div className='flex gap-2 items-center'>
                    <Input
                      id='eventHour'
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      placeholder='HH'
                      value={
                        formData.eventTime
                          ? parseInt(formData.eventTime.split(':')[0]) % 12 ||
                            12
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        if (value === '') {
                          setFormData({ ...formData, eventTime: '' })
                          return
                        }

                        const hour = Math.min(
                          Math.max(parseInt(value) || 12, 1),
                          12,
                        )
                        const minute = formData.eventTime
                          ? parseInt(formData.eventTime.split(':')[1])
                          : 0
                        const isPM = formData.eventTime
                          ? formData.eventTime.includes('PM')
                          : false
                        const newHour =
                          isPM && hour !== 12
                            ? hour + 12
                            : hour === 12 && !isPM
                            ? 0
                            : hour
                        const timeString = `${newHour
                          .toString()
                          .padStart(2, '0')}:${minute
                          .toString()
                          .padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`
                        setFormData({ ...formData, eventTime: timeString })
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Tab' ||
                          e.key === 'Enter' ||
                          e.key === ':'
                        ) {
                          e.preventDefault()
                          document.getElementById('eventMinute')?.focus()
                        }
                      }}
                      className='w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'
                      required
                    />
                    <span className='text-gray-400'>:</span>
                    <Input
                      id='eventMinute'
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      placeholder='MM'
                      value={
                        formData.eventTime
                          ? parseInt(formData.eventTime.split(':')[1])
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        if (value === '') {
                          setFormData({ ...formData, eventTime: '' })
                          return
                        }

                        const minute = Math.min(
                          Math.max(parseInt(value) || 0, 0),
                          59,
                        )
                        const hour = formData.eventTime
                          ? parseInt(formData.eventTime.split(':')[0]) % 12 ||
                            12
                          : 12
                        const isPM = formData.eventTime
                          ? formData.eventTime.includes('PM')
                          : false
                        const newHour =
                          isPM && hour !== 12
                            ? hour + 12
                            : hour === 12 && !isPM
                            ? 0
                            : hour
                        const timeString = `${newHour
                          .toString()
                          .padStart(2, '0')}:${minute
                          .toString()
                          .padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`
                        setFormData({ ...formData, eventTime: timeString })
                      }}
                      className='w-16 text-center'
                      required
                    />
                    <div className='flex border border-gray-600 rounded-md overflow-hidden'>
                      <button
                        type='button'
                        onClick={() => {
                          const hour = formData.eventTime
                            ? parseInt(formData.eventTime.split(':')[0]) % 12 ||
                              12
                            : 12
                          const minute = formData.eventTime
                            ? parseInt(formData.eventTime.split(':')[1])
                            : 0
                          const timeString = `${hour
                            .toString()
                            .padStart(2, '0')}:${minute
                            .toString()
                            .padStart(2, '0')} AM`
                          setFormData({ ...formData, eventTime: timeString })
                        }}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          formData.eventTime &&
                          formData.eventTime.includes('AM')
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type='button'
                        onClick={() => {
                          const hour = formData.eventTime
                            ? parseInt(formData.eventTime.split(':')[0]) % 12 ||
                              12
                            : 12
                          const minute = formData.eventTime
                            ? parseInt(formData.eventTime.split(':')[1])
                            : 0
                          const newHour = hour === 12 ? 12 : hour + 12
                          const timeString = `${newHour
                            .toString()
                            .padStart(2, '0')}:${minute
                            .toString()
                            .padStart(2, '0')} PM`
                          setFormData({ ...formData, eventTime: timeString })
                        }}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          formData.eventTime &&
                          formData.eventTime.includes('PM')
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor='clientName'>Client Name</Label>
                  <Combobox
                    options={clients}
                    value={formData.clientName}
                    onValueChange={(value) =>
                      setFormData({ ...formData, clientName: value })
                    }
                    onAddNewOption={addClient}
                    placeholder='Select or type client name...'
                    searchPlaceholder='Search clients...'
                    emptyText='No clients found. Type to add a new one.'
                    className='bg-background border-2'
                  />
                </div>

                <div>
                  <AmountCombobox
                    id='agreedAmount'
                    label='Agreed Amount (₱)'
                    value={formData.agreedAmount}
                    onValueChange={(value) =>
                      setFormData({ ...formData, agreedAmount: value })
                    }
                    placeholder='Select or add amount...'
                  />
                </div>

                <div>
                  <Label htmlFor='package'>Package</Label>
                  <Combobox
                    options={packages}
                    value={formData.package}
                    onValueChange={(value) =>
                      setFormData({ ...formData, package: value })
                    }
                    onAddNewOption={addPackage}
                    placeholder='Select or type package name...'
                    searchPlaceholder='Search packages...'
                    emptyText='No packages found. Type to add a new one.'
                    className='bg-background border-2'
                  />
                </div>

                <div>
                  <Label htmlFor='ingress'>Ingress</Label>
                  <div className='flex gap-2 items-center'>
                    <Input
                      id='ingressHour'
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      placeholder='HH'
                      value={
                        formData.ingress
                          ? parseInt(formData.ingress.split(':')[0]) % 12 || 12
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        if (value === '') {
                          setFormData({ ...formData, ingress: '' })
                          return
                        }

                        const hour = Math.min(
                          Math.max(parseInt(value) || 12, 1),
                          12,
                        )
                        const minute = formData.ingress
                          ? parseInt(formData.ingress.split(':')[1])
                          : 0
                        const isPM = formData.ingress
                          ? formData.ingress.includes('PM')
                          : false
                        const newHour =
                          isPM && hour !== 12
                            ? hour + 12
                            : hour === 12 && !isPM
                            ? 0
                            : hour
                        const timeString = `${newHour
                          .toString()
                          .padStart(2, '0')}:${minute
                          .toString()
                          .padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`
                        setFormData({ ...formData, ingress: timeString })
                      }}
                      onKeyDown={(e) => {
                        if (
                          e.key === 'Tab' ||
                          e.key === 'Enter' ||
                          e.key === ':'
                        ) {
                          e.preventDefault()
                          document.getElementById('ingressMinute')?.focus()
                        }
                      }}
                      className='w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'
                      required
                    />
                    <span className='text-gray-400'>:</span>
                    <Input
                      id='ingressMinute'
                      type='text'
                      inputMode='numeric'
                      pattern='[0-9]*'
                      placeholder='MM'
                      value={
                        formData.ingress
                          ? parseInt(formData.ingress.split(':')[1])
                          : ''
                      }
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        if (value === '') {
                          setFormData({ ...formData, ingress: '' })
                          return
                        }

                        const minute = Math.min(
                          Math.max(parseInt(value) || 0, 0),
                          59,
                        )
                        const hour = formData.ingress
                          ? parseInt(formData.ingress.split(':')[0]) % 12 || 12
                          : 12
                        const isPM = formData.ingress
                          ? formData.ingress.includes('PM')
                          : false
                        const newHour =
                          isPM && hour !== 12
                            ? hour + 12
                            : hour === 12 && !isPM
                            ? 0
                            : hour
                        const timeString = `${newHour
                          .toString()
                          .padStart(2, '0')}:${minute
                          .toString()
                          .padStart(2, '0')} ${isPM ? 'PM' : 'AM'}`
                        setFormData({ ...formData, ingress: timeString })
                      }}
                      className='w-16 text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [-moz-appearance:textfield]'
                      required
                    />
                    <div className='flex border border-gray-600 rounded-md overflow-hidden'>
                      <button
                        type='button'
                        onClick={() => {
                          const hour = formData.ingress
                            ? parseInt(formData.ingress.split(':')[0]) % 12 ||
                              12
                            : 12
                          const minute = formData.ingress
                            ? parseInt(formData.ingress.split(':')[1])
                            : 0
                          const timeString = `${hour
                            .toString()
                            .padStart(2, '0')}:${minute
                            .toString()
                            .padStart(2, '0')} AM`
                          setFormData({ ...formData, ingress: timeString })
                        }}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          formData.ingress && formData.ingress.includes('AM')
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        AM
                      </button>
                      <button
                        type='button'
                        onClick={() => {
                          const hour = formData.ingress
                            ? parseInt(formData.ingress.split(':')[0]) % 12 ||
                              12
                            : 12
                          const minute = formData.ingress
                            ? parseInt(formData.ingress.split(':')[1])
                            : 0
                          const newHour = hour === 12 ? 12 : hour + 12
                          const timeString = `${newHour
                            .toString()
                            .padStart(2, '0')}:${minute
                            .toString()
                            .padStart(2, '0')} PM`
                          setFormData({ ...formData, ingress: timeString })
                        }}
                        className={`px-3 py-2 text-sm font-medium transition-colors ${
                          formData.ingress && formData.ingress.includes('PM')
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                        }`}
                      >
                        PM
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <AmountCombobox
                    id='expenses'
                    label='Expenses (₱)'
                    value={formData.expenses}
                    onValueChange={(value) =>
                      setFormData({ ...formData, expenses: value })
                    }
                    placeholder='Select or add expense amount...'
                  />
                </div>

                <div className='md:col-span-2'>
                  <Label htmlFor='location'>Location</Label>
                  <Combobox
                    options={locations}
                    value={formData.location}
                    onValueChange={(value) =>
                      setFormData({ ...formData, location: value })
                    }
                    onAddNewOption={addLocation}
                    placeholder='Select or type location...'
                    searchPlaceholder='Search locations...'
                    emptyText='No locations found. Type to add a new one.'
                    className='bg-background border-2'
                  />
                </div>

                <div className='md:col-span-2'>
                  <Label htmlFor='mixerAndSpeaker'>Mixer and Speaker</Label>
                  <Combobox
                    options={equipment}
                    value={formData.mixerAndSpeaker}
                    onValueChange={(value) =>
                      setFormData({ ...formData, mixerAndSpeaker: value })
                    }
                    onAddNewOption={addEquipment}
                    placeholder='Select or type equipment...'
                    searchPlaceholder='Search equipment...'
                    emptyText='No equipment found. Type to add a new one.'
                    className='bg-background border-2'
                  />
                </div>

                <div className='md:col-span-2'>
                  <TagInput
                    id='crew'
                    label='Crew Members'
                    value={formData.crew}
                    onChange={(crew) => setFormData({ ...formData, crew })}
                    placeholder='Type crew member name and press Enter...'
                  />
                </div>

                <div className='md:col-span-2'>
                  <Label htmlFor='notes'>Notes</Label>
                  <Textarea
                    id='notes'
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    placeholder='Additional notes...'
                    rows={3}
                  />
                </div>
              </div>

              <div className='flex justify-end space-x-2 pt-4'>
                <Button
                  type='button'
                  variant='outline'
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type='submit'>
                  {editingBooking ? 'Update Booking' : 'Create Booking'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Bookings Grid */}
      <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
        {filteredBookings.map((booking) => (
          <Card key={booking._id} className='hover:shadow-lg transition-shadow'>
            <CardHeader>
              <div className='flex items-center justify-between'>
                <CardTitle className='text-lg'>{booking.clientName}</CardTitle>
                <Badge className={statusColors[booking.status]}>
                  {statusLabels[booking.status]}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='grid grid-cols-1 sm:grid-cols-2 gap-3'>
                <div className='flex items-center space-x-2 text-sm'>
                  <Music className='h-4 w-4 text-muted-foreground' />
                  <span>{booking.eventType}</span>
                </div>

                <div className='flex items-center space-x-2 text-sm'>
                  <Calendar className='h-4 w-4 text-muted-foreground' />
                  <span>
                    {new Date(booking.eventDate).toLocaleDateString()}
                  </span>
                </div>

                <div className='flex items-center space-x-2 text-sm'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <span>Event Start: {booking.eventTime}</span>
                </div>

                <div className='flex items-center space-x-2 text-sm'>
                  <Clock className='h-4 w-4 text-muted-foreground' />
                  <span>Ingress: {booking.ingress}</span>
                </div>

                <div className='flex items-center space-x-2 text-sm'>
                  <MapPin className='h-4 w-4 text-muted-foreground' />
                  <span className='truncate'>{booking.location}</span>
                </div>

                <div className='flex items-center space-x-2 text-sm'>
                  <Package className='h-4 w-4 text-muted-foreground' />
                  <span className='truncate'>{booking.package}</span>
                </div>

                {booking.mixerAndSpeaker && (
                  <div className='flex items-center space-x-2 text-sm'>
                    <Music className='h-4 w-4 text-muted-foreground' />
                    <span className='truncate text-xs'>
                      {booking.mixerAndSpeaker}
                    </span>
                  </div>
                )}

                <div className='flex items-center space-x-2 text-sm'>
                  <DollarSign className='h-4 w-4 text-muted-foreground' />
                  <span className='font-semibold text-green-600'>
                    Agreed: ₱{booking.agreedAmount.toLocaleString()}
                  </span>
                </div>

                {booking.expenses > 0 && (
                  <div className='flex items-center space-x-2 text-sm'>
                    <DollarSign className='h-4 w-4 text-muted-foreground' />
                    <span className='font-semibold text-orange-600'>
                      Expenses: ₱{booking.expenses.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              {booking.crew.length > 0 && (
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2 text-sm'>
                    <Users className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm font-medium'>Crew:</span>
                  </div>
                  <div className='flex flex-wrap gap-1'>
                    {booking.crew.map((member, index) => (
                      <Badge
                        key={index}
                        variant='outline'
                        className='text-xs px-2 py-1'
                      >
                        {member}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {booking.notes && (
                <div className='space-y-2'>
                  <div className='flex items-center space-x-2 text-sm'>
                    <FileText className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm font-medium'>Notes:</span>
                  </div>
                  <p className='text-sm text-muted-foreground bg-muted/50 p-2 rounded-md'>
                    {booking.notes}
                  </p>
                </div>
              )}

              <div className='flex items-center space-x-2 text-xs text-muted-foreground pt-2 border-t'>
                <Calendar className='h-3 w-3' />
                <span>
                  Created: {new Date(booking.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className='flex justify-end space-x-2 pt-2'>
                <Button
                  size='sm'
                  variant='outline'
                  onClick={() => handleEdit(booking)}
                >
                  <Edit className='h-4 w-4' />
                </Button>
                <Button
                  size='sm'
                  variant='destructive'
                  onClick={() => handleDelete(booking._id)}
                >
                  <Trash2 className='h-4 w-4' />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBookings.length === 0 && !isLoading && (
        <div className='text-center py-12'>
          <Music className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
          <h3 className='text-lg font-semibold mb-2'>No bookings found</h3>
          <p className='text-muted-foreground'>
            {searchTerm || filterStatus !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first event booking to get started'}
          </p>
        </div>
      )}
    </div>
  )
}
