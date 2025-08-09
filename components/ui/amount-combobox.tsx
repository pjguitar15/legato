'use client'

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/hooks/use-toast'

interface AmountComboboxProps {
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  label?: string
  id?: string
  disabled?: boolean
}

export default function AmountCombobox({
  value,
  onValueChange,
  placeholder = 'Select amount...',
  label,
  id,
  disabled = false,
}: AmountComboboxProps) {
  const [open, setOpen] = useState(false)
  const [amounts, setAmounts] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAmount, setNewAmount] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    fetchAmounts()
  }, [])

  const fetchAmounts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/amounts')
      const data = await response.json()

      if (data.success) {
        setAmounts(data.data)
      }
    } catch (error) {
      console.error('Error fetching amounts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addAmount = async () => {
    const amountValue = parseInt(newAmount)
    if (!amountValue || amountValue <= 0) {
      toast({
        title: 'Error',
        description: 'Please enter a valid amount greater than 0',
        variant: 'destructive',
      })
      return
    }

    try {
      const response = await fetch('/api/admin/amounts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: amountValue }),
      })

      const data = await response.json()

      if (data.success) {
        // Refresh amounts list
        fetchAmounts()
        // Select the new amount
        onValueChange(amountValue.toString())
        setNewAmount('')
        setShowAddForm(false)
        setOpen(false)
        toast({
          title: 'Success',
          description: `Amount ₱${amountValue.toLocaleString()} added successfully`,
        })
      }
    } catch (error) {
      console.error('Error adding amount:', error)
      toast({
        title: 'Error',
        description: 'Failed to add amount',
        variant: 'destructive',
      })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addAmount()
    } else if (e.key === 'Escape') {
      setShowAddForm(false)
      setNewAmount('')
    }
  }

  return (
    <div className='space-y-2'>
      {label && <Label htmlFor={id}>{label}</Label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role='combobox'
            aria-expanded={open}
            className='w-full justify-between bg-background border-2'
            disabled={disabled}
            id={id}
          >
            {value ? `₱${parseInt(value).toLocaleString()}` : placeholder}
            <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-full p-0 bg-black border-2' align='start'>
          <Command>
            <CommandInput
              placeholder='Search amounts...'
              className='bg-background border-2'
            />
            <CommandList className='max-h-[200px] overflow-y-auto'>
              <CommandEmpty>
                {showAddForm ? (
                  <div className='p-4 space-y-2'>
                    <div className='flex items-center space-x-2'>
                      <Input
                        type='number'
                        placeholder='Enter amount...'
                        value={newAmount}
                        onChange={(e) => setNewAmount(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className='flex-1 bg-background border-2'
                        autoFocus
                      />
                      <Button
                        size='sm'
                        onClick={addAmount}
                        className='bg-[hsl(var(--primary))] text-primary-foreground'
                      >
                        <Plus className='h-4 w-4' />
                      </Button>
                    </div>
                    <p className='text-xs text-muted-foreground'>
                      Press Enter to add or Escape to cancel
                    </p>
                  </div>
                ) : (
                  <div className='p-4'>
                    <p className='text-sm text-muted-foreground mb-2'>
                      No amounts found.
                    </p>
                    <Button
                      size='sm'
                      onClick={() => setShowAddForm(true)}
                      className='w-full bg-[hsl(var(--primary))] text-primary-foreground'
                    >
                      <Plus className='h-4 w-4 mr-2' />
                      Add New Amount
                    </Button>
                  </div>
                )}
              </CommandEmpty>
              <CommandGroup>
                {amounts.map((amount, index) => (
                  <CommandItem
                    key={`${amount}-${index}`}
                    value={amount.toString()}
                    onSelect={() => {
                      onValueChange(amount.toString())
                      setOpen(false)
                    }}
                    className='bg-background border-2'
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === amount.toString()
                          ? 'opacity-100'
                          : 'opacity-0',
                      )}
                    />
                    ₱{amount.toLocaleString()}
                  </CommandItem>
                ))}
                {amounts.length > 0 && (
                  <CommandItem
                    onSelect={() => setShowAddForm(true)}
                    className='bg-background border-2'
                  >
                    <Plus className='mr-2 h-4 w-4' />
                    Add New Amount
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}
