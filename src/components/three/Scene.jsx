"use client";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useEffect, useRef, useState } from "react";
import Lights from "./experience/Lights";
import Experince from "./Experience";

export default function Scene() {
  const [eventSource, setEventSource] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined" && typeof document !== "undefined") {
      setEventSource(document.body);
    }
  }, []);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
      camera={{ position: [0, 0, 15], fov: 30 }}
      eventSource={eventSource}
    >
      <Suspense fallback={null}>
        <Experince />
      </Suspense>

      <Lights />
    </Canvas>
  );
}
