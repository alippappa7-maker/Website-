import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Newspaper, Search, Clock, ChevronLeft, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useUplink } from '../context/UplinkContext';
import { NewsCategory } from '../types';

export const NewsPortalPage: React.FC = () => {
  const { news } = useUplink();
  const [selectedCat, setSelectedCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'كافة البيانات والأخبار' },
    { id: 'app_updates', label: 'تحديثات التطبيق' },
    { id: 'new_series', label: 'سلاسل ودروس جديدة' },
    { id: 'platform_tech', label: 'أخبار المنصة والتقنية' },
  ];

  const filteredNews = news.filter(item => {
    const matchCat = selectedCat === 'all' || item.category === selectedCat;
    const q = searchQuery.trim().toLowerCase();
    const matchQuery = !q || 
      item.title.toLowerCase().includes(q) || 
      item.excerpt.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchQuery;
  });

  const featured = news.find(n => n.isFeatured) || news[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      
      {/* Header */}
      <div className="space-y-3 border-b border-white/10 pb-6 text-right">
        <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs">
          <Newspaper className="w-4 h-4 text-emerald-400" />
          <span>OFFICIAL ANNOUNCEMENTS & NEWS PORTAL · بوابة الأخبار الرسمية</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-tajawal">
          بوابة الأخبار والبيانات الرسمية
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          التغطية الرسمية لكافة إصدارات تطبيق قبس، تدشين السلاسل العلمية والبودكاست، وبيانات الأمان وسياسات الخصوصية والشفافية.
        </p>
      </div>

      {/* Featured Headline Banner */}
      {featured && (
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0B1424] to-[#080D18] border border-cyan-500/30 p-6 sm:p-10 shadow-xl group">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 text-right">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs">
                <Sparkles className="w-3.5 h-3.5" />
                <span>البيان الرئيسي المميز · {featured.categoryLabel}</span>
              </div>

              <h2 className="text-xl sm:text-3xl font-extrabold text-white font-tajawal leading-snug">
                {featured.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {featured.excerpt}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-400 font-mono pt-2">
                <span>{featured.publishedAt}</span>
                <span>·</span>
                <span>وقت القراءة: {featured.readTime}</span>
              </div>

              <div className="pt-2">
                <Link
                  to={`/news/${featured.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-emerald-300 to-cyan-300 hover:from-emerald-200 hover:to-cyan-200 shadow-md transition-all cursor-pointer"
                >
                  <span>قراءة البيان كاملاً</span>
                  <ChevronLeft className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Controls & Filter Tabs */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/5 border border-white/10 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCat === cat.id
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث في الأخبار والبيانات..."
            className="w-full pl-3 pr-9 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
          />
        </div>

      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredNews.map((article) => (
          <Link
            key={article.id}
            to={`/news/${article.slug}`}
            className="rounded-2xl bg-[#090E1A] border border-white/10 hover:border-emerald-500/40 p-5 transition-all duration-300 group flex flex-col justify-between shadow-lg"
          >
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden mb-4 border border-white/10">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-[10px] font-mono text-emerald-300 border border-white/10">
                  {article.categoryLabel}
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mb-2">
                <span>{article.publishedAt}</span>
                <span>·</span>
                <span>{article.readTime}</span>
              </div>

              <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                {article.title}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                {article.excerpt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 mt-3 text-[11px] text-slate-500">
                {article.tags.map((tag, idx) => (
                  <span key={idx} className="text-slate-400">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs">
              <span className="text-slate-400 truncate max-w-[150px]">{article.author.name}</span>
              <span className="text-emerald-400 font-semibold group-hover:translate-x-[-4px] transition-transform">
                قراءة البيان ←
              </span>
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
};
