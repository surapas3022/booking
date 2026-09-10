import Link from "next/link";
import { signOut } from "@/lib/actions/auth";

export function Nav({ email }: { email?: string }) {
  return (
    <header className="border-b border-line bg-card/90 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          ห้องอ่านหนังสือ
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/" className="text-muted hover:text-foreground">
            จองห้อง
          </Link>
          <Link href="/my-bookings" className="text-muted hover:text-foreground">
            รายการของฉัน
          </Link>
          {email ? <span className="hidden text-muted sm:inline">{email}</span> : null}
          <form action={signOut}>
            <button type="submit" className="btn btn-ghost px-3 py-1.5 text-sm">
              ออกจากระบบ
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
