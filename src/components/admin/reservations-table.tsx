
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { ListOrdered } from "lucide-react";
import type { Booking } from "@/app/admin/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

type EnrichedBooking = Booking & {
    date: Date;
    start: number;
    end: number;
}

interface ReservationsTableProps {
  reservations: EnrichedBooking[];
}

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export function ReservationsTable({ reservations }: ReservationsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
            <ListOrdered className="w-6 h-6 text-accent"/>
            Liste des Réservations
        </CardTitle>
        <CardDescription>
            Voici la liste de toutes les réservations confirmées, triées par date.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Créneau</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Téléphone</TableHead>
              <TableHead>Détail Chars</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reservations.length > 0 ? (
              reservations.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium capitalize">
                    {format(booking.date, "eeee dd MMMM yyyy", { locale: fr })}
                  </TableCell>
                  <TableCell>{`${formatTime(booking.start)} - ${formatTime(booking.end)}`}</TableCell>
                  <TableCell>{booking.userName}</TableCell>
                   <TableCell>{booking.email}</TableCell>
                   <TableCell>{booking.phone}</TableCell>
                  <TableCell>
                    {booking.simpleChars > 0 && <span>{booking.simpleChars} simple(s)</span>}
                    {booking.simpleChars > 0 && booking.doubleChars > 0 && <span>, </span>}
                    {booking.doubleChars > 0 && <span>{booking.doubleChars} double(s)</span>}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  Aucune réservation confirmée pour le moment.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
