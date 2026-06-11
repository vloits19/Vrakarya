"use client";

import { Play, Volume2, VolumeX } from "lucide-react";
import { useState, useRef } from "react";

interface ProjectTrailerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  project: Record<string, any>;
}

export function ProjectTrailer({ project }: ProjectTrailerProps) {
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fallback to a placeholder video if project doesn't have a specific trailer
  const trailerUrl = project.links?.trailer || "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4";

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="relative w-full aspect-video md:aspect-[21/9] bg-black rounded-xl overflow-hidden group">
      <video
        ref={videoRef}
        src={trailerUrl}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted={isMuted}
        playsInline
      />
      
      {/* Cinematic Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
      <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-transparent" />

      {/* Controls Overlay */}
      <div className="absolute bottom-6 right-6 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          onClick={togglePlay}
          className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-colors"
        >
          {isPlaying ? (
            <div className="w-5 h-5 flex justify-center items-center gap-1">
              <div className="w-1.5 h-3.5 bg-white rounded-sm" />
              <div className="w-1.5 h-3.5 bg-white rounded-sm" />
            </div>
          ) : (
            <Play className="w-5 h-5 fill-current" />
          )}
        </button>
        <button 
          onClick={toggleMute}
          className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-colors"
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
}
