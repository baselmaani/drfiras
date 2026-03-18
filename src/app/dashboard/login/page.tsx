"use client";
import { useActionState } from "react";
import { loginAction } from "@/lib/auth";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);

  return (
    <div className="min-h-screen bg-[#f7f9fc] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-[#1b4f72] flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">DF</span>
          </div>
          <h1
            className="text-2xl font-bold text-[#1b4f72]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Admin Login
          </h1>
          <p className="text-gray-500 text-sm mt-1">Dr. Firas CMS</p>
        </div>

        <form
          action={formAction}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-5"
        >
          {state?.error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
              {state.error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              autoFocus
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b4f72]/30 focus:border-[#1b4f72]"
              placeholder="Enter admin password"
            />
          </div>

          <button
            type="submit"
            disabled={pending}
            className="w-full bg-[#1b4f72] text-white py-3 rounded-xl font-medium text-sm hover:bg-[#154460] transition-colors disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
