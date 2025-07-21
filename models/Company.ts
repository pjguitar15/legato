import mongoose from 'mongoose'

const StatSchema = new mongoose.Schema({
  value: { type: String, required: true },
  label: { type: String, required: true },
})

const ContactSchema = new mongoose.Schema({
  phone: { type: String, required: true },
  email: { type: String, required: true },
  whatsapp: { type: String, required: true },
  facebook: { type: String, required: true },
  instagram: { type: String, required: true },
  facebookPageId: { type: String, required: true },
})

const AddressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  zipCode: { type: String, required: true },
})

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    coverage: { type: String, required: true },
    stats: [StatSchema],
    contact: ContactSchema,
    address: AddressSchema,
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Company ||
  mongoose.model('Company', CompanySchema)
