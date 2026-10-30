"use client";

import {
  ChevronLeft,
  ChevronRight,
  MinusIcon,
  PlusIcon,
  RefreshCwIcon,
  X,
} from "lucide-react";
import moment from "moment";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import images from "~/assets/images";

const IMAGE_VIEWER_Z_INDEX = 99999;

const ImageViewer = ({ onClose, item, image, images }: any) => {
  const gallery =
    Array.isArray(images) && images.length > 0 ? images : image ? [image] : [];
  const canNavigate = gallery.length > 1;

  const [mounted, setMounted] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const idx = gallery.findIndex(
      (img: any) => img?.id === image?.id || img?.file_link === image?.file_link
    );
    return idx >= 0 ? idx : 0;
  });

  const currentImage = gallery[currentIndex] || image;

  const resetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const goTo = (nextIndex: number) => {
    if (!canNavigate) return;
    const total = gallery.length;
    setCurrentIndex(((nextIndex % total) + total) % total);
    resetView();
  };

  const goPrev = () => goTo(currentIndex - 1);
  const goNext = () => goTo(currentIndex + 1);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  // Constants for zoom steps and limits
  const ZOOM_STEP = 0.25;
  const MAX_ZOOM = 3;
  const MIN_ZOOM = 0.5;

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose, currentIndex, canNavigate, gallery.length]);

  // Function to handle zooming in
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  // Function to handle zooming out
  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const handleReset = () => {
    resetView();
  };

  const zoomProgress = ((zoomLevel - MIN_ZOOM) / (MAX_ZOOM - MIN_ZOOM)) * 100;

  if (!mounted) return null;

  return createPortal(
    <div
      data-message-preview
      className="fixed inset-0 bg-black/90 flex flex-col justify-between p-4"
      style={{ zIndex: IMAGE_VIEWER_Z_INDEX }}
    >
      <div className="relative flex justify-between items-start text-white">
        <div className="flex items-center gap-3">
          <Image
            src={item?.avatar_url || item?.default_avatar_url}
            width={80}
            height={80}
            alt="Image thumbnail"
            unoptimized
            className="h-10 w-10 rounded border object-cover"
          />

          <div className="overflow-hidden">
            <p className="font-medium">{item?.username}</p>
            <p className="flex flex-wrap text-sm text-gray-300">
              {moment(item.created_at).startOf("minute").fromNow()} in #
              {item?.channel_name} – {currentImage?.file_name}
              {canNavigate ? ` (${currentIndex + 1}/${gallery.length})` : ""}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close image preview"
          title="Close"
          className="absolute right-5 sm:top-5 text-white hover:text-gray-300"
        >
          <X size={24} />
        </button>
      </div>

      {/* Center image */}
      <div className="relative flex-grow flex items-center justify-center overflow-hidden">
        {canNavigate && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-2 sm:left-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Previous image"
          >
            <ChevronLeft size={28} />
          </button>
        )}

        <img
          src={currentImage?.file_link}
          alt={currentImage?.file_name || "full image"}
          style={{
            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
            transition: "transform 0.1s ease-out", // Smooth transition for visual effect
          }}
          className="max-h-[90vh] max-w-full object-contain"
        />

        {canNavigate && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-2 sm:right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
            aria-label="Next image"
          >
            <ChevronRight size={28} />
          </button>
        )}
      </div>

      <div className="flex justify-between items-center text-white">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleReset}
            className="px-2 py-1 border rounded hover:bg-white/10"
            aria-label="Reset zoom and rotation"
            title="Reset Zoom & Rotation"
          >
            <RefreshCwIcon size={18} />
          </button>

          <button
            type="button"
            onClick={handleZoomOut}
            className="px-2 py-1 border rounded hover:bg-white/10"
            aria-label="Zoom out"
            title="Zoom Out"
          >
            <MinusIcon size={18} />
          </button>

          <div className="w-24 h-1 bg-gray-600 rounded-full relative overflow-hidden">
            <div
              className="absolute h-full bg-white rounded-full"
              style={{
                width: `${zoomProgress}%`,
                left: "0%",
              }}
            ></div>
          </div>

          <button
            type="button"
            onClick={handleZoomIn}
            className="px-2 py-1 border rounded hover:bg-white/10"
            aria-label="Zoom in"
            title="Zoom In"
          >
            <PlusIcon size={18} />
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ImageViewer;
