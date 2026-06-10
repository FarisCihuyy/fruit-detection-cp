"use client";

import { useEffect, ReactNode } from "react";
import gsap from "gsap";
import { useInView } from "@/hooks/use-in-view";
import clsx from "clsx";

interface AnimatedElementProps {
  children: ReactNode;
  animation?:
    | "fadeIn"
    | "slideUp"
    | "slideDown"
    | "slideLeft"
    | "slideRight"
    | "zoomIn"
    | "zoomOut"
    | "rotateIn";
  duration?: number;
  delay?: number;
  stagger?: number;
  className?: string;
  viewportMargin?: string;
  once?: boolean;
  childrenClassName?: string;
}

const animationPresets = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
  },
  slideUp: {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
  },
  slideDown: {
    initial: { opacity: 0, y: -50 },
    animate: { opacity: 1, y: 0 },
  },
  slideLeft: {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
  },
  slideRight: {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
  },
  zoomIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
  },
  zoomOut: {
    initial: { opacity: 0, scale: 1.1 },
    animate: { opacity: 1, scale: 1 },
  },
  rotateIn: {
    initial: { opacity: 0, rotation: -10 },
    animate: { opacity: 1, rotation: 0 },
  },
};

export function AnimatedElement({
  children,
  animation = "fadeIn",
  duration = 0.6,
  delay = 0,
  stagger = 0.1,
  className,
  viewportMargin = "0px",
  once = true,
  childrenClassName,
}: AnimatedElementProps) {
  const { ref, isInView } = useInView({
    margin: viewportMargin,
    once,
  });

  const preset = animationPresets[animation];

  useEffect(() => {
    if (!ref.current) return;

    const element = ref.current;
    const children = Array.from(element.children) as HTMLElement[];

    if (isInView) {
      if (children.length > 1) {
        gsap.fromTo(children, preset.initial, {
          ...preset.animate,
          duration,
          stagger,
          delay,
        });
      } else {
        gsap.fromTo(element, preset.initial, {
          ...preset.animate,
          duration,
          delay,
        });
      }
    } else {
      gsap.set(element, preset.initial);
      if (children.length > 1) {
        gsap.set(children, preset.initial);
      }
    }
  }, [isInView, animation, duration, delay, stagger, preset]);

  return (
    <div ref={ref} className={className}>
      {typeof children === "string" ? (
        <span className={childrenClassName}>{children}</span>
      ) : (
        children
      )}
    </div>
  );
}
