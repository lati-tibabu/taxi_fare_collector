import React from 'react';
import { CheckCircle, AlertTriangle, RotateCcw, Home } from 'lucide-react';
import { useTrip } from '../context/TripContext';
import { Button } from '../components/ui/Button';

export const SummaryScreen: React.FC = () => {
  const { 
    fare, 
    passengers, 
    resetApp, 
    startTime, 
    endTime 
  } = useTrip();

  const totalCollected = passengers.reduce((sum, p) => sum + p.paidAmount, 0);
  const totalExpected = passengers.length * fare;
  
  const totalChangeReturned = passengers.reduce((sum, p) => {
    const change = p.paidAmount - fare;
    return (change > 0 && p.isChangeReturned) ? sum + change : sum;
  }, 0);

  // This is purely based on the app logic, what remains in the collector's hand
  const netCash = totalCollected - totalChangeReturned;
  
  // What they SHOULD have if everyone paid exactly
  const theoreticalRevenue = passengers.length * fare;
  
  // Difference (should be 0 if all change returned correctly)
  const discrepancy = netCash - theoreticalRevenue;

  const durationMinutes = endTime && startTime 
    ? Math.round((endTime - startTime) / 60000) 
    : 0;

  return (
    <div className="flex flex-col h-full bg-slate-50 overflow-y-auto">
      <div className="bg-slate-900 text-white p-8 rounded-b-3xl shadow-xl text-center mb-6">
        <div className="inline-flex p-3 bg-green-500/20 rounded-full mb-4 text-green-400">
            <CheckCircle size={48} />
        </div>
        <h1 className="text-3xl font-bold mb-1">Trip Complete</h1>
        <p className="text-slate-400">{durationMinutes} minutes duration</p>
      </div>

      <div className="px-6 space-y-4 max-w-lg mx-auto w-full mb-8">
        
        {/* Main Stats Card */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="grid grid-cols-2 gap-6 text-center">
                <div>
                    <p className="text-xs font-bold text-slate-400 uppercase">Passengers</p>
                    <p className="text-3xl font-extrabold text-slate-800">{passengers.length}</p>
                </div>
                <div>
                     <p className="text-xs font-bold text-slate-400 uppercase">Fare</p>
                     <p className="text-3xl font-extrabold text-slate-800">{fare}</p>
                </div>
            </div>
            <div className="border-t border-slate-100 my-4"></div>
            <div className="text-center">
                <p className="text-sm font-bold text-slate-500 uppercase mb-1">Total Revenue Expected</p>
                <p className="text-4xl font-extrabold text-blue-600">{theoreticalRevenue} <span className="text-lg text-slate-400">Br</span></p>
            </div>
        </div>

        {/* Cash Flow Details */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 space-y-3">
             <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Total Cash Collected</span>
                <span className="font-bold text-slate-800">{totalCollected} Br</span>
             </div>
             <div className="flex justify-between items-center text-red-600">
                <span className="font-medium">Total Change Returned</span>
                <span className="font-bold">-{totalChangeReturned} Br</span>
             </div>
             <div className="border-t border-slate-100 pt-3 flex justify-between items-center">
                <span className="text-slate-800 font-bold text-lg">Net Cash In Hand</span>
                <span className="font-mono font-bold text-xl text-slate-900">{netCash} Br</span>
             </div>
        </div>

        {/* Audit Check */}
        {discrepancy !== 0 ? (
            <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                <AlertTriangle className="text-red-500 shrink-0 mt-0.5" />
                <div>
                    <p className="font-bold text-red-800">Discrepancy Detected</p>
                    <p className="text-sm text-red-600">
                        {discrepancy > 0 
                            ? `You have ${discrepancy} Br extra. Did you forget to return change?` 
                            : `You are missing ${Math.abs(discrepancy)} Br. Did you return too much change?`}
                    </p>
                </div>
            </div>
        ) : (
             <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center justify-center gap-2 text-green-700 font-bold">
                <CheckCircle size={20} />
                <span>Balanced Perfectly</span>
             </div>
        )}

      </div>

      <div className="mt-auto p-6 bg-white border-t border-slate-100">
        <Button variant="primary" fullWidth size="xl" onClick={resetApp} className="flex items-center justify-center gap-2">
            <RotateCcw size={20} />
            Start New Trip
        </Button>
      </div>
    </div>
  );
};
