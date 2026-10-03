import React, { useState } from 'react';
import { 
  Star, 
  ThumbsUp, 
  CheckCircle2, 
  Smartphone, 
  MessageSquare, 
  Sparkles, 
  ShieldCheck, 
  Filter, 
  PlusCircle, 
  TrendingUp 
} from 'lucide-react';
import { useRating } from '../context/RatingContext';

export const CommunityReviewsSection: React.FC = () => {
  const { reviews, summary, openRatingModal, voteHelpful } = useRating();
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter(r => r.rating === filterRating);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2 text-right">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>نظام تقييم حقيقي ومفتوح 100% (Verifiable User Feedback)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-tajawal">
            تقييمات وآراء المستخدمين الفعلية
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            لا نستخدم تقييمات جاهزة أو أرقاماً وهمية؛ تُحسب الدرجة والمتوسط العام تلقائياً استناداً إلى تقييمات صناع المحتوى والمستخدمين الحقيقيين لتطبيق قبس.
          </p>
        </div>

        <button
          onClick={openRatingModal}
          className="flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all cursor-pointer whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          <span>أضف تقييمك الحقيقي الآن</span>
        </button>
      </div>

      {/* Aggregate Score & Distribution Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column: Big Real Score */}
        <div className="lg:col-span-4 rounded-3xl bg-gradient-to-br from-[#0C1527] to-[#080D1A] border border-cyan-500/30 p-6 sm:p-8 flex flex-col justify-between items-center text-center shadow-xl space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">
              المعدل العام الحقيقي
            </span>
            <div className="text-5xl sm:text-6xl font-black text-amber-300 font-mono tracking-tight drop-shadow-[0_0_20px_rgba(255,215,0,0.3)]">
              {summary.averageRating > 0 ? summary.averageRating.toFixed(1) : '—'}
            </div>
            <div className="flex items-center justify-center gap-1 py-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-5 h-5 ${
                    s <= Math.round(summary.averageRating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-xs text-slate-400 font-mono">
              استناداً إلى <span className="text-white font-bold">{summary.totalCount}</span> تقييم فعلي مسجل
            </p>
          </div>

          <div className="w-full pt-4 border-t border-white/10 text-xs text-slate-400 font-mono flex items-center justify-around">
            <span className="text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              حساب رياضي حي
            </span>
            <span>·</span>
            <span>شفافية تامة 100%</span>
          </div>
        </div>

        {/* Right Column: Star Breakdown Bars */}
        <div className="lg:col-span-8 rounded-3xl bg-[#090E1A] border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              <span>توزيع درجات التقييم بين المستخدمين:</span>
            </h4>
            <p className="text-xs text-slate-400">
              نسبة الرضا عن أداء التطبيق، ومحرر الفيديو، والمحتوى القرآني
            </p>
          </div>

          <div className="space-y-2.5 py-2">
            {[5, 4, 3, 2, 1].map((starNum) => {
              const count = summary.starsCount[starNum as keyof typeof summary.starsCount] || 0;
              const percentage = summary.totalCount > 0 ? Math.round((count / summary.totalCount) * 100) : 0;
              return (
                <div key={starNum} className="flex items-center gap-3 text-xs font-mono">
                  <div className="flex items-center gap-1 w-16 text-slate-300 shrink-0">
                    <span>{starNum} نجوم</span>
                    <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                  </div>

                  <div className="flex-1 h-3 rounded-full bg-black/60 overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-amber-400 to-cyan-400 rounded-full transition-all duration-500 shadow-[0_0_8px_rgba(255,215,0,0.5)]"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="w-20 text-left text-slate-400 shrink-0">
                    <span className="text-white font-bold">{count}</span> ({percentage}%)
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs">
            {/* Filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto">
              <span className="text-slate-400 text-[11px] font-mono ml-2">تصفية:</span>
              <button
                onClick={() => setFilterRating('all')}
                className={`px-3 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors ${
                  filterRating === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40'
                    : 'bg-white/5 text-slate-400 hover:text-white'
                }`}
              >
                الكل ({summary.totalCount})
              </button>
              {[5, 4, 3].map((s) => (
                <button
                  key={s}
                  onClick={() => setFilterRating(s)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono cursor-pointer transition-colors flex items-center gap-1 ${
                    filterRating === s
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                      : 'bg-white/5 text-slate-400 hover:text-white'
                  }`}
                >
                  <span>{s}★</span>
                  <span>({summary.starsCount[s as keyof typeof summary.starsCount]})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* Review Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {reviews.length === 0 ? (
          <div className="col-span-3 p-12 text-center rounded-3xl bg-[#090E1A] border border-dashed border-cyan-500/30 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div className="space-y-1 max-w-md mx-auto">
              <h4 className="text-base font-bold text-white font-tajawal">
                لا توجد تقييمات مسجلة بعد — الباب مفتوح لمشاركتك!
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                في منصة قبس نلتزم بالشفافية المطلقة؛ لم نضع أي تقييمات وهمية مسبقة. نرحب برأيك الصادق لتطوير التطبيق وخدمة الجميع.
              </p>
            </div>
            <button
              onClick={openRatingModal}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 transition-all cursor-pointer shadow-lg"
            >
              <PlusCircle className="w-4 h-4" />
              <span>كن أول من يقيّم التطبيق</span>
            </button>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="col-span-3 p-12 text-center rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <MessageSquare className="w-8 h-8 text-slate-500 mx-auto" />
            <h4 className="text-base font-bold text-white">لا توجد تقييمات مطابقة لهذا الفلتر</h4>
            <button
              onClick={() => setFilterRating('all')}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
            >
              عرض كافة التقييمات
            </button>
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="rounded-2xl bg-[#090E1A] border border-white/10 hover:border-cyan-500/40 p-5 space-y-3 flex flex-col justify-between shadow-lg transition-all"
            >
              <div className="space-y-3">
                {/* Author & Stars */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-full bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center font-bold text-cyan-300 text-xs">
                      {rev.authorName.slice(0, 1)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-white">{rev.authorName}</span>
                        {rev.verifiedUser && (
                          <span title="مستخدم موثق">
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono text-slate-500">{rev.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`w-3.5 h-3.5 ${
                          s <= rev.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-700'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Device & Version Badges */}
                <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded bg-black/40 text-amber-300 border border-white/10">
                    {rev.appVersion}
                  </span>
                  {rev.deviceModel && (
                    <span className="px-2 py-0.5 rounded bg-black/40 text-slate-400 border border-white/5 flex items-center gap-1 truncate max-w-[170px]">
                      <Smartphone className="w-2.5 h-2.5" />
                      {rev.deviceModel}
                    </span>
                  )}
                </div>

                {/* Comment Text */}
                <p className="text-xs text-slate-200 leading-relaxed font-cairo">
                  "{rev.comment}"
                </p>
              </div>

              {/* Helpful vote action */}
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
                <button
                  onClick={() => voteHelpful(rev.id)}
                  className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <ThumbsUp className="w-3 h-3" />
                  <span>مفيد ({rev.helpfulCount})</span>
                </button>

                <span className="text-[10px] text-slate-500 font-mono">تقييم موثق</span>
              </div>
            </div>
          ))
        )}
      </div>

    </section>
  );
};
