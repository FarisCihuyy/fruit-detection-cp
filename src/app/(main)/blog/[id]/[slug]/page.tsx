import { formatDate } from "@/lib/utils";
import { article } from "@/services/article.service";
import { Articles } from "@/services/types/article";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";

type Props = {
  params: Promise<{
    id: string;
    slug: string;
  }>;
};

export default async function Page({ params }: Props) {
  const { id, slug } = await params;

  const response = await article.getById(id);

  if (!response.data) return new Response(null, { status: 404 });

  const blog: Articles["data"] = response.data;

  if (slug !== blog?.slug) return new Response(null, { status: 404 });

  return (
    <main className="space-y-12 md:mt-8 min-h-screen md:max-w-lg lg:max-w-xl mx-auto">
      <section className="space-y-1">
        <h1 className="text-4xl sm:text-3xl md:text-4xl font-bold">
          {blog.title}
        </h1>
        <p className="text-sm text-primary/80">
          Published on {formatDate(blog.createdAt)}
          <span className="mx-1"> | </span> <span>{blog.author.nama}</span>
        </p>
      </section>

      <article className="prose font-sourceSerif! prose-headings:font-archivo prose-headings:font-bold prose-sm 2xl:prose-lg 4xl:prose-xl prose-img:max-w-80 prose-img:mx-auto prose-img:rounded prose-figcaption:text-center prose-li:marker:text-primary prose-a:font-normal prose-a:underline-offset-4 prose-a:hover:opacity-80 prose-blockquote:border-l-neutral-300 prose-blockquote:text-neutral-600 prose-blockquote:italic prose-hr:border-none prose-code:text-[15px] prose-code:font-medium prose-code:px-1.5 prose-code:py-1 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none prose-pre:bg-[#1c1c1c] prose-pre:border prose-pre:border-neutral-800 prose-pre:rounded prose-pre:px-6 prose-pre:py-5 prose-pre:shadow-sm prose-pre:overflow-x-auto prose-pre:code:bg-transparent prose-pre:code:text-neutral-100 prose-pre:code:p-0 prose-pre:code:font-normal prose-table:w-full prose-table:border-collapse prose-table:overflow-hidden prose-table:rounded prose-table:shadow prose-thead:border-b prose-thead:border-border prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-neutral-900 prose-th:bg-neutral-50/60 prose-td:px-4 prose-td:py-3 prose-td:border-t prose-td:border-border prose-td:bg-neutral-50/40 prose-td:text-neutral-700 prose-tr:border-neutral-100">
        <MDXRemote
          source={blog.content.replace(/\\n/g, "\n")}
          options={{
            mdxOptions: {
              remarkPlugins: [remarkGfm],
            },
          }}
        />
      </article>
    </main>
  );
}
