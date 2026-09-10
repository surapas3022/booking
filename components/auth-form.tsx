"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, signUp } from "@/lib/actions/auth";
import { FormAlert } from "@/components/form-alert";
import type { ActionState } from "@/lib/types";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const action = mode === "login" ? signIn : signUp;
  const [state, formAction, pending] = useActionState<ActionState | undefined, FormData>(
    action,
    undefined,
  );

  return (
    <div className="mx-auto w-full max-w-md rounded-2xl border border-line bg-card p-6 shadow-sm">
      <p className="text-sm font-medium text-accent">มหาวิทยาลัย</p>
      <h1 className="mt-1 text-2xl font-semibold tracking-tight">
        {mode === "login" ? "เข้าสู่ระบบ" : "สมัครสมาชิก"}
      </h1>
      <p className="mt-2 text-sm text-muted">
        จองห้องอ่านหนังสือ ดูช่วงเวลาว่าง และจัดการรายการของตนเอง
      </p>

      <form action={formAction} className="mt-6 grid gap-4">
        <FormAlert state={state} />
        <div className="field">
          <label htmlFor="email">อีเมล</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="you@university.ac.th"
          />
        </div>
        <div className="field">
          <label htmlFor="password">รหัสผ่าน</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
            placeholder="อย่างน้อย 6 ตัวอักษร"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending
            ? "กำลังดำเนินการ..."
            : mode === "login"
              ? "เข้าสู่ระบบ"
              : "สมัครสมาชิก"}
        </button>
      </form>

      <p className="mt-5 text-sm text-muted">
        {mode === "login" ? (
          <>
            ยังไม่มีบัญชี?{" "}
            <Link href="/signup" className="font-medium text-accent">
              สมัครสมาชิก
            </Link>
          </>
        ) : (
          <>
            มีบัญชีแล้ว?{" "}
            <Link href="/login" className="font-medium text-accent">
              เข้าสู่ระบบ
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
