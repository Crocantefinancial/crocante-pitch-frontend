"use client";

import clsx from "clsx";
import { Eye, Upload } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface DropzoneProps {
  label: string;
  onFileSelect?: (file: File | null) => void;
  accept?: string;
  className?: string;
  disabled?: boolean;
}

export default function Dropzone({
  label,
  onFileSelect,
  accept,
  className,
  disabled = false,
}: DropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const blobUrlRef = useRef<string | null>(null);

  // Clean up blob URL when component unmounts or file changes
  useEffect(() => {
    return () => {
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }
    };
  }, []);

  const handleFile = useCallback(
    (file: File | null) => {
      // Clean up previous blob URL
      if (blobUrlRef.current) {
        URL.revokeObjectURL(blobUrlRef.current);
        blobUrlRef.current = null;
      }

      setSelectedFile(file);
      onFileSelect?.(file);

      // Create new blob URL for preview
      if (file) {
        blobUrlRef.current = URL.createObjectURL(file);
      }
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragging(true);
      }
    },
    [disabled]
  );

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      if (disabled) return;

      const file = e.dataTransfer.files[0];
      if (file) {
        handleFile(file);
      }
    },
    [disabled, handleFile]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0] || null;
      handleFile(file);
    },
    [handleFile]
  );

  const handleClick = useCallback(() => {
    if (!disabled) {
      document.getElementById(`dropzone-input-${label}`)?.click();
    }
  }, [label, disabled]);

  const handlePreview = useCallback((e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering file input
    if (blobUrlRef.current) {
      window.open(blobUrlRef.current, "_blank");
    }
  }, []);

  return (
    <div
      className={clsx(
        "w-full h-10 rounded-lg font-normal text-sm leading-none transition-all duration-200",
        "border border-secondary text-foreground",
        "flex items-center justify-between gap-2 cursor-pointer",
        "px-3",
        isDragging && "border-primary bg-secondary/50",
        !isDragging &&
          !selectedFile &&
          "hover:bg-secondary hover:border-secondary",
        selectedFile && "border-primary bg-primary/5",
        disabled &&
          "bg-disabled border-disabled text-muted-foreground cursor-not-allowed",
        className
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        id={`dropzone-input-${label}`}
        type="file"
        accept={accept}
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Upload
          className={clsx(
            "w-4 h-4 flex-shrink-0",
            selectedFile ? "text-primary" : "text-muted-foreground"
          )}
        />
        <span
          className={clsx(
            "text-xs truncate",
            selectedFile ? "text-primary font-medium" : "text-neutral"
          )}
        >
          {selectedFile ? selectedFile.name : label}
        </span>
      </div>
      {selectedFile && (
        <button
          type="button"
          onClick={handlePreview}
          className={clsx(
            "flex-shrink-0 p-1 rounded hover:bg-secondary transition-colors",
            "text-primary hover:text-primary",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          aria-label="Preview file"
          disabled={disabled}
        >
          <Eye className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
