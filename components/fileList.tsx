import { useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Trash } from "lucide-react";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";

type FileListProps = {
  lessonId: Id<"lessons">;
  files: { fileName: string; storageId: string }[];
};

export default function FileList({ lessonId, files }: FileListProps) {
  const removeFile = useMutation(api.lessons.removeFile);
  const getFileUrl = useAction(api.files.getFileUrl);

  const handleRemoveFile = async (storageId: string) => {
    const removeToast = toast.loading("Removing file...");
    try {
      await removeFile({ lessonId, storageId });
      toast.success("Archivo eliminado exitosamente", { id: removeToast });
    } catch (error) {
      console.log(error);
      toast.error("Ocurrio un error al eliminar el archivo", {
        id: removeToast,
      });
    }
  };

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Archivos</h2>
      <ul className="space-y-2">
        {files.map((file, index) => (
          <li key={index} className="flex items-center">
            <span className="mr-2 text-accent">•</span>
            <button
              onClick={async () => {
                const url = await getFileUrl({
                  storageId: file.storageId,
                });
                if (url) window.open(url, "_blank");
              }}
              className="text-accent hover:underline"
            >
              {file.fileName}
            </button>
            <button
              onClick={() => handleRemoveFile(file.storageId)}
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
