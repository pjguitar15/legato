import mongoose from 'mongoose'

const TestimonialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    event: { type: String, required: true },
    date: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Testimonial ||
  mongoose.model('Testimonial', TestimonialSchema)
