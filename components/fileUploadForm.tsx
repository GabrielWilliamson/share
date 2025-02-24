import { FormEvent, useState, useRef } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import toast from "react-hot-toast";
import { Id } from "@/convex/_generated/dataModel";

type FileUploadFormProps = {
  lessonId: Id<"lessons">;
};

export default function FileUploadForm({ lessonId }: FileUploadFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addFile = useMutation(api.lessons.addFile);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const handleFileUpload = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsUploading(true);
    const uploadToast = toast.loading("Uploading file...");

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
      toast.success("File uploaded successfully", { id: uploadToast });
    } catch (error) {
      console.error("Error uploading file:", error);
      toast.error("Error uploading file", { id: uploadToast });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <section>
      <h2 className="text-2xl font-semibold mb-4">Upload file</h2>
      <form onSubmit={handleFileUpload} className="space-y-4">
        <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={fileInputRef}
            onChange={(e) => setSelectedFile(e.target.files?.[0] ?? null)}
            className="input"
            required
            disabled={isUploading}
          />
          <button
            type="submit"
            className="btn"
            disabled={!selectedFile || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </form>
    </section>
  );
}
