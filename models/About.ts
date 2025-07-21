import mongoose from 'mongoose'

// Define team member schema
const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  experience: { type: String, required: true },
  specialization: { type: String, required: true },
  image: { type: String, default: '' },
  bio: { type: String, required: true },
})

// Define experience schema
const ExperienceSchema = new mongoose.Schema({
  years: { type: Number, required: true, default: 0 },
  events: { type: Number, required: true, default: 0 },
  clients: { type: Number, required: true, default: 0 },
})

// Define main About schema
const AboutSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    story: { type: String, required: true },
    mission: { type: String, required: true },
    vision: { type: String, required: true },
    values: [{ type: String, required: true }],
    experience: { type: ExperienceSchema, required: true },
    team: [TeamMemberSchema],
  },
  {
    timestamps: true,
  },
)

// Clear any existing model and create fresh
if (mongoose.models.About) {
  delete mongoose.models.About
}

export default mongoose.model('About', AboutSchema)
