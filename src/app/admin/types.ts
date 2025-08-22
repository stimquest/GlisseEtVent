
export type SlotStatus = 'Disponible' | 'Confirmé' | 'Complet';

export type Booking = {
    id: string;
    userName: string;
    email: string;
    phone: string;
    simpleChars: number;
    doubleChars: number;
}

export type Slot = {
  id: string;
  date: Date;
  start: number; // Heure de début en minutes depuis minuit (ex: 900 pour 15h00)
  end: number;   // Heure de fin en minutes depuis minuit (ex: 990 pour 16h30)
  capacitySimple: number;
  capacityDouble: number;
  bookings: Booking[];
};
