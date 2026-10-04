import React, { useState, useEffect } from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';

export const WebUpdateListener: React.FC = () => {
  const [hasNewWebVersion, setHasNewWebVersion] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [initialETag, setInitialETag] = useState<string | null>(null);

  useEffect(() => {
    // Only run in production / web environments
    if (typeof window === 'undefined') return;

    let isMounted = true;

    const checkWebVersion = async () => {
      try {
        const response = await fetch(window.location.href, {
          method: 'HEAD',
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        });

        const currentETag = response.headers.get('ETag') || response.headers.get('Last-Modified');
        if (!currentETag) return;

        if (initialETag === null) {
          setInitialETag(currentETag);
        } else if (currentETag !== initialETag && isMounted) {
          setHasNewWebVersion(true);
        }
      } catch (err) {
        // Silent fail on network errors
      }
    };

    // Check every 90 seconds
    const interval = setInterval(checkWebVersion, 90000);

    const handleFocus = () => {
      checkWebVersion();
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      isMounted = false;
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [initialETag]);

  const handleReload = () => {
    window.location.reload();
  };

  if (!hasNewWebVersion || dismissed) return null;

  return (
    <div className="fixed bottom-24 left-4 z-40 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-2xl bg-[#090E1A]/95 border border-cyan-400/50 p-4 shadow-[0_0_30px_rgba(0,229,255,0.25)] backdrop-blur-xl flex items-center justify-between gap-3 text-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-300">
            <Sparkles className="w-5 h-5 animate-spin" />
          </div>
          <div className="text-right">
            <h5 className="text-xs font-bold text-white font-tajawal">
              تحديث جديد متاح للموقع!
            </h5>
            <p className="text-[11px] text-slate-300">
              تم نشر نسخة أحدث على GitHub.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleReload}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-400 text-slate-950 text-xs font-bold font-tajawal hover:bg-cyan-300 transition-all cursor-pointer shadow-md"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>تحديث الآن</span>
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
            aria-label="إغلاق"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
