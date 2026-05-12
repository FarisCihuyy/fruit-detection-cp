"use client";

import { useCallback, useRef, useState } from "react";

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFilesChange?: (files: File[]) => void;
}

export default function FileDropzone({
  accept = "image/*",
  multiple = false,
  maxSizeMB = 10,
  onFilesChange,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateAndSetFiles = useCallback(
    (incoming: FileList | File[]) => {
      setError(null);
      const arr = Array.from(incoming);

      const oversized = arr.filter((f) => f.size > maxSizeMB * 1024 * 1024);
      if (oversized.length) {
        setError(
          `File${oversized.length > 1 ? "s" : ""} exceed ${maxSizeMB} MB limit.`,
        );
        return;
      }

      const selected = multiple ? arr : [arr[0]];
      setFiles(selected);
      onFilesChange?.(selected);

      // generate previews for images
      const newPreviews: string[] = [];
      let loaded = 0;
      selected.forEach((file) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newPreviews.push(e.target?.result as string);
            loaded++;
            if (loaded === selected.length) setPreviews([...newPreviews]);
          };
          reader.readAsDataURL(file);
        } else {
          newPreviews.push("");
          loaded++;
          if (loaded === selected.length) setPreviews([...newPreviews]);
        }
      });
    },
    [maxSizeMB, multiple, onFilesChange],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) {
        validateAndSetFiles(e.dataTransfer.files);
      }
    },
    [validateAndSetFiles],
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleClick = () => inputRef.current?.click();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      validateAndSetFiles(e.target.files);
    }
  };

  const removeFile = (idx: number) => {
    const updated = files.filter((_, i) => i !== idx);
    const updatedPreviews = previews.filter((_, i) => i !== idx);
    setFiles(updated);
    setPreviews(updatedPreviews);
    onFilesChange?.(updated);
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="w-full max-w-2xl mx-auto font-[system-ui]">
      {/* Drop Zone */}
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          "relative flex flex-col items-center justify-center",
          "w-full min-h-[280px] rounded-2xl cursor-pointer",
          "transition-all duration-300 ease-in-out select-none",
          "border-2 border-dashed",
          isDragging
            ? "border-[#8DB887] bg-[#8DB887]/10 scale-[1.01]"
            : "border-[#A8C5A2] bg-[#EEEFE8] hover:border-[#8DB887] hover:bg-[#8DB887]/5",
        ].join(" ")}
        style={{ borderSpacing: "8px" }}
      >
        {/* Hidden input */}
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        {/* Upload Icon */}
        <div
          className={[
            "mb-4 transition-transform duration-300",
            isDragging ? "scale-110 -translate-y-1" : "",
          ].join(" ")}
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[#3d3d3a]"
          >
            <path
              d="M24 32V16M24 16L16 24M24 16L32 24"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M10 36H38"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Text */}
        <p className="text-[#3d3d3a] text-[15px] font-medium tracking-wide">
          {isDragging
            ? "Drop your image here"
            : "Upload or Drop your image here"}
        </p>
        <p className="mt-1.5 text-[#8a8a80] text-[13px]">
          Max {maxSizeMB} MB · {accept}
        </p>

        {/* Drag overlay ring */}
        {isDragging && (
          <div className="absolute inset-2 rounded-xl border-2 border-[#8DB887]/50 pointer-events-none animate-pulse" />
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium pl-1">{error}</p>
      )}

      {/* File list */}
      {files.length > 0 && (
        <ul className="mt-4 space-y-2">
          {files.map((file, idx) => (
            <li
              key={idx}
              className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-[#e0e0d8] shadow-sm"
            >
              {/* Thumbnail or icon */}
              {previews[idx] ? (
                <img
                  src={previews[idx]}
                  alt={file.name}
                  className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#EEEFE8] flex items-center justify-center flex-shrink-0">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    className="text-[#8a8a80]"
                  >
                    <path
                      d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <polyline
                      points="14 2 14 8 20 8"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              )}

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-medium text-[#3d3d3a] truncate">
                  {file.name}
                </p>
                <p className="text-[12px] text-[#8a8a80]">
                  {formatSize(file.size)}
                </p>
              </div>

              {/* Remove */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(idx);
                }}
                className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full hover:bg-[#EEEFE8] text-[#aaa] hover:text-[#555] transition-colors"
                aria-label="Remove file"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path
                    d="M1 1l12 12M13 1L1 13"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
