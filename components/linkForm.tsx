"use client";

import { useState, FormEvent } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import toast from "react-hot-toast";

type LinkFormProps = {
  lessonId: Id<"lessons">;
};

export default function LinkForm({ lessonId }: LinkFormProps) {
  const [newLink, setNewLink] = useState("");
  const addLink = useMutation(api.lessons.addLink);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newLink) return;

    const addLinkToast = toast.loading("Agregando enlace...");
    try {
      await addLink({ lessonId, link: newLink });
      setNewLink("");
      toast.success("Enlace agregado exitosamente", { id: addLinkToast });
    } catch (error) {
      console.log(error);
      toast.error("Ocurro un error al agregar el enlace", { id: addLinkToast });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="url"
          value={newLink}
          onChange={(e) => setNewLink(e.target.value)}
          placeholder="https://example.com"
          className="input flex-grow"
          required
        />
        <button type="submit" className="btn">
          Agregar enlace
        </button>
      </div>
    </form>
  );
}
