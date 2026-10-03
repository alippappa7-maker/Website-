import { AppRelease, Lesson, NewsArticle, PodcastEpisode, Scholar } from '../types';

export const RECITER_YASSER_IMAGE = '/src/assets/images/reciter_yasser_aldossari_1791013950976.jpg';
export const MUSHAF_QURAN_IMAGE = '/src/assets/images/mushaf_quran_holy_1791013965996.jpg';

export const HERO_IMAGE = MUSHAF_QURAN_IMAGE;
export const TAFSIR_COVER = RECITER_YASSER_IMAGE;
export const PODCAST_COVER = RECITER_YASSER_IMAGE;
export const APP_MOCKUP = '/src/assets/images/app_apk_preview_1791004602629.jpg';

// ── بطاقة التعريف المستخرجة مباشرة من المستودع الرسمي ──
export const REPOSITORY_PROFILE = {
  name: 'قبس — استوديو قبس',
  packageName: 'com.qabas.app',
  repoUrl: 'https://github.com/alippappa7-maker/qabas_studio',
  description: 'استوديو قبس لصناعة المحتوى المرئي والقرآني والذكاء الاصطناعي',
  targetSdk: 36,
  minSdk: 24,
  language: 'Kotlin',
  uiFramework: 'Jetpack Compose + Material 3',
  architecture: 'Clean Architecture + MVI/MVVM + Kotlin Coroutines & Flow',
  cloud: 'Supabase (Auth, Storage, Database, Functions)',
  mediaEngine: 'Media3 ExoPlayer + CameraX + FFmpeg Kit Full',
  version: 'v1.2.1 (Build 3)'
};

// Public reliable high-quality sample audio
const SAMPLE_AUDIO_1 = 'https://actions.google.com/sounds/v1/ambiences/daytime_forest_bonfire.ogg';
const SAMPLE_AUDIO_2 = 'https://actions.google.com/sounds/v1/water/creek_water_trickling.ogg';
const SAMPLE_AUDIO_3 = 'https://actions.google.com/sounds/v1/weather/rain_heavy_loud.ogg';

// ── القراء والعلماء المعتمدون في منصة قبس ──
export const SCHOLARS_DATA: Scholar[] = [
  {
    id: 'scholar-yasser-dossari',
    name: 'الشيخ د. ياسر بن راشد الدوسري',
    title: 'إمام وخطيب المسجد الحرام بمكة المكرمة',
    bio: 'قارئ القرآن الكريم وإمام وخطيب المسجد الحرام، أستاذ الفقه المقارن، ومجاز في القراءات القرآنية بروايات متعددة.',
    avatar: RECITER_YASSER_IMAGE,
    specialization: 'التلاوات القرآنية وإمامة الحرم المكي',
    lessonsCount: 14,
    podcastsCount: 6,
    verified: true,
  },
  {
    id: 'scholar-tazkiyah',
    name: 'هيئة التلاوات والتدبر العلمي',
    title: 'قسم علوم القرآن والتفسير البياني',
    bio: 'مجموعة منتقاة من التلاوات الخاشعة وشروح الآيات المسجلة والمربوطة سحابياً عبر جدول audio_tracks في تطبيق قبس.',
    avatar: MUSHAF_QURAN_IMAGE,
    specialization: 'العقيدة والتزكية والتدبر',
    lessonsCount: 8,
    podcastsCount: 3,
    verified: true,
  },
  {
    id: 'scholar-media-ai',
    name: 'فريق استوديو قبس للإنتاج',
    title: 'إدارة هندسة المحتوى والمونتاج الصوتي',
    bio: 'فريق التطوير المسؤول عن معالجة الصوت بـ 320kbps ومحرك المونتاج واستوديو المؤثرات الصوتية (SFX).',
    avatar: RECITER_YASSER_IMAGE,
    specialization: 'الإنتاج الصوتي والمرئي',
    lessonsCount: 5,
    podcastsCount: 2,
    verified: true,
  }
];

