
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import PasswordInput from "./PasswordInput";
import { signIn } from "@/lib/auth-client";
import { toast } from "../ui/toast";
import {
  getDashboardPath,
  getSafeInternalRedirect,
} from "@/lib/auth/redirect";

const SigninForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    setError(null);

    const formData = new FormData(event.currentTarget);

    const payload = {
      email: String(formData.get("email") ?? "").trim(),
      password: String(formData.get("password") ?? ""),
      rememberMe: formData.get("rememberMe") === "on",
    };

    setIsLoading(true);

    try {
      const { data, error: signInError } = await signIn.email(payload);

      if (signInError) {
        setError(
          signInError.message ?? "Invalid email or password."
        );
        return;
      }

      if (!data?.user) {
        setError("Unable to sign in. Please try again.");
        return;
      }

      const callbackURL = new URLSearchParams(
        window.location.search
      ).get("callbackURL");

      const requestedPath = getSafeInternalRedirect(callbackURL);
      const dashboardPath = getDashboardPath(data.user.role);

      const destination =
        requestedPath ?? dashboardPath ?? "/dashboard";

      toast.add({
        title: `Hello ${data.user.name}, welcome back!`,
        description: "You have been signed in successfully.",
      });

      router.replace(destination);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.18em] text-[#769C29]">
          Welcome to FixMate
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-[#14243A]">
          Welcome back
        </h1>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Sign in to book repair services and manage your appointments.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <FieldGroup>
          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Field>
            <FieldLabel htmlFor="email">
              Email address
            </FieldLabel>

            <InputGroup className="h-11">
              <InputGroupAddon>
                <Mail />
              </InputGroupAddon>

              <InputGroupInput
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                required
                disabled={isLoading}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">
              Password
            </FieldLabel>

            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              required
              disabled={isLoading}
            />
          </Field>

          <Field orientation="horizontal">
            <Checkbox
              id="rememberMe"
              name="rememberMe"
              defaultChecked
              disabled={isLoading}
              className="data-checked:border-[#14243A] data-checked:bg-[#14243A]"
            />

            <FieldLabel
              htmlFor="rememberMe"
              className="font-normal"
            >
              Keep me signed in
            </FieldLabel>
          </Field>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full bg-[#14243A] text-sm font-semibold text-white hover:bg-[#203A57]"
          >
            {isLoading ? (
              <>
                <Spinner />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <ArrowRight data-icon="inline-end" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="font-semibold text-[#557C17] underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </div>
  );
};

export default SigninForm;
