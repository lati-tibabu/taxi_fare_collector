import React, { useState } from 'react';
import { RefreshCcw, Check, User, AlertCircle, Trash2 } from 'lucide-react';
import { Passenger } from '../types';
import { Button } from './ui/Button';
import { NumpadModal } from './NumpadModal';

interface PassengerCardProps {
  passenger: Passenger;
  fare: number;
  onPayment: (id: string, amount: number) => void;
  onReset: (id: string) => void;
  onReturnChange: (id: string) => void;
  onRemove: (id: string) => void;
}

export const PassengerCard: React.FC<PassengerCardProps> = ({
  passenger,
  fare,
  onPayment,
  onReset,
  onReturnChange,
  onRemove
}) => {
  const [isNumpadOpen, setNumpadOpen] = useState(false);

  const changeDue = passenger.paidAmount > fare ? passenger.paidAmount - fare : 0;
  const isPaidFull = passenger.paidAmount >= fare;
  const remaining = fare - passenger.paidAmount;
  const isComplete = isPaidFull && (changeDue === 0 || passenger.isChangeReturned);

  // Status Color Logic
  let borderColor = "border-l-4 border-l-red-500";
  let bgStatus = "bg-white";
  
  if (isComplete) {
    borderColor = "border-l-4 border-l-green-500 opacity-70";
    bgStatus = "bg-green-50";
  } else if (isPaidFull && changeDue > 0 && !passenger.isChangeReturned) {
    borderColor = "border-l-4 border-l-amber-500";
    bgStatus = "bg-amber-50";
  }

  return (
    <div className={`relative mb-3 rounded-lg shadow-md overflow-hidden bg-white transition-all duration-300 ${borderColor}`}>
      <div className={`p-3 flex justify-between items-center ${bgStatus} border-b border-slate-100`}>
        <div className="flex items-center gap-2">
            <div className="bg-slate-200 p-1.5 rounded-full">
                <User size={16} className="text-slate-600" />
            </div>
            <span className="font-bold text-slate-700 text-lg">#{passenger.number}</span>
        </div>
        
        <div className="flex items-center gap-2">
            {!isPaidFull && (
                 <span className="text-red-600 font-bold text-sm bg-red-100 px-2 py-1 rounded">
                    Due: {remaining}
                 </span>
            )}
            {isPaidFull && changeDue === 0 && (
                <span className="text-green-700 font-bold text-sm flex items-center gap-1 bg-green-200 px-2 py-1 rounded">
                    <Check size={14} /> Paid
                </span>
            )}
             {isPaidFull && changeDue > 0 && !passenger.isChangeReturned && (
                <span className="text-amber-700 font-bold text-sm flex items-center gap-1 bg-amber-200 px-2 py-1 rounded animate-pulse">
                    <AlertCircle size={14} /> Change: {changeDue}
                </span>
            )}
             {passenger.isChangeReturned && (
                <span className="text-green-700 font-bold text-sm flex items-center gap-1 bg-green-200 px-2 py-1 rounded">
                    <Check size={14} /> Done
                </span>
            )}
            <button onClick={() => onRemove(passenger.id)} className="text-slate-400 p-1">
                <Trash2 size={16}/>
            </button>
        </div>
      </div>

      <div className="p-3">
        {/* Payment Buttons */}
        {!isComplete && (
            <div className="grid grid-cols-4 gap-2 mb-3">
                <Button variant="secondary" size="sm" onClick={() => onPayment(passenger.id, fare)} className="h-12 font-bold text-lg">
                    {fare}
                </Button>
                <Button variant="neutral" size="sm" onClick={() => onPayment(passenger.id, 50)} className="h-12 font-bold text-lg">
                    50
                </Button>
                <Button variant="neutral" size="sm" onClick={() => onPayment(passenger.id, 100)} className="h-12 font-bold text-lg">
                    100
                </Button>
                <Button variant="outline" size="sm" onClick={() => setNumpadOpen(true)} className="h-12 font-bold text-sm">
                    ...
                </Button>
            </div>
        )}

        {/* Action Area */}
        <div className="flex justify-between items-center">
            <div className="flex flex-col">
                <span className="text-xs text-slate-500 uppercase tracking-wide font-semibold">Total Paid</span>
                <span className="text-xl font-mono font-bold text-slate-800">{passenger.paidAmount} Br</span>
            </div>

            <div className="flex gap-2">
                {passenger.paidAmount > 0 && !isComplete && (
                    <button 
                        onClick={() => onReset(passenger.id)} 
                        className="p-3 rounded-lg bg-red-100 text-red-600 active:bg-red-200"
                        aria-label="Reset Payment"
                    >
                        <RefreshCcw size={20} />
                    </button>
                )}
                
                {changeDue > 0 && !passenger.isChangeReturned && (
                    <Button 
                        variant="success" 
                        size="md" 
                        onClick={() => onReturnChange(passenger.id)}
                        className="animate-bounce-short shadow-lg border-2 border-emerald-400"
                    >
                        Return {changeDue}
                    </Button>
                )}
            </div>
        </div>
      </div>

      <NumpadModal 
        isOpen={isNumpadOpen} 
        onClose={() => setNumpadOpen(false)} 
        onSubmit={(amt) => onPayment(passenger.id, amt)}
        title={`Add to Passenger #${passenger.number}`}
      />
    </div>
  );
};
