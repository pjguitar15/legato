import mongoose from 'mongoose'

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: String, required: true },
    location: { type: String, required: true },
    eventType: { type: String, required: true },
    package: { type: String, required: true },
    image: { type: String },
    highlights: [{ type: String }],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Event || mongoose.model('Event', EventSchema)
