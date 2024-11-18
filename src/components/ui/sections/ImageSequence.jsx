import React, { useEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import {
  useDebouncedValue,
  useDidUpdate,
  useViewportSize,
} from "@mantine/hooks";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Scene from "@/components/three/Scene";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function ImageSequence() {
  const header = useRef(null);
  const canvas = useRef(null);
  const viewportSize = useViewportSize();
  const [debouncedViewportSize] = useDebouncedValue(viewportSize, 500);
  const [loadedImages, setLoadedImages] = useState();

  useEffect(() => {
    if (!canvas.current) return;
    if (viewportSize.width === 0 || viewportSize.height === 0) return; // First render value is 0
    if (!!loadedImages) return;

    const intialSetup = async () => {
      // Image Dimensions: 1920 / 1080
      const imageAspect = 1920 / 1080;
      const imageWidth = viewportSize.width;
      const imageHeight = viewportSize.width / imageAspect;
      canvas.current.width = viewportSize.width;
      canvas.current.height = viewportSize.height;

      const imageSrcs = Array.from(
        { length: 60 },
        (_, i) => `/images/bottle2/${String(i + 1).padStart(4, "0")}.png`
      );

      const images = await loadImagesAndDrawFirstFrame({
        canvas: canvas.current,
        imageSrcs: imageSrcs,
        imageWidth: imageWidth,
        imageHeight: imageHeight,
      });

      setLoadedImages(images);
    };

    intialSetup();
  }, [viewportSize, loadedImages]);

  const canvasCont = useRef();
  const coverCont = useRef();
  const upperImg = useRef();

  useGSAP(
    () => {
      if (!canvas.current || !loadedImages) return;
      const context = canvas.current.getContext("2d", { alpha: true });
      if (!context) return;

      // ScrollTrigger for updating image sequence frames
      ScrollTrigger.create({
        id: "image-sequence",
        start: 0,
        end: "bottom top",
        scrub: true,
        trigger: header.current,
        // Pin the content container so it doesn't scroll off the screen
        pin: "#content-wrapper",
        onUpdate: ({ progress }) => {
          const nextFrame = Math.floor(progress * loadedImages.length);
          const nextImage = loadedImages[nextFrame];
          if (!nextImage) return;
          updateCanvasImage(context, canvas.current, nextImage);
        },
      });

      // Animations
      // Animate content in
      gsap
        .timeline({
          delay: 0.2,
        })
        .to(canvas.current, { opacity: 1, duration: 0.8 })
        .to(canvas.current, { scale: 1, duration: 0.9, ease: "power2.inOut" })
        .to(".scrollText", { opacity: 1, duration: 1, ease: "power3.inOut" });

      // Scroll controlled animations for headings
      gsap
        .timeline({
          defaults: {
            duration: 1,
            ease: "power4.inOut",
          },
          scrollTrigger: {
            trigger: header.current,
            start: 0,
            end: "bottom bottom",
            scrub: true,
          },
        })
        .to(".scrollText", { opacity: 0 });

      gsap
        .timeline({
          defaults: {
            duration: 2,
            ease: "power4.inOut",
          },
          scrollTrigger: {
            trigger: coverCont.current,
            start: "top bottom-=30%",
            end: "top top",
            scrub: true,
          },
        })
        .to(canvasCont.current, { opacity: 1 })
        .to(
          upperImg.current,
          {
            opacity: 1,
            duration: 2,
          },
          "-=1"
        );
    },
    {
      dependencies: [loadedImages],
      scope: header,
    }
  );

  useDidUpdate(() => {
    const handleViewportResize = () => {
      if (
        !debouncedViewportSize.width ||
        !debouncedViewportSize.height ||
        !loadedImages
      )
        return;
      if (!canvas.current) return;
      if (canvas.current.width === debouncedViewportSize.width) return;
      canvas.current.width = debouncedViewportSize.width;
      canvas.current.height = debouncedViewportSize.height;
      const context = canvas.current.getContext("2d", { alpha: true });
      if (!context) return;
      const progress = ScrollTrigger.getById("image-sequence")?.progress ?? 0;
      const nextFrame = Math.floor(progress * loadedImages.length);
      const nextImage = loadedImages[nextFrame];
      if (!nextImage) return;
      updateCanvasImage(context, canvas.current, nextImage);
    };
    handleViewportResize();
  }, [debouncedViewportSize]);

  return (
    <>
      <header
        ref={header}
        className="relative h-[250lvh] w-full select-none overflow-hidden "
      >
        <div
          id="content-wrapper"
          className="relative z-50 flex h-lvh w-full items-center justify-center"
        >
          <div className="scrollText absolute bottom-40  text-5xl z-50 opacity-0">
            <div className="scrolldown" style={{ "--color": "skyblue" }}>
              <div className="chevrons">
                <div className="chevrondown"></div>
                <div className="chevrondown"></div>
              </div>
            </div>
          </div>
          <canvas
            ref={canvas}
            className="pointer-events-none absolute scale-75 bg-transparent opacity-0"
          />
        </div>
      </header>
      <div ref={coverCont} className=" h-[50vh] w-full relative z-50">
        <div
          ref={upperImg}
          className="fixed top-0 left-0 h-full w-full  opacity-0 bg-gradient-to-t from-cyan-900 via-teal-800 to-teal-900"
        ></div>
        <div
          ref={canvasCont}
          className="fixed top-0 left-0 z-50 h-svh w-svw opacity-0 "
        >
          <Scene />
        </div>
      </div>
    </>
  );
}

const loadImagesAndDrawFirstFrame = async ({
  canvas,
  imageSrcs,
  imageWidth,
  imageHeight,
}) => {
  let images = [];
  let loadedCount = 0;

  return new Promise(async (resolve, reject) => {
    const onImageLoad = (index, img) => {
      // Draw the first frame ASAP
      if (index === 0) {
        const context = canvas.getContext("2d", { alpha: true });
        if (!context) return;
        updateCanvasImage(context, canvas, img);
      }
      loadedCount++;
      const hasLoadedAll = loadedCount === imageSrcs.length - 1;
      if (hasLoadedAll) resolve(images);
    };

    const retries = {};
    const maxRetries = 3;

    const onImageError = (i, img) => {
      // Try reloading this image a couple of times. If it fails then reject.
      if (retries[i] < maxRetries) {
        console.warn(`Image ${i} failed to load. Retrying... ${retries[i]}`);
        img.src = `${imageSrcs[i]}?r=${retries[i]}`;
        retries[i]++;
      } else {
        reject();
      }
    };

    for (let i = 0; i < imageSrcs.length - 1; i++) {
      const img = new Image();
      img.src = imageSrcs[i];
      // Math.min for contain, Math.max for cover
      const scale = Math.max(
        canvas.width / imageWidth,
        canvas.height / imageHeight
      );
      img.width = imageWidth * scale;
      img.height = imageHeight * scale;
      img.addEventListener("load", (e) => onImageLoad(i, img));
      img.addEventListener("error", (e) => onImageError(i, img));
      images.push(img);
    }
  });
};

const updateCanvasImage = (renderingContext, canvas, image) => {
  if (!renderingContext || !canvas || !image)
    throw new Error("Unable to update canvas");
  // If you need to center the image in the canvas:
  const offsetX = canvas.width / 2 - image.width / 2;
  const offsetY = canvas.height / 2 - image.height / 2;
  renderingContext.clearRect(0, 0, canvas.width, canvas.height);
  renderingContext.drawImage(
    image,
    offsetX,
    offsetY,
    image.width,
    image.height
  );
};
