import mongoose, { Schema, Document } from 'mongoose'

export interface IVlog extends Document {
  title?: string
  url: string
  youtubeId: string
  createdAt: Date
  updatedAt: Date
}

const VlogSchema = new Schema<IVlog>(
  {
    title: { type: String },
    url: { type: String, required: true },
    youtubeId: { type: String, required: true, index: true },
  },
  { timestamps: true },
)

VlogSchema.index({ createdAt: -1 })

export default mongoose.models.Vlog || mongoose.model<IVlog>('Vlog', VlogSchema)
