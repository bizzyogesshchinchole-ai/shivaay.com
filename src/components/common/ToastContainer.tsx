import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-[#2E7D32] shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-[#C62828] shrink-0" />,
          warning: <AlertTriangle className="w-5 h-5 text-[#EF6C00] shrink-0" />,
          info: <Info className="w-5 h-5 text-[#1565C0] shrink-0" />,
        };

        const bgColors = {
          success: 'bg-[#F1F8E9] border-[#C8E6C9] text-[#1B5E20]',
          error: 'bg-[#FFEBEE] border-[#FFCDD2] text-[#B71C1C]',
          warning: 'bg-[#FFF3E0] border-[#FFE0B2] text-[#E65100]',
          info: 'bg-[#E3F2FD] border-[#BBDEFB] text-[#0D47A1]',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl shadow-lg border flex items-start justify-between gap-3 text-xs font-medium animate-in slide-in-from-right-5 fade-in duration-200 ${
              bgColors[toast.type]
            }`}
          >
            <div className="flex items-center gap-2.5">
              {icons[toast.type]}
              <span className="leading-snug">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 rounded-md opacity-60 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
