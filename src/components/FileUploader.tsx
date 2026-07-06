"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { UploadCloud, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import clsx from "clsx";

interface FileUploaderProps {
  label: string;
  folder: "moderators/id-documents" | "moderators/face-photos";
  onUploadSuccess: (url: string) => void;
  value?: string;
}

export function FileUploader({ label, folder, onUploadSuccess, value }: FileUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 10MB.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Upload failed");
      }

      onUploadSuccess(data.url);
      toast.success("File uploaded successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error?.message || "Failed to upload file");
    } finally {
      setIsUploading(false);
    }
  }, [folder, onUploadSuccess]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 1,
  });

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-white/80 mb-2">{label}</label>
      <div
        {...getRootProps()}
        className={clsx(
          "w-full h-32 rounded-xl border-2 border-dashed flex flex-col items-center justify-center p-4 transition-colors cursor-pointer relative overflow-hidden",
          isDragActive ? "border-gold bg-gold/5" : "border-white/10 hover:border-gold/30 bg-black/20",
          value ? "border-green-500/50 bg-green-500/5" : ""
        )}
      >
        <input {...getInputProps()} />
        
        {isUploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-gold animate-spin" />
            <p className="text-sm text-gold">Uploading...</p>
          </div>
        ) : value ? (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center gap-2 text-green-500"
          >
            <CheckCircle2 className="w-8 h-8" />
            <p className="text-sm">Uploaded successfully. Click to replace.</p>
          </motion.div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-white/50">
            <UploadCloud className="w-8 h-8 group-hover:text-gold transition-colors" />
            <p className="text-sm text-center">
              <span className="text-gold font-medium">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs">JPG, PNG, PDF up to 10MB</p>
          </div>
        )}
      </div>
    </div>
  );
}
