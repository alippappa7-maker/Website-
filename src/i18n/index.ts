import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

export const resources = {
  ar: {
    translation: {
      brand: {
        name: 'قَبَس',
        subname: 'استوديو قبس',
        tagline: 'المنصة السحابية المتقدمة لإنتاج وتوزيع المحتوى القرآني والمعرفي والتقني',
        verifiedBadge: 'المستودع الرسمي المعتمد',
        nativeAppTag: 'تطبيق أندرويد الأصلي'
      },
      nav: {
        home: 'الرئيسية',
        mediaVault: 'خزانة الوسائط',
        lessons: 'الدروس والبودكاست',
        appRepo: 'مستودع التطبيق (APK)',
        news: 'الأخبار والبيانات',
        scholars: 'القراء والعلماء',
        admin: 'لوحة المشرف',
        searchPlaceholder: 'ابحث عن سورة، قارئ، خبر، أو حزمة APK... (Ctrl+K)',
        readingMode: 'وضع القراءة',
        notifications: 'التنبيهات',
        livePresence: 'متصل الآن'
      },
      hero: {
        badge: 'الإصدار الرسمي v1.2.1 متاح الآن',
        title: 'استوديو قبس الرقمي',
        titleHighlight: 'لصناعة المحتوى القرآني والمعرفي',
        description: 'بوابة متكاملة تجمع بين التلاوات القرآنية النقية، البودكاست المعرفي، مستودع حزم التطبيق (APK/xdelta)، وخزانة الوسائط المفتوحة بمزامنة سحابية فائقة السرعة.',
        downloadApk: 'تحميل تطبيق قبس (APK)',
        exploreMedia: 'استكشاف خزانة الوسائط',
        latestVersion: 'أحدث إصدار',
        shaVerified: 'بصمة رقمية موثقة'
      },
      stats: {
        activeUsers: 'زوار متصلون الآن',
        totalReleases: 'إصدارات رسمية',
        audioTracks: 'تلاوات ومقاطع مسجلة',
        deltaBandwidthSaved: 'توفير استهلاك البيانات عبر xdelta',
        openSource: 'مجاني ومفتوح 100%'
      },
      sections: {
        latestLessons: 'أحدث التلاوات والدروس المسجلة',
        latestLessonsSub: 'تسجيلات استوديو نقية 320kbps مع تفريغ نصي متزامن',
        appShowcase: 'مستودع تطبيق قبس لنظام أندرويد',
        appShowcaseSub: 'حزم APK كاملة وتحديثات جزئية xdelta فائقة السرعة',
        mediaVaultTitle: 'خزانة الوسائط المفتوحة',
        mediaVaultSub: 'مكتبة مرئية وصوتية مشتركة مدعومة بالمزامنة السحابية',
        newsTitle: 'البيانات والأخبار الرسمية',
        newsSub: 'متابعة حية لإصدارات التطبيق وتحديثات المنظومة',
        viewAll: 'عرض الكل',
        listenNow: 'استمع الآن'
      },
      readingMode: {
        focusMode: 'وضع القراءة المريح',
        textSize: 'حجم الخط',
        lineSpacing: 'تباعد الأسطر',
        theme: 'السمة',
        themeCosmic: 'كوني',
        themeSepia: 'ورق دافئ',
        themeDark: 'أسود نقي',
        exit: 'خروج من وضع القراءة',
        progress: 'تقدم القراءة'
      },
      player: {
        nowPlaying: 'قيد التشغيل الآن',
        playbackSpeed: 'السرعة',
        stereoQuality: 'استريو 192kbps',
        downloadMp3: 'تحميل MP3',
        openLessonPage: 'صفحة المادة',
        closePlayer: 'إغلاق المشغل'
      },
      appRepo: {
        title: 'مستودع حزم تطبيق قبس (APK Repository)',
        subtitle: 'المصدر الرسمي المعتمد لتحميل حزم التثبيت المباشرة والتحديثات الجزئية xdelta',
        downloadFullApk: 'تحميل حزمة APK كاملة',
        downloadPatch: 'تحميل باتش التحديث',
        sha256Label: 'بصمة التوثيق الرقمي SHA-256',
        packageLabel: 'اسم الحزمة البرمجية',
        targetSdk: 'إصدار أندرويد المستهدف',
        minSdk: 'الحد الأدنى للنظام',
        changelog: 'سجل التغييرات والتحسينات',
        whatIsNew: 'ما الجديد في هذا الإصدار',
        improvements: 'التحسينات البرمجية',
        fixes: 'الإصلاحات'
      },
      mediaVault: {
        title: 'خزانة الوسائط السحابية المفتوحة',
        subtitle: 'فضاء رقمي لرفع واستعراض المقاطع الصوتية، الفيديوهات، والصور الدعوية',
        uploadBtn: 'رفع وسائط جديدة',
        all: 'الكل',
        videos: 'فيديوهات',
        audios: 'صوتيات',
        images: 'تصاميم وصور',
        documents: 'وثائق ومخطوطات',
        noItems: 'لا توجد وسائط في هذه الفئة حالياً',
        searchPlaceholder: 'بحث في خزانة الوسائط بالاسم أو الوصف...'
      },
      reviews: {
        title: 'تقييمات مجتمع قبس الحقيقية',
        subtitle: 'آراء وملاحظات الزوار الموثقة سحابياً دون أي تزييف',
        addReview: 'أضف تقييمك وتجربتك',
        averageRating: 'التقييم العام',
        totalReviews: 'إجمالي التقييمات',
        noReviewsYet: 'لا توجد تقييمات مضافة بعد. كن أول من يشارك تجربته مع قبس!',
        authorName: 'اسم المستخدم أو اللقب',
        ratingLabel: 'تقييمك الإجمالي',
        commentPlaceholder: 'اكتب انطباعك، الميزات التي أعجبتك، أو اقتراحاتك للتحسين...',
        submit: 'إرسال التقييم وتوثيقه'
      },
      footer: {
        rights: 'جميع الحقوق محفوظة لمنظومة قبس © 2026',
        tagline: 'منصة دعوية وتقنية غير ربحية تهدف لخدمة القرآن الكريم والمعرفة الرشيدة.',
        githubRepo: 'مستودع GitHub الرسمي',
        privacy: 'سياسة الخصوصية والأمان',
        terms: 'شروط الاستخدام المفتوح'
      },
      common: {
        language: 'اللغة',
        arabic: 'العربية',
        english: 'English',
        switchLang: 'تغيير اللغة / Switch Language',
        loading: 'جاري التحميل...',
        copy: 'نسخ',
        copied: 'تم النسخ!',
        close: 'إغلاق',
        back: 'رجوع',
        save: 'حفظ',
        cancel: 'إلغاء'
      }
    }
  },
  en: {
    translation: {
      brand: {
        name: 'Qabas',
        subname: 'Qabas Studio',
        tagline: 'Advanced Cloud Platform for Quranic, Knowledge & Audio-Visual Production',
        verifiedBadge: 'Verified Official Repository',
        nativeAppTag: 'Native Android App'
      },
      nav: {
        home: 'Home',
        mediaVault: 'Media Vault',
        lessons: 'Lessons & Podcasts',
        appRepo: 'App Repo (APK)',
        news: 'News & Releases',
        scholars: 'Scholars & Reciters',
        admin: 'Admin Studio',
        searchPlaceholder: 'Search surah, reciter, news, or APK release... (Ctrl+K)',
        readingMode: 'Reading Mode',
        notifications: 'Alerts',
        livePresence: 'Online Now'
      },
      hero: {
        badge: 'Official Release v1.2.1 is Live',
        title: 'Qabas Digital Studio',
        titleHighlight: 'Empowering Quranic & Knowledge Media',
        description: 'An integrated cloud ecosystem uniting crystal-clear Quran recitations, knowledge podcasts, APK/xdelta repositories, and open media vaults with lightning-fast cloud sync.',
        downloadApk: 'Download Qabas APK',
        exploreMedia: 'Explore Media Vault',
        latestVersion: 'Latest Version',
        shaVerified: 'SHA-256 Verified'
      },
      stats: {
        activeUsers: 'Live Active Visitors',
        totalReleases: 'Official Releases',
        audioTracks: 'Audio & Lesson Tracks',
        deltaBandwidthSaved: 'Bandwidth Saved via xdelta',
        openSource: '100% Free & Open'
      },
      sections: {
        latestLessons: 'Latest Recitations & Lessons',
        latestLessonsSub: 'Pristine 320kbps studio master recordings with synchronized transcripts',
        appShowcase: 'Qabas Android App Repository',
        appShowcaseSub: 'Direct APK releases and ultra-compact xdelta patch updates',
        mediaVaultTitle: 'Open Media Vault',
        mediaVaultSub: 'Shared audio-visual vault powered by real-time cloud storage',
        newsTitle: 'Official Announcements & News',
        newsSub: 'Live updates on app versions and platform enhancements',
        viewAll: 'View All',
        listenNow: 'Listen Now'
      },
      readingMode: {
        focusMode: 'Focus Reading Mode',
        textSize: 'Font Size',
        lineSpacing: 'Line Spacing',
        theme: 'Theme',
        themeCosmic: 'Cosmic',
        themeSepia: 'Warm Sepia',
        themeDark: 'Pure OLED',
        exit: 'Exit Reading Mode',
        progress: 'Reading Progress'
      },
      player: {
        nowPlaying: 'Now Playing',
        playbackSpeed: 'Speed',
        stereoQuality: 'Stereo 192kbps',
        downloadMp3: 'Download MP3',
        openLessonPage: 'Lesson Page',
        closePlayer: 'Close Player'
      },
      appRepo: {
        title: 'Qabas App Repository (APK & Patches)',
        subtitle: 'Official verified source for direct APK package installations and xdelta micro-patches',
        downloadFullApk: 'Download Full APK',
        downloadPatch: 'Download xdelta Patch',
        sha256Label: 'Cryptographic SHA-256 Checksum',
        packageLabel: 'Package Name',
        targetSdk: 'Target Android Version',
        minSdk: 'Minimum OS Requirement',
        changelog: 'Changelog & Enhancements',
        whatIsNew: 'What is New',
        improvements: 'System Improvements',
        fixes: 'Bug Fixes'
      },
      mediaVault: {
        title: 'Open Cloud Media Vault',
        subtitle: 'Digital space to upload, browse, and curate Islamic audio, video, and visual graphics',
        uploadBtn: 'Upload New Media',
        all: 'All Files',
        videos: 'Videos',
        audios: 'Audios',
        images: 'Graphics & Images',
        documents: 'Documents & Manuscripts',
        noItems: 'No media items found in this category yet',
        searchPlaceholder: 'Search media vault by title or tags...'
      },
      reviews: {
        title: 'Verified Community Reviews',
        subtitle: 'Genuine visitor feedback stored in cloud database without artificial tampering',
        addReview: 'Submit Your Review',
        averageRating: 'Average Rating',
        totalReviews: 'Total Reviews',
        noReviewsYet: 'No reviews yet. Be the first to share your genuine experience with Qabas!',
        authorName: 'User Name / Alias',
        ratingLabel: 'Overall Star Rating',
        commentPlaceholder: 'Share your feedback, favorite features, or suggestions for improvement...',
        submit: 'Submit Review'
      },
      footer: {
        rights: 'All rights reserved to Qabas Ecosystem © 2026',
        tagline: 'A non-profit technological & religious platform dedicated to authentic Quranic sciences.',
        githubRepo: 'Official GitHub Repository',
        privacy: 'Privacy & Security Policy',
        terms: 'Open Use Terms'
      },
      common: {
        language: 'Language',
        arabic: 'العربية',
        english: 'English',
        switchLang: 'Language Switcher',
        loading: 'Loading...',
        copy: 'Copy',
        copied: 'Copied!',
        close: 'Close',
        back: 'Back',
        save: 'Save',
        cancel: 'Cancel'
      }
    }
  }
};

const savedLang = localStorage.getItem('qabas_language') || 'ar';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLang,
    fallbackLng: 'ar',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: 'qabas_language',
      caches: ['localStorage'],
    }
  });

// Handle HTML dir and lang attributes dynamically
export const syncDocumentLanguage = (lang: string) => {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  if (lang === 'ar') {
    document.body.classList.add('font-cairo');
    document.body.classList.remove('font-sans');
  } else {
    document.body.classList.remove('font-cairo');
    document.body.classList.add('font-sans');
  }
};

// Initial sync
syncDocumentLanguage(savedLang);

i18n.on('languageChanged', (lng) => {
  localStorage.setItem('qabas_language', lng);
  syncDocumentLanguage(lng);
});

export default i18n;
