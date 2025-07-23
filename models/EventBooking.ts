import mongoose, { Schema, Document } from 'mongoose'

export interface IEventBooking extends Document {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  eventType: string
  eventDate: Date
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
  createdAt: Date
  updatedAt: Date
}

const EventBookingSchema = new Schema<IEventBooking>(
  {
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
      required: true,
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
    },
    eventDate: {
      type: Date,
      required: true,
    },
    crew: [
      {
        type: String,
        trim: true,
      },
    ],
    clientName: {
      type: String,
      required: true,
      trim: true,
    },
    agreedAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    package: {
      type: String,
      required: true,
      trim: true,
    },
    eventTime: {
      type: String,
      required: true,
      trim: true,
    },
    ingress: {
      type: String,
      required: true,
      trim: true,
    },
    expenses: {
      type: Number,
      default: 0,
      min: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    mixerAndSpeaker: {
      type: String,
      required: true,
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
EventBookingSchema.index({ eventDate: 1, status: 1 })
EventBookingSchema.index({ clientName: 1 })

export default mongoose.models.EventBooking ||
  mongoose.model<IEventBooking>('EventBooking', EventBookingSchema)
