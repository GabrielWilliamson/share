"use client";

import { type FormEvent, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";

export default function NewTask() {
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const addTask = useMutation(api.tasks.addTask);
  const [title, setTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInput = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    const toastId = toast.loading("Subiendo tarea...");

    try {
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

      toast.success("Tarea subida exitosamente", { id: toastId });
    } catch (error) {
      console.error("Error al subir la tarea:", error);
      toast.error("Error al subir la tarea. Por favor, intenta de nuevo.", {
        id: toastId,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 bg-gray-900 p-6 rounded-lg"
    >
      <h2 className="text-xl font-bold text-white">Agrega tu tarea ✔️</h2>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Tu nombre"
        className="p-2 border border-gray-700 rounded bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-600"
        required
      />
      <input
        type="file"
        ref={fileInput}
        onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
        className="p-2 border border-gray-700 rounded bg-gray-800 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-700 file:text-white hover:file:bg-gray-600"
        required
      />
      <button
        type="submit"
        className="bg-white text-gray-900 text-sm px-4 py-2 rounded-md hover:bg-gray-200 transition-colors disabled:bg-gray-600 disabled:text-gray-400"
        disabled={!selectedFile}
      >
        Subir
      </button>
    </form>
  );
}
