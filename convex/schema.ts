import { defineSchema , defineTable} from "convex/server"
import { v } from "convex/values"
import { optional } from "zod"

export default defineSchema({
    templates: defineTable({
        id: v.string(),
        projectName: v.string(),
        projectDescription: v.string(),
        projectPrize: v.string(),
        isPremium: v.boolean(),
        projectLiveURL: v.string(),
        projectImages: v.array(
            v.string()
        ),
        tempalteFormats: v.array(
            v.object({
                format: v.string() , icon: v.string()
            })
        ),
        projectTechStack: v.array(
            v.object({
                name: v.string() , favIcon: v.string()
            })
        ),
        projectFeatures: v.array(
            v.object({
                feature: v.string(),
                aboutFeature: v.string()
            })
        ),
        templatepages: v.array(
            v.string()
        ),
        templateTotalPages: v.number(),
        templatePurposes: v.array(
            v.string()
        ),
        templatePreferFor: v.array(
            v.string()
        ),
        zip_code_file: v.string(),
    }),
    designKits: defineTable({
        id: v.string(),
        name: v.string(),
        
        discription: v.string(),
        isPremium: v.boolean(),
        price: v.string(),
        designType: v.string(),
        images: v.array(
            v.string()
        ),
        overview: v.string(),
        features: v.array(
            v.string()
        ),
        formats: v.array(
            v.string()
        ),
        designPages: v.array(
            v.string()
        ),
        designTotalPages: v.number(),
        designPurposes: v.array(
            v.string()
        ),
        designPreferFor: v.array(
            v.string()
        ),
        highlight: v.array(
            v.string()
        )
    })
})
