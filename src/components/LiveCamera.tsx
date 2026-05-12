"use client";

import { Camera } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
  label?: string;
  confidence?: number;
  color?: string;
}

interface LiveCameraProps {
  onFrame?: (blob: Blob, canvas: HTMLCanvasElement) => void;
  captureInterval?: number;
  detections?: BoundingBox[];
  maxWidth?: number;
  maxHeight?: number;
}

type Status = "idle" | "loading" | "active" | "error";

const CORNER = 14;

function drawCornerBracket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  dir: [number, number],
) {
  ctx.beginPath();
  ctx.moveTo(x + dir[0] * CORNER, y);
  ctx.lineTo(x, y);
  ctx.lineTo(x, y + dir[1] * CORNER);
  ctx.stroke();
}

function drawDetections(
  ctx: CanvasRenderingContext2D,
  boxes: BoundingBox[],
  W: number,
  H: number,
) {
  boxes.forEach((box) => {
    const bx = box.x * W;
    const by = box.y * H;
    const bw = box.width * W;
    const bh = box.height * H;
    const color = box.color ?? "#4ade80";

    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.strokeRect(bx, by, bw, bh);
    ctx.setLineDash([]);

    // Corner brackets
    ctx.strokeStyle = color;
    ctx.lineWidth = 2.5;
    drawCornerBracket(ctx, bx, by, [1, 1]);
    drawCornerBracket(ctx, bx + bw, by, [-1, 1]);
    drawCornerBracket(ctx, bx, by + bh, [1, -1]);
    drawCornerBracket(ctx, bx + bw, by + bh, [-1, -1]);

    // Label
    if (box.label) {
      const conf =
        box.confidence !== undefined
          ? ` ${Math.round(box.confidence * 100)}%`
          : "";
      const text = `${box.label}${conf}`;
      ctx.font = "600 11px 'DM Mono', monospace";
      const tw = ctx.measureText(text).width;
      const padX = 6;
      const padY = 4;
      const lh = 13;

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(
        bx - 0.5,
        by - lh - padY * 2,
        tw + padX * 2,
        lh + padY * 2,
        3,
      );
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.fillText(text, bx + padX - 0.5, by - padY - 1);
    }
  });
}

