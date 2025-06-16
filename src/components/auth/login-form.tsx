"use client";
import { useActionState } from "react";
import { useAuth } from "@/lib/context/auth-context";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LoginFormState = {
  error: string | null;
  fieldErrors: Record<string, string>;
};

function validateLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const errors: Record<string, string> = {};
  if (!email) errors.email = "Email is required";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.email = "Please enter a valid email address";
  if (!password) errors.password = "Password is required";
  return errors;
}

export default function LoginForm() {
  const { login } = useAuth();
  const initialState: LoginFormState = { error: null, fieldErrors: {} };
  const loginReducer = async (
    state: LoginFormState,
    formData: FormData
  ): Promise<LoginFormState> => {
    const email = formData.get("email")?.toString() ?? "";
    const password = formData.get("password")?.toString() ?? "";
    const fieldErrors = validateLogin({ email, password });
    if (Object.keys(fieldErrors).length > 0)
      return { error: null, fieldErrors };
    try {
      await login({ email, password });
      return { error: null, fieldErrors: {} };
    } catch (e) {
      return {
        error: e instanceof Error ? e.message : "Login failed",
        fieldErrors: {},
      };
    }
  };
  const [state, formAction] = useActionState<LoginFormState, FormData>(
    loginReducer,
    initialState
  );
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm flex flex-col space-y-6">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to sign in to your account
          </p>
        </div>
        <div className="grid gap-6">
          <form
            action={formAction}
            noValidate
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="none"
          >
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  placeholder="name@example.com"
                  type="email"
                />
                {state.fieldErrors.email && (
                  <span className="text-sm text-red-500">
                    {state.fieldErrors.email}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" />
                {state.fieldErrors.password && (
                  <span className="text-sm text-red-500">
                    {state.fieldErrors.password}
                  </span>
                )}
              </div>
              {state.error && (
                <div className="text-sm text-red-500 text-center">
                  {state.error}
                </div>
              )}
              <Button type="submit">Sign In</Button>
            </div>
          </form>
        </div>
        <p className="px-8 text-center text-sm text-muted-foreground">
          <Link
            href="/register"
            className="hover:text-primary underline underline-offset-4"
          >
            Don&apos;t have an account? Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
