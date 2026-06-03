/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { article } from "@/services/article.service";
import { useRouter } from "next/navigation";
import { useLoading } from "@/context/loading-context";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import MarkdownEditor from "@/components/MarkdownEditor";
import { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

const schema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title must be less than 200 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  thumbnail: z
    .instanceof(File, { message: "Thumbnail must be uploaded" })
    .refine((file) => file.size <= 2 * 1024 * 1024, "Maximum file size is 2MB")
    .refine(
      (file) => ["image/png", "image/jpeg"].includes(file.type),
      "File must be in PNG or JPG format",
    ),
  content: z
    .string()
    .min(100, "Article content must be at least 100 characters"),
});

type Schema = z.infer<typeof schema>;

export function ArticleForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      description: "",
      content: "",
    },
  });

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("thumbnail", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: Schema) => {
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("thumbnail", data.thumbnail);
      formData.append("content", data.content);

      await article.create(formData);

      toast.success("Article created successfully", {
        style: {
          background: "#198754",
          color: "#fff",
          border: "none",
        },
      });

      router.push("/playground/articles");
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message ?? "Failed to create article", {
          style: {
            background: "#DC3545",
            color: "#fff",
            border: "none",
          },
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-4xl">Write your article</h1>

          <p className="text-sm text-balance text-muted-foreground">
            Share your knowledge about anything.
          </p>
        </div>

        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="title">Title</FieldLabel>

              <Input
                {...field}
                id="title"
                type="text"
                placeholder="Title..."
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="description">Description</FieldLabel>
              <textarea
                {...field}
                id="description"
                placeholder="Description..."
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="thumbnail"
          control={form.control}
          render={({ _, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="thumbnail">Thumbnail (PNG/JPG)</FieldLabel>

              <div className="border-2 border-dashed border-input rounded-lg p-6 text-center">
                {thumbnailPreview ? (
                  <div className="relative w-full">
                    <Image
                      src={thumbnailPreview}
                      alt="Thumbnail preview"
                      width={400}
                      height={250}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setThumbnailPreview(null);
                        form.setValue("thumbnail", undefined as any);
                      }}
                      className="w-full"
                    >
                      Delete Thumbnail
                    </Button>
                  </div>
                ) : (
                  <div>
                    <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <label
                      htmlFor="thumbnail-file"
                      className="cursor-pointer text-sm font-medium text-accent hover:underline"
                    >
                      Click to upload or drag and drop
                    </label>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG or JPG (Max 2MB)
                    </p>
                  </div>
                )}

                <input
                  id="thumbnail-file"
                  type="file"
                  accept="image/png,image/jpeg"
                  onChange={handleThumbnailChange}
                  className="hidden"
                  aria-invalid={fieldState.invalid}
                />
              </div>

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="content"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel>Article Content</FieldLabel>

              <MarkdownEditor content={field.value} onChange={field.onChange} />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button
            type="submit"
            className="bg-accent hover:bg-accent/80 cursor-pointer text-background rounded-sm font-semibold w-full"
          >
            Create Article
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
