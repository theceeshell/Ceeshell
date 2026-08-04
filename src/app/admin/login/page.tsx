import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { LoginForm } from "@/components/admin/login-form";
import { Logo } from "@/components/shared/logo";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  const session = await getSession();
  if (session) redirect("/admin");

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-6">
      <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <Logo className="h-9 w-9 text-primary" />
          <div>
            <h1 className="font-heading text-2xl font-medium text-primary">Cee-Shell Admin</h1>
            <p className="mt-1 text-sm text-muted">Sign in to manage the website</p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
