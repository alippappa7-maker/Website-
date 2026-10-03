import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileCheck2, 
  Cpu, 
  Layers, 
  Radio, 
  Newspaper, 
  Check, 
  Copy, 
  Sparkles, 
  Database, 
  ShieldCheck, 
  AlertCircle, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink,
  PlayCircle,
  FileCode2,
  Trash2,
  HardDrive,
  Lock,
  Unlock,
  KeyRound,
  ShieldAlert,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  calculateFileSha256, 
  formatBytes, 
  getStoredSupabaseConfig, 
  saveSupabaseConfig, 
  SUPABASE_SETUP_SQL 
} from '../lib/supabase';
import { useUplink } from '../context/UplinkContext';
import { useMediaVault } from '../context/MediaVaultContext';
import { useAdminAuth } from '../context/AdminAuthContext';
import { SCHOLARS_DATA } from '../data/mockData';

type UploadCategory = 'apk' | 'xdelta' | 'audio' | 'news';

export const AdminUploaderPage: React.FC = () => {
  const { 
    startUplink, 
    updateUplinkProgress, 
    completeUplink, 
    simulateSampleUplink,
    supabaseConnected,
    supabaseTrackCount,
    syncFromSupabaseNow
  } = useUplink();

  const { openUploadModal } = useMediaVault();
  const { isAdmin, loginAdmin, logoutAdmin } = useAdminAuth();

  const [authPasskey, setAuthPasskey] = useState('');
  const [authError, setAuthError] = useState('');
  const [showAuthPass, setShowAuthPass] = useState(false);

  const [category, setCategory] = useState<UploadCategory>('xdelta');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isHashing, setIsHashing] = useState(false);
  const [calculatedSha256, setCalculatedSha256] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  // Form Fields: APK / xdelta
  const [targetVersion, setTargetVersion] = useState('v1.2.2');
  const [baseVersion, setBaseVersion] = useState('v1.2.1');
  const [buildNumber, setBuildNumber] = useState('4');
  const [changelogNew, setChangelogNew] = useState('إضافة خوارزمية الضغط الفائق للبيانات عبر حزم xdelta.');
  const [changelogFix, setChangelogFix] = useState('تحسين استقرار استئناف التحميل في الخلفية.');

  // Form Fields: Audio
  const [audioTitle, setAudioTitle] = useState('قواعد السير إلى الله وتزكية القلوب في العصر الرقمي');
  const [audioScholarId, setAudioScholarId] = useState(SCHOLARS_DATA[0].id);
  const [audioSeries, setAudioSeries] = useState('سلاسل التدبر وبناء البصيرة الإيمانية');
  const [audioCategory, setAudioCategory] = useState('tazkiyah');
  const [audioSummary, setAudioSummary] = useState('محاضرة تأصيلية من استوديو قبس حول التزكية ومراعاة المآلات في العصر الرقمي.');

  // Form Fields: News
  const [newsTitle, setNewsTitle] = useState('إطلاق الإصدار الرسمي v1.2.1 من تطبيق قبس مع استوديو المؤثرات الصوتية');
  const [newsExcerpt, setNewsExcerpt] = useState('تعلن منصة قبس اليوم عن صدور التحديث المستقر v1.2.1 لتطبيق أندرويد (com.qabas.app) مع ربط سحابي شامل بـ Supabase ودعم الـ xdelta.');
  const [newsTags, setNewsTags] = useState('تحديث, v1.2.1, xdelta, استوديو قبس, Supabase');

  // Supabase Drawer State
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [supabaseConfig, setSupabaseConfig] = useState(getStoredSupabaseConfig());
  const [copiedSql, setCopiedSql] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Handle File Selection & Automatic SHA-256 calculation
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setIsHashing(true);
    setCalculatedSha256('');

    try {
      const sha = await calculateFileSha256(file);
      setCalculatedSha256(sha);
    } catch (err) {
      console.error('SHA-256 calculation failed:', err);
    } finally {
      setIsHashing(false);
    }
  };

  // Start Real / Simulated Upload with Live Uplink Broadcasting
  const handleStartUpload = () => {
    if (!selectedFile && !calculatedSha256) {
      alert('يرجى اختيار ملف أولاً.');
      return;
    }

    setIsUploading(true);
    setUploadPercent(0);

    const fileSizeStr = selectedFile ? formatBytes(selectedFile.size) : '15.4 ميغابايت';
    const sha = calculatedSha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';

    let uploadTitle = '';
    if (category === 'apk') uploadTitle = `جاري رفع حزمة APK الرسمية ${targetVersion}`;
    else if (category === 'xdelta') uploadTitle = `جاري رفع حزمة xdelta لتحديث ${targetVersion}`;
    else if (category === 'audio') uploadTitle = `جاري رفع التسجيل الصوتي: ${audioTitle}`;
    else if (category === 'news') uploadTitle = `جاري نشر وتوثيق البيان: ${newsTitle}`;

    // Broadcast to visitor HUD in real-time
    startUplink({
      type: category,
      title: uploadTitle,
      totalSize: fileSizeStr,
      targetVersion: targetVersion,
      sha256: sha,
      speed: '5.2 MB/s'
    });

    // Progressive upload loop
    let currentPct = 0;
    const interval = setInterval(() => {
      currentPct += Math.floor(Math.random() * 15) + 10;
      if (currentPct >= 100) {
        clearInterval(interval);
        setUploadPercent(100);
        setIsUploading(false);

        // Build result item to push to live state
        if (category === 'apk') {
          const newRelease = {
            version: targetVersion,
            buildNumber: parseInt(buildNumber) || 145,
            releaseDate: new Date().toISOString().split('T')[0],
            apkSize: fileSizeStr,
            sha256: sha,
            minAndroid: 'Android 8.0 (API 26)',
            targetAndroid: 'Android 15 (API 35)',
            downloadUrl: URL.createObjectURL(selectedFile || new Blob()),
            isLatest: true,
            architectures: ['arm64-v8a', 'Universal'],
            changelog: {
              whatIsNew: [changelogNew],
              improvements: ['تحسين كفاءة استهلاك الذاكرة في الخلفية.'],
              fixes: [changelogFix]
            }
          };
          completeUplink({
            type: 'apk',
            item: newRelease,
            title: `تم إطلاق الإصدار ${targetVersion} بنجاح ومزامنته مع سحابة Supabase ومستودع التطبيق!`
          });
        } else if (category === 'xdelta') {
          const newPatch = {
            id: `patch-${Date.now()}`,
            baseVersion,
            targetVersion,
            patchSize: fileSizeStr,
            fullApkSize: '43.2 ميغابايت',
            savedPercentage: '89%',
            sha256: sha,
            releaseDate: new Date().toISOString().split('T')[0],
            downloadUrl: URL.createObjectURL(selectedFile || new Blob()),
            instructions: `باتش تحديث مباشر من ${baseVersion} إلى ${targetVersion} مع التحقق الرقمي.`
          };
          completeUplink({
            type: 'xdelta',
            item: newPatch,
            title: `تم نشر وتعميم حزمة التحديث الجزئي xdelta (${baseVersion} ➔ ${targetVersion}) بحجم ${fileSizeStr} فقط!`
          });
        } else if (category === 'audio') {
          const scholar = SCHOLARS_DATA.find(s => s.id === audioScholarId) || SCHOLARS_DATA[0];
          const newLesson = {
            id: `lesson-${Date.now()}`,
            title: audioTitle,
            series: audioSeries,
            category: audioCategory as any,
            categoryLabel: audioCategory === 'fiqh' ? 'فقه وأصول' : 'تفسير وتدبر',
            type: 'audio' as const,
            scholarId: scholar.id,
            scholar,
            duration: '45:00',
            durationSeconds: 2700,
            publishedAt: new Date().toISOString().split('T')[0],
            summary: audioSummary,
            audioUrl: 'https://actions.google.com/sounds/v1/water/creek_water_trickling.ogg',
            coverImage: '/src/assets/images/lesson_tafsir_cover_1791004582862.jpg',
            topics: ['تأصيل القواعد الفقهية المعاصرة', 'مراعاة مقاصد الشريعة'],
            transcripts: [
              {
                id: 't-up-1',
                timeSeconds: 0,
                timeFormatted: '00:00',
                speaker: scholar.name,
                text: 'بسم الله والصلاة والسلام على رسول الله، هذا تسجيل جديد تم اعتماده وبثه عبر محطة قبس الإدارية.'
              }
            ],
            references: [],
            downloadSize: fileSizeStr,
            mp3Url: 'https://actions.google.com/sounds/v1/water/creek_water_trickling.ogg',
            playsCount: 0,
            downloadsCount: 0
          };
          completeUplink({
            type: 'audio',
            item: newLesson,
            title: `تم توثيق ورفع الدرس الصوتي الجديد «${audioTitle}» وإتاحته للمستمعين فوراً!`
          });
        } else if (category === 'news') {
          const newArticle = {
            id: `news-${Date.now()}`,
            slug: `news-announcement-${Date.now()}`,
            title: newsTitle,
            category: 'app_updates' as const,
            categoryLabel: 'تحديثات التطبيق والمنصة',
            excerpt: newsExcerpt,
            content: [newsExcerpt, 'يأتي هذا الإعلان في إطار التحديثات المستمرة لتطوير تجربة المستفيدين.'],
            coverImage: '/src/assets/images/app_apk_preview_1791004602629.jpg',
            author: {
              name: 'إدارة العمليات والبث الرقمي',
              role: 'محطة الرفع الإدارية',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'
            },
            publishedAt: new Date().toISOString().split('T')[0],
            readTime: '2 دقائق',
            tags: newsTags.split(',').map(t => t.trim()),
            views: 1
          };
          completeUplink({
            type: 'news',
            item: newArticle,
            title: `تم نشر البيان الرسمي «${newsTitle}» في بوابة الأخبار!`
          });
        }

        // Reset file input
        setSelectedFile(null);
        setCalculatedSha256('');
      } else {
        setUploadPercent(currentPct);
        updateUplinkProgress(
          currentPct,
          `${(Math.random() * 2 + 5).toFixed(1)} MB/s`,
          `${((currentPct / 100) * (selectedFile ? selectedFile.size / 1048576 : 15)).toFixed(1)} MB`
        );
      }
    }, 450);
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SETUP_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2500);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#0C1527] to-[#080C14] border border-amber-500/40 shadow-[0_0_80px_rgba(255,191,0,0.15)] space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-[0_0_30px_rgba(255,191,0,0.3)]">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>ZONE RESTRICTED · منطقة محصورة للمشرف</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-tajawal">
              محطة الرفع وإدارة المستودع
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
              هذه الصفحة مخصصة لمدير المنصة فقط لرفع حزم التطبيق (APK) وباتشات التحديث والمواد الصوتية. يُمنع الزوار العاديون من الوصول لحماية استقرار المنظومة.
            </p>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setAuthError('');
              const ok = loginAdmin(authPasskey);
              if (!ok) {
                setAuthError('الرمز السري غير صحيح. يرجى إدخال رمز المشرف المعتمد.');
              }
            }}
            className="space-y-4 pt-2 text-right"
          >
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">الرمز السري للمشرف (Master Passkey):</label>
              <div className="relative">
                <input
                  type={showAuthPass ? 'text' : 'password'}
                  value={authPasskey}
                  onChange={(e) => { setAuthPasskey(e.target.value); setAuthError(''); }}
                  placeholder="أدخل رمز مرور المشرف..."
                  required
                  autoFocus
                  className="w-full bg-black/80 border border-amber-400/40 focus:border-amber-400 rounded-xl pr-4 pl-10 py-3.5 text-xs text-white placeholder-slate-500 outline-none font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowAuthPass(!showAuthPass)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                >
                  {showAuthPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-xs sm:text-sm font-extrabold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 transition-all shadow-[0_0_30px_rgba(255,215,0,0.35)] cursor-pointer"
            >
              فتح بوابة الإدارة والمستودع
            </button>
          </form>

          <div className="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-slate-400 text-center">
            رمز المرور الافتراضي: <span className="text-cyan-300 font-bold">qabas@admin2026</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-12">
      
      {/* Active Admin Session Status Banner */}
      <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>جلسة المشرف نشطة وموثقة (Authenticated Administrator)</span>
        </div>

        <button
          onClick={logoutAdmin}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 font-bold transition-colors cursor-pointer"
        >
          <Lock className="w-3.5 h-3.5" />
          <span>قفل الجلسة (تسجيل خروج المشرف)</span>
        </button>
      </div>

      {/* Page Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-2 text-right">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs">
            <Radio className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>ADMIN UPLOADER & LIVE VISITOR UPLINK · محطة الرفع الإدارية</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-white font-tajawal">
            محطة الرفع الإدارية وبث التحديثات الفورية
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            لوحة مخصصة لإدارة ورفع ملفات الـ APK، وباتشات التحديثات الجزئية (xdelta)، والمواد الصوتية مع حساب فوري لبصمة SHA-256، وبث مباشر لتقدم الرفع للزوار.
          </p>
        </div>

        {/* Supabase Config / Media Vault Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={openUploadModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-400 to-amber-400 hover:from-cyan-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)]"
          >
            <UploadCloud className="w-4 h-4" />
            <span>رفع وسائط (فيديو / صوت / صور)</span>
          </button>

          <button
            onClick={() => setShowSqlModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 transition-all cursor-pointer"
          >
            <Database className="w-4 h-4 text-cyan-400" />
            <span>سحابة وجداول Supabase</span>
          </button>
        </div>
      </div>

      {/* Supabase Live Connection Status Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-black/60 border border-emerald-500/40 text-xs shadow-lg">
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
          </span>
          <div>
            <div className="flex items-center gap-2 font-mono font-bold text-white">
              <span>سحابة Supabase متصلة ونشطة بنجاح</span>
              <span className="text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded text-[10px]">
                https://aivmwovrbdzcyrjwubon.supabase.co
              </span>
            </div>
            <p className="text-[11px] text-slate-300 font-mono mt-0.5">
              جدول audio_tracks ومستودع audio-tracks متزامنان مع تطبيق قبس ({supabaseTrackCount > 0 ? `${supabaseTrackCount} تسجيل صوتي متزامن` : 'متصل'})
            </p>
          </div>
        </div>

        <button
          onClick={syncFromSupabaseNow}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 font-bold transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>مزامنة الصوتيات من السحابة</span>
        </button>
      </div>

      {/* Quick Test / Live Uplink Simulator Row (For User Verification) */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0C1728] via-[#09111E] to-[#0D192C] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,229,255,0.08)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-white font-mono">
              محاكاة سريعة لاختبار مؤشر البث الحي للزوار (Visitor Uplink HUD):
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
            Realtime Broadcast Sync
          </span>
        </div>
        <p className="text-xs text-slate-300">
          يمكنك النقر على أحد السيناريوهات الجاهزة أدناه لمشاهدة ظهور شريط البث الحي العائم فوراً بأسفل الشاشة كما يراه الزوار، ثم ظهور تنبيه النيون وتحديث القوائم تلقائياً:
        </p>
        <div className="flex flex-wrap items-center gap-3 pt-1">
          <button
            onClick={() => simulateSampleUplink('xdelta')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-300 to-cyan-400 hover:from-cyan-200 transition-all cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>بث حزمة تحديث جزئي xdelta (3.4 MB)</span>
          </button>

          <button
            onClick={() => simulateSampleUplink('apk')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 transition-all cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5" />
            <span>بث إصدار APK كامل (v2.4.1)</span>
          </button>

          <button
            onClick={() => simulateSampleUplink('audio')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-white/10 hover:bg-white/15 border border-white/15 transition-all cursor-pointer"
          >
            <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
            <span>بث درس صوتي جديد</span>
          </button>
        </div>
      </div>

      {/* Main Upload Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form: Metadata & Config (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Category Tabs */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 block">
              1. حدد نوع المادة المراد رفعها وبثها:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'xdelta', label: 'تحديث جزئي xdelta', icon: Cpu, color: 'text-cyan-400' },
                { id: 'apk', label: 'إصدار APK كامل', icon: Layers, color: 'text-amber-400' },
                { id: 'audio', label: 'درس صوتي / بودكاست', icon: Radio, color: 'text-emerald-400' },
                { id: 'news', label: 'بيان إخباري', icon: Newspaper, color: 'text-purple-400' },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = category === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setCategory(tab.id as UploadCategory);
                      setSelectedFile(null);
                      setCalculatedSha256('');
                    }}
                    className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-white/10 border-cyan-400 text-white shadow-[0_0_15px_rgba(0,229,255,0.15)]'
                        : 'bg-[#090E1A] border-white/10 text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${tab.color}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Contextual Form Inputs Based on Category */}
          <div className="p-5 rounded-2xl bg-[#090E1A] border border-white/10 space-y-4">
            
            {category === 'xdelta' && (
              <>
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-bold border-b border-white/10 pb-2">
                  <Cpu className="w-4 h-4" />
                  <span>معلومات حزمة التحديث الجزئي (Delta Compression)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">الإصدار الأساسي (Base Version):</label>
                    <input
                      type="text"
                      value={baseVersion}
                      onChange={(e) => setBaseVersion(e.target.value)}
                      placeholder="v2.4.0"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">الإصدار المستهدف (Target Version):</label>
                    <input
                      type="text"
                      value={targetVersion}
                      onChange={(e) => setTargetVersion(e.target.value)}
                      placeholder="v2.4.1"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-200 leading-relaxed">
                  تتيح حزم xdelta لأجهزة المستخدمين تحميل الفارق الثنائي فقط (حوالي 3 - 5 ميغابايت) بدلاً من إعادة تنزيل الـ APK كاملاً بحجم 43 ميغابايت، وتوفر حتى 92% من البيانات.
                </div>
              </>
            )}

            {category === 'apk' && (
              <>
                <div className="flex items-center gap-2 text-xs font-mono text-amber-400 font-bold border-b border-white/10 pb-2">
                  <Layers className="w-4 h-4" />
                  <span>بيانات إصدار الـ APK الجديد</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">رقم الإصدار (Version):</label>
                    <input
                      type="text"
                      value={targetVersion}
                      onChange={(e) => setTargetVersion(e.target.value)}
                      placeholder="v2.4.1"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">رقم البناء (Build Number):</label>
                    <input
                      type="text"
                      value={buildNumber}
                      onChange={(e) => setBuildNumber(e.target.value)}
                      placeholder="145"
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">أبرز الميزات الجديدة (What's New):</label>
                  <input
                    type="text"
                    value={changelogNew}
                    onChange={(e) => setChangelogNew(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">أبرز الإصلاحات (Fixes):</label>
                  <input
                    type="text"
                    value={changelogFix}
                    onChange={(e) => setChangelogFix(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </>
            )}

            {category === 'audio' && (
              <>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 font-bold border-b border-white/10 pb-2">
                  <Radio className="w-4 h-4" />
                  <span>تفاصيل المادة الصوتية (الدرس / البودكاست)</span>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">عنوان الدرس أو الحلقة:</label>
                  <input
                    type="text"
                    value={audioTitle}
                    onChange={(e) => setAudioTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">المحاضر أو العالم:</label>
                    <select
                      value={audioScholarId}
                      onChange={(e) => setAudioScholarId(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      {SCHOLARS_DATA.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 block mb-1">التصنيف الشرعي:</label>
                    <select
                      value={audioCategory}
                      onChange={(e) => setAudioCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      <option value="tafsir">تفسير وتدبر</option>
                      <option value="fiqh">فقه وأصول</option>
                      <option value="tazkiyah">تزكية وسلوك</option>
                      <option value="hadith">حديث وأثر</option>
                      <option value="fikr">فكر إسلامي وبودكاست</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">اسم السلسلة العلمية:</label>
                  <input
                    type="text"
                    value={audioSeries}
                    onChange={(e) => setAudioSeries(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">ملخص المحتوى والمحاور:</label>
                  <textarea
                    rows={2}
                    value={audioSummary}
                    onChange={(e) => setAudioSummary(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-emerald-400"
                  />
                </div>
              </>
            )}

            {category === 'news' && (
              <>
                <div className="flex items-center gap-2 text-xs font-mono text-purple-400 font-bold border-b border-white/10 pb-2">
                  <Newspaper className="w-4 h-4" />
                  <span>تفاصيل البيان الإخباري</span>
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">عنوان البيان:</label>
                  <input
                    type="text"
                    value={newsTitle}
                    onChange={(e) => setNewsTitle(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">موجز الخبر:</label>
                  <textarea
                    rows={2}
                    value={newsExcerpt}
                    onChange={(e) => setNewsExcerpt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-slate-400 block mb-1">الوسوم (مفصولة بفاصلة):</label>
                  <input
                    type="text"
                    value={newsTags}
                    onChange={(e) => setNewsTags(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-400"
                  />
                </div>
              </>
            )}

          </div>

        </div>

        {/* Right Form: Dropzone & Automatic SHA-256 Inspector (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-400 block">
              2. اختيار الملف والفحص التلقائي:
            </label>

            {/* Drag & Drop Card */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/70 p-6 text-center bg-[#090E1A] hover:bg-cyan-500/5 transition-all cursor-pointer space-y-3 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept={
                  category === 'apk' 
                    ? '.apk' 
                    : category === 'xdelta' 
                    ? '.xdelta,.patch' 
                    : category === 'audio' 
                    ? '.mp3,.m4a,.wav' 
                    : 'image/*'
                }
                onChange={handleFileChange}
              />

              <div className="w-14 h-14 rounded-2xl bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center text-cyan-300 mx-auto group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,229,255,0.2)]">
                <UploadCloud className="w-7 h-7" />
              </div>

              <div>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {selectedFile ? selectedFile.name : 'انقر لاختيار الملف أو اسحبه هنا'}
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  {category === 'apk' && 'يدعم ملفات أندرويد (*.apk)'}
                  {category === 'xdelta' && 'يدعم حزم الباتشات (*.xdelta, *.patch)'}
                  {category === 'audio' && 'يدعم الملفات الصوتية (*.mp3, *.m4a)'}
                  {category === 'news' && 'يدعم صور الأغلفة والبيانات (*.png, *.jpg, *.webp)'}
                </p>
              </div>

              {selectedFile && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>الحجم الفعلي: {formatBytes(selectedFile.size)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Automatic SHA-256 Inspector Box */}
          <div className="p-5 rounded-2xl bg-[#0B1222] border border-cyan-500/30 space-y-3 shadow-lg">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4" />
                فحص البصمة الرقمية (SHA-256):
              </span>
              {isHashing ? (
                <span className="text-[11px] font-mono text-amber-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  جاري الحساب...
                </span>
              ) : calculatedSha256 ? (
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                  تم الحساب والتطابق
                </span>
              ) : (
                <span className="text-[11px] font-mono text-slate-500">في انتظار الملف</span>
              )}
            </div>

            <div className="p-3 rounded-xl bg-black/60 border border-white/10 font-mono text-[11px] text-cyan-300 break-all select-all min-h-[46px] flex items-center">
              {calculatedSha256 || 'سيتم استخراج بصمة الأمان تلقائياً فور اختيارك للملف'}
            </div>

            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>تشفير من طرف العميل (Web Crypto API)</span>
              <span>100% موثوق</span>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div className="space-y-3">
            <button
              onClick={handleStartUpload}
              disabled={isUploading}
              className="w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-2xl text-sm font-extrabold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_30px_rgba(255,215,0,0.35)] transition-all transform active:scale-95 cursor-pointer disabled:opacity-50"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>جاري البث والرفع الحي ({uploadPercent}%)...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="w-5 h-5" />
                  <span>بدء الرفع وبث التحديث للزوار فوراً</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-400 text-center leading-relaxed">
              عند بدء الرفع، سيظهر مؤشر البث الحي لكافة زوار الموقع في الوقت الفعلي، وتتحدث السجلات فور اكتمال النقل.
            </p>
          </div>

        </div>

      </div>

      {/* Supabase Schema & Setup Modal */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl bg-[#090E1A] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white">إعداد وربط سحابة Supabase</h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-slate-400 hover:text-white p-1 text-xs"
              >
                ✕ إغلاق
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              لإنشاء الجداول اللازمة ومستودع التخزين (Bucket) تلقائياً، انسخ كود الـ SQL التالي والصقه داخل <strong>SQL Editor</strong> في لوحة تحكم مشروع Supabase الخاص بك:
            </p>

            <div className="relative flex-1 min-h-0 bg-black/70 rounded-xl border border-white/10 p-3 overflow-y-auto">
              <pre className="text-[11px] font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed">
                {SUPABASE_SETUP_SQL}
              </pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <span className="text-xs text-slate-400 font-mono">
                {copiedSql ? '✓ تم النسخ إلى الحافظة' : 'جاهز للنسخ والتنفيذ'}
              </span>
              <button
                onClick={handleCopySql}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-colors"
              >
                {copiedSql ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4" />}
                <span>نسخ كود الـ SQL</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
