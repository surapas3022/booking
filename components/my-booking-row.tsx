"use client";

import { useActionState, useState } from "react";
import { deleteBooking, updateBooking } from "@/lib/actions/bookings";
import { TIME_SLOTS } from "@/lib/constants";
import { formatThaiDate, todayISO } from "@/lib/dates";
import { FormAlert } from "@/components/form-alert";
import type { ActionState, BookingWithRoom, Room } from "@/lib/types";

export function MyBookingRow({
  booking,
  rooms,
}: {
  booking: BookingWithRoom;
  rooms: Room[];
}) {
  const [editing, setEditing] = useState(false);
  const updateAction = updateBooking.bind(null, booking.id);
  const [updateState, updateFormAction, updatePending] = useActionState<
    ActionState | undefined,
    FormData
  >(updateAction, undefined);
  const [deleteState, deleteFormAction, deletePending] = useActionState<
    ActionState | undefined,
    FormData
  >(deleteBooking.bind(null, booking.id), undefined);

  return (
    <article className="rounded-2xl border border-line bg-card p-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold">{booking.rooms?.name ?? "ห้องที่ถูกลบแล้ว"}</h2>
          <p className="mt-1 text-sm text-muted">
            {formatThaiDate(booking.booking_date)} · {booking.time_slot}
          </p>
          <p className="mt-2 text-sm">{booking.purpose}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            className="btn btn-ghost text-sm"
            onClick={() => setEditing((value) => !value)}
          >
            {editing ? "ปิดฟอร์ม" : "แก้ไข"}
          </button>
          <form action={deleteFormAction}>
            <button type="submit" className="btn btn-danger text-sm" disabled={deletePending}>
              {deletePending ? "กำลังยกเลิก..." : "ยกเลิกจอง"}
            </button>
          </form>
        </div>
      </div>

      <div className="mt-3 space-y-2">
        <FormAlert state={deleteState} />
        {editing ? (
          <form action={updateFormAction} className="grid gap-3 border-t border-line pt-3">
            <FormAlert state={updateState} />
            <div className="field">
              <label htmlFor={`room-${booking.id}`}>ห้อง</label>
              <select
                id={`room-${booking.id}`}
                name="room_id"
                required
                defaultValue={booking.room_id}
              >
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="field">
                <label htmlFor={`date-${booking.id}`}>วันที่</label>
                <input
                  id={`date-${booking.id}`}
                  name="booking_date"
                  type="date"
                  required
                  min={todayISO()}
                  defaultValue={booking.booking_date}
                />
              </div>
              <div className="field">
                <label htmlFor={`slot-${booking.id}`}>รอบเวลา</label>
                <select
                  id={`slot-${booking.id}`}
                  name="time_slot"
                  required
                  defaultValue={booking.time_slot}
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="field">
              <label htmlFor={`purpose-${booking.id}`}>วัตถุประสงค์</label>
              <textarea
                id={`purpose-${booking.id}`}
                name="purpose"
                required
                minLength={3}
                rows={2}
                defaultValue={booking.purpose}
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={updatePending}>
              {updatePending ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
            </button>
          </form>
        ) : null}
      </div>
    </article>
  );
}
