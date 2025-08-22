
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode, type Dispatch, type SetStateAction, useCallback } from 'react';
import type { Slot } from './types';
import { getSlots, saveSlots } from '../actions';
import { useToast } from '@/hooks/use-toast';


// --- Types ---
interface AdminContextType {
  slots: Slot[];
  setSlots: (newSlots: Slot[] | ((prevSlots: Slot[]) => Slot[])) => Promise<void>;
  isLoading: boolean;
}


// --- Context ---
const AdminContext = createContext<AdminContextType | undefined>(undefined);

// --- Provider ---
export function AdminProvider({ children }: { children: ReactNode }) {
  const [slots, setInternalSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadSlots() {
      setIsLoading(true);
      const loadedSlots = await getSlots();
      setInternalSlots(loadedSlots);
      setIsLoading(false);
    }
    loadSlots();
  }, []);
  
  const setSlotsAndSave: AdminContextType['setSlots'] = useCallback(async (newSlotsOrFn) => {
      const newSlots = typeof newSlotsOrFn === 'function' ? newSlotsOrFn(slots) : newSlotsOrFn;
      
      // Update state optimistically
      setInternalSlots(newSlots);
      
      const result = await saveSlots(newSlots);
      if (!result.success) {
          toast({
              variant: "destructive",
              title: "Erreur de sauvegarde",
              description: "Les modifications n'ont pas pu être enregistrées."
          });
          // Rollback if save fails
          setInternalSlots(slots);
      }
  }, [slots, toast]);


  return (
    <AdminContext.Provider value={{ slots, setSlots: setSlotsAndSave, isLoading }}>
      {children}
    </AdminContext.Provider>
  );
}

// --- Hook ---
export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}
