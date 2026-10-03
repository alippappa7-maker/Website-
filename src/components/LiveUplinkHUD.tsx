import React from 'react';
import { useUplink } from '../context/UplinkContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { 
  Radio, 
  Satellite, 
  Wifi, 
  Zap, 
  X, 
  CheckCircle2, 
  ArrowRight, 
  Sparkles, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const LiveUplinkHUD: React.FC = () => {
  const { activeUplink, notificationAlert, cancelUplink, dismissNotification } = useUplink();
  const { isPlayerVisible } = useAudioPlayer();

  // Position nicely above global audio player if active
  const bottomPositionClass = isPlayerVisible ? 'bottom-20 sm:bottom-22' : 'bottom-4 sm:bottom-6';

  return (
    <>
      {/* 1. Live Active Uplink Progress Card */}
      {activeUplink && (
        <div 
          className={`fixed left-4 sm:left-8 z-50 max-w-md w-[calc(100%-2rem)] sm:w-96 transition-all duration-300 animate-in slide-in-from-bottom-5 ${bottomPositionClass}`}
        >
          <div className="relative rounded-2xl bg-[#070D18]/95 border border-cyan-400/50 backdrop-blur-2xl p-4 shadow-[0_0_35px_rgba(0,229,255,0.25)] space-y-3">
            
            {/* Ambient Pulse Glow */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-400 rounded-full animate-ping" />
            
            {/* Top Telemetry Header */}
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-400/40">
                  <Satellite className="w-4 h-4 animate-spin [animation-duration:12s]" />
                </div>
                <div>
                  <span className="text-cyan-400 font-bold font-mono text-[11px] tracking-wider uppercase flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-cyan-300 animate-pulse" />
                    بث حي نشط · LIVE UPLINK
                  </span>
                  <div className="text-xs font-semibold text-white truncate max-w-[200px]">
                    {activeUplink.title}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-300 tabular-nums">
                  {activeUplink.progress}%
                </span>
                <button
                  onClick={cancelUplink}
                  className="p-1 rounded-md text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="إلغاء البث"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Glowing HUD Progress Bar */}
            <div className="relative w-full h-2 rounded-full bg-slate-800/80 overflow-hidden border border-white/10">
              <div 
                className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 transition-all duration-300 rounded-full shadow-[0_0_12px_#00E5FF]"
                style={{ width: `${activeUplink.progress}%` }}
              />
            </div>

            {/* Telemetry Stats (Speed, Uploaded, Target) */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-0.5">
              <div className="flex items-center gap-1 text-slate-300">
                <Zap className="w-3 h-3 text-amber-400" />
                <span>السرعة: {activeUplink.speed}</span>
              </div>
              <div>
                <span>{activeUplink.uploadedSize} / {activeUplink.totalSize}</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Completion Toast / Neon Notification */}
      {notificationAlert && (
        <div 
          className={`fixed left-4 sm:left-8 z-50 max-w-md w-[calc(100%-2rem)] sm:w-96 transition-all duration-300 animate-in slide-in-from-bottom-5 ${bottomPositionClass}`}
        >
          <div className="relative rounded-2xl bg-gradient-to-br from-[#0B1728] via-[#09111E] to-[#0D1E34] border border-emerald-400/50 backdrop-blur-2xl p-4 shadow-[0_0_40px_rgba(0,230,118,0.25)] space-y-3">
            
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <div className="text-[11px] font-mono text-emerald-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    {notificationAlert.title}
                  </div>
                  <h5 className="text-xs sm:text-sm font-bold text-white mt-0.5 leading-snug">
                    {notificationAlert.subtitle}
                  </h5>
                </div>
              </div>

              <button
                onClick={dismissNotification}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-white/10 text-xs">
              <span className="text-[11px] text-slate-400 font-mono">تحديث فوري للقوائم دون إعادة تحميل</span>
              <Link
                to={notificationAlert.link}
                onClick={dismissNotification}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-300 to-cyan-300 hover:from-emerald-200 transition-all cursor-pointer"
              >
                <span>معاينة المحتوى</span>
                <ArrowRight className="w-3.5 h-3.5 rotate-180" />
              </Link>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
