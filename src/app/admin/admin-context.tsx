
"use client";

import { createContext, useContext, useState, useEffect, type ReactNode, type Dispatch, type SetStateAction } from 'react';
import type { Slot } from './types';
import { getSlots } from '../actions';

interface AdminContextType {
  slots: Slot[];
  setSlots: Dispatch<SetStateAction<Slot[]>>; // Keep for optimistic updates if needed
  isLoading: boolean;
  refreshSlots: () => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [slots, setSlots] = useState<Slot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const refreshSlots = async () => {
      setIsLoading(true);
      try {
        const loadedSlots = await getSlots();
        setSlots(loadedSlots);
      } catch (error) {
        console.error("Failed to refresh slots:", error);
      } finally {
        setIsLoading(false);
      }
  };

  useEffect(() => {
    refreshSlots();
  }, []);
  
  return (
    <AdminContext.Provider value={{ slots, setSlots, isLoading, refreshSlots }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdminContext() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdminContext must be used within an AdminProvider');
  }
  return context;
}
