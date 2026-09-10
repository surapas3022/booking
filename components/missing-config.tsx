export function MissingConfig() {
  return (
    <main className="mx-auto flex w-full max-w-xl flex-1 items-center px-4 py-16">
      <div className="rounded-2xl border border-line bg-card p-6">
        <h1 className="text-2xl font-semibold">ยังไม่ได้ตั้งค่า Supabase</h1>
        <p className="mt-2 text-sm text-muted">
          สร้างโปรเจกต์บน Supabase แล้วใส่ค่าต่อไปนี้ในไฟล์ <code>.env.local</code> จากนั้นรัน
          <code> supabase/schema.sql</code> และ <code>supabase/seed.sql</code>
        </p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-sm">
          <li>NEXT_PUBLIC_SUPABASE_URL</li>
          <li>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</li>
        </ul>
      </div>
    </main>
  );
}
