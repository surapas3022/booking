"use client";

import { useActionState } from "react";
import { createBooking } from "@/lib/actions/bookings";
import { TIME_SLOTS } from "@/lib/constants";
import { todayISO } from "@/lib/dates";
import { FormAlert } from "@/components/form-alert";
import type { ActionState, Room } from "@/lib/types";

export function BookingForm({
  rooms,
  defaultDate,
}: {
  rooms: Room[];
  defaultDate: string;
}) {
  const [state, formAction, pending] = useActionState<ActionState | undefined, FormData>(
    createBooking,
    undefined,
  );

  if (rooms.length === 0) {
    return (
      <p className="rounded-xl border border-line bg-card px-4 py-6 text-sm text-muted">
        ยังไม่มีข้อมูลห้องในฐานข้อมูล รันไฟล์ `supabase/seed.sql` ก่อนเริ่มจอง
      </p>
    );
  }

  return (
    <form action={formAction} className="grid gap-4">
      <FormAlert state={state} />
      <div className="field">
        <label htmlFor="room_id">ห้อง</label>
        <select id="room_id" name="room_id" required defaultValue="">
          <option value="" disabled>
            เลือกห้อง
          </option>
          {rooms.map((room) => (
            <option key={room.id} value={room.id}>
              {room.name} (รองรับ {room.capacity} คน)
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="field">
          <label htmlFor="booking_date">วันที่</label>
          <input
            id="booking_date"
            name="booking_date"
            type="date"
            required
            min={todayISO()}
            defaultValue={defaultDate}
          />
        </div>
        <div className="field">
          <label htmlFor="time_slot">รอบเวลา</label>
          <select id="time_slot" name="time_slot" required defaultValue="">
            <option value="" disabled>
              เลือกช่วงเวลา
            </option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="field">
        <label htmlFor="purpose">วัตถุประสงค์</label>
        <textarea
          id="purpose"
          name="purpose"
          required
          minLength={3}
          rows={3}
          placeholder="เช่น อ่านหนังสือสอบ, ติวกลุ่ม, ทำงานวิจัย"
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "กำลังบันทึก..." : "ยืนยันการจอง"}
      </button>
    </form>
  );
}
