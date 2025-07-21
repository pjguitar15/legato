import mongoose from 'mongoose'

const StatSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
})

const ContactSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  province: { type: String, required: true },
  zipCode: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
})

const SocialMediaSchema = new mongoose.Schema({
  facebook: { type: String },
  messenger: { type: String },
  instagram: { type: String },
  youtube: { type: String },
  facebookPageId: { type: String },
})

const BusinessHoursSchema = new mongoose.Schema({
  weekdays: { type: String, required: true },
  weekends: { type: String, required: true },
  holidays: { type: String, required: true },
})

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    coverage: { type: String, required: true },
    description: { type: String, required: true },
    footerDescription: { type: String, required: true },
    logo: { type: String },
    stats: [StatSchema],
    contact: ContactSchema,
    socialMedia: SocialMediaSchema,
    businessHours: BusinessHoursSchema,
    serviceAreas: [{ type: String }],
    founded: { type: Number, required: true },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Company ||
  mongoose.model('Company', CompanySchema)
