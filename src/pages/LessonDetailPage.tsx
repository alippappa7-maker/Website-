import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Play, 
  Pause, 
  Download, 
  Share2, 
  Clock, 
  BookOpen, 
  FileText, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  RotateCcw, 
  RotateCw,
  Volume2,
  VolumeX,
  Smartphone
} from 'lucide-react';
import { LESSONS_DATA, PODCASTS_DATA, SCHOLARS_DATA } from '../data/mockData';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { SmartAppBanner } from '../components/SmartAppBanner';
import { useReadingMode } from '../context/ReadingModeContext';
import { ReadingModeToolbar } from '../components/ReadingModeToolbar';

export const LessonDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isReadingMode, enterReadingMode, fontSize, lineHeight, theme } = useReadingMode();

  // Find either lesson or podcast
  const lesson = LESSONS_DATA.find(l => l.id === id);
  const podcast = !lesson ? PODCASTS_DATA.find(p => p.id === id) : null;

  const item = lesson || podcast;

  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    seekTo,
    skipSeconds,
    playTrack,
    downloadAudioFile
  } = useAudioPlayer();

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  if (!item) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">عفواً، المادة المطلوبة غير موجودة</h2>
        <p className="text-sm text-slate-400">قد يكون تم تعديل المعرف أو نقل المادة لأرشيف آخر.</p>
        <Link
          to="/lessons"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300"
        >
          العودة لمركز الدروس
        </Link>
      </div>
    );
  }

  const isCurrentPlaying = currentTrack?.id === item.id && isPlaying;
  const isVideo = 'type' in item && item.type === 'video' && item.videoUrl;

  const handleStartPlay = () => {
    if (currentTrack?.id === item.id) {
      togglePlay();
    } else {
      playTrack({
        id: item.id,
        title: item.title,
        seriesOrHost: 'series' in item ? item.series : `بودكاست قبس · م${(item as any).season}`,
        scholarName: item.scholar.name,
        coverImage: item.coverImage,
        audioUrl: item.audioUrl,
        durationSeconds: item.durationSeconds,
        contentType: lesson ? 'lesson' : 'podcast'
      });
    }
  };

  const handleSeekToTranscript = (seconds: number) => {
    if (currentTrack?.id !== item.id) {
      playTrack({
        id: item.id,
        title: item.title,
        seriesOrHost: 'series' in item ? item.series : `بودكاست قبس · م${(item as any).season}`,
        scholarName: item.scholar.name,
        coverImage: item.coverImage,
        audioUrl: item.audioUrl,
        durationSeconds: item.durationSeconds,
        contentType: lesson ? 'lesson' : 'podcast'
      });
      setTimeout(() => seekTo(seconds), 300);
    } else {
      seekTo(seconds);
    }
  };

  const handleDownload = () => {
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (!prev) return 10;
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDownloadProgress(null), 1500);
          downloadAudioFile({
            id: item.id,
            title: item.title,
            seriesOrHost: 'series' in item ? item.series : `بودكاست قبس`,
            scholarName: item.scholar.name,
            coverImage: item.coverImage,
            audioUrl: item.audioUrl,
            durationSeconds: item.durationSeconds,
            contentType: lesson ? 'lesson' : 'podcast'
          });
          return 100;
        }
        return prev + 30;
      });
    }, 200);
  };

  const handleCopyShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const deepLinkUri = `qabas://${lesson ? 'lesson' : 'podcast'}/${item.id}`;

  return (
    <>
      {/* Floating Toolbar during Reading Mode */}
      <ReadingModeToolbar title={item.title} />

      <div className={`mx-auto px-4 sm:px-6 lg:px-8 transition-all duration-300 ${
        isReadingMode 
          ? 'max-w-4xl pt-16 pb-20' 
          : 'max-w-7xl py-8 sm:py-12 space-y-10'
      }`}>
        
        {/* Smart App Banner & Breadcrumb (hidden in reading mode) */}
        {!isReadingMode && (
          <>
            <SmartAppBanner 
              contentType={lesson ? 'lesson' : 'podcast'}
              contentId={item.id}
              title={item.title}
            />

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Link to="/" className="hover:text-white transition-colors">الرئيسية</Link>
                <span>/</span>
                <Link to="/lessons" className="hover:text-white transition-colors">مركز الدروس والبودكاست</Link>
                <span>/</span>
                <span className="text-cyan-400 truncate max-w-xs">{item.title}</span>
              </div>

              {/* Reading Mode Button in Top Header */}
              <button
                onClick={enterReadingMode}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 text-xs font-bold font-tajawal transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.15)] group"
                title="تفعيل وضع القراءة المريح وتوسيع مساحة النص"
              >
                <BookOpen className="w-4 h-4 text-cyan-400 group-hover:scale-110 transition-transform" />
                <span>وضع القراءة</span>
                <span className="text-[10px] font-mono px-1 rounded bg-cyan-950/60 border border-cyan-500/30">
                  Focus
                </span>
              </button>
            </div>
          </>
        )}

        {/* Main Grid: Media Player & Overview */}
        <div className={`grid grid-cols-1 ${isReadingMode ? 'gap-6' : 'lg:grid-cols-12 gap-8'} items-start`}>
          
          {/* Left Column: Player & Transcripts */}
          <div className={`${isReadingMode ? 'lg:col-span-12 space-y-6' : 'lg:col-span-8 space-y-8'}`}>
            
            {/* Custom Integrated High-Quality Player Box */}
            {!isReadingMode && (
              <div className="relative rounded-3xl overflow-hidden bg-[#090E1A] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,229,255,0.1)]">
                
                {isVideo ? (
                  <div className="relative aspect-video bg-black">
                    <video
                      src={(item as any).videoUrl}
                      poster={item.coverImage}
                      controls
                      className="w-full h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="relative aspect-video sm:aspect-[21/9] bg-gradient-to-br from-[#0B1527] to-[#080D17] flex flex-col justify-between p-6 overflow-hidden">
                    <img
                      src={item.coverImage}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-25 filter blur-sm scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090E1A] via-[#090E1A]/80 to-transparent" />

                    {/* HUD Top Corner tags */}
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-cyan-300">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        <span>{lesson ? lesson.categoryLabel : 'بودكاست قبس'}</span>
                      </div>
                      <div className="px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-mono text-amber-300">
                        استريو عالي النقاء 192kbps
                      </div>
                    </div>

                    {/* Center Player Play Button & Visualizer */}
                    <div className="relative z-10 flex flex-col items-center justify-center my-4 space-y-3">
                      <button
                        onClick={handleStartPlay}
                        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-cyan-400 to-amber-400 text-slate-950 flex items-center justify-center shadow-[0_0_35px_rgba(0,229,255,0.5)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
                        aria-label={isCurrentPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
                      >
                        {isCurrentPlaying ? (
                          <Pause className="w-8 h-8 fill-slate-950" />
                        ) : (
                          <Play className="w-8 h-8 fill-slate-950 mr-1" />
                        )}
                      </button>
                      <span className="text-xs font-mono text-slate-300">
                        {isCurrentPlaying ? 'المشغل قيد العمل الآن...' : 'انقر لبدء الاستماع'}
                      </span>
                    </div>

                    {/* Bottom Sound Spectrum Wave (Decorative HUD) */}
                    <div className="relative z-10 flex items-center justify-center gap-1 h-6">
                      {[40, 70, 25, 90, 50, 80, 30, 95, 60, 45, 85, 30, 70, 90, 40].map((h, i) => (
                        <span
                          key={i}
                          className={`w-1 rounded-full transition-all duration-300 ${
                            isCurrentPlaying 
                              ? 'bg-gradient-to-t from-cyan-400 to-amber-400 animate-pulse' 
                              : 'bg-white/20'
                          }`}
                          style={{ 
                            height: isCurrentPlaying ? `${h}%` : '20%',
                            animationDelay: `${i * 0.08}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions Bar inside player box */}
                <div className="p-4 sm:p-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 bg-white/5">
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleDownload}
                      disabled={downloadProgress !== null}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>
                        {downloadProgress !== null ? `جاري التنزيل (${downloadProgress}%)` : `تحميل MP3 (${item.downloadSize})`}
                      </span>
                    </button>

                    <button
                      onClick={enterReadingMode}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-cyan-300 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/20 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>وضع القراءة</span>
                    </button>

                    <button
                      onClick={() => setShareModalOpen(true)}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/10 hover:bg-white/15 border border-white/10 transition-colors cursor-pointer"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>مشاركة</span>
                    </button>
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
                    <span>{item.playsCount.toLocaleString('ar-EG')} استماع</span>
                    <span>·</span>
                    <span>{item.downloadsCount.toLocaleString('ar-EG')} تحميل</span>
                  </div>
                </div>

              </div>
            )}

            {/* Lesson Metadata: Title, Series, Scholar info */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
                <span>{'series' in item ? item.series : `بودكاست قبس · الموسم ${(item as any).season}`}</span>
                <span>·</span>
                <span className="font-mono">{item.publishedAt}</span>
              </div>

              <h1 className={`font-extrabold text-white font-tajawal transition-all ${
                isReadingMode ? 'text-3xl sm:text-4xl' : 'text-2xl sm:text-3xl'
              }`}>
                {item.title}
              </h1>

              <div 
                className="rounded-2xl bg-[#090E1A] p-5 sm:p-6 border border-white/10 text-slate-300 font-tajawal transition-all"
                style={{
                  fontSize: isReadingMode ? `${fontSize}px` : '15px',
                  lineHeight: isReadingMode ? lineHeight : 1.8,
                }}
              >
                {item.summary}
              </div>
            </div>

            {/* Topics & Key Outlines */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <span>المحاور والنقاط الرئيسية في الدرس</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {item.topics.map((topic, i) => (
                  <div 
                    key={i}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-slate-300 font-tajawal"
                    style={{
                      fontSize: isReadingMode ? `${Math.max(14, fontSize - 2)}px` : '13px',
                      lineHeight: isReadingMode ? lineHeight : 1.6,
                    }}
                  >
                    <span className="w-5 h-5 rounded-md bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-mono font-bold text-[10px] shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <span>{topic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Synchronized Transcript (تفريغ نصي متزامن) */}
            <div className="space-y-4 rounded-2xl bg-[#090E1A] border border-white/10 p-5 sm:p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-base font-bold text-white font-tajawal">التفريغ النصي والتوثيق الزمني</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  انقر على أي توقيت للانتقال اللحظي للمقطع
                </span>
              </div>

              <div className="space-y-3 pt-2">
                {item.transcripts.map((t) => {
                  const isNearCurrent = Math.abs(currentTime - t.timeSeconds) < 20 && currentTrack?.id === item.id;
                  return (
                    <div
                      key={t.id}
                      onClick={() => handleSeekToTranscript(t.timeSeconds)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer group ${
                        isNearCurrent
                          ? 'bg-cyan-500/10 border-cyan-400/50 shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                          : 'bg-white/5 border-white/5 hover:border-cyan-500/30 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-amber-300 font-tajawal">{t.speaker}</span>
                        <button
                          className="flex items-center gap-1 text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-black/40 border border-cyan-500/30 group-hover:bg-cyan-400 group-hover:text-slate-950 transition-colors"
                        >
                          <Play className="w-2.5 h-2.5 fill-current" />
                          <span>{t.timeFormatted}</span>
                        </button>
                      </div>
                      <p 
                        className="text-slate-200 font-serif leading-relaxed transition-all"
                        style={{
                          fontSize: isReadingMode ? `${fontSize}px` : '15px',
                          lineHeight: isReadingMode ? lineHeight : 1.9,
                        }}
                      >
                        {t.text}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* References & Sources (المصادر والمراجع العلمية) */}
            {lesson && lesson.references && lesson.references.length > 0 && (
              <div className="space-y-3 rounded-2xl bg-[#090E1A] border border-white/10 p-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2 font-tajawal">
                  <BookOpen className="w-4 h-4 text-amber-400" />
                  <span>المصادر والمراجع العلمية المعتمدة</span>
                </h3>
                <div className="space-y-2">
                  {lesson.references.map((ref) => (
                    <div key={ref.id} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <div className="font-bold text-white font-tajawal">{ref.title}</div>
                        <div className="text-slate-400 mt-0.5">{ref.author} · {ref.notes}</div>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 shrink-0">
                        محقق ومعتمد
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Right Column (hidden in reading mode): Scholar Bio, Deep Link Action, Related */}
          {!isReadingMode && (
            <div className="lg:col-span-4 space-y-6">
              
              {/* Scholar Card */}
              <div className="rounded-2xl bg-[#090E1A] border border-cyan-500/30 p-5 space-y-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <img
                    src={item.scholar.avatar}
                    alt={item.scholar.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-amber-400/40"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="text-sm font-bold text-white">{item.scholar.name}</h4>
                      {item.scholar.verified && (
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                      )}
                    </div>
                    <p className="text-xs text-amber-400 font-mono mt-0.5">{item.scholar.title}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.scholar.bio}
                </p>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <Link
                    to={`/scholar/${item.scholarId}`}
                    className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                  >
                    <span>جميع مواد المحاضر ({item.scholar.lessonsCount})</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Native App Deep Link Card */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0B1527] to-[#080D17] border border-white/10 p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-mono">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>تطبيق قبس الأصلي (Android)</span>
                </div>
                
                <p className="text-xs text-slate-300 leading-relaxed">
                  يمكنك متابعة الاستماع بدون إنترنت مع ميزة الحفظ التلقائي للنقطة الزمنية واستكمال الدرس لاحقاً.
                </p>

                <div className="pt-2 space-y-2">
                  <a
                    href={deepLinkUri}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors shadow-[0_0_20px_rgba(0,229,255,0.3)]"
                  >
                    <span>فتح في تطبيق قبس (Deep Link)</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <Link
                    to="/app-repository"
                    className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <span>تحميل أحدث إصدار APK</span>
                  </Link>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {/* Social Share Modal */}
      {shareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md bg-[#0B111E] border border-cyan-500/30 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold text-white">مشاركة المادة العلمية</h3>
              <button onClick={() => setShareModalOpen(false)} className="text-slate-400 hover:text-white text-xs">✕</button>
            </div>
            
            <p className="text-xs text-slate-300">شارك هذا الدرس مع أصدقائك في منصات التواصل:</p>

            <div className="grid grid-cols-2 gap-2 text-xs font-semibold">
              <a
                href={`https://wa.me/?text=${encodeURIComponent(item.title + ' - ' + window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 flex items-center justify-center gap-1.5 hover:bg-emerald-500/25 transition-colors"
              >
                واتساب (WhatsApp)
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(item.title)}`}
                target="_blank"
                rel="noreferrer"
                className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 flex items-center justify-center gap-1.5 hover:bg-cyan-500/25 transition-colors"
              >
                تيليغرام (Telegram)
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(item.title)}&url=${encodeURIComponent(window.location.href)}`}
                target="_blank"
                rel="noreferrer"
                className="col-span-2 p-2.5 rounded-xl bg-sky-500/15 text-sky-300 border border-sky-500/30 flex items-center justify-center gap-1.5 hover:bg-sky-500/25 transition-colors"
              >
                منصة إكس (Twitter/X)
              </a>
            </div>

            <div className="pt-2 border-t border-white/10 space-y-2">
              <div className="text-[11px] text-slate-400">رابط الصفحة المباشر:</div>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-black/40 border border-white/10 text-xs">
                <span className="truncate text-slate-300 flex-1 font-mono text-[11px]">{window.location.href}</span>
                <button
                  onClick={handleCopyShare}
                  className="px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-colors shrink-0"
                >
                  {copiedLink ? 'تم النسخ!' : 'نسخ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
