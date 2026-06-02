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
          <footer className="h-screen bg-[url('/images/bg-footer.png')] bg-cover flex items-end ">
            <h1 className="select-none p-6 text-secondary/50 w-full text-[19cqw] flex flex-col *:leading-none font-sourceSerif">
              <span>Fresh</span>
              <span className="text-[8cqw] text-center">or</span>
              <span className="text-right">Trash</span>
            </h1>
          </footer>
        </div>
      </main>
    </>
  );
};

export default ClientLayout;
