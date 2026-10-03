import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { ToastNotification } from '../types';
import { getSupabaseClient } from '../lib/supabase';

interface ToastContextType {
  toasts: ToastNotification[];
  showToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => string;
  removeToast: (id: string) => void;
  notifyUrgentNews: (title: string, message: string, slug?: string) => void;
  notifyNewLesson: (title: string, author: string, id: string) => void;
  notifyAppUpdate: (version: string, notes?: string) => void;
  notifySuccess: (title: string, message: string) => void;
  triggerDemoAlert: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Play subtle high-tech HUD harmonic chime with Web Audio API
const playHUDChime = (type: ToastNotification['type']) => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    if (type === 'urgent_news') {
      // Urgent amber double pulse
      osc.frequency.setValueAtTime(587.33, now); // D5
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.15); // A5
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    } else if (type === 'new_lesson') {
      // Cyan soft crystalline bell
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.2); // E5
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    } else {
      // Gentle soft chime
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(660, now + 0.15);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.45);
  } catch {
    // AudioContext blocked by browser policy prior to interaction - fail gracefully
  }
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback((toastData: Omit<ToastNotification, 'id' | 'timestamp'>): string => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9) + '_' + Date.now();
    const newToast: ToastNotification = {
      ...toastData,
      id,
      timestamp: Date.now(),
      duration: toastData.duration || 7000,
    };

    setToasts((prev) => [newToast, ...prev.slice(0, 3)]); // Keep max 4 toasts
    playHUDChime(newToast.type);

    return id;
  }, []);

  const notifyUrgentNews = useCallback((title: string, message: string, slug?: string) => {
    showToast({
      type: 'urgent_news',
      title: `⚡ بيان عاجل: ${title}`,
      message,
      actionLabel: 'قراءة البيان كاملاً',
      actionUrl: slug ? `/news/${slug}` : '/news',
      duration: 8000,
      meta: { badge: 'عاجل' }
    });
  }, [showToast]);

  const notifyNewLesson = useCallback((title: string, author: string, id: string) => {
    showToast({
      type: 'new_lesson',
      title: '🎙️ مادة صوتية جديدة متاحة الآن',
      message: `${title} — فضيلة الشيخ: ${author}`,
      actionLabel: 'استماع وتشغيل فوري',
      actionUrl: `/lesson/${id}`,
      duration: 7500,
      meta: { author, category: 'تلاوة / درس' }
    });
  }, [showToast]);

  const notifyAppUpdate = useCallback((version: string, notes?: string) => {
    showToast({
      type: 'app_update',
      title: `📱 تحديث جديد للتطبيق متوفر (${version})`,
      message: notes || 'تم إطلاق حزمة جديدة مع تحسينات في استقرار التلاوات والتخزين السحابي.',
      actionLabel: 'تنزيل حزمة APK الآن',
      actionUrl: '/app-repository',
      duration: 8000,
      meta: { badge: 'تحديث' }
    });
  }, [showToast]);

  const notifySuccess = useCallback((title: string, message: string) => {
    showToast({
      type: 'success',
      title,
      message,
      duration: 5000,
    });
  }, [showToast]);

  const triggerDemoAlert = useCallback(() => {
    const demos = [
      () => notifyUrgentNews(
        'إطلاق الإصدار 1.2.1 مع التخزين السحابي الهجين المفتوح',
        'يسر إدارة منصة قبس الإعلان عن ربط المستودع بسحابة Supabase ومزامنة المقاطع الصوتية بالكامل.',
        'update-v1-2-1'
      ),
      () => notifyNewLesson(
        'سورة المؤمنون — تلاوة خاشعة مرئية برواية حفص عن عاصم',
        'أحمد النفيس',
        'quran-recitation-1'
      ),
      () => notifyAppUpdate(
        'v1.2.1 Build 3',
        'تم تحسين جودة مشغل الصوت وإضافة دعم تشغيل الخلفية على Android 14 و 15.'
      ),
    ];
    const pick = demos[Math.floor(Math.random() * demos.length)];
    pick();
  }, [notifyUrgentNews, notifyNewLesson, notifyAppUpdate]);

  // Initial greeting notification for visitors
  useEffect(() => {
    const timer = setTimeout(() => {
      showToast({
        type: 'info',
        title: '✨ مرحباً بك في منصة واستوديو قَبَس',
        message: 'تم تفعيل التزامن السحابي المباشر، يمكنك الاستماع للتلاوات وتحميل تطبيق الأندرويد المحدث.',
        actionLabel: 'تصفح المكتبة الصوتية',
        actionUrl: '/lessons',
        duration: 6000,
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [showToast]);

  // Listen for real-time broadcast changes via Supabase
  useEffect(() => {
    try {
      const supabase = getSupabaseClient();
      const broadcastChannel = supabase.channel('qabas_broadcast_notifications')
        .on('broadcast', { event: 'urgent_news' }, ({ payload }: any) => {
          if (payload?.title) {
            notifyUrgentNews(payload.title, payload.message || '', payload.slug);
          }
        })
        .on('broadcast', { event: 'new_lesson' }, ({ payload }: any) => {
          if (payload?.title) {
            notifyNewLesson(payload.title, payload.author || 'المطور', payload.id || '1');
          }
        })
        .subscribe();

      return () => {
        broadcastChannel.unsubscribe();
      };
    } catch {
      // Supabase realtime channel not configured yet
    }
  }, [notifyUrgentNews, notifyNewLesson]);

  return (
    <ToastContext.Provider
      value={{
        toasts,
        showToast,
        removeToast,
        notifyUrgentNews,
        notifyNewLesson,
        notifyAppUpdate,
        notifySuccess,
        triggerDemoAlert,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
