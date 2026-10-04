import React from 'react';
import { 
  GitBranch, 
  GitCommit, 
  Clock, 
  CheckCircle2, 
  ExternalLink, 
  RefreshCw, 
  Terminal, 
  Cpu, 
  ShieldCheck, 
  AlertCircle, 
  Workflow
} from 'lucide-react';
import { useUplink } from '../context/UplinkContext';
import { GITHUB_WORKFLOW_URL } from '../services/githubCiService';

interface AndroidCiPipelineCardProps {
  variant?: 'full' | 'compact' | 'modal';
  className?: string;
}

export const AndroidCiPipelineCard: React.FC<AndroidCiPipelineCardProps> = ({ 
  variant = 'full', 
  className = '' 
}) => {
  const { ciRun, isSyncingCi, syncCiNow } = useUplink();

  if (!ciRun) return null;

  const isSuccess = ciRun.conclusion === 'success';
  const isInProgress = ciRun.status === 'in_progress' || ciRun.status === 'queued';

  if (variant === 'compact') {
    return (
      <a
        href={ciRun.htmlUrl || GITHUB_WORKFLOW_URL}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono transition-all group ${className}`}
        title="متابعة خط البناء المستمر Android CI على GitHub"
      >
        <span className="relative flex h-2 w-2">
          {isInProgress ? (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          ) : (
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
          )}
        </span>
        <span className="text-slate-300 group-hover:text-white flex items-center gap-1">
          <Workflow className="w-3.5 h-3.5 text-cyan-400" />
          <span>Android CI #{ciRun.runNumber}</span>
        </span>
        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
          {isInProgress ? 'جارٍ البناء' : 'ناجح'}
        </span>
        <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-300" />
      </a>
    );
  }

  return (
    <div className={`rounded-2xl bg-[#090E1A]/95 border border-cyan-500/30 p-5 space-y-4 shadow-[0_0_30px_rgba(0,229,255,0.08)] relative overflow-hidden backdrop-blur-md ${className}`}>
      {/* Ambient glow */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-[60px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-400/30 text-cyan-300">
            <Workflow className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-xs sm:text-sm font-bold text-white font-tajawal">
                خط الأتمتة والبناء المستمر (Android CI)
              </h4>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                isSuccess 
                  ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' 
                  : isInProgress
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30 animate-pulse'
                  : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
              }`}>
                {isSuccess ? '✓ البناء ناجح وموثق' : isInProgress ? '⚙ جاري البناء...' : 'غير مكتمل'}
              </span>
            </div>
            <p className="text-[11px] font-mono text-slate-400">
              android-ci.yml · مستودع alippappa7-maker/qabas_studio
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => syncCiNow()}
            disabled={isSyncingCi}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 text-xs transition-colors cursor-pointer"
            title="تحديث بيانات الـ CI الآن"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncingCi ? 'animate-spin text-cyan-400' : ''}`} />
          </button>

          <a
            href={ciRun.htmlUrl || GITHUB_WORKFLOW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold transition-all"
          >
            <span>فتح صفحة Workflow</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {/* Telemetry Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
        {/* Run Number */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Terminal className="w-3 h-3 text-amber-400" />
            <span>رقم التشغيلة (Run)</span>
          </div>
          <div className="text-white font-bold">
            #{ciRun.runNumber}
          </div>
          <div className="text-[10px] text-cyan-300 truncate">
            {ciRun.branch} branch
          </div>
        </div>

        {/* Duration */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
          <div className="text-[10px] text-slate-400 flex items-center gap-1">
            <Clock className="w-3 h-3 text-cyan-400" />
            <span>مدة البناء</span>
          </div>
          <div className="text-white font-bold">
            {ciRun.durationFormatted}
          </div>
          <div className="text-[10px] text-emerald-400">
            Gradle AssembleRelease
          </div>
        </div>

        {/* Last Commit */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1 col-span-2">
          <div className="text-[10px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <GitCommit className="w-3 h-3 text-purple-400" />
              <span>آخر Commit معتمد:</span>
            </span>
            <span className="text-amber-300 font-bold">{ciRun.commitShortSha}</span>
          </div>
          <div className="text-slate-200 text-[11px] truncate font-sans font-medium" title={ciRun.commitMessage}>
            {ciRun.commitMessage}
          </div>
          <div className="text-[10px] text-slate-500">
            تاريخ الإنجاز: {ciRun.formattedDate} ({ciRun.formattedTime})
          </div>
        </div>
      </div>

      {/* Pipeline Status Summary */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <img 
            src={ciRun.actorAvatar} 
            alt={ciRun.actorLogin}
            className="w-4 h-4 rounded-full border border-cyan-400/40"
            onError={(e) => { (e.target as any).style.display = 'none'; }}
          />
          <span>المنفذ: <strong className="text-white">{ciRun.actorLogin}</strong></span>
        </div>

        <div className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>مرتبط ومحدث تلقائياً مع GitHub Actions</span>
        </div>
      </div>
    </div>
  );
};
