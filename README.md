# ระบบจองห้องอ่านหนังสือ

เว็บไซต์จองห้องอ่านหนังสือของมหาวิทยาลัย สร้างด้วย Next.js App Router, TypeScript, Tailwind CSS และ Supabase (PostgreSQL + Auth + RLS) รันเครื่องพัฒนาผ่าน Docker โดยไม่ต้องลง Node.js ในเครื่อง

- GitHub: https://github.com/surapas3022/booking

## Architecture

```
Browser → Next.js (Vercel / Docker)
        → Middleware ตรวจ session
        → Server Components / Server Actions
        → Supabase Auth + PostgreSQL + RLS
```

- `/login`, `/signup` — อีเมล/รหัสผ่าน
- `/` — รายชื่อห้องจากตาราง `rooms`, ตารางว่าง/ไม่ว่าง, ฟอร์มจอง
- `/my-bookings` — ดู แก้ไข ยกเลิกเฉพาะรายการของตนเอง
- `middleware.ts` — ไม่มี session จะถูกส่งไป `/login`

รายชื่อห้องดึงจากฐานข้อมูลเท่านั้น ไม่ได้ hardcode ใน frontend รอบเวลาเป็นค่าคงที่ (`09:00-10:00` ถึง `16:00-17:00`) เพราะไม่อยู่ในขอบเขตให้เลือกเวลาเริ่ม-จบอิสระ

## Database schema

```
auth.users 1 ── * bookings * ── 1 rooms
```

| Table | คอลัมน์สำคัญ |
|---|---|
| `rooms` | `id uuid PK`, `name`, `capacity`, `created_at` |
| `bookings` | `id uuid PK`, `user_id → auth.users`, `room_id → rooms`, `booking_date`, `time_slot`, `purpose`, `created_at` |

Unique constraint ป้องกันจองซ้ำ:

```sql
unique (room_id, booking_date, time_slot)
```

### RLS บน `bookings`

- SELECT: ผู้ใช้ที่ล็อกอินอ่านรายการจองทั้งหมดได้ เพื่อดูช่วงไม่ว่าง
- INSERT: ต้องเป็น `auth.uid() = user_id`
- UPDATE / DELETE: ได้เฉพาะแถวของตนเอง

`rooms` เปิด RLS และให้ `authenticated` อ่านได้อย่างเดียว

SQL พร้อมรันอยู่ที่ `supabase/schema.sql` และ `supabase/seed.sql`

## วิธีสร้าง Supabase

1. สร้าง project ที่ [https://supabase.com](https://supabase.com)
2. เปิด SQL Editor รัน `supabase/schema.sql` แล้วตามด้วย `supabase/seed.sql`
3. Authentication → Providers → Email → ปิด **Confirm email** (โจทย์ไม่อยู่ในขอบเขตการส่งอีเมลจริง)
4. Authentication → URL Configuration
   - Site URL ตอนพัฒนา: `http://localhost:3001`
   - Redirect URLs: `http://localhost:3001/**`, `http://localhost:3000/**` และ Production URL ของ Vercel
5. Project Settings → API คัดลอก Project URL กับ `anon` `public` key เท่านั้น **ห้ามใช้ service_role**

## วิธีรันด้วย Docker

ไม่ต้องลง Node.js หรือ npm ในเครื่อง

```powershell
copy .env.example .env.local
# ใส่ NEXT_PUBLIC_SUPABASE_URL และ NEXT_PUBLIC_SUPABASE_ANON_KEY
docker compose up
```

เปิด [http://localhost:3001](http://localhost:3001) (map พอร์ตโฮสต์ `3001` เพราะ `3000` อาจถูกโปรเซสอื่นใช้แล้ว แอปใน container ยังฟังที่พอร์ต 3000)

ถ้าต้องการใช้ `http://localhost:3000` ให้แก้ `ports` ใน `docker-compose.yml` เป็น `"3000:3000"` แล้วอย่าลืมใส่ URL นี้ใน Supabase Redirect URLs

คำสั่ง CLI อื่นผ่าน container เท่านั้น เช่น:

```powershell
docker compose run --rm web npx tsc --noEmit
```

## Environment variables

ใช้แค่สองตัวนี้ ทั้งใน `.env.local` และบน Vercel

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

ไฟล์ `.env.local` ถูก ignore จาก git แล้ว

## Push ขึ้น GitHub

สร้าง repo ว่างชื่อ `booking` ใต้บัญชี [surapas3022](https://github.com/surapas3022) แล้วรัน:

```powershell
git remote add origin https://github.com/surapas3022/booking.git
git branch -M main
git push -u origin main
```

ถ้าเครื่องมี GitHub CLI:

```powershell
gh repo create surapas3022/booking --public --source=. --remote=origin --push
```

## Deploy บน Vercel

1. Import repo `https://github.com/surapas3022/booking`
2. ใส่ env ทั้งสองตัวด้านบน
3. Deploy
4. เอา Production URL ไปใส่ใน Supabase Redirect URLs

## Out of scope

ระบบ Admin, ชำระเงิน, อีเมลจริง, อัปโหลดไฟล์, Social Login, และการเลือกเวลาเริ่ม-จบแบบอิสระ
