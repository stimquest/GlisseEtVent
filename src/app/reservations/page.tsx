
"use client";

import { useState, useEffect } from 'react';
import { Header } from "@/components/header";
import { useAdminContext } from '../admin/admin-context';
import { add, format, startOfWeek, addDays, isSameDay, isBefore, startOfDay, sub, setHours, setMinutes } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Sailboat } from 'lucide-react';
import type { Slot } from '../admin/types';
import { ReservationCard } from '@/components/reservation-card';
import { getPublicSlotStatus } from '@/lib/slots';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';


const formatTimeFromSlot = (date: Date, minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const targetDate = setMinutes(setHours(date, hours), mins);
    return format(targetDate, 'HH:mm');
}

export default function ReservationPage() {
    const { slots, setSlots, isLoading } = useAdminContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null);

    const firstDayOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
    const today = startOfDay(new Date());

    const goToPreviousWeek = () => setCurrentDate(sub(currentDate, { weeks: 1 }));
    const goToNextWeek = () => setCurrentDate(add(currentDate, { weeks: 1 }));

    const handleSelectSlot = (slot: Slot) => {
        setSelectedSlot(slot);
    };

    const handleBackToCalendar = () => {
        setSelectedSlot(null);
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

    // Filter out past and full slots
    const availableSlots = slots.filter(slot => {
        const slotDateTime = new Date(slot.date);
        slotDateTime.setHours(Math.floor(slot.start / 60), slot.start % 60);
        if (isBefore(slotDateTime, new Date())) return false; // Past slot

        const { totalAvailable } = getPublicSlotStatus(slot);
        if (totalAvailable <= 0) return false;
        
        return true;
    });

    const days = Array.from({ length: 7 }).map((_, i) => {
        const date = addDays(firstDayOfWeek, i);
        const daySlots = availableSlots
            .filter(slot => isSameDay(slot.date, date))
            .sort((a,b) => a.start - b.start);
        return { date, slots: daySlots, isPast: isBefore(date, today) };
    });

    return (
        <div className="flex flex-col min-h-screen bg-background text-foreground">
            <Header />
            <main className="flex-grow p-4 sm:p-6 md:p-8">
                {selectedSlot ? (
                    <ReservationCard slot={selectedSlot} onBack={handleBackToCalendar} setSlots={setSlots} />
                ) : (
                    <div>
                        <div className="text-center mb-8">
                            <h1 className="text-5xl md:text-6xl">Réservez votre Créneau</h1>
                            <p className="text-2xl text-muted-foreground mt-2">Sélectionnez une date et une heure pour votre aventure.</p>
                        </div>

                         <div className="flex items-center justify-center gap-4 mb-8">
                            <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <span className="text-2xl font-semibold text-center w-64">
                                {format(firstDayOfWeek, 'dd MMM', { locale: fr })} - {format(addDays(firstDayOfWeek, 6), 'dd MMM yyyy', { locale: fr })}
                            </span>
                            <Button variant="outline" size="icon" onClick={goToNextWeek}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7 gap-4">
                            {days.map(({ date, slots, isPast }) => (
                                <div key={date.toString()} className={`p-4 rounded-lg border ${isPast ? 'bg-muted/50 text-muted-foreground' : 'bg-card'}`}>
                                    <h3 className={`font-bold text-xl text-center mb-4 capitalize ${isSameDay(date, today) ? 'text-accent' : ''}`}>
                                        {format(date, 'eee d', { locale: fr })}
                                    </h3>
                                    <div className="space-y-3">
                                        {isPast ? (
                                            <p className="text-center h-full flex items-center justify-center">Passé</p>
                                        ) : slots.length > 0 ? (
                                            slots.map(slot => {
                                                const { status, percentageUsed, totalAvailable } = getPublicSlotStatus(slot);
                                                const isAlmostFull = status === 'Presque complet';
                                                
                                                return (
                                                    <Button 
                                                        key={slot.id} 
                                                        className="w-full h-auto py-3 px-3 flex flex-col text-left" 
                                                        variant="outline"
                                                        onClick={() => handleSelectSlot(slot)}
                                                    >
                                                        <span className="font-semibold text-lg w-full">{formatTimeFromSlot(slot.date, slot.start)} - {formatTimeFromSlot(slot.date, slot.end)}</span>
                                                         <div className="w-full mt-2">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className={cn("text-sm font-semibold", isAlmostFull ? "text-orange-500" : "text-green-600")}>
                                                                    {totalAvailable} place{totalAvailable > 1 ? 's' : ''} disponible{totalAvailable > 1 ? 's' : ''}
                                                                </span>
                                                            </div>
                                                            <Progress 
                                                                value={percentageUsed} 
                                                                className="h-2 bg-green-200" 
                                                                indicatorClassName={cn(isAlmostFull ? "bg-orange-500" : "bg-green-600")}
                                                             />
                                                        </div>
                                                        <span className="mt-2 text-sm font-semibold text-primary self-center">
                                                            Choisir ce créneau
                                                        </span>
                                                    </Button>
                                                )
                                            })
                                        ) : (
                                            <p className="text-center text-muted-foreground h-full flex items-center justify-center">Aucun créneau</p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
