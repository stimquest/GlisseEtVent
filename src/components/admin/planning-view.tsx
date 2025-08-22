
"use client";

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, CalendarDays, Trash2, User, Clock } from 'lucide-react';
import { addDays, format, startOfWeek, isSameDay, subDays } from 'date-fns';
import { fr } from 'date-fns/locale';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import type { Slot } from '@/app/admin/types';
import { cn } from '@/lib/utils';
import { useAdminContext } from '@/app/admin/admin-context';

// --- Configuration ---
const START_HOUR = 8;
const END_HOUR = 22;
const HOURS_IN_DAY = END_HOUR - START_HOUR;
const TIME_INCREMENT_MINUTES = 30;

// --- Helper Functions ---
const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};


export function PlanningView() {
  const { slots, setSlots } = useAdminContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const { toast } = useToast();
  const [newSlotPreview, setNewSlotPreview] = useState<Omit<Slot, 'id' | 'status' | 'userName'> | null>(null);
  
  const gridRef = useRef<HTMLDivElement>(null);
  const newSlotPreviewRef = useRef(newSlotPreview);
  const rowsPerHour = 60 / TIME_INCREMENT_MINUTES;
  const totalGridRows = HOURS_IN_DAY * rowsPerHour;

  useEffect(() => {
    newSlotPreviewRef.current = newSlotPreview;
  }, [newSlotPreview]);

  const firstDayOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });
  const days = useMemo(() => Array.from({ length: 7 }).map((_, i) => addDays(firstDayOfWeek, i)), [firstDayOfWeek]);

  const goToPreviousWeek = () => setCurrentDate(prev => subDays(prev, 7));
  const goToNextWeek = () => setCurrentDate(prev => addDays(prev, 7));

  const handleDeleteSlot = (slotId: string) => {
    setSlots(slots.filter(s => s.id !== slotId));
    toast({ variant: "destructive", title: "Créneau supprimé" });
  };
  
    const yToMinutes = (y: number, containerTop: number) => {
        if (!gridRef.current) return 0;
        const gridHeight = gridRef.current.clientHeight;
        const relativeY = y - containerTop;
        const totalMinutes = HOURS_IN_DAY * 60;
        const minutes = (relativeY / gridHeight) * totalMinutes;
        const snappedMinutes = Math.round(minutes / TIME_INCREMENT_MINUTES) * TIME_INCREMENT_MINUTES;
        return snappedMinutes + START_HOUR * 60;
    };


  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    const colIndexAttr = target.getAttribute('data-col-index');
    if (!colIndexAttr || !gridRef.current) return;

    const day = days[parseInt(colIndexAttr, 10)];
    const rect = gridRef.current.getBoundingClientRect();
    const startMinutes = yToMinutes(e.clientY, rect.top);

    const preview: Omit<Slot, 'id' | 'status' | 'userName'> = {
        date: day,
        start: startMinutes,
        end: startMinutes + TIME_INCREMENT_MINUTES,
    };
    setNewSlotPreview(preview);

    const handleMouseMove = (moveEvent: MouseEvent) => {
        const newEndMinutes = yToMinutes(moveEvent.clientY, rect.top);
        setNewSlotPreview(prev => prev ? { ...prev, end: Math.max(newEndMinutes, prev.start + TIME_INCREMENT_MINUTES) } : null);
    };

    const handleMouseUp = () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        
        const finalPreview = newSlotPreviewRef.current;
        setNewSlotPreview(null);
        
        if (finalPreview && finalPreview.end > finalPreview.start) {
            const newSlot: Slot = {
                id: Date.now().toString(),
                date: finalPreview.date,
                start: finalPreview.start,
                end: finalPreview.end,
                status: 'Disponible',
            };
            setSlots(prev => [...prev, newSlot].sort((a,b) => a.date.getTime() - b.date.getTime() || a.start - b.start));
            toast({ title: "Créneau ajouté !", description: `Nouveau créneau créé le ${format(newSlot.date, 'dd/MM')} de ${formatTime(newSlot.start)} à ${formatTime(newSlot.end)}.` });
        }
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };
  
    const minutesToPosition = (minutes: number) => {
        const relativeMinutes = minutes - START_HOUR * 60;
        const startRow = (relativeMinutes / TIME_INCREMENT_MINUTES) + 1;
        return startRow;
    };

  return (
    <Card className="h-[85vh] flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between flex-shrink-0">
        <CardTitle className="flex items-center gap-2">
            <CalendarDays className="w-6 h-6 text-accent" />
            <span>Planning des créneaux</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold text-center w-48">
            {format(firstDayOfWeek, 'dd MMM', { locale: fr })} - {format(addDays(firstDayOfWeek, 6), 'dd MMM yyyy', { locale: fr })}
          </span>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-grow overflow-auto">
        <div className="grid grid-cols-[auto_1fr] h-full">
            {/* Time Gutter */}
            <div className="pr-4 text-sm text-right text-muted-foreground relative">
                 {Array.from({ length: HOURS_IN_DAY }).map((_, i) => (
                    <div key={i} className="relative h-24 flex justify-end items-start" style={{ gridRow: i + 1 }}>
                        <span className="-translate-y-1/2">{START_HOUR + i}:00</span>
                    </div>
                ))}
            </div>
            {/* Grid */}
            <div className="relative grid grid-cols-7"
                 style={{ gridTemplateRows: `repeat(${totalGridRows}, 1fr)`}}
                 ref={gridRef}
            >
                {/* Background Lines & Columns */}
                {Array.from({ length: HOURS_IN_DAY }).map((_, i) => (
                    <div key={`hline-${i}`} className="col-span-7 border-t border-dashed" style={{ gridRow: (i * rowsPerHour) + 1 }} />
                ))}
                {days.map((day, dayIndex) => (
                    <div key={day.toString()} 
                         onMouseDown={handleMouseDown}
                         data-col-index={dayIndex}
                         className={cn(
                           "border-l",
                           "relative col-start-",
                           dayIndex + 1
                         )}
                         style={{gridRow: `1 / ${totalGridRows + 1}`}}
                    />
                ))}

                 {/* Day Headers */}
                <div className="sticky top-0 z-10 grid grid-cols-7 col-span-full col-start-1 row-start-1 bg-background/95 pointer-events-none">
                   {days.map((day) => (
                        <div key={`header-${day}`} className={cn("text-center py-2 border-b border-l", isSameDay(day, new Date()) && 'text-accent')}>
                            <p className="font-semibold capitalize">{format(day, 'eee', { locale: fr })}</p>
                            <p className="text-2xl">{format(day, 'd')}</p>
                        </div>
                    ))}
                </div>


                {/* Slots */}
                 {slots.map(slot => {
                    const dayIndex = days.findIndex(d => isSameDay(d, slot.date));
                    if(dayIndex === -1) return null;

                    const startRow = minutesToPosition(slot.start);
                    const endRow = minutesToPosition(slot.end);

                    return (
                         <AnimatePresence key={slot.id}>
                          <motion.div
                            layout
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                            className="relative m-1 p-2 rounded-lg text-xs flex flex-col justify-between cursor-pointer shadow-md z-20"
                            style={{
                                gridColumnStart: dayIndex + 1,
                                gridRowStart: startRow,
                                gridRowEnd: endRow
                            }}
                             className={cn(`relative m-1 p-2 rounded-lg text-xs flex flex-col justify-between cursor-pointer shadow-md z-20`,
                              slot.status === 'Confirmé'
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-green-500 text-white'
                            )}
                          >
                            <div>
                                <p className="font-bold flex items-center gap-1">
                                    <Clock className="w-3 h-3"/>
                                    {formatTime(slot.start)} - {formatTime(slot.end)}
                                </p>
                                {slot.status === 'Confirmé' && slot.userName && 
                                    <p className="flex items-center gap-1 mt-1"><User className="w-3 h-3"/>{slot.userName}</p>
                                }
                            </div>
                            <div className="self-end flex gap-1">
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button size="icon" variant="destructive" className="h-5 w-5" onClick={(e) => e.stopPropagation()}>
                                            <Trash2 className="w-3 h-3"/>
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                        <AlertDialogTitle>Supprimer ce créneau ?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Cette action est irréversible et supprimera ce créneau {slot.status === 'Disponible' ? 'disponible' : `de ${slot.userName}`}.
                                        </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                        <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Annuler</AlertDialogCancel>
                                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={(e) => {e.stopPropagation(); handleDeleteSlot(slot.id);}}>Confirmer</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                          </motion.div>
                         </AnimatePresence>
                    )
                 })}
                 
                  {/* Slot Preview */}
                {newSlotPreview && (
                    <div
                        className="absolute left-1 right-1 p-2 rounded-lg text-xs flex flex-col justify-between bg-green-500/50 border-2 border-dashed border-green-700 text-white pointer-events-none z-30"
                        style={{
                            gridColumnStart: days.findIndex(d => isSameDay(d, newSlotPreview.date)) + 1,
                            gridRowStart: minutesToPosition(newSlotPreview.start),
                            gridRowEnd: minutesToPosition(newSlotPreview.end)
                        }}
                    >
                        <p className="font-bold">{formatTime(newSlotPreview.start)} - {formatTime(newSlotPreview.end)}</p>
                    </div>
                )}


            </div>
        </div>
      </CardContent>
    </Card>
  );
}

    
