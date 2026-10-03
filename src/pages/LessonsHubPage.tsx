import React, { useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Radio, 
  Search, 
  Play, 
  Clock, 
  Download, 
  Share2, 
  SlidersHorizontal, 
  Video, 
  Headphones, 
  Sparkles,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { LESSONS_DATA, PODCASTS_DATA, SCHOLARS_DATA } from '../data/mockData';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useUplink } from '../context/UplinkContext';
import { SmartAppBanner } from '../components/SmartAppBanner';
import { LessonCategory } from '../types';

export const LessonsHubPage: React.FC = () => {
  const { lessons } = useUplink();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScholar, setSelectedScholar] = useState<string>('all');
  const [selectedFormat, setSelectedFormat] = useState<'all' | 'audio' | 'video'>('all');
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'duration'>('recent');

  const { playTrack, currentTrack, isPlaying, downloadAudioFile } = useAudioPlayer();

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams(tab === 'all' ? {} : { tab });
  };

  // Filter lessons and podcasts
  const filteredContent = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    // Collect both lessons and podcasts
    const lessonsList = lessons.map(l => ({ ...l, itemType: 'lesson' as const }));
    const podcastsList = PODCASTS_DATA.map(p => ({
      ...p,
      itemType: 'podcast' as const,
      category: 'fikr' as LessonCategory,
      categoryLabel: 'بودكاست فكري',
      series: `بودكاست قبس · م${p.season}`,
      type: 'audio' as const,
      references: []
    }));

    let combined = activeTab === 'podcast'
      ? podcastsList
      : activeTab === 'all'
      ? [...lessonsList, ...podcastsList]
      : lessonsList.filter(l => l.category === activeTab);

    // Filter by query
    if (q) {
      combined = combined.filter(item =>
        item.title.toLowerCase().includes(q) ||
        item.series.toLowerCase().includes(q) ||
        item.scholar.name.toLowerCase().includes(q) ||
        item.topics.some(t => t.toLowerCase().includes(q))
      );
    }

    // Filter by scholar
    if (selectedScholar !== 'all') {
      combined = combined.filter(item => item.scholarId === selectedScholar);
    }

    // Filter by format
    if (selectedFormat !== 'all') {
      combined = combined.filter(item => item.type === selectedFormat);
    }

    // Sort
    if (sortBy === 'popular') {
      combined.sort((a, b) => b.playsCount - a.playsCount);
    } else if (sortBy === 'duration') {
      combined.sort((a, b) => b.durationSeconds - a.durationSeconds);
    }

    return combined;
  }, [activeTab, searchQuery, selectedScholar, selectedFormat, sortBy]);

  const categories = [
    { id: 'all', label: 'كافة المواد' },
    { id: 'tafsir', label: 'تفسير وتدبر' },
    { id: 'fiqh', label: 'فقه وأصول' },
    { id: 'tazkiyah', label: 'تزكية وسلوك' },
    { id: 'hadith', label: 'حديث وأثر' },
    { id: 'podcast', label: 'بودكاست قبس الفكري' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      
      {/* Smart App Banner */}
      <SmartAppBanner 
        contentType="lesson" 
        contentId="hub" 
        title="مركز الدروس والبودكاست" 
      />

      {/* Page Header */}
      <div className="space-y-3 border-b border-white/10 pb-6">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
          <Radio className="w-4 h-4 text-cyan-400" />
          <span>MEDIA & LESSONS HUB · مركز المحتوى المعرفي</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-tajawal">
          مركز الدروس والمحاضرات والبودكاست
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          استمع وشاهد وشغّل مباشرة في المتصفح أو التطبيق عبر ميزة التوجيه بالروابط العميقة (Deep Linking). جميع المواد مدعومة بالتفريغ النصي والمراجع العلمية.
        </p>
      </div>

      {/* Tabs Filter Bar (Zero-Pill interactive segmented controls) */}
      <div className="flex items-center gap-1.5 p-1.5 rounded-xl bg-white/5 border border-white/10 overflow-x-auto no-scrollbar">
        {categories.map((cat) => {
          const isActive = activeTab === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleTabChange(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Filter and Search Controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 p-4 rounded-2xl bg-[#090E1A] border border-white/10">
        
        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث بالعنوان، السلسلة، المحور، أو اسم المحاضر..."
            className="w-full pl-3 pr-10 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
          />
        </div>

        {/* Scholar Selector */}
        <div className="md:col-span-3">
          <select
            value={selectedScholar}
            onChange={(e) => setSelectedScholar(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="all">كافة العلماء والمحاضرين</option>
            {SCHOLARS_DATA.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
        </div>

        {/* Format Selector */}
        <div className="md:col-span-2">
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="all">جميع الصيغ (صوت وفيديو)</option>
            <option value="audio">صوتي فقط (Audio)</option>
            <option value="video">مرئي (Video)</option>
          </select>
        </div>

        {/* Sort Selector */}
        <div className="md:col-span-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-slate-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="recent">الأحدث نشراً</option>
            <option value="popular">الأكثر استماعاً</option>
            <option value="duration">المدة الأطول</option>
          </select>
        </div>

      </div>

      {/* Results Count & Deep Link Notice */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
        <div>
          تم العثور على <span className="text-cyan-400 font-bold">{filteredContent.length}</span> مادة
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-amber-400/90">
          <Sparkles className="w-3.5 h-3.5" />
          <span>كل درس يدعم الفتح التلقائي في تطبيق قبس بمجرد النقر</span>
        </div>
      </div>

      {/* Grid of Lessons & Podcasts */}
      {filteredContent.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white/5 border border-white/10 space-y-3">
          <Radio className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="text-base font-bold text-white">لم يتم العثور على مواد مطابقة</h4>
          <p className="text-xs text-slate-400">جرب تغيير كلمات البحث أو إعادة ضبط خيارات التصفية.</p>
          <button
            onClick={() => {
              setActiveTab('all');
              setSearchQuery('');
              setSelectedScholar('all');
              setSelectedFormat('all');
            }}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
          >
            إعادة ضبط التصفية
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContent.map((item) => {
            const isCurrentPlaying = currentTrack?.id === item.id && isPlaying;
            const targetUrl = item.itemType === 'lesson' ? `/lesson/${item.id}` : `/podcast/${item.id}`;

            return (
              <div
                key={item.id}
                className="rounded-2xl bg-[#090E1A] border border-white/10 hover:border-cyan-500/40 p-4 transition-all duration-300 group flex flex-col justify-between shadow-lg relative"
              >
                <div>
                  
                  {/* Thumbnail / Media banner */}
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/10 bg-slate-900">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Category text badge */}
                    <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-lg bg-black/75 backdrop-blur-md text-[11px] font-mono text-cyan-300 border border-white/10">
                      {item.categoryLabel}
                    </div>

                    {/* Media type icon */}
                    <div className="absolute top-2 left-2 p-1.5 rounded-lg bg-black/75 backdrop-blur-md text-slate-300 border border-white/10">
                      {item.type === 'video' ? (
                        <Video className="w-3.5 h-3.5 text-amber-400" />
                      ) : (
                        <Headphones className="w-3.5 h-3.5 text-cyan-400" />
                      )}
                    </div>

                    {/* Duration */}
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-[11px] font-mono text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {item.duration}
                    </div>

                    {/* Play Overlay Button */}
                    <button
                      onClick={() => playTrack({
                        id: item.id,
                        title: item.title,
                        seriesOrHost: item.series,
                        scholarName: item.scholar.name,
                        coverImage: item.coverImage,
                        audioUrl: item.audioUrl,
                        durationSeconds: item.durationSeconds,
                        contentType: item.itemType
                      })}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer"
                      aria-label="تشغيل سريع"
                    >
                      <div className="w-12 h-12 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-slate-950 mr-0.5" />
                      </div>
                    </button>
                  </div>

                  {/* Series & Title */}
                  <div className="text-[11px] text-amber-400 font-medium mb-1">
                    {item.series}
                  </div>

                  <Link
                    to={targetUrl}
                    className="text-sm font-bold text-white hover:text-cyan-300 line-clamp-2 transition-colors block"
                  >
                    {item.title}
                  </Link>

                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Topics tag previews (clean typography, no pill slop) */}
                  <div className="flex flex-wrap items-center gap-1.5 mt-3 text-[11px] text-slate-500">
                    {item.topics.slice(0, 2).map((topic, idx) => (
                      <span key={idx} className="text-slate-400">
                        #{topic.slice(0, 25)}...
                      </span>
                    ))}
                  </div>

                </div>

                {/* Card Footer: Scholar info & Action buttons */}
                <div className="pt-4 border-t border-white/10 mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Link
                      to={`/scholar/${item.scholarId}`}
                      className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                    >
                      <img
                        src={item.scholar.avatar}
                        alt={item.scholar.name}
                        className="w-6 h-6 rounded-full object-cover border border-white/20"
                        referrerPolicy="no-referrer"
                      />
                      <span className="text-xs text-slate-300 font-medium truncate max-w-[140px]">
                        {item.scholar.name}
                      </span>
                    </Link>

                    <span className="text-[10px] font-mono text-slate-500">
                      {item.downloadSize}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => playTrack({
                        id: item.id,
                        title: item.title,
                        seriesOrHost: item.series,
                        scholarName: item.scholar.name,
                        coverImage: item.coverImage,
                        audioUrl: item.audioUrl,
                        durationSeconds: item.durationSeconds,
                        contentType: item.itemType
                      })}
                      className={`flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        isCurrentPlaying
                          ? 'bg-amber-400 text-slate-950 shadow-[0_0_15px_rgba(255,215,0,0.3)]'
                          : 'bg-cyan-400 hover:bg-cyan-300 text-slate-950'
                      }`}
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>{isCurrentPlaying ? 'استماع حالي' : 'استماع'}</span>
                    </button>

                    <Link
                      to={targetUrl}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                      title="عرض التفاصيل والتفريغ"
                    >
                      التفاصيل
                    </Link>

                    <button
                      onClick={() => downloadAudioFile({
                        id: item.id,
                        title: item.title,
                        seriesOrHost: item.series,
                        scholarName: item.scholar.name,
                        coverImage: item.coverImage,
                        audioUrl: item.audioUrl,
                        durationSeconds: item.durationSeconds,
                        contentType: item.itemType
                      })}
                      className="p-2 rounded-xl text-slate-400 hover:text-amber-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                      title="تحميل الملف الصوتي (MP3)"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
