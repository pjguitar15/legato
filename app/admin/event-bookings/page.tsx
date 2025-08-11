'use client'

import { useState, useEffect } from 'react'
import {
  Plus,
  Calendar,
  ChevronUp,
  Clock,
  MapPin,
  Users,
  DollarSign,
  Package,
  Music,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Filter,
  Search,
  FileText,
  Grid3X3,
  List,
  BarChart3,
  Upload,
  Car,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar, Doughnut, Line } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
)

// Consistent chart colors per booking status
const chartStatusColor: Record<string, string> = {
  completed: '#10b981', // green
  pending: '#fbbf24', // yellow
  confirmed: '#3b82f6', // blue
  cancelled: '#ef4444', // red
}

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
  driver: string
  notes: string
  createdAt: string
  updatedAt: string
}

interface AnalyticsData {
  overview: {
    totalBookings: number
    totalRevenue: number
    totalExpenses: number
    netProfit: number
  }
  statusDistribution: { status: string; count: number }[]
  monthlyRevenue: { month: string; revenue: number }[]
  topClients: { client: string; revenue: number }[]
  topEventTypes: { eventType: string; count: number }[]
  topCrew: { crew: string; count: number }[]
  topDrivers: { driver: string; count: number }[]
  recentActivity: {
    clientName: string
    eventType: string
    eventDate: string
    agreedAmount: number
  }[]
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
  const [bookings, setBookings] = useState<EventBooking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingBooking, setEditingBooking] = useState<EventBooking | null>(
    null,
  )
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  // Show ALL by default; user can hide via toggles
  const [hideCompleted, setHideCompleted] = useState(false)
  const [hideCancelled, setHideCancelled] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [sortBy, setSortBy] = useState<string>('eventDate')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isAnalyticsLoading, setIsAnalyticsLoading] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const [importProgress, setImportProgress] = useState<string>('')
  const [drivers, setDrivers] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [clients, setClients] = useState<string[]>([])
  const [eventTypes, setEventTypes] = useState<string[]>([])
  const [packages, setPackages] = useState<string[]>([])
  const [locations, setLocations] = useState<string[]>([])
  const [equipment, setEquipment] = useState<string[]>([])
  const [timeOptions, setTimeOptions] = useState<string[]>([])
  const [amountOptions, setAmountOptions] = useState<string[]>([])
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
    driver: '',
    notes: '',
  })

  useEffect(() => {
    fetchBookings(1, false)
    fetchDrivers()
    fetchClients()
    fetchEventTypes()
    fetchPackages()
    fetchLocations()
    fetchEquipment()
    fetchTimeOptions()
    fetchAmountOptions()
    updatePastEvents() // Update past events in database
  }, [filterStatus, hideCompleted, hideCancelled])

  const fetchBookings = async (page = 1, append = false) => {
    try {
      if (page === 1) {
        setIsLoading(true)
      } else {
        setIsLoadingMore(true)
      }

      const params = new URLSearchParams({
        status: filterStatus,
        hideCompleted: hideCompleted.toString(),
        hideCancelled: hideCancelled.toString(),
        page: page.toString(),
        limit: '20',
      })
      const response = await fetch(`/api/admin/event-bookings?${params}`)
      const data = await response.json()

      if (data.success) {
        if (append) {
          setBookings((prev) => [...prev, ...data.data])
        } else {
          setBookings(data.data)
        }
        setCurrentPage(page)
        setHasMore(data.pagination.hasMore)
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
      setIsLoadingMore(false)
    }
  }

  const updatePastEvents = async () => {
    try {
      const response = await fetch(
        '/api/admin/event-bookings/update-past-events',
        {
          method: 'POST',
        },
      )
      const data = await response.json()
      if (data.success && data.updatedCount > 0) {
        console.log(`Updated ${data.updatedCount} past events to completed`)
        // Refresh bookings to show updated statuses
        await fetchBookings()
      }
    } catch (error) {
      console.error('Error updating past events:', error)
    }
  }

  const fetchDrivers = async () => {
    try {
      const response = await fetch('/api/admin/drivers')
      const data = await response.json()
      if (data.success) {
        setDrivers(data.data || [])
      } else {
        setDrivers([]) // Set empty array as fallback
      }
    } catch (error) {
      console.error('Error fetching drivers:', error)
      setDrivers([]) // Set empty array as fallback
    }
  }

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients')
      const data = await response.json()
      if (data.success) {
        setClients(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching clients:', error)
      setClients([])
    }
  }

  const fetchEventTypes = async () => {
    try {
      const response = await fetch('/api/admin/event-types')
      const data = await response.json()
      if (data.success) {
        setEventTypes(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching event types:', error)
      setEventTypes([])
    }
  }

  const fetchPackages = async () => {
    try {
      const response = await fetch('/api/admin/package-names')
      const data = await response.json()
      if (data.success) {
        setPackages(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching packages:', error)
      setPackages([])
    }
  }

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/admin/locations')
      const data = await response.json()
      if (data.success) {
        setLocations(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching locations:', error)
      setLocations([])
    }
  }

  const fetchEquipment = async () => {
    try {
      const response = await fetch('/api/admin/equipment-names')
      const data = await response.json()
      if (data.success) {
        setEquipment(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching equipment:', error)
      setEquipment([])
    }
  }

  const fetchTimeOptions = async () => {
    try {
      const response = await fetch('/api/admin/time-options')
      const data = await response.json()
      if (data.success) {
        setTimeOptions(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching time options:', error)
      setTimeOptions([])
    }
  }

  const fetchAmountOptions = async () => {
    try {
      const response = await fetch('/api/admin/amount-options')
      const data = await response.json()
      if (data.success) {
        setAmountOptions(data.data || [])
      }
    } catch (error) {
      console.error('Error fetching amount options:', error)
      setAmountOptions([])
    }
  }

  const addDriver = async (newDriver: string) => {
    try {
      const response = await fetch('/api/admin/drivers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newDriver }),
      })
      const data = await response.json()
      if (data.success) {
        setDrivers([...drivers, newDriver])
        toast({
          title: 'Success',
          description: 'Driver added successfully',
        })
      }
    } catch (error) {
      console.error('Error adding driver:', error)
      toast({
        title: 'Error',
        description: 'Failed to add driver',
        variant: 'destructive',
      })
    }
  }

  const addClient = async (newClient: string) => {
    try {
      const response = await fetch('/api/admin/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newClient }),
      })
      const data = await response.json()
      if (data.success) {
        setClients([...clients, newClient])
        toast({
          title: 'Success',
          description: 'Client added successfully',
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

  const addEventType = async (newEventType: string) => {
    try {
      const response = await fetch('/api/admin/event-types', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newEventType }),
      })
      const data = await response.json()
      if (data.success) {
        setEventTypes([...eventTypes, newEventType])
        toast({
          title: 'Success',
          description: 'Event type added successfully',
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

  const addPackage = async (newPackage: string) => {
    try {
      const response = await fetch('/api/admin/package-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newPackage }),
      })
      const data = await response.json()
      if (data.success) {
        setPackages([...packages, newPackage])
        toast({
          title: 'Success',
          description: 'Package added successfully',
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

  const addLocation = async (newLocation: string) => {
    try {
      const response = await fetch('/api/admin/locations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newLocation }),
      })
      const data = await response.json()
      if (data.success) {
        setLocations([...locations, newLocation])
        toast({
          title: 'Success',
          description: 'Location added successfully',
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

  const addEquipment = async (newEquipment: string) => {
    try {
      const response = await fetch('/api/admin/equipment-names', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newEquipment }),
      })
      const data = await response.json()
      if (data.success) {
        setEquipment([...equipment, newEquipment])
        toast({
          title: 'Success',
          description: 'Equipment added successfully',
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

  const addTimeOption = async (newTime: string) => {
    try {
      const response = await fetch('/api/admin/time-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newTime }),
      })
      const data = await response.json()
      if (data.success) {
        setTimeOptions([...timeOptions, newTime])
        toast({
          title: 'Success',
          description: 'Time option added successfully',
        })
      }
    } catch (error) {
      console.error('Error adding time option:', error)
      toast({
        title: 'Error',
        description: 'Failed to add time option',
        variant: 'destructive',
      })
    }
  }

  const addAmountOption = async (newAmount: string) => {
    try {
      const response = await fetch('/api/admin/amount-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newAmount }),
      })
      const data = await response.json()
      if (data.success) {
        setAmountOptions([...amountOptions, newAmount])
        toast({
          title: 'Success',
          description: 'Amount option added successfully',
        })
      }
    } catch (error) {
      console.error('Error adding amount option:', error)
      toast({
        title: 'Error',
        description: 'Failed to add amount option',
        variant: 'destructive',
      })
    }
  }

  const fetchAnalytics = async () => {
    try {
      setIsAnalyticsLoading(true)
      const response = await fetch('/api/admin/analytics')
      const data = await response.json()
      if (data.success) {
        setAnalyticsData(data.data)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch analytics data',
        variant: 'destructive',
      })
    } finally {
      setIsAnalyticsLoading(false)
    }
  }

  const handleFileImport = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    setIsImporting(true)
    setImportProgress('Uploading file...')
    try {
      const formData = new FormData()
      formData.append('file', file)

      setImportProgress('Processing CSV data...')
      const response = await fetch('/api/admin/import-bookings', {
        method: 'POST',
        body: formData,
      })

      setImportProgress('Saving to database...')
      const data = await response.json()
      if (data.success) {
        let description = `Imported ${data.importedCount} bookings successfully`
        if (data.skippedCount > 0) {
          description += ` (skipped ${data.skippedCount} duplicates)`
        }
        if (data.errorCount > 0) {
          description += ` (${data.errorCount} errors)`
        }

        toast({
          title: 'Success',
          description,
        })
        fetchBookings()
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to import bookings',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error importing file:', error)
      toast({
        title: 'Error',
        description: 'Failed to import file',
        variant: 'destructive',
      })
    } finally {
      setIsImporting(false)
      setImportProgress('')
    }

    // Reset file input
    event.target.value = ''
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const bookingData = {
        ...formData,
        agreedAmount: parseFloat(formData.agreedAmount) || 0,
        expenses: parseFloat(formData.expenses) || 0,
      }

      const url = editingBooking
        ? `/api/admin/event-bookings/${editingBooking._id}`
        : '/api/admin/event-bookings'
      const method = editingBooking ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData),
      })

      const data = await response.json()
      if (data.success) {
        toast({
          title: 'Success',
          description: editingBooking
            ? 'Booking updated successfully'
            : 'Booking created successfully',
        })
        setIsDialogOpen(false)
        resetForm()
        fetchBookings()
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to save booking',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error saving booking:', error)
      toast({
        title: 'Error',
        description: 'Failed to save booking',
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
          description: 'Booking deleted successfully',
        })
        fetchBookings()
      } else {
        toast({
          title: 'Error',
          description: data.message || 'Failed to delete booking',
          variant: 'destructive',
        })
      }
    } catch (error) {
      console.error('Error deleting booking:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete booking',
        variant: 'destructive',
      })
    }
  }

  const handleEdit = (booking: EventBooking) => {
    setEditingBooking(booking)
    setFormData({
      status: booking.status,
      eventType: booking.eventType,
      eventDate: booking.eventDate.split('T')[0],
      crew: booking.crew,
      clientName: booking.clientName,
      agreedAmount: booking.agreedAmount.toString(),
      package: booking.package,
      eventTime: booking.eventTime,
      ingress: booking.ingress,
      expenses: booking.expenses.toString(),
      location: booking.location,
      mixerAndSpeaker: booking.mixerAndSpeaker,
      driver: booking.driver,
      notes: booking.notes,
    })
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
      driver: '',
      notes: '',
    })
    setEditingBooking(null)
  }

  const loadMore = () => {
    if (hasMore && !isLoadingMore) {
      fetchBookings(currentPage + 1, true)
    }
  }

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Handle scroll to show/hide scroll to top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300)
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200
      if (nearBottom && hasMore && !isLoadingMore && !isLoading) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isLoadingMore, isLoading, currentPage])

  // Filter and sort bookings
  const filteredBookings = bookings
    .filter((booking) => {
      const matchesSearch = booking.clientName
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
      const matchesStatus =
        filterStatus === 'all' || booking.status === filterStatus
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let aValue: any
      let bValue: any

      switch (sortBy) {
        case 'eventDate':
          aValue = new Date(a.eventDate)
          bValue = new Date(b.eventDate)
          break
        case 'createdAt':
          aValue = new Date(a.createdAt)
          bValue = new Date(b.createdAt)
          break
        case 'clientName':
          aValue = a.clientName.toLowerCase()
          bValue = b.clientName.toLowerCase()
          break
        case 'agreedAmount':
          aValue = a.agreedAmount
          bValue = b.agreedAmount
          break
        default:
          aValue = new Date(a.eventDate)
          bValue = new Date(b.eventDate)
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

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

      <Tabs
        defaultValue='bookings'
        className='w-full'
        onValueChange={(value) => {
          if (value === 'analytics') {
            fetchAnalytics()
          }
        }}
      >
        <TabsList className='flex w-full bg-background border border-border p-1 rounded-lg gap-1 shadow-sm'>
          <TabsTrigger
            value='bookings'
            className='flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-200 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:ring-2 data-[state=active]:ring-primary/20 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground flex-1 font-medium'
          >
            <Calendar className='h-4 w-4' />
            <span>Bookings</span>
          </TabsTrigger>
          <TabsTrigger
            value='analytics'
            className='flex items-center gap-2 px-6 py-3 rounded-md transition-all duration-200 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg data-[state=active]:ring-2 data-[state=active]:ring-primary/20 data-[state=inactive]:text-muted-foreground data-[state=inactive]:hover:bg-muted data-[state=inactive]:hover:text-foreground flex-1 font-medium'
          >
            <BarChart3 className='h-4 w-4' />
            <span>Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value='bookings' className='space-y-6'>
          {/* Controls */}
          <div className='flex items-center gap-3 mb-6 flex-wrap'>
            {/* Search Bar with Animation */}
            <div
              className={`transition-all duration-300 ease-in-out ${
                isSearchFocused ? 'w-80' : 'w-64'
              }`}
            >
              <div className='relative'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
                <Input
                  placeholder='Search bookings...'
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className='pl-10 transition-all duration-300'
                />
              </div>
            </div>

            {/* Filter Controls */}
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className='w-40 bg-background border-border shadow-sm'>
                <SelectValue placeholder='Status' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Status</SelectItem>
                <SelectItem value='pending'>Pending</SelectItem>
                <SelectItem value='confirmed'>Confirmed</SelectItem>
                <SelectItem value='completed'>Completed</SelectItem>
                <SelectItem value='cancelled'>Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant={hideCompleted ? 'default' : 'outline'}
              onClick={() => setHideCompleted(!hideCompleted)}
              size='sm'
              className={`transition-all duration-200 ${
                hideCompleted
                  ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/20'
                  : 'bg-background border-border hover:bg-muted'
              }`}
              title={hideCompleted ? 'Show Completed' : 'Hide Completed'}
            >
              <EyeOff className='h-4 w-4' />
            </Button>

            <Button
              variant={hideCancelled ? 'default' : 'outline'}
              onClick={() => setHideCancelled(!hideCancelled)}
              size='sm'
              className={`transition-all duration-200 ${
                hideCancelled
                  ? 'bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/20'
                  : 'bg-background border-border hover:bg-muted'
              }`}
              title={hideCancelled ? 'Show Cancelled' : 'Hide Cancelled'}
            >
              <EyeOff className='h-4 w-4' />
            </Button>

            {/* Sort Controls */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className='w-32 bg-background border-border shadow-sm'>
                <SelectValue placeholder='Sort' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='createdAt'>Created Date</SelectItem>
                <SelectItem value='eventDate'>Event Date</SelectItem>
                <SelectItem value='clientName'>Client Name</SelectItem>
                <SelectItem value='agreedAmount'>Amount</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={sortOrder}
              onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}
            >
              <SelectTrigger className='w-24 bg-background border-border shadow-sm'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='asc'>Closest</SelectItem>
                <SelectItem value='desc'>Farthest</SelectItem>
              </SelectContent>
            </Select>

            {/* View Toggles and Actions */}
            <div className='flex gap-1 bg-background border border-border rounded-md p-1 shadow-sm'>
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                onClick={() => setViewMode('grid')}
                size='sm'
                className='h-8 w-8 p-0'
                title='Grid View'
              >
                <Grid3X3 className='h-4 w-4' />
              </Button>
              <Button
                variant={viewMode === 'table' ? 'default' : 'ghost'}
                onClick={() => setViewMode('table')}
                size='sm'
                className='h-8 w-8 p-0'
                title='Table View'
              >
                <List className='h-4 w-4' />
              </Button>
            </div>

            <div className='relative'>
              <input
                type='file'
                accept='.csv,.xlsx,.xls'
                onChange={handleFileImport}
                className='hidden'
                id='file-import'
              />
              <Button
                variant='outline'
                onClick={() => document.getElementById('file-import')?.click()}
                size='sm'
                disabled={isImporting}
                className='bg-background border-border shadow-sm hover:bg-muted transition-all duration-200'
                title='Import CSV/Excel'
              >
                {isImporting ? (
                  <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current' />
                ) : (
                  <Upload className='h-4 w-4' />
                )}
              </Button>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={() => resetForm()}
                  className='bg-primary text-primary-foreground shadow-lg ring-2 ring-primary/20 hover:bg-primary/90 transition-all duration-200'
                  title='Add New Booking'
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </DialogTrigger>
              <DialogContent className='max-w-2xl max-h-[90vh] overflow-y-auto'>
                <DialogHeader>
                  <DialogTitle>
                    {editingBooking
                      ? 'Edit Event Booking'
                      : 'New Event Booking'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className='space-y-4'>
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    <div>
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
                        <SelectTrigger className='bg-black'>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='pending'>Pending</SelectItem>
                          <SelectItem value='confirmed'>Confirmed</SelectItem>
                          <SelectItem value='completed'>Completed</SelectItem>
                          <SelectItem value='cancelled'>Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor='clientName'>Client Name</Label>
                      <Combobox
                        options={clients || []}
                        value={formData.clientName}
                        onValueChange={(value) =>
                          setFormData({ ...formData, clientName: value })
                        }
                        onAddNewOption={addClient}
                        placeholder='Select or add client...'
                      />
                    </div>

                    <div>
                      <Label htmlFor='eventType'>Event Type</Label>
                      <Combobox
                        options={eventTypes || []}
                        value={formData.eventType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, eventType: value })
                        }
                        onAddNewOption={addEventType}
                        placeholder='Select or add event type...'
                      />
                    </div>

                    <div>
                      <Label htmlFor='eventDate'>Event Date</Label>
                      <Input
                        id='eventDate'
                        type='date'
                        value={formData.eventDate}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            eventDate: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor='eventTime'>Event Time</Label>
                      <Combobox
                        options={timeOptions}
                        value={formData.eventTime}
                        onValueChange={(value) =>
                          setFormData({ ...formData, eventTime: value })
                        }
                        onAddNewOption={addTimeOption}
                        placeholder='Type time (e.g., 2PM, 3:30PM)...'
                      />
                    </div>

                    <div>
                      <Label htmlFor='ingress'>Ingress</Label>
                      <Combobox
                        options={timeOptions}
                        value={formData.ingress}
                        onValueChange={(value) =>
                          setFormData({ ...formData, ingress: value })
                        }
                        onAddNewOption={addTimeOption}
                        placeholder='Type time (e.g., 2PM, 3:30PM)...'
                      />
                    </div>

                    <div>
                      <Label htmlFor='location'>Location</Label>
                      <Combobox
                        options={locations || []}
                        value={formData.location}
                        onValueChange={(value) =>
                          setFormData({ ...formData, location: value })
                        }
                        onAddNewOption={addLocation}
                        placeholder='Select or add location...'
                      />
                    </div>

                    <div>
                      <Label htmlFor='package'>Package</Label>
                      <Combobox
                        options={packages || []}
                        value={formData.package}
                        onValueChange={(value) =>
                          setFormData({ ...formData, package: value })
                        }
                        onAddNewOption={addPackage}
                        placeholder='Select or add package...'
                      />
                    </div>

                    <div>
                      <Label htmlFor='agreedAmount'>Agreed Amount (₱)</Label>
                      <Combobox
                        options={amountOptions}
                        value={formData.agreedAmount}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            agreedAmount: value,
                          })
                        }
                        onAddNewOption={addAmountOption}
                        placeholder='Type amount (e.g., 5000, 7500)...'
                      />
                    </div>

                    <div>
                      <Label htmlFor='expenses'>Expenses (₱)</Label>
                      <Combobox
                        options={amountOptions}
                        value={formData.expenses}
                        onValueChange={(value) =>
                          setFormData({ ...formData, expenses: value })
                        }
                        onAddNewOption={addAmountOption}
                        placeholder='Type amount (e.g., 500, 1000)...'
                      />
                    </div>

                    <div>
                      <Label htmlFor='mixerAndSpeaker'>Mixer and Speaker</Label>
                      <Combobox
                        options={equipment || []}
                        value={formData.mixerAndSpeaker}
                        onValueChange={(value) =>
                          setFormData({
                            ...formData,
                            mixerAndSpeaker: value,
                          })
                        }
                        onAddNewOption={addEquipment}
                        placeholder='Select or add equipment...'
                      />
                    </div>

                    <div>
                      <Label htmlFor='driver'>Driver</Label>
                      <Combobox
                        options={drivers || []}
                        value={formData.driver}
                        onValueChange={(value) =>
                          setFormData({ ...formData, driver: value })
                        }
                        onAddNewOption={addDriver}
                        placeholder='Select or add driver...'
                      />
                    </div>

                    <div className='md:col-span-2'>
                      <Label htmlFor='crew'>Crew Members</Label>
                      <TagInput
                        value={formData.crew}
                        onChange={(crew) => setFormData({ ...formData, crew })}
                        placeholder='Add crew members...'
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

          {/* Bookings Display */}
          {viewMode === 'grid' ? (
            <div className='grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6'>
              {filteredBookings.map((booking) => (
                <Card
                  key={booking._id}
                  className='hover:shadow-lg transition-shadow'
                >
                  <CardHeader>
                    <div className='flex items-center justify-between'>
                      <CardTitle className='text-lg'>
                        {booking.clientName}
                      </CardTitle>
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
                        <span>Event: {booking.eventTime}</span>
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

                      <div className='flex items-center space-x-2 text-sm'>
                        <DollarSign className='h-4 w-4 text-muted-foreground' />
                        <span className='font-semibold text-green-600'>
                          Agreed: ₱{booking.agreedAmount.toLocaleString()}
                        </span>
                      </div>

                      <div className='flex items-center space-x-2 text-sm'>
                        <DollarSign className='h-4 w-4 text-muted-foreground' />
                        <span className='font-semibold text-red-600'>
                          Expenses: ₱{booking.expenses.toLocaleString()}
                        </span>
                      </div>

                      {booking.driver && (
                        <div className='flex items-center space-x-2 text-sm'>
                          <Car className='h-4 w-4 text-muted-foreground' />
                          <span className='truncate text-xs'>
                            Driver: {booking.driver}
                          </span>
                        </div>
                      )}

                      {booking.crew.length > 0 && (
                        <div className='flex items-center space-x-2 text-sm'>
                          <Users className='h-4 w-4 text-muted-foreground' />
                          <span className='truncate text-xs'>
                            Crew: {booking.crew.join(', ')}
                          </span>
                        </div>
                      )}

                      {booking.mixerAndSpeaker && (
                        <div className='flex items-center space-x-2 text-sm'>
                          <Music className='h-4 w-4 text-muted-foreground' />
                          <span className='truncate text-xs'>
                            Equipment: {booking.mixerAndSpeaker}
                          </span>
                        </div>
                      )}

                      <div className='flex items-center space-x-2 text-sm'>
                        <Calendar className='h-4 w-4 text-muted-foreground' />
                        <span className='text-xs text-muted-foreground'>
                          Created:{' '}
                          {new Date(booking.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <div className='text-sm text-muted-foreground border-t pt-2'>
                        <strong>Notes:</strong> {booking.notes}
                      </div>
                    )}

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
          ) : (
            <div className='overflow-x-auto'>
              <table className='w-full border-collapse border border-border'>
                <thead>
                  <tr className='bg-muted/50'>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Client
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Status
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Event Type
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Date
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Time
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Location
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Package
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Amount
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Expenses
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Driver
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Crew
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Created
                    </th>
                    <th className='border border-border p-3 text-left font-semibold'>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking._id} className='hover:bg-muted/30'>
                      <td className='border border-border p-3'>
                        {booking.clientName}
                      </td>
                      <td className='border border-border p-3'>
                        <Badge className={statusColors[booking.status]}>
                          {statusLabels[booking.status]}
                        </Badge>
                      </td>
                      <td className='border border-border p-3'>
                        {booking.eventType}
                      </td>
                      <td className='border border-border p-3'>
                        {new Date(booking.eventDate).toLocaleDateString()}
                      </td>
                      <td className='border border-border p-3'>
                        {booking.eventTime}
                      </td>
                      <td className='border border-border p-3'>
                        {booking.location}
                      </td>
                      <td className='border border-border p-3'>
                        {booking.package}
                      </td>
                      <td className='border border-border p-3 font-semibold text-green-600'>
                        ₱{booking.agreedAmount.toLocaleString()}
                      </td>
                      <td className='border border-border p-3 font-semibold text-red-600'>
                        ₱{booking.expenses.toLocaleString()}
                      </td>
                      <td className='border border-border p-3'>
                        {booking.driver || '-'}
                      </td>
                      <td className='border border-border p-3 text-sm'>
                        {booking.crew.join(', ') || '-'}
                      </td>
                      <td className='border border-border p-3 text-sm'>
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className='border border-border p-3'>
                        <div className='flex space-x-2'>
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
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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

          {/* Load More Button - Shared between both views */}
          {hasMore && filteredBookings.length > 0 && (
            <div className='text-center py-6'>
              <Button
                onClick={loadMore}
                disabled={isLoadingMore}
                variant='outline'
                className='w-full max-w-xs'
              >
                {isLoadingMore ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2' />
                    Loading more...
                  </>
                ) : (
                  'Load More Bookings'
                )}
              </Button>
            </div>
          )}

          {/* End of results - Shared between both views */}
          {!hasMore && filteredBookings.length > 0 && (
            <div className='text-center py-6 text-muted-foreground'>
              <p>You&apos;ve reached the end of all bookings</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value='analytics' className='space-y-6'>
          {isAnalyticsLoading ? (
            <div className='text-center py-12'>
              <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
              <p>Loading analytics...</p>
            </div>
          ) : analyticsData ? (
            <div className='space-y-8'>
              {/* Overview Cards */}
              <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Total Bookings
                    </CardTitle>
                    <Calendar className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold'>
                      {analyticsData.overview.totalBookings}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Total Revenue
                    </CardTitle>
                    <DollarSign className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div className='text-2xl font-bold text-green-600'>
                      ₱{analyticsData.overview.totalRevenue.toLocaleString()}
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
                      ₱{analyticsData.overview.totalExpenses.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                    <CardTitle className='text-sm font-medium'>
                      Net Profit
                    </CardTitle>
                    <DollarSign className='h-4 w-4 text-muted-foreground' />
                  </CardHeader>
                  <CardContent>
                    <div
                      className={`text-2xl font-bold ${
                        analyticsData.overview.netProfit >= 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      ₱{analyticsData.overview.netProfit.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Charts Grid */}
              <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Status Distribution */}
                <Card>
                  <CardHeader>
                    <CardTitle>Booking Status Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64'>
                      <Doughnut
                        data={{
                          labels:
                            analyticsData.statusDistribution?.map(
                              (item) => item.status,
                            ) || [],
                          datasets: [
                            {
                              data:
                                analyticsData.statusDistribution?.map(
                                  (item) => item.count,
                                ) || [],
                              backgroundColor:
                                analyticsData.statusDistribution?.map(
                                  (item) =>
                                    chartStatusColor[
                                      (item.status || '').toLowerCase()
                                    ] || '#999999',
                                ) || [],
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Monthly Revenue */}
                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Revenue Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64'>
                      <Line
                        data={{
                          labels:
                            analyticsData.monthlyRevenue?.map(
                              (item) => item.month,
                            ) || [],
                          datasets: [
                            {
                              label: 'Revenue',
                              data:
                                analyticsData.monthlyRevenue?.map(
                                  (item) => item.revenue,
                                ) || [],
                              borderColor: '#10b981',
                              backgroundColor: 'rgba(16, 185, 129, 0.1)',
                              tension: 0.4,
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: function (value) {
                                  return '₱' + value.toLocaleString()
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Top Clients */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Clients by Revenue</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64'>
                      <Bar
                        data={{
                          labels:
                            analyticsData.topClients?.map(
                              (item) => item.client,
                            ) || [],
                          datasets: [
                            {
                              label: 'Revenue',
                              data:
                                analyticsData.topClients?.map(
                                  (item) => item.revenue,
                                ) || [],
                              backgroundColor: '#10b981',
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: function (value) {
                                  return '₱' + value.toLocaleString()
                                },
                              },
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Top Event Types */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Event Types</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='h-64'>
                      <Bar
                        data={{
                          labels:
                            analyticsData.topEventTypes?.map(
                              (item) => item.eventType,
                            ) || [],
                          datasets: [
                            {
                              label: 'Events',
                              data:
                                analyticsData.topEventTypes?.map(
                                  (item) => item.count,
                                ) || [],
                              backgroundColor: '#3b82f6',
                            },
                          ],
                        }}
                        options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Lists Grid */}
              <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Top Crew */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Crew Members</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {analyticsData.topCrew?.map((crew, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between'
                        >
                          <span className='text-sm font-medium'>
                            {crew.crew}
                          </span>
                          <span className='text-sm text-purple-600 font-semibold'>
                            {crew.count} events
                          </span>
                        </div>
                      )) || (
                        <p className='text-muted-foreground text-sm'>
                          No crew data available
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Top Drivers */}
                <Card>
                  <CardHeader>
                    <CardTitle>Top Drivers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {analyticsData.topDrivers?.map((driver, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between'
                        >
                          <span className='text-sm font-medium'>
                            {driver.driver}
                          </span>
                          <span className='text-sm text-orange-600 font-semibold'>
                            {driver.count} events
                          </span>
                        </div>
                      )) || (
                        <p className='text-muted-foreground text-sm'>
                          No driver data available
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className='space-y-3'>
                      {analyticsData.recentActivity?.map((activity, index) => (
                        <div
                          key={index}
                          className='flex items-center justify-between p-3 bg-muted/30 rounded-lg'
                        >
                          <div className='flex items-center space-x-3'>
                            <div className='w-2 h-2 bg-[hsl(var(--primary))] rounded-full'></div>
                            <div>
                              <span className='font-medium'>
                                {activity.clientName}
                              </span>
                              <span className='text-sm text-muted-foreground ml-2'>
                                - {activity.eventType}
                              </span>
                            </div>
                          </div>
                          <div className='text-right'>
                            <div className='text-sm font-medium'>
                              {new Date(
                                activity.eventDate,
                              ).toLocaleDateString()}
                            </div>
                            <div className='text-sm text-green-600'>
                              ₱{activity.agreedAmount.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      )) || (
                        <p className='text-muted-foreground text-sm'>
                          No recent activity
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className='text-center py-12'>
              <BarChart3 className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
              <h3 className='text-lg font-semibold mb-2'>No analytics data</h3>
              <p className='text-muted-foreground'>
                Create some bookings to see analytics
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          size='sm'
          className='fixed bottom-6 right-6 rounded-full w-12 h-12 p-0 shadow-lg z-50'
        >
          <ChevronUp className='h-5 w-5' />
        </Button>
      )}
    </div>
  )
}
