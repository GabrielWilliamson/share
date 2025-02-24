import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";

type LinkListProps = {
  lessonId: Id<"lessons">;
  links: string[];
};

export default function LinkList({ lessonId, links }: LinkListProps) {
  const removeLink = useMutation(api.lessons.removeLink);

  const handleRemoveLink = async (link: string) => {
    const removeToast = toast.loading("Eliminando enlace...");
    try {
      await removeLink({ lessonId, link });
      toast.success("Enlace eliminado exitosamente", { id: removeToast });
    } catch (error) {
      console.log(error);
      toast.error("Ocurrio un error al eliminar el enlace", {
        id: removeToast,
      });
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Enlaces</h2>
      <ul className="space-y-2">
        {links.map((link, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-2 text-accent">•</span>
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {link}
            </a>
            <button
              onClick={() => handleRemoveLink(link)}
              className="ml-2 text-muted-foreground hover:text-foreground"
            >
              <Trash size={16} />
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
