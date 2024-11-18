"use client";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { BsFillMenuButtonWideFill } from "react-icons/bs";
import AnimatedLink from "./AnimatedLink";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    href: "/",
    name: "HOME",
  },
  {
    href: "/about",
    name: "ABOUT",
  },
  {
    href: "/contact",
    name: "CONTACT",
  },
];

export default function Header() {
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setHidden(true);
      } else {
        setHidden(false);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const pathname = usePathname();

  return (
    <motion.header
      variants={{
        visible: { y: 0 },
        hidden: { y: "-110%" },
      }}
      animate={hidden ? "hidden" : "visible"}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className="fixed top-2 left-0 right-0 z-50"
    >
      <div className="w-full relative pl-5 pr-5">
        <div className="bg-secondary w-full flex justify-between items-center rounded-xl p-4">
          <h1 data-hover className="text-4xl">
            Talha
          </h1>
          <nav className="hidden lg:flex text-primary gap-20">
            {links.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className={`${
                  pathname === link.href && "border-b-2 border-zinc-700"
                } uppercase`}
              >
                <AnimatedLink title={link.name} />
              </Link>
            ))}
          </nav>
          <div className="block lg:hidden">
            <BsFillMenuButtonWideFill size={27} />
          </div>
        </div>
      </div>
    </motion.header>
  );
}
