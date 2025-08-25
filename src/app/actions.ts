
"use server";

import { z } from "zod";
import { supabase } from "@/lib/supabase";
import type { Slot, Booking } from "./admin/types";
import { revalidatePath } from "next/cache";

// --- Formulaire de Contact ---
const contactSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
});

export async function submitContactForm(values: z.infer<typeof contactSchema>) {
  const validatedFields = contactSchema.safeParse(values);

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Invalid form data.",
    };
  }
  console.log("New contact form submission:", validatedFields.data);
  return {
    success: true,
    message: "Thank you for your message! We will get back to you soon.",
  };
}

// --- Gestion des données (Slots) avec Supabase ---

export async function getSlots(): Promise<Slot[]> {
    const { data: slots, error } = await supabase
      .from('slots')
      .select(`
        *,
        bookings (*)
      `)
      .order('date', { ascending: true })
      .order('start', { ascending: true });

    if (error) {
        console.error("Supabase error fetching slots:", error.message);
        return [];
    }
    
    // Correctly handle timezone by adding 'Z' to make it UTC and avoid off-by-one day errors.
    return slots.map(slot => ({
        ...slot,
        date: new Date(slot.date + 'T00:00:00Z'),
    })) as Slot[];
}

export async function addBooking(slotId: string, bookingData: Omit<Booking, 'id'>) {
    const { data, error } = await supabase
        .from('bookings')
        .insert([{ ...bookingData, slot_id: slotId }])
        .select()
        .single();
    
    if (error) {
        console.error("Supabase error adding booking:", error.message);
        return { success: false, error: error.message };
    }
    
    revalidatePath('/reservations');
    revalidatePath('/admin');

    return { success: true, data };
}

export async function addSlot(slotData: Omit<Slot, 'id' | 'bookings'>) {
    const { date, ...rest } = slotData;

    // Fix for timezone issue: create a timezone-offset-aware string in YYYY-MM-DD format.
    // This prevents the date from shifting by one day due to UTC conversion.
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    const { data, error } = await supabase
        .from('slots')
        .insert([{ ...rest, date: dateString }])
        .select()
        .single();

    if (error) {
        console.error("Supabase error adding slot:", error.message);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/planning');
    return { success: true, data };
}

export async function deleteSlot(slotId: string) {
    // Supabase will cascade delete bookings
    const { error } = await supabase
        .from('slots')
        .delete()
        .eq('id', slotId);

    if (error) {
        console.error("Supabase error deleting slot:", error.message);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/planning');
    return { success: true };
}

export async function cancelBooking(bookingId: string) {
    const { error } = await supabase
        .from('bookings')
        .delete()
        .eq('id', bookingId);
    
    if (error) {
        console.error("Supabase error canceling booking:", error.message);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/planning');
    return { success: true };
}

export async function updateBooking(bookingId: string, values: { slot_id: string; simpleChars: number; doubleChars: number; }) {
    const { error } = await supabase
        .from('bookings')
        .update({ 
            slot_id: values.slot_id,
            simpleChars: values.simpleChars,
            doubleChars: values.doubleChars,
        })
        .eq('id', bookingId);
    
    if (error) {
        console.error("Supabase error updating booking:", error.message);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin/planning');
    return { success: true };
}
