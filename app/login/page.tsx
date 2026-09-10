import { AuthForm } from "@/components/auth-form";
import { MissingConfig } from "@/components/missing-config";
import { hasSupabaseEnv } from "@/lib/supabase/env";

export default function LoginPage() {
  if (!hasSupabaseEnv()) {
    return <MissingConfig />;
  }

  return (
    <main className="mx-auto flex min-h-full w-full max-w-6xl flex-1 items-center justify-center px-4 py-12">
      <AuthForm mode="login" />
    </main>
  );
}
