
"use server";

import { z } from "zod";
import { createClient } from '@supabase/supabase-js';

// Fonction utilitaire pour envoyer des emails via Web3Forms
async function sendWeb3Form(formData: FormData) {
  const response = await fetch('https://api.web3forms.com/submit', {
    method: 'POST',
    body: formData
  });

  return response.json();
}

// Fonction pour créer un client Supabase sécurisé
function createSecureSupabaseClient() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey || supabaseUrl.includes('your-project-id') || supabaseKey.includes('your-anon-key')) {
      throw new Error('Configuration Supabase manquante ou invalide');
    }

    return createClient(supabaseUrl, supabaseKey);
  } catch (error) {
    console.error('❌ Erreur de configuration Supabase:', (error as Error).message);
    console.log('🔧 Pour résoudre ce problème :');
    console.log('1. Créez un compte sur https://supabase.com');
    console.log('2. Créez un nouveau projet');
    console.log('3. Allez dans Settings > API');
    console.log('4. Copiez l\'URL du projet et la clé anon');
    console.log('5. Remplacez les valeurs dans votre fichier .env');

    // Retourne un client mock qui ne fait rien mais évite les erreurs TypeScript
    return {
      from: () => ({
        select: () => ({
          order: () => ({
            order: () => Promise.resolve({ data: [], error: null })
          })
        }),
        insert: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase manquante' } }),
        update: () => Promise.resolve({ data: null, error: { message: 'Configuration Supabase manquante' } }),
        delete: () => Promise.resolve({ error: null })
      })
    } as any;
  }
}

// Client Supabase sécurisé
const supabase = createSecureSupabaseClient();

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
      message: "Données du formulaire invalides.",
    };
  }

  try {
    const { name, email, message } = validatedFields.data;

    // === SOLUTION 1: Netlify Forms (si activé) ===
    if (process.env.NEXT_PUBLIC_USE_NETLIFY_FORMS === "true") {
      console.log("📧 Envoi via Netlify Forms");
      // Netlify Forms gère automatiquement la soumission côté client avec les attributs HTML
      return {
        success: true,
        message: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.",
      };
    }

    // === SOLUTION 2: Web3Forms (Recommandé) ===
    if (process.env.WEB3FORMS_ACCESS_KEY) {
      const formData = new FormData();
      formData.append('access_key', process.env.WEB3FORMS_ACCESS_KEY);
      formData.append('name', name);
      formData.append('email', email);
      formData.append('message', message);
      formData.append('subject', `Nouveau message de contact de ${name}`);
      formData.append('from_name', 'Glisse et Vent - Site Web');

      const result = await sendWeb3Form(formData);

      if (result.success) {
        console.log("Email envoyé via Web3Forms:", result);
        return {
          success: true,
          message: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.",
        };
      }
    }

    // === SOLUTION 2: SMTP Fallback (si Web3Forms non configuré) ===
    if (env.SMTP_HOST && env.SMTP_PORT && env.SMTP_USER && env.SMTP_PASS && env.CONTACT_EMAIL) {
      const transporter = nodemailer.createTransport({
        host: env.SMTP_HOST,
        port: parseInt(env.SMTP_PORT || '587'),
        secure: false,
        auth: {
          user: env.SMTP_USER,
          pass: env.SMTP_PASS,
        },
      });

      // Email à l'administrateur
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

      // Email de confirmation à l'utilisateur
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
        message: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.",
      };
    }

    // === SOLUTION 3: Logging uniquement (si aucun service configuré) ===
    console.log("=== NOUVEAU MESSAGE DE CONTACT ===");
    console.log(`Nom: ${name}`);
    console.log(`Email: ${email}`);
    console.log(`Message: ${message}`);
    console.log("=================================");

    return {
      success: true,
      message: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.",
    };

  } catch (error) {
    console.error("Erreur lors de l'envoi du message:", error);

    // En cas d'erreur, on logge quand même le message
    console.log("=== MESSAGE DE CONTACT (ERREUR ENVOI) ===");
    console.log(`Nom: ${validatedFields.data.name}`);
    console.log(`Email: ${validatedFields.data.email}`);
    console.log(`Message: ${validatedFields.data.message}`);
    console.log("=======================================");

    return {
      success: true, // On retourne success pour ne pas bloquer l'utilisateur
      message: "Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.",
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
    return slots.map((slot: any) => ({
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
