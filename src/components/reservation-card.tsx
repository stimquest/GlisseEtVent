
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { ArrowLeft, Send, AlertTriangle } from "lucide-react";
import type { Slot, Booking } from "@/app/admin/types";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { getAvailableCount } from "@/lib/slots";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";


const formSchema = z.object({
  userName: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
  email: z.string().email({ message: "Veuillez saisir une adresse e-mail valide." }),
  phone: z.string().min(10, { message: "Veuillez saisir un numéro de téléphone valide." }),
  simpleChars: z.coerce.number().min(0),
  doubleChars: z.coerce.number().min(0),
}).refine(data => data.simpleChars > 0 || data.doubleChars > 0, {
    message: "Vous devez réserver au moins un char.",
    path: ["simpleChars"],
});

interface ReservationCardProps {
    slot: Slot;
    onBack: () => void;
    setSlots: (newSlots: Slot[] | ((prevSlots: Slot[]) => Slot[])) => Promise<void>;
}

const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
};

export function ReservationCard({ slot, onBack, setSlots }: ReservationCardProps) {
  const { toast } = useToast();

  // Defensive check to prevent rendering with incomplete data that could cause NaN
  if (!slot || typeof slot.capacitySimple === 'undefined' || typeof slot.capacityDouble === 'undefined') {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Chargement...</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Chargement des détails du créneau...</p>
            </CardContent>
        </Card>
    );
  }

  const { simpleAvailable, doubleAvailable } = getAvailableCount(slot);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema.refine(data => data.simpleChars <= simpleAvailable, {
        message: `Il ne reste que ${simpleAvailable} char(s) simple(s) disponible(s).`,
        path: ["simpleChars"],
    }).refine(data => data.doubleChars <= doubleAvailable, {
        message: `Il ne reste que ${doubleAvailable} char(s) double(s) disponible(s).`,
        path: ["doubleChars"],
    })),
    defaultValues: {
      userName: "",
      email: "",
      phone: "",
      simpleChars: 0,
      doubleChars: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newBooking: Booking = {
        id: Date.now().toString(),
        ...values,
    };

    await setSlots(prevSlots => {
        return prevSlots.map(s => {
            if (s.id === slot.id) {
                return { ...s, bookings: [...s.bookings, newBooking] };
            }
            return s;
        });
    });

    toast({
        title: "Réservation confirmée !",
        description: `Votre séance est réservée pour le ${format(slot.date, "eeee dd MMMM", { locale: fr })}. Un email de confirmation a été envoyé.`,
    });
    onBack();
  }

  const SelectInput = ({ name, label, max }: { name: "simpleChars" | "doubleChars", label: string, max: number }) => (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
            <Select 
                onValueChange={(value) => field.onChange(parseInt(value))} 
                defaultValue={String(field.value)}
                disabled={max === 0}
            >
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="0" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {Array.from({ length: max + 1 }, (_, i) => i).map(num => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );


  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <Button variant="ghost" onClick={onBack} className="justify-start p-0 h-auto mb-4">
            <ArrowLeft className="mr-2"/>
            Retour au calendrier
        </Button>
        <CardTitle className="text-3xl">
          Confirmez votre réservation
        </CardTitle>
        <CardDescription className="text-xl">
          Pour le créneau du{' '}
          <span className="font-semibold text-primary">
            {format(slot.date, "eeee dd MMMM", { locale: fr })} de {formatTime(slot.start)} à {formatTime(slot.end)}
          </span>.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
                <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Nom complet</FormLabel>
                        <FormControl>
                            <Input placeholder="Votre nom" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input placeholder="votre.email@exemple.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>

            <div>
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Téléphone</FormLabel>
                        <FormControl>
                            <Input placeholder="06 12 34 56 78" {...field} />
                        </FormControl>
                         <FormMessage />
                        </FormItem>
                    )}
                />
                <p className="text-xs text-muted-foreground mt-2 p-2 bg-secondary/50 rounded-md flex items-center gap-2">
                    <AlertTriangle className="w-8 h-8 text-accent shrink-0"/>
                    <span>Cette information est essentielle pour vous contacter en cas d'annulation ou de report dû aux conditions météorologiques (vent trop fort ou trop faible).</span>
                </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium mb-4">Choisissez vos chars</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 border rounded-lg">
                      <SelectInput name="simpleChars" label={`Char Simple (max: ${simpleAvailable} disponible(s))`} max={simpleAvailable} />
                      <p className="text-sm text-muted-foreground mt-2">Idéal pour 1 personne (dès 8 ans).</p>
                  </div>
                  <div className="p-4 border rounded-lg">
                      <SelectInput name="doubleChars" label={`Char Double (max: ${doubleAvailable} disponible(s))`} max={doubleAvailable} />
                      <p className="text-sm text-muted-foreground mt-2">Pour 2 personnes (ex: 1 adulte + 1 enfant).</p>
                  </div>
              </div>
               {form.formState.errors.simpleChars && !form.getFieldState('simpleChars').isDirty && (
                <p className="text-sm font-medium text-destructive mt-2">{form.formState.errors.simpleChars.message}</p>
              )}
            </div>

            <CardFooter className="p-0 pt-6">
                <Button type="submit" size="lg" className="w-full bg-primary hover:bg-accent hover:text-accent-foreground" disabled={form.formState.isSubmitting}>
                    {form.formState.isSubmitting ? "Confirmation..." : <><Send className="mr-2 h-5 w-5" /> Je confirme ma réservation</>}
                </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
