import React, { useState } from 'react';
import { RefreshCw, Sparkles, Download, CheckCircle2 } from 'lucide-react';
import { useUplink } from '../context/UplinkContext';
import { AppUpdateModal } from './AppUpdateModal';

interface AppUpdateButtonProps {
  variant?: 'navbar' | 'prominent' | 'compact';
  className?: string;
}

export const AppUpdateButton: React.FC<AppUpdateButtonProps> = ({ variant = 'navbar', className = '' }) => {
  const { releases, isCheckingUpdates, checkForUpdatesNow, lastUpdateResult } = useUplink();
  const [modalOpen, setModalOpen] = useState(false);

  const currentVersion = releases[0]?.version || 'v1.2.1';

  if (variant === 'prominent') {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className={`group relative flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#0D1829] to-[#0A1220] hover:from-[#112038] hover:to-[#0D1829] border border-cyan-400/40 hover:border-cyan-300 shadow-[0_0_25px_rgba(0,229,255,0.15)] transition-all cursor-pointer ${className}`}
          title="فحص وجلب آخر إصدار رسمي من التطبيق"
        >
          <div className="flex items-center gap-3 text-right">
            <div className="relative p-2.5 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 group-hover:scale-105 transition-transform">
              <RefreshCw className={`w-4 h-4 ${isCheckingUpdates ? 'animate-spin text-cyan-400' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white font-tajawal">جلب وفحص آخر إصدار</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 border border-amber-400/30">
                  {currentVersion}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono">
                {isCheckingUpdates ? 'جاري الاتصال بـ GitHub...' : 'تحديث تلقائي مستمر ومزامنة سحابية'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-400/25 text-cyan-300 text-xs font-bold font-tajawal group-hover:bg-cyan-400/20 transition-all">
            <span>تحديث</span>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </button>

        <AppUpdateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  if (variant === 'compact') {
    return (
      <>
        <button
          onClick={() => setModalOpen(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 hover:border-cyan-400/60 text-cyan-300 text-xs font-tajawal font-bold transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.12)] ${className}`}
          title="فحص أحدث إصدار من تطبيق قبس"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdates ? 'animate-spin' : ''}`} />
          <span>تحديث التطبيق ({currentVersion})</span>
        </button>

        <AppUpdateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
      </>
    );
  }

  // Default: Navbar variant
  return (
    <>
      <button
        onClick={() => setModalOpen(true)}
        className={`relative flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-tajawal text-slate-200 bg-white/5 hover:bg-cyan-500/15 border border-white/10 hover:border-cyan-400/40 transition-all cursor-pointer group shadow-[0_0_15px_rgba(0,0,0,0.3)] ${className}`}
        title="فحص وجلب آخر إصدار من تطبيق قبس لنظام أندرويد"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
        </span>
        <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isCheckingUpdates ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
        <span className="hidden sm:inline font-bold">جلب آخر إصدار</span>
        <span className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 rounded-md">
          {currentVersion}
        </span>
      </button>

      <AppUpdateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};
