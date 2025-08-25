
"use client";

import { useState } from 'react';
import { Header } from "@/components/header";
import { useAdminContext } from '../admin/admin-context';
import { add, format, startOfWeek, isBefore, startOfDay, setHours, setMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { CalendarOff, ChevronRight } from 'lucide-react';
import type { Slot } from '../admin/types';
import { ReservationCard } from '@/components/reservation-card';
import { getPublicSlotStatus } from '@/lib/slots';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import Link from 'next/link';


const formatTimeFromSlot = (date: Date, minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const targetDate = setMinutes(setHours(date, hours), mins);
    return format(targetDate, 'HH:mm');
}

export default function ReservationPage() {
    const { slots, isLoading, refreshSlots } = useAdminContext();
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);
    
    const today = startOfDay(new Date());

    const handleSelectSlot = (slot: Slot) => {
        setSelectedSlot(slot);
    };

    const handleBackToCalendar = async () => {
        setSelectedSlot(null);
        await refreshSlots(); // Refresh data when going back
    }
    
    if (isLoading) {
        return (
             <div className="flex flex-col min-h-screen bg-background text-foreground">
                <Header />
                <main className="flex-grow p-4 sm:p-6 md:p-8 flex items-center justify-center">
                    <p>Chargement du calendrier...</p>
                </main>
            </div>
        );
    }
    
    // Generate the next 4 weeks
    const weeks = Array.from({ length: 4 }).map((_, i) => {
        const firstDayOfWeek = startOfWeek(add(today, { weeks: i }), { weekStartsOn: 1 });
        const weekSlots = slots
            .filter(slot => {
                const slotDateTime = new Date(slot.date);
                slotDateTime.setHours(Math.floor(slot.start / 60), slot.start % 60);
                if (isBefore(slotDateTime, new Date())) return false;

                const { totalAvailable } = getPublicSlotStatus(slot);
                if (totalAvailable <= 0) return false;

                // Check if the slot is within the current week being processed
                const endOfWeekDate = add(firstDayOfWeek, { days: 6 });
                return !isBefore(slot.date, firstDayOfWeek) && !isBefore(endOfWeekDate, slot.date);
            })
            .sort((a, b) => a.date.getTime() - b.date.getTime() || a.start - b.start);
            
        // Group slots by day
        const slotsByDay = weekSlots.reduce((acc, slot) => {
            const dayKey = format(slot.date, 'yyyy-MM-dd');
            if (!acc[dayKey]) {
                acc[dayKey] = [];
            }
            acc[dayKey].push(slot);
            return acc;
        }, {} as Record<string, Slot[]>);

        return {
            date: firstDayOfWeek,
            slotsByDay: Object.entries(slotsByDay).map(([date, slots]) => ({ date: new Date(date), slots }))
        };
    }).filter(week => week.slotsByDay.length > 0); // Only keep weeks that have slots

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-grow p-4 sm:p-6 md:p-8">
                {selectedSlot ? (
                    <ReservationCard slot={selectedSlot} onBack={handleBackToCalendar} />
                ) : (
                    <div>
                        <div className="text-center mb-8">
                            <h1 className="text-5xl md:text-6xl">Réservez votre Créneau</h1>
                            <p className="text-2xl text-muted-foreground mt-2">Sélectionnez une date et une heure pour votre aventure.</p>
                        </div>
                        
                        {weeks.length > 0 ? (
                           <div className="space-y-12">
                               {weeks.map(week => (
                                   <div key={week.date.toISOString()}>
                                        <h2 className="text-3xl font-bold mb-4 border-b pb-2">
                                           Semaine du {format(week.date, 'dd MMMM', { locale: fr })}
                                        </h2>
                                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                            {week.slotsByDay.map(({ date, slots }) => (
                                                <div key={date.toISOString()} className="p-4 rounded-lg border bg-card">
                                                    <h3 className="font-bold text-xl capitalize mb-3">
                                                        {format(date, 'eeee dd MMMM', { locale: fr })}
                                                    </h3>
                                                    <div className="space-y-2">
                                                        {slots.map(slot => {
                                                             const { percentageUsed, totalAvailable } = getPublicSlotStatus(slot);
                                                             const isAlmostFull = totalAvailable > 0 && totalAvailable <= 2;
                                                            return (
                                                                <Button 
                                                                    key={slot.id} 
                                                                    className="w-full h-auto py-2 px-3 flex flex-col items-start text-left" 
                                                                    variant="outline"
                                                                    onClick={() => handleSelectSlot(slot)}
                                                                >
                                                                    <div className="w-full flex justify-between items-center">
                                                                        <span className="font-semibold text-lg">{formatTimeFromSlot(slot.date, slot.start)} - {formatTimeFromSlot(slot.date, slot.end)}</span>
                                                                        <span className={cn("text-sm font-semibold", isAlmostFull ? "text-orange-500" : "text-green-600")}>
                                                                            {totalAvailable} place{totalAvailable > 1 ? 's' : ''}
                                                                        </span>
                                                                    </div>
                                                                    <div className="w-full mt-1.5">
                                                                        <Progress 
                                                                            value={percentageUsed} 
                                                                            className="h-2" 
                                                                            indicatorClassName={cn(isAlmostFull ? "bg-orange-500" : "bg-green-600")}
                                                                        />
                                                                    </div>
                                                                </Button>
                                                            )
                                                        })}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                   </div>
                               ))}
                           </div>
                        ) : (
                            <div className="text-center py-16 px-4 border-2 border-dashed rounded-lg">
                                <CalendarOff className="mx-auto h-12 w-12 text-muted-foreground" />
                                <h3 className="mt-4 text-2xl font-semibold">Aucun créneau disponible pour le moment</h3>
                                <p className="mt-2 text-xl text-muted-foreground">
                                    Nous ajoutons régulièrement de nouvelles disponibilités. N'hésitez pas à nous contacter directement pour toute demande spécifique.
                                </p>
                                <Button asChild className="mt-6">
                                    <Link href="/contact">
                                        Nous contacter
                                        <ChevronRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        )}
                       
                    </div>
                )}
            </main>
        </div>
    );
}
