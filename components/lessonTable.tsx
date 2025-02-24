import Link from "next/link";
import { Id } from "@/convex/_generated/dataModel";

type Lesson = {
  title: string;
  date: number;
  id: Id<"lessons">;
};

type LessonTableProps = {
  lessons: Lesson[];
};

export default function LessonTable({ lessons }: LessonTableProps) {
  if (lessons.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 text-left">Clase</th>
            <th className="p-2 text-left">Fecha</th>
            <th className="p-2 text-left">Accion</th>
          </tr>
        </thead>
        <tbody>
          {lessons.map((lesson) => (
            <tr key={lesson.id} className="border-b border-muted">
              <td className="p-2">{lesson.title}</td>
              <td className="p-2">
                {new Date(lesson.date).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td className="p-2">
                <Link
                  href={`/lessons/${lesson.id}`}
                  className="text-accent hover:underline"
                >
                  Ver
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
