import { Loader2 } from 'lucide-react';

interface LoaderProps {
  message?: string;
}

export default function Loader({ message = 'Loading...' }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-3">
      <Loader2 className="w-10 h-10 text-primary-600 animate-spin dark:text-primary-400" />
      <p className="text-gray-500 text-sm dark:text-slate-400">{message}</p>
    </div>
  );
}
