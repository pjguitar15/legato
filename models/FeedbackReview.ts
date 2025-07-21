import mongoose from 'mongoose'

const FeedbackReviewSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    eventType: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending',
    },
    rating: { type: Number, min: 1, max: 5 },
    feedback: { type: String },
    submittedAt: { type: Date },
    uniqueId: { type: String, unique: true, required: true }, // For the feedback link
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.FeedbackReview ||
  mongoose.model('FeedbackReview', FeedbackReviewSchema)
