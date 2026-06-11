"use client";

import { useRef, useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, Bounds } from "@react-three/drei";
import { Maximize2, Minimize2, RotateCw, Loader2 } from "lucide-react";

interface ModelViewerProps {
  url: string;
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

export function ModelViewer({ url }: ModelViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full rounded-lg overflow-hidden bg-background-tertiary border border-glass-border ${
        isFullscreen ? "h-screen rounded-none" : "h-[400px]"
      }`}
    >
      <Suspense fallback={
        <div className="absolute inset-0 flex flex-col items-center justify-center text-accent-cyan">
          <Loader2 className="w-8 h-8 animate-spin mb-4" />
          <span className="text-sm font-medium">Loading WebGL Engine...</span>
        </div>
      }>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          {/* Lighting */}
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 10]} intensity={1} />
          
          <Suspense fallback={null}>
            <Bounds fit clip observe margin={1.2}>
              <Model url={url} />
            </Bounds>
            <Environment preset="city" />
          </Suspense>

          {/* Controls */}
          <OrbitControls 
            makeDefault 
            autoRotate={autoRotate} 
            autoRotateSpeed={2} 
            enableDamping 
            dampingFactor={0.05} 
          />
        </Canvas>
      </Suspense>

      {/* UI Overlay */}
      <div className="absolute bottom-4 right-4 flex items-center gap-2">
        <button 
          onClick={() => setAutoRotate(!autoRotate)}
          className={`p-2 rounded-full backdrop-blur-sm border transition-colors ${
            autoRotate 
              ? "bg-accent-cyan/20 border-accent-cyan/50 text-accent-cyan" 
              : "bg-black/50 border-white/10 text-white hover:bg-black/80"
          }`}
          title="Toggle Auto-Rotate"
        >
          <RotateCw className={`w-4 h-4 ${autoRotate ? "animate-spin-slow" : ""}`} />
        </button>
        <button 
          onClick={toggleFullscreen}
          className="p-2 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-sm border border-white/10 transition-colors"
          title="Toggle Fullscreen"
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

// Preload common model to prevent jank if it's used repeatedly
// useGLTF.preload("YOUR_COMMON_URL_HERE");
