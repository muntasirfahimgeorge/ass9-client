
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { AlertCircle, ArrowRight, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
import { signUp } from "@/lib/auth-client";
import { toast } from "../ui/toast";
import { getDashboardPath } from "@/lib/auth/redirect";

type RegistrationRole = "customer" | "technician";

const SignupForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isLoading) return;

    setError(null);

    const formData = new FormData(event.currentTarget);

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(
      formData.get("confirmPassword") ?? ""
    );
    const selectedRole = String(formData.get("role") ?? "customer");

    if (name.length < 2 || name.length > 80) {
      setError("Name must be between 2 and 80 characters.");
      return;
    }

    if (password.length < 8 || password.length > 128) {
      setError("Password must be between 8 and 128 characters.");
      return;
    }

    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
      setError(
        "Password must contain at least one uppercase and one lowercase letter."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (
      selectedRole !== "customer" &&
      selectedRole !== "technician"
    ) {
      setError("Please select a valid account type.");
      return;
    }

    const role: RegistrationRole = selectedRole;

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await signUp.email({
        name,
        email,
        password,
        role,
      });

      if (signUpError) {
        setError(
          signUpError.message ?? "Unable to create your account."
        );
        return;
      }

      if (!data?.user) {
        setError("Account creation was unsuccessful. Please try again.");
        return;
      }

      toast.add({
        title: "Account created successfully!",
        description: `Welcome to FixMate as a ${role}.`,
      });

      const dashboardPath =
        getDashboardPath(data.user.role) ?? "/dashboard";

      router.replace(dashboardPath);
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
          Get started with FixMate
        </span>

        <h1 className="text-3xl font-bold tracking-tight text-[#14243A]">
          Create your account
        </h1>

        <p className="text-sm leading-relaxed text-muted-foreground">
          Join FixMate to book repairs and manage your service requests.
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
            <FieldLabel htmlFor="name">Full name</FieldLabel>

            <InputGroup className="h-11">
              <InputGroupAddon>
                <User />
              </InputGroupAddon>

              <InputGroupInput
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your full name"
                required
                minLength={2}
                maxLength={80}
                disabled={isLoading}
              />
            </InputGroup>
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email address</FieldLabel>

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
            <FieldLabel htmlFor="role">Register as</FieldLabel>

            <select
              id="role"
              name="role"
              defaultValue="customer"
              disabled={isLoading}
              className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="customer">
                Customer — Book repair services
              </option>

              <option value="technician">
                Technician — Provide repair services
              </option>
            </select>
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>

            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              disabled={isLoading}
            />

            <p className="text-xs text-muted-foreground">
              Use 8–128 characters with at least one uppercase and one lowercase letter.
            </p>
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">
              Confirm password
            </FieldLabel>

            <PasswordInput
              id="confirmPassword"
              name="confirmPassword"
              autoComplete="new-password"
              required
              minLength={8}
              maxLength={128}
              disabled={isLoading}
            />
          </Field>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-11 w-full bg-[#14243A] text-sm font-semibold text-white hover:bg-[#203A57]"
          >
            {isLoading ? (
              <>
                <Spinner />
                Creating account...
              </>
            ) : (
              <>
                Create account
                <ArrowRight data-icon="inline-end" />
              </>
            )}
          </Button>
        </FieldGroup>
      </form>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-semibold text-[#557C17] underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default SignupForm;
