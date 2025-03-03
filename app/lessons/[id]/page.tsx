"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { Id } from "@/convex/_generated/dataModel";
import FileUploadForm from "@/components/fileUploadForm";
import LinkList from "@/components/linkList";
import FileList from "@/components/fileList";
import LinkForm from "@/components/linkForm";
import Link from "next/link";

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as Id<"lessons">;
  const lesson = useQuery(api.lessons.getLesson, { lessonId });

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-3xl mx-auto">
        <Link className="mb-10" href="/lessons">
          Regresar
        </Link>
        <h1 className="text-3xl font-bold my-4">{lesson.title}</h1>
        <p className="text-muted-foreground mb-8">
          {new Date(lesson.date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <LinkList lessonId={lessonId} links={lesson.enlaces} />
        <LinkForm lessonId={lessonId} />
        <FileList lessonId={lessonId} files={lesson.archivos} />
        <FileUploadForm lessonId={lessonId} />
      </div>
    </div>
  );
}
