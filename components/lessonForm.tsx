import { FormEvent, useState } from "react";

type LessonFormProps = {
  onSubmit: (title: string, date: string, enlaces: string[]) => void;
};

export default function LessonForm({ onSubmit }: LessonFormProps) {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [enlaces, setEnlaces] = useState<string[]>([]);
  const [nuevoEnlace, setNuevoEnlace] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(title, date, enlaces);
    setTitle("");
    setDate("");
    setEnlaces([]);
  };

  const addEnlace = () => {
    if (nuevoEnlace) {
      setEnlaces([...enlaces, nuevoEnlace]);
      setNuevoEnlace("");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-20 md:mx-20 p-6 bg-gray-900 rounded-md"
    >
      <h2 className="text-2xl font-semibold mb-4">Crear una nueva clase</h2>
      <div className="mb-4">
        <label htmlFor="titulo" className="block text-sm font-medium mb-2">
          Titulo:
        </label>
        <input
          type="text"
          id="titulo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="input"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="fecha" className="block text-sm font-medium mb-2">
          Fecha:
        </label>
        <input
          type="date"
          id="fecha"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="input"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="enlaces" className="block text-sm font-medium mb-2">
          Enlaces:
        </label>
        <div className="flex gap-2 mb-2">
          <input
            type="url"
            id="enlaces"
            value={nuevoEnlace}
            onChange={(e) => setNuevoEnlace(e.target.value)}
            className="input"
            placeholder="https://example.com"
          />
          <button type="button" onClick={addEnlace} className="btn">
            Agregar
          </button>
        </div>
        <ul className="space-y-1">
          {enlaces.map((enlace, index) => (
            <li key={index} className="flex items-center">
              <span className="mr-2 text-accent">•</span>
              <a
                href={enlace}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:underline"
              >
                {enlace}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <button type="submit" className="btn">
        Crear clase
      </button>
    </form>
  );
}
