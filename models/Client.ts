import mongoose, { Schema, Document } from 'mongoose'

export interface IClient extends Document {
  name: string
  createdAt: Date
  updatedAt: Date
}

const ClientSchema = new Schema<IClient>(
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
ClientSchema.index({ name: 1 })

export default mongoose.models.Client ||
  mongoose.model<IClient>('Client', ClientSchema)
