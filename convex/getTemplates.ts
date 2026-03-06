import { v } from "convex/values";
import { query } from "./_generated/server"


export const getTemplates = query({
    args: {},
    handler: async (ctx) => {
        const templates = await ctx.db.query('templates').collect();
        return templates
    }
})

export const getTemplateById = query({
    args: { id: v.id("templates") },
    handler: async (ctx , args) => {
        return await ctx.db.get(args.id)
    }
})

export const getDesignKits = query({
    args: {},
    handler: async (ctx) => {
        const designKits = await ctx.db.query('designKits').collect();
        return designKits
    }
})

export const getDesignKitById = query({
    args: { id: v.id("designKits") },
    handler: async(ctx , args) => {
        return await ctx.db.get(args.id)
    }
})