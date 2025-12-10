import React, { useState } from 'react';
import { X, Delete } from 'lucide-react';
import { Button } from './ui/Button';

interface NumpadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
  title?: string;
}

export const NumpadModal: React.FC<NumpadModalProps> = ({ isOpen, onClose, onSubmit, title = "Enter Amount" }) => {
  const [value, setValue] = useState("");

  if (!isOpen) return null;

  const handleNum = (num: number) => {
    if (value.length < 5) {
      setValue(prev => prev + num.toString());
    }
  };

  const handleBackspace = () => {
    setValue(prev => prev.slice(0, -1));
  };

  const handleSubmit = () => {
    const num = parseInt(value, 10);
    if (!isNaN(num) && num > 0) {
      onSubmit(num);
      setValue("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full sm:max-w-md bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl p-4 pb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-slate-700">{title}</h3>
          <button onClick={onClose} className="p-2 bg-slate-100 rounded-full text-slate-500">
            <X size={24} />
          </button>
        </div>

        <div className="bg-slate-100 p-4 rounded-xl mb-4 text-right">
          <span className="text-4xl font-mono font-bold text-slate-800">
            {value || "0"} <span className="text-lg text-slate-400">Br</span>
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleNum(num)}
              className="h-16 text-2xl font-bold bg-white border border-slate-200 rounded-xl shadow-sm active:bg-slate-100 text-slate-700"
            >
              {num}
            </button>
          ))}
          <button
            onClick={() => handleNum(0)}
            className="h-16 text-2xl font-bold bg-white border border-slate-200 rounded-xl shadow-sm active:bg-slate-100 text-slate-700"
          >
            0
          </button>
           <button
            onClick={handleBackspace}
            className="h-16 flex items-center justify-center bg-slate-200 rounded-xl shadow-sm active:bg-slate-300 text-slate-700 col-span-1"
          >
            <Delete size={28} />
          </button>
           <Button 
            variant="success" 
            className="col-span-1 h-16 flex items-center justify-center"
            onClick={handleSubmit}
            disabled={!value}
           >
            OK
           </Button>
        </div>
      </div>
    </div>
  );
};
