
"use server";

import { z } from "zod";
import fs from 'fs/promises';
import path from 'path';
import type { Slot } from "./admin/types";

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

  // Here you would implement your email sending logic.
  // For this example, we'll just log to the console.
  console.log("New contact form submission:", validatedFields.data);

  return {
    success: true,
    message: "Thank you for your message! We will get back to you soon.",
  };
}

// --- Gestion des données (Slots) ---
const slotsFilePath = path.join(process.cwd(), 'data', 'slots.json');

// Fonction pour lire les slots depuis le fichier JSON
export async function getSlots(): Promise<Slot[]> {
  try {
    const data = await fs.readFile(slotsFilePath, 'utf-8');
    const slots = JSON.parse(data) as Slot[];
    // Convertir les chaînes de date en objets Date
    return slots.map(slot => ({
      ...slot,
      date: new Date(slot.date),
    }));
  } catch (error) {
    console.error("Failed to read slots data:", error);
    // Si le fichier n'existe pas ou est vide, retourner un tableau vide
    return [];
  }
}

// Fonction pour sauvegarder les slots dans le fichier JSON
export async function saveSlots(slots: Slot[]): Promise<{ success: boolean }> {
  try {
    await fs.mkdir(path.dirname(slotsFilePath), { recursive: true });
    await fs.writeFile(slotsFilePath, JSON.stringify(slots, null, 2), 'utf-8');
    return { success: true };
  } catch (error) {
    console.error("Failed to save slots data:", error);
    return { success: false };
  }
}
