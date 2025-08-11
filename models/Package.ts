import mongoose, { Schema, Document } from 'mongoose'

export interface IPackage extends Document {
  name: string
  description: string
  price: number
  currency: string
  features: string[]
  equipment: string[]
  idealFor: string
  maxGuests: number
  popular: boolean
  image?: string
  recommendedEvents?: string[]
  createdAt: Date
  updatedAt: Date
}

const PackageSchema = new Schema<IPackage>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      required: true,
      default: '₱',
    },
    features: [
      {
        type: String,
        required: true,
      },
    ],
    equipment: [
      {
        type: String,
        required: true,
      },
    ],
    idealFor: {
      type: String,
      required: true,
    },
    maxGuests: {
      type: Number,
      required: true,
      min: 1,
    },
    popular: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      required: false,
      default: '',
    },
    recommendedEvents: [
      {
        type: String,
        required: false,
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
PackageSchema.index({ name: 1 })

export default (mongoose.models.Package as mongoose.Model<IPackage>) ||
  mongoose.model<IPackage>('Package', PackageSchema)
