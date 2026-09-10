import { todayISO } from "@/lib/dates";

export function DateFilter({ value }: { value: string }) {
  return (
    <form method="get" className="flex flex-wrap items-end gap-3">
      <div className="field">
        <label htmlFor="date">ดูตารางวันที่</label>
        <input
          id="date"
          name="date"
          type="date"
          defaultValue={value}
          min={todayISO()}
        />
      </div>
      <button type="submit" className="btn btn-ghost">
        แสดงตาราง
      </button>
    </form>
  );
}
