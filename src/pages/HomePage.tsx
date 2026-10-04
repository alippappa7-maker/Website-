import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Download, 
  Play, 
  Radio, 
  Layers, 
  Newspaper, 
  ShieldCheck, 
  Sparkles, 
  ChevronLeft, 
  Clock, 
  Cpu, 
  Users, 
  Headphones, 
  ExternalLink,
  CheckCircle2,
  FileCheck2,
  Compass
} from 'lucide-react';
import { 
  PODCASTS_DATA, 
  SCHOLARS_DATA, 
  HERO_IMAGE,
  APP_MOCKUP 
} from '../data/mockData';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { useUplink } from '../context/UplinkContext';
import { useRating } from '../context/RatingContext';
import { useVisitorStats } from '../context/VisitorStatsContext';
import { AppUpdateButton } from '../components/AppUpdateButton';
import { CommunityReviewsSection } from '../components/CommunityReviewsSection';
import { MediaVaultHomeSection } from '../components/MediaVaultHomeSection';

export const HomePage: React.FC = () => {
  const { playTrack, currentTrack, isPlaying } = useAudioPlayer();
  const { releases, lessons, news } = useUplink();
  const { summary, openRatingModal } = useRating();
  const { onlineUsers, totalVisitors, isLiveConnected } = useVisitorStats();
  const latestRelease = releases[0];
  const featuredLesson = lessons[0];
  const featuredPodcast = PODCASTS_DATA[0];

  // Calculate real live metrics
  const totalActualMinutes = Math.round(
    lessons.reduce((acc, l) => acc + (l.durationSeconds || 0), 0) / 60
  );
  const activeTracksCount = lessons.length;

  const handlePlayFeatured = () => {
    playTrack({
      id: featuredLesson.id,
      title: featuredLesson.title,
      seriesOrHost: featuredLesson.series,
      scholarName: featuredLesson.scholar.name,
      coverImage: featuredLesson.coverImage,
      audioUrl: featuredLesson.audioUrl,
      durationSeconds: featuredLesson.durationSeconds,
      contentType: 'lesson'
    });
  };

  return (
    <div className="space-y-16 sm:space-y-24">
      
      {/* 1. Spatial HUD Hero Section */}
      <section className="relative min-h-[580px] lg:min-h-[640px] flex items-center pt-8 pb-12 overflow-hidden">
        
        {/* Background Image with dark scrim & HUD grid */}
        <div className="absolute inset-0 z-0">
          <img 
            src={HERO_IMAGE} 
            alt="قبس الهوية البصرية المكانية" 
            className="w-full h-full object-cover object-center opacity-30 scale-105"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080C14] via-[#080C14]/80 to-[#080C14]/40" />
          <div className="absolute inset-0 hud-grid-pattern opacity-60" />
        </div>

        {/* Ambient Spatial Lighting Orbs */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-amber-500/15 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-10 -left-20 w-96 h-96 bg-cyan-500/15 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Right Column: Hero Content & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-right">
              
              {/* Status Header Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-cyan-400/30 backdrop-blur-md shadow-[0_0_15px_rgba(0,229,255,0.15)]">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00E5FF]" />
                <span className="text-xs font-mono text-cyan-300 font-semibold tracking-wide">
                  SPATIAL HUD TECH · الجيل المعرفي الجديد
                </span>
                <span className="text-slate-600">|</span>
                <span className="text-xs font-semibold text-amber-400">
                  إصدار الأندرويد المستقر {latestRelease.version} ({latestRelease.exactSizeFormatted || `${latestRelease.apkSize} - 31,142,704 بايت`}) · نشر في {latestRelease.releaseDate} ({latestRelease.releaseTime || '09:22 م'})
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight font-tajawal tracking-tight">
                قبس المعرفة الإسلامية والفكرية{' '}
                <span className="bg-gradient-to-l from-amber-300 via-amber-400 to-cyan-300 bg-clip-text text-transparent block mt-2">
                  بتجربة مكانية استثنائية
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                المستودع البرمجي الرسمي، مركز الدروس والمحاضرات الصوتية والمرئية، وبودكاست قبس الفكري. مصمم لدعم الروابط العميقة، والبحث الدلالي بالذكاء الاصطناعي دون إنترنت، وبصمة أمان موثوقة 100%.
              </p>

              {/* Primary & Secondary Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/app-repository"
                  className="flex items-center gap-2.5 px-6 py-3.5 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_30px_rgba(255,215,0,0.35)] transition-all transform active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل تطبيق قبس ({latestRelease.apkSize})</span>
                </Link>

                <Link
                  to="/lessons"
                  className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-semibold text-sm text-white bg-slate-900/80 hover:bg-slate-850 border border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_0_20px_rgba(0,229,255,0.15)] transition-all cursor-pointer"
                >
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <span>تصفح الدروس والبودكاست</span>
                </Link>

                <div className="flex items-center">
                  <AppUpdateButton variant="compact" />
                </div>
              </div>

              {/* HUD Real Dynamic Metrics bar powered by Supabase Realtime */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-4 border-t border-white/10 max-w-2xl">
                {/* Live Online Users */}
                <div className="p-3 rounded-xl bg-cyan-950/20 border border-cyan-500/30 text-right backdrop-blur-sm relative overflow-hidden group">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-cyan-300 font-mono">المتصلون الآن</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-white font-mono mt-1 flex items-baseline gap-1">
                    <span>{onlineUsers}</span>
                    <span className="text-[10px] text-emerald-400 font-normal">مستخدم حي</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                    {isLiveConnected ? '⚡ Supabase Realtime' : 'مزامنة نشطة'}
                  </div>
                </div>

                {/* Total Real Visitors */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-right backdrop-blur-sm">
                  <div className="text-[11px] text-slate-400 font-mono">إجمالي الزوار</div>
                  <div className="text-lg font-extrabold text-amber-300 font-mono mt-1 flex items-baseline gap-1">
                    <span>{totalVisitors}</span>
                    <span className="text-[10px] text-slate-400 font-normal">زيارة فعلية</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">سجل قاعدة البيانات</div>
                </div>

                {/* Available Recitations */}
                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-right backdrop-blur-sm">
                  <div className="text-[11px] text-slate-400 font-mono">التلاوات المتاحة</div>
                  <div className="text-lg font-extrabold text-white font-mono mt-1 flex items-baseline gap-1">
                    <span>{activeTracksCount}</span>
                    <span className="text-[10px] text-slate-400 font-normal">مادة معتمدة</span>
                  </div>
                  <div className="text-[9px] text-cyan-400 font-mono mt-0.5">{totalActualMinutes} دقيقة صوت</div>
                </div>

                {/* Real Community Rating */}
                <button
                  onClick={openRatingModal}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 hover:border-amber-400/50 hover:bg-amber-500/5 transition-all text-right cursor-pointer group"
                  title="انقر لتقييم التطبيق أو مشاهدة التقييمات الحقيقية"
                >
                  <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
                    <span>التقييم الحقيقي</span>
                    <span className="text-[10px] text-amber-300 group-hover:underline">★ قيّم</span>
                  </div>
                  <div className="text-lg font-extrabold text-amber-300 font-mono flex items-center gap-1.5 mt-1">
                    <span>{summary.averageRating > 0 ? summary.averageRating.toFixed(1) : '—'}</span>
                    <span className="text-xs text-slate-400 font-normal">({summary.totalCount})</span>
                  </div>
                  <div className="text-[9px] text-slate-400 font-mono mt-0.5">آراء المستخدمين</div>
                </button>
              </div>

            </div>

            {/* Left Column: Interactive Spatial Showcase Card */}
            <div className="lg:col-span-5">
              <div className="relative group">
                
                {/* Glow ring */}
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 via-cyan-400/30 to-emerald-400/30 rounded-3xl blur-xl opacity-70 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Card Container */}
                <div className="relative rounded-2xl bg-[#0B1222]/90 backdrop-blur-2xl border border-cyan-500/30 p-5 shadow-2xl space-y-4">
                  
                  {/* Card Header */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                      <span className="text-xs font-mono font-bold text-cyan-400">
                        مادة مميزة الآن على قبس
                      </span>
                    </div>
                    <span className="text-[11px] font-mono text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                      {featuredLesson.categoryLabel}
                    </span>
                  </div>

                  {/* Image & Quick Play Overlay */}
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group/img">
                    <img 
                      src={featuredLesson.coverImage} 
                      alt={featuredLesson.title}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex items-end p-4">
                      <button
                        onClick={handlePlayFeatured}
                        className="flex items-center gap-2.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-300 to-amber-300 hover:from-cyan-200 hover:to-amber-200 shadow-lg cursor-pointer transform active:scale-95 transition-all"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-950" />
                        <span>
                          {currentTrack?.id === featuredLesson.id && isPlaying ? 'جاري الاستماع...' : 'تشغيل الدرس الآن'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Title & Scholar */}
                  <div>
                    <Link 
                      to={`/lesson/${featuredLesson.id}`}
                      className="text-base font-bold text-white hover:text-cyan-300 transition-colors line-clamp-2"
                    >
                      {featuredLesson.title}
                    </Link>
                    <div className="flex items-center gap-2 mt-2 text-xs text-slate-400">
                      <span>{featuredLesson.scholar.name}</span>
                      <span>·</span>
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        {featuredLesson.duration}
                      </span>
                    </div>
                  </div>

                  {/* Deep Link Quick Simulator */}
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <span>الرابط العميق المباشر (Deep Link):</span>
                      <span className="text-emerald-400">مفعل</span>
                    </div>
                    <div className="font-mono text-[11px] text-cyan-300 truncate bg-slate-900/90 p-1.5 rounded border border-cyan-500/20">
                      qabas://lesson/{featuredLesson.id}
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. The Three Core Pillars Bento Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold block mb-2">
            منظومة قبس الثلاثية
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white font-tajawal">
            ثلاث ركائز تكاملية في منصة رقمية واحدة
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            صممت المنصة لتقديم تجربة معرفية متصلة وموثوقة تجمع بين الهاتف والويب
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Pillar 1: Media & Lessons Hub */}
          <div className="rounded-2xl bg-[#0A101C]/80 border border-cyan-500/20 hover:border-cyan-500/50 p-6 backdrop-blur-xl transition-all duration-300 group flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,229,255,0.2)]">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                مركز الدروس والبودكاست
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                مكتبة صوتية ومرئية تضم أحدث سلاسل التفسير والفقه والعقيدة وبودكاست قبس الفكري، مع تفريغ نصي متزامن وقابل للبحث اللحظي.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>توجيه بالروابط العميقة (Deep Links)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>مشغل صوتي مستمر طوال التصفح</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>تنزيل MP3 مباشر عالي الدقة</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <Link
                to="/lessons"
                className="flex items-center justify-between text-xs font-bold text-cyan-400 group-hover:text-cyan-300"
              >
                <span>دخول مركز المحتوى</span>
                <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Pillar 2: Official App Repository */}
          <div className="rounded-2xl bg-[#0E1524]/90 border border-amber-400/30 hover:border-amber-400/60 p-6 backdrop-blur-xl transition-all duration-300 group flex flex-col justify-between shadow-[0_0_30px_rgba(255,215,0,0.06)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-400/10 rounded-bl-full pointer-events-none" />
            
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-400/15 border border-amber-400/30 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(255,215,0,0.2)]">
                <Layers className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-amber-300 transition-colors">
                مستودع التطبيق الرسمي (APK)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                مركز التحميل المباشر لتطبيق قبس لنظام أندرويد مع سجل الإصدارات الكامل (Changelog)، وبصمة التحقق SHA-256، ودليل التثبيت.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>حزمة مستقرة: {latestRelease.version}</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>فحص أمني معتمد VirusTotal</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>دعم كامل من أندرويد 8 حتى 15</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <Link
                to="/app-repository"
                className="flex items-center justify-between text-xs font-bold text-amber-400 group-hover:text-amber-300"
              >
                <span>فتح مستودع التحميل</span>
                <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Pillar 3: News & Announcements Portal */}
          <div className="rounded-2xl bg-[#0A101C]/80 border border-emerald-500/20 hover:border-emerald-500/50 p-6 backdrop-blur-xl transition-all duration-300 group flex flex-col justify-between shadow-lg">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-emerald-300 group-hover:scale-105 transition-transform shadow-[0_0_15px_rgba(0,230,118,0.2)]">
                <Newspaper className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                بوابة الأخبار والبيانات
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                التغطية الرسمية لإعلانات التطبيق وتحديثات الميزات، وإطلاق السلاسل الجديدة، وتقارير الشفافية التقنية وسياسة الخصوصية.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-400 pt-2 font-mono">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>شريط إخباري فوري حي (Live Ticker)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>بيانات رسمية مصنفة ومؤرخة</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>مقالات تفصيلية مع وسائط ومعارض</span>
                </li>
              </ul>
            </div>

            <div className="pt-6 border-t border-white/10 mt-6">
              <Link
                to="/news"
                className="flex items-center justify-between text-xs font-bold text-emerald-400 group-hover:text-emerald-300"
              >
                <span>تصفح الأخبار والبيانات</span>
                <ChevronLeft className="w-4 h-4 transform group-hover:-translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Featured Media Strip (Lessons & Podcasts Preview) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-tajawal">
              جديد مركز الدروس والبودكاست
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              أحدث المحاضرات والحوارات الفكرية المتاحة للاستماع والتحميل
            </p>
          </div>
          <Link
            to="/lessons"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>عرض كل المحتوى ({lessons.length + PODCASTS_DATA.length})</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {lessons.slice(0, 2).map((lesson) => (
            <div 
              key={lesson.id}
              className="rounded-2xl bg-[#090E1A] border border-white/10 hover:border-cyan-500/40 p-4 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/10">
                  <img 
                    src={lesson.coverImage} 
                    alt={lesson.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-white/10">
                    {lesson.categoryLabel}
                  </div>
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-1">
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
                <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                  {lesson.summary}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img 
                    src={lesson.scholar.avatar} 
                    alt={lesson.scholar.name} 
                    className="w-6 h-6 rounded-full object-cover border border-white/20"
                    referrerPolicy="no-referrer"
                  />
                  <span className="text-xs text-slate-300 truncate max-w-[120px]">
                    {lesson.scholar.name}
                  </span>
                </div>

                <button
                  onClick={() => playTrack({
                    id: lesson.id,
                    title: lesson.title,
                    seriesOrHost: lesson.series,
                    scholarName: lesson.scholar.name,
                    coverImage: lesson.coverImage,
                    audioUrl: lesson.audioUrl,
                    durationSeconds: lesson.durationSeconds,
                    contentType: 'lesson'
                  })}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors cursor-pointer"
                >
                  <Play className="w-3 h-3 fill-slate-950" />
                  <span>استماع</span>
                </button>
              </div>
            </div>
          ))}

          {/* Featured Podcast Card */}
          <div className="rounded-2xl bg-[#090E1A] border border-amber-400/25 hover:border-amber-400/50 p-4 transition-all duration-300 group flex flex-col justify-between">
            <div>
              <div className="relative aspect-video rounded-xl overflow-hidden mb-3 border border-white/10">
                <img 
                  src={featuredPodcast.coverImage} 
                  alt={featuredPodcast.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-amber-300 border border-white/10">
                  بودكاست قبس
                </div>
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-mono text-slate-300 flex items-center gap-1">
                  <Clock className="w-3 h-3 text-amber-400" />
                  {featuredPodcast.duration}
                </div>
              </div>

              <div className="text-[11px] text-amber-400 font-medium mb-1">
                الموسم {featuredPodcast.season} · الحلقة {featuredPodcast.episodeNumber}
              </div>
              <Link 
                to={`/podcast/${featuredPodcast.id}`}
                className="text-sm font-bold text-white hover:text-amber-300 line-clamp-2 transition-colors"
              >
                {featuredPodcast.title}
              </Link>
              <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 leading-relaxed">
                {featuredPodcast.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <img 
                  src={featuredPodcast.scholar.avatar} 
                  alt={featuredPodcast.scholar.name} 
                  className="w-6 h-6 rounded-full object-cover border border-white/20"
                  referrerPolicy="no-referrer"
                />
                <span className="text-xs text-slate-300 truncate max-w-[120px]">
                  {featuredPodcast.scholar.name}
                </span>
              </div>

              <button
                onClick={() => playTrack({
                  id: featuredPodcast.id,
                  title: featuredPodcast.title,
                  seriesOrHost: `بودكاست قبس · م${featuredPodcast.season}`,
                  scholarName: featuredPodcast.scholar.name,
                  coverImage: featuredPodcast.coverImage,
                  audioUrl: featuredPodcast.audioUrl,
                  durationSeconds: featuredPodcast.durationSeconds,
                  contentType: 'podcast'
                })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors cursor-pointer"
              >
                <Play className="w-3 h-3 fill-slate-950" />
                <span>استماع</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Official App Repository Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0B1324] via-[#090F1C] to-[#0D182E] border border-cyan-500/30 p-6 sm:p-10 overflow-hidden shadow-[0_0_50px_rgba(0,229,255,0.08)]">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-400/10 border border-amber-400/25 text-amber-300 font-mono text-xs">
                <Layers className="w-3.5 h-3.5" />
                <span>مستودع التوزيع الرقمي المباشر</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-tajawal">
                تطبيق قبس لنظام أندرويد: سرعة، استقلالية، وذكاء دون اتصال
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                احصل على النسخة الرسمية الصادرة من المستودع البرمجي المباشر. استمتع بمحرك الاستماع بالخلفية بدون إعلانات أو تتبع، وميزة البحث بالذكاء الاصطناعي التي تعمل حتى في وضع الطيران.
              </p>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300">
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-slate-400">الإصدار:</span>
                  <span className="text-amber-400 font-bold">{latestRelease.version}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-slate-400">الحجم:</span>
                  <span className="text-white">{latestRelease.apkSize}</span>
                </div>
                <div className="flex items-center gap-1.5 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
                  <span className="text-slate-400">النظام الأدنى:</span>
                  <span className="text-cyan-300">Android 7.0+ (API 24)</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <Link
                  to="/app-repository"
                  className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 hover:to-amber-300 shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل الـ APK وتفاصيل الأمان</span>
                </Link>
                <Link
                  to="/app-repository#changelog"
                  className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <span>سجل التغييرات الكامل (Changelog)</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative max-w-xs w-full">
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/30 shadow-[0_0_35px_rgba(0,229,255,0.2)]">
                  <img 
                    src={APP_MOCKUP} 
                    alt="معاينة تطبيق قبس أندرويد" 
                    className="w-full h-auto object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. Qabas Media Vault & Creative Studio Spotlight */}
      <MediaVaultHomeSection />

      {/* 6. Verified Scholars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-tajawal">
              العلماء والمحاضرون المعتمدون
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              نخبة من كبار العلماء والباحثين في علوم الشريعة والتفسير والفكر المعاصر
            </p>
          </div>
          <Link
            to="/scholars"
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>عرض الجميع ({SCHOLARS_DATA.length})</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {SCHOLARS_DATA.map((scholar) => (
            <Link
              key={scholar.id}
              to={`/scholar/${scholar.id}`}
              className="rounded-2xl bg-[#090E1A] border border-white/10 hover:border-cyan-500/40 p-5 text-center group transition-all duration-300 flex flex-col items-center justify-between"
            >
              <div className="flex flex-col items-center">
                <div className="relative w-20 h-20 rounded-full overflow-hidden mb-4 border-2 border-amber-400/30 group-hover:border-cyan-400/70 transition-colors shadow-md">
                  <img 
                    src={scholar.avatar} 
                    alt={scholar.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    referrerPolicy="no-referrer"
                  />
                  {scholar.verified && (
                    <div className="absolute bottom-0 right-0 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center text-slate-950 border border-slate-900 shadow">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {scholar.name}
                </h3>
                <p className="text-[11px] text-amber-400 font-mono mt-1">
                  {scholar.specialization}
                </p>
                <p className="text-xs text-slate-400 line-clamp-2 mt-2 leading-relaxed text-right">
                  {scholar.bio}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 mt-4 w-full flex items-center justify-around text-[11px] font-mono text-slate-400">
                <span>{scholar.lessonsCount} درس</span>
                <span>·</span>
                <span>{scholar.podcastsCount} حوارات</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Official Announcements / News Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-tajawal">
              آخر الأخبار والبيانات الرسمية
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              متابعة مباشرة لكافة تحديثات المنصة ومستجدات البرامج العلمية
            </p>
          </div>
          <Link
            to="/news"
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
          >
            <span>أرشيف الأخبار</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((article) => (
            <Link
              key={article.id}
              to={`/news/${article.slug}`}
              className="rounded-2xl bg-[#090E1A] border border-white/10 hover:border-emerald-500/40 p-5 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                  <span className="text-emerald-400 font-semibold">{article.categoryLabel}</span>
                  <span className="text-slate-500">{article.publishedAt}</span>
                </div>
                <h3 className="text-sm font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-3 mt-2 leading-relaxed">
                  {article.excerpt}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>قراءة في {article.readTime}</span>
                <span className="text-emerald-400 group-hover:translate-x-[-4px] transition-transform">
                  ← اقرأ البيان
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 7. Real Community Reviews & Rating System */}
      <CommunityReviewsSection />

    </div>
  );
};
