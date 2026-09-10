"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createBooking } from "@/lib/actions/bookings";
import { TIME_SLOTS } from "@/lib/constants";
import { parseISODate, todayISO } from "@/lib/dates";
import { FormAlert } from "@/components/form-alert";
import type { ActionState, Room } from "@/lib/types";

export function BookingForm({
  rooms,
  defaultDate,
  defaultRoomId = "",
  defaultTimeSlot = "",
}: {
  rooms: Room[];
  defaultDate: string;
  defaultRoomId?: string;
  defaultTimeSlot?: string;
}) {
  const router = useRouter();
  const purposeRef = useRef<HTMLTextAreaElement>(null);
  const [roomId, setRoomId] = useState(defaultRoomId);
  const [bookingDate, setBookingDate] = useState(() => parseISODate(defaultDate));
  const [timeSlot, setTimeSlot] = useState(defaultTimeSlot);
  const [purpose, setPurpose] = useState("");
  const [state, formAction, pending] = useActionState<ActionState | undefined, FormData>(
    createBooking,
    undefined,
  );

  useEffect(() => {
    setRoomId(defaultRoomId);
    setBookingDate(parseISODate(defaultDate));
    setTimeSlot(defaultTimeSlot);
  }, [defaultRoomId, defaultDate, defaultTimeSlot]);

  useEffect(() => {
    if (defaultRoomId && defaultTimeSlot) {
      purposeRef.current?.focus();
    }
  }, [defaultRoomId, defaultDate, defaultTimeSlot]);

  useEffect(() => {
    if (!state?.success) return;
    setPurpose("");
    setRoomId("");
    setTimeSlot("");
    const params = new URLSearchParams({ date: parseISODate(bookingDate) });
    router.replace(`/?${params.toString()}`);
  }, [bookingDate, router, state?.success]);

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
        <select
          id="room_id"
          name="room_id"
          required
          value={roomId}
          onChange={(event) => setRoomId(event.target.value)}
        >
          <option value="">
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
            value={bookingDate}
            onChange={(event) => setBookingDate(event.target.value)}
          />
        </div>
        <div className="field">
          <label htmlFor="time_slot">รอบเวลา</label>
          <select
            id="time_slot"
            name="time_slot"
            required
            value={timeSlot}
            onChange={(event) => setTimeSlot(event.target.value)}
          >
            <option value="">
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
          ref={purposeRef}
          required
          minLength={3}
          rows={3}
          value={purpose}
          onChange={(event) => setPurpose(event.target.value)}
          placeholder="เช่น อ่านหนังสือสอบ, ติวกลุ่ม, ทำงานวิจัย"
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={pending}>
        {pending ? "กำลังบันทึก..." : "ยืนยันการจอง"}
      </button>
    </form>
  );
}
