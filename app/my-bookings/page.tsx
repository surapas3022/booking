import { MissingConfig } from "@/components/missing-config";
import { MyBookingRow } from "@/components/my-booking-row";
import { Nav } from "@/components/nav";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { BookingWithRoom, Room } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function MyBookingsPage() {
  if (!hasSupabaseEnv()) {
    return <MissingConfig />;
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: rooms }, { data: bookings, error }] = await Promise.all([
    supabase.from("rooms").select("id, name, capacity, created_at").order("name"),
    supabase
      .from("bookings")
      .select(
        "id, user_id, room_id, booking_date, time_slot, purpose, created_at, rooms(id, name, capacity)",
      )
      .eq("user_id", user?.id ?? "")
      .order("booking_date", { ascending: true })
      .order("time_slot", { ascending: true }),
  ]);

  const items = (bookings ?? []).map((row) => ({
    ...row,
    rooms: Array.isArray(row.rooms) ? (row.rooms[0] ?? null) : row.rooms,
  })) as BookingWithRoom[];

  return (
    <>
      <Nav email={user?.email} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8">
        <p className="text-sm font-medium text-accent">บัญชีของฉัน</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">รายการจองของฉัน</h1>
        <p className="mt-2 text-muted">
          แก้ไขหรือยกเลิกได้เฉพาะรายการของบัญชีนี้ บัญชีอื่นจะถูก RLS บล็อกไว้
        </p>

        {error ? (
          <p role="alert" className="mt-6 rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
            {error.message}
          </p>
        ) : items.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-line bg-card px-4 py-10 text-center text-sm text-muted">
            ยังไม่มีรายการจอง สร้างรายการแรกได้ที่หน้าจองห้อง
          </p>
        ) : (
          <div className="mt-6 grid gap-4">
            {items.map((booking) => (
              <MyBookingRow
                key={booking.id}
                booking={booking}
                rooms={(rooms ?? []) as Room[]}
              />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
