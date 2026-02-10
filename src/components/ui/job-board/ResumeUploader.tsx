// components/job-board/ResumeUploader.tsx
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation"; // <--- Import Router
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FolderOpen, Loader2 } from "lucide-react";
import { uploadResume } from "@/app/actions";
import { toast } from "sonner"; // <--- Import Toast

export default function ResumeUploader() {
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter(); // <--- Initialize Router

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsUploading(true);
    // Show a loading toast that we can dismiss later
    const toastId = toast.loading("Uploading resume...");

    try {
      await uploadResume(formData);
      
      setFileName(""); 
      // Reset the file input so you can upload the same file again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // 1. Success Notification
      toast.success("Resume updated!", {
        description: "Your master resume has been saved.",
        id: toastId, // Replaces the loading spinner with a success check
      });

      // 2. Refresh the UI (Updates the "View PDF" link instantly)
      router.refresh(); 

    } catch (error) {
      // Error Notification
      toast.error("Upload failed", {
        description: "Please try again.",
        id: toastId,
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <form action={handleSubmit} className="flex flex-col gap-4">
      <div className="flex w-full items-center gap-2">
        <input
          type="file"
          name="file"
          accept=".pdf"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          required
        />

        <Input
          placeholder="No file selected..."
          value={fileName}
          readOnly
          className="cursor-pointer bg-muted/50"
          onClick={handleBrowseClick}
        />

        <Button
          type="button"
          variant="secondary"
          onClick={handleBrowseClick}
        >
          <FolderOpen className="mr-2 h-4 w-4" />
          Browse
        </Button>
      </div>

      <Button type="submit" disabled={!fileName || isUploading} className="w-fit">
        {isUploading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload Resume
          </>
        )}
      </Button>
    </form>
  );
}