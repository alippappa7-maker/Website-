import React, { useState } from 'react';
import { 
  Layers, 
  Code2, 
  ShieldCheck, 
  Cpu, 
  Film, 
  Sparkles, 
  BookOpen, 
  Activity, 
  CheckCircle2, 
  Lock, 
  Smartphone,
  ChevronDown,
  ChevronUp,
  Info,
  Sliders,
  Check
} from 'lucide-react';
import { AndroidCiPipelineCard } from './AndroidCiPipelineCard';

interface FeatureGroup {
  id: string;
  title: string;
  badge: string;
  icon: React.ReactNode;
  summary: string;
  features: { name: string; desc: string }[];
}

const APP_CAPABILITIES: FeatureGroup[] = [
  {
    id: 'studio_media',
    title: '1. استوديو الإنتاج المرئي وهندسة الصوت',
    badge: 'استوديو المونتاج والصوت',
    icon: <Film className="w-5 h-5 text-amber-400" />,
    summary: 'بيئة متكاملة لإنتاج ومونتاج الفيديوهات القصيرة (Reels و Shorts)، تسجيل الصوت الاحترافي، والتلقين أثناء التصوير.',
    features: [
      { name: 'محرر الفيديو الذكي ومخرج المونتاج', desc: 'تجميع المسارات المرئية والصوتية وتقطيع المشاهد بسلاسة عالية' },
      { name: 'استوديو هندسة الصوت والمؤثرات (SFX)', desc: 'تسجيل الصوت المباشر مع مكتبة مؤثرات صوتية نقية وتحكم بالمستويات' },
      { name: 'ملقن النصوص التلقائي (Teleprompter)', desc: 'عرض النصوص والآيات تلقائياً بسرعة قابلة للضبط أثناء التصوير' },
      { name: 'محرك التصوير والتصدير السينمائي', desc: 'التقاط الكاميرا بدقة فائقة وتصدير المشاهد بجودة سينمائية عالية' },
      { name: 'مستخرج المقاطع الذكي وإدارة المشاهد', desc: 'قص المقاطع تلقائياً وإدارة مشاهد الانتقالات البصرية' }
    ]
  },
  {
    id: 'ai_engines',
    title: '2. أدوات المساعد الذكي وصناعة المحتوى',
    badge: 'ذكاء اصطناعي ومحرك SEO',
    icon: <Sparkles className="w-5 h-5 text-cyan-400" />,
    summary: 'مساعد ذكي لتوليد الأفكار وهندسة النصوص، واقتراح الوسوم والهاشتاجات الأكثر انتشاراً مع دعم المعالجة المحلية.',
    features: [
      { name: 'المساعد الذكي لتخطيط المحتوى والسيناريو', desc: 'مناقشة الأفكار وصياغة السيناريوهات المناسبة للمحتوى الهادف' },
      { name: 'محرك توليد الوسوم والهاشتاجات الذكية', desc: 'اقتراح الكلمات المفتاحية والوسوم الأكثر فاعلية لزيادة الوصول' },
      { name: 'توليد السلاسل والمحتوى المجدول', desc: 'بناء سلاسل مرئية متتابعة وجدولة خطط النشر الرقمي' },
      { name: 'تصميم البوسترات والصور المصغرة', desc: 'توليد صور مصغرة جذابة وعناوين بصرية مخصصة لمنصات الفيديو' },
      { name: 'محركات التخطيط والتحليل المحلي', desc: 'معالجة ذكية داخل الجهاز بدون الحاجة لاتصال بالإنترنت' }
    ]
  },
  {
    id: 'islamic_vault',
    title: '3. المكتبة الإسلامية والقرآنية التفاعلية',
    badge: 'المصحف والعلوم الشرعية',
    icon: <BookOpen className="w-5 h-5 text-emerald-400" />,
    summary: 'المصحف الشريف بأحكام التجويد الملونة، مشغل التلاوات الصوتية، مواقيت الصلاة، وقارئ الأحاديث وسير الصحابة والعلماء.',
    features: [
      { name: 'مصحف التجويد الملون وقراءة الآيات', desc: 'عرض صفحات المصحف الشريف مع تمييز أحكام التجويد بألوان واضحة' },
      { name: 'مشغل التلاوات الصوتية في الخلفية', desc: 'استماع نقي بدون انقطاع مع دعم قوائم التشغيل ومؤقت النوم' },
      { name: 'حساب مواقيت الصلاة الدقيقة والأذان', desc: 'تنبيهات دقيقة للصلوات الخمس حسب الموقع الجغرافي' },
      { name: 'الأذكار اليومية والسبحة الإلكترونية', desc: 'أذكار الصباح والمساء وحصن المسلم مع عداد رقمي مريح' },
      { name: 'قصص الأنبياء وسير الصحابة والعلماء', desc: 'مكتبة معرفية موثقة في السيرة والتاريخ والتراجم العلمية' },
      { name: 'موسوعة الأحاديث النبوية الصحيحة', desc: 'قارئ النصوص الشرعية وشروحات الأحاديث المعتمدة' }
    ]
  },
  {
    id: 'cloud_diagnostics',
    title: '4. المزامنة السحابية والتحديثات الذكية',
    badge: 'سحابة وتحديثات خفيفة',
    icon: <Activity className="w-5 h-5 text-purple-400" />,
    summary: 'مزامنة فورية للدروس والتسجيلات، تحديثات فائقة التوفير لحجم الباقة، وفحص ذاتي لضمان استقرار التطبيق.',
    features: [
      { name: 'المزامنة السحابية الفورية للمحتوى', desc: 'ربط سحابي آمن لتحديث المواد الصوتية والتسجيلات لحظياً' },
      { name: 'نظام التحديثات الجزئية الخفيفة', desc: 'تحديث التطبيق بـ 3 إلى 5 ميغابايت فقط دون إعادة تحميل الحزمة كاملة' },
      { name: 'الفحص والتشخيص الذاتي للنظام', desc: 'مراقبة صحة الاتصال وحماية التطبيق من أي بطء أو انقطاع' },
      { name: 'مركز الحسنات والإنجاز اليومي', desc: 'مساحة تحفيزية لمتابعة الورد القرآني والمهام الإيمانية اليومية' }
    ]
  }
];

