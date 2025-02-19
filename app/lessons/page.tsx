"use client";

import { FormEvent, useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";

export default function NewClassPage() {
  const router = useRouter();
  const createClass = useMutation(api.lessons.createLesson);
  const [title, setTitulo] = useState("");
  const [date, setFecha] = useState("");
  const [enlaces, setEnlaces] = useState<string[]>([]);
  const [nuevoEnlace, setNuevoEnlace] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const lessonId = await createClass({
      title,
      date: new Date(date).getTime(),
      enlaces,
    });
    router.push(`/lessons/${lessonId}`);
  };

  const addEnlace = () => {
    if (nuevoEnlace) {
      setEnlaces([...enlaces, nuevoEnlace]);
      setNuevoEnlace("");
    }
  };

  const lessons = useQuery(api.lessons.listLessons) ?? [];

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold text-center">Crear nueva clase</h1>
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto mb-10 p-4 bg-slate-900 rounded-sm"
      >
        <div className="mb-4">
          <label htmlFor="titulo" className="block text-sm font-medium mb-2">
            Título
          </label>
          <input
            type="text"
            id="titulo"
            value={title}
            onChange={(e) => setTitulo(e.target.value)}
            className="bg-stone-800 text-white rounded-sm p-1 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="fecha" className="block text-sm font-medium mb-2">
            Fecha
          </label>
          <input
            type="date"
            id="fecha"
            value={date}
            onChange={(e) => setFecha(e.target.value)}
            className="bg-stone-800 text-white rounded-sm p-1 w-full"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="enlaces" className="block text-sm font-medium mb-2">
            Enlaces
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="url"
              id="enlaces"
              value={nuevoEnlace}
              onChange={(e) => setNuevoEnlace(e.target.value)}
              className="bg-stone-800 text-white rounded-sm p-1 w-full"
              placeholder="https://ejemplo.com"
            />
            <button
              type="button"
              onClick={addEnlace}
              className="bg-blue-900 text-white p-1 rounded-sm"
            >
              Agregar
            </button>
          </div>
          <ul className="space-y-1">
            {enlaces.map((enlace, index) => (
              <li key={index} className=" flex items-center">
                <span className="mr-2">•</span>
                <a
                  href={enlace}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {enlace}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <button type="submit" className="bg-blue-900 text-white p-1 rounded-sm">
          Crear clase
        </button>
      </form>

      {lessons.length > 0 && (
        <div className="flex max-w-md mx-auto justify-center items-center">
          <table className="w-full border">
            <thead className="border-b">
              <tr>
                <th>Clase</th>
                <th>Fecha</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="border-b">
              {lessons.map((lesson) => (
                <tr key={lesson._id}>
                  <td>{lesson.title}</td>
                  <td>
                    {new Date(lesson.date).toLocaleDateString("es-ES", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </td>
                  <td>
                    <a
                      href={`/lessons/${lesson._id}`}
                      className="text-blue-400 hover:underline"
                    >
                      Ver
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
