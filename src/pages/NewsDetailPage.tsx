import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Newspaper, Clock, ArrowRight, Share2, Check, Copy, Tag, Sparkles, BookOpen, Maximize2 } from 'lucide-react';
import { NEWS_DATA } from '../data/mockData';
import { useReadingMode } from '../context/ReadingModeContext';
import { ReadingModeToolbar } from '../components/ReadingModeToolbar';

export const NewsDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [copiedLink, setCopiedLink] = useState(false);
  const { isReadingMode, enterReadingMode, fontSize, lineHeight, theme } = useReadingMode();

  const article = NEWS_DATA.find(n => n.slug === slug || n.id === slug);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">البيان الإخباري غير موجود</h2>
        <p className="text-sm text-slate-400">ربما تم حذف الخبر أو نقل رابطه.</p>
        <Link
          to="/news"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 hover:bg-emerald-300"
        >
          العودة لبوابة الأخبار
        </Link>
      </div>
    );
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const related = NEWS_DATA.filter(n => n.id !== article.id).slice(0, 2);

  const getReadingTextColor = () => {
    if (!isReadingMode) return 'text-slate-200';
    if (theme === 'sepia') return 'text-[#362B1D]';
    return 'text-slate-100';
  };

  return (
    <>
      {/* Floating Toolbar when in Reading Mode */}
      <ReadingModeToolbar title={article.title} />

      <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isReadingMode 
          ? 'max-w-4xl pt-16 pb-20' 
          : 'max-w-4xl py-8 sm:py-16 space-y-10'
      }`}>
        
        {/* Breadcrumb & Reading Mode Trigger (hidden during active reading mode) */}
        {!isReadingMode && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
              <span>/</span>
              <Link to="/news" className="hover:text-white transition-colors">بوابة الأخبار والبيانات</Link>
              <span>/</span>
              <span className="text-emerald-400 truncate max-w-xs">{article.title}</span>
            </div>

            {/* Reading Mode Button */}
            <button
              onClick={enterReadingMode}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 hover:border-emerald-400 text-emerald-300 text-xs font-bold font-tajawal transition-all cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.15)] group"
              title="تفعيل وضع القراءة المريح وإخفاء العناصر غير الضرورية"
            >
              <BookOpen className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>وضع القراءة</span>
              <span className="text-[10px] font-mono px-1 rounded bg-emerald-950/60 border border-emerald-500/30">
                Focus
              </span>
            </button>
          </div>
        )}

        {/* Article Header */}
        <div className={`space-y-4 text-right ${isReadingMode ? 'mb-8' : ''}`}>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{article.categoryLabel}</span>
          </div>

          <h1 className={`font-extrabold font-tajawal leading-tight transition-all ${
            isReadingMode 
              ? 'text-3xl sm:text-5xl text-white' 
              : 'text-2xl sm:text-4xl text-white'
          }`}>
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-white/10 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={article.author.avatar}
                alt={article.author.name}
                className="w-10 h-10 rounded-full object-cover border border-white/20"
                referrerPolicy="no-referrer"
              />
              <div>
                <div className="font-bold text-white">{article.author.name}</div>
                <div className="text-slate-400 text-[11px]">{article.author.role}</div>
              </div>
            </div>

            <div className="flex items-center gap-3 font-mono text-slate-400">
              <span>تاريخ النشر: {article.publishedAt}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-cyan-400" />
                {article.readTime}
              </span>
            </div>
          </div>
        </div>

        {/* Cover Image (optional/compact in reading mode) */}
        {!isReadingMode && (
          <div className="relative aspect-video rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img
              src={article.coverImage}
              alt={article.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        )}

        {/* Article Body Content with Dynamic Typography */}
        <div 
          className={`space-y-8 font-tajawal transition-all duration-300 ${
            isReadingMode 
              ? (theme === 'sepia' ? 'text-[#E8DCC4]' : 'text-slate-100') 
              : 'text-slate-200'
          }`}
          style={{
            fontSize: isReadingMode ? `${fontSize}px` : '16px',
            lineHeight: isReadingMode ? lineHeight : 1.9,
          }}
        >
          {article.content.map((paragraph, idx) => (
            <p key={idx} className="leading-relaxed selection:bg-emerald-500/30 selection:text-emerald-200">
              {paragraph}
            </p>
          ))}
        </div>

        {/* Tags & Share Strip */}
        <div className="pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            {article.tags.map((tag, i) => (
              <span 
                key={i} 
                className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-lg"
              >
                #{tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {!isReadingMode && (
              <button
                onClick={enterReadingMode}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>وضع القراءة</span>
              </button>
            )}

            {/* Share Button */}
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedLink ? 'تم نسخ الرابط' : 'نسخ رابط الخبر'}</span>
            </button>
          </div>

        </div>

        {/* Related News (hidden in reading mode to avoid distraction) */}
        {!isReadingMode && related.length > 0 && (
          <div className="space-y-4 pt-10 border-t border-white/10">
            <h3 className="text-lg font-bold text-white font-tajawal">
              بيانات وأخبار أخرى ذات صلة
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {related.map((rel) => (
                <Link
                  key={rel.id}
                  to={`/news/${rel.slug}`}
                  className="p-4 rounded-2xl bg-[#090E1A] border border-white/10 hover:border-emerald-500/40 transition-colors block group"
                >
                  <div className="text-[11px] font-mono text-emerald-400 mb-1">{rel.publishedAt}</div>
                  <h4 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                    {rel.title}
                  </h4>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                    {rel.excerpt}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
};
