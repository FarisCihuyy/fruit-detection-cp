import { Button } from "@/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const Blog = () => {
  return (
    <>
      <section className="pt-20 md:pt-0 min-h-135 flex items-center">
        <div className="grid grid-cols-12 gap-x-5 place-items-center w-full sm:max-w-11/12 md:max-w-3/4">
          <h2 className="hidden md:block col-span-4 font-bebasNeue text-xl">
            insight
          </h2>
          <div className="col-span-12 md:col-span-8 flex flex-col gap-y-8 md:gap-y-20">
            <h1 className="text-6xl sm:text-7xl md:text-8xl font-bold">
              Fresh Or Trash
              <span className="text-secondary"> Blog</span>
            </h1>
            <p className="sm:text-lg md:text-xl font-medium">
              Our place to explore everything about the limitless world. On this
              blog, we write about anything we think is worth sharing, from
              fruit health to behind-the-scenes success stories.
            </p>
          </div>
        </div>
      </section>
      <article className="relative flex justify-center items-center py-8 md:py-16">
        <h2 className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2">
          12 April 2026
        </h2>
        <div className="flex flex-col sm:flex-row gap-x-4 gap-y-4 sm:gap-y-0 md:gap-x-12 items-center *:flex-1 w-full md:max-w-3/5">
          <div className="relative overflow-hidden w-full border min-h-66">
            <Image
              src="https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?q=80&w=1075&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="Placeholder"
              fill
              sizes=""
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-y-4">
            <div>
              <Link href="/" className="font-semibold text-2xl hover:underline">
                Lorem Ipsum Dolor Sit Amet.
              </Link>
              <span className="block sm:hidden text-sm text-primary/50">
                12 April 2026
              </span>
            </div>
            <p className="line-clamp-3 sm:line-clamp-4 min-h-18 sm:min-h-24 leading-6">
              Our place to explore everything about the limitless world. On this
              blog, we write about anything we think is worth sharing,
            </p>
            <Button
              className="rounded-sm w-fit text-background"
              variant="secondary"
            >
              Read More
              <ArrowUpRight />
            </Button>
          </div>
        </div>
      </article>
    </>
  );
};

export default Blog;
