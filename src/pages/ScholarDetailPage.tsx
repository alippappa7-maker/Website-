import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Users, CheckCircle2, BookOpen, Radio, Play, Clock, Download, ArrowRight, ExternalLink } from 'lucide-react';
import { SCHOLARS_DATA, LESSONS_DATA, PODCASTS_DATA } from '../data/mockData';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { SmartAppBanner } from '../components/SmartAppBanner';

export const ScholarDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const scholar = SCHOLARS_DATA.find(s => s.id === id);

  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();

  if (!scholar) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">المحاضر المطلوب غير موجود</h2>
        <Link
          to="/scholars"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400"
        >
          العودة لقائمة العلماء
        </Link>
      </div>
    );
  }

  const scholarLessons = LESSONS_DATA.filter(l => l.scholarId === scholar.id);
  const scholarPodcasts = PODCASTS_DATA.filter(p => p.scholarId === scholar.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      
      {/* Smart App Banner */}
      <SmartAppBanner 
        contentType="scholar" 
        contentId={scholar.id} 
        title={scholar.name} 
      />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-400">
        <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
        <span>/</span>
        <Link to="/scholars" className="hover:text-white transition-colors">العلماء والمحاضرون</Link>
        <span>/</span>
        <span className="text-cyan-400 truncate">{scholar.name}</span>
      </div>

      {/* Scholar Profile Header */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0C1527] to-[#080D19] border border-cyan-500/30 p-6 sm:p-10 shadow-2xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-right">
          
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden border-2 border-amber-400/50 shadow-2xl shrink-0">
            <img
              src={scholar.avatar}
              alt={scholar.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {scholar.verified && (
              <div className="absolute bottom-2 right-2 w-7 h-7 bg-cyan-400 rounded-full flex items-center justify-center text-slate-950 border-2 border-slate-950 shadow">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
          </div>

          <div className="space-y-3 flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-lg border border-cyan-500/20">
                {scholar.specialization}
              </span>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                عالم معتمد في قبس
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-tajawal">
              {scholar.name}
            </h1>

            <p className="text-xs text-amber-300 font-mono">
              {scholar.title}
            </p>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              {scholar.bio}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>{scholar.lessonsCount} درس مسجل</span>
              </div>
              <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>{scholar.podcastsCount} حوارات فكرية</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Scholar's Lessons Section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <h3 className="text-xl font-bold text-white font-tajawal flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            <span>الدروس والمحاضرات المسجلة ({scholarLessons.length})</span>
          </h3>
        </div>

        {scholarLessons.length === 0 ? (
          <div className="p-8 text-center text-slate-400 text-xs bg-white/5 rounded-2xl">
            جاري رفع وفهرسة بقية الدروس قريباً.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {scholarLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="rounded-2xl bg-[#090E1A] border border-white/10 hover:border-cyan-500/40 p-4 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/10">
                    <img
                      src={lesson.coverImage}
                      alt={lesson.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-cyan-300">
                      {lesson.categoryLabel}
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-slate-300 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      {lesson.duration}
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-400 font-medium mb-1">
                    {lesson.series}
                  </div>
                  <Link
                    to={`/lesson/${lesson.id}`}
                    className="text-sm font-bold text-white hover:text-cyan-300 line-clamp-2 transition-colors"
                  >
                    {lesson.title}
                  </Link>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {lesson.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                  <button
                    onClick={() => playTrack({
                      id: lesson.id,
                      title: lesson.title,
                      seriesOrHost: lesson.series,
                      scholarName: scholar.name,
                      coverImage: lesson.coverImage,
                      audioUrl: lesson.audioUrl,
                      durationSeconds: lesson.durationSeconds,
                      contentType: 'lesson'
                    })}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
                  >
                    <Play className="w-3 h-3 fill-slate-950" />
                    <span>تشغيل</span>
                  </button>

                  <Link
                    to={`/lesson/${lesson.id}`}
                    className="text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    عرض التفريغ ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Scholar's Podcasts Section */}
      {scholarPodcasts.length > 0 && (
        <div className="space-y-6 pt-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-white font-tajawal flex items-center gap-2">
              <Radio className="w-5 h-5 text-amber-400" />
              <span>حلقات بودكاست قبس ({scholarPodcasts.length})</span>
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scholarPodcasts.map((pod) => (
              <div
                key={pod.id}
                className="rounded-2xl bg-[#090E1A] border border-amber-400/25 p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-2">
                    <span>الموسم {pod.season} · الحلقة {pod.episodeNumber}</span>
                    <span>{pod.duration}</span>
                  </div>
                  <Link
                    to={`/podcast/${pod.id}`}
                    className="text-base font-bold text-white hover:text-amber-300 transition-colors"
                  >
                    {pod.title}
                  </Link>
                  {pod.coHost && (
                    <div className="text-xs text-slate-400 mt-1">
                      بمشاركة: {pod.coHost}
                    </div>
                  )}
                  <p className="text-xs text-slate-300 mt-2 line-clamp-3 leading-relaxed">
                    {pod.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                  <button
                    onClick={() => playTrack({
                      id: pod.id,
                      title: pod.title,
                      seriesOrHost: `بودكاست قبس · م${pod.season}`,
                      scholarName: scholar.name,
                      coverImage: pod.coverImage,
                      audioUrl: pod.audioUrl,
                      durationSeconds: pod.durationSeconds,
                      contentType: 'podcast'
                    })}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950" />
                    <span>استماع للحلقة</span>
                  </button>

                  <Link
                    to={`/podcast/${pod.id}`}
                    className="text-xs font-semibold text-slate-300 hover:text-white"
                  >
                    صفحة الحلقة والتفريغ ←
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
