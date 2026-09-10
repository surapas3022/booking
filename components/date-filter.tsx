"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { parseISODate, todayISO } from "@/lib/dates";

export function DateFilter({
  value,
  roomId,
  slot,
}: {
  value: string;
  roomId?: string;
  slot?: string;
}) {
  const router = useRouter();
  const [date, setDate] = useState(() => parseISODate(value));

  useEffect(() => {
    setDate(parseISODate(value));
  }, [value]);

  return (
    <div className="field">
      <label htmlFor="date">ดูตารางวันที่</label>
      <input
        id="date"
        name="date"
        type="date"
        value={date}
        min={todayISO()}
        onChange={(event) => {
          const next = event.target.value;
          if (!next) return;
          setDate(next);
          const params = new URLSearchParams({ date: parseISODate(next) });
          if (roomId) params.set("room", roomId);
          if (slot) params.set("slot", slot);
          router.replace(`/?${params.toString()}`);
        }}
      />
    </div>
  );
}
