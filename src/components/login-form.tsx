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
import { login } from "@/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLoading } from "@/context/loading-context";
import { toast } from "sonner";

const schema = z.object({
  email: z.email("Invalid email format"),
  password: z.string().min(1, "Password is required"),
});

type Schema = z.infer<typeof schema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const { setLoading } = useLoading();
  const { login: setUser } = useAuth();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: Schema) => {
    setLoading(true);

    try {
      const res = await login(data);

      setUser({
        ...res.data,
        token: res.token,
      });

      toast.success(res.message ?? "Login success", {
        style: {
          background: "#198754",
          color: "#fff",
          border: "none",
        },
      });

      router.back();
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message ?? "Login failed", {
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
          <h1 className="text-4xl font-bebasNeue">
            welcome to
            <span className="block text-secondary">Fresh or Trash</span>
          </h1>

          <p className="text-sm text-balance text-muted-foreground">
            Enter your email below to login to your account
          </p>
        </div>

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="email">Email</FieldLabel>

              <Input
                {...field}
                id="email"
                type="email"
                placeholder="m@example.com"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input
                {...field}
                id="password"
                type="password"
                placeholder="••••••••"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Field>
          <Button
            type="submit"
            className="bg-accent hover:bg-accent/80 cursor-pointer text-background rounded-sm font-semibold"
          >
            Login
          </Button>
          <span className="text-center mt-2 opacity-80 text-sm mx-auto">
            Don&apos;t have an account?
            <Link href="/register" className="text-indigo-600 hover:underline">
              {" "}
              Signup
            </Link>
          </span>
        </Field>
      </FieldGroup>
    </form>
  );
}
