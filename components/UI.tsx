import React from 'react';

// Large primary button
export const ButtonPrimary: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...props }) => (
  <button
    className={`h-[56px] px-8 bg-brand-dark text-white text-xl font-bold rounded-lg hover:bg-blue-900 active:scale-95 transition-all shadow-lg flex items-center justify-center gap-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Large secondary button (White/Outline)
export const ButtonSecondary: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...props }) => (
  <button
    className={`h-[56px] px-6 bg-white border-2 border-brand-dark text-brand-dark text-xl font-bold rounded-lg hover:bg-gray-50 active:scale-95 transition-all flex items-center justify-center gap-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Large green button for "Safe/Good" actions
export const ButtonSuccess: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...props }) => (
  <button
    className={`h-[50px] px-6 bg-brand-green text-white text-lg font-bold rounded hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Large red button for "Warning/Attention" actions
export const ButtonDanger: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ className = '', children, ...props }) => (
  <button
    className={`h-[50px] px-6 bg-brand-red text-white text-lg font-bold rounded hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

// Card container
export const Card: React.FC<{ children: React.ReactNode; className?: string; onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <div 
    onClick={onClick}
    className={`bg-white rounded-xl border border-gray-200 shadow-sm p-6 ${className}`}
  >
    {children}
  </div>
);

// Input field with large text
export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-gray-600 text-lg font-semibold">{label}</label>}
    <input
      className={`h-[56px] text-xl px-4 border-2 border-gray-300 rounded-lg focus:border-brand-dark focus:ring-2 focus:ring-blue-100 outline-none w-full transition-colors ${className}`}
      {...props}
    />
  </div>
);

// Textarea with large text
export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }> = ({ label, className = '', ...props }) => (
  <div className="flex flex-col gap-2 w-full">
    {label && <label className="text-gray-600 text-lg font-semibold">{label}</label>}
    <textarea
      className={`text-xl p-4 border-2 border-gray-300 rounded-lg focus:border-brand-dark focus:ring-2 focus:ring-blue-100 outline-none w-full min-h-[120px] transition-colors ${className}`}
      {...props}
    />
  </div>
);

// Notification Toast
export const NotificationToast: React.FC<{ message: string | null }> = ({ message }) => {
  if (!message) return null;
  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-brand-green text-white text-2xl font-bold px-8 py-4 rounded-full shadow-2xl flex items-center gap-3">
        {message}
      </div>
    </div>
  );
};

export const Badge: React.FC<{ children: React.ReactNode; color: 'red' | 'green' | 'blue' | 'gray' }> = ({ children, color }) => {
  const map = {
    red: 'bg-red-100 text-brand-red border-red-200',
    green: 'bg-green-100 text-brand-green border-green-200',
    blue: 'bg-blue-100 text-brand-dark border-blue-200',
    gray: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return (
    <span className={`px-3 py-1 rounded border text-lg font-bold ${map[color]}`}>
      {children}
    </span>
  );
};