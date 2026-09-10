import { TIME_SLOTS } from "@/lib/constants";
import type { Booking, Room } from "@/lib/types";

export function AvailabilityGrid({
  rooms,
  bookings,
}: {
  rooms: Room[];
  bookings: Booking[];
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
                return (
                  <td key={slot} className="px-2 py-2">
                    <span
                      className={
                        busy
                          ? "inline-flex rounded-full bg-danger-soft px-2 py-1 text-xs font-medium text-danger"
                          : "inline-flex rounded-full bg-ok-soft px-2 py-1 text-xs font-medium text-ok"
                      }
                    >
                      {busy ? "ไม่ว่าง" : "ว่าง"}
                    </span>
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
