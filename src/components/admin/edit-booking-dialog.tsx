
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, isBefore, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { updateBooking, cancelBooking } from '@/app/actions';
import type { Booking, Slot } from '@/app/admin/types';
import { getAvailableCount } from '@/lib/slots';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';


interface EditBookingDialogProps {
    booking: Booking;
    currentSlot: Slot;
    allSlots: Slot[];
    onSuccess: () => Promise<void>;
    children: React.ReactNode;
}

const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export function EditBookingDialog({ booking, currentSlot, allSlots, onSuccess, children }: EditBookingDialogProps) {
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    // The validation schema is created inside the component to have access to its props.
    const formSchema = z.object({
        slot_id: z.string(),
        simpleChars: z.coerce.number().min(0),
        doubleChars: z.coerce.number().min(0),
    }).refine((data) => data.simpleChars > 0 || data.doubleChars > 0, {
        message: "La réservation doit contenir au moins un char.",
        path: ["simpleChars"],
    });
    
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (isOpen) {
            form.reset({
                slot_id: currentSlot.id,
                simpleChars: booking.simpleChars,
                doubleChars: booking.doubleChars,
            });
        }
    }, [isOpen, form, currentSlot, booking]);

    const selectedSlotId = form.watch('slot_id');
    const simpleCharsValue = form.watch('simpleChars');
    const doubleCharsValue = form.watch('doubleChars');

    const selectedSlot = allSlots.find(s => s.id === selectedSlotId) || currentSlot;
    
    const isSameSlot = selectedSlot.id === currentSlot.id;
    const currentSimpleInBooking = isSameSlot ? booking.simpleChars : 0;
    const currentDoubleInBooking = isSameSlot ? booking.doubleChars : 0;
    
    const { simpleAvailable, doubleAvailable } = getAvailableCount(selectedSlot);
    const maxSimple = simpleAvailable + currentSimpleInBooking;
    const maxDouble = doubleAvailable + currentDoubleInBooking;

    useEffect(() => {
        if (simpleCharsValue > maxSimple) {
            form.setError("simpleChars", { type: "manual", message: `Il ne reste que ${maxSimple} places.` });
        } else {
            form.clearErrors("simpleChars");
        }
        if (doubleCharsValue > maxDouble) {
            form.setError("doubleChars", { type: "manual", message: `Il ne reste que ${maxDouble} places.` });
        } else {
            form.clearErrors("doubleChars");
        }
    }, [simpleCharsValue, doubleCharsValue, maxSimple, maxDouble, form]);


    async function onSubmit(values: z.infer<typeof formSchema>) {
         if (values.simpleChars > maxSimple || values.doubleChars > maxDouble) {
            toast({ variant: "destructive", title: "Erreur de validation", description: "Veuillez corriger les erreurs avant de soumettre." });
            return;
        }

        const result = await updateBooking(booking.id, values);
        if (result.success) {
            await onSuccess();
            toast({ title: "Réservation mise à jour !", description: `La réservation de ${booking.userName} a été modifiée.` });
            setIsOpen(false);
        } else {
            toast({ variant: "destructive", title: "Erreur", description: result.error });
        }
    }
    
    const handleCancelBooking = async () => {
        const result = await cancelBooking(booking.id);
        if (result.success) {
            await onSuccess();
            toast({ title: "Réservation annulée", description: `La réservation de ${booking.userName} a été supprimée.`});
            setIsOpen(false);
        } else {
             toast({ variant: "destructive", title: "Erreur", description: result.error });
        }
    };
    
    const availableSlots = allSlots.filter(s => {
        const slotDateTime = new Date(`${format(s.date, 'yyyy-MM-dd')}T${formatTime(s.end)}`);
        if (isBefore(slotDateTime, new Date()) && !isSameDay(slotDateTime, new Date())) return false;
        
        const { simpleAvailable, doubleAvailable } = getAvailableCount(s);
        return s.id === currentSlot.id || simpleAvailable > 0 || doubleAvailable > 0;
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-md md:max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Modifier la réservation de {booking.userName}</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="slot_id"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Créneau</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sélectionnez un créneau" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {availableSlots.map(s => (
                                                <SelectItem key={s.id} value={s.id}>
                                                    {format(new Date(s.date), 'eee dd/MM', { locale: fr })} - {formatTime(s.start)}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                             <FormField
                                control={form.control}
                                name="simpleChars"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chars Simples</FormLabel>
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
                                            <FormControl>
                                              <SelectTrigger className="w-[70%]">
                                                <SelectValue />
                                              </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {Array.from({ length: maxSimple + 1 }, (_, i) => i).map(num => (
                                                    <SelectItem key={`simple-${num}`} value={String(num)}>{num}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                           <FormField
                                control={form.control}
                                name="doubleChars"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Chars Doubles</FormLabel>
                                        <Select onValueChange={(val) => field.onChange(Number(val))} value={String(field.value)}>
                                             <FormControl>
                                               <SelectTrigger className="w-[70%]">
                                                <SelectValue />
                                               </SelectTrigger>
                                             </FormControl>
                                             <SelectContent>
                                                {Array.from({ length: maxDouble + 1 }, (_, i) => i).map(num => (
                                                    <SelectItem key={`double-${num}`} value={String(num)}>{num}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <DialogFooter className="sm:justify-between pt-4">
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button type="button" variant="destructive">Annuler la réservation</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Confirmer l'annulation ?</AlertDialogTitle>
                                        <AlertDialogDescription>La réservation de {booking.userName} sera définitivement supprimée. Cette action est irréversible.</AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Fermer</AlertDialogCancel>
                                        <AlertDialogAction className="bg-destructive hover:bg-destructive/90" onClick={handleCancelBooking}>Oui, annuler</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            <div className="flex gap-2">
                                <DialogClose asChild><Button type="button" variant="ghost">Fermer</Button></DialogClose>
                                <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isValid}>
                                    {form.formState.isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
                                </Button>
                            </div>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
