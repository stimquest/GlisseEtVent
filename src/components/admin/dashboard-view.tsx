"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, Euro, Clock, Sailboat, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { Slot } from "@/app/admin/types";
import { ChartTooltipContent, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useMemo, useState } from "react";
import { format, addDays, isAfter, startOfDay, isSameDay, isBefore } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAvailableCount, getBookedCount } from "@/lib/slots";
import { addBooking } from "@/app/actions";

interface DashboardViewProps {
  slots: Slot[];
}

const StatCard = ({ title, value, icon: Icon, details }: { title: string, value: string | number, icon: React.ElementType, details?: string }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      {details && <p className="text-xs text-muted-foreground">{details}</p>}
    </CardContent>
  </Card>
);

const PRICE_PER_CHAR = 35;

// Schéma de validation pour nouvelle réservation
const newBookingSchema = z.object({
  userName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Le numéro de téléphone doit contenir au moins 10 chiffres"),
  slotId: z.string().min(1, "Sélectionnez un créneau"),
  simpleChars: z.coerce.number().min(0),
  doubleChars: z.coerce.number().min(0),
}).refine((data) => data.simpleChars > 0 || data.doubleChars > 0, {
  message: "La réservation doit contenir au moins un char.",
  path: ["simpleChars"],
});

export function DashboardView({ slots = [] }: DashboardViewProps) {
    const [isNewBookingOpen, setIsNewBookingOpen] = useState(false);
    const { toast } = useToast();

    const newBookingForm = useForm<z.infer<typeof newBookingSchema>>({
      resolver: zodResolver(newBookingSchema),
      defaultValues: {
        userName: "",
        email: "",
        phone: "",
        slotId: "",
        simpleChars: 0,
        doubleChars: 0,
      },
    });

    const stats = useMemo(() => {
        const today = startOfDay(new Date());
        const futureSlots = slots.filter(s => isAfter(s.date, today) || isSameDay(s.date, today));

        let totalBookings = 0;
        let totalSimpleBooked = 0;
        let totalDoubleBooked = 0;
        const uniqueUserEmails = new Set<string>();

        futureSlots.forEach(slot => {
            totalBookings += slot.bookings.length;
            slot.bookings.forEach(booking => {
                totalSimpleBooked += booking.simpleChars;
                totalDoubleBooked += booking.doubleChars;
                uniqueUserEmails.add(booking.email);
            });
        });

        const estimatedRevenue = (totalSimpleBooked * PRICE_PER_CHAR) + (totalDoubleBooked * 50);
        const totalHoursBooked = futureSlots.reduce((acc, slot) => {
            const durationHours = (slot.end - slot.start) / 60;
            const totalCharsBookedInSlot = getBookedCount(slot).simpleBooked + getBookedCount(slot).doubleBooked;
            // We assume one booking is for one slot duration, not per char
            if (totalCharsBookedInSlot > 0) {
                 return acc + (durationHours * slot.bookings.length);
            }
            return acc;
        }, 0);


        const { totalSimpleAvailable, totalDoubleAvailable } = futureSlots.reduce(
            (acc, slot) => {
                const { simpleAvailable, doubleAvailable } = getAvailableCount(slot);
                acc.totalSimpleAvailable += simpleAvailable;
                acc.totalDoubleAvailable += doubleAvailable;
                return acc;
            },
            { totalSimpleAvailable: 0, totalDoubleAvailable: 0 }
        );

        // NOUVELLES STATISTIQUES PERTINENTES
        const totalCharsBooked = totalSimpleBooked + totalDoubleBooked;
        const totalCapacity = futureSlots.reduce((acc, slot) => {
            return acc + slot.capacitySimple + slot.capacityDouble;
        }, 0);
        const occupancyRate = totalCapacity > 0 ? Math.round((totalCharsBooked / totalCapacity) * 100) : 0;

        return {
            totalBookings,
            totalCharsBooked,
            totalSimpleBooked,
            totalDoubleBooked,
            estimatedRevenue: estimatedRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
            totalHours: Math.round(totalHoursBooked),
            uniqueUsers: uniqueUserEmails.size,
            totalSimpleAvailable,
            totalDoubleAvailable,
            totalCapacity,
            occupancyRate,
        }
    }, [slots]);

    const chartData = useMemo(() => {
        const today = new Date();
        return Array.from({ length: 7 }).map((_, i) => {
            const date = addDays(today, i);
            const dayName = format(date, 'eee', { locale: fr });
            // MODIFICATION : Montrer les chars réservés au lieu des réservations
            const charsBookedOnDay = slots.reduce((acc, s) => {
                 if (format(s.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) {
                     const bookedCount = getBookedCount(s);
                     return acc + bookedCount.simpleBooked + bookedCount.doubleBooked;
                 }
                 return acc;
            }, 0);
            return { name: dayName, chars: charsBookedOnDay };
        });
    }, [slots]);

    const chartConfig = {
      chars: {
        label: "Chars réservés",
        color: "hsl(var(--primary))",
      },
    };

    // Créneaux disponibles pour nouvelle réservation
    const availableSlots = slots.filter(s => {
        const slotDateTime = new Date(`${format(s.date, 'yyyy-MM-dd')}T${String(Math.floor(s.end / 60)).padStart(2, '0')}:${String(s.end % 60).padStart(2, '0')}`);
        if (isBefore(slotDateTime, new Date()) && !isSameDay(slotDateTime, new Date())) return false;

        const { simpleAvailable, doubleAvailable } = getAvailableCount(s);
        return simpleAvailable > 0 || doubleAvailable > 0;
    });

    // Gestionnaire pour nouvelle réservation
    const handleNewBooking = async (values: z.infer<typeof newBookingSchema>) => {
      const bookingData = {
        userName: values.userName,
        email: values.email,
        phone: values.phone,
        simpleChars: values.simpleChars,
        doubleChars: values.doubleChars,
      };

      const result = await addBooking(values.slotId, bookingData);

      if (result.success) {
        toast({
          title: "Réservation créée !",
          description: `Nouvelle réservation pour ${values.userName} (${values.simpleChars} simples + ${values.doubleChars} doubles)`
        });
        newBookingForm.reset();
        setIsNewBookingOpen(false);
        // Actualiser les données
        window.location.reload();
      } else {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: result.error
        });
      }
    };

    // Surveillance des valeurs du formulaire
    const selectedSlotId = newBookingForm.watch('slotId');
    const selectedSlot = availableSlots.find(s => s.id === selectedSlotId);

    return (
    <div className="space-y-6">
      {/* Bouton Nouvelle Réservation */}
      <div className="flex justify-end">
        <Dialog open={isNewBookingOpen} onOpenChange={setIsNewBookingOpen}>
          <DialogTrigger asChild>
            <Button>
              <Phone className="mr-2 h-4 w-4" />
              Nouvelle Réservation
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Nouvelle Réservation</DialogTitle>
            </DialogHeader>
            <Form {...newBookingForm}>
              <form onSubmit={newBookingForm.handleSubmit(handleNewBooking)} className="space-y-4">
                <FormField
                  control={newBookingForm.control}
                  name="userName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom du client</FormLabel>
                      <FormControl>
                        <Input placeholder="Jean Dupont" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newBookingForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email du client</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="jean@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newBookingForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone du client</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="06 12 34 56 78" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={newBookingForm.control}
                  name="slotId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Créneau disponible</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez un créneau" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSlots.map(slot => (
                            <SelectItem key={slot.id} value={slot.id}>
                              {format(slot.date, 'eee dd/MM', { locale: fr })} - {String(Math.floor(slot.start / 60)).padStart(2, '0')}:{String(slot.start % 60).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {selectedSlot && (
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={newBookingForm.control}
                      name="simpleChars"
                      render={({ field }) => {
                        const { simpleAvailable } = getAvailableCount(selectedSlot);
                        return (
                          <FormItem>
                            <FormLabel>Chars Simples (max: {simpleAvailable})</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max={simpleAvailable}
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                    <FormField
                      control={newBookingForm.control}
                      name="doubleChars"
                      render={({ field }) => {
                        const { doubleAvailable } = getAvailableCount(selectedSlot);
                        return (
                          <FormItem>
                            <FormLabel>Chars Doubles (max: {doubleAvailable})</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                max={doubleAvailable}
                                {...field}
                                onChange={(e) => field.onChange(Number(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        );
                      }}
                    />
                  </div>
                )}
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="ghost">Annuler</Button>
                  </DialogClose>
                  <Button type="submit" disabled={newBookingForm.formState.isSubmitting}>
                    {newBookingForm.formState.isSubmitting ? "Création..." : "Créer la réservation"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        <StatCard
          title="Chars Réservés"
          value={stats.totalCharsBooked}
          icon={Sailboat}
          details={`${stats.totalSimpleBooked} simples + ${stats.totalDoubleBooked} doubles`}
        />
        <StatCard
          title="Taux d'Occupation"
          value={`${stats.occupancyRate}%`}
          icon={CalendarCheck}
          details={`${stats.totalCharsBooked}/${stats.totalCapacity} chars utilisés`}
        />
        <StatCard
          title="Revenus Estimés"
          value={stats.estimatedRevenue}
          icon={Euro}
          details={`${stats.totalSimpleBooked}×35€ + ${stats.totalDoubleBooked}×50€`}
        />
        <StatCard
          title="Réservations"
          value={stats.totalBookings}
          icon={CalendarCheck}
          details="Nombre de réservations actives"
        />
        <StatCard
          title="Heures Totales"
          value={`${stats.totalHours}h`}
          icon={Clock}
          details="Heures de location réservées"
        />
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Places Disponibles</CardTitle>
                <Sailboat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {stats.totalSimpleAvailable + stats.totalDoubleAvailable}
                </div>
                <p className="text-xs text-muted-foreground">
                    {stats.totalSimpleAvailable} simples + {stats.totalDoubleAvailable} doubles
                </p>
            </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Chars réservés des 7 prochains jours</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] md:h-[400px] lg:h-[350px] w-full pl-2">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                  fontSize={12}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                  width={40}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="dot" />}
                />
                <Bar dataKey="chars" fill="var(--color-chars)" radius={4} />
              </BarChart>
            </ChartContainer>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
