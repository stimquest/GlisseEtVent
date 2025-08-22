
"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, User, Clock, PlusCircle, Trash2, Users, Sailboat } from 'lucide-react';
import { add, format, startOfWeek, addDays as dateFnsAddDays, isSameDay, isBefore, startOfDay, sub } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import type { Slot } from '@/app/admin/types';
import { useAdminContext } from '../admin-context';
import { getSlotStatus, getBookedCount } from '@/lib/slots';

// --- Helper Functions ---
const formatTime = (minutes: number) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

// --- Form Schema ---
const timeRegex = /^(?:[01]\d|2[0-3]):[0-5]\d$/; // HH:MM format

const slotSchema = z.object({
  date: z.date({ required_error: "La date est requise." }),
  startTime: z.string().regex(timeRegex, { message: "Format HH:MM invalide." }),
  endTime: z.string().regex(timeRegex, { message: "Format HH:MM invalide." }),
}).refine(data => {
    if (!data.startTime || !data.endTime) return true;
    const [startH, startM] = data.startTime.split(':').map(Number);
    const [endH, endM] = data.endTime.split(':').map(Number);
    return (endH * 60 + endM) > (startH * 60 + startM);
}, {
    message: "L'heure de fin doit être après l'heure de début.",
    path: ["endTime"],
});


