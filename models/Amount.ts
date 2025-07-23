import mongoose, { Schema, Document } from 'mongoose'

export interface IAmount extends Document {
  value: number
  createdAt: Date
  updatedAt: Date
}

const AmountSchema = new Schema<IAmount>(
  {
    value: {
      type: Number,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
AmountSchema.index({ value: 1 })

export default mongoose.models.Amount ||
  mongoose.model<IAmount>('Amount', AmountSchema)
