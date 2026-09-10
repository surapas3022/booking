# AI Worklog

บันทึก prompt และรอบการทำงานของระบบจองห้องอ่านหนังสือ

## Planning

**Prompt:** วิเคราะห์ requirement ของระบบจองห้องอ่านหนังสือ (Capstone Workshop) แล้วนำไปทำ Implementation Plan ครอบคลุม overview, tech stack, schema, RLS, routes, roadmap 110 นาที, acceptance 12 ข้อ และ deliverables

**ผลลัพธ์:** วางแผน greenfield ทั้งโปรเจกต์ด้วย Next.js App Router, Supabase, Docker Compose (ไม่ลง Node ในเครื่อง) และ Vercel ล็อก `rooms.id` เป็น uuid, รอบเวลาคงที่, ปิด confirm email, เปิด RLS ทั้ง `bookings` และ `rooms`

**Prompt เพิ่ม:** ระบุ GitHub เป็น https://github.com/surapas3022

**ผลลัพธ์:** กำหนดปลายทาง repo เป็น `https://github.com/surapas3022/booking`

## Implementation

**Prompt:** Implement the plan as specified. Do not edit the plan file. Complete every to-do.

งานที่ทำ:

- Scaffold Next.js 16 ผ่าน `docker run ... create-next-app`
- เขียน `docker-compose.yml`, `.env.example`, SQL schema/seed, Auth helpers, middleware
- สร้าง `/login` `/signup` `/` `/my-bookings` ด้วย Server Actions
- แปลง unique violation (`23505`) และ validation เป็นข้อความภาษาไทย
- เขียน README, worklog, และ self-test checklist

## Debug

- `npm install` บน Docker volume ของ Windows ช้ามากระหว่าง scaffold รอนานกว่า 10 นาที
- `tsc` ฟ้องว่า Supabase infer `rooms` จาก join เป็น array — ปรับ mapper ให้เหลือ object เดียว
- Next.js 16 เปลี่ยนชื่อ convention เป็น `proxy.ts` แต่โจทย์บังคับใช้ `middleware.ts` จึงคงไฟล์นี้ไว้
- เครื่องไม่มี `gh` — ใช้ git remote / ติดตั้ง GitHub CLI ตอน deploy
- ยังไม่มี Supabase project จากผู้ใช้ตอนเริ่มงาน จึงใส่หน้า Missing Config และขั้นตอนใน README แทนการฝัง secret

## Final Review

ตรวจตามแผน:

- ไม่มี admin, payment, email จริง, upload, social login, time picker อิสระ
- ไม่มี `service_role` ใน repo
- `.env*` ถูก ignore ยกเว้น `.env.example`
- รายชื่อห้องมาจากตาราง `rooms`
- `user_id` มาจาก `auth.getUser()` เท่านั้น
- Unique constraint อยู่ที่ `(room_id, booking_date, time_slot)`
- RLS ครบ SELECT/INSERT/UPDATE/DELETE ตามโจทย์
