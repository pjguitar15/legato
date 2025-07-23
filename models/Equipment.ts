import mongoose, { Schema, Document } from 'mongoose'

export interface IEquipmentItem {
  name: string
  brand: string
  type: string
  description: string
  features: string[]
  image?: string
}

export interface IEquipmentCategory extends Document {
  name: string
  items: IEquipmentItem[]
  createdAt: Date
  updatedAt: Date
}

const EquipmentItemSchema = new Schema<IEquipmentItem>({
  name: { type: String, required: true },
  brand: { type: String, required: true },
  type: { type: String, required: true },
  description: { type: String, required: true },
  features: [{ type: String, required: true }],
  image: { type: String },
})

const EquipmentCategorySchema = new Schema<IEquipmentCategory>(
  {
    name: { type: String, required: true },
    items: [EquipmentItemSchema],
  },
  {
    timestamps: true,
  },
)

// Index for efficient querying
EquipmentCategorySchema.index({ name: 1 })

export default mongoose.models.EquipmentCategory ||
  mongoose.model<IEquipmentCategory>(
    'EquipmentCategory',
    EquipmentCategorySchema,
  )
