import { Schema, model, models } from 'mongoose';

interface IDesign {
    id: string
    name: string
    discription: string
    price?: string | number
    isPremium: boolean
    designType: string
    images: string[]
    overview: string
    features: string[]
    formats: string[]
    highlight: string[]
}
const designSchema:Schema<IDesign> = new Schema({ 
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true , trim: true },
    discription: { type: String, required: true , trim: true },
    price: { type: Schema.Types.Mixed, required: true , trim: true },
    isPremium: { type: Boolean, required: true , trim: true },
    designType: { type: String, required: true , trim: true },
    images: { type: [String], required: true , trim: true },
    overview: { type: String, required: true , trim: true },
    features: { type: [String], required: true , trim: true },
    formats: { type: [String], required: true , trim: true },
    highlight: { type: [String], required: true , trim: true },
} , { timestamps: true });

const Design = models.Design || model<IDesign>("Design" , designSchema); 
export default Design;