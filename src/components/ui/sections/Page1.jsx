import useThreeStore from "@/store/useStore";
import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

export default function Page1() {
  const { setIsComplete, isColor, setIsColor, isSize, setIsSize, isComplete } =
    useThreeStore();

  const headerRef = useRef();
  const listenerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const header = headerRef.current?.getBoundingClientRect();
      if (header?.top <= 0) {
        setIsComplete(true);
        window.removeEventListener("scroll", listenerRef.current);
      } else {
        setIsComplete(false);
      }
    };

    listenerRef.current = handleScroll;
    window.addEventListener("scroll", listenerRef.current);
    return () => {
      window.removeEventListener("scroll", listenerRef.current);
    };
  }, [setIsComplete]);

  return (
    <>
      <div ref={headerRef} className="relative h-[5vh] w-full "></div>
      <div className=" relative  h-svh flex flex-col  lg:justify-center justify-end z-50 container p-2   ">
        <div className=" flex lg:pl-28 p-1 flex-wrap">
          <div className="w-full rounded-lg max-w-[450px] p-6 bg-gray-500 bg-clip-padding backdrop-filter  backdrop-blur-sm bg-opacity-40 backdrop-saturate-150 backdrop-contrast-125 shadow-[0px_0px_7px_0px_rgba(24,_224,_205,_0.94)]">
            <div className="flex flex-col gap-2 mb-10">
              <h5 className="text-zinc-700 font-secondary">Codex</h5>
              <h1 className="lg:text-5xl text-2xl font-secondary font-semibold">
                Water Bottle
              </h1>
              <div className="flex items-center gap-3">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        fill={i === 4 ? "#fff" : "#199892"}
                        stroke={i === 4 ? "#fff" : "#CFCFCF"}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-star"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2L15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2z"></path>
                      </svg>
                    </span>
                  ))}
                </div>

                <p className="text-sm text-zinc-800/60">555 Reviews</p>
              </div>
              <p className="text-md font-secondary text-white/90 leading-2 pt-5">
                The Codex Bottle is the worlds first self-cleaning water bottle
                and water purification system. It uses UV-V LED light to
                eliminate up to 99.9999% of bio-contamiants from your water and
                bottle.
              </p>
            </div>
            <div className="color ">
              <h3 className="text-lg font-secondary font-semibold pb-3">
                Color
              </h3>
              <div className="flex gap-3">
                <motion.div
                  animate={{
                    scale: isColor === "#091057" ? 1.2 : 1,
                    transition: { duration: 1, ease: "backInOut" },
                  }}
                  className="w-8 h-8 p-1 border rounded-full cursor-pointer  "
                  onClick={() => setIsColor("#091057")}
                >
                  <div className="bg-blue-500 border w-full h-full rounded-full"></div>
                </motion.div>
                <motion.div
                  animate={{
                    scale: isColor === "#105228" ? 1.2 : 1,
                    transition: { duration: 1, ease: "backInOut" },
                  }}
                  className="w-8 h-8 p-1 border rounded-full cursor-pointer  "
                  onClick={() => setIsColor("#105228")}
                >
                  <div className="bg-green-700 border w-full h-full rounded-full"></div>
                </motion.div>
                <motion.div
                  animate={{
                    scale: isColor === "#181823" ? 1.2 : 1,
                    transition: { duration: 1, ease: "backInOut" },
                  }}
                  className="w-8 h-8 p-1 border rounded-full cursor-pointer  "
                  onClick={() => setIsColor("#181823")}
                >
                  <div className="bg-zinc-800 border w-full h-full rounded-full"></div>
                </motion.div>
              </div>
            </div>
            <div className="pt-10 flex items-center text-center gap-3">
              <h2 className="text-lg font-secondary font-semibold">Size</h2>
              <motion.div
                animate={{ opacity: isSize ? 1 : 0.5 }}
                className={` border px-5 py-1 text-center `}
              >
                <button onClick={() => setIsSize(true)}>17oz</button>
              </motion.div>
              <motion.div
                animate={{ opacity: isSize ? 0.5 : 1 }}
                className=" border px-5 py-1 text-center"
              >
                <button onClick={() => setIsSize(false)}>25oz</button>
              </motion.div>
            </div>
            <div className="flex items-center pt-10 w-full justify-center">
              <h1 className="text-4xl font-secondary font-semibold text-white/90 pr-10 ">
                $95.00
              </h1>
              <button className="bg-white text-teal-700 px-4 py-2 text-center hover:bg-teal-600 hover:text-black duration-500 ease-in-out transition-all">
                <p className="text-xl font-secondary ">Add to cart</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