export default function AdminPlanningPage() {
  const { slots, setSlots, isLoading } = useAdminContext();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof slotSchema>>({
    resolver: zodResolver(slotSchema),
    defaultValues: {
      date: new Date(),
      startTime: "14:00",
      endTime: "16:00",
    }
  });

  const firstDayOfWeek = startOfWeek(currentDate, { weekStartsOn: 1 });

  const goToPreviousWeek = () => {
    setCurrentDate(sub(currentDate, { weeks: 1 }));
  };

  const goToNextWeek = () => {
    setCurrentDate(add(currentDate, { weeks: 1 }));
  };

  async function onSubmit(data: z.infer<typeof slotSchema>) {
    const [startH, startM] = data.startTime.split(':').map(Number);
    const [endH, endM] = data.endTime.split(':').map(Number);

    const newSlot: Slot = {
      id: Date.now().toString(),
      date: startOfDay(data.date),
      start: startH * 60 + startM,
      end: endH * 60 + endM,
      capacitySimple: 8,
      capacityDouble: 1,
      bookings: [],
    };
    await setSlots(prev => [...prev, newSlot].sort((a,b) => a.date.getTime() - b.date.getTime() || a.start - b.start));
    toast({ title: "Créneau ajouté !", description: `Nouveau créneau disponible le ${format(data.date, 'dd/MM/yyyy')} de ${data.startTime} à ${data.endTime}.` });
    form.reset({ date: data.date, startTime: "14:00", endTime: "16:00"});
    setIsFormOpen(false);
  }
  
  const cancelBooking = async (slotId: string, bookingId: string) => {
    await setSlots(slots.map(s => {
        if (s.id !== slotId) return s;
        return { ...s, bookings: s.bookings.filter(b => b.id !== bookingId) };
    }));
    toast({ title: "Réservation annulée", description: "Le créneau du client a été libéré." });
  };
  
  const deleteSlot = async (slotId: string) => {
    await setSlots(slots.filter(s => s.id !== slotId));
    toast({ variant: "destructive", title: "Créneau supprimé", description: "Le créneau a été retiré de la liste." });
  };
  
  const today = startOfDay(new Date());

  const days = Array.from({ length: 7 }).map((_, i) => {
    const date = dateFnsAddDays(firstDayOfWeek, i);
    const daySlots = slots.filter(slot => isSameDay(slot.date, date)).sort((a,b) => a.start - b.start);
    return { date, slots: daySlots };
  });
  
  if (isLoading) {
      return <div>Chargement du planning...</div>
  }


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
            <CalendarIcon className="w-6 h-6 text-accent" />
            <span>Gestion des Créneaux</span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={goToPreviousWeek}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold text-center w-48">
            {format(firstDayOfWeek, 'dd MMM', { locale: fr })} - {format(dateFnsAddDays(firstDayOfWeek, 6), 'dd MMM yyyy', { locale: fr })}
          </span>
          <Button variant="outline" size="icon" onClick={goToNextWeek}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-right">
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
              <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Ajouter un créneau
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Nouveau créneau disponible</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                     <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                            <FormLabel>Date</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                <FormControl>
                                    <Button
                                    variant={"outline"}
                                    className={cn(
                                        "w-full pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                    )}
                                    >
                                    {field.value ? (
                                        format(field.value, "PPP", { locale: fr })
                                    ) : (
                                        <span>Choisissez une date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                    locale={fr}
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => isBefore(date, today)}
                                    initialFocus
                                />
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                            </FormItem>
                        )}
                        />
                    <div className="grid grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name="startTime"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Heure de début</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="endTime"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Heure de fin</FormLabel>
                                <FormControl>
                                    <Input type="time" {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <DialogFooter>
                      <DialogClose asChild><Button type="button" variant="ghost">Annuler</Button></DialogClose>
                      <Button type="submit">Créer le créneau</Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {days.map(day => (
            <div key={day.date.toString()} className={`p-4 rounded-lg border ${isSameDay(day.date, today) ? 'bg-secondary/20' : ''}`}>
              <h3 className="font-bold text-xl text-center mb-4 capitalize">
                {format(day.date, 'eeee dd MMMM', { locale: fr })}
              </h3>
              <div className="space-y-3">
                {day.slots.length > 0 ? day.slots.map(slot => {
                  const isPast = isBefore(new Date(`${format(slot.date, 'yyyy-MM-dd')}T${formatTime(slot.end)}`), new Date());
                  const status = getSlotStatus(slot);
                  const { simpleBooked, doubleBooked } = getBookedCount(slot);

                  return (
                    <div key={slot.id} className={`p-3 rounded-md transition-colors border-l-4 ${status === 'Complet' ? 'border-destructive bg-destructive/10' : status === 'Confirmé' ? 'border-primary bg-primary/10' : 'border-green-500 bg-muted/50'}`}>
                      <div className="flex items-center justify-between">
                         <div className="font-semibold text-lg flex items-center gap-2">
                            <Clock className="w-4 h-4"/>
                            <span>{formatTime(slot.start)} - {formatTime(slot.end)}</span>
                         </div>
                         <Badge variant={status === 'Complet' ? 'destructive' : status === 'Confirmé' ? 'default' : 'secondary'}>
                            {status}
                         </Badge>
                      </div>
                       <div className="text-sm mt-2 space-y-1 text-muted-foreground">
                            <div className="flex items-center gap-2"><Sailboat className="w-4 h-4 text-primary" /> <span>Simple: {simpleBooked} / {slot.capacitySimple}</span></div>
                            <div className="flex items-center gap-2"><Sailboat className="w-4 h-4 text-primary" /> <span>Double: {doubleBooked} / {slot.capacityDouble}</span></div>
                       </div>
                      <div className="mt-2 space-y-2">
                        {slot.bookings.map(booking => (
                           <div key={booking.id} className="flex items-center justify-between text-sm p-2 bg-background rounded">
                                <div className="flex flex-col">
                                    <span className="font-semibold flex items-center gap-2"><User className="w-4 h-4"/>{booking.userName}</span>
                                    <span className="text-muted-foreground pl-6 text-xs">
                                        {booking.simpleChars > 0 && `${booking.simpleChars} simple(s)`}
                                        {booking.simpleChars > 0 && booking.doubleChars > 0 && ", "}
                                        {booking.doubleChars > 0 && `${booking.doubleChars} double(s)`}
                                    </span>
                                </div>
                                {!isPast && (
                                     <AlertDialog>
                                        <AlertDialogTrigger asChild><Button variant="outline" size="sm" className="h-6 px-2 text-xs">Annuler</Button></AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Annuler la réservation ?</AlertDialogTitle>
                                                <AlertDialogDescription>Le créneau de {booking.userName} sera libéré. Cette action est irréversible.</AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Fermer</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => cancelBooking(slot.id, booking.id)}>Confirmer</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                )}
                           </div>
                        ))}
                      </div>
                       <div className="text-right mt-2">
                            { !isPast && (
                                <AlertDialog>
                                <AlertDialogTrigger asChild><Button variant="destructive" size="icon" className="h-8 w-8"><Trash2 className="w-4 h-4"/></Button></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Supprimer le créneau ?</AlertDialogTitle>
                                        <AlertDialogDescription>Ce créneau et toutes ses réservations seront définitivement supprimés. Cette action est irréversible.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Fermer</AlertDialogCancel>
                                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={() => deleteSlot(slot.id)}>Oui, supprimer</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            )}
                        </div>
                    </div>
                  )
                }) : <p className="text-center text-muted-foreground py-4">Aucun créneau défini.</p>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
