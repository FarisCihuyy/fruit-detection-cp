"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { columns } from "@/data/article-columns";
import { useAuth } from "@/hooks/use-auth";
import { article } from "@/services/article.service";
import { Articles } from "@/services/types/article";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Page = () => {
  const [articles, setArticles] = useState<Articles["data"][]>([]);
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user?.id) return;

    const getArticles = async () => {
      const response = await article.getByAuthorId(user?.id as string);

      setArticles(response.data);
    };

    getArticles();
  }, [user?.id]);

  return (
    <div className="flex flex-col gap-y-4">
      <header className="flex justify-between items-end">
        <h2 className="uppercase">Manage your article</h2>
        <Button
          className="bg-accent rounded-md hover:bg-accent/80"
          onClick={() => router.push("/playground/articles/create")}
        >
          Create article
        </Button>
      </header>
      <div className="bg-sidebar rounded p-4 shadow">
        <DataTable columns={columns} data={articles} />
      </div>
    </div>
  );
};

export default Page;
