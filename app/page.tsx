"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";
import { Calendar, ChevronRight } from "lucide-react";

export default function Home() {
  const lessons = useQuery(api.lessons.listShortLessons) ?? [];

  // Sort lessons by date, most recent first
  const sortedLessons = [...lessons].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">
          Clases Recientes
        </h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedLessons.map((lesson) => (
            <Link
              href={`/lesson/${lesson.id}`}
              key={lesson.id}
              className="bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out"
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 text-white">
                  {lesson.title}
                </h2>
                <div className="flex items-center text-gray-400 mb-4">
                  <Calendar className="w-4 h-4 mr-2" />
                  <time dateTime={lesson.date.toString()}>
                    {new Date(lesson.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <div className="flex items-center justify-between text-blue-400 mt-4">
                  <span className="text-sm">Ver detalles</span>
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
        {sortedLessons.length === 0 && (
          <p className="text-center text-gray-400 mt-8">
            No hay clases disponibles en este momento.
          </p>
        )}
      </div>
    </div>
  );
}
