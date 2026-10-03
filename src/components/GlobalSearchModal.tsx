import React, { useState, useEffect } from 'react';
import { Search, X, Radio, Newspaper, Users, Layers, ExternalLink, ArrowRight, Film } from 'lucide-react';
import { LESSONS_DATA, PODCASTS_DATA, SCHOLARS_DATA, NEWS_DATA, APP_RELEASES_DATA } from '../data/mockData';
import { useMediaVault } from '../context/MediaVaultContext';
import { useNavigate } from 'react-router-dom';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { mediaItems, openViewer } = useMediaVault();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // Open triggered by parent
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const filteredLessons = q 
    ? LESSONS_DATA.filter(l => 
        l.title.toLowerCase().includes(q) || 
        l.series.toLowerCase().includes(q) || 
        l.scholar.name.toLowerCase().includes(q) ||
        l.topics.some(t => t.toLowerCase().includes(q))
      )
    : LESSONS_DATA.slice(0, 3);

  const filteredPodcasts = q
    ? PODCASTS_DATA.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.scholar.name.toLowerCase().includes(q)
      )
    : PODCASTS_DATA.slice(0, 2);

  const filteredScholars = q
    ? SCHOLARS_DATA.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.specialization.toLowerCase().includes(q)
      )
    : SCHOLARS_DATA.slice(0, 2);

  const filteredNews = q
    ? NEWS_DATA.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      )
    : NEWS_DATA.slice(0, 2);

  const filteredMedia = q
    ? mediaItems.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.authorName.toLowerCase().includes(q) ||
        m.tags.some(t => t.toLowerCase().includes(q))
      )
    : mediaItems.slice(0, 2);

  const handleSelect = (url: string) => {
    navigate(url);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-[#090E1A] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,229,255,0.15)] overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10 bg-white/5">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث في الدروس، الحلقات، العلماء، الأخبار، أو إصدارات التطبيق..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none"
            autoFocus
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white text-xs px-2 py-1 rounded bg-white/5"
            >
              مسح
            </button>
          )}
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 overflow-y-auto space-y-6">
          
          {/* Lessons & Audio */}
          {filteredLessons.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono mb-2">
                <Radio className="w-3.5 h-3.5" />
                <span>الدروس والمحاضرات ({filteredLessons.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredLessons.map((lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => handleSelect(`/lesson/${lesson.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-cyan-500/20 text-right group transition-all"
                  >
                    <div className="min-w-0">
                      <h5 className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 truncate">
                        {lesson.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {lesson.scholar.name} · {lesson.series} · {lesson.duration}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Podcasts */}
          {filteredPodcasts.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono mb-2">
                <Radio className="w-3.5 h-3.5" />
                <span>بودكاست قبس الفكري ({filteredPodcasts.length})</span>
              </div>
              <div className="space-y-1.5">
                {filteredPodcasts.map((pod) => (
                  <button
                    key={pod.id}
                    onClick={() => handleSelect(`/podcast/${pod.id}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-cyan-500/20 text-right group transition-all"
                  >
                    <div className="min-w-0">
                      <h5 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 truncate">
                        {pod.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        الموسم {pod.season} · الحلقة {pod.episodeNumber} · {pod.scholar.name}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Scholars */}
          {filteredScholars.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono mb-2">
                <Users className="w-3.5 h-3.5" />
                <span>العلماء والمحاضرون</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredScholars.map((scholar) => (
                  <button
                    key={scholar.id}
                    onClick={() => handleSelect(`/scholar/${scholar.id}`)}
                    className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-emerald-500/30 text-right group transition-all"
                  >
                    <img 
                      src={scholar.avatar} 
                      alt={scholar.name}
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                      referrerPolicy="no-referrer"
                    />
                    <div className="min-w-0">
                      <h6 className="text-xs font-bold text-white group-hover:text-emerald-300 truncate">
                        {scholar.name}
                      </h6>
                      <p className="text-[10px] text-slate-400 truncate">
                        {scholar.specialization}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* News and Updates */}
          {filteredNews.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 font-mono mb-2">
                <Newspaper className="w-3.5 h-3.5 text-cyan-400" />
                <span>أحدث الأخبار والإعلانات</span>
              </div>
              <div className="space-y-1.5">
                {filteredNews.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => handleSelect(`/news/${article.slug}`)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-cyan-500/20 text-right group transition-all"
                  >
                    <div className="min-w-0">
                      <h5 className="text-xs sm:text-sm font-semibold text-white group-hover:text-cyan-300 truncate">
                        {article.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {article.publishedAt} · {article.readTime}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 shrink-0 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Media Vault & Creative Studio */}
          {filteredMedia.length > 0 && (
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 font-mono mb-2">
                <Film className="w-3.5 h-3.5 text-amber-400" />
                <span>استوديو ووسائط قبس (مرئيات، صوتيات، بطاقات)</span>
              </div>
              <div className="space-y-1.5">
                {filteredMedia.map((media) => (
                  <button
                    key={media.id}
                    onClick={() => {
                      onClose();
                      openViewer(media);
                    }}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-amber-500/20 text-right group transition-all"
                  >
                    <div className="min-w-0">
                      <h5 className="text-xs sm:text-sm font-semibold text-white group-hover:text-amber-300 truncate">
                        {media.title}
                      </h5>
                      <p className="text-[11px] text-slate-400 truncate mt-0.5">
                        {media.categoryLabel} · {media.authorName} · {media.format}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 shrink-0 transform rotate-180 group-hover:-translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Direct Link to App Repository */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => handleSelect('/app-repository')}
              className="w-full flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-amber-400/10 to-cyan-400/10 border border-amber-400/25 hover:border-amber-400/50 text-right transition-all"
            >
              <div className="flex items-center gap-2.5">
                <Layers className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-xs font-bold text-white">مستودع تطبيق قبس (v2.4.0 APK)</div>
                  <div className="text-[11px] text-slate-300">تحميل مباشر، فحص SHA-256، وسجل التغييرات الكامل</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-amber-400" />
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="p-3 bg-black/40 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <span>قبس · منظومة المعرفة الذكية</span>
          <div className="flex items-center gap-2">
            <span>إغلاق: <kbd className="px-1.5 py-0.5 bg-slate-800 rounded text-slate-300">ESC</kbd></span>
          </div>
        </div>
      </div>
    </div>
  );
};
