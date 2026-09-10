import Link from "next/link";
import { TIME_SLOTS } from "@/lib/constants";
import { parseISODate } from "@/lib/dates";
import type { Booking, Room } from "@/lib/types";

export function AvailabilityGrid({
  rooms,
  bookings,
  selectedDate,
  selectedRoomId,
  selectedSlot,
}: {
  rooms: Room[];
  bookings: Booking[];
  selectedDate: string;
  selectedRoomId?: string;
  selectedSlot?: string;
}) {
  if (rooms.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-line bg-card px-4 py-8 text-center text-sm text-muted">
        ไม่พบรายชื่อห้องจากฐานข้อมูล
      </p>
    );
  }

  const taken = new Set(
    bookings.map((booking) => `${booking.room_id}|${booking.time_slot}`),
  );

  return (
    <div className="overflow-x-auto rounded-2xl border border-line bg-card">
      <table className="min-w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-line text-left">
            <th className="sticky left-0 bg-card px-3 py-3 font-semibold">ห้อง</th>
            {TIME_SLOTS.map((slot) => (
              <th key={slot} className="px-2 py-3 font-medium text-muted">
                {slot}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) => (
            <tr key={room.id} className="border-b border-line last:border-0">
              <th className="sticky left-0 bg-card px-3 py-3 text-left font-medium">
                <div>{room.name}</div>
                <div className="text-xs font-normal text-muted">{room.capacity} ที่นั่ง</div>
              </th>
              {TIME_SLOTS.map((slot) => {
                const busy = taken.has(`${room.id}|${slot}`);
                const selected = selectedRoomId === room.id && selectedSlot === slot;
                const query = new URLSearchParams({
                  date: parseISODate(selectedDate),
                  room: room.id,
                  slot,
                });

                return (
                  <td key={slot} className="px-1 py-1">
                    {busy ? (
                      <span className="inline-flex w-full justify-center rounded-full bg-danger-soft px-2 py-2 text-xs font-medium text-danger">
                        ไม่ว่าง
                      </span>
                    ) : (
                      <Link
                        href={`/?${query.toString()}#booking-form`}
                        replace
                        aria-label={`เลือก ${room.name} รอบ ${slot}`}
                        aria-current={selected ? "true" : undefined}
                        className={
                          selected
                            ? "inline-flex w-full justify-center rounded-full bg-accent px-2 py-2 text-xs font-medium text-white ring-2 ring-accent ring-offset-2"
                            : "inline-flex w-full justify-center rounded-full bg-ok-soft px-2 py-2 text-xs font-medium text-ok hover:bg-accent-soft hover:text-accent"
                        }
                      >
                        {selected ? "เลือกแล้ว" : "ว่าง"}
                      </Link>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
