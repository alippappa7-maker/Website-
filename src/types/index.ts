export type LessonCategory = 
  | 'quran'
  | 'tafsir' 
  | 'fiqh' 
  | 'aqidah' 
  | 'tazkiyah' 
  | 'hadith' 
  | 'fikr';

export interface TranscriptLine {
  id: string;
  timeSeconds: number;
  timeFormatted: string;
  speaker: string;
  text: string;
}

export interface ReferenceItem {
  id: string;
  title: string;
  author: string;
  notes?: string;
  link?: string;
}

export interface Scholar {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar: string;
  specialization: string;
  lessonsCount: number;
  podcastsCount: number;
  verified: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  series: string;
  category: LessonCategory;
  categoryLabel: string;
  type: 'audio' | 'video';
  scholarId: string;
  scholar: Scholar;
  duration: string;
  durationSeconds: number;
  publishedAt: string;
  summary: string;
  audioUrl: string;
  videoUrl?: string;
  coverImage: string;
  topics: string[];
  transcripts: TranscriptLine[];
  references: ReferenceItem[];
  downloadSize: string;
  mp3Url: string;
  playsCount: number;
  downloadsCount: number;
  isFeatured?: boolean;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  season: number;
  episodeNumber: number;
  scholarId: string;
  scholar: Scholar;
  coHost?: string;
  duration: string;
  durationSeconds: number;
  publishedAt: string;
  summary: string;
  audioUrl: string;
  coverImage: string;
  topics: string[];
  transcripts: TranscriptLine[];
  downloadSize: string;
  mp3Url: string;
  playsCount: number;
  downloadsCount: number;
}

export interface AppRelease {
  version: string;
  buildNumber: number;
  releaseDate: string;
  releaseTime?: string;
  publishedAtIso?: string;
  apkSize: string;
  exactSizeBytes?: number;
  exactSizeFormatted?: string;
  sha256: string;
  minAndroid: string;
  targetAndroid: string;
  downloadUrl: string;
  isLatest: boolean;
  architectures: string[];
  changelog: {
    whatIsNew: string[];
    improvements: string[];
    fixes: string[];
  };
}

export type NewsCategory = 'app_updates' | 'new_series' | 'platform_tech';

export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  category: NewsCategory;
  categoryLabel: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  views: number;
  isFeatured?: boolean;
}

export interface ActiveTrack {
  id: string;
  title: string;
  seriesOrHost: string;
  scholarName: string;
  coverImage: string;
  audioUrl: string;
  durationSeconds: number;
  contentType: 'lesson' | 'podcast';
}

export interface XdeltaPatch {
  id: string;
  baseVersion: string;
  targetVersion: string;
  patchSize: string;
  fullApkSize: string;
  savedPercentage: string;
  sha256: string;
  releaseDate: string;
  downloadUrl: string;
  instructions: string;
}

export interface UplinkBroadcastEvent {
  id: string;
  status: 'idle' | 'uploading' | 'processing' | 'completed' | 'error';
  type: 'apk' | 'xdelta' | 'audio' | 'news';
  title: string;
  progress: number;
  speed: string;
  uploadedSize: string;
  totalSize: string;
  targetVersion?: string;
  sha256?: string;
  message?: string;
  timestamp: number;
}

export interface AppReview {
  id: string;
  authorName: string;
  rating: number; // 1 to 5
  categoryRating: 'overall' | 'studio' | 'quran' | 'stability';
  appVersion: string;
  deviceModel?: string;
  comment: string;
  createdAt: string;
  helpfulCount: number;
  verifiedUser: boolean;
}

export interface RatingSummary {
  averageRating: number;
  totalCount: number;
  starsCount: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export type MediaType = 'audio' | 'video' | 'image';

export type MediaCategory = 
  | 'quran'           // تلاوات قرآنية
  | 'video_lectures'  // شروحات ودروس مرئية
  | 'daawah_shorts'   // مقاطع دعوية وفيديو قصير
  | 'cards_designs'   // بطاقات وتصاميم دعوية
  | 'wallpapers'      // خلفيات ومخطوطات إسلامية
  | 'sound_fx';       // مؤثرات واستوديو قبس

export interface MediaVaultItem {
  id: string;
  title: string;
  type: MediaType;
  category: MediaCategory;
  categoryLabel: string;
  fileUrl: string;
  thumbnailUrl: string;
  fileSize: string;
  fileSizeBytes?: number;
  format: string; // e.g. "MP4", "MP3", "WEBP", "PNG"
  resolution?: string; // e.g. "1080p FHD", "4K UHD", "320 kbps", "3840x2160"
  duration?: string; // e.g. "04:12" for audio/video
  authorName: string;
  authorRole?: string;
  description: string;
  tags: string[];
  createdAt: string;
  viewsCount: number;
  downloadsCount: number;
  likesCount: number;
  sha256?: string;
  isFeatured?: boolean;
}

export interface ToastNotification {
  id: string;
  type: 'urgent_news' | 'new_lesson' | 'app_update' | 'success' | 'info';
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
  timestamp: number;
  duration?: number; // ms
  meta?: {
    category?: string;
    author?: string;
    badge?: string;
  };
}


