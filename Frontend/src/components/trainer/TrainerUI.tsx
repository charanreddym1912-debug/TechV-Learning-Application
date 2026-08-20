import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
}

export const GlassSurface: React.FC<ContainerProps> = ({
  children,
  className = '',
}) => {
  return (
    <div
      className={`rounded-3xl border border-white/20 bg-white/95 shadow-2xl backdrop-blur-xl ${className}`}
    >
      {children}
    </div>
  );
};

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<ButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-indigo-600 px-5 py-2.5 font-semibold text-white shadow-lg shadow-primary-500/30 transition-all duration-300 hover:from-primary-700 hover:to-indigo-700 hover:shadow-primary-500/50 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export const SecondaryButton: React.FC<ButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-5 py-2.5 font-semibold text-gray-700 transition-all duration-300 hover:bg-gray-100 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

export const DangerButton: React.FC<ButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white shadow-md shadow-red-500/20 transition-all duration-300 hover:bg-red-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
};

interface ZoomButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const ZoomButton: React.FC<ZoomButtonProps> = ({
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      {...props}
      className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#0E71EB] px-4 py-2.5 font-bold text-white shadow-md transition-all duration-300 hover:bg-[#0051C3] active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-300 ${className}`}
    >
      {children}
    </button>
  );
};

interface StatusBadgeProps {
  type: 'success' | 'danger' | 'warning' | 'zoom' | 'primary';
  children: React.ReactNode;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  children,
}) => {
  const styles = {
    success:
      'border-emerald-200 bg-emerald-100 text-emerald-800',
    danger: 'border-red-200 bg-red-100 text-red-800',
    warning: 'border-amber-200 bg-amber-100 text-amber-800',
    zoom: 'border-blue-200 bg-blue-100 text-blue-800',
    primary:
      'border-primary-200 bg-primary-100 text-primary-800',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${styles[type]}`}
    >
      {children}
    </span>
  );
};

export const inputClassName =
  'w-full rounded-xl border border-gray-300 bg-gray-50/50 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-transparent focus:bg-white focus:ring-2 focus:ring-primary-500';