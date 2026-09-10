-- Sample reading rooms. Rooms must come from the database, never from frontend hardcoding.

insert into public.rooms (name, capacity)
values
  ('ห้องอ่านหนังสือ A', 8),
  ('ห้องอ่านหนังสือ B', 6),
  ('ห้องติวกลุ่ม C', 12),
  ('ห้องเงียบ D', 4),
  ('ห้องวิจัย E', 10);
