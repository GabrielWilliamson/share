import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const addTask = mutation({
  args: {
    title: v.string(),
    fileName: v.string(),
    storageId: v.string(),
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("tasks", {
      title: args.title,
      fileName: args.fileName,
      storageId: args.storageId,
      createdAt: Date.now(),
      lessonId: args.lessonId,
    });

    console.log("Added new task with id:", id);
    return id;
  },
});

export const listTasks = query({
  args: {
    lessonId: v.id("lessons"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("tasks")
      .filter((q) => q.eq(q.field("lessonId"), args.lessonId))
      .order("desc")
      .collect();
  },
});

export const removeTask = mutation({
  args: {
    taskId: v.id("tasks"),
  },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.taskId);
  },
});