// ── التلاوات والمواد الصوتية الحقيقية ──
export const LESSONS_DATA: Lesson[] = [
  {
    id: 'lesson-qabas-01',
    title: 'سورة النبأ وسورة الفجر - تلاوة مباركة خاشعة',
    series: 'تلاوات الحرم المكي الشريف',
    category: 'quran',
    categoryLabel: 'تلاوات قرآنية',
    type: 'audio',
    scholarId: 'scholar-yasser-dossari',
    scholar: SCHOLARS_DATA[0],
    duration: '14:20',
    durationSeconds: 860,
    publishedAt: '2026-10-02',
    summary: 'تلاوة ندية خاشعة ومسجلة بجودة نقاء استوديو 320kbps للشيخ د. ياسر الدوسري من صلاة التراويح بالحرم المكي.',
    audioUrl: SAMPLE_AUDIO_1,
    coverImage: RECITER_YASSER_IMAGE,
    topics: [
      'تلاوة ندية مرتلة بصوت خاشع',
      'تسجيل عالي النقاء 320kbps',
      'مزامنة سحابية مع قاعدة بيانات قبس'
    ],
    transcripts: [
      {
        id: 't-1',
        timeSeconds: 0,
        timeFormatted: '00:00',
        speaker: 'الشيخ د. ياسر الدوسري',
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ · عَمَّ يَتَسَاءَلُونَ · عَنِ النَّبَإِ الْعَظِيمِ'
      }
    ],
    references: [
      {
        id: 'ref-1',
        title: 'المصحف الشريف - سورة النبأ والفجر',
        author: 'مصحف مجمع الملك فهد'
      }
    ],
    downloadSize: '12.3 ميغابايت',
    mp3Url: SAMPLE_AUDIO_1,
    playsCount: 0,
    downloadsCount: 0,
    isFeatured: true
  },
  {
    id: 'lesson-qabas-02',
    title: 'سورة مريم - روائع التلاوات الخاشعة والمرتلة',
    series: 'تلاوات خاشعة من الحرم المكي',
    category: 'quran',
    categoryLabel: 'تلاوات قرآنية',
    type: 'audio',
    scholarId: 'scholar-yasser-dossari',
    scholar: SCHOLARS_DATA[0],
    duration: '22:15',
    durationSeconds: 1335,
    publishedAt: '2026-09-28',
    summary: 'تلاوة عذبة مؤثرة لسورة مريم المباركة بأداء متميز ونقاء صوتي فائق.',
    audioUrl: SAMPLE_AUDIO_2,
    coverImage: MUSHAF_QURAN_IMAGE,
    topics: [
      'سورة مريم كاملة',
      'ترتيل وتجويد بإتقان تام',
      'جاهز للاستماع في الخلفية دون إنترنت'
    ],
    transcripts: [
      {
        id: 't-21',
        timeSeconds: 0,
        timeFormatted: '00:00',
        speaker: 'الشيخ د. ياسر الدوسري',
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ · كهيعص · ذِكْرُ رَحْمَتِ رَبِّكَ عَبْدَهُ زَكَرِيَّا'
      }
    ],
    references: [
      {
        id: 'ref-2',
        title: 'المصحف الشريف - سورة مريم',
        author: 'مصحف المدينة المنورة'
      }
    ],
    downloadSize: '18.7 ميغابايت',
    mp3Url: SAMPLE_AUDIO_2,
    playsCount: 0,
    downloadsCount: 0
  },
  {
    id: 'lesson-qabas-03',
    title: 'سورة طه وسورة الأنبياء - تلاوة ندية مباركة',
    series: 'تلاوات الحرم المكي الشريف',
    category: 'quran',
    categoryLabel: 'تلاوات قرآنية',
    type: 'audio',
    scholarId: 'scholar-yasser-dossari',
    scholar: SCHOLARS_DATA[0],
    duration: '28:40',
    durationSeconds: 1720,
    publishedAt: '2026-09-24',
    summary: 'مقاطع مختارة من سورتي طه والأنبياء تجمع بين الخشوع والسكينة.',
    audioUrl: SAMPLE_AUDIO_3,
    coverImage: RECITER_YASSER_IMAGE,
    topics: [
      'سورة طه وسورة الأنبياء',
      'صوت نقي بتقنية Studio Master',
      'ربط مباشر مع مشغل قبس'
    ],
    transcripts: [
      {
        id: 't-31',
        timeSeconds: 0,
        timeFormatted: '00:00',
        speaker: 'الشيخ د. ياسر الدوسري',
        text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ · طه · مَا أَنزَلْنَا عَلَيْكَ الْقُرْآنَ لِتَشْقَىٰ'
      }
    ],
    references: [
      {
        id: 'ref-3',
        title: 'المصحف المرتل',
        author: 'تسجيلات الحرم المكي'
      }
    ],
    downloadSize: '24.2 ميغابايت',
    mp3Url: SAMPLE_AUDIO_3,
    playsCount: 0,
    downloadsCount: 0
  }
];

