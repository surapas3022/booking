# Self-test Checklist

ทดสอบตามรายการตรวจรับงาน 12 ข้อ ระบุผลตามที่ทำได้จริงตอนส่งโค้ด

| ID | รายการ | ผล | วิธีทดสอบ / หมายเหตุ |
|---|---|---|---|
| 01 | สมัครและเข้าสู่ระบบ | ยังไม่ผ่าน | หน้า `/login` และ `/signup` พร้อมแล้ว แต่ยังไม่มี Supabase project จึงทดสอบ signup/login จริงไม่ได้ |
| 02 | ป้องกันการเข้าถึง | ผ่านบางส่วน | `middleware.ts` redirect ไป `/login` เมื่อไม่มี session; ตอนยังไม่ใส่ env หน้า protected จะแสดงหน้าตั้งค่าแทนการพัง |
| 03 | ข้อมูลห้องมาจาก DB | ผ่าน (โค้ด) | `app/page.tsx` ดึง `from("rooms")` ไม่มีรายชื่อห้องใน frontend |
| 04 | Data Persistence | ยังไม่ผ่าน | ยังไม่ได้สร้างการจองจริงบนฐานข้อมูล |
| 05 | CRUD ข้อมูลตนเอง | ผ่าน (โค้ด) | `/my-bookings` มีแก้และยกเลิก; ต้องทดสอบอีกครั้งหลังใส่ env |
| 06 | Isolation Protection | ผ่าน (โค้ด) | Action กรอง `user_id = auth.uid()` และ RLS บังคับ UPDATE/DELETE ของเจ้าของเท่านั้น |
| 07 | Double Booking Protection | ผ่าน (โค้ด) | Unique `(room_id, booking_date, time_slot)` ใน `supabase/schema.sql` แปลง error `23505` เป็นข้อความไทย |
| 08 | Form Validation | ผ่าน (โค้ด) | required / วันที่อดีต / รอบเวลา / ความยาววัตถุประสงค์ ทั้งฝั่งฟอร์มและ Server Action |
| 09 | Error Handling | ผ่าน (โค้ด) | `lib/errors.ts` แปลง Auth/DB error เป็นภาษาไทยบน UI |
| 10 | Security Check | ผ่าน | git ไม่ stage `.env.local`; ไม่มี `service_role` ในซอร์สของโปรเจกต์ มีแค่คำเตือนใน README |
| 11 | Production Availability | ยังไม่ผ่าน | local commit พร้อมแล้ว แต่ `git push` ไม่สำเร็จเพราะยังไม่มี repo `surapas3022/booking` |
| 12 | Env Vars & Auth Callback | ยังไม่ผ่าน | ต้องใส่ env บน Vercel และ Redirect URL ใน Supabase หลังมี Production URL |

## การตรวจในเครื่องนี้

- `docker compose up` แล้วเปิดจาก container ได้ `200` ที่ `/`, `/login`, `/signup`
- `npx tsc --noEmit` ผ่าน
- พอร์ตโฮสต์ใช้ `3001` เพราะ `3000` ถูก container อื่นจองไว้
