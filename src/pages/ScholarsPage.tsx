import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Search, CheckCircle2, ChevronLeft, BookOpen, Radio } from 'lucide-react';
import { SCHOLARS_DATA } from '../data/mockData';

export const ScholarsPage: React.FC = () => {
  const [query, setQuery] = useState('');

  const filtered = SCHOLARS_DATA.filter(s =>
    s.name.toLowerCase().includes(query.toLowerCase()) ||
    s.specialization.toLowerCase().includes(query.toLowerCase()) ||
    s.bio.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-10">
      
      {/* Header */}
      <div className="space-y-3 border-b border-white/10 pb-6 text-right">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs">
          <Users className="w-4 h-4 text-cyan-400" />
          <span>VERIFIED SCHOLARS & LECTURERS · العلماء والمحاضرون</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-tajawal">
          هيئة العلماء والمحاضرين
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          نخبة من العلماء الأفاضل والمفكرين المعتمدين في تقديم السلاسل التفسيرية، والدروس الأصولية، والحوارات الفكرية المعاصرة على منصة قبس.
        </p>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="ابحث عن عالم، أستاذ، أو تخصص علمي..."
          className="w-full pl-3 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((scholar) => (
          <div
            key={scholar.id}
            className="rounded-2xl bg-[#090E1A] border border-white/10 hover:border-cyan-500/40 p-6 flex flex-col justify-between group transition-all shadow-lg"
          >
            <div className="flex flex-col items-center text-center">
              <div className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-amber-400/40 group-hover:border-cyan-400 transition-colors shadow-lg">
                <img
                  src={scholar.avatar}
                  alt={scholar.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                {scholar.verified && (
                  <div className="absolute bottom-0 right-0 w-6 h-6 bg-cyan-400 rounded-full flex items-center justify-center text-slate-950 border-2 border-slate-900 shadow">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}
              </div>

              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                {scholar.name}
              </h3>

              <div className="text-xs text-amber-400 font-mono mt-1">
                {scholar.specialization}
              </div>

              <p className="text-xs text-slate-400 line-clamp-3 mt-3 leading-relaxed text-right">
                {scholar.bio}
              </p>
            </div>

            <div className="pt-5 border-t border-white/10 mt-5 space-y-3">
              <div className="flex items-center justify-around text-xs font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  {scholar.lessonsCount} درس
                </span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Radio className="w-3.5 h-3.5 text-amber-400" />
                  {scholar.podcastsCount} حوارات
                </span>
              </div>

              <Link
                to={`/scholar/${scholar.id}`}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/5 hover:bg-cyan-500/20 hover:text-cyan-300 border border-white/10 hover:border-cyan-500/30 transition-all"
              >
                <span>استعراض المواد والملف</span>
                <ChevronLeft className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};
