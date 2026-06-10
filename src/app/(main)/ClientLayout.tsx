"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import Navabar from "@/components/Navbar";

gsap.registerPlugin(ScrollSmoother);

const ClientLayout = ({ children }: { children: React.ReactNode }) => {
  useGSAP(() => {
    ScrollSmoother.create({
      wrapper: "#scroll-wrapper",
      content: "#scroll-content",
      smooth: 1.4,
      smoothTouch: 0.1,
      effects: true,
      normalizeScroll: true,
      ignoreMobileResize: true,
    });
  });

  return (
    <>
      <main id="scroll-wrapper">
        <Navabar />
        <div id="scroll-content">
          {children}
          <footer className="relative md:min-h-[80vh] lg:h-screen bg-[url('/images/bg-footer.png')] bg-cover">
            <h1 className="select-none p-6 text-secondary/50 w-full text-6xl md:text-[30cqw] lg:text-[19cqw] flex gap-x-4 mx-auto md:mx-0 md:flex-col *:leading-none font-sourceSerif">
              <span>Fresh</span>
              <span className="md:text-12cqw xl:text-[8cqw] lg:text-center">
                or
              </span>
              <span className="lg:text-right">Trash</span>
            </h1>
            <h3 className="mx-auto text-center md:text-left md:absolute md:left-4 bottom-4 font-sourceSerif font-light text-lg">
              &copy; CodingCamp2026 | CC26-PSU044.
            </h3>
          </footer>
        </div>
      </main>
    </>
  );
};

export default ClientLayout;
