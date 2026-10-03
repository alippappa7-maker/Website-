import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Radio, 
  Download, 
  CheckCircle2, 
  Info, 
  X, 
  ArrowLeft,
  BellRing
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { ToastNotification } from '../types';

interface SingleToastProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

const SingleToast: React.FC<SingleToastProps> = ({ toast, onDismiss }) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  const duration = toast.duration || 7000;

  useEffect(() => {
    if (isPaused) return;

    const startTime = Date.now();
    const endTime = startTime + duration;

    const timer = setInterval(() => {
      const now = Date.now();
      const remaining = endTime - now;

      if (remaining <= 0) {
        clearInterval(timer);
        setProgress(0);
        onDismiss(toast.id);
      } else {
        setProgress(Math.max(0, Math.min(100, (remaining / duration) * 100)));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [duration, isPaused, onDismiss, toast.id]);

  // Styling and icon per toast type
  const getTypeConfig = () => {
    switch (toast.type) {
      case 'urgent_news':
        return {
          icon: Zap,
          borderColor: 'border-amber-500/40 hover:border-amber-400',
          glow: 'shadow-[0_0_25px_rgba(245,158,11,0.25)]',
          badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
          progressBarColor: 'bg-amber-400',
          accentColor: 'text-amber-300',
          typeLabel: 'تنبيه عاجل',
        };
      case 'new_lesson':
        return {
          icon: Radio,
          borderColor: 'border-cyan-500/40 hover:border-cyan-400',
          glow: 'shadow-[0_0_25px_rgba(6,182,212,0.25)]',
          badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
          progressBarColor: 'bg-cyan-400',
          accentColor: 'text-cyan-300',
          typeLabel: 'مادة جديدة',
        };
      case 'app_update':
        return {
          icon: Download,
          borderColor: 'border-emerald-500/40 hover:border-emerald-400',
          glow: 'shadow-[0_0_25px_rgba(16,185,129,0.25)]',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          progressBarColor: 'bg-emerald-400',
          accentColor: 'text-emerald-300',
          typeLabel: 'تحديث تطبيق',
        };
      case 'success':
        return {
          icon: CheckCircle2,
          borderColor: 'border-emerald-500/40 hover:border-emerald-400',
          glow: 'shadow-[0_0_20px_rgba(16,185,129,0.2)]',
          badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
          progressBarColor: 'bg-emerald-400',
          accentColor: 'text-emerald-300',
          typeLabel: 'نجاح العملية',
        };
      default:
        return {
          icon: Info,
          borderColor: 'border-blue-500/40 hover:border-blue-400',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.2)]',
          badgeBg: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
          progressBarColor: 'bg-cyan-400',
          accentColor: 'text-cyan-300',
          typeLabel: 'إشعار المنصة',
        };
    }
  };

  const config = getTypeConfig();
  const Icon = config.icon;

  const handleAction = () => {
    if (toast.actionUrl) {
      navigate(toast.actionUrl);
      onDismiss(toast.id);
    }
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`relative w-full max-w-sm rounded-2xl bg-[#090E1A]/95 backdrop-blur-xl border ${config.borderColor} ${config.glow} p-4 text-right transition-all duration-300 select-none overflow-hidden animate-in fade-in slide-in-from-top-4`}
    >
      {/* Top micro progress bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
        <div
          className={`h-full ${config.progressBarColor} transition-all duration-75`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-start gap-3 pt-1">
        {/* Type Icon Badge */}
        <div className={`p-2 rounded-xl border shrink-0 ${config.badgeBg} mt-0.5`}>
          <Icon className="w-4 h-4" />
        </div>

        {/* Content Body */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${config.badgeBg}`}>
              {config.typeLabel}
            </span>
            <span className="text-[10px] font-mono text-slate-500">الآن</span>
          </div>

          <h4 className="text-xs font-bold text-white font-tajawal leading-snug line-clamp-2">
            {toast.title}
          </h4>

          <p className="text-[11px] text-slate-300 leading-relaxed mt-1 line-clamp-2">
            {toast.message}
          </p>

          {/* Action button if present */}
          {toast.actionLabel && (
            <div className="mt-3 flex items-center justify-start">
              <button
                onClick={handleAction}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold font-tajawal text-slate-900 bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.3)] transition-all cursor-pointer group"
              >
                <span>{toast.actionLabel}</span>
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>

        {/* Dismiss 'X' button */}
        <button
          onClick={() => onDismiss(toast.id)}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors shrink-0"
          title="إغلاق التنبيه"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 left-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-auto">
      {toasts.map((toast) => (
        <SingleToast
          key={toast.id}
          toast={toast}
          onDismiss={removeToast}
        />
      ))}
    </div>
  );
};
