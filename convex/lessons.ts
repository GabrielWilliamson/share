import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const createLesson = mutation({
  args: {
    title: v.string(),
    date: v.number(),
    enlaces: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("lessons", {
      ...args,
      archivos: [],
    });
    return id;
  },
});

export const getLesson = query({
  args: { lessonId: v.id("lessons") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.lessonId);
  },
});

export const addFile = mutation({
  args: {
    lessonId: v.id("lessons"),
    fileName: v.string(),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const clase = await ctx.db.get(args.lessonId);
    if (!clase) throw new Error("Class not found");

    await ctx.db.patch(args.lessonId, {
      archivos: [
        ...clase.archivos,
        { fileName: args.fileName, storageId: args.storageId },
      ],
    });
  },
});

export const listLessons = query({
  handler: async (ctx) => {
    return await ctx.db.query("lessons").order("desc").collect();
  },
});

export const listShortLessons = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("lessons")
      .order("desc")
      .collect()
      .then((lessons) =>
        lessons.map((lesson) => ({
          title: lesson.title,
          date: lesson.date,
          id: lesson._id,
        })),
      );
  },
});

export const removeFile = mutation({
  args: {
    lessonId: v.id("lessons"),
    storageId: v.string(),
  },
  handler: async (ctx, args) => {
    const clase = await ctx.db.get(args.lessonId);
    if (!clase) throw new Error("Class not found");

    const updatedFiles = clase.archivos.filter(
      (file) => file.storageId !== args.storageId,
    );

    await ctx.db.patch(args.lessonId, {
      archivos: updatedFiles,
    });
  },
});

export const removeLink = mutation({
  args: {
    lessonId: v.id("lessons"),
    link: v.string(),
  },
  handler: async (ctx, args) => {
    const clase = await ctx.db.get(args.lessonId);
    if (!clase) throw new Error("Class not found");

    const updatedLinks = clase.enlaces.filter((enlace) => enlace !== args.link);

    await ctx.db.patch(args.lessonId, {
      enlaces: updatedLinks,
    });
  },
});

export const addLink = mutation({
  args: {
    lessonId: v.id("lessons"),
    link: v.string(),
  },
  handler: async (ctx, args) => {
    const lesson = await ctx.db.get(args.lessonId);
    if (!lesson) throw new Error("Lesson not found");

    await ctx.db.patch(args.lessonId, {
      enlaces: [...lesson.enlaces, args.link],
    });
  },
});
