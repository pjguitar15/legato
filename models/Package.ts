import mongoose from 'mongoose'

const PackageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    currency: { type: String, required: true, default: '₱' },
    features: [{ type: String, required: true }],
    equipment: [{ type: String, required: true }],
    idealFor: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    popular: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.Package ||
  mongoose.model('Package', PackageSchema)
