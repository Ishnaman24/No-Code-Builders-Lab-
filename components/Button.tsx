import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  className = '', 
  isLoading,
  size = 'md',
  ...props 
}) => {
  const baseStyles = "relative font-semibold transition-all duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group";
  
  const sizeStyles = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-3 text-base rounded-xl",
    lg: "px-8 py-4 text-lg rounded-xl",
  };

  const variants = {
    primary: "bg-gradient-to-r from-rose-600 to-violet-600 hover:from-rose-500 hover:to-violet-500 text-white shadow-[0_0_20px_-5px_rgba(225,29,72,0.4)] hover:shadow-[0_0_25px_-5px_rgba(225,29,72,0.6)]",
    secondary: "bg-white text-slate-900 hover:bg-slate-100 shadow-lg shadow-white/10",
    outline: "border border-slate-700 text-slate-300 hover:border-slate-500 hover:text-white bg-transparent",
    ghost: "text-slate-400 hover:text-white bg-transparent hover:bg-white/5",
  };

  return (
    <button 
      className={`${baseStyles} ${sizeStyles[size]} ${variants[variant]} ${className}`} 
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Loading Spinner */}
      {isLoading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit">
           <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
        </span>
      )}
      
      {/* Content */}
      <span className={`flex items-center gap-2 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {children}
      </span>

      {/* Hover Shine Effect for Primary */}
      {variant === 'primary' && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
      )}
    </button>
  );
};