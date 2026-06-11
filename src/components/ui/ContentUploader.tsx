/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, X, Image as ImageIcon, FileAudio, Box, FileVideo, AlertCircle } from "lucide-react";
import { ShowcaseMedia } from "@/types";


interface ContentUploaderProps {
  onFilesChange: (files: ShowcaseMedia[]) => void;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "video/mp4",
  "video/webm",
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "model/gltf-binary", // .glb
  "model/gltf+json",   // .gltf
];

const ALLOWED_EXTENSIONS = [".glb", ".gltf"];

const BLOCKED_EXTENSIONS = [
  ".zip",
  ".rar",
  ".7z",
  ".tar",
  ".gz",
  ".unitypackage",
];

export function ContentUploader({ onFilesChange }: ContentUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [mediaList, setMediaList] = useState<ShowcaseMedia[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const fileName = file.name.toLowerCase();
    
    // Check explicitly blocked extensions
    if (BLOCKED_EXTENSIONS.some(ext => fileName.endsWith(ext))) {
      setError(`Project archives (${fileName}) are not allowed. Please upload showcase content only (images, videos, models).`);
      return false;
    }

    // Check allowed mime types or extensions
    const isValidType = ALLOWED_TYPES.includes(file.type) || ALLOWED_EXTENSIONS.some(ext => fileName.endsWith(ext));
    if (!isValidType) {
      setError(`File type not supported: ${file.name}`);
      return false;
    }

    return true;
  };

  const getMediaType = (file: File): ShowcaseMedia["type"] => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    return "model";
  };

  const generateVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      const url = URL.createObjectURL(file);
      video.src = url;
      video.muted = true;
      video.playsInline = true;
      video.currentTime = 1; // Seek to 1 second
      
      video.onloadeddata = () => {
        video.play().then(() => {
          setTimeout(() => {
            video.pause();
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext("2d");
            ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL("image/jpeg"));
            URL.revokeObjectURL(url);
          }, 300); // Give it a tiny bit of time to render the frame
        }).catch(() => resolve("")); // Fallback if autoplay fails
      };
      
      video.onerror = () => resolve(""); // Fallback on error
    });
  };

  const processFiles = async (files: FileList | File[]) => {
    setError(null);
    const newMedia: ShowcaseMedia[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!validateFile(file)) continue;

      const type = getMediaType(file);
      const previewUrl = URL.createObjectURL(file);
      let thumbnailUrl = previewUrl;

      if (type === "video") {
        const thumb = await generateVideoThumbnail(file);
        if (thumb) thumbnailUrl = thumb;
      } else if (type === "audio" || type === "model") {
        thumbnailUrl = ""; // Use icon fallback in UI
      }

      newMedia.push({
        id: Math.random().toString(36).substring(7),
        file,
        previewUrl,
        thumbnailUrl,
        type,
        name: file.name,
        size: file.size,
      });
    }

    if (newMedia.length > 0) {
      const updatedList = [...mediaList, ...newMedia];
      setMediaList(updatedList);
      onFilesChange(updatedList);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const removeMedia = (id: string) => {
    const updated = mediaList.filter(m => m.id !== id);
    setMediaList(updated);
    onFilesChange(updated);
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          dragActive 
            ? "border-accent-cyan bg-accent-cyan/5" 
            : "border-border hover:border-primary/50 hover:bg-background-secondary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*,video/*,audio/*,.glb,.gltf"
          onChange={handleChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <div className="w-12 h-12 rounded-full bg-background-tertiary flex items-center justify-center">
            <UploadCloud className="w-6 h-6 text-foreground-muted" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Click or drag files here to upload
            </p>
            <p className="text-xs text-foreground-muted mt-1">
              Supports Images, Videos, Audio, and GLB/GLTF models.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-accent-rose/10 border border-accent-rose/20 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-accent-rose shrink-0" />
          <p className="text-sm text-accent-rose">{error}</p>
        </div>
      )}

      {mediaList.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {mediaList.map((media) => (
            <div key={media.id} className="relative group rounded-lg overflow-hidden border border-border bg-background-tertiary aspect-square flex flex-col">
              {/* Thumbnail / Preview */}
              <div className="flex-1 relative flex items-center justify-center bg-black/20">
                {media.thumbnailUrl ? (
                  <img src={media.thumbnailUrl} alt={media.name} className="absolute inset-0 w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-foreground-muted">
                    {media.type === "audio" && <FileAudio className="w-8 h-8 mb-2" />}
                    {media.type === "model" && <Box className="w-8 h-8 mb-2" />}
                  </div>
                )}
                
                {/* Media Type Icon Badge */}
                <div className="absolute bottom-2 left-2 p-1.5 rounded-md bg-black/60 backdrop-blur-sm text-white border border-white/10">
                  {media.type === "image" && <ImageIcon className="w-3.5 h-3.5" />}
                  {media.type === "video" && <FileVideo className="w-3.5 h-3.5" />}
                  {media.type === "audio" && <FileAudio className="w-3.5 h-3.5" />}
                  {media.type === "model" && <Box className="w-3.5 h-3.5" />}
                </div>
              </div>

              {/* File Info */}
              <div className="p-2 bg-background-secondary border-t border-border">
                <p className="text-xs font-medium text-foreground truncate">{media.name}</p>
                <p className="text-[10px] text-foreground-muted">{formatSize(media.size)}</p>
              </div>

              {/* Remove Button */}
              <button
                onClick={(e) => { e.preventDefault(); removeMedia(media.id); }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-accent-rose/80"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
