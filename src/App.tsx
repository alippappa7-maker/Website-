import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AudioPlayerProvider } from './context/AudioPlayerContext';
import { UplinkProvider } from './context/UplinkContext';
import { RatingProvider } from './context/RatingContext';
import { MediaVaultProvider } from './context/MediaVaultContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import { VisitorStatsProvider } from './context/VisitorStatsContext';
import { ToastProvider } from './context/ToastContext';
import { ReadingModeProvider, useReadingMode } from './context/ReadingModeContext';
import { Navbar } from './components/Navbar';
import { LiveTicker } from './components/LiveTicker';
import { Footer } from './components/Footer';
import { GlobalStickyPlayer } from './components/GlobalStickyPlayer';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { LiveUplinkHUD } from './components/LiveUplinkHUD';
import { RatingModal } from './components/RatingModal';
import { MediaViewerModal } from './components/MediaViewerModal';
import { MediaUploadModal } from './components/MediaUploadModal';
import { AdminAuthModal } from './components/AdminAuthModal';
import { ToastContainer } from './components/ToastContainer';

import { HomePage } from './pages/HomePage';
import { LessonsHubPage } from './pages/LessonsHubPage';
import { LessonDetailPage } from './pages/LessonDetailPage';
import { AppRepositoryPage } from './pages/AppRepositoryPage';
import { NewsPortalPage } from './pages/NewsPortalPage';
import { NewsDetailPage } from './pages/NewsDetailPage';
import { ScholarsPage } from './pages/ScholarsPage';
import { ScholarDetailPage } from './pages/ScholarDetailPage';
import { AdminUploaderPage } from './pages/AdminUploaderPage';
import { MediaVaultPage } from './pages/MediaVaultPage';
import { SitemapPage } from './pages/SitemapPage';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const MainLayout: React.FC = () => {
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const { isReadingMode, theme } = useReadingMode();

  const getThemeBg = () => {
    if (!isReadingMode) return 'bg-[#080C14] text-slate-100';
    if (theme === 'sepia') return 'bg-[#18140E] text-[#E8DCC4]';
    if (theme === 'dark') return 'bg-[#000000] text-slate-100';
    return 'bg-[#080C14] text-slate-100';
  };

  return (
    <div className={`min-h-screen flex flex-col font-cairo selection:bg-cyan-500/20 selection:text-cyan-300 transition-colors duration-300 ${getThemeBg()}`}>
      {/* Top Live Ticker (hidden in reading mode) */}
      {!isReadingMode && <LiveTicker />}

      {/* Top 3-Zone Navigation Bar (hidden in reading mode) */}
      {!isReadingMode && <Navbar onOpenSearch={() => setSearchModalOpen(true)} />}

      {/* Main App Content Views */}
      <main className={`flex-1 ${isReadingMode ? 'py-6' : 'pb-24'}`}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/media-vault" element={<MediaVaultPage />} />
          <Route path="/lessons" element={<LessonsHubPage />} />
          <Route path="/lesson/:id" element={<LessonDetailPage />} />
          <Route path="/podcast/:id" element={<LessonDetailPage />} />
          <Route path="/app-repository" element={<AppRepositoryPage />} />
          <Route path="/news" element={<NewsPortalPage />} />
          <Route path="/news/:slug" element={<NewsDetailPage />} />
          <Route path="/scholars" element={<ScholarsPage />} />
          <Route path="/scholar/:id" element={<ScholarDetailPage />} />
          <Route path="/admin/uploader" element={<AdminUploaderPage />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>

      {/* Live Uplink Activity Telemetry HUD for Visitors */}
      {!isReadingMode && <LiveUplinkHUD />}

      {/* Real-Time Community Rating Modal */}
      <RatingModal />

      {/* Admin Security Authentication Gate Modal */}
      <AdminAuthModal />

      {/* Media Viewer Lightbox / Spatial Video Player Modal */}
      <MediaViewerModal />

      {/* Media Upload Modal */}
      <MediaUploadModal />

      {/* Global Sticky Continuous Audio Player */}
      <GlobalStickyPlayer />

      {/* HUD Command Palette / Search Modal */}
      <GlobalSearchModal 
        isOpen={searchModalOpen} 
        onClose={() => setSearchModalOpen(false)} 
      />

      {/* Footer (hidden in reading mode) */}
      {!isReadingMode && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <HashRouter>
      <AdminAuthProvider>
        <UplinkProvider>
          <VisitorStatsProvider>
            <ToastProvider>
              <ReadingModeProvider>
                <RatingProvider>
                  <AudioPlayerProvider>
                    <MediaVaultProvider>
                      <ScrollToTop />
                      <ToastContainer />
                      <MainLayout />
                    </MediaVaultProvider>
                  </AudioPlayerProvider>
                </RatingProvider>
              </ReadingModeProvider>
            </ToastProvider>
          </VisitorStatsProvider>
        </UplinkProvider>
      </AdminAuthProvider>
    </HashRouter>
  );
}
