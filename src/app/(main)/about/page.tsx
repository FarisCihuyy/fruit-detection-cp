"use client";

import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";

interface Philosophy {
  quote: string;
  author: string;
  meaning: string;
}

interface Teams {
  name: string;
  role: string;
  image?: string;
  university: string;
  linkedin: string | null;
  email?: string;
}

const About = () => {
  const philosophies: Philosophy[] = [
    {
      quote: "Simplicity is the ultimate sophistication.",
      author: "Leonardo da Vinci",
      meaning:
        "True greatness often appears simple because wisdom removes unnecessary complexity and distraction from life.",
    },
    {
      quote: "Silence is the sleep that nourishes wisdom.",
      author: "Francis Bacon",
      meaning:
        "Quiet moments allow the mind to reflect deeply, strengthening understanding, clarity, and emotional balance.",
    },
    {
      quote: "What we think, we become.",
      author: "Buddha",
      meaning:
        "Our thoughts gradually shape our character, actions, habits, and ultimately the direction of our lives.",
    },
    {
      quote: "Patience is bitter, but its fruit is sweet.",
      author: "Aristotle",
      meaning:
        "Difficult waiting and perseverance eventually lead to meaningful rewards, growth, and lasting satisfaction.",
    },
    {
      quote: "Man is free the moment he wishes to be.",
      author: "Voltaire",
      meaning:
        "Freedom begins internally when someone decides to stop being controlled by fear or limitation.",
    },
  ];

  const teams: Teams[] = [
    {
      name: "Tristan Nafi Agung Kurniawan",
      role: "Artificial Intelligence",
      university: "Bina Nusantara University",
      linkedin: "https://www.linkedin.com/in/tristan-nafi-agung-kurniawan/",
    },
    {
      name: "Marcellus Geraldio Florenta",
      role: "Artificial Intelligence",
      university: "Bina Nusantara University",
      linkedin:
        "https://www.linkedin.com/in/marcellus-geraldio-florenta-75578b292/",
    },
    {
      name: "Nisa Jamalia Hanif",
      role: "Data Science",
      university: "Bina Nusantara University",
      linkedin: null,
    },
    {
      name: "Akmal Hendrian Malik",
      role: "Data Science",
      university: "Bina Nusantara University",
      linkedin: "https://www.linkedin.com/in/akmalhendrian/",
    },
    {
      name: "Muh.Amar ma'ruf",
      role: "Fullstack Developer",
      university: "Universitas Ichsan Sidenreng Rappang",
      linkedin: "https://www.linkedin.com/in/muh-amar-ma-ruf/",
    },
    {
      name: "Faris Sulianto",
      role: "Fullstack Developer",
      image: "/images/kanye.jpg",
      university: "Universitas Nusantara PGRI Kediri",
      linkedin: "https://www.linkedin.com/in/tristan-nafi-agung-kurniawan/",
      email: "farissulianto22@gmail.com",
    },
  ];

  const sliderRef = useRef<HTMLDivElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!sliderRef.current) return;

    setIsDragging(true);

    setStartX(e.pageX - sliderRef.current.offsetLeft);
    setScrollLeft(sliderRef.current.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;

    e.preventDefault();

    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX) * 0.8;

    sliderRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <>
      <section className="h-svh flex flex-col font-light px-6">
        <div className="min-h-[80%] mx-auto flex flex-col justify-center w-fit uppercase text-6xl text-secondary leading-[0.9]">
          <span>if other can</span>
          <span>do it, then good</span>
          <span>for them</span>
          <span className="text-right pr-12 italic">i quit</span>
        </div>
        <p className="text-4xl">
          Seeing opportunities others miss. We exist to challenge the status quo
          and move things forward together.
        </p>
      </section>
      <section className="relative border overflow-y-hidden mt-8 py-12">
        <div className="absolute -z-10 inset-0 bg-[url(/images/bg-3.jpg)] bg-cover bg-no-repeat blur-xs brightness-90" />

        <div className="flex flex-col gap-y-12">
          <h1 className="text-4xl text-center text-background font-light">
            Our Philosophies
          </h1>

          <div className="overflow-hidden">
            <div
              ref={sliderRef}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
              className="flex gap-x-4 overflow-x-auto px-20 touch-pan-x select-none cursor-grab snap-x snap-mandatory active:cursor-grabbing no-scrollbar"
            >
              {philosophies.map((philosophy) => (
                <div
                  key={philosophy.quote}
                  className="w-full max-w-76 h-100 bg-background p-6 flex flex-col justify-between rounded-md shrink-0"
                >
                  <div className="flex flex-col gap-y-2">
                    <cite className="font-light text-xl">
                      &quot;{philosophy.quote}&quot;
                    </cite>

                    <strong className="block text-sm font-medium text-right">
                      ~ {philosophy.author}
                    </strong>
                  </div>

                  <p className="text-primary/80 font-light">
                    {philosophy.meaning}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-t-primary/10 min-h-screen my-12">
        <header className="grid grid-cols-2 p-6 items-baseline font-light">
          <h2 className="text-2xl font-normal">Our Teams</h2>
          <p className="text-xl text-primary/80">
            Let&apos;s be friends so our LinkedIn homepages don&apos;t get
            boring. Connect!
          </p>
        </header>
        <div className="grid grid-cols-4 gap-3 px-6 mt-8">
          {teams.map((team) => (
            <div
              key={team.name}
              title={team.name}
              data-linkedin={team.linkedin}
              className="group w-full min-h-100 bg-white/50 p-2 flex flex-col gap-y-4 rounded-md"
            >
              <div className="relative min-h-90 rounded-sm overflow-hidden">
                <Image
                  src={team.image ?? "/images/person.jpg"}
                  alt={team.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover object-top transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3"
                />
              </div>
              <div className="space-y-1 p-2">
                <h2 className="text-lg">{team.name}</h2>
                <p
                  title={team.university}
                  className="font-light text-primary/80 line-clamp-1"
                >
                  {team.university}
                </p>
                <Badge
                  variant="secondary"
                  className="bg-accent/20 text-secondary"
                >
                  {team.role}
                </Badge>
                <div className="flex gap-x-2 font-light mt-4">
                  {team.linkedin && (
                    <Link
                      href={team.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid place-items-center px-6 py-2 border"
                    >
                      Linkedin
                    </Link>
                  )}
                  {team.email && (
                    <Link
                      href={`mailto:${team.email}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid place-items-center px-6 py-2 border"
                    >
                      Email
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default About;
