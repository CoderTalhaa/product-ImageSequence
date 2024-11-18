import React, { useEffect, useRef } from "react";
import {
  Center,
  ContactShadows,
  Float,
  OrbitControls,
} from "@react-three/drei";
import { Bottle } from "./experience/Bottle";
import { useGSAP } from "@gsap/react";
import useThreeStore from "@/store/useStore";
import gsap from "gsap";
import { useThree } from "@react-three/fiber";
import { motion } from "framer-motion-3d";
import { useMediaQuery } from "react-responsive";

export default function Experince() {
  const { isComplete, isSize } = useThreeStore();

  const isDesktop = useMediaQuery({
    query: "(min-width: 1224px)",
  });

  const ref = useRef();
  const modelRef = useRef();

  const { camera } = useThree();

  useGSAP(
    () => {
      const tl = gsap.timeline();
      console.log(isComplete);
      console.log(isDesktop);
      if (isComplete) {
        tl.to(ref.current.position, {
          x: isDesktop ? 3 : 0,
          duration: 2,
          ease: "power2.inOut",
        })
          .to(
            modelRef.current.rotation,
            {
              z: 0.1,
              duration: 2,
              ease: "power4.inOut",
            },
            "<"
          )
          .fromTo(
            camera.position,
            { x: 0, y: 0, z: 15 },
            {
              x: isDesktop ? 1 : 0,
              y: isDesktop ? 1 : 1,
              z: 10,
              duration: 2,
              ease: "power1.inOut",
            },
            "<"
          );
      }
    },
    { dependencies: [isComplete] }
  );

  return (
    <>
      {/* <OrbitControls /> */}
      <group ref={ref}>
        <Center>
          <Float
            speed={1}
            rotationIntensity={0.1}
            floatIntensity={1}
            floatingRange={[0.1, 0.3]}
          >
            <motion.group
              ref={modelRef}
              animate={{
                scale: isSize ? 1 : 2,
                transition: { duration: 2, ease: "backInOut" },
              }}
            >
              <Bottle />
            </motion.group>
          </Float>
          <ContactShadows
            opacity={1}
            scale={5}
            blur={10}
            far={10}
            resolution={256}
            color="#222"
          />
        </Center>
      </group>
    </>
  );
}
