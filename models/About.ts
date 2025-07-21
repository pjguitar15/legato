import mongoose from 'mongoose'

const TeamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  experience: { type: String, required: true },
  specialization: { type: String, required: true },
  image: { type: String },
  bio: { type: String, required: true },
})

const CompanyInfoSchema = new mongoose.Schema({
  founded: { type: String, required: true },
  mission: { type: String, required: true },
  vision: { type: String, required: true },
  values: [{ type: String, required: true }],
  story: { type: String, required: true },
})

const AboutSchema = new mongoose.Schema(
  {
    company: CompanyInfoSchema,
    team: [TeamMemberSchema],
    achievements: [{ type: String, required: true }],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.About || mongoose.model('About', AboutSchema)