export default function LiveCamera({
  onFrame,
  captureInterval = 200,
  detections = [],
  maxWidth = 660,
  maxHeight = 480,
}: LiveCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const rafRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [dims, setDims] = useState({ w: maxWidth, h: maxHeight });
  const [fps, setFps] = useState(0);
  const fpsCounter = useRef({ frames: 0, last: Date.now() });

  // Draw video + overlay loop
  const drawLoop = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (!video || !canvas || !overlay || video.readyState < 2) {
      rafRef.current = requestAnimationFrame(drawLoop);
      return;
    }

    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    fpsCounter.current.frames++;
    const now = Date.now();
    if (now - fpsCounter.current.last >= 1000) {
      setFps(fpsCounter.current.frames);
      fpsCounter.current = { frames: 0, last: now };
    }

    const octx = overlay.getContext("2d")!;
    octx.clearRect(0, 0, overlay.width, overlay.height);
    if (detections.length > 0) {
      drawDetections(octx, detections, overlay.width, overlay.height);
    }

    rafRef.current = requestAnimationFrame(drawLoop);
  }, [detections]);

  const startCamera = useCallback(async () => {
    setStatus("loading");
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: maxWidth },
          height: { ideal: maxHeight },
          facingMode: "environment",
        },
        audio: false,
      });
      streamRef.current = stream;

      const video = videoRef.current!;
      video.srcObject = stream;
      await video.play();

      const vw = video.videoWidth || maxWidth;
      const vh = video.videoHeight || maxHeight;

      // Fit within max bounds
      const scale = Math.min(maxWidth / vw, maxHeight / vh, 1);
      const w = Math.round(vw * scale);
      const h = Math.round(vh * scale);
      setDims({ w, h });

      if (canvasRef.current) {
        canvasRef.current.width = w;
        canvasRef.current.height = h;
      }
      if (overlayRef.current) {
        overlayRef.current.width = w;
        overlayRef.current.height = h;
      }

      setStatus("active");
      rafRef.current = requestAnimationFrame(drawLoop);

      // Frame capture interval
      if (onFrame) {
        intervalRef.current = setInterval(() => {
          const c = canvasRef.current;
          if (!c) return;
          c.toBlob(
            (blob) => {
              if (blob) onFrame(blob, c);
            },
            "image/jpeg",
            0.85,
          );
        }, captureInterval);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Camera unavailable";
      setError(msg);
      setStatus("error");
    }
  }, [maxWidth, maxHeight, captureInterval, onFrame, drawLoop]);

  const stopCamera = useCallback(() => {
    cancelAnimationFrame(rafRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    // Clear canvases
    const canvas = canvasRef.current;
    const overlay = overlayRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (overlay) {
      const octx = overlay.getContext("2d");
      if (octx) octx.clearRect(0, 0, overlay.width, overlay.height);
    }

    setStatus("idle");
    setFps(0);
  }, []);

  // Re-draw overlay when detections change without restarting stream
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || status !== "active") return;
    const octx = overlay.getContext("2d")!;
    octx.clearRect(0, 0, overlay.width, overlay.height);
    drawDetections(octx, detections, overlay.width, overlay.height);
  }, [detections, status]);

  useEffect(() => () => stopCamera(), [stopCamera]);

  const isActive = status === "active";
  const isLoading = status === "loading";

  return (
    <div className="flex flex-col border items-center gap-4 select-none">
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{ width: dims.w, height: dims.h, maxWidth: "100%" }}
      >
        <video
          ref={videoRef}
          className="absolute opacity-0 pointer-events-none"
          muted
          playsInline
        />

        <canvas
          ref={canvasRef}
          width={dims.w}
          height={dims.h}
          className={[
            "absolute inset-0 w-full h-full transition-opacity duration-500",
            isActive ? "opacity-100" : "opacity-0",
          ].join(" ")}
        />

        <canvas
          ref={overlayRef}
          width={dims.w}
          height={dims.h}
          className="absolute inset-0 w-full h-full pointer-events-none"
        />

        {!isActive && !isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="absolute inset-0 bg-white" />
            <div className="relative flex flex-col items-center gap-3">
              {/* Camera icon */}
              <Camera />

              {error ? (
                <p className="text-[#ef4444] text-xs font-mono text-center max-w-[220px]">
                  {error}
                </p>
              ) : (
                <p className="text-[#3a3a3a] text-xs font-mono tracking-widest uppercase">
                  Camera off
                </p>
              )}
            </div>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-1.5 h-1.5 rounded-full bg-[#4ade80] animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Active HUD */}
        {isActive && (
          <>
            {/* REC indicator */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-white/80 text-[10px] font-mono tracking-widest uppercase">
                Live
              </span>
            </div>

            {/* FPS */}
            <div className="absolute top-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
              <span className="text-white/60 text-[10px] font-mono">
                {fps} fps
              </span>
            </div>

            {/* Detections count */}
            {detections.length > 0 && (
              <div className="absolute bottom-3 right-3 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1">
                <span className="text-[#4ade80] text-[10px] font-mono">
                  {detections.length} obj detected
                </span>
              </div>
            )}

            {/* Corner frame decoration */}
            <div className="absolute inset-0 pointer-events-none">
              {/* TL */}
              <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-white/20 rounded-tl-xl" />
              {/* TR */}
              <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-white/20 rounded-tr-xl" />
              {/* BL */}
              <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-white/20 rounded-bl-xl" />
              {/* BR */}
              <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-white/20 rounded-br-xl" />
            </div>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3">
        {!isActive ? (
          <button
            onClick={startCamera}
            disabled={isLoading}
            className={[
              "flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium",
              "transition-all duration-200",
              isLoading
                ? "bg-[#1a1a1a] cursor-not-allowed"
                : "bg-[#0d0d0d] active:scale-95",
            ].join(" ")}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            {isLoading ? "Connecting…" : "Start Camera"}
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium active:scale-95 transition-all duration-200"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="6" width="12" height="12" rx="1" />
            </svg>
            Stop Camera
          </button>
        )}
      </div>
    </div>
  );
}
