import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  FolderTree, 
  Search, 
  Layers, 
  Radio, 
  Sparkles, 
  Newspaper, 
  Users, 
  ShieldCheck, 
  ExternalLink, 
  Copy, 
  Check, 
  FileCode2, 
  Compass, 
  ArrowLeft,
  ArrowRight,
  Database,
  Eye,
  Terminal,
  Activity,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useUplink } from '../context/UplinkContext';
import { useMediaVault } from '../context/MediaVaultContext';
import { SCHOLARS_DATA, PODCASTS_DATA, REPOSITORY_PROFILE } from '../data/mockData';

type SitemapCategoryKey = 'all' | 'app' | 'quran' | 'vault' | 'news' | 'scholars' | 'admin';

interface SitemapItem {
  id: string;
  title: string;
  titleEn: string;
  url: string;
  category: SitemapCategoryKey;
  categoryLabel: string;
  categoryLabelEn: string;
  description: string;
  descriptionEn: string;
  priority: string;
  changeFreq: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly';
  lastModified: string;
  badge?: string;
  isExternal?: boolean;
}

export const SitemapPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');
  const { releases, lessons, news } = useUplink();
  const { mediaItems } = useMediaVault();

  const [activeTab, setActiveTab] = useState<SitemapCategoryKey>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedXml, setCopiedXml] = useState(false);
  const [viewMode, setViewMode] = useState<'visual' | 'xml'>('visual');

  const latestRelease = releases[0];

  // Dynamic Comprehensive Sitemap Registry
  const sitemapItems: SitemapItem[] = useMemo(() => {
    const items: SitemapItem[] = [
      // Main Core Pages
      {
        id: 'home',
        title: 'الصفحة الرئيسية واستوديو قبس',
        titleEn: 'Homepage & Qabas Studio Ecosystem',
        url: '/',
        category: 'app',
        categoryLabel: 'المنصة الرئيسية',
        categoryLabelEn: 'Core Platform',
        description: 'بوابة قبس الرقمية الشاملة والمشغل الصوتي الحي وبطاقة التعريف المكانية.',
        descriptionEn: 'Main Qabas digital portal, live continuous audio player, and spatial HUD showcase.',
        priority: '1.0',
        changeFreq: 'daily',
        lastModified: '2026-10-03',
        badge: 'Core'
      },
      {
        id: 'app-repo',
        title: 'مستودع حزم التطبيق (APK & xdelta Repository)',
        titleEn: 'Android App & Patches Repository',
        url: '/app-repository',
        category: 'app',
        categoryLabel: 'مستودع التطبيق',
        categoryLabelEn: 'App Repository',
        description: 'تنزيل حزم APK الرسمية، باتشات التحديث xdelta، وفحص البصمة الرقمية SHA-256.',
        descriptionEn: 'Download official APK builds, xdelta micro-patches, and verify SHA-256 checksums.',
        priority: '0.95',
        changeFreq: 'weekly',
        lastModified: latestRelease?.releaseDate || '2026-10-02',
        badge: `v${latestRelease?.version || '1.2.1'}`
      },
      {
        id: 'lessons-hub',
        title: 'مركز التلاوات والدروس والبودكاست',
        titleEn: 'Quran Recitations, Lessons & Podcasts Hub',
        url: '/lessons',
        category: 'quran',
        categoryLabel: 'المكتبة الصوتية',
        categoryLabelEn: 'Audio Library',
        description: 'مكتبة صوتية عالية الجودة 320kbps، تلاوات خاشعة، وتفريغ نصي متزامن.',
        descriptionEn: 'Master 320kbps audio recitations, spiritual lessons, and synchronized transcripts.',
        priority: '0.90',
        changeFreq: 'daily',
        lastModified: '2026-10-02',
        badge: `${lessons.length} مادة`
      },
      {
        id: 'media-vault',
        title: 'خزانة الوسائط السحابية المفتوحة',
        titleEn: 'Open Cloud Media Vault',
        url: '/media-vault',
        category: 'vault',
        categoryLabel: 'خزانة الوسائط',
        categoryLabelEn: 'Media Vault',
        description: 'استعراض ورفع المقاطع الصوتية، الفيديوهات، التصاميم والمخطوطات.',
        descriptionEn: 'Curate, upload, and browse shared Islamic media, videos, audio, and graphics.',
        priority: '0.85',
        changeFreq: 'daily',
        lastModified: '2026-10-03',
        badge: `${mediaItems.length} وسيط`
      },
      {
        id: 'news-portal',
        title: 'بوابة الأخبار والبيانات الرسمية',
        titleEn: 'Official News & Press Portal',
        url: '/news',
        category: 'news',
        categoryLabel: 'الأخبار والبيانات',
        categoryLabelEn: 'News & Releases',
        description: 'البيانات الصحفية وإعلانات التحديثات ومستجدات المنظومة.',
        descriptionEn: 'Official announcements, version updates, and platform telemetry releases.',
        priority: '0.80',
        changeFreq: 'weekly',
        lastModified: '2026-10-02',
        badge: `${news.length} بيان`
      },
      {
        id: 'scholars-portal',
        title: 'دليل القراء والعلماء المعتمدين',
        titleEn: 'Verified Scholars & Reciters Directory',
        url: '/scholars',
        category: 'scholars',
        categoryLabel: 'القراء والعلماء',
        categoryLabelEn: 'Scholars & Reciters',
        description: 'سير القراء والعلماء وإحصائيات الدروس والتلاوات المسجلة لهم.',
        descriptionEn: 'Biographies and catalogue of reciters, Imams, and verified academic contributors.',
        priority: '0.80',
        changeFreq: 'monthly',
        lastModified: '2026-09-28',
        badge: `${SCHOLARS_DATA.length} قراء`
      },
      {
        id: 'admin-uploader',
        title: 'لوحة المشرف ومحطة الرفع السحابي (Admin Studio)',
        titleEn: 'Admin Studio & Cloud Telemetry Station',
        url: '/admin/uploader',
        category: 'admin',
        categoryLabel: 'لوحة الإدارة',
        categoryLabelEn: 'Admin Studio',
        description: 'بوابة المشرف لرفع حزم التطبيق، مزامنة جداول Supabase، وتوليد بصمات التشفير.',
        descriptionEn: 'Admin portal to upload APK/xdelta builds, sync Supabase database, and broadcast uplinks.',
        priority: '0.50',
        changeFreq: 'always',
        lastModified: '2026-10-03',
        badge: 'Admin'
      }
    ];

    // Dynamic Lessons Pages
    lessons.forEach((l) => {
      items.push({
        id: `lesson-${l.id}`,
        title: l.title,
        titleEn: `${l.title} — ${l.scholar?.name || 'Qabas'}`,
        url: `/lesson/${l.id}`,
        category: 'quran',
        categoryLabel: l.categoryLabel || 'تلاوة قرآنية',
        categoryLabelEn: 'Recitation',
        description: l.summary || 'تسجيل صوتي عالي النقاء.',
        descriptionEn: l.summary || 'High fidelity Quran recitation.',
        priority: '0.75',
        changeFreq: 'monthly',
        lastModified: l.publishedAt || '2026-10-02',
        badge: l.duration
      });
    });

    // Dynamic Podcast Episodes
    PODCASTS_DATA.forEach((p) => {
      items.push({
        id: `podcast-${p.id}`,
        title: p.title,
        titleEn: p.title,
        url: `/podcast/${p.id}`,
        category: 'quran',
        categoryLabel: 'بودكاست قبس',
        categoryLabelEn: 'Podcast Episode',
        description: p.summary,
        descriptionEn: p.summary,
        priority: '0.70',
        changeFreq: 'monthly',
        lastModified: p.publishedAt,
        badge: `حلقة ${p.episodeNumber}`
      });
    });

    // Dynamic News Articles
    news.forEach((n) => {
      items.push({
        id: `news-${n.id}`,
        title: n.title,
        titleEn: n.title,
        url: `/news/${n.slug}`,
        category: 'news',
        categoryLabel: n.categoryLabel || 'خبر رسمي',
        categoryLabelEn: 'Official Announcement',
        description: n.excerpt,
        descriptionEn: n.excerpt,
        priority: '0.75',
        changeFreq: 'monthly',
        lastModified: n.publishedAt,
        badge: n.readTime
      });
    });

    // Dynamic Scholars Profiles
    SCHOLARS_DATA.forEach((s) => {
      items.push({
        id: `scholar-${s.id}`,
        title: s.name,
        titleEn: s.name,
        url: `/scholar/${s.id}`,
        category: 'scholars',
        categoryLabel: s.title,
        categoryLabelEn: s.title,
        description: s.bio,
        descriptionEn: s.bio,
        priority: '0.70',
        changeFreq: 'monthly',
        lastModified: '2026-10-01',
        badge: `${s.lessonsCount} تسجيل`
      });
    });

    return items;
  }, [releases, lessons, news, mediaItems, latestRelease]);

  // Filter items
  const filteredItems = useMemo(() => {
    return sitemapItems.filter((item) => {
      const matchesCategory = activeTab === 'all' || item.category === activeTab;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        item.title.toLowerCase().includes(q) ||
        item.titleEn.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.url.toLowerCase().includes(q) ||
        item.categoryLabel.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [sitemapItems, activeTab, searchQuery]);

  // XML Sitemap Generator String
  const generatedXml = useMemo(() => {
    const origin = window.location.origin;
    const urlsXml = sitemapItems
      .map(
        (item) => `  <url>
    <loc>${origin}/#${item.url}</loc>
    <lastmod>${item.lastModified}</lastmod>
    <changefreq>${item.changeFreq}</changefreq>
    <priority>${item.priority}</priority>
  </url>`
      )
      .join('\n');

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlsXml}
</urlset>`;
  }, [sitemapItems]);

  const handleCopyXml = () => {
    navigator.clipboard.writeText(generatedXml);
    setCopiedXml(true);
    setTimeout(() => setCopiedXml(false), 2500);
  };

  const navTabs: { id: SitemapCategoryKey; label: string; labelEn: string; icon: React.ComponentType<{ className?: string }>; count: number }[] = [
    { id: 'all', label: 'جميع الصفحات والأقسام', labelEn: 'All Pages', icon: FolderTree, count: sitemapItems.length },
    { id: 'app', label: 'التطبيق ومستودع APK', labelEn: 'App & Releases', icon: Layers, count: sitemapItems.filter(i => i.category === 'app').length },
    { id: 'quran', label: 'المكتبة الصوتية والبودكاست', labelEn: 'Audio & Quran', icon: Radio, count: sitemapItems.filter(i => i.category === 'quran').length },
    { id: 'vault', label: 'خزانة الوسائط', labelEn: 'Media Vault', icon: Sparkles, count: sitemapItems.filter(i => i.category === 'vault').length },
    { id: 'news', label: 'الأخبار والبيانات', labelEn: 'News & Press', icon: Newspaper, count: sitemapItems.filter(i => i.category === 'news').length },
    { id: 'scholars', label: 'القراء والعلماء', labelEn: 'Scholars', icon: Users, count: sitemapItems.filter(i => i.category === 'scholars').length },
    { id: 'admin', label: 'الإدارة والتقنية', labelEn: 'Admin & Tools', icon: ShieldCheck, count: sitemapItems.filter(i => i.category === 'admin').length },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Spatial HUD Header */}
      <div className="relative rounded-3xl bg-[#090E1A]/90 border border-cyan-500/30 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_0_40px_rgba(0,229,255,0.12)] overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-[90px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-cyan-300 text-xs font-mono font-bold">
              <FolderTree className="w-3.5 h-3.5 animate-pulse" />
              <span>SITEMAP ARCHITECTURE · الفهرسة المكانية الشاملة</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-tajawal">
              {isRtl ? 'خريطة الموقع والأرشفة الرقمية' : 'Platform Sitemap & SEO Architecture'}
            </h1>
            
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {isRtl 
                ? 'فهرس تفاعلي متكامل لكافة روابط وصفحات ومواد منصة قبس، مهيأ لمحركات البحث (SEO) والزوار للوصول المباشر إلى مستودع APK، التلاوات، والوسائط.'
                : 'A comprehensive interactive index of all Qabas pages, API endpoints, audio tracks, and Android releases optimized for web crawlers and visitors.'}
            </p>
          </div>

          {/* Quick XML Switch & Copy Actions */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="flex items-center bg-slate-900/90 border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={() => setViewMode('visual')}
                className={`px-3 py-1.5 rounded-lg font-tajawal transition-all cursor-pointer ${
                  viewMode === 'visual'
                    ? 'bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isRtl ? 'عرض تفاعلي' : 'Visual Tree'}
              </button>
              <button
                onClick={() => setViewMode('xml')}
                className={`px-3 py-1.5 rounded-lg font-tajawal transition-all cursor-pointer ${
                  viewMode === 'xml'
                    ? 'bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {isRtl ? 'ملف XML الحي' : 'Live XML Feed'}
              </button>
            </div>

            <button
              onClick={handleCopyXml}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-amber-300 hover:from-amber-300 hover:to-amber-200 text-slate-950 text-xs font-bold font-tajawal transition-all cursor-pointer shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              title="نسخ كود XML لمحركات البحث"
            >
              {copiedXml ? <Check className="w-4 h-4 text-slate-950" /> : <Copy className="w-4 h-4 text-slate-950" />}
              <span>{copiedXml ? (isRtl ? 'تم النسخ!' : 'Copied!') : (isRtl ? 'نسخ Sitemap.xml' : 'Copy XML')}</span>
            </button>
          </div>
        </div>

        {/* Real-time Indexing Telemetry metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block">{isRtl ? 'إجمالي الصفحات المفهرسة' : 'Indexed Routes'}</span>
            <span className="text-lg font-bold font-mono text-cyan-300">{sitemapItems.length} رابط حي</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block">{isRtl ? 'مستودع أندرويد' : 'App Package'}</span>
            <span className="text-lg font-bold font-mono text-amber-300">Target SDK 36</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block">{isRtl ? 'التسجيلات الصوتية' : 'Audio Library'}</span>
            <span className="text-lg font-bold font-mono text-emerald-300">{lessons.length} مسار</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5">
            <span className="text-[11px] font-mono text-slate-400 block">{isRtl ? 'حالة الأرشفة' : 'Crawler Status'}</span>
            <span className="text-lg font-bold font-mono text-purple-300 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              200 OK
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Sub-Navigation Tabs & Search Bar */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Sub-navigation Scrollable Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
            {navTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-amber-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_20px_rgba(0,229,255,0.2)]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                  <span>{isRtl ? tab.label : tab.labelEn}</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${isActive ? 'bg-cyan-400 text-slate-950 font-bold' : 'bg-slate-800 text-slate-400'}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search input in sitemap */}
          <div className="relative min-w-[240px] md:max-w-xs">
            <Search className={`w-4 h-4 text-slate-400 absolute top-1/2 -translate-y-1/2 pointer-events-none ${isRtl ? 'right-3' : 'left-3'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isRtl ? 'بحث في خريطة الموقع...' : 'Filter sitemap routes...'}
              className={`w-full py-2 rounded-xl bg-slate-900/80 border border-white/10 focus:border-cyan-400 text-xs text-white placeholder-slate-500 outline-none transition-all font-mono ${
                isRtl ? 'pr-9 pl-4' : 'pl-9 pr-4'
              }`}
            />
          </div>
        </div>
      </div>

      {/* 3. Main View Area (Visual Tree vs Raw XML) */}
      {viewMode === 'visual' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              return (
                <div
                  key={item.id}
                  className="group relative rounded-2xl bg-[#090E1A]/80 border border-white/10 hover:border-cyan-400/50 hover:bg-[#0D1527] p-5 transition-all duration-300 flex flex-col justify-between shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(0,229,255,0.15)]"
                >
                  <div className="space-y-3">
                    {/* Header Row: Category Badge & Priority */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300">
                        {isRtl ? item.categoryLabel : item.categoryLabelEn}
                      </span>

                      <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                        <span title="Indexing Priority">★ {item.priority}</span>
                        <span className="text-slate-600">·</span>
                        <span title="Change Frequency">{item.changeFreq}</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-bold text-white font-tajawal group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {isRtl ? item.title : item.titleEn}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {isRtl ? item.description : item.descriptionEn}
                    </p>

                    {/* URL Path Pill */}
                    <div className="pt-1">
                      <span className="inline-block text-[11px] font-mono text-slate-400 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/5 truncate max-w-full">
                        #{item.url}
                      </span>
                    </div>
                  </div>

                  {/* Bottom Navigation CTA */}
                  <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500">
                      {isRtl ? 'آخر تحديث: ' : 'Updated: '} {item.lastModified}
                    </span>

                    {item.isExternal ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-xs font-bold font-tajawal text-amber-300 hover:text-amber-200 transition-colors"
                      >
                        <span>{isRtl ? 'فتح الرابط' : 'Open'}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <Link
                        to={item.url}
                        className="flex items-center gap-1 text-xs font-bold font-tajawal text-cyan-400 group-hover:text-cyan-300 transition-colors"
                      >
                        <span>{isRtl ? 'زيارة الصفحة' : 'Visit Page'}</span>
                        <ArrowLeft className={`w-3.5 h-3.5 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1 rotate-180'}`} />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <div className="text-center py-16 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <FolderTree className="w-8 h-8 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white font-tajawal">
                {isRtl ? 'لم يتم العثور على أي صفحات مطابقة' : 'No matching pages found'}
              </h4>
              <p className="text-xs text-slate-400">
                {isRtl ? 'جرب البحث بكلمات أخرى أو اختر قسماً مختلفاً من القائمة الفرعية.' : 'Try changing your search terms or selecting a different tab.'}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* XML Feed View */
        <div className="rounded-2xl bg-[#060A12] border border-cyan-500/30 p-5 space-y-3 font-mono text-xs shadow-2xl relative">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-slate-400 text-xs">
            <span className="flex items-center gap-2 text-amber-400">
              <FileCode2 className="w-4 h-4" />
              <span>Standard XML Sitemap Protocol 0.9</span>
            </span>
            <span>{sitemapItems.length} URLs generated</span>
          </div>

          <pre className="text-cyan-300/90 overflow-x-auto p-4 rounded-xl bg-black/50 border border-white/5 leading-relaxed text-[11px] max-h-[500px]">
            <code>{generatedXml}</code>
          </pre>
        </div>
      )}

    </div>
  );
};
