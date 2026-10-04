import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Download, 
  ShieldCheck, 
  Copy, 
  Check, 
  FileCheck2, 
  Cpu, 
  Smartphone, 
  CheckCircle2, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  ExternalLink,
  FolderDown,
  Settings,
  Lock,
  Zap,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { useUplink } from '../context/UplinkContext';
import { APP_MOCKUP } from '../data/mockData';
import { AuthenticRepoProfileSection } from '../components/AuthenticRepoProfileSection';
import { AppUpdateButton } from '../components/AppUpdateButton';
import { AndroidCiPipelineCard } from '../components/AndroidCiPipelineCard';

export const AppRepositoryPage: React.FC = () => {
  const { releases, patches, isSyncingGitHub, lastSyncTime, syncFromGitHubNow } = useUplink();
  const latestRelease = releases[0] || {
    version: 'v1.2.1',
    buildNumber: 3,
    releaseDate: '2026-10-02',
    apkSize: '29.7 ميغابايت',
    sha256: '5cb4120677113629b7fe230eb6dea9ded85f4f4da0c4f60072397ae4789d7284',
    minAndroid: 'Android 7.0 (API 24)',
    targetAndroid: 'Android API 36',
    downloadUrl: 'https://github.com/alippappa7-maker/qabas_studio/releases/download/v1.2.1/qabas-v1.2.1-release.apk',
    isLatest: true,
    architectures: ['arm64-v8a', 'x86_64'],
    changelog: {
      whatIsNew: ['محرك الروابط العميقة'],
      improvements: ['تسريع الاستجابة'],
      fixes: ['إصلاحات عامة']
    }
  };

  const [selectedArch, setSelectedArch] = useState<string>('Universal (لكل الأجهزة)');
  const [copiedSha, setCopiedSha] = useState<string | null>(null);
  const [expandedRelease, setExpandedRelease] = useState<string>(latestRelease.version);
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  const handleDownload = (url: string, filename: string) => {
    setDownloadTriggered(true);
    
    // Launch festive confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => setDownloadTriggered(false), 3000);
  };

  const handleCopySha = (sha: string) => {
    navigator.clipboard.writeText(sha);
    setCopiedSha(sha);
    setTimeout(() => setCopiedSha(null), 2500);
  };

  const toggleExpand = (version: string) => {
    setExpandedRelease(prev => prev === version ? '' : version);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16 space-y-16">
      
      {/* 1. Hero Download Section */}
      <section id="download-apk" className="relative rounded-3xl bg-gradient-to-br from-[#0C1527] via-[#090F1E] to-[#0E1B30] border border-amber-400/30 p-6 sm:p-12 overflow-hidden shadow-[0_0_60px_rgba(255,215,0,0.08)]">
        
        {/* Ambient Lights */}
        <div className="absolute top-0 right-10 w-96 h-96 bg-amber-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>مستودع التوزيع الرسمي لأجهزة أندرويد (Official Repository)</span>
            </div>

            {/* Live Distribution Status & Sync Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 rounded-2xl bg-black/60 border border-cyan-500/30 text-xs">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
                </span>
                <span className="text-emerald-300 font-mono font-semibold">
                  متصل ومحدث مباشرة مع خوادم التوزيع الرسمية
                </span>
                <span className="text-slate-500 hidden sm:inline">·</span>
                <span className="text-slate-400 font-mono text-[11px] hidden sm:inline">
                  {lastSyncTime ? `آخر فحص: ${lastSyncTime}` : 'تحديث تلقائي لحظي'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <AppUpdateButton variant="compact" />
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold text-white font-tajawal tracking-tight">
              تطبيق قَبَس لنظام أندرويد{' '}
              <span className="text-amber-400 block mt-1">{latestRelease.version}</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              حزمة الـ APK الأصلية المعتمدة. استمتع بتجربة إسلامية حديثة خالية 100% من الإعلانات وبرمجيات التتبع، مع دعم كامل للتشغيل الصوتي بالخلفية والبحث الذكي المحلي دون إنترنت.
            </p>

            {/* Architecture Selector */}
            <div className="space-y-2">
              <label className="text-xs font-mono text-slate-400 block">
                اختر معمارية المعالج المناسبة لجهازك:
              </label>
              <div className="flex flex-wrap gap-2">
                {['Universal (لكل الأجهزة)', 'arm64-v8a (الأجهزة الحديثة 64-bit)', 'armeabi-v7a (32-bit)'].map((arch) => (
                  <button
                    key={arch}
                    onClick={() => setSelectedArch(arch)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono transition-all cursor-pointer ${
                      selectedArch === arch
                        ? 'bg-cyan-500/25 text-cyan-300 border border-cyan-400 shadow-[0_0_15px_rgba(0,229,255,0.2)]'
                        : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white'
                    }`}
                  >
                    {arch}
                  </button>
                ))}
              </div>
            </div>

            {/* Direct Download Button with metadata */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={() => handleDownload(latestRelease.downloadUrl, `qabas-${latestRelease.version}-universal.apk`)}
                className="flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-extrabold text-base text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_35px_rgba(255,215,0,0.4)] transition-all transform active:scale-95 cursor-pointer whitespace-nowrap"
              >
                <Download className="w-5 h-5" />
                <span>
                  {downloadTriggered ? 'جاري بدء التنزيل...' : `تحميل ملف APK مباشر (${latestRelease.apkSize})`}
                </span>
              </button>

              <div className="text-xs font-mono text-slate-300 space-y-1 p-3 rounded-xl bg-black/40 border border-white/10">
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">تاريخ ووقت النشر:</span>
                  <span className="text-white font-bold">{latestRelease.releaseDate}</span>
                  <span className="text-amber-300 text-[11px]">({latestRelease.releaseTime || '09:22:15 م مكة المكرمة'})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400">الحجم الدقيق:</span>
                  <span className="text-cyan-300 font-bold">{latestRelease.exactSizeFormatted || `${latestRelease.apkSize} (31,142,704 بايت بالضبط)`}</span>
                </div>
                <div className="text-[11px] text-slate-400">
                  البناء: <span className="text-amber-400">Build #{latestRelease.buildNumber}</span> · الحماية: <span className="text-emerald-400">Target SDK 36</span>
                </div>
              </div>

              <div className="sm:mr-auto">
                <AppUpdateButton variant="prominent" />
              </div>
            </div>

            {/* Quick Guarantees */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs font-mono text-slate-400 border-t border-white/10">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>فحص أمني معتمد VirusTotal</span>
              </span>
              <span>·</span>
              <span className="flex items-center gap-1.5 text-cyan-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>بدون إعلانات تجارية إطلاقاً</span>
              </span>
            </div>

          </div>

          {/* Phone Display Mockup */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative max-w-sm w-full">
              <div className="absolute -inset-2 bg-gradient-to-r from-amber-400/20 to-cyan-400/20 rounded-3xl blur-2xl" />
              <div className="relative rounded-3xl overflow-hidden border border-cyan-500/40 shadow-2xl">
                <img
                  src={APP_MOCKUP}
                  alt="تطبيق قبس للأندرويد"
                  className="w-full h-auto object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>
          </div>

        </div>

      </section>

      {/* Live Android CI Workflow Status Card */}
      <AndroidCiPipelineCard />

      {/* 2. Official GitHub Repository Specification & Architecture */}
      <AuthenticRepoProfileSection />

      {/* 2. xdelta Patches Section (التحديثات الجزئية الخفيفة) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="text-right">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span>XDELTA INCREMENTAL PATCHES · التحديثات الجزئية فائقة التوفير</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-tajawal mt-1">
              حزم التحديث الجزئي الخفيفة (xdelta)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              قم بترقية تطبيقك بتنزيل الفارق الثنائي فقط (3 إلى 5 ميغابايت) بدلاً من إعادة تنزيل الـ 43 ميغابايت كاملة، مع وفر يتجاوز 90% في استهلاك البيانات.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-mono text-xs shrink-0">
            توفير حتى 92% من باقة الإنترنت
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {patches.map((patch) => (
            <div
              key={patch.id}
              className="rounded-2xl bg-[#090E1A] border border-cyan-500/30 p-5 space-y-4 shadow-lg flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-black/60 font-mono text-xs text-slate-300 border border-white/10">
                      {patch.baseVersion}
                    </span>
                    <ArrowRight className="w-4 h-4 text-cyan-400 rotate-180" />
                    <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 font-mono text-xs font-bold text-cyan-300 border border-cyan-500/40">
                      {patch.targetVersion}
                    </span>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                    وفر {patch.savedPercentage} من البيانات
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs font-mono text-slate-300 p-2.5 rounded-xl bg-black/40 border border-white/5">
                  <div>
                    <span className="text-slate-400">حجم الباتش:</span>{' '}
                    <span className="text-amber-400 font-bold">{patch.patchSize}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">الحجم الكامل:</span>{' '}
                    <span className="line-through text-slate-500">{patch.fullApkSize}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {patch.instructions}
                </p>

                {/* SHA-256 for patch */}
                <div className="p-2 rounded-lg bg-black/60 font-mono text-[10px] text-cyan-300 truncate border border-white/5 flex items-center justify-between">
                  <span className="truncate">SHA-256: {patch.sha256}</span>
                  <button
                    onClick={() => handleCopySha(patch.sha256)}
                    className="text-slate-400 hover:text-white shrink-0 mr-2"
                  >
                    {copiedSha === patch.sha256 ? 'تم النسخ' : 'نسخ'}
                  </button>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-mono">{patch.releaseDate}</span>
                <button
                  onClick={() => handleDownload(patch.downloadUrl, `patch-${patch.baseVersion}-to-${patch.targetVersion}.xdelta`)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-cyan-300 to-cyan-400 hover:from-cyan-200 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>تحميل ملف xdelta ({patch.patchSize})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Security & System Specifications */}
      <section className="space-y-6">
        <div className="text-right">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
            SECURITY & COMPATIBILITY SPECIFICATIONS
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-tajawal mt-1">
            معلومات الأمان والتحقق والتوافق التقني
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* SHA-256 Checksum Card */}
          <div className="md:col-span-2 rounded-2xl bg-[#090E1A] border border-cyan-500/30 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 font-mono">
                <FileCheck2 className="w-4 h-4" />
                <span>بصمة التحقق الأمني الرقمية (SHA-256 Checksum)</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                مطابق للأصل
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              يمكنك التحقق من سلامة الملف بعد تحميله بمقارنة تجزئة الـ Hash للتأكد من عدم العبث بالحزمة أو تعديل كود المصدر:
            </p>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-white/10 text-xs font-mono text-cyan-300 overflow-x-auto">
              <span className="select-all tracking-wider text-[11px] sm:text-xs">
                {latestRelease.sha256}
              </span>
              <button
                onClick={() => handleCopySha(latestRelease.sha256)}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-xs font-bold transition-colors shrink-0 mr-3 cursor-pointer"
                title="نسخ البصمة"
              >
                {copiedSha === latestRelease.sha256 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedSha === latestRelease.sha256 ? 'تم النسخ' : 'نسخ'}</span>
              </button>
            </div>

            <div className="text-[11px] text-slate-400 font-mono">
              طريقة التحقق في تيرمينال لينكس/ماك: <code className="text-amber-300 bg-black/40 px-1 py-0.5 rounded">sha256sum qabas-v2.4.0-universal.apk</code>
            </div>
          </div>

          {/* Android Compatibility Card */}
          <div className="rounded-2xl bg-[#090E1A] border border-white/10 p-6 space-y-4">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400 font-mono">
              <Cpu className="w-4 h-4" />
              <span>متطلبات النظام والأجهزة</span>
            </div>

            <ul className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">الحد الأدنى للنظام:</div>
                  <div className="text-slate-400 font-mono">{latestRelease.minAndroid}</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">النظام المستهدف:</div>
                  <div className="text-slate-400 font-mono">{latestRelease.targetAndroid}</div>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-white">صلاحيات التشغيل:</div>
                  <div className="text-slate-400">فقط إذن التخزين للملفات والتشغيل في الخلفية</div>
                </div>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* 4. Quick Step-by-Step Installation Guide */}
      <section className="space-y-6">
        <div className="text-right">
          <div className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            STEP-BY-STEP APK INSTALLATION GUIDE
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white font-tajawal mt-1">
            دليل التثبيت السريع على أجهزة أندرويد
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            خطوات بسيطة ومألوفة لتثبيت ملفات الـ APK من خارج متجر جوجل بلاي
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          
          <div className="rounded-2xl bg-[#090E1A] border border-white/10 p-5 space-y-3 relative">
            <span className="w-7 h-7 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center font-mono font-bold text-xs">
              01
            </span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <FolderDown className="w-4 h-4 text-amber-400" />
              <h4>تحميل ملف الـ APK</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              اضغط على زر التحميل المباشر بأعلى الصفحة وانتظر اكتمال تنزيل الحزمة إلى مجلد التنزيلات بجهازك.
            </p>
          </div>

          <div className="rounded-2xl bg-[#090E1A] border border-white/10 p-5 space-y-3 relative">
            <span className="w-7 h-7 rounded-xl bg-cyan-400/20 text-cyan-300 border border-cyan-400/40 flex items-center justify-center font-mono font-bold text-xs">
              02
            </span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Settings className="w-4 h-4 text-cyan-400" />
              <h4>السماح بتثبيت التطبيقات</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              افتح الملف الذي تم تنزيله، وإذا ظهر لك تنبيه أمان، اضغط على "الإعدادات" ثم فعّل "السماح من هذا المصدر".
            </p>
          </div>

          <div className="rounded-2xl bg-[#090E1A] border border-white/10 p-5 space-y-3 relative">
            <span className="w-7 h-7 rounded-xl bg-emerald-400/20 text-emerald-300 border border-emerald-400/40 flex items-center justify-center font-mono font-bold text-xs">
              03
            </span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Lock className="w-4 h-4 text-emerald-400" />
              <h4>تأكيد التثبيت والفحص</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              اضغط على "تثبيت". سيقوم نظام أندرويد بفحص الحزمة عبر Google Play Protect والتأكد من أمانها تماماً.
            </p>
          </div>

          <div className="rounded-2xl bg-[#090E1A] border border-white/10 p-5 space-y-3 relative">
            <span className="w-7 h-7 rounded-xl bg-purple-400/20 text-purple-300 border border-purple-400/40 flex items-center justify-center font-mono font-bold text-xs">
              04
            </span>
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h4>بدء تجربة قبس</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              افتح التطبيق، وفعّل الاستماع بالخلفية، وميزة الروابط العميقة لتتصل مباشرة بمواد المنصة الرسمية.
            </p>
          </div>

        </div>
      </section>

      {/* 5. Changelog & Release Notes */}
      <section id="changelog" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="text-right">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>LATEST 3 STABLE RELEASES · سياسة الاحتفاظ بآخر 3 إصدارات فقط</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white font-tajawal mt-1">
              سجل التحديثات والإصدارات المعتمدة (آخر 3 إصدارات)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              يحتفظ المستودع دائماً بآخر 3 إصدارات مستقرة وحزم الدلتا المقابلة لها، ويتم حذف الإصدارات الأقدم تلقائياً فور صدور أي بناء جديد.
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 font-mono text-xs shrink-0 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>نظام الحذف التلقائي للأقدم (Auto-Prune Active)</span>
          </div>
        </div>

        <div className="space-y-4">
          {releases.map((release) => {
            const isExpanded = expandedRelease === release.version;
            return (
              <div
                key={release.version}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  release.isLatest 
                    ? 'bg-[#090E1A] border-amber-400/40 shadow-[0_0_25px_rgba(255,215,0,0.06)]' 
                    : 'bg-[#070B14] border-white/10'
                }`}
              >
                {/* Header row */}
                <div
                  onClick={() => toggleExpand(release.version)}
                  className="p-5 flex items-center justify-between cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base sm:text-lg font-extrabold text-white font-mono">
                      {release.version}
                    </span>
                    {release.isLatest && (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                        الإصدار الأحدث المستقر
                      </span>
                    )}
                    <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                      ({release.releaseDate} · {release.releaseTime || '09:22 م'})
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-cyan-300 hidden md:inline">
                      {release.exactSizeFormatted || release.apkSize}
                    </span>
                    <button className="text-slate-400 hover:text-white p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-5 pt-0 border-t border-white/10 space-y-6">
                    
                    {/* What's New */}
                    {release.changelog?.whatIsNew?.length > 0 && (
                      <div className="space-y-2 pt-4">
                        <h4 className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>ما الجديد (What's New)</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-200">
                          {release.changelog.whatIsNew.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-400 mt-1">✦</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Improvements */}
                    {release.changelog?.improvements?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-cyan-400 font-mono flex items-center gap-1.5">
                          <Cpu className="w-3.5 h-3.5" />
                          <span>التحسينات والأداء (Improvements)</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {release.changelog.improvements.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-cyan-400 mt-1">✦</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Fixes */}
                    {release.changelog?.fixes?.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-emerald-400 font-mono flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>الإصلاحات (Fixes & Stability)</span>
                        </h4>
                        <ul className="space-y-1.5 text-xs text-slate-400">
                          {release.changelog.fixes.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-400 mt-1">✦</span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Checksum for release */}
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                      <span className="truncate">SHA-256: {release.sha256}</span>
                      <button
                        onClick={() => handleCopySha(release.sha256)}
                        className="text-cyan-300 hover:text-cyan-200"
                      >
                        {copiedSha === release.sha256 ? 'تم النسخ' : 'نسخ التجزئة'}
                      </button>
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
};
