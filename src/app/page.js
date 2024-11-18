"use client";
import LoadingScreen from "@/components/utils/LoadingScreen";
import Page1 from "@/components/ui/sections/Page1";
import { useProgress } from "@react-three/drei";
import { AnimatePresence } from "framer-motion";
import Lenis from "lenis";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import ImageSequence from "@/components/ui/sections/ImageSequence";

export default function Home() {
  const [isloading, setIsLoading] = useState(true);
  const { progress } = useProgress();

  useEffect(() => {
    const lenis = new Lenis({
      smooth: true, // Enables smooth scrolling
      duration: 2.0, // Adjust scroll speed (default is 1.0, higher slows it down)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Smooth easing curve
    });

    lenis.stop();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    if (progress === 100) {
      handleLoading(lenis);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [progress]);

  const handleLoading = (lenis) => {
    setTimeout(() => {
      setIsLoading(false);
      lenis.start();
      window.scrollTo(0, 0);
    }, 1000);
  };
  return (
    <>
      <AnimatePresence mode="wait">
        {isloading && <LoadingScreen progress={progress} />}
      </AnimatePresence>
      <main className="w-full">
        <ImageSequence />

        <div className="relative h-[10vh]"></div>
        <Page1 />
      </main>
    </>
  );
}
