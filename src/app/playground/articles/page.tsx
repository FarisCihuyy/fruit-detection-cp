"use client";

import { useAuth } from "@/hooks/use-auth";
import { article } from "@/services/article.service";
import { Articles } from "@/services/types/article";
import { useEffect, useState } from "react";

const Page = () => {
  const { articles, setArticles } = useState<Articles["data"][]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const getArticles = async () => {
      const response = await article.getAll();

      setArticles(response.data);
    };

    if (user) {
      getArticles();
    }
  }, []);

  return <div>Page</div>;
};

export default Page;
