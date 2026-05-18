"use client";

import Image from "next/image";
import { fruitGrid } from "../../data/fruits";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

const Home = () => {
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
    <div className="pt-8 bg-[url('/images/hero_1.png')] bg-no-repeat bg-size-[clamp(1260px,120vw,3000px)_auto] bg-position-[top_50px_right_-450px]">
      <section className="relative flex flex-col justify-between items-start gap-20 min-h-[80vh] md:min-h-screen py-12 px-3 md:px-6">
        <div className="absolute top-52 left-[10%] size-54 overflow-hidden rotate-65 -z-10">
          <Image src="/images/leaft.png" alt="leaft" fill sizes="220px" />
        </div>
        <div className="pt-20 md:pt-0">
          <h1 className="text-7xl md:text-9xl xl:text-[11.5cqw] font-bebasNeue text-secondary">
            Is this a rotten fruit?
          </h1>
          <h2 className="text-5xl md:text-8xl font-bebasNeue text-secondary">
            UGhhh... it’s complicated...
          </h2>
        </div>

        <div className="w-full md:max-w-3/12 space-y-8">
          <p className="font-semibold text-xl">
            Classification of fruit conditions based on visual analysis <br />—
            without guesswork or hassle.
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
                sizes=""
              />
            </span>
          </button>
        </div>
      </section>
      <section className="px-3 md:px-6 mt-40 md:mt-48">
        <h1 className="my-6 font-bebasNeue text-4xl">fruit condition</h1>
        <div className="grid grid-cols-12 gap-3">
          {fruitGrid.map((item) => (
            <div
              key={item.id}
              className={clsx(
                "col-span-12 md:col-span-4 relative h-130 2xl:h-200 flex items-center",
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
      <section className="mt-12 md:mt-20 px-0 md:px-6">
        <div className="bg-secondary py-12 px-4 md:px-0 md:py-16 md:rounded-4xl h-full flex items-center justify-center">
          <div className="flex items-center justify-center flex-col gap-y-3 w-full md:max-w-2/3 text-foreground">
            <h1 className="text-4xl md:text-6xl font-semibold text-center">
              Know your fruit before you eat it
            </h1>
            <p className="text-base md:text-xl text-center">
              Our AI checks color, texture, and damage to ensure your fruit is
              truly fresh.
            </p>
            <Button className="mt-8 h-14 p-1 pl-2 bg-accent hover:bg-accent/80 rounded-full text-background text-xl md:text-2xl font-semibold">
              <span className="font-semibold text-white">Try It Free</span>
              <span className="flex items-center justify-center bg-white size-12 rounded-full">
                <Image
                  src="/icons/banana-cta.svg"
                  alt="Get Started"
                  width={32}
                  height={32}
                />
              </span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
