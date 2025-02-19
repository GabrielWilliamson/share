"use client";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useParams } from "next/navigation";
import { FormEvent, useState, useRef } from "react";
import { Id } from "@/convex/_generated/dataModel";
import toast, { Toaster } from "react-hot-toast";
import { Trash } from "lucide-react"; // Importar el ícono de Lucide

export default function LessonPage() {
  const params = useParams();
  const lessonId = params.id as Id<"lessons">;
  const clase = useQuery(api.lessons.getLesson, { lessonId });

  const addFile = useMutation(api.lessons.addFile);
  const removeFile = useMutation(api.lessons.removeFile);
  const removeLink = useMutation(api.lessons.removeLink);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);
  const getFileUrl = useAction(api.files.getFileUrl);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const uploadToast = toast.loading("Subiendo archivo...");

    try {
      const postUrl = await generateUploadUrl();

      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": selectedFile.type },
        body: selectedFile,
      });
      const { storageId } = await result.json();

      await addFile({
        lessonId,
        fileName: selectedFile.name,
        storageId,
      });

      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      toast.success("Archivo subido exitosamente", { id: uploadToast });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error al subir el archivo", { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = async (storageId: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este archivo?")) {
      await removeFile({ lessonId, storageId });
      toast.success("Archivo eliminado exitosamente");
    }
  };

  const handleRemoveLink = async (link: string) => {
    if (confirm("¿Estás seguro de que deseas eliminar este enlace?")) {
      await removeLink({ lessonId, link });
      toast.success("Enlace eliminado exitosamente");
    }
  };

  if (!clase)
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        Cargando...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Toaster position="top-right" />
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">{clase.title}</h1>
        <p className="text-gray-400 mb-8">
          {new Date(clase.date).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Enlaces</h2>
          <ul className="space-y-2">
            {clase.enlaces.map((enlace, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-2 text-blue-500">•</span>
                <a
                  href={enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:underline"
                >
                  {enlace}
                </a>
                <button
                  onClick={() => handleRemoveLink(enlace)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <Trash size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Archivos</h2>
          <ul className="space-y-2">
            {clase.archivos.map((archivo, index) => (
              <li key={index} className="flex items-center">
                <span className="mr-2 text-green-500">•</span>
                <button
                  onClick={async () => {
                    const url = await getFileUrl({
                      storageId: archivo.storageId,
                    });
                    if (url) window.open(url, "_blank");
                  }}
                  className="text-green-400 hover:underline"
                >
                  {archivo.fileName}
                </button>
                <button
                  onClick={() => handleRemoveFile(archivo.storageId)}
                  className="ml-2 text-red-500 hover:text-red-700"
                >
                  <Trash size={16} />
                </button>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Subir archivo</h2>
          <form onSubmit={handleFileUpload} className="space-y-4">
            <div className="flex items-center space-x-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
                className="p-2 border rounded bg-gray-700 text-white flex-grow"
                required
                disabled={isUploading}
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={!selectedFile || isUploading}
              >
                {isUploading ? "Subiendo..." : "Subir"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