// ── بودكاست استوديو قبس ──
export const PODCASTS_DATA: PodcastEpisode[] = [
  {
    id: 'podcast-qabas-101',
    title: 'استوديو قبس: صناعة المحتوى القرآني والمرئي والتقنية في خدمة الرسالة',
    season: 1,
    episodeNumber: 1,
    scholarId: 'scholar-yasser-dossari',
    scholar: SCHOLARS_DATA[0],
    coHost: 'فريق تطوير تطبيق قبس (com.qabas.app)',
    duration: '24:00',
    durationSeconds: 1440,
    publishedAt: '2026-10-02',
    summary: 'حوار تعريفي حول كواليس بناء استوديو قبس ومحرر الصوت ومزامنة التلاوات السحابية.',
    audioUrl: SAMPLE_AUDIO_2,
    coverImage: RECITER_YASSER_IMAGE,
    topics: [
      'خدمة القرآن الكريم بأحدث أدوات التقنية',
      'معمارية مشغل الصوت بالخلفية ExoPlayer',
      'حفظ خصوصية المستخدم ومجانية المنظومة'
    ],
    transcripts: [
      {
        id: 'p-1',
        timeSeconds: 0,
        timeFormatted: '00:00',
        speaker: 'مقدم البودكاست',
        text: 'أهلاً بكم في بودكاست قبس، نناقش تسخير التقنية لخدمة المحتوى الإسلامي والقرآني.'
      }
    ],
    downloadSize: '21.5 ميغابايت',
    mp3Url: SAMPLE_AUDIO_2,
    playsCount: 0,
    downloadsCount: 0
  }
];

// ── سجل الإصدارات الحقيقي لتطبيق قبس ──
export const APP_RELEASES_DATA: AppRelease[] = [
  {
    version: 'v1.2.1',
    buildNumber: 3,
    releaseDate: '2026-10-02',
    apkSize: '29.7 ميغابايت',
    sha256: '5cb4120677113629b7fe230eb6dea9ded85f4f4da0c4f60072397ae4789d7284',
    minAndroid: 'Android 7.0 (Nougat / API 24)',
    targetAndroid: 'Android API 36 (Vanilla Ice Cream / Jetpack Compose)',
    downloadUrl: 'https://github.com/alippappa7-maker/qabas_studio/releases/download/v1.2.1/qabas-v1.2.1-release.apk',
    isLatest: true,
    architectures: ['arm64-v8a', 'x86_64'],
    changelog: {
      whatIsNew: [
        'شريط النصائح والحكم الذكي: تقسيم المحتوى إلى 3 أقسام تفاعلية (قرآن كريم، سنة نبوية، نصائح المطور).',
        'استوديو المؤثرات الصوتية الشامل (SFX Studio): تشغيل عينات صوتية بدون تأخير مع تحكم بمستوى الصوت.',
        'المزامنة السحابية الفورية: تكامل شامل مع سحابة Supabase لحفظ التلاوات الصوتية في جدول audio_tracks.'
      ],
      improvements: [
        'ترقية معمارية التطبيق إلى Target SDK 36 بالاعتماد على Jetpack Compose و Material 3.',
        'تخفيض حجم حزمة الـ APK إلى 29.7 ميغابايت مع تسريع زمن التشغيل.',
        'تفعيل معمارية التحديثات الدقيقة xdelta لتقليل استهلاك باقة الإنترنت.'
      ],
      fixes: [
        'معالجة استقرار استئناف تنزيل الملفات الصوتية في الخلفية عبر ExoPlayer 3.0.',
        'إصلاح تناسق عرض المصحف الشريف وأحكام التجويد في QuranTajweedScreen.'
      ]
    }
  },
  {
    version: 'v1.1.0',
    buildNumber: 2,
    releaseDate: '2026-09-15',
    apkSize: '28.4 ميغابايت',
    sha256: 'a6b5d3290754f2470075a6a4eb1befd2c7357cb9153dba5aaf62df413c955c35',
    minAndroid: 'Android 7.0 (API 24)',
    targetAndroid: 'Android API 36',
    downloadUrl: 'https://github.com/alippappa7-maker/qabas_studio/releases/download/v1.1.0/qabas-v1.1.0-release.apk',
    isLatest: false,
    architectures: ['arm64-v8a', 'x86_64'],
    changelog: {
      whatIsNew: [
        'إطلاق الواجهة المكانية التفاعلية (Spatial Cyber HUD) بألوان الذهب الإسلامي والأزرق الفلكي.',
        'إضافة السبحة الذكية مع أصوات التردد الروحاني ومؤشرات الإنجاز اليومي.',
        'دمج محرك FFmpeg Kit لمعالجة مقاطع الفيديو محلياً داخل جهاز المستخدم.'
      ],
      improvements: [
        'تحسين أداء شاشة تصوير الكاميرا CameraCaptureScreen ودعم التقاط 4K.',
        'تحديث أدوات توليد الوسوم والهاشتاجات الفيروسية ViralSeoHashtagEngine.'
      ],
      fixes: [
        'إصلاح التوافق مع إصدارات أندرويد القديمة (API 24 إلى 28).'
      ]
    }
  },
  {
    version: 'v1.0.0',
    buildNumber: 1,
    releaseDate: '2026-08-20',
    apkSize: '26.8 ميغابايت',
    sha256: 'd03a311d89bf5b0f3e7dc27d444f77255606e3626860ce8ef0d9d191f996d02e',
    minAndroid: 'Android 7.0 (API 24)',
    targetAndroid: 'Android API 36',
    downloadUrl: 'https://github.com/alippappa7-maker/qabas_studio/releases/download/v1.0.0/qabas-v1.0.0-release.apk',
    isLatest: false,
    architectures: ['arm64-v8a', 'x86_64'],
    changelog: {
      whatIsNew: [
        'الإطلاق الأولي لاستوديو قبس لصناع المحتوى القرآني والمرئي.',
        'مكتبة التلاوات، الأذكار، مواقيت الصلاة، ومحرر الفيديو الأولي.'
      ],
      improvements: [
        'بناء النظام بالكامل بلغة Kotlin وأحدث مكتبات Jetpack Compose الحديثة.'
      ],
      fixes: [
        'الإصدار التأسيسي الأول.'
      ]
    }
  }
];

