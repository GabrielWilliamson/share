import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";
import { StorageReader } from "convex/server";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const addTask = mutation({
  args: {
    title: v.string(),
    fileName: v.string(),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("tasks", {
      title: args.title,
      fileName: args.fileName,
      storageId: args.storageId,
      createdAt: Date.now(),
    });

    console.log("Added new task with id:", id);
  },
});

export const listTasks = query({
  handler: async (ctx) => {
    return await ctx.db.query("tasks").order("desc").collect();
  },
});

export const getFileUrl = action({
  args: { storageId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});
