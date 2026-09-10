"use server";

import { revalidatePath } from "next/cache";
import { TIME_SLOTS } from "@/lib/constants";
import { isPastDate, parseISODate } from "@/lib/dates";
import { mapDbError } from "@/lib/errors";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/types";

function readBookingFields(formData: FormData) {
  const roomId = String(formData.get("room_id") ?? "").trim();
  const bookingDate = String(formData.get("booking_date") ?? "").trim();
  const timeSlot = String(formData.get("time_slot") ?? "").trim();
  const purpose = String(formData.get("purpose") ?? "").trim();

  if (!roomId || !bookingDate || !timeSlot || !purpose) {
    return { error: "กรุณากรอกข้อมูลให้ครบทุกช่อง" };
  }
  if (parseISODate(bookingDate, "") !== bookingDate) {
    return { error: "วันที่ไม่ถูกต้อง" };
  }
  if (isPastDate(bookingDate)) {
    return { error: "ไม่สามารถจองวันที่ผ่านมาแล้วได้" };
  }
  if (!TIME_SLOTS.includes(timeSlot as (typeof TIME_SLOTS)[number])) {
    return { error: "รอบเวลาที่เลือกไม่ถูกต้อง" };
  }
  if (purpose.length < 3) {
    return { error: "วัตถุประสงค์ต้องมีอย่างน้อย 3 ตัวอักษร" };
  }

  return { roomId, bookingDate, timeSlot, purpose };
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return { error: "กรุณาเข้าสู่ระบบก่อนทำรายการ" };
  }

  return { supabase, user };
}

export async function createBooking(
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  const parsed = readBookingFields(formData);
  if ("error" in parsed) return parsed;

  const auth = await requireUser();
  if ("error" in auth) return auth;

  const { error } = await auth.supabase.from("bookings").insert({
    user_id: auth.user.id,
    room_id: parsed.roomId,
    booking_date: parsed.bookingDate,
    time_slot: parsed.timeSlot,
    purpose: parsed.purpose,
  });

  if (error) {
    return { error: mapDbError(error) };
  }

  revalidatePath("/");
  revalidatePath("/my-bookings");
  return { success: "จองห้องสำเร็จ" };
}

export async function updateBooking(
  bookingId: string,
  _prev: ActionState | undefined,
  formData: FormData,
): Promise<ActionState> {
  if (!bookingId) {
    return { error: "ไม่พบรหัสรายการจอง" };
  }

  const parsed = readBookingFields(formData);
  if ("error" in parsed) return parsed;

  const auth = await requireUser();
  if ("error" in auth) return auth;

  const { data, error } = await auth.supabase
    .from("bookings")
    .update({
      room_id: parsed.roomId,
      booking_date: parsed.bookingDate,
      time_slot: parsed.timeSlot,
      purpose: parsed.purpose,
    })
    .eq("id", bookingId)
    .eq("user_id", auth.user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: mapDbError(error) };
  }
  if (!data) {
    return { error: "ไม่พบรายการจอง หรือคุณไม่มีสิทธิ์แก้ไขรายการนี้" };
  }

  revalidatePath("/");
  revalidatePath("/my-bookings");
  return { success: "บันทึกการแก้ไขแล้ว" };
}

export async function deleteBooking(
  bookingId: string,
  _prev: ActionState | undefined,
): Promise<ActionState> {
  if (!bookingId) {
    return { error: "ไม่พบรหัสรายการจอง" };
  }

  const auth = await requireUser();
  if ("error" in auth) return auth;

  const { data, error } = await auth.supabase
    .from("bookings")
    .delete()
    .eq("id", bookingId)
    .eq("user_id", auth.user.id)
    .select("id")
    .maybeSingle();

  if (error) {
    return { error: mapDbError(error) };
  }
  if (!data) {
    return { error: "ไม่พบรายการจอง หรือคุณไม่มีสิทธิ์ยกเลิกรายการนี้" };
  }

  revalidatePath("/");
  revalidatePath("/my-bookings");
  return { success: "ยกเลิกการจองแล้ว" };
}
