import React from 'react';
import { 
  Film, 
  Headphones, 
  Image as ImageIcon, 
  Search, 
  Plus, 
  SlidersHorizontal, 
  Sparkles, 
  Radio, 
  DownloadCloud, 
  Layers, 
  Eye, 
  Flame,
  ArrowUpDown,
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import { useMediaVault } from '../context/MediaVaultContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { MediaVaultCard } from '../components/MediaVaultCard';
import { MediaType, MediaCategory } from '../types';

export const MediaVaultPage: React.FC = () => {
  const { 
    filteredItems, 
    activeTypeFilter, 
    setActiveTypeFilter,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    openUploadModal,
    stats
  } = useMediaVault();

  const { isAdmin, openAuthModal } = useAdminAuth();

  const handleUploadClick = () => {
    if (!isAdmin) {
      openAuthModal(() => openUploadModal());
    } else {
      openUploadModal();
    }
  };

  const categories: { id: 'all' | MediaCategory; label: string }[] = [
    { id: 'all', label: 'جميع التصنيفات' },
    { id: 'quran', label: '📖 تلاوات قرآنية' },
    { id: 'video_lectures', label: '🎬 شروحات ودروس مرئية' },
    { id: 'daawah_shorts', label: '⚡ مقاطع دعوية وفيديو قصير' },
    { id: 'cards_designs', label: '🎨 بطاقات وتصاميم دعوية' },
    { id: 'wallpapers', label: '🏛️ خلفيات ومخطوطات إسلامية' },
    { id: 'sound_fx', label: '🔊 مؤثرات واستوديو قبس' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 space-y-10">
      
      {/* 1. Spatial HUD Header & Telemetry Metrics */}
      <div className="relative rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-[#0B132B]/90 via-[#0A1020]/90 to-[#060A12]/95 border border-cyan-500/30 overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.08)]">
        
        {/* Ambient Glow & Grid Backdrop */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          
          <div className="space-y-3 text-right max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
              <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
              <span>QABAS MEDIA VAULT & CREATIVE STUDIO · مركز الوسائط والاستوديو</span>
            </div>

            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white font-tajawal tracking-tight">
              استوديو ومستودع الوسائط المتعددة
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              منصة سحابية متكاملة لتصفح ورفع وتحميل المرئيات عالية الدقة (1080p/4K)، التلاوات والمحاضرات الصوتية النقية (320kbps)، والبطاقات والتصاميم الدعوية المخصصة للمونتاج والنشر.
            </p>
          </div>

          {/* Action Trigger Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
            <button
              onClick={handleUploadClick}
              className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400 hover:from-cyan-300 hover:to-amber-300 transition-all shadow-[0_0_30px_rgba(0,229,255,0.35)] hover:scale-[1.02] active:scale-95 cursor-pointer"
            >
              <Plus className="w-5 h-5 stroke-[2.5]" />
              <span>{isAdmin ? 'رفع وسائط جديدة (فيديو / صوت / صور)' : 'رفع وسائط جديدة (بوابة المشرف)'}</span>
            </button>
          </div>

        </div>

        {/* Live Metrics HUD Counter Bar */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-white/10 font-mono text-xs">
          
          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Film className="w-3.5 h-3.5 text-amber-400" />
              <span>المرئيات والفيديو</span>
            </span>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalVideo}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Headphones className="w-3.5 h-3.5 text-cyan-400" />
              <span>الصوتيات والتلاوات</span>
            </span>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalAudio}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-400" />
              <span>البطاقات والتصاميم</span>
            </span>
            <div className="text-xl sm:text-2xl font-bold text-white">{stats.totalImages}</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-black/40 border border-white/5 space-y-1">
            <span className="text-slate-400 flex items-center gap-1.5">
              <DownloadCloud className="w-3.5 h-3.5 text-amber-300" />
              <span>إجمالي التحميلات</span>
            </span>
            <div className="text-xl sm:text-2xl font-bold text-amber-300">{stats.totalDownloads}</div>
          </div>

        </div>

      </div>

      {/* 2. Interactive Control Bar (Search, Type Switcher, Category, Sorting) */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#090E1A]/80 border border-white/10 backdrop-blur-xl space-y-4">
        
        {/* Top Controls Row: Type Filter Switcher + Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Media Type Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-black/50 border border-white/10 overflow-x-auto text-xs font-mono">
            <button
              onClick={() => setActiveTypeFilter('all')}
              className={`px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTypeFilter === 'all'
                  ? 'bg-white/15 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الكل ({stats.totalItems})
            </button>

            <button
              onClick={() => setActiveTypeFilter('video')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTypeFilter === 'video'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" />
              <span>فيديو ({stats.totalVideo})</span>
            </button>

            <button
              onClick={() => setActiveTypeFilter('audio')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTypeFilter === 'audio'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>صوتيات ({stats.totalAudio})</span>
            </button>

            <button
              onClick={() => setActiveTypeFilter('image')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg font-bold transition-all cursor-pointer whitespace-nowrap ${
                activeTypeFilter === 'image'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>تصاميم ({stats.totalImages})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالعنوان، اسم القارئ، الوسم..."
              className="w-full bg-black/60 border border-white/10 focus:border-cyan-400 rounded-xl pr-10 pl-4 py-2.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
              >
                ✕
              </button>
            )}
          </div>

        </div>

        {/* Bottom Controls Row: Category Dropdown & Sort By */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5 text-xs font-mono">
          
          {/* Category Filter Pills (Horizontal scrollable) */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 max-w-full">
            <span className="text-slate-500 whitespace-nowrap">التصنيف:</span>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-xs ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                    : 'bg-black/30 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Sort By Switcher */}
          <div className="flex items-center gap-2 self-end">
            <span className="text-slate-500 flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>ترتيب حسب:</span>
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-black/60 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-cyan-300 outline-none cursor-pointer"
            >
              <option value="latest">الأحدث تاريخاً</option>
              <option value="popular">الأكثر مشاهدة واستماعاً</option>
              <option value="downloads">الأكثر تحميلاً</option>
              <option value="size">حجم الملف</option>
            </select>
          </div>

        </div>

      </div>

      {/* 3. Media Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredItems.map((item) => (
            <MediaVaultCard key={item.id} item={item} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-3xl bg-[#090E1A]/60 border border-white/10 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400">
            <FolderOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">لا توجد وسائط تطابق معايير البحث</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            جرّب تغيير فلاتر التصنيف أو مسح نص البحث للاطلاع على كافة المواد المتاحة في الاستوديو.
          </p>
          <button
            onClick={() => {
              setActiveTypeFilter('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 transition-all cursor-pointer"
          >
            إعادة تعيين الفلاتر
          </button>
        </div>
      )}

    </div>
  );
};
