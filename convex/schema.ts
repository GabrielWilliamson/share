import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    fileName: v.string(),
    storageId: v.string(),
    createdAt: v.number(),
  }),
});