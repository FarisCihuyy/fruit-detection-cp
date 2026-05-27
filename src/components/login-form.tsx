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
import { zodResolver } from "@hookform/resolvers/zod";
import { login } from "@/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

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
  const { login: setUser } = useAuth();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: Schema) => {
    const res = await login(data);

    if (!res) return;

    setUser({ ...res.data, token: res.token });

    router.back();
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
              <div className="flex items-center">
                <FieldLabel htmlFor="password">Password</FieldLabel>

                <a
                  href="#"
                  className="ml-auto text-sm underline-offset-4 hover:underline"
                >
                  Forgot your password?
                </a>
              </div>

              <Input
                {...field}
                id="password"
                type="password"
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
