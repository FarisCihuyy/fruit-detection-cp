"use client";

import Image from "next/image";
import { fruitGrid } from "./data/fruits";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import clsx from "clsx";
import Navabar from "@/components/Navbar";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

const Home = () => {
  useGSAP(() => {
    ScrollSmoother.create({
      wrapper: "#scroll-wrapper",
      content: "#scroll-content",
      smooth: 1.4,
      smoothTouch: 0.1,
      effects: true,
      normalizeScroll: true,
    });
  });

  useGSAP(() => {
    const sections = gsap.utils.toArray(
      ".grid-image-container",
    ) as HTMLElement[];
    sections.forEach((section) => {
      const bg = section.querySelector(".grid-image");
      const sectionHeight = section.offsetHeight / 50;

      gsap.fromTo(
        bg,
        { yPercent: -sectionHeight },
        {
          yPercent: sectionHeight,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });
  });

  return (
    <main id="scroll-wrapper">
      <div
        id="scroll-content"
        style={{
          backgroundImage: "url('/images/hero_1.png')",
          backgroundSize: "1660px auto",
          backgroundPosition: "top 50px right -450px",
          backgroundRepeat: "no-repeat",
        }}
      >
        <Navabar />
        <section className="relative flex flex-col justify-between items-start gap-20 min-h-screen py-12 px-6">
          <div className="absolute top-52 left-[10%] size-54 overflow-hidden rotate-65 -z-10">
            <Image src="/images/leaft.png" alt="Banana" fill sizes="220px" />
          </div>
          <div>
            <h1 className="text-9xl xl:text-[11.5cqw] font-bebasNeue text-secondary">
              Is this a rotten fruit?
            </h1>
            <h2 className="text-8xl font-bebasNeue text-secondary">
              UGhhh... it’s complicated...
            </h2>
          </div>

          <div className="w-full max-w-3/12 space-y-8">
            <p className="font-semibold text-xl">
              Classification of fruit conditions based on visual analysis <br />
              — without guesswork or hassle.
            </p>
            <button className="flex gap-4 items-center bg-accent rounded-full pl-2 p-1">
              <span className="font-semibold text-2xl text-white">
                Get Started
              </span>
              <span className="flex items-center justify-center bg-white size-12 rounded-full">
                <Image
                  src="/icons/banana-cta.svg"
                  alt="Get Started"
                  width={32}
                  height={32}
                />
              </span>
            </button>
          </div>
        </section>
        <section className="space-y-6 px-6 mt-48">
          <h1 className="font-bebasNeue text-4xl mb-6">fruit condition</h1>
          <div className="grid grid-cols-12 gap-3">
            {fruitGrid.map((item) => (
              <div
                key={item.id}
                className={clsx(
                  "col-span-4 relative min-h-[524px] flex items-center",
                  {
                    "grid-image-container overflow-hidden":
                      item.type !== "content",
                  },
                )}
              >
                {item.type === "content" ? (
                  <div className="relative flex flex-col gap-y-4 px-10">
                    <h3 className="font-bold text-3xl">{item.title}</h3>
                    <p className="text-xl">{item.description}</p>
                    {item.icon &&
                      item.icon.map((i) => (
                        <Image
                          key={i.name}
                          src={i.src}
                          alt={i.name}
                          width={100}
                          height={100}
                          style={i.style}
                          sizes="250px"
                        />
                      ))}
                  </div>
                ) : (
                  <Image
                    src={item?.image || ""}
                    alt="fruit"
                    fill
                    className="grid-image object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Home;
