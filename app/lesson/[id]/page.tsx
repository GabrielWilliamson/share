"use client";

import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";
import NewTask from "@/components/newTask";
import ListTasks from "@/components/listTasks";
import { FileDown, LinkIcon, ExternalLink } from "lucide-react";

export default function ClassPage() {
  const params = useParams();
  const lessonId = params.id as Id<"lessons">;
  const clase = useQuery(api.lessons.getLesson, { lessonId });
  const getFileUrl = useAction(api.files.getFileUrl);

  if (!clase)
    return (
      <div
        className="min-h-screen bg-black text-white flex items-center justify-center"
        aria-live="polite"
      >
        <div className="animate-pulse" role="status">
          <span>Cargando...</span>
          <span className="sr-only">Cargando contenido de la clase</span>
        </div>
      </div>
    );

  const formattedDate = new Date(clase.date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            {clase.title}
          </h1>
          <p className="text-gray-400">
            <time dateTime={new Date(clase.date).toISOString()}>
              {formattedDate}
            </time>
          </p>
        </header>

        {clase.enlaces.length > 0 && (
          <section
            className="mb-8 bg-gray-900 p-5 rounded-lg shadow-lg border-l-4 border-blue-500"
            aria-labelledby="enlaces-heading"
          >
            <h2
              id="enlaces-heading"
              className="text-xl md:text-2xl font-semibold mb-4 text-white flex items-center"
            >
              <LinkIcon
                className="mr-2 flex-shrink-0"
                size={22}
                aria-hidden="true"
              />
              Enlaces
            </h2>
            <ul className="space-y-3 pl-2">
              {clase.enlaces.map((enlace, index) => (
                <li key={index} className="group">
                  <a
                    href={enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-300 hover:text-blue-200 focus:text-blue-200 transition-colors flex items-start group-hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1"
                    aria-label={`Abrir enlace externo: ${enlace}`}
                  >
                    <ExternalLink
                      className="mr-2 flex-shrink-0 mt-0.5 text-blue-400 group-hover:text-blue-300"
                      size={16}
                      aria-hidden="true"
                    />
                    <span className="break-all">{enlace}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {clase.archivos.length > 0 && (
          <section
            className="mb-8 bg-gray-900 p-5 rounded-lg shadow-lg border-l-4 border-green-500"
            aria-labelledby="archivos-heading"
          >
            <h2
              id="archivos-heading"
              className="text-xl md:text-2xl font-semibold mb-4 text-white flex items-center"
            >
              <FileDown
                className="mr-2 flex-shrink-0"
                size={22}
                aria-hidden="true"
              />
              Archivos
            </h2>
            <ul className="space-y-3 pl-2">
              {clase.archivos.map((archivo, index) => (
                <li key={index} className="group">
                  <button
                    onClick={async () => {
                      const url = await getFileUrl({
                        storageId: archivo.storageId,
                      });
                      if (url) window.open(url, "_blank");
                    }}
                    className="text-green-300 hover:text-green-200 focus:text-green-200 transition-colors flex items-start group-hover:underline focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900 rounded px-2 py-1 w-full text-left"
                    aria-label={`Descargar archivo: ${archivo.fileName}`}
                  >
                    <FileDown
                      className="mr-2 flex-shrink-0 mt-0.5 text-green-400 group-hover:text-green-300"
                      size={16}
                      aria-hidden="true"
                    />
                    <span className="break-all">{archivo.fileName}</span>
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-12" aria-label="Tareas de la clase">
          <div className="space-y-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <NewTask lessonId={lessonId} />
            </div>
            <div className="p-6 rounded-lg shadow-lg">
              <ListTasks lessonId={lessonId} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
