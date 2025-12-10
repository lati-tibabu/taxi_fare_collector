import React, { useRef, useEffect } from 'react';
import { Plus, CheckCircle, AlertTriangle, Wallet } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { PassengerCard } from '../components/PassengerCard';
import { Button } from '../components/ui/Button';

export const ActiveTripScreen: React.FC = () => {
  const { 
    fare, 
    passengers, 
    addPassenger, 
    updatePassengerPayment, 
    resetPassengerPayment,
    markChangeReturned,
    endTrip,
    removePassenger
  } = useTrip();

  const listEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to top when a new passenger is added (since we prepend logic, but let's ensure visibility)
  // Actually, in the Context logic I decided to Prepend (add to top), so auto-scroll should go to top.
  const topRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (passengers.length > 0) {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [passengers.length]);

  // Derived Stats
  const totalCollected = passengers.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalChangeDue = passengers.reduce((sum, p) => {
    const change = p.paidAmount - fare;
    return change > 0 && !p.isChangeReturned ? sum + change : sum;
  }, 0);
  
  const passengersPaidCount = passengers.filter(p => p.paidAmount >= fare).length;

  return (
    <div className="flex flex-col h-full bg-slate-100">
      {/* Sticky Header */}
      <div className="bg-slate-900 text-white p-4 shadow-lg z-10 sticky top-0">
        <div className="flex justify-between items-center mb-4">
            <div>
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Fare</span>
                <div className="text-2xl font-bold text-white">{fare} <span className="text-sm font-normal text-slate-400">Br</span></div>
            </div>
            <div className="text-right">
                <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Collected</span>
                <div className="text-2xl font-bold text-emerald-400">{totalCollected} <span className="text-sm font-normal text-emerald-700">Br</span></div>
            </div>
        </div>

        {totalChangeDue > 0 ? (
            <div className="bg-amber-500 text-slate-900 p-2 rounded-lg flex items-center justify-between font-bold animate-pulse">
                <div className="flex items-center gap-2">
                    <AlertTriangle size={20} />
                    <span>Pending Change</span>
                </div>
                <span className="text-xl">{totalChangeDue} Br</span>
            </div>
        ) : (
            <div className="bg-slate-800 text-slate-400 p-2 rounded-lg flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <CheckCircle size={18} />
                    <span className="text-sm font-medium">All change returned</span>
                </div>
            </div>
        )}
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 pb-32 scroll-smooth">
        <div ref={topRef} />
        {passengers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-slate-400 opacity-60 mt-10">
                <Wallet size={64} className="mb-4" />
                <p className="text-xl font-bold">No passengers yet</p>
                <p className="text-sm">Tap + to start collecting</p>
            </div>
        ) : (
            passengers.map(p => (
                <PassengerCard 
                    key={p.id} 
                    passenger={p} 
                    fare={fare}
                    onPayment={updatePassengerPayment}
                    onReset={resetPassengerPayment}
                    onReturnChange={markChangeReturned}
                    onRemove={removePassenger}
                />
            ))
        )}
        <div ref={listEndRef} />
      </div>

      {/* Floating Action Buttons Area */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-100 via-slate-100 to-transparent pb-6 pt-10">
        <div className="flex gap-3 max-w-md mx-auto w-full">
            <Button 
                variant="danger" 
                onClick={() => {
                   if (window.confirm("End Trip?")) endTrip();
                }}
                className="flex-1 shadow-lg"
            >
                End Trip
            </Button>
            <Button 
                variant="primary" 
                size="xl" 
                className="flex-[2] shadow-blue-900/20 shadow-xl flex items-center justify-center gap-2"
                onClick={addPassenger}
            >
                <Plus size={28} strokeWidth={3} />
                <span>Add ({passengers.length})</span>
            </Button>
        </div>
      </div>
    </div>
  );
};
