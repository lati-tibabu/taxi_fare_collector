import React, { useState } from 'react';
import { BusFront, DollarSign } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { Button } from '../components/ui/Button';

export const StartScreen: React.FC = () => {
  const { startTrip } = useTrip();
  const [fare, setFare] = useState<number | ''>('');

  const commonFares = [10, 15, 20, 25, 30, 35, 40, 50];

  const handleStart = () => {
    if (typeof fare === 'number' && fare > 0) {
      startTrip(fare);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-50 p-6">
      <div className="flex-1 flex flex-col justify-center items-center gap-6">
        <div className="bg-blue-100 p-6 rounded-full text-blue-600 mb-4">
            <BusFront size={64} />
        </div>
        
        <h1 className="text-3xl font-extrabold text-slate-800 text-center">
            New Trip
        </h1>
        
        <div className="w-full max-w-sm">
            <label className="block text-sm font-semibold text-slate-500 mb-2 uppercase">Set Taxi Fare</label>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-slate-400 font-bold">Br</span>
                </div>
                <input 
                    type="number" 
                    value={fare}
                    onChange={(e) => setFare(parseInt(e.target.value) || '')}
                    className="block w-full pl-10 pr-4 py-4 text-3xl font-bold text-slate-900 bg-white border-2 border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 outline-none transition-colors"
                    placeholder="0"
                />
            </div>
        </div>

        <div className="w-full max-w-sm">
            <p className="text-xs text-slate-400 font-bold mb-3 uppercase tracking-wider text-center">Quick Select</p>
            <div className="grid grid-cols-4 gap-3">
                {commonFares.map(amount => (
                    <button
                        key={amount}
                        onClick={() => setFare(amount)}
                        className={`h-14 text-lg font-bold rounded-xl transition-all ${
                            fare === amount 
                            ? 'bg-blue-600 text-white shadow-lg scale-105' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:border-blue-300'
                        }`}
                    >
                        {amount}
                    </button>
                ))}
            </div>
        </div>
      </div>

      <div className="pb-8">
        <Button 
            variant="primary" 
            size="xl" 
            fullWidth 
            onClick={handleStart}
            disabled={!fare}
            className={!fare ? 'opacity-50' : 'shadow-blue-500/30 shadow-xl'}
        >
            Start Collection
        </Button>
      </div>
    </div>
  );
};
