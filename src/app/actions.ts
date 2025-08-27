
"use server";

import { z } from "zod";
import { createClient } from '@supabase/supabase-js';

// Client côté serveur avec variables d'environnement sécurisées
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

// Variables d'environnement nécessaires (côté serveur uniquement)
// SUPABASE_URL - URL de votre projet Supabase
// SUPABASE_ANON_KEY - Clé anonyme Supabase
import type { Slot, Booking } from "./admin/types";
import { revalidatePath } from "next/cache";
import nodemailer from "nodemailer";
import { env } from "@/env";

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

  try {
    // Vérifier que les variables d'environnement SMTP sont configurées
    if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_USER || !env.SMTP_PASS || !env.CONTACT_EMAIL) {
      console.error("SMTP configuration missing. Please configure SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, and CONTACT_EMAIL in your .env file.");
      console.log("Contact form submission (email not sent):", validatedFields.data);
      
      return {
        success: true,
        message: "Thank you for your message! We will get back to you soon.",
      };
    }

    const { name, email, message } = validatedFields.data;

    // Configurer le transporteur SMTP pour Gmail
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: parseInt(env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      },
    });

    // Envoyer l'email à l'administrateur
    await transporter.sendMail({
      from: env.SMTP_USER,
      to: env.CONTACT_EMAIL,
      subject: `Nouveau message de contact de ${name}`,
      html: `
        <h2>Nouveau message de contact</h2>
        <p><strong>Nom:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Message envoyé depuis le formulaire de contact du site</em></p>
      `,
    });

    // Envoyer un email de confirmation à l'utilisateur
    await transporter.sendMail({
      from: env.SMTP_USER,
      to: email,
      subject: 'Confirmation de réception de votre message',
      html: `
        <h2>Merci pour votre message !</h2>
        <p>Bonjour ${name},</p>
        <p>Nous avons bien reçu votre message et nous vous recontacterons très prochainement.</p>
        <p><strong>Votre message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>Cet email est envoyé automatiquement, merci de ne pas y répondre.</em></p>
      `,
    });

    return {
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    };
  } catch (error) {
    console.error("Error sending email:", error);
    // En cas d'erreur d'envoi d'email, on logge quand même le message
    console.log("Contact form submission (email failed):", validatedFields.data);
    
    return {
      success: true,
      message: "Thank you for your message! We will get back to you soon.",
    };
  }
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

    // SOLUTION ULTRA SIMPLE : Utiliser toLocaleDateString avec format invariant
    const dateString = date.toLocaleDateString('en-CA'); // Format YYYY-MM-DD invariant

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
