import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { AppRelease, Lesson, NewsArticle, UplinkBroadcastEvent, XdeltaPatch } from '../types';
import { APP_RELEASES_DATA, LESSONS_DATA, NEWS_DATA, SCHOLARS_DATA, RECITER_YASSER_IMAGE } from '../data/mockData';
import { fetchLiveGitHubReleases } from '../services/githubReleaseService';
import { getStoredSupabaseConfig, getSupabaseClient } from '../lib/supabase';
import { fetchLiveAndroidCiRuns, GitHubCiRun, BASELINE_CI_RUN } from '../services/githubCiService';

export const INITIAL_PATCHES_DATA: XdeltaPatch[] = [
  {
    id: 'patch-001',
    baseVersion: 'v1.1.0',
    targetVersion: 'v1.2.1',
    patchSize: '3.4 ميغابايت',
    fullApkSize: '29.7 ميغابايت',
    savedPercentage: '88%',
    sha256: '5cb4120677113629b7fe230eb6dea9ded85f4f4da0c4f60072397ae4789d7284',
    releaseDate: '2026-10-02',
    downloadUrl: 'https://github.com/alippappa7-maker/qabas_studio/releases/download/v1.2.1/patch-v1.1.0-to-v1.2.1.xdelta',
    instructions: 'يقوم تطبيق قبس بتطبيق هذا الباتش تلقائياً في الخلفية فور تحميله لتحديث التطبيق دون الحاجة لإعادة تنزيل الـ 29.7 ميغابايت كاملة.'
  },
  {
    id: 'patch-002',
    baseVersion: 'v1.0.0',
    targetVersion: 'v1.1.0',
    patchSize: '2.8 ميغابايت',
    fullApkSize: '28.4 ميغابايت',
    savedPercentage: '90%',
    sha256: 'a6b5d3290754f2470075a6a4eb1befd2c7357cb9153dba5aaf62df413c955c35',
    releaseDate: '2026-09-15',
    downloadUrl: 'https://github.com/alippappa7-maker/qabas_studio/releases/download/v1.1.0/patch-v1.0.0-to-v1.1.0.xdelta',
    instructions: 'باتش ترقية تراكمي لمحرك Jetpack Compose ومعمارية Target SDK 36.'
  }
];

interface NotificationAlert {
  id: string;
  type: 'apk' | 'xdelta' | 'audio' | 'news';
  title: string;
  subtitle: string;
  link: string;
  timestamp: number;
}

export interface UpdateCheckResult {
  status: 'latest' | 'new_version_found' | 'error';
  message: string;
  version?: string;
  source?: string;
  timestamp: string;
  release?: AppRelease;
  patch?: XdeltaPatch;
}

interface UplinkContextType {
  activeUplink: UplinkBroadcastEvent | null;
  notificationAlert: NotificationAlert | null;
  releases: AppRelease[];
  patches: XdeltaPatch[];
  lessons: Lesson[];
  news: NewsArticle[];
  isSyncingGitHub: boolean;
  lastSyncTime: string | null;
  syncFromGitHubNow: () => Promise<void>;
  supabaseConnected: boolean;
  supabaseTrackCount: number;
  syncFromSupabaseNow: () => Promise<void>;
  // Android CI Pipeline live state
  ciRun: GitHubCiRun | null;
  isSyncingCi: boolean;
  syncCiNow: () => Promise<void>;
  // Auto-Update and Manual Fetch
  isCheckingUpdates: boolean;
  lastUpdateResult: UpdateCheckResult | null;
  autoUpdateEnabled: boolean;
  setAutoUpdateEnabled: (enabled: boolean) => void;
  checkForUpdatesNow: (isManual?: boolean) => Promise<UpdateCheckResult>;
  clearUpdateResult: () => void;
  startUplink: (event: Partial<UplinkBroadcastEvent>) => void;
  updateUplinkProgress: (progress: number, speed?: string, uploaded?: string) => void;
  completeUplink: (resultData: {
    type: 'apk' | 'xdelta' | 'audio' | 'news';
    item: any;
    title: string;
  }) => void;
  cancelUplink: () => void;
  dismissNotification: () => void;
  simulateSampleUplink: (scenario: 'xdelta' | 'apk' | 'audio') => void;
}

const UplinkContext = createContext<UplinkContextType | undefined>(undefined);

