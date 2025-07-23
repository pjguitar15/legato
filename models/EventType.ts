import mongoose, { Schema, Document } from 'mongoose'

export interface IEventType extends Document {
  name: string
  createdAt: Date
  updatedAt: Date
}

const EventTypeSchema = new Schema<IEventType>(
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
EventTypeSchema.index({ name: 1 })

export default mongoose.models.EventType ||
  mongoose.model<IEventType>('EventType', EventTypeSchema)
