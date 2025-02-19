"use client";

import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState } from "react";
import { FileDown } from "lucide-react";

export default function ListTasks() {
  const tasks = useQuery(api.tasks.listTasks) ?? [];
  const getFileUrl = useAction(api.files.getFileUrl);
  const [loadingFile, setLoadingFile] = useState<string | null>(null);

  const handleDownload = async (
    taskId: string,
    storageId: string,
    fileName: string,
  ) => {
    setLoadingFile(taskId);
    try {
      const url = await getFileUrl({ storageId });
      if (url) {
        const link = document.createElement("a");
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (error) {
      console.error("Error downloading file:", error);
    } finally {
      setLoadingFile(null);
    }
  };

  return (
    <div className="bg-black p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-white">Listado de Tareas</h2>
      {tasks.length === 0 ? (
        <p className="text-gray-400">No hay tareas disponibles.</p>
      ) : (
        <div className="space-y-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-gray-900 rounded-lg p-4 shadow-md transition-all hover:shadow-lg"
            >
              <h3 className="font-bold text-lg text-white mb-2">
                {task.title}
              </h3>

              <button
                onClick={() =>
                  handleDownload(task._id, task.storageId, task.fileName)
                }
                className="flex items-center text-blue-400 hover:text-blue-300 transition-colors text-sm font-medium"
                disabled={loadingFile === task._id}
              >
                <FileDown className="w-4 h-4 mr-2" />
                {loadingFile === task._id
                  ? "Descargando..."
                  : `Descargar ${task.fileName}`}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