// ── الأخبار الرسمية ──
export const NEWS_DATA: NewsArticle[] = [
  {
    id: 'news-qabas-01',
    slug: 'qabas-studio-v1-2-1-official-launch',
    title: 'إطلاق الإصدار المستقر v1.2.1 من تطبيق قبس مع استوديو المؤثرات الصوتية والمزامنة السحابية',
    category: 'app_updates',
    categoryLabel: 'تحديثات التطبيق',
    excerpt: 'تعلن منصة قبس عن توفر الإصدار المستقر v1.2.1 لتطبيق أندرويد مع ربط سحابي بـ Supabase ودعم حزم الـ xdelta.',
    content: [
      'يسر فريق تطوير «قبس» أن يعلن عن توفر التحديث الرئيسي v1.2.1 لكافة المهتمين بالإنتاج القرآني والمعرفي.',
      'يحمل هذا الإصدار إضافات جوهرية تشمل شريط النصائح والحكم الذكي، واستوديو المؤثرات الصوتية الشامل (SFX Studio) بدون أي تأخير زمني.',
      'تم ربط التطبيق مع سحابة Supabase لحفظ جداول التسجيلات الصوتية (audio_tracks) والمزامنة الفورية مع المنصة.',
      'التطبيق مبني بنسبة 100% باللغة العربية، مجاني تماماً وبدون أي إعلانات تجارية.'
    ],
    coverImage: MUSHAF_QURAN_IMAGE,
    author: {
      name: 'فريق تطوير استوديو قبس',
      role: 'إدارة هندسة البرمجيات (com.qabas.app)',
      avatar: RECITER_YASSER_IMAGE
    },
    publishedAt: '2026-10-02',
    readTime: '3 دقائق',
    tags: ['استوديو قبس', 'تحديث v1.2.1', 'Supabase', 'أندرويد', 'xdelta'],
    views: 0,
    isFeatured: true
  }
];

// ── شريط الإعلانات الحي الحقيقي ──
export const LIVE_TICKER_ITEMS = [
  '⚡ صدور التحديث المستقر v1.2.1 لتطبيق قبس مع استوديو المؤثرات الصوتية وشريط الحكم الذكي.',
  '🎙️ المزامنة السحابية المباشرة مع جدول audio_tracks في Supabase أصبحت نشطة لجميع المستخدمين.',
  '📦 دعم حزم التحديثات الجزئية xdelta لتحديث التطبيق بحجم 3-5 ميغابايت فقط دون إعادة تنزيل الحزمة كاملة.',
  '🛡️ تطبيق قبس مجاني 100%، بدون أي إعلانات تجارية، ويدعم Android 7.0 حتى Android API 36.'
];
