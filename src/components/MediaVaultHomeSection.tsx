import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Film, 
  Headphones, 
  Image as ImageIcon, 
  ChevronLeft, 
  Plus, 
  Sparkles, 
  DownloadCloud,
  Radio,
  Lock
} from 'lucide-react';
import { useMediaVault } from '../context/MediaVaultContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { MediaVaultCard } from './MediaVaultCard';

export const MediaVaultHomeSection: React.FC = () => {
  const { mediaItems, openUploadModal, stats } = useMediaVault();
  const { isAdmin, openAuthModal } = useAdminAuth();

  const handleUploadClick = () => {
    if (!isAdmin) {
      openAuthModal(() => openUploadModal());
    } else {
      openUploadModal();
    }
  };

  // Show top 3 featured media items
  const featuredMedia = mediaItems.slice(0, 3);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            <span>QABAS MEDIA VAULT · أحدث المرئيات والصوتيات والتصاميم</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-extrabold text-white font-tajawal">
            استوديو قبس والوسائط المتعددة
          </h2>
          <p className="text-xs text-slate-400">
            تلاوات مسجلة بدقة 320kbps، مقاطع مونتاج وشروحات 1080p، وبطاقات دعوية 4K جاهزة للتحميل والمشاركة
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleUploadClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>{isAdmin ? 'رفع وسائط' : 'رفع وسائط (مشرف)'}</span>
          </button>

          <Link
            to="/media-vault"
            className="flex items-center gap-1 text-xs font-semibold text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 px-3.5 py-2 rounded-xl border border-cyan-400/30 transition-all"
          >
            <span>استعراض الكل ({stats.totalItems})</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Cards Grid or Clean Empty State */}
      {featuredMedia.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredMedia.map((item) => (
            <MediaVaultCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        <div className="p-8 sm:p-12 text-center rounded-3xl bg-[#090E1A] border border-dashed border-cyan-500/30 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
            <Film className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white font-tajawal">
            مستودع الوسائط جاهز لاستقبال محتواك
          </h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            تم تفريغ البيانات الافتراضية بنجاح؛ يمكنك الآن رفع تصاميمك وبطاقاتك الدعوية أو تلاواتك الصوتية لتظهر هنا فوراً ومزامنتها عبر السحابة.
          </p>
          <button
            onClick={handleUploadClick}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 transition-all cursor-pointer shadow-lg mt-2"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>رفع أول وسيط الآن</span>
          </button>
        </div>
      )}

      {/* Quick Telemetry Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0C1527] to-[#0A101D] border border-cyan-500/20 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
        <div className="flex items-center gap-4 text-slate-300">
          <span className="flex items-center gap-1.5">
            <Film className="w-3.5 h-3.5 text-amber-400" />
            <span>{stats.totalVideo} فيديو عالي الدقة</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <Headphones className="w-3.5 h-3.5 text-cyan-400" />
            <span>{stats.totalAudio} مادة صوتية واستوديو</span>
          </span>
          <span>•</span>
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{stats.totalImages} بطاقة وتصميم 4K</span>
          </span>
        </div>

        <Link
          to="/media-vault"
          className="text-cyan-300 hover:text-cyan-200 font-bold flex items-center gap-1"
        >
          <span>دخول المستودع الكامل مع الفلاتر والبحث المتقدم</span>
          <ChevronLeft className="w-3.5 h-3.5" />
        </Link>
      </div>

    </section>
  );
};
