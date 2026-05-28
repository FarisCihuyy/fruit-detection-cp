"use client";

import Article from "@/components/Article";
import { article } from "@/services/article.service";
import { Articles } from "@/services/types/article";
import { useEffect, useState } from "react";

const Blog = () => {
  const [blog, setBlog] = useState<Articles["data"][]>([]);

  useEffect(() => {
    async function getBlog() {
      const response = await article.getAll();
      setBlog(response.data);
    }
    getBlog();
  }, []);

  return (
    <>
      <section className="min-h-135 flex items-center">
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
      {blog.length > 0 ? (
        blog.map((data) => <Article key={data.id} data={data} />)
      ) : (
        <div className="min-h-66 flex items-center justify-center">
          <span className="text-xl font-light">No data</span>
        </div>
      )}
    </>
  );
};

export default Blog;
