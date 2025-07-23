import mongoose, { Schema, Document } from 'mongoose'

export interface ILocation extends Document {
  name: string
  createdAt: Date
  updatedAt: Date
}

const LocationSchema = new Schema<ILocation>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
LocationSchema.index({ name: 1 })

export default mongoose.models.Location ||
  mongoose.model<ILocation>('Location', LocationSchema)
