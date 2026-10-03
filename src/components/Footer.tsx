import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Radio, 
  Layers, 
  Newspaper, 
  ExternalLink, 
  Code2, 
  FolderTree, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  Search, 
  Database, 
  Users, 
  FileText, 
  Download,
  Share2,
  Lock
} from 'lucide-react';
import { useUplink } from '../context/UplinkContext';
import { SCHOLARS_DATA } from '../data/mockData';
import { useVisitorStats } from '../context/VisitorStatsContext';

interface SitemapLink {
  label: string;
  url: string;
  tag: string;
  external?: boolean;
}

interface SitemapCategory {
  id: string;
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  links: SitemapLink[];
}

export const Footer: React.FC = () => {
  const { lessons, news, releases } = useUplink();
  const { onlineUsers, totalVisitors } = useVisitorStats();
  const [sitemapExpanded, setSitemapExpanded] = useState(false);
  const [sitemapFilter, setSitemapFilter] = useState('');

  const latestRelease = releases[0];

  // Dynamic tree categories
  const sitemapCategories: SitemapCategory[] = [
    {
      id: 'app',
      title: 'مستودع تطبيق قبس (Android APK)',
      icon: Layers,
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      links: [
        { label: `تحميل الإصدار الأخير (${latestRelease?.version || 'v1.2.1'})`, url: '/app-repository', tag: 'APK' },
        { label: 'سجل التحديثات وإصلاحات الاستقرار', url: '/app-repository', tag: 'Changelog' },
        { label: 'فحص البصمة الرقمية (SHA-256 Checksum)', url: '/app-repository', tag: 'Security' },
        { label: 'دليل التثبيت على نظام Android 7+', url: '/app-repository', tag: 'Guide' },
      ]
    },
    {
      id: 'lessons',
      title: 'المكتبة الصوتية والدروس الفكرية',
      icon: Radio,
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      links: [
        { label: 'كافة المحاضرات والتسجيلات المعتمدة', url: '/lessons', tag: `${lessons.length} مادة` },
        ...lessons.slice(0, 4).map(l => ({
          label: l.title,
          url: `/lesson/${l.id}`,
          tag: l.scholar?.name || l.categoryLabel
        })),
        { label: 'تصفح بودكاست قبس الفكري', url: '/lessons?tab=podcast', tag: 'Podcast' },
      ]
    },
    {
      id: 'media',
      title: 'خزانة الوسائط المفتوحة (Media Vault)',
      icon: Sparkles,
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      links: [
        { label: 'استعراض كل الوسائط والوثائق', url: '/media-vault', tag: 'Vault' },
        { label: 'قسم التسجيلات الصوتية السحابية', url: '/media-vault?tab=audio', tag: 'Audio' },
        { label: 'قسم الصور والمخطوطات التراثية', url: '/media-vault?tab=images', tag: 'Images' },
        { label: 'قسم المقاطع المرئية والمشاهد', url: '/media-vault?tab=videos', tag: 'Video' },
      ]
    },
    {
      id: 'news',
      title: 'بوابة الأخبار والبيانات الرسمية',
      icon: Newspaper,
      color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
      links: [
        { label: 'مركز البيانات والإعلانات الصحفية', url: '/news', tag: 'Press' },
        ...news.slice(0, 3).map(n => ({
          label: n.title,
          url: `/news/${n.slug}`,
          tag: n.category
        }))
      ]
    },
    {
      id: 'scholars',
      title: 'دليل العلماء والمفكرين',
      icon: Users,
      color: 'text-blue-400 border-blue-500/30 bg-blue-500/10',
      links: [
        { label: 'دليل كافة الشخصيات والعلماء', url: '/scholars', tag: 'Directory' },
        ...SCHOLARS_DATA.map(s => ({
          label: s.name,
          url: `/scholar/${s.id}`,
          tag: s.title
        }))
      ]
    },
    {
      id: 'system',
      title: 'الإدارة والمنظومة التقنية',
      icon: Database,
      color: 'text-rose-400 border-rose-500/30 bg-rose-500/10',
      links: [
        { label: 'بوابة رفع التسجيلات (Admin Studio)', url: '/admin/uploader', tag: 'Admin' },
        { label: 'قاعدة بيانات Supabase المزامنة', url: '/admin/uploader', tag: 'Supabase' },
        { label: 'شفرة المصدر على GitHub (qabas_studio)', url: 'https://github.com/alippappa7-maker/qabas_studio', tag: 'OpenSource', external: true }
      ]
    }
  ];

  const filteredCategories = sitemapCategories.map(category => ({
    ...category,
    links: category.links.filter(link => 
      !sitemapFilter.trim() || 
      link.label.toLowerCase().includes(sitemapFilter.toLowerCase()) ||
      category.title.toLowerCase().includes(sitemapFilter.toLowerCase())
    )
  })).filter(c => c.links.length > 0);

  return (
    <footer className="border-t border-white/10 bg-[#060910] text-slate-400 text-xs mt-20 relative overflow-hidden">
      {/* Decorative cosmic gradient bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Top Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-400/20 border border-amber-400/30 text-amber-300 font-serif font-bold text-lg">
                ق
              </div>
              <span className="text-lg font-bold text-white font-tajawal">
                منصة قَبَس <span className="text-xs text-cyan-400 font-mono">QABAS</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              بوابة إسلامية ومعرفية متكاملة تجمع بين أصالة علوم الشريعة والتفسير، وفضاءات الفكر المعاصر، وتطبيقات الهاتف الذكية بتجربة مكانية حديثة (Spatial HUD Tech).
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>مشروع وقفي غير ربحي · خالٍ تماماً من الإعلانات</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 font-mono text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>المتصلون: {onlineUsers} | الزوار: {totalVisitors}</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              روابط سريعة
            </h5>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/lessons" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Radio className="w-3 h-3 text-cyan-400" />
                  مركز الدروس والمحاضرات ({lessons.length})
                </Link>
              </li>
              <li>
                <Link to="/app-repository" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Layers className="w-3 h-3 text-amber-400" />
                  مستودع تطبيق أندرويد ({latestRelease?.version || 'v1.2.1'})
                </Link>
              </li>
              <li>
                <Link to="/media-vault" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  خزانة الوسائط المفتوحة
                </Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                  <Newspaper className="w-3 h-3 text-purple-400" />
                  بوابة الأخبار والبيانات الرسمية
                </Link>
              </li>
            </ul>
          </div>

          {/* Technical Specs */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
              مواصفات المنظومة البرمجية
            </h5>
            <ul className="space-y-1.5 text-[11px] text-slate-400 font-mono">
              <li>حزمة التطبيق: <span className="text-cyan-400">com.qabas.app</span></li>
              <li>الإصدار الفعلي: <span className="text-amber-400">v1.2.1 (Build 3)</span></li>
              <li>دعم النظام: <span className="text-slate-300">Android 7.0 إلى API 36</span></li>
              <li>قاعدة البيانات: <span className="text-emerald-400">Supabase Realtime Sync</span></li>
            </ul>
          </div>
        </div>

        {/* Dynamic Interactive Sitemap Section */}
        <div className="mt-8 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <FolderTree className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white font-tajawal flex items-center gap-2">
                  خريطة الموقع التفاعلية (Dynamic Sitemap)
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-950/60 border border-cyan-500/30 text-cyan-300">
                    محدثة تلقائياً
                  </span>
                </h4>
                <p className="text-[11px] text-slate-400 font-mono">
                  تصفح شجري فوري لكافة صفحات، دروس، أخبار، وحزم المنصة
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Link
                to="/sitemap"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/40 text-xs font-bold font-tajawal text-cyan-300 transition-all shadow-[0_0_15px_rgba(0,229,255,0.2)]"
              >
                <FolderTree className="w-3.5 h-3.5" />
                <span>صفحة الخريطة المستقلة</span>
              </Link>
              <button
                onClick={() => setSitemapExpanded(!sitemapExpanded)}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/40 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer"
              >
                <span>{sitemapExpanded ? 'طي الخريطة' : 'استعراض سريع'}</span>
                {sitemapExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Expanded Sitemap Content */}
          {sitemapExpanded && (
            <div className="mt-4 p-5 rounded-2xl bg-[#090E1A]/90 border border-cyan-500/20 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-300">
              {/* Search filter in sitemap */}
              <div className="relative mb-5 max-w-md">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={sitemapFilter}
                  onChange={(e) => setSitemapFilter(e.target.value)}
                  placeholder="ابحث في أقسام وصفحات الخريطة..."
                  className="w-full pl-3 pr-9 py-1.5 rounded-xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-mono"
                />
              </div>

              {/* Grid of Dynamic Categories */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCategories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div 
                      key={category.id} 
                      className="p-4 rounded-xl bg-slate-900/50 border border-white/5 hover:border-white/10 transition-colors"
                    >
                      <div className="flex items-center gap-2 pb-2.5 mb-3 border-b border-white/5">
                        <div className={`p-1.5 rounded-lg border ${category.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <h5 className="font-bold text-xs text-white font-tajawal">
                          {category.title}
                        </h5>
                      </div>
                      <ul className="space-y-2">
                        {category.links.map((link, idx) => (
                          <li key={idx} className="flex items-center justify-between text-xs group">
                            {link.external ? (
                              <a
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-slate-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5 truncate max-w-[200px]"
                              >
                                <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-cyan-400 shrink-0" />
                                <span className="truncate">{link.label}</span>
                              </a>
                            ) : (
                              <Link
                                to={link.url}
                                className="text-slate-400 group-hover:text-cyan-300 transition-colors flex items-center gap-1.5 truncate max-w-[200px]"
                              >
                                <span className="w-1 h-1 rounded-full bg-cyan-500/40 group-hover:bg-cyan-400 shrink-0" />
                                <span className="truncate">{link.label}</span>
                              </Link>
                            )}
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400 group-hover:text-cyan-300 shrink-0">
                              {link.tag}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 mt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} استوديو ومنصة قبس (com.qabas.app) — صدقة جارية ونفع مستمر بإذن الله ✨</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              صُنع بإحسان في خدمة المحتوى العربي الهادف
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

