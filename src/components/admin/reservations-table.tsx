
"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, ListOrdered, Calendar, Clock, User, Sailboat } from "lucide-react";
import type { Booking, Slot } from "@/app/admin/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { EditBookingDialog } from "./edit-booking-dialog";

type EnrichedBooking = Booking & {
    slot: Slot;
}

interface ReservationsTableProps {
  reservations: EnrichedBooking[];
  allSlots: Slot[];
  onSuccess: () => Promise<void>;
}

const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export function ReservationsTable({ reservations, allSlots, onSuccess }: ReservationsTableProps) {
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

        {/* Desktop View: Table */}
        <div className="hidden md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Créneau</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Téléphone</TableHead>
                <TableHead>Détail Chars</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.length > 0 ? (
                reservations.map(({ slot, ...booking }) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-medium capitalize">
                      {format(slot.date, "eeee dd MMMM yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell>{`${formatTime(slot.start)} - ${formatTime(slot.end)}`}</TableCell>
                    <TableCell>{booking.userName}</TableCell>
                    <TableCell>{booking.email}</TableCell>
                    <TableCell>{booking.phone}</TableCell>
                    <TableCell>
                      {booking.simpleChars > 0 && <span>{booking.simpleChars} simple(s)</span>}
                      {booking.simpleChars > 0 && booking.doubleChars > 0 && <span>, </span>}
                      {booking.doubleChars > 0 && <span>{booking.doubleChars} double(s)</span>}
                    </TableCell>
                    <TableCell className="text-right">
                      <EditBookingDialog
                          booking={booking}
                          currentSlot={slot}
                          allSlots={allSlots}
                          onSuccess={onSuccess}
                      >
                          <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="w-4 h-4"/>
                          </Button>
                      </EditBookingDialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center h-24">
                    Aucune réservation confirmée pour le moment.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Mobile View: Cards */}
        <div className="md:hidden space-y-4">
            {reservations.length > 0 ? (
                 reservations.map(({ slot, ...booking }) => (
                    <Card key={booking.id} className="border-l-4 border-primary">
                        <CardHeader className="p-4">
                            <CardTitle className="flex items-center justify-between">
                                <span className="flex items-center gap-2"><User className="w-4 h-4" />{booking.userName}</span>
                                <EditBookingDialog
                                    booking={booking}
                                    currentSlot={slot}
                                    allSlots={allSlots}
                                    onSuccess={onSuccess}
                                >
                                    <Button variant="outline" size="sm" className="h-8 px-3 text-xs">
                                        <Edit className="w-3 h-3 mr-1" /> Modifier
                                    </Button>
                                </EditBookingDialog>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0 text-sm text-muted-foreground space-y-2">
                             <div className="flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-primary" />
                                <span className="capitalize">{format(slot.date, "eeee dd MMMM", { locale: fr })}</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <span>{`${formatTime(slot.start)} - ${formatTime(slot.end)}`}</span>
                            </div>
                             <div className="flex items-center gap-2 pt-2">
                                <Sailboat className="w-4 h-4 text-primary" />
                                <span className="font-semibold text-foreground">
                                    {booking.simpleChars > 0 && <span>{booking.simpleChars} simple(s)</span>}
                                    {booking.simpleChars > 0 && booking.doubleChars > 0 && <span>, </span>}
                                    {booking.doubleChars > 0 && <span>{booking.doubleChars} double(s)</span>}
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                 ))
            ) : (
                <div className="text-center py-12">
                    <p>Aucune réservation confirmée.</p>
                </div>
            )}
        </div>

      </CardContent>
    </Card>
  );
}
