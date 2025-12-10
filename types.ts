export type TripStatus = 'START' | 'ACTIVE' | 'SUMMARY';

export interface Passenger {
  id: string;
  number: number;
  paidAmount: number;
  isChangeReturned: boolean;
  timestamp: number;
}

export interface TripState {
  status: TripStatus;
  fare: number;
  passengers: Passenger[];
  startTime: number;
  endTime?: number;
}

export interface TripContextType extends TripState {
  startTrip: (fare: number) => void;
  addPassenger: () => void;
  updatePassengerPayment: (id: string, amountToAdd: number) => void;
  resetPassengerPayment: (id: string) => void;
  markChangeReturned: (id: string) => void;
  endTrip: () => void;
  resetApp: () => void;
  removePassenger: (id: string) => void;
}
