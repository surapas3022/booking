"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { mapAuthError } from "@/lib/errors";
import type { ActionState } from "@/lib/types";

function readCredentials(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "กรุณากรอกอีเมลและรหัสผ่าน" };
  }
  if (!email.includes("@")) {
    return { error: "รูปแบบอีเมลไม่ถูกต้อง" };
  }
  if (password.length < 6) {
    return { error: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร" };
  }

  return { email, password };
}

export async function signIn(_prev: ActionState | undefined, formData: FormData) {
  const parsed = readCredentials(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed);

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  redirect("/");
}

export async function signUp(_prev: ActionState | undefined, formData: FormData) {
  const parsed = readCredentials(formData);
  if ("error" in parsed) return parsed;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp(parsed);

  if (error) {
    return { error: mapAuthError(error.message) };
  }

  if (!data.session) {
    return {
      error:
        "สมัครสำเร็จแต่ยังไม่มี session — ปิด Confirm email ที่ Supabase Authentication > Providers > Email",
    };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
