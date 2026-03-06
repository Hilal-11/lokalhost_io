
import { Model, Schema, model, models } from 'mongoose';


interface ITemplate {
    id: string
    projectName: string;

    projectDescription: string
    projectPrize?: string
    isPremium?: boolean
    projectLiveURL: string
    projectImages: string[]
    projectTechStack: {
        name: string;
        favIcon: string;
    },
    projectFeatures: {
        feature: string,
        aboutFeature: string
    }
} 

const templatesSchema: Schema<ITemplate> = new Schema({
    id: { type: String, required: true, unique: true },
    projectName: { type: String, required: true , trim: true },
    projectDescription: { type: String, required: true , trim: true },
    projectPrize: { type: String, required: true , trim: true },
    isPremium: { type: Boolean, required: true , trim: true },
    projectLiveURL: { type: String, required: true , trim: true },
    projectImages: { type: [String], required: true , trim: true },
    projectTechStack: { type: Object, required: true , trim: true },
    projectFeatures: { type: Object, required: true , trim: true },
}, { timestamps: true });


const Templates = models.Templates || model<ITemplate>("Templates" , templatesSchema);
export default Templates;