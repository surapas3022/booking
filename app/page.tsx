import { AvailabilityGrid } from "@/components/availability-grid";
import { BookingForm } from "@/components/booking-form";
import { DateFilter } from "@/components/date-filter";
import { MissingConfig } from "@/components/missing-config";
import { Nav } from "@/components/nav";
import { TIME_SLOTS } from "@/lib/constants";
import { parseISODate } from "@/lib/dates";
import { hasSupabaseEnv } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import type { Booking, Room } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const selectedDate = parseISODate(params.date);

  if (!hasSupabaseEnv()) {
    return <MissingConfig />;
  }

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: rooms, error: roomsError }, { data: bookings, error: bookingsError }] =
    await Promise.all([
      supabase.from("rooms").select("id, name, capacity, created_at").order("name"),
      supabase
        .from("bookings")
        .select("id, user_id, room_id, booking_date, time_slot, purpose, created_at")
        .eq("booking_date", selectedDate),
    ]);

  const requestedRoom = typeof params.room === "string" ? params.room : "";
  const requestedSlot = typeof params.slot === "string" ? params.slot : "";
  const selectedRoomId = (rooms ?? []).some((room) => room.id === requestedRoom)
    ? requestedRoom
    : "";
  const selectedSlot = TIME_SLOTS.includes(
    requestedSlot as (typeof TIME_SLOTS)[number],
  )
    ? requestedSlot
    : "";

  return (
    <>
      <Nav email={user?.email} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-accent">หน้าหลัก</p>
          <h1 className="text-3xl font-semibold tracking-tight">จองห้องอ่านหนังสือ</h1>
          <p className="max-w-2xl text-muted">
            จิ้มช่องว่างในตารางเพื่อเลือกห้องและรอบเวลา แล้วกรอกแค่วัตถุประสงค์ ข้อมูลห้องดึงจากฐานข้อมูล
            ไม่ได้ฝังไว้ในหน้าเว็บ
          </p>
        </div>

        <section className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
          <div className="space-y-4">
            <DateFilter
              value={selectedDate}
              roomId={selectedRoomId}
              slot={selectedSlot}
            />
            {roomsError || bookingsError ? (
              <p role="alert" className="rounded-xl bg-danger-soft px-3 py-2 text-sm text-danger">
                {roomsError?.message ||
                  bookingsError?.message ||
                  "ไม่สามารถโหลดข้อมูลห้องหรือการจองได้"}
              </p>
            ) : (
              <AvailabilityGrid
                rooms={(rooms ?? []) as Room[]}
                bookings={(bookings ?? []) as Booking[]}
                selectedDate={selectedDate}
                selectedRoomId={selectedRoomId}
                selectedSlot={selectedSlot}
              />
            )}
          </div>
          <aside id="booking-form" className="scroll-mt-6 rounded-2xl border border-line bg-card p-5">
            <h2 className="text-lg font-semibold">สร้างการจอง</h2>
            <p className="mt-1 text-sm text-muted">
              จิ้มช่องว่างในตารางเพื่อเติมห้อง วันที่ และรอบเวลาให้อัตโนมัติ เหลือแค่กรอกวัตถุประสงค์
            </p>
            <div className="mt-4">
              <BookingForm
                rooms={(rooms ?? []) as Room[]}
                defaultDate={selectedDate}
                defaultRoomId={selectedRoomId}
                defaultTimeSlot={selectedSlot}
              />
            </div>
          </aside>
        </section>
      </main>
    </>
  );
}
