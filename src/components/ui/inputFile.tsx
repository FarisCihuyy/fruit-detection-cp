"use client";

import { Upload } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { Button } from "./button";
import { DataTable } from "../DataTable";
import { columns } from "@/data/predict-columns";

interface FruitDetection {
  id: number;
  class: string;
  condition: "busuk" | "segar";
  segar_confidence: number;
  busuk_confidence: number;
  box: [number, number, number, number];
  is_fallback: boolean;
}

interface PredictionResult {
  fruits_detected: FruitDetection[];
  processing_time_ms?: number;
}

interface FileDropzoneProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  apiUrl?: string;
  onFilesChange?: (file: File | null) => void;
}

export default function FileDropzone({
  accept = "image/*",
  multiple = false,
  maxSizeMB = 5,
  apiUrl = process.env.NEXT_PUBLIC_BASE_URL as string,
  onFilesChange,
}: FileDropzoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [predictedImage, setPredictedImage] = useState<string | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const drawBoundingBoxes = useCallback(
    (imageUrl: string, detections: FruitDetection[]): Promise<string> => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";

        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              reject(new Error("Could not get canvas context"));
              return;
            }

            ctx.drawImage(img, 0, 0);

            const colors = [
              "#FF6B6B",
              "#4ECDC4",
              "#45B7D1",
              "#FFA07A",
              "#98D8C8",
            ];

            detections.forEach((detection, index) => {
              const [ymin, xmin, ymax, xmax] = detection.box;
              const width = xmax - xmin;
              const height = ymax - ymin;

              ctx.strokeStyle = colors[index % colors.length];
              ctx.lineWidth = 3;
              ctx.strokeRect(xmin, ymin, width, height);

              const label = `${detection.class} - ${detection.condition}`;
              const confidence =
                Math.max(
                  detection.segar_confidence,
                  detection.busuk_confidence,
                ) * 100;
              const text = `${label} (${confidence.toFixed(1)}%)`;

              ctx.font = "bold 14px Arial";
              ctx.fillStyle = colors[index % colors.length];
              const textWidth = ctx.measureText(text).width;
              ctx.fillRect(xmin, ymin - 28, textWidth + 10, 28);

              ctx.fillStyle = "#FFF";
              ctx.fillText(text, xmin + 5, ymin - 10);
            });

            const dataUrl = canvas.toDataURL("image/png");
            resolve(dataUrl);
          } catch (err) {
            reject(err);
          }
        };

        img.onerror = () => {
          reject(new Error("Failed to load image"));
        };

        img.src = imageUrl;
      });
    },
    [],
  );

  const predictImage = useCallback(
    async (imageFile: File, previewUrl: string) => {
      setIsPredicting(true);

      try {
        const formData = new FormData();
        formData.append("image", imageFile);

        const response = await fetch(`${apiUrl}/predict`, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data = (await response.json()) as PredictionResult;

        setPrediction(data);

        if (data.fruits_detected && data.fruits_detected.length > 0) {
          try {
            const imageWithBoxes = await drawBoundingBoxes(
              previewUrl,
              data.fruits_detected,
            );
            setPredictedImage(imageWithBoxes);
          } catch (err) {
            console.error("Error drawing bounding boxes:", err);
            setError("Failed to draw bounding boxes on image");
          }
        }
      } catch (err) {
        setError(
          `Prediksi gagal: ${err instanceof Error ? err.message : String(err)}`,
        );
      } finally {
        setIsPredicting(false);
      }
    },
    [apiUrl, drawBoundingBoxes],
  );

  const validateAndSetFile = useCallback(
    (incoming: FileList | File[]) => {
      setError(null);
      const arr = Array.from(incoming);

      if (arr.length === 0) return;

      const selectedFile = arr[0];

      if (selectedFile.size > maxSizeMB * 1024 * 1024) {
        setError(`File exceeds ${maxSizeMB} MB limit.`);
        return;
      }

      setFile(selectedFile);
      onFilesChange?.(selectedFile);
      setPrediction(null);
      setPredictedImage(null);
      setIsPredicting(false);

      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const previewUrl = e.target?.result as string;
          setPreview(previewUrl);
          predictImage(selectedFile, previewUrl);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    },
    [maxSizeMB, onFilesChange, predictImage],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) validateAndSetFile(e.dataTransfer.files);
    },
    [validateAndSetFile],
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
    if (e.target.files?.length) validateAndSetFile(e.target.files);
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    setPrediction(null);
    setPredictedImage(null);
    onFilesChange?.(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-4">
      {!file && (
        <div
          onClick={handleClick}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={[
            "relative flex flex-col items-center justify-center",
            "w-full min-h-66 rounded-2xl cursor-pointer",
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
      )}

      {error && (
        <p className="mt-3 text-sm text-red-500 font-medium pl-1">{error}</p>
      )}

      {file && (
        <div>
          <div className="flex flex-col p-4 bg-sidebar rounded border shadow">
            <div className="flex items-center gap-3 w-full mb-4">
              <h3 className="flex-1 text-sm font-semibold text-primary/80 line-clamp-1">
                {file.name}
              </h3>
              <Button
                type="button"
                size="xs"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile();
                }}
                className=" text-background bg-accent hover:bg-accent/80 rounded-sm cursor-pointer"
              >
                Predict Another Image
              </Button>
            </div>

            {preview && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-primary/80 font-light uppercase mb-2">
                    Original Image
                  </p>
                  <div className="relative w-full rounded-lg bg-[#EEEFE8]">
                    <div className="relative p-4 w-full h-full grid place-items-center">
                      <Image
                        src={preview}
                        alt={`${file.name} - before`}
                        className="object-contain"
                        width={250}
                        height={250}
                      />
                    </div>

                    {isPredicting && (
                      <div className="absolute inset-0 bg-primary/30 flex items-center justify-center">
                        <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs text-primary/80 font-light uppercase mb-2">
                    Results
                  </p>
                  {isPredicting ? (
                    <div className="relative w-full h-full rounded-lg overflow-hidden bg-[#EEEFE8] flex items-center justify-center">
                      <div className="w-8 h-8 border-4 border-[#8DB887] border-t-transparent rounded-full animate-spin" />
                    </div>
                  ) : predictedImage ? (
                    <div className="relative w-full rounded-lg bg-[#EEEFE8]">
                      <div className="relative p-4 w-full h-full grid place-items-center">
                        <Image
                          src={predictedImage}
                          alt={`${file.name} - after`}
                          className="object-contain"
                          width={250}
                          height={250}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="relative w-full rounded-lg overflow-hidden bg-[#f7f7f5]" />
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {!isPredicting &&
        prediction?.fruits_detected &&
        prediction.fruits_detected.length > 0 && (
          <div className="container mx-auto space-y-2 bg-sidebar shadow p-4 rounded">
            <h2 className="text-xs font-light uppercase">Table of results</h2>
            <DataTable columns={columns} data={prediction.fruits_detected} />
          </div>
        )}
    </div>
  );
}
