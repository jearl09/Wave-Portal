"use client";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
// @ts-ignore
import WAVES from "vanta/dist/vanta.waves.min";

export default function VantaBackground({ children }: { children: React.ReactNode }) {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    if (!vantaEffect && vantaRef.current) {
      setVantaEffect(
        WAVES({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x1e293b,       // Dark Blue-ish (Matches your theme)
          shininess: 35.00,     // How much it glows
          waveHeight: 20.00,    // How tall the waves are
          waveSpeed: 0.75,      // How fast they move
          zoom: 0.65            // Zoom level
        })
      );
    }
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return (
    <div ref={vantaRef} className="min-h-screen w-full flex flex-col items-center justify-center relative">
      {/* This ensures your content sits ON TOP of the waves */}
      <div className="z-10 w-full flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}