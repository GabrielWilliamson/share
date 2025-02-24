import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  tasks: defineTable({
    title: v.string(),
    fileName: v.string(),
    storageId: v.string(),
    createdAt: v.number(),
    lessonId: v.id("lessons"),
  }),
  lessons: defineTable({
    title: v.string(),
    date: v.number(),
    archivos: v.array(
      v.object({
        fileName: v.string(),
        storageId: v.string(),
      }),
    ),
    enlaces: v.array(v.string()),
  }),
});
