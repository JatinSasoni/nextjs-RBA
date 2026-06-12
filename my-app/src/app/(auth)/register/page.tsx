"use client";
import { apiClient } from "@/app/lib/apiClient";
import Link from "next/link";
import { useActionState } from "react";

export type RegisterType = {
  error?: string;
  success?: boolean;
};

const RegisterPage = () => {
  const [state, registerAction, isPending] = useActionState(
    async (
      prevState: RegisterType,
      formData: FormData
    ): Promise<RegisterType> => {
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const teamCode = formData.get("teamCode");

      try {
        await apiClient.register({
          name,
          email,
          password,
          teamCode: teamCode || undefined,
        });
        window.location.href = "/dashboard";
        return { success: true };
      } catch (error) {
        return {
          error: error instanceof Error ? error.message : "Registration Failed",
        };
      }
    },
    { error: undefined, success: undefined }
  );
  return (
    <div className="bg-slate-800 p-8 rounded-lg border border-slate-700 w-full max-w-lg">
      <form action={registerAction}>
        <div className="text-center m-8">
          <h2 className="text-2xl font-bold text-white">Create new account</h2>
          <p className="mt-2 text-sm text-slate-400">
            {" "}
            or{" "}
            <Link
              href="/login"
              className="font-medium text-blue-400 hover:text-blue-300"
            >
              Sign in to existing account
            </Link>
          </p>
        </div>
        {state.error && (
          <div className="bg-red-900/50 border border-red-700 text-red-300 px-2 py-3 rounded mb-4">
            {state.error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              autoComplete="name"
              required
              placeholder="Enter your full name"
              className="w-full px-3 py-2 border border-slate-600 bg-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              required
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-slate-600 bg-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              autoComplete="password"
              required
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-slate-600 bg-slate-900"
            />
          </div>

          <div>
            <label
              htmlFor="teamCode"
              className="block text-sm font-medium text-slate-300 mb-1"
            >
              Team Code
            </label>
            <input
              type="teamCode"
              id="teamCode"
              name="teamCode"
              placeholder="Enter team code if you have one"
              className="w-full px-3 py-2 border border-slate-600 bg-slate-900"
            />
            <p className="text-xs text-slate-500 mt-1">
              Leave empty if you don't have a team code
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="w-full mt-6 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer"
        >
          {isPending ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
