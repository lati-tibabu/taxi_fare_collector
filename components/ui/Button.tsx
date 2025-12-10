import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false, 
  className = '',
  ...props 
}) => {
  const baseStyles = "font-bold rounded-lg shadow-sm transition-transform active:scale-95 flex items-center justify-center focus:outline-none";
  
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800",
    secondary: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800",
    danger: "bg-red-500 text-white hover:bg-red-600 active:bg-red-700",
    neutral: "bg-slate-200 text-slate-800 hover:bg-slate-300",
    outline: "border-2 border-slate-300 text-slate-600 bg-transparent hover:bg-slate-50",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-3 text-base",
    lg: "px-6 py-4 text-lg",
    xl: "px-8 py-5 text-xl uppercase tracking-wider",
  };

  return (
    <button 
      className={`
        ${baseStyles} 
        ${variants[variant]} 
        ${sizes[size]} 
        ${fullWidth ? 'w-full' : ''} 
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
