import React, { useState } from 'react';
import { Smartphone, ExternalLink, Download, X, Sparkles, Check, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SmartAppBannerProps {
  contentType?: 'lesson' | 'podcast' | 'scholar';
  contentId?: string;
  title?: string;
}

export const SmartAppBanner: React.FC<SmartAppBannerProps> = ({
  contentType = 'lesson',
  contentId = '101',
  title = 'المحتوى الحالي'
}) => {
  const [dismissed, setDismissed] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showDeepLinkModal, setShowDeepLinkModal] = useState(false);

  if (dismissed) return null;

  const deepLinkUri = `qabas://${contentType}/${contentId}`;

  const handleOpenApp = () => {
    // Attempt deep link navigation
    try {
      window.location.href = deepLinkUri;
    } catch {
      // In web fallback, show modal
    }
    setShowDeepLinkModal(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(deepLinkUri);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-[#0C1527] via-[#0A1220] to-[#0D1D2C] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.08)] mb-8">
        
        {/* Ambient background glows */}
        <div className="absolute top-0 right-1/4 w-40 h-40 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-10 w-48 h-48 bg-cyan-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          
          {/* Info zone */}
          <div className="flex items-start gap-3.5">
            <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 shrink-0 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-amber-400 font-bold text-xs flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  تجربة تطبيق قبس الذكية
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 font-mono">
                  Deep Linking Ready
                </span>
              </div>
              <h4 className="text-sm font-semibold text-white">
                هل تملك تطبيق قبس على هاتفك؟
              </h4>
              <p className="text-xs text-slate-300 mt-0.5">
                افتح المحتوى مباشرة في التطبيق لمتابعة الاستماع في الخلفية، والوصول الفوري لكامل ميزات الذكاء الاصطناعي دون اتصال.
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 justify-end">
            <button
              onClick={handleOpenApp}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-300 to-cyan-400 hover:from-cyan-200 hover:to-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)] transition-all transform active:scale-95 whitespace-nowrap cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>افتح في التطبيق</span>
            </button>

            <Link
              to="/app-repository"
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 hover:border-amber-400/50 transition-all whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>تحميل الـ APK</span>
            </Link>

            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              aria-label="إغلاق البانر"
              title="إغلاق التنبيه"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Deep Link Assistance Modal */}
      {showDeepLinkModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-md rounded-2xl bg-[#0B111E] border border-cyan-500/40 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">الربط العميق مع تطبيق قبس</h3>
              </div>
              <button 
                onClick={() => setShowDeepLinkModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              تم إرسال إشارة فتح التطبيق إلى نظام أندرويد عبر المسار العميق المخصص:
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-cyan-500/20 font-mono text-xs text-cyan-300">
              <span className="truncate">{deepLinkUri}</span>
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 transition-colors shrink-0 mr-2"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'تم النسخ' : 'نسخ المسار'}</span>
              </button>
            </div>

            <div className="rounded-xl p-3 bg-amber-400/10 border border-amber-400/25 text-amber-200 text-xs leading-relaxed">
              إذا لم يفتح التطبيق تلقائياً، يمكنك تثبيت تطبيق قبس مباشرة أو فتحه يدوياً من قائمة تطبيقاتك.
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Link
                to="/app-repository"
                onClick={() => setShowDeepLinkModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors"
              >
                تحميل حزمة الـ APK
              </Link>
              <button
                onClick={() => setShowDeepLinkModal(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-300 bg-white/10 hover:bg-white/15 transition-colors"
              >
                حسناً، فهمت
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
