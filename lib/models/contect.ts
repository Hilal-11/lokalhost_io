import { Schema, model, models, Document } from 'mongoose'

interface IContact extends Document {
  firstName: string
  lastName: string
  email: string
  phone: string
  comments: string
  services: string[]
  createdAt: Date
  updatedAt: Date
}

const contactSchema = new Schema<IContact>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    comments: { type: String, required: true, trim: true },
  },
  { timestamps: true }
)

contactSchema.index({ email: 1, createdAt: -1 })
contactSchema.index({ createdAt: -1 })

const Contact = models.Contact || model<IContact>('Contact', contactSchema)

export default Contact