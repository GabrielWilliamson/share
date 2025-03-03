"use client";

import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import LessonForm from "@/components/lessonForm";
import LessonTable from "@/components/lessonTable";

export default function LessonsPage() {
  const router = useRouter();
  const createClass = useMutation(api.lessons.createLesson);
  const lessons = useQuery(api.lessons.listShortLessons) ?? [];

  const handleCreateLesson = async (
    title: string,
    date: string,
    enlaces: string[],
  ) => {
    const createToast = toast.loading("Creating lesson...");
    try {
      const lessonId = await createClass({
        title,
        date: new Date(`${date}T00:00:00`).getTime(),
        enlaces,
      });
      toast.success("Lesson created successfully", { id: createToast });
      router.push(`/lessons/${lessonId}`);
    } catch (error) {
      console.log(error);
      toast.error("Failed to create lesson", { id: createToast });
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-center mb-8">Clases</h1>
      <div className="max-w-3xl mx-auto mb-20">
        <LessonForm onSubmit={handleCreateLesson} />
        <LessonTable lessons={lessons} />
      </div>
    </div>
  );
}
