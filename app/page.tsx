"use client";

import { FormEvent, useRef, useState } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../convex/_generated/api";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="sticky top-0 z-10 bg-gray-800 p-4 border-b-2 border-gray-700">
        <h1 className="text-2xl font-bold">
          Herramienta para compartir archivos
        </h1>
      </header>
      <main className="p-8 flex flex-col gap-16 max-w-3xl mx-auto">
        <Content />
      </main>
      <footer>
        <p className="text-center text-sm text-gray-400">
          Creado por Gabriel con ❤️ 
        </p>
      </footer>
    </div>
  );
}

function Content() {
  const generateUploadUrl = useMutation(api.tasks.generateUploadUrl);
  const addTask = useMutation(api.tasks.addTask);
  const tasks = useQuery(api.tasks.listTasks) ?? [];
  const getFileUrl = useAction(api.tasks.getFileUrl);

  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    // Step 1: Get a short-lived upload URL
    const postUrl = await generateUploadUrl();

    // Step 2: POST the file to the URL
    const result = await fetch(postUrl, {
      method: "POST",
      headers: { "Content-Type": selectedFile.type },
      body: selectedFile,
    });
    const { storageId } = await result.json();

    // Step 3: Save the task with the storage ID
    await addTask({
      title,
      fileName: selectedFile.name,
      storageId,
    });

    setTitle("");
    setSelectedFile(null);
    if (fileInput.current) fileInput.current.value = "";
  };

  return (
    <div className="flex flex-col gap-8">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 bg-gray-800 p-6 rounded-lg"
      >
        <h2 className="text-xl font-bold">Subir archivos</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Ingresa tu nombre o el nombre del archivo"
          className="p-2 border rounded bg-gray-700 text-white"
          required
        />
        <input
          type="file"
          ref={fileInput}
          onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
          className="p-2 border rounded bg-gray-700 text-white"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white text-sm px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          disabled={!selectedFile}
        >
          Subir
        </button>
      </form>

      <div className="bg-gray-800 p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Listado de archivos</h2>
        {tasks.map((task) => (
          <div
            key={task._id}
            className="mb-4 p-4 bg-gray-700 rounded-md shadow"
          >
            <h3 className="font-bold">{task.title}</h3>
            <p className="text-sm text-gray-400">
              {new Date(task.createdAt).toLocaleDateString("es-ES", {
                month: "short",
                day: "numeric",
              })}
            </p>
            <button
              onClick={async () => {
                const url = await getFileUrl({ storageId: task.storageId });
                window.open(url!, "_blank");
              }}
              className="text-blue-400 hover:underline text-sm"
            >
              Descargar {task.fileName}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
