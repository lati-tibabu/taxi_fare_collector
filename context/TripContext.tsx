import React, { createContext, useContext, useEffect, useState } from 'react';
import { TripState, TripContextType, Passenger, TripStatus } from '../types';

const TripContext = createContext<TripContextType | undefined>(undefined);

const STORAGE_KEY = 'minibus_trip_data_v1';

const INITIAL_STATE: TripState = {
  status: 'START',
  fare: 0,
  passengers: [],
  startTime: 0,
};

export const TripProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<TripState>(INITIAL_STATE);
  const [loaded, setLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setState(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load state", e);
    } finally {
      setLoaded(true);
    }
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state, loaded]);

  const startTrip = (fare: number) => {
    setState({
      status: 'ACTIVE',
      fare,
      passengers: [],
      startTime: Date.now(),
    });
  };

  const addPassenger = () => {
    setState(prev => {
      const newPassenger: Passenger = {
        id: crypto.randomUUID(),
        number: prev.passengers.length + 1,
        paidAmount: 0,
        isChangeReturned: false,
        timestamp: Date.now(),
      };
      return {
        ...prev,
        passengers: [newPassenger, ...prev.passengers], // Add to top
      };
    });
  };

  const updatePassengerPayment = (id: string, amountToAdd: number) => {
    setState(prev => ({
      ...prev,
      passengers: prev.passengers.map(p => 
        p.id === id ? { ...p, paidAmount: p.paidAmount + amountToAdd } : p
      ),
    }));
  };

  const resetPassengerPayment = (id: string) => {
    setState(prev => ({
      ...prev,
      passengers: prev.passengers.map(p => 
        p.id === id ? { ...p, paidAmount: 0, isChangeReturned: false } : p
      ),
    }));
  };

  const markChangeReturned = (id: string) => {
    setState(prev => ({
      ...prev,
      passengers: prev.passengers.map(p => 
        p.id === id ? { ...p, isChangeReturned: true } : p
      ),
    }));
  };

  const removePassenger = (id: string) => {
     setState(prev => ({
      ...prev,
      passengers: prev.passengers.filter(p => p.id !== id),
    }));
  }

  const endTrip = () => {
    setState(prev => ({
      ...prev,
      status: 'SUMMARY',
      endTime: Date.now(),
    }));
  };

  const resetApp = () => {
    setState(INITIAL_STATE);
  };

  if (!loaded) return null;

  return (
    <TripContext.Provider value={{
      ...state,
      startTrip,
      addPassenger,
      updatePassengerPayment,
      resetPassengerPayment,
      markChangeReturned,
      endTrip,
      resetApp,
      removePassenger
    }}>
      {children}
    </TripContext.Provider>
  );
};

export const useTrip = () => {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error('useTrip must be used within a TripProvider');
  }
  return context;
};
