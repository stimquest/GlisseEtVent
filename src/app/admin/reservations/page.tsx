
"use client";

import { ReservationsTable } from "@/components/admin/reservations-table";
import { useAdminContext } from "@/app/admin/admin-context";

export default function AdminReservationsPage() {
  const { slots } = useAdminContext();
  
  const allBookings = slots
    .flatMap(slot => 
        slot.bookings.map(booking => ({
            ...booking,
            date: slot.date,
            start: slot.start,
            end: slot.end,
        }))
    )
    .sort((a, b) => a.date.getTime() - b.date.getTime() || a.start - b.start);

  return (
      <ReservationsTable reservations={allBookings} />
  );
}
