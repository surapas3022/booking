# Dogfood Report: จองห้องอ่านหนังสือ

| Field | Value |
|-------|-------|
| **Date** | 2026-09-11 |
| **App URL** | https://booking-nine-iota.vercel.app/login |
| **Session** | booking-nine-iota |
| **Scope** | Full production: auth, ตารางห้อง, จอง/แก้/ยกเลิก, validation, mobile |

## Summary

| Severity | Count |
|----------|-------|
| Critical | 0 |
| High | 0 |
| Medium | 5 |
| Low | 3 |
| **Total** | **8** |

Production พร้อมใช้สำหรับเวิร์กโฟลว์หลัก: สมัคร, เข้าสู่ระบบ, ดึงห้องจากฐานข้อมูล, จอง, แก้, กันจองซ้ำ, ยกเลิก, ออกจากระบบแล้วเข้าใหม่ได้ ไม่พบ console error ระหว่างทดสอบ

## Issues

### ISSUE-001: ข้อความตรวจฟอร์มของเบราว์เซอร์เป็นภาษาอังกฤษ

| Field | Value |
|-------|-------|
| **Severity** | low |
| **Category** | ux / accessibility |
| **URL** | https://booking-nine-iota.vercel.app/login |
| **Repro Video** | N/A |

**Description**

UI ทั้งแอปเป็นภาษาไทย แต่การกดส่งฟอร์มว่างใช้ HTML5 validation ของเบราว์เซอร์ จึงขึ้น `Please fill out this field.` / `Please lengthen this text to 6 characters or more` ซึ่งไม่สอดคล้องกับข้อความ error อื่นที่เป็นไทย (เช่น อีเมลหรือรหัสผ่านไม่ถูกต้อง)

**Repro Steps**

1. เปิด `/login` แล้วกด «เข้าสู่ระบบ» โดยไม่กรอกช่อง
   ![Result](screenshots/issue-001.png)

---

### ISSUE-002: ฟอร์มล้างค่าหลัง login/signup ไม่สำเร็จ

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | ux |
| **URL** | https://booking-nine-iota.vercel.app/login |
| **Repro Video** | N/A |

**Description**

หลัง login ด้วยบัญชีที่ไม่มี หรือสมัครด้วยอีเมลซ้ำ หน้าแสดงข้อความไทยถูกต้อง แต่ช่องอีเมล/รหัสผ่านกลับเป็นค่าว่าง (เหลือแค่ placeholder) ผู้ใช้ต้องพิมพ์ใหม่ทั้งคู่

**Repro Steps**

1. กรอกอีเมล/รหัสผ่านผิด แล้วกดเข้าสู่ระบบ — ช่องกลับเป็น placeholder
   ![Login](screenshots/issue-002-login.png)
2. สมัครด้วยอีเมลที่มีอยู่แล้ว — ช่องถูกล้างเช่นกัน
   ![Signup](screenshots/issue-002-signup.png)

---

### ISSUE-003: คำอธิบายหน้ารายการพูดถึง RLS ซึ่งเป็นศัพท์เทคนิค

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | content |
| **URL** | https://booking-nine-iota.vercel.app/my-bookings |
| **Repro Video** | N/A |

**Description**

ข้อความใต้หัวข้อ «รายการจองของฉัน» คือ «แก้ไขหรือยกเลิกได้เฉพาะรายการของบัญชีนี้ บัญชีอื่นจะถูก RLS บล็อกไว้» นักศึกษาทั่วไปไม่รู้จัก RLS นี่คือรายละเอียดของโจทย์/ระบบ ไม่ใช่สำเนาสำหรับผู้ใช้

**Repro Steps**

1. เข้าสู่ระบบ แล้วเปิด `/my-bookings`
   ![Result](screenshots/issue-003.png)

---

### ISSUE-004: คำโปรยหน้าแรกอธิบายสถาปัตยกรรมให้ผู้ใช้

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | content |
| **URL** | https://booking-nine-iota.vercel.app/ |
| **Repro Video** | N/A |

**Description**

คำโปรยมีประโยค «ข้อมูลห้องดึงจากฐานข้อมูล ไม่ได้ฝังไว้ในหน้าเว็บ» ซึ่งเป็นหลักฐานตามเกณฑ์รับงาน ไม่ใช่ภาษาที่ผู้จองห้องต้องการ

**Repro Steps**

1. เข้าสู่ระบบแล้วดูหน้าแรก
   ![Result](screenshots/issue-004.png)

---

