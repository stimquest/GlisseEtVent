
"use client";

import { ReservationsTable } from "@/components/admin/reservations-table";
import { useAdminContext } from "@/app/admin/admin-context";

export default function AdminReservationsPage() {
  const { slots, refreshSlots } = useAdminContext();
  
  const allBookings = slots
    .flatMap(slot => 
        slot.bookings.map(booking => ({
            ...booking,
            slot: slot, // Pass the whole slot object
        }))
    )
    .sort((a, b) => a.slot.date.getTime() - b.slot.date.getTime() || a.slot.start - b.slot.start);

  return (
      <ReservationsTable 
        reservations={allBookings} 
        allSlots={slots}
        onSuccess={refreshSlots} 
      />
  );
}
