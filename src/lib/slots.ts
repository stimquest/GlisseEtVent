
import type { Slot } from "@/app/admin/types";

export const getBookedCount = (slot: Slot) => {
    const simpleBooked = slot.bookings.reduce((acc, b) => acc + (b.simpleChars || 0), 0);
    const doubleBooked = slot.bookings.reduce((acc, b) => acc + (b.doubleChars || 0), 0);
    return { simpleBooked, doubleBooked };
}

export const getSlotStatus = (slot: Slot): 'Complet' | 'Confirmé' | 'Disponible' => {
    const { simpleBooked, doubleBooked } = getBookedCount(slot);
    
    const isFull = simpleBooked >= slot.capacitySimple && doubleBooked >= slot.capacityDouble;
    if (isFull) return 'Complet';

    const isBooked = slot.bookings.length > 0;
    if (isBooked) return 'Confirmé';

    return 'Disponible';
}

export const getAvailableCount = (slot: Slot) => {
    const { simpleBooked, doubleBooked } = getBookedCount(slot);
    return {
        simpleAvailable: slot.capacitySimple - simpleBooked,
        doubleAvailable: slot.capacityDouble - doubleBooked,
    };
}


export const getPublicSlotStatus = (slot: Slot): {
    status: 'Disponible' | 'Presque complet' | 'Complet';
    totalAvailable: number;
    totalCapacity: number;
    percentageUsed: number;
} => {
    const { simpleAvailable, doubleAvailable } = getAvailableCount(slot);
    const totalAvailable = simpleAvailable + doubleAvailable;
    const totalCapacity = slot.capacitySimple + slot.capacityDouble;
    const percentageUsed = totalCapacity > 0 ? 100 * (totalCapacity - totalAvailable) / totalCapacity : 100;
    
    if (totalAvailable <= 0) {
        return { status: 'Complet', totalAvailable: 0, totalCapacity, percentageUsed };
    }
    
    // Consider "almost full" if less than 30% of total capacity is available
    if (totalCapacity > 0 && totalAvailable / totalCapacity < 0.3) {
        return { status: 'Presque complet', totalAvailable, totalCapacity, percentageUsed };
    }
    
    return { status: 'Disponible', totalAvailable, totalCapacity, percentageUsed };
};

