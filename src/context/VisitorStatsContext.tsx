import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSupabaseClient, getStoredSupabaseConfig } from '../lib/supabase';

interface VisitorStatsContextType {
  onlineUsers: number;
  totalVisitors: number;
  isLiveConnected: boolean;
  pageViews: number;
}

const VisitorStatsContext = createContext<VisitorStatsContextType>({
  onlineUsers: 1,
  totalVisitors: 1,
  isLiveConnected: false,
  pageViews: 1,
});

const VISITOR_ID_KEY = 'qabas_visitor_session_id';
const LOCAL_TOTAL_VISITORS_KEY = 'qabas_total_visitors_cache';
const LOCAL_PAGE_VIEWS_KEY = 'qabas_local_page_views';

export const VisitorStatsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [onlineUsers, setOnlineUsers] = useState<number>(1);
  const [totalVisitors, setTotalVisitors] = useState<number>(() => {
    const cached = localStorage.getItem(LOCAL_TOTAL_VISITORS_KEY);
    return cached ? parseInt(cached, 10) : 1;
  });
  const [pageViews, setPageViews] = useState<number>(() => {
    const views = parseInt(localStorage.getItem(LOCAL_PAGE_VIEWS_KEY) || '0', 10) + 1;
    localStorage.setItem(LOCAL_PAGE_VIEWS_KEY, views.toString());
    return views;
  });
  const [isLiveConnected, setIsLiveConnected] = useState<boolean>(false);

  useEffect(() => {
    // Generate or fetch unique session ID
    let sessionId = localStorage.getItem(VISITOR_ID_KEY);
    const isNewVisitor = !sessionId;
    if (!sessionId) {
      sessionId = 'v_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem(VISITOR_ID_KEY, sessionId);
    }

    const config = getStoredSupabaseConfig();
    const supabase = getSupabaseClient();

    // 1. Record / Update visitor in Supabase database
    const recordVisitorInDb = async () => {
      try {
        if (!config.isConfigured) return;

        // Upsert visitor record
        await supabase
          .from('site_visitors')
          .upsert(
            {
              id: sessionId,
              session_id: sessionId,
              user_agent: navigator.userAgent.substring(0, 200),
              page_path: window.location.hash || window.location.pathname,
              last_active_at: new Date().toISOString()
            },
            { onConflict: 'id' }
          );

        // Fetch total unique visitors count
        const { count, error } = await supabase
          .from('site_visitors')
          .select('*', { count: 'exact', head: true });

        if (!error && typeof count === 'number' && count > 0) {
          setTotalVisitors(count);
          localStorage.setItem(LOCAL_TOTAL_VISITORS_KEY, count.toString());
        } else if (isNewVisitor) {
          setTotalVisitors((prev) => {
            const next = prev + 1;
            localStorage.setItem(LOCAL_TOTAL_VISITORS_KEY, next.toString());
            return next;
          });
        }
      } catch (err) {
        console.warn('Supabase visitor tracking error:', err);
      }
    };

    recordVisitorInDb();

    // 2. Realtime Presence Tracking for Online Users
    let presenceChannel: any = null;
    try {
      presenceChannel = supabase.channel('qabas_presence_live', {
        config: {
          presence: {
            key: sessionId,
          },
        },
      });

      presenceChannel
        .on('presence', { event: 'sync' }, () => {
          const state = presenceChannel.presenceState();
          const userCount = Object.keys(state).length;
          setOnlineUsers(Math.max(1, userCount));
          setIsLiveConnected(true);
        })
        .on('presence', { event: 'join' }, ({ newPresences }: any) => {
          const state = presenceChannel.presenceState();
          const userCount = Object.keys(state).length;
          setOnlineUsers(Math.max(1, userCount));
        })
        .on('presence', { event: 'leave' }, ({ leftPresences }: any) => {
          const state = presenceChannel.presenceState();
          const userCount = Object.keys(state).length;
          setOnlineUsers(Math.max(1, userCount));
        })
        .subscribe(async (status: string) => {
          if (status === 'SUBSCRIBED') {
            setIsLiveConnected(true);
            await presenceChannel.track({
              online_at: new Date().toISOString(),
              device: /mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
              path: window.location.hash || '/',
            });
          }
        });
    } catch (presenceErr) {
      console.warn('Presence channel subscription error:', presenceErr);
    }

    // Ping active presence every 30 seconds
    const pingInterval = setInterval(async () => {
      try {
        if (config.isConfigured) {
          await supabase
            .from('site_visitors')
            .update({ last_active_at: new Date().toISOString() })
            .eq('id', sessionId);
        }
      } catch {
        // silent ping
      }
    }, 30000);

    return () => {
      clearInterval(pingInterval);
      if (presenceChannel) {
        presenceChannel.unsubscribe();
      }
    };
  }, []);

  return (
    <VisitorStatsContext.Provider
      value={{
        onlineUsers,
        totalVisitors,
        isLiveConnected,
        pageViews,
      }}
    >
      {children}
    </VisitorStatsContext.Provider>
  );
};

export const useVisitorStats = () => useContext(VisitorStatsContext);
