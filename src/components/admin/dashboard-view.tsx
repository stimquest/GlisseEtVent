
"use client";

import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CalendarCheck, Euro, Clock, Sailboat } from "lucide-react";
import type { Slot } from "@/app/admin/types";
import { ChartTooltipContent, ChartContainer, ChartTooltip } from "@/components/ui/chart";
import { useMemo } from "react";
import { format, addDays, isAfter, startOfDay, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { getAvailableCount, getBookedCount } from "@/lib/slots";

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

export function DashboardView({ slots = [] }: DashboardViewProps) {
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


        return {
            totalBookings,
            estimatedRevenue: estimatedRevenue.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }),
            totalHours: Math.round(totalHoursBooked),
            uniqueUsers: uniqueUserEmails.size,
            totalSimpleAvailable,
            totalDoubleAvailable,
        }
    }, [slots]);

    const chartData = useMemo(() => {
        const today = new Date();
        return Array.from({ length: 7 }).map((_, i) => {
            const date = addDays(today, i);
            const dayName = format(date, 'eee', { locale: fr });
            const bookingsOnDay = slots.reduce((acc, s) => {
                 if (format(s.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')) {
                     return acc + s.bookings.length;
                 }
                 return acc;
            },0);
            return { name: dayName, réservations: bookingsOnDay };
        });
    }, [slots]);

    const chartConfig = {
      réservations: {
        label: "Réservations",
        color: "hsl(var(--primary))",
      },
    };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard title="Prochaines Réservations" value={stats.totalBookings} icon={CalendarCheck} details="Nombre total de réservations à venir" />
        <StatCard title="Revenu Estimé (à venir)" value={stats.estimatedRevenue} icon={Euro} details="Basé sur les réservations futures" />
        <StatCard title="Heures Réservées (à venir)" value={`${stats.totalHours}h`} icon={Clock} details="Total des heures de location" />
        <StatCard title="Clients Uniques (à venir)" value={stats.uniqueUsers} icon={Users} details="Nombre de clients distincts" />
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Places Disponibles</CardTitle>
                <Sailboat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">
                    {stats.totalSimpleAvailable} Simples
                </div>
                <p className="text-xs text-muted-foreground">
                    + {stats.totalDoubleAvailable} Double(s)
                </p>
            </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Réservations des 7 prochains jours</CardTitle>
        </CardHeader>
        <CardContent className="h-[350px] w-full pl-2">
           <ChartContainer config={chartConfig}>
            <BarChart accessibilityLayer data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 3)}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                allowDecimals={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="réservations" fill="var(--color-réservations)" radius={4} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