export const UplinkProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeUplink, setActiveUplink] = useState<UplinkBroadcastEvent | null>(null);
  const [notificationAlert, setNotificationAlert] = useState<NotificationAlert | null>(null);
  
  const [releases, setReleases] = useState<AppRelease[]>(APP_RELEASES_DATA);
  const [patches, setPatches] = useState<XdeltaPatch[]>(INITIAL_PATCHES_DATA);
  const [lessons, setLessons] = useState<Lesson[]>(LESSONS_DATA);
  const [news, setNews] = useState<NewsArticle[]>(NEWS_DATA);

  const [isSyncingGitHub, setIsSyncingGitHub] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const [supabaseConnected, setSupabaseConnected] = useState(true);
  const [supabaseTrackCount, setSupabaseTrackCount] = useState(0);

  // Dedicated App Update State
  const [isCheckingUpdates, setIsCheckingUpdates] = useState(false);
  const [lastUpdateResult, setLastUpdateResult] = useState<UpdateCheckResult | null>(null);
  const [autoUpdateEnabled, setAutoUpdateEnabled] = useState(true);

  // Live Android CI Workflow State
  const [ciRun, setCiRun] = useState<GitHubCiRun | null>(BASELINE_CI_RUN);
  const [isSyncingCi, setIsSyncingCi] = useState(false);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const simulationIntervalRef = useRef<any>(null);

  // Fetch Live Android CI workflow runs
  const syncCiNow = async () => {
    setIsSyncingCi(true);
    try {
      const { latestRun } = await fetchLiveAndroidCiRuns();
      if (latestRun) {
        setCiRun(latestRun);
      }
    } catch (e) {
      console.warn('syncCiNow error:', e);
    } finally {
      setIsSyncingCi(false);
    }
  };

  // Synchronize live audio tracks from Supabase
  const syncFromSupabaseNow = async () => {
    try {
      const config = getStoredSupabaseConfig();
      if (!config.isConfigured) return;

      const supabase = getSupabaseClient();
      const { data, error } = await supabase
        .from('audio_tracks')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.warn('Supabase fetch audio_tracks error:', error);
        return;
      }

      if (Array.isArray(data) && data.length > 0) {
        setSupabaseConnected(true);
        setSupabaseTrackCount(data.length);

        const mappedLessons: Lesson[] = data.map((track) => ({
          id: track.id,
          title: track.title,
          series: track.category || 'تلاوات قرآنية ومحاضرات',
          category: track.category?.includes('قرآن') ? 'quran' : 'tazkiyah',
          categoryLabel: track.category || 'تلاوة سحابية',
          type: 'audio',
          scholarId: 'scholar-qabas-core',
          scholar: {
            id: `scholar-${track.id}`,
            name: track.artist || track.author || 'الشيخ د. ياسر الدوسري',
            title: 'إمام وخطيب المسجد الحرام (تسجيل سحابي معتمد)',
            bio: 'تسجيل صوتي سحابي موثق ومخزن في قاعدة بيانات ومستودع Supabase الخاص بتطبيق قبس.',
            avatar: RECITER_YASSER_IMAGE,
            specialization: track.category || 'تلاوات قرآنية',
            lessonsCount: 1,
            podcastsCount: 0,
            verified: true
          },
          duration: track.duration && track.duration !== '0:00' ? track.duration : '14:20',
          durationSeconds: 860,
          publishedAt: track.created_at ? track.created_at.split('T')[0] : '2026-10-02',
          summary: `تسجيل سحابي مبارك: «${track.title}» بصوت ${track.artist || track.author || 'القارئ'} محفوظ في سحابة قبس الرسمية.`,
          audioUrl: track.audio_url || track.file_url,
          coverImage: RECITER_YASSER_IMAGE,
          topics: [track.category || 'تلاوة قرآنية', 'مزامنة سحابية نشطة مع تطبيق قبس'],
          transcripts: [],
          references: [],
          downloadSize: '12.3 ميغابايت',
          mp3Url: track.audio_url || track.file_url,
          playsCount: track.plays_count || 0,
          downloadsCount: track.downloads_count || 0,
          isFeatured: true
        }));

        setLessons((prev) => {
          const nonDuplicates = prev.filter((p) => !data.some((d) => d.id === p.id));
          return [...mappedLessons, ...nonDuplicates];
        });
      }
    } catch (err) {
      console.warn('syncFromSupabaseNow error:', err);
    }
  };

  // Maximum releases and patches to keep in memory (auto-prune oldest)
  const MAX_RELEASES_RETAIN = 3;
  const MAX_PATCHES_RETAIN = 2;

  // Synchronize live with GitHub Releases and Android CI
  const syncFromGitHubNow = async () => {
    setIsSyncingGitHub(true);
    try {
      const [releasesData] = await Promise.all([
        fetchLiveGitHubReleases(),
        syncCiNow()
      ]);
      const { releases: liveReleases, patches: livePatches } = releasesData;
      if (liveReleases.length > 0) {
        setReleases(liveReleases.slice(0, MAX_RELEASES_RETAIN));
      }
      if (livePatches.length > 0) {
        setPatches(livePatches.slice(0, MAX_PATCHES_RETAIN));
      }
      setLastSyncTime(new Date().toLocaleTimeString('ar-EG'));
    } catch (e) {
      console.warn('Sync failed:', e);
    } finally {
      setIsSyncingGitHub(false);
    }
  };

  // Dedicated manual or automated check for updates
  const checkForUpdatesNow = async (isManual = true): Promise<UpdateCheckResult> => {
    setIsCheckingUpdates(true);
    const nowTimestamp = new Date().toLocaleTimeString('ar-EG');

    try {
      // 1. Fetch releases and Android CI workflow runs concurrently
      const [releasesData] = await Promise.all([
        fetchLiveGitHubReleases(),
        syncCiNow(),
        syncFromSupabaseNow()
      ]);
      const { releases: liveReleases, patches: livePatches, sourceRepo } = releasesData;

      if (liveReleases.length > 0) {
        const topRelease = liveReleases[0];
        const currentTop = releases[0];

        // Compare versions or build numbers
        const isNewer = currentTop ? (topRelease.version !== currentTop.version || topRelease.buildNumber > currentTop.buildNumber) : false;

        setReleases(liveReleases.slice(0, MAX_RELEASES_RETAIN));
        if (livePatches.length > 0) {
          setPatches(livePatches.slice(0, MAX_PATCHES_RETAIN));
        }
        setLastSyncTime(nowTimestamp);

        if (isNewer) {
          // New version discovered!
          setNotificationAlert({
            id: `alert-apk-${Date.now()}`,
            type: 'apk',
            title: `تم إطلاق إصدار جديد: ${topRelease.version}`,
            subtitle: `حزمة APK الرسمية وتحديثات xdelta متاحة للتحميل الآن (${topRelease.apkSize})`,
            link: '/app-repository',
            timestamp: Date.now()
          });

          const result: UpdateCheckResult = {
            status: 'new_version_found',
            message: `تم اكتشاف إصدار جديد (${topRelease.version}) وجلبه بنجاح!`,
            version: topRelease.version,
            source: sourceRepo || 'GitHub Releases',
            timestamp: nowTimestamp,
            release: topRelease,
            patch: livePatches[0]
          };
          setLastUpdateResult(result);
          return result;
        } else {
          // Already on latest
          const result: UpdateCheckResult = {
            status: 'latest',
            message: `أنت تستخدم أحدث إصدار معتمد حالياً (${topRelease.version})`,
            version: topRelease.version,
            source: sourceRepo || 'GitHub Releases',
            timestamp: nowTimestamp,
            release: topRelease,
            patch: livePatches[0]
          };
          setLastUpdateResult(result);
          return result;
        }
      } else {
        const result: UpdateCheckResult = {
          status: 'latest',
          message: `تطبيق قبس محدث لأحدث إصدار (${releases[0]?.version || 'v1.2.1'})`,
          version: releases[0]?.version || 'v1.2.1',
          source: 'المنظومة السحابية الموثقة',
          timestamp: nowTimestamp,
          release: releases[0]
        };
        setLastUpdateResult(result);
        return result;
      }
    } catch (err: any) {
      console.warn('Update check failed:', err);
      const result: UpdateCheckResult = {
        status: 'error',
        message: 'تعذر الاتصال بمستودع GitHub حالياً، تم الإبقاء على آخر حزمة معتمدة',
        version: releases[0]?.version || 'v1.2.1',
        timestamp: nowTimestamp
      };
      setLastUpdateResult(result);
      return result;
    } finally {
      setIsCheckingUpdates(false);
    }
  };

  const clearUpdateResult = () => {
    setLastUpdateResult(null);
  };

  // Run on mount
  useEffect(() => {
    syncFromGitHubNow();
    syncFromSupabaseNow();
    syncCiNow();
  }, []);

  // Background Automatic Updater Loop (polls every 60 seconds)
  useEffect(() => {
    if (!autoUpdateEnabled) return;

    const autoUpdateInterval = setInterval(() => {
      // Silent background fetch
      checkForUpdatesNow(false);
    }, 60000);

    const onWindowFocus = () => {
      checkForUpdatesNow(false);
    };

    window.addEventListener('focus', onWindowFocus);

    return () => {
      clearInterval(autoUpdateInterval);
      window.removeEventListener('focus', onWindowFocus);
    };
  }, [autoUpdateEnabled]);

  // Setup BroadcastChannel for cross-tab realtime sync
  useEffect(() => {
    try {
      const channel = new BroadcastChannel('qabas_live_uplink');
      channelRef.current = channel;

      channel.onmessage = (e) => {
        const { action, payload } = e.data;
        if (action === 'UPLINK_UPDATE') {
          setActiveUplink(payload);
        } else if (action === 'UPLINK_COMPLETED') {
          setActiveUplink(null);
          setNotificationAlert(payload.alert);
          if (payload.type === 'apk') {
            setReleases(prev => [
              payload.item, 
              ...prev.filter(r => r.version !== payload.item.version).map(r => ({ ...r, isLatest: false }))
            ].slice(0, MAX_RELEASES_RETAIN));
          } else if (payload.type === 'xdelta') {
            setPatches(prev => [
              payload.item, 
              ...prev.filter(p => p.id !== payload.item.id)
            ].slice(0, MAX_PATCHES_RETAIN));
          } else if (payload.type === 'audio') {
            setLessons(prev => [payload.item, ...prev]);
          } else if (payload.type === 'news') {
            setNews(prev => [payload.item, ...prev]);
          }
        } else if (action === 'UPLINK_CANCELLED') {
          setActiveUplink(null);
        }
      };

      return () => {
        channel.close();
      };
    } catch (err) {
      console.warn('BroadcastChannel not supported:', err);
    }
  }, []);

  const broadcastMessage = (action: string, payload: any) => {
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({ action, payload });
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const startUplink = (event: Partial<UplinkBroadcastEvent>) => {
    const fullEvent: UplinkBroadcastEvent = {
      id: `uplink-${Date.now()}`,
      status: 'uploading',
      type: event.type || 'apk',
      title: event.title || 'جاري رفع الملف...',
      progress: 0,
      speed: event.speed || '4.8 MB/s',
      uploadedSize: '0 MB',
      totalSize: event.totalSize || '42.8 MB',
      targetVersion: event.targetVersion,
      sha256: event.sha256,
      timestamp: Date.now(),
      ...event
    };

    setActiveUplink(fullEvent);
    broadcastMessage('UPLINK_UPDATE', fullEvent);
  };

  const updateUplinkProgress = (progress: number, speed?: string, uploaded?: string) => {
    setActiveUplink((prev) => {
      if (!prev) return null;
      const updated: UplinkBroadcastEvent = {
        ...prev,
        progress: Math.min(100, progress),
        speed: speed || prev.speed,
        uploadedSize: uploaded || prev.uploadedSize,
        status: progress >= 100 ? 'completed' : 'uploading'
      };
      broadcastMessage('UPLINK_UPDATE', updated);
      return updated;
    });
  };

  const completeUplink = (resultData: {
    type: 'apk' | 'xdelta' | 'audio' | 'news';
    item: any;
    title: string;
  }) => {
    const alert: NotificationAlert = {
      id: `notif-${Date.now()}`,
      type: resultData.type,
      title: 'اكتمل البث والرفع بنجاح (Realtime)',
      subtitle: resultData.title,
      link: resultData.type === 'apk' || resultData.type === 'xdelta' 
        ? '/app-repository' 
        : resultData.type === 'audio' 
        ? `/lesson/${resultData.item.id}` 
        : `/news/${resultData.item.slug || resultData.item.id}`,
      timestamp: Date.now()
    };

    setActiveUplink(null);
    setNotificationAlert(alert);

    if (resultData.type === 'apk') {
      setReleases(prev => [
        resultData.item, 
        ...prev.filter(r => r.version !== resultData.item.version).map(r => ({ ...r, isLatest: false }))
      ].slice(0, MAX_RELEASES_RETAIN));
    } else if (resultData.type === 'xdelta') {
      setPatches(prev => [
        resultData.item, 
        ...prev.filter(p => p.id !== resultData.item.id)
      ].slice(0, MAX_PATCHES_RETAIN));
    } else if (resultData.type === 'audio') {
      setLessons(prev => [resultData.item, ...prev]);
    } else if (resultData.type === 'news') {
      setNews(prev => [resultData.item, ...prev]);
    }

    broadcastMessage('UPLINK_COMPLETED', {
      type: resultData.type,
      item: resultData.item,
      alert
    });
  };

  const cancelUplink = () => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
    setActiveUplink(null);
    broadcastMessage('UPLINK_CANCELLED', {});
  };

  const dismissNotification = () => {
    setNotificationAlert(null);
  };

  // Quick simulation helper for user testing
  const simulateSampleUplink = (scenario: 'xdelta' | 'apk' | 'audio') => {
    cancelUplink();

    if (scenario === 'xdelta') {
      const targetVer = 'v1.2.2';
      const baseVer = 'v1.2.1';
      startUplink({
        type: 'xdelta',
        title: `جاري رفع حزمة xdelta لتحديث ${targetVer}`,
        totalSize: '2.6 ميغابايت',
        targetVersion: targetVer,
        sha256: '9a84f32190bcda11234981765243109a8bcdef91230491823094812039481203'
      });

      let currentPct = 5;
      simulationIntervalRef.current = setInterval(() => {
        currentPct += Math.floor(Math.random() * 15) + 10;
        if (currentPct >= 100) {
          clearInterval(simulationIntervalRef.current);
          const newPatch: XdeltaPatch = {
            id: `patch-${Date.now()}`,
            baseVersion: baseVer,
            targetVersion: targetVer,
            patchSize: '2.6 ميغابايت',
            fullApkSize: '29.9 ميغابايت',
            savedPercentage: '91%',
            sha256: '9a84f32190bcda11234981765243109a8bcdef91230491823094812039481203',
            releaseDate: new Date().toISOString().split('T')[0],
            downloadUrl: `https://github.com/alippappa7-maker/qabas_studio/releases/download/${targetVer}/patch-${baseVer}-to-${targetVer}.xdelta`,
            instructions: 'تم بث الباتش بنجاح ومزامنته مع سحابة Supabase ومستودع التطبيق.'
          };

          completeUplink({
            type: 'xdelta',
            item: newPatch,
            title: `تم توفير حزمة التحديث الجزئي xdelta (${baseVer} ➔ ${targetVer}) بحجم 2.6 MB فقط!`
          });
        } else {
          updateUplinkProgress(
            currentPct,
            `${(Math.random() * 2 + 4).toFixed(1)} MB/s`,
            `${((currentPct / 100) * 2.6).toFixed(1)} MB`
          );
        }
      }, 500);

    } else if (scenario === 'apk') {
      const ver = 'v1.2.2';
      startUplink({
        type: 'apk',
        title: `جاري رفع حزمة APK الرسمية ${ver}`,
        totalSize: '29.9 ميغابايت',
        targetVersion: ver,
        sha256: 'f839a0129bc4890123ef89104812903841920394812093841209384102938401'
      });

      let currentPct = 10;
      simulationIntervalRef.current = setInterval(() => {
        currentPct += Math.floor(Math.random() * 18) + 8;
        if (currentPct >= 100) {
          clearInterval(simulationIntervalRef.current);
          const newRelease: AppRelease = {
            version: ver,
            buildNumber: 4,
            releaseDate: new Date().toISOString().split('T')[0],
            apkSize: '29.9 ميغابايت',
            sha256: 'f839a0129bc4890123ef89104812903841920394812093841209384102938401',
            minAndroid: 'Android 7.0 (API 24)',
            targetAndroid: 'Android API 36',
            downloadUrl: `https://github.com/alippappa7-maker/qabas_studio/releases/download/${ver}/qabas-${ver}-release.apk`,
            isLatest: true,
            architectures: ['arm64-v8a', 'x86_64'],
            changelog: {
              whatIsNew: [
                'دعم محرك التحديثات الدقيقة xdelta لتقليل حجم التحميل بنسبة تصل إلى 91%.',
                'مزامنة فورية مع محطة الرفع الإدارية والبث الحي للملفات.'
              ],
              improvements: ['تسريع زمن بدء تشغيل المقاطع الصوتية بنسبة 20%.'],
              fixes: ['معالجة استقرار التنبيهات في الخلفية.']
            }
          };

          completeUplink({
            type: 'apk',
            item: newRelease,
            title: `تم إطلاق الإصدار الجديد ${ver} بنجاح وإدراجه في قائمة المستودع!`
          });
        } else {
          updateUplinkProgress(
            currentPct,
            `${(Math.random() * 3 + 5).toFixed(1)} MB/s`,
            `${((currentPct / 100) * 29.9).toFixed(1)} MB`
          );
        }
      }, 550);

    } else if (scenario === 'audio') {
      startUplink({
        type: 'audio',
        title: 'جاري رفع تسجيل درس: فقه المقاصد وضوابط الاستنباط',
        totalSize: '48.5 ميغابايت',
        sha256: '1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b'
      });

      let currentPct = 12;
      simulationIntervalRef.current = setInterval(() => {
        currentPct += Math.floor(Math.random() * 20) + 10;
        if (currentPct >= 100) {
          clearInterval(simulationIntervalRef.current);
          const newLesson: Lesson = {
            id: `lesson-${Date.now()}`,
            title: 'فقه المقاصد وضوابط الاستنباط في النوازل المعاصرة',
            series: 'سلسلة قبسات من التنزيل الحكيم',
            category: 'fiqh',
            categoryLabel: 'فقه وأصول',
            type: 'audio',
            scholarId: 'scholar-4',
            scholar: SCHOLARS_DATA[3],
            duration: '54:20',
            durationSeconds: 3260,
            publishedAt: new Date().toISOString().split('T')[0],
            summary: 'تحليل دقيق لأهمية رعاية مقاصد الشريعة العليا في الفتوى المعاصرة وموازنة المصالح والمفاسد.',
            audioUrl: 'https://actions.google.com/sounds/v1/water/creek_water_trickling.ogg',
            coverImage: '/src/assets/images/hero_qabas_hud_1791004572463.jpg',
            topics: ['المصالح الضرورية الخمس وتطبيقاتها', 'سد الذرائع وفتحها', 'فقه الموازنات في المسائل المستجدة'],
            transcripts: [
              {
                id: 't-new-1',
                timeSeconds: 0,
                timeFormatted: '00:00',
                speaker: 'الشيخ محمد الحسن الددو',
                text: 'بسم الله والحمد لله، إن مراعاة مقاصد الشريعة من أعظم ما يعين الفقيه على إدراك حكمة الشارع.'
              }
            ],
            references: [
              {
                id: 'r-new-1',
                title: 'مقاصد الشريعة الإسلامية',
                author: 'ابن عاشور'
              }
            ],
            downloadSize: '48.5 ميغابايت',
            mp3Url: 'https://actions.google.com/sounds/v1/water/creek_water_trickling.ogg',
            playsCount: 1,
            downloadsCount: 0
          };

          completeUplink({
            type: 'audio',
            item: newLesson,
            title: 'تم نشر وتوثيق درس صوتي جديد بنجاح وتوفيره للمستمعين!'
          });
        } else {
          updateUplinkProgress(
            currentPct,
            `${(Math.random() * 2 + 6).toFixed(1)} MB/s`,
            `${((currentPct / 100) * 48.5).toFixed(1)} MB`
          );
        }
      }, 500);
    }
  };

  return (
    <UplinkContext.Provider
      value={{
        activeUplink,
        notificationAlert,
        releases,
        patches,
        lessons,
        news,
        isSyncingGitHub,
        lastSyncTime,
        syncFromGitHubNow,
        supabaseConnected,
        supabaseTrackCount,
        syncFromSupabaseNow,
        ciRun,
        isSyncingCi,
        syncCiNow,
        isCheckingUpdates,
        lastUpdateResult,
        autoUpdateEnabled,
        setAutoUpdateEnabled,
        checkForUpdatesNow,
        clearUpdateResult,
        startUplink,
        updateUplinkProgress,
        completeUplink,
        cancelUplink,
        dismissNotification,
        simulateSampleUplink
      }}
    >
      {children}
    </UplinkContext.Provider>
  );
};

export const useUplink = () => {
  const context = useContext(UplinkContext);
  if (!context) {
    throw new Error('useUplink must be used within an UplinkProvider');
  }
  return context;
};