export const AuthenticRepoProfileSection: React.FC = () => {
  const [expandedCat, setExpandedCat] = useState<string>('studio_media');

  const toggleCategory = (id: string) => {
    setExpandedCat(prev => prev === id ? '' : id);
  };

  return (
    <section className="space-y-10 text-right">
      
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 font-mono text-xs">
            <Sliders className="w-3.5 h-3.5 text-cyan-400" />
            <span>FULL SPECIFICATIONS & CAPABILITIES · الدليل الشامل لقدرات التطبيق</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-tajawal">
            المميزات والقدرات الشاملة لتطبيق قَبَس
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            تم بناء المنظومة لتوفر تجربة إسلامية وإعلامية متكاملة تجمع بين أصالة المحتوى وسلاسة الإنتاج
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <AndroidCiPipelineCard variant="compact" />
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>تطبيق وقفي غير ربحي 100%</span>
          </div>
        </div>
      </div>

      {/* 2. Official Technical Identity Bento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl bg-[#090E1A] border border-cyan-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">معرف التطبيق</span>
            <Code2 className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-sm sm:text-base font-extrabold text-white font-mono">
            com.qabas.app
          </div>
          <div className="text-[11px] text-cyan-300 font-mono">
            حزمة رسمية معتمدة
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E1A] border border-amber-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">الإصدار والحجم الدقيق</span>
            <Layers className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-sm sm:text-base font-extrabold text-white font-mono">
            v1.2.1 · 29.7 MB
          </div>
          <div className="text-[10px] text-amber-300 font-mono leading-tight">
            31,142,704 بايت بالضبط · نشر 2026-10-02 (09:22 م)
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E1A] border border-emerald-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">الواجهة والتصميم</span>
            <Smartphone className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-sm sm:text-base font-extrabold text-white font-mono">
            Spatial HUD Dark UI
          </div>
          <div className="text-[11px] text-emerald-300 font-mono">
            واجهة مكانية مريحة للعين
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#090E1A] border border-purple-500/30 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">الخصوصية والأمان</span>
            <Cpu className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-sm sm:text-base font-extrabold text-white font-mono">
            Zero Ads & No Tracking
          </div>
          <div className="text-[11px] text-purple-300 font-mono">
            حماية تامة لبيانات المستخدم
          </div>
        </div>

      </div>

      {/* 3. Core Architecture Pillars */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white font-tajawal flex items-center gap-2">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>أقسام وقدرات التطبيق الرئيسية:</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {APP_CAPABILITIES.map((category) => {
            const isExpanded = expandedCat === category.id;
            return (
              <div
                key={category.id}
                className="rounded-2xl bg-[#090E1A] border border-white/10 hover:border-cyan-500/40 p-5 space-y-4 transition-all shadow-lg flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-xl bg-white/5 border border-white/10">
                        {category.icon}
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white font-tajawal">
                          {category.title}
                        </h4>
                        <span className="text-[10px] font-mono text-slate-400">
                          {category.badge}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {category.summary}
                  </p>

                  {/* Features List */}
                  {isExpanded && (
                    <div className="pt-3 border-t border-white/10 space-y-2">
                      <div className="text-[11px] font-mono text-cyan-400 font-bold">
                        أبرز الأدوات والميزات المتاحة:
                      </div>
                      <div className="space-y-1.5">
                        {category.features.map((feat, idx) => (
                          <div
                            key={idx}
                            className="p-2.5 rounded-xl bg-black/50 border border-white/5 space-y-0.5"
                          >
                            <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5 font-tajawal">
                              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                              <span>{feat.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {feat.desc}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-mono text-slate-400">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>متاح ومفعل في الإصدار الحالي</span>
                  </span>
                  <span>{category.features.length} أدوات متخصصة</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Security & Principles Guarantee */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0C1527] to-[#080D1A] border border-cyan-500/30 space-y-4">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>مبادئ الأمان والجودة المعتمدة في تطبيق قبس:</span>
        </div>

        <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
          <li className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span>خصوصية تامة وحماية البيانات</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              تشفير كامل للاتصالات وعدم جمع أي بيانات شخصية، مع تقليل الأذونات المطلوبة لأدنى حد لازم للتشغيل.
            </p>
          </li>

          <li className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              <span>الذكاء الاصطناعي كمساعد إبداعي</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              الذكاء الاصطناعي أداة مساعدة لصانع المحتوى لترتيب الأفكار والمونتاج، مع الالتزام بالمصادر الشرعية المعتمدة.
            </p>
          </li>

          <li className="p-3 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>عمل وقفي مجاني مدى الحياة</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              مشروع وقفي غير ربحي خالٍ 100% من أي إعلانات تجارية مزعجة ليكون عوناً لكل مسلم في كل مكان.
            </p>
          </li>
        </ul>
      </div>

    </section>
  );
};
