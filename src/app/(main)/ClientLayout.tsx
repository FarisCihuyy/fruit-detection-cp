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
    <main id="scroll-wrapper">
      <Navabar />
      <div id="scroll-content">{children}</div>
    </main>
  );
};

export default ClientLayout;