### ISSUE-005: มือถือ — แถบนำทางตัดคำ และตารางล้นจอ

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | visual |
| **URL** | https://booking-nine-iota.vercel.app/ |
| **Repro Video** | N/A |

**Description**

ที่ความกว้าง 390px โลโก้ตัดเป็น «ห้องอ่าน / หนังสือ», ลิงก์ «รายการของฉัน» ตัดเป็น «รายการของ / ฉัน», ปุ่มออกจากระบบตัดเป็น «ออกจาก / ระบบ» อีเมลผู้ใช้หายจากแถบนำทาง ตารางรอบเวลาล้นขอบขวา ต้องเลื่อนแนวนอนจึงเห็นช่องบ่าย

**Repro Steps**

1. เปิดหน้าจองที่ viewport กว้าง 390px
   ![Result](screenshots/issue-005.png)

---

### ISSUE-006: ยกเลิกจองทันทีโดยไม่มีขั้นยืนยัน

| Field | Value |
|-------|-------|
| **Severity** | medium |
| **Category** | ux |
| **URL** | https://booking-nine-iota.vercel.app/my-bookings |
| **Repro Video** | N/A |

**Description**

ปุ่ม «ยกเลิกจอง» ไม่มี confirm dialog กดครั้งเดียวเข้าสถานะ «กำลังยกเลิก...» แล้วรายการหายทันที การกดพลาดจะลบการจองจริง

**Repro Steps**

1. มีรายการจอง เปิดฟอร์มแก้ไข
   ![Step 1](screenshots/issue-006-step-1.png)
2. กด «ยกเลิกจอง» — ไม่มีกล่องยืนยัน ปุ่มเปลี่ยนเป็นกำลังยกเลิก
   ![Step 2](screenshots/issue-006-step-2.png)
3. **Observe:** รายการหาย เหลือ empty state
   ![Result](screenshots/issue-006-result.png)

---

### ISSUE-007: Empty state ไม่มีลิงก์ไปหน้าจอง

| Field | Value |
|-------|-------|
| **Severity** | low |
| **Category** | ux |
| **URL** | https://booking-nine-iota.vercel.app/my-bookings |
| **Repro Video** | N/A |

**Description**

ข้อความ «ยังไม่มีรายการจอง สร้างรายการแรกได้ที่หน้าจองห้อง» ไม่ใช่ลิงก์ ผู้ใช้ต้องรู้เองว่าต้องกด «จองห้อง» ด้านบน

**Repro Steps**

1. เปิด `/my-bookings` เมื่อยังไม่มีรายการ
   ![Result](screenshots/issue-007.png)

---

### ISSUE-008: ป้าย date picker สำหรับโปรแกรมอ่านหน้าจอเป็นภาษาอังกฤษ

| Field | Value |
|-------|-------|
| **Severity** | low |
| **Category** | accessibility |
| **URL** | https://booking-nine-iota.vercel.app/ |
| **Repro Video** | N/A |

**Description**

ช่องวันที่ในตารางและฟอร์มมี accessible name เป็น `Day Day`, `Month Month`, `Year Year` และปุ่ม `Show date picker` ทั้งที่เลเบิลที่มองเห็นเป็นไทย («ดูตารางวันที่», «วันที่»)

**Repro Steps**

1. เข้าสู่ระบบ เปิดหน้าแรก แล้วดู accessibility tree ของช่องวันที่
   ![Result](screenshots/issue-008.png)

---

## สิ่งที่ผ่านบน production

- สมัครสมาชิกแล้วเข้าสู่ระบบอัตโนมัติ; ออกจากระบบแล้ว login ซ้ำได้
- ไม่มี session ถูกเด้งไป `/login`; มี session ถูกเด้งออกจาก `/login` และ `/signup`
- ห้อง 5 ห้องมาจากฐานข้อมูล; มีช่อง «ไม่ว่าง» จากบัญชีอื่นอยู่แล้ว (ห้องเงียบ D 09:00)
- สร้างการจองแล้วสถานะตารางอัปเดต; แก้วัตถุประสงค์ได้; จองชนช่องไม่ว่างขึ้นข้อความไทย
- ยกเลิกแล้วช่องกลับเป็นว่างหลังรีเฟรชหน้าจอง
- อีเมลซ้ำตอนสมัคร: «อีเมลนี้ถูกใช้สมัครแล้ว»
- Login ผิด: «อีเมลหรือรหัสผ่านไม่ถูกต้อง»
- Console สะอาดระหว่างทดสอบ
