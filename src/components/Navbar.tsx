"use client";

import { useAuth } from "@/hooks/use-auth";
import clsx from "clsx";
import Link from "next/link";
import { useRef, useState } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const Navabar = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      if (!navbarRef.current) return;

      gsap.fromTo(
        navbarRef.current,
        {
          width: "100%",
          padding: "0rem 0rem",
          borderRadius: "0px",
        },
        {
          width: "50%",
          padding: "0.8rem 1rem",
          borderRadius: "8px",
          duration: 0.1,
          ease: "none",
          scrollTrigger: {
            trigger: navbarRef.current,
            start: 0,
            end: 120,
            scrub: 1,
          },
        },
      );

      ScrollTrigger.create({
        start: 10,
        onEnter: () => setScrolled(true),
        onLeaveBack: () => setScrolled(false),
      });
    });

    return () => mm.revert();
  });

  return (
    <div className="fixed top-0 left-0 z-50 w-full flex justify-center md:py-4 md:px-6">
      <div
        ref={navbarRef}
        className={clsx("w-full h-full", {
          "bg-background/70 backdrop-blur-[150px] shadow": scrolled,
        })}
      >
        <div
          className={clsx(
            "px-4 py-4 flex md:hidden gap-x-3 items-center w-full absolute z-50",
            {
              "bg-transparent": isOpen,
              "bg-background/70 backdrop-blur-[150px] shadow": !isOpen,
            },
          )}
        >
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={clsx(
              "relative size-10 rounded flex items-center justify-center transition-colors",
              {
                "bg-foreground": isOpen,
                "bg-transparent": !isOpen,
              },
            )}
          >
            <span
              className={clsx(
                "absolute w-5 h-0.5 bg-primary transition-transform duration-300",
                {
                  "rotate-45": isOpen,
                  "-translate-y-1": !isOpen,
                },
              )}
            />
            <span
              className={clsx(
                "absolute w-5 h-0.5 bg-primary transition-transform duration-300",
                {
                  "-rotate-45": isOpen,
                  "translate-y-1": !isOpen,
                },
              )}
            />
          </button>

          <Link
            href="/"
            className={clsx("font-bebasNeue text-3xl transition-colors", {
              "text-background": isOpen,
            })}
            onClick={() => setIsOpen(false)}
          >
            Fresh or trash
          </Link>
        </div>

        <nav
          className={clsx(
            "min-h-screen md:min-h-auto bg-secondary md:bg-transparent fixed inset-0 md:relative text-background md:text-primary px-6 pt-32 md:p-0 flex flex-col gap-y-4 md:flex-row md:justify-between md:items-center transition-transform duration-300",
            {
              "-translate-x-full md:translate-x-0": !isOpen,
              "md:-translate-x-full": isOpen,
            },
          )}
        >
          <div className="flex flex-col md:flex-row gap-x-6 gap-y-4 text-5xl md:text-base">
            <Link
              href="/#how-it-work"
              className="transition-colors hover:text-accent hover:underline hover:font-medium"
              onClick={() => setIsOpen(false)}
            >
              How it work?
            </Link>
            <Link
              href="/blog"
              className="transition-colors hover:text-accent hover:underline hover:font-medium"
              onClick={() => setIsOpen(false)}
            >
              Blog
            </Link>
          </div>

          <Link
            href="/"
            className="font-bebasNeue hidden md:block absolute left-1/2 -translate-x-1/2 text-xl"
          >
            Fresh or trash
          </Link>

          <div className="flex flex-col md:flex-row gap-x-6 gap-y-4 text-5xl md:text-base">
            <Link
              href="/about"
              className="transition-colors hover:text-accent hover:underline hover:font-medium"
              onClick={() => setIsOpen(false)}
            >
              About
            </Link>

            <Link
              href={`${user ? "/playground" : "/login"}`}
              className="transition-colors hover:text-accent hover:underline hover:font-medium"
              onClick={() => setIsOpen(false)}
            >
              Try now!
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Navabar;
