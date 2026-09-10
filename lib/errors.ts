export function mapAuthError(message: string) {
  const normalized = message.toLowerCase();

  if (normalized.includes("invalid login credentials")) {
    return "อีเมลหรือรหัสผ่านไม่ถูกต้อง";
  }
  if (normalized.includes("user already registered")) {
    return "อีเมลนี้ถูกใช้สมัครแล้ว";
  }
  if (normalized.includes("email not confirmed")) {
    return "บัญชียังไม่ได้รับการยืนยัน — ปิด Confirm email ใน Supabase Auth แล้วลองใหม่";
  }
  if (normalized.includes("password")) {
    return "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร";
  }

  return message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ";
}

export function mapDbError(error: { code?: string; message?: string }) {
  if (error.code === "23505") {
    return "ช่วงเวลานี้ถูกจองแล้ว กรุณาเลือกห้อง วัน หรือรอบเวลาอื่น";
  }
  if (error.code === "42501") {
    return "คุณไม่มีสิทธิ์ทำรายการนี้";
  }

  return error.message || "เกิดข้อผิดพลาดจากฐานข้อมูล กรุณาลองอีกครั้ง";
}
