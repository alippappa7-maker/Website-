import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Default keys or local storage keys
const STORAGE_KEY_URL = 'qabas_supabase_url';
const STORAGE_KEY_ANON = 'qabas_supabase_anon';

const DEFAULT_URL = (import.meta.env.VITE_SUPABASE_URL as string) || 'https://aivmwovrbdzcyrjwubon.supabase.co';
const DEFAULT_ANON = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || 'sb_publishable_pLSqbWNn4GjPJqzExDs4QA_M8Ie_YBB';

export const getStoredSupabaseConfig = () => {
  const url = localStorage.getItem(STORAGE_KEY_URL) || DEFAULT_URL;
  const anonKey = localStorage.getItem(STORAGE_KEY_ANON) || DEFAULT_ANON;
  return {
    url,
    anonKey,
    isConfigured: Boolean(url && anonKey)
  };
};

export const saveSupabaseConfig = (url: string, anonKey: string) => {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
  supabaseInstance = null;
};

export const clearSupabaseConfig = () => {
  localStorage.removeItem(STORAGE_KEY_URL);
  localStorage.removeItem(STORAGE_KEY_ANON);
  supabaseInstance = null;
};

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient => {
  const config = getStoredSupabaseConfig();
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(config.url, config.anonKey);
    } catch {
      // Fallback client
      supabaseInstance = createClient(DEFAULT_URL, DEFAULT_ANON);
    }
  }
  return supabaseInstance;
};

/**
 * Calculates SHA-256 Checksum natively using Web Crypto API
 */
export const calculateFileSha256 = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

/**
 * Formats bytes to human-readable size
 */
export const formatBytes = (bytes: number, decimals = 1): string => {
  if (bytes === 0) return '0 بايت';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['بايت', 'كيلوبايت', 'ميغابايت', 'جيجابايت'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

/**
 * Supabase Database & Storage DDL script matching the real qabas_studio repository
 */
export const SUPABASE_SETUP_SQL = `-- جداول منصة واستوديو قبس الرسمية لقاعدة بيانات Supabase (com.qabas.app)
-- مستخرجة ومطابقة لمستودع: alippappa7-maker/qabas_studio

-- 1. جدول التسجيلات الصوتية والمحاضرات (public.audio_tracks)
CREATE TABLE IF NOT EXISTS public.audio_tracks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'دروس علمية ومحاضرات',
    author TEXT NOT NULL DEFAULT 'المطور',
    artist TEXT DEFAULT '',
    audio_url TEXT,
    file_url TEXT,
    duration TEXT DEFAULT '0:00',
    badge TEXT DEFAULT 'سحابي',
    likes_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_admin_upload BOOLEAN DEFAULT true,
    user_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- فهارس السرعة والبحث
CREATE INDEX IF NOT EXISTS idx_audio_tracks_created_at ON public.audio_tracks (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audio_tracks_category ON public.audio_tracks (category);

-- مزامنة file_url مع audio_url تلقائياً
CREATE OR REPLACE FUNCTION public.sync_audio_urls()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.file_url IS NULL AND NEW.audio_url IS NOT NULL THEN
        NEW.file_url := NEW.audio_url;
    ELSIF NEW.audio_url IS NULL AND NEW.file_url IS NOT NULL THEN
        NEW.audio_url := NEW.file_url;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_sync_audio_urls ON public.audio_tracks;
CREATE TRIGGER trg_sync_audio_urls
BEFORE INSERT OR UPDATE ON public.audio_tracks
FOR EACH ROW EXECUTE FUNCTION public.sync_audio_urls();

-- تفعيل سياسات الأمان (Row Level Security - RLS)
ALTER TABLE public.audio_tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Audio Tracks"
ON public.audio_tracks FOR SELECT
USING (is_active = true);

CREATE POLICY "Admin Insert Audio Tracks"
ON public.audio_tracks FOR INSERT
WITH CHECK (true);

-- 2. إعداد مستودع التخزين الصوتي (Storage Bucket: audio-tracks)
INSERT INTO storage.buckets (id, name, public)
VALUES ('audio-tracks', 'audio-tracks', true)
ON CONFLICT (id) DO UPDATE SET public = true;

CREATE POLICY "Public Audio Bucket Select"
ON storage.objects FOR SELECT
USING (bucket_id = 'audio-tracks');

CREATE POLICY "Admin Audio Bucket Insert"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'audio-tracks');

-- 3. جدول تقييمات وآراء المستخدمين الحقيقية (public.app_reviews)
CREATE TABLE IF NOT EXISTS public.app_reviews (
    id TEXT PRIMARY KEY,
    author_name TEXT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    category_rating TEXT DEFAULT 'overall',
    app_version TEXT DEFAULT 'v1.2.1',
    device_model TEXT,
    comment TEXT NOT NULL,
    helpful_count INT DEFAULT 0,
    verified_user BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.app_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Reviews"
ON public.app_reviews FOR SELECT
USING (true);

CREATE POLICY "Public Insert Reviews"
ON public.app_reviews FOR INSERT
WITH CHECK (true);

-- 4. جدول إحصاءات الزوار الحقيقية (public.site_visitors)
CREATE TABLE IF NOT EXISTS public.site_visitors (
    id TEXT PRIMARY KEY,
    session_id TEXT NOT NULL,
    user_agent TEXT,
    page_path TEXT DEFAULT '/',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    last_active_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_site_visitors_last_active ON public.site_visitors (last_active_at DESC);

ALTER TABLE public.site_visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Visitors"
ON public.site_visitors FOR SELECT
USING (true);

CREATE POLICY "Public Insert Visitors"
ON public.site_visitors FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public Update Visitors"
ON public.site_visitors FOR UPDATE
USING (true);
`;
