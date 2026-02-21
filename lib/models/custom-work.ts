import { Schema ,  model, models } from "mongoose";

interface ICustomWork {
    name: string
    email: string
    company: string
    phone: string
    serviceType: string
    projectDescription: string
    timeline: string
    referenceUrls?: string
    additionalInfo?: string
}
const customWorkSchema:Schema<ICustomWork> = new Schema({ 
    name: { type: String, required: true , trim: true },
    email: { type: String, required: true , trim: true },
    company: { type: String, required: true , trim: true },
    phone: { type: String, required: true , trim: true  },
    serviceType: { type: String, required: true , trim: true },
    projectDescription: { type: String, required: true , trim: true },
    timeline: {type: String, required: true , trim: true},
    referenceUrls: { type: [String], required: false , trim: true },
    additionalInfo: { type: String, required: false , trim: true }
} , { timestamps: true });

const CustomWork = models.CustomWork || model<ICustomWork>("CustomWork" , customWorkSchema); 
export default CustomWork;