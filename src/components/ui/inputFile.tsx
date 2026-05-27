"use client";

import { Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

// ✅ Tidak ada lagi import TensorFlow — semua prediksi lewat API

interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PredictionResult {
  label: string;
  class: string;
  confidence: number;
  processing_time_ms: number;
  boundingBox: BoundingBox;
  allProbabilities: { name: string; confidence: number }[];
}

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  apiUrl?: string; // ← URL API, default: http://localhost:3001/api/predict
  onFilesChange?: (files: File[]) => void;
}

export default function FileDropzone({
  accept = "image/*",
  multiple = false,
  maxSizeMB = 10,
  apiUrl = "http://localhost:3001/api/predict",
  onFilesChange,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [predictions, setPredictions] = useState<{
    [key: number]: PredictionResult | null;
  }>({});
  const [isPredicting, setIsPredicting] = useState<{ [key: number]: boolean }>(
    {},
  );
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  // ─── Fungsi Hit API ────────────────────────────────────────────
  const predictImage = useCallback(
    async (file: File, index: number) => {
      setIsPredicting((prev) => ({ ...prev, [index]: true }));

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch(apiUrl, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errBody = await response.json().catch(() => ({}));
          throw new Error(errBody.error || `HTTP ${response.status}`);
        }

        const { data } = await response.json();

        setPredictions((prev) => ({
          ...prev,
          [index]: {
            label: data.kondisi,
            class: data.buah,
            confidence: data.confidence,
            processing_time_ms: data.processing_time_ms,
            boundingBox: {
              x: data.bounding_box.x_min_pct,
              y: data.bounding_box.y_min_pct,
              width: data.bounding_box.width_pct,
              height: data.bounding_box.height_pct,
            },
            allProbabilities: data.all_probabilities.map(
              (p: { class: string; confidence: number }) => ({
                name: p.class,
                confidence: p.confidence,
              }),
            ),
          },
        }));
      } catch (err) {
        setError(
          `Prediksi gagal: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setIsPredicting((prev) => ({ ...prev, [index]: false }));
      }
    },
    [apiUrl],
  );

  // ─── File Handling ─────────────────────────────────────────────
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
      setPredictions({});
      setIsPredicting({});

      const newPreviews: string[] = [];
      let loaded = 0;

      selected.forEach((file, index) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (e) => {
            newPreviews[index] = e.target?.result as string;
            loaded++;
            if (loaded === selected.length) {
              setPreviews([...newPreviews]);
              // ✅ Kirim File langsung ke API, tidak perlu konversi base64
              selected.forEach((f, idx) => predictImage(f, idx));
            }
          };
          reader.readAsDataURL(file);
        } else {
          newPreviews[index] = "";
          loaded++;
          if (loaded === selected.length) setPreviews([...newPreviews]);
        }
      });
    },
    [maxSizeMB, multiple, onFilesChange, predictImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length)
        validateAndSetFiles(e.dataTransfer.files);
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
    if (e.target.files?.length) validateAndSetFiles(e.target.files);
  };

  const removeFile = (idx: number) => {
    const updatedPredictions = { ...predictions };
    delete updatedPredictions[idx];
    setFiles((f) => f.filter((_, i) => i !== idx));
    setPreviews((p) => p.filter((_, i) => i !== idx));
    setPredictions(updatedPredictions);
    onFilesChange?.(files.filter((_, i) => i !== idx));
    if (inputRef.current) inputRef.current.value = "";
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // ─── Render ────────────────────────────────────────────────────
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
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
        />

        <div
          className={[
            "mb-4 transition-transform duration-300",
            isDragging ? "scale-110 -translate-y-1" : "",
          ].join(" ")}
        >
          <Upload className="text-[#3d3d3a]" size={40} />
        </div>

        <p className="text-[#3d3d3a] text-[15px] font-medium tracking-wide">
          {isDragging
            ? "Drop your image here"
            : "Upload or Drop your image here"}
        </p>
        <p className="mt-1.5 text-[#8a8a80] text-[13px]">
          Max {maxSizeMB} MB · {accept}
        </p>

        {isDragging && (
          <div className="absolute inset-2 rounded-xl border-2 border-[#8DB887]/50 pointer-events-none animate-pulse" />
        )}
      </div>

      {/* Error */}
      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium pl-1">{error}</p>
      )}

      {/* File List */}
      {files.length > 0 && (
        <ul className="mt-4 space-y-3">
          {files.map((file, idx) => (
            <li
              key={idx}
              className="flex flex-col p-4 bg-white rounded-xl border border-[#e0e0d8] shadow-sm"
            >
              {/* Header */}
              <div className="flex items-center gap-3 w-full mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-medium text-[#3d3d3a] truncate">
                    {file.name}
                  </p>
                  <p className="text-[12px] text-[#8a8a80]">
                    {formatSize(file.size)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#EEEFE8] text-[#aaa] hover:text-red-500 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Preview + Bounding Box */}
              {previews[idx] && (
                <div
                  className="relative w-full rounded-lg overflow-hidden bg-[#EEEFE8]"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <img
                    src={previews[idx]}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />

                  {predictions[idx] &&
                    (() => {
                      const box = predictions[idx]!.boundingBox;
                      const color =
                        predictions[idx]!.label === "busuk"
                          ? "#dc2626"
                          : "#16a34a";
                      return (
                        <>
                          <div
                            className="absolute pointer-events-none"
                            style={{
                              left: `${box.x}%`,
                              top: `${box.y}%`,
                              width: `${box.width}%`,
                              height: `${box.height}%`,
                              border: `2.5px solid ${color}`,
                              borderRadius: "6px",
                              boxShadow: "0 0 0 1px rgba(0,0,0,0.15)",
                            }}
                          />
                          <div
                            className="absolute pointer-events-none px-2 py-0.5 text-white text-[11px] font-bold rounded"
                            style={{
                              left: `${box.x}%`,
                              top: `calc(${box.y}% - 22px)`,
                              backgroundColor: color,
                              whiteSpace: "nowrap",
                            }}
                          >
                            {predictions[idx]!.class} —{" "}
                            {predictions[idx]!.label}{" "}
                            {(predictions[idx]!.confidence * 100).toFixed(1)}%
                          </div>
                        </>
                      );
                    })()}

                  {isPredicting[idx] && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              )}

              {/* Hasil Deteksi */}
              <div className="mt-3 pt-3 border-t border-dashed border-[#e0e0d8]">
                {isPredicting[idx] ? (
                  <p className="text-sm text-blue-600 animate-pulse font-medium">
                    Menganalisis gambar...
                  </p>
                ) : predictions[idx] ? (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-[13px]">
                      <div className="bg-[#f7f7f5] p-2 rounded flex justify-between">
                        <span className="text-[#8a8a80]">Kelas:</span>
                        <span className="font-semibold capitalize text-[#3d3d3a]">
                          {predictions[idx]?.class}
                        </span>
                      </div>
                      <div className="bg-[#f7f7f5] p-2 rounded flex justify-between">
                        <span className="text-[#8a8a80]">Kondisi:</span>
                        <span
                          className={`font-semibold capitalize ${predictions[idx]?.label === "busuk" ? "text-red-600" : "text-green-600"}`}
                        >
                          {predictions[idx]?.label}
                        </span>
                      </div>
                      <div className="bg-[#f7f7f5] p-2 rounded flex justify-between">
                        <span className="text-[#8a8a80]">Akurasi:</span>
                        <span className="font-semibold text-[#3d3d3a]">
                          {((predictions[idx]?.confidence || 0) * 100).toFixed(
                            1,
                          )}
                          %
                        </span>
                      </div>
                      <div className="bg-[#f7f7f5] p-2 rounded flex justify-between">
                        <span className="text-[#8a8a80]">Waktu:</span>
                        <span className="font-semibold text-[#3d3d3a]">
                          {predictions[idx]?.processing_time_ms.toFixed(0)} ms
                        </span>
                      </div>
                    </div>

                    {/* Bar probabilitas */}
                    <div className="mt-3">
                      <p className="text-[11px] text-[#8a8a80] mb-1.5 font-medium uppercase tracking-wide">
                        Semua Probabilitas
                      </p>
                      <div className="space-y-1.5">
                        {predictions[idx]?.allProbabilities.map((p) => {
                          const isTop =
                            p.name ===
                            predictions[idx]!.allProbabilities[0].name;
                          const color = isTop
                            ? predictions[idx]!.label === "busuk"
                              ? "#dc2626"
                              : "#16a34a"
                            : "#A8C5A2";
                          return (
                            <div
                              key={p.name}
                              className="flex items-center gap-2 text-[11px]"
                            >
                              <span className="w-28 text-[#3d3d3a] truncate shrink-0">
                                {p.name}
                              </span>
                              <div className="flex-1 bg-[#EEEFE8] rounded-full h-2 overflow-hidden">
                                <div
                                  className="h-2 rounded-full transition-all duration-500"
                                  style={{
                                    width: `${(p.confidence * 100).toFixed(1)}%`,
                                    backgroundColor: color,
                                  }}
                                />
                              </div>
                              <span className="w-10 text-right text-[#8a8a80] shrink-0">
                                {(p.confidence * 100).toFixed(1)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
