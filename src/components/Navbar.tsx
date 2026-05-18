"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

const Navabar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="absolute z-50 w-full md:px-6 md:py-4 md:bg-background/10 md:backdrop-blur-sm md:shadow">
      <div
        className={clsx(
          "px-4 py-4 flex md:hidden gap-x-3 items-center w-full absolute z-50",
          {
            "bg-transparent": isOpen,
            "bg-background/10 backdrop-blur-sm shadow transition-colors ease-linear delay-150":
              !isOpen,
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
          "min-h-screen md:min-h-auto bg-secondary md:bg-transparent fixed inset-0 md:relative font-bebasNeue text-background md:text-primary px-6 pt-32 md:p-0 flex flex-col gap-y-4 md:flex-row md:justify-between md:items-center transition-transform duration-300",
          {
            "-translate-x-full md:translate-x-0": !isOpen,
            "md:-translate-x-full": isOpen,
          },
        )}
      >
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-4 text-5xl md:text-xl">
          <Link
            href="/#how-it-work"
            className="transition-colors hover:text-accent active:underline"
            onClick={() => setIsOpen(false)}
          >
            How it work?
          </Link>
          <Link
            href="/blog"
            className="transition-colors hover:text-accent active:underline"
            onClick={() => setIsOpen(false)}
          >
            Blog
          </Link>
        </div>
        <Link
          href="/"
          className="hidden md:block absolute left-1/2 -translate-x-1/2 text-3xl"
        >
          Fresh or trash
        </Link>
        <div className="flex flex-col md:flex-row gap-x-6 gap-y-4 text-5xl md:text-xl">
          <Link
            href="/about"
            className="transition-colors hover:text-accent active:underline"
            onClick={() => setIsOpen(false)}
          >
            about
          </Link>
          <Link
            href="/playground"
            className="transition-colors hover:text-accent active:underline"
            onClick={() => setIsOpen(false)}
          >
            Try now!
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Navabar;
