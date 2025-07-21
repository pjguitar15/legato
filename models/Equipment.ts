import mongoose from 'mongoose'

const EquipmentItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String, required: true }],
  image: { type: String },
})

const EquipmentCategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    items: [EquipmentItemSchema],
  },
  {
    timestamps: true,
  },
)

export default mongoose.models.EquipmentCategory ||
  mongoose.model('EquipmentCategory', EquipmentCategorySchema)
