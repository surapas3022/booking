export type Room = {
  id: string;
  name: string;
  capacity: number;
  created_at: string;
};

export type Booking = {
  id: string;
  user_id: string;
  room_id: string;
  booking_date: string;
  time_slot: string;
  purpose: string;
  created_at: string;
};

export type BookingWithRoom = Booking & {
  rooms: Pick<Room, "id" | "name" | "capacity"> | null;
};

export type ActionState = {
  error?: string;
  success?: string;
};
