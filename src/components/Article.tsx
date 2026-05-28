"use client";

import { Articles } from "@/services/types/article";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "./ui/button";
import { formatDate } from "@/lib/utils";
import { useRouter } from "next/navigation";

const Article = ({ data }: { data: Articles["data"] }) => {
  const router = useRouter();

  return (
    <article className="relative flex justify-center items-center py-8 md:py-16">
      <h2 className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2">
        {formatDate(data.createdAt) ?? "-"}
      </h2>
      <div className="flex flex-col sm:flex-row gap-x-4 gap-y-4 sm:gap-y-0 md:gap-x-12 items-center *:flex-1 w-full md:max-w-3/5">
        <div className="relative overflow-hidden w-full border min-h-66">
          <Image
            src={data.thumbnail ?? "/images/blog-placeholder.jpg"}
            alt={data.title ?? "Untitled"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-y-4">
          <div>
            <Link
              href={`/blog/${data.id}/${data.slug}`}
              className="font-semibold text-2xl hover:underline"
            >
              {data.title ?? "Untitled"}
            </Link>
            <span className="block sm:hidden text-sm text-primary/50">
              {formatDate(data.createdAt) ?? "-"}
            </span>
          </div>
          <p className="line-clamp-3 sm:line-clamp-4 min-h-18 sm:min-h-24 leading-6">
            {data.description ?? ""}
          </p>
          <Button
            className="rounded-sm w-fit text-background"
            variant="secondary"
            onClick={() => router.push(`/blog/${data.id}/${data.slug}`)}
          >
            Read More
            <ArrowUpRight />
          </Button>
        </div>
      </div>
    </article>
  );
};

export default Article;
