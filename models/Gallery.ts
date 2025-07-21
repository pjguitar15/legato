import mongoose from 'mongoose'

const GallerySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    caption: { type: String, required: true },
    eventType: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Gallery ||
  mongoose.model('Gallery', GallerySchema)
