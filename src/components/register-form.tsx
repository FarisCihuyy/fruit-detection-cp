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
import { register } from "@/services/auth.service";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useLoading } from "@/context/loading-context";

const schema = z.object({
  name: z.string().min(3, "Please enter your name, at least 3 characters."),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),

  password: z.string().min(1, "Password is required"),
});

type Schema = z.infer<typeof schema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const router = useRouter();
  const { setLoading } = useLoading();

  const form = useForm<Schema>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: Schema) => {
    if (!data) return;
    setLoading(true);

    try {
      const res = await register(data);

      toast.success(res?.message ?? "Register success, please login", {
        style: {
          background: "#198754",
          color: "#fff",
          border: "none",
        },
      });

      router.push("/login");
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
          <h1 className="text-4xl font-bebasNeue">create your account</h1>

          <p className="text-sm text-balance text-muted-foreground">
            Sign up using the form to create an account
          </p>
        </div>

        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="name">Full Name</FieldLabel>

              <Input
                {...field}
                id="name"
                type="name"
                placeholder="Enter your name"
                aria-invalid={fieldState.invalid}
              />

              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
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
                placeholder="Enter your email"
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
                placeholder="********"
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
            Register
          </Button>
          <span className="text-center mt-2 opacity-80 text-sm mx-auto">
            Already have an account?
            <Link href="/login" className="text-indigo-600 hover:underline">
              {" "}
              Login
            </Link>
          </span>
        </Field>
      </FieldGroup>
    </form>
  );
}
