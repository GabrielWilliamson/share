"use client";

import { useQuery, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import type { Id } from "@/convex/_generated/dataModel";
import NewTask from "@/components/newTask";
import ListTasks from "@/components/listTasks";
import { FileDown, LinkIcon } from "lucide-react";

export default function ClassPage() {
  const params = useParams();
  const lessonId = params.id as Id<"lessons">;
  const clase = useQuery(api.lessons.getLesson, { lessonId });
  const getFileUrl = useAction(api.files.getFileUrl);

  if (!clase)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-pulse">Cargando...</div>
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-4 text-white">{clase.title}</h1>
        <p className="text-gray-400 mb-8">
          {new Date(clase.date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        {clase.enlaces.length > 0 && (
          <section className="mb-12 bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
              <LinkIcon className="mr-2" size={24} />
              Enlaces
            </h2>
            <ul className="space-y-3">
              {clase.enlaces.map((enlace, index) => (
                <li key={index} className="flex items-center">
                  <a
                    href={enlace}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2 text-gray-500">•</span>
                    {enlace}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        {clase.archivos.length > 0 && (
          <section className="mb-12 bg-gray-900 p-6 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
              <FileDown className="mr-2" size={24} />
              Archivos
            </h2>
            <ul className="space-y-3">
              {clase.archivos.map((archivo, index) => (
                <li key={index} className="flex items-center">
                  <button
                    onClick={async () => {
                      const url = await getFileUrl({
                        storageId: archivo.storageId,
                      });
                      if (url) window.open(url, "_blank");
                    }}
                    className="text-gray-300 hover:text-white transition-colors flex items-center"
                  >
                    <span className="mr-2 text-gray-500">•</span>
                    {archivo.fileName}
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-white">Tareas</h2>
          <div className="space-y-8">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg">
              <NewTask />
            </div>
            <div className=" p-6 rounded-lg shadow-lg">
              <ListTasks />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
