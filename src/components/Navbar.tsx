import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Download, 
  Search, 
  Menu, 
  X, 
  Radio, 
  Compass, 
  Newspaper, 
  Users, 
  Layers,
  Film,
  Lock,
  ShieldCheck,
  Bell
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';
import { useToast } from '../context/ToastContext';
import { LanguageSwitcher } from './LanguageSwitcher';
import { AppUpdateButton } from './AppUpdateButton';

interface NavbarProps {
  onOpenSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { t } = useTranslation();
  const { isAdmin, openAuthModal } = useAdminAuth();
  const { triggerDemoAlert } = useToast();

  const navLinks = [
    { name: t('nav.home'), path: '/', icon: Compass },
    { name: t('nav.mediaVault'), path: '/media-vault', icon: Film },
    { name: t('nav.lessons'), path: '/lessons', icon: Radio },
    { name: t('nav.appRepo'), path: '/app-repository', icon: Layers },
    { name: t('nav.news'), path: '/news', icon: Newspaper },
    { name: t('nav.scholars'), path: '/scholars', icon: Users },
    { name: t('nav.admin'), path: '/admin/uploader', icon: Radio, isProtected: true },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-[#080C14]/90 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Zone 1: Single text element Brand Zone with subtle HUD beacon */}
        <Link 
          to="/" 
          className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 rounded-lg p-1"
        >
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400/20 to-cyan-400/10 border border-amber-400/30 group-hover:border-amber-400/70 transition-all duration-300 shadow-[0_0_15px_rgba(255,215,0,0.15)]">
            <span className="font-serif text-xl font-bold text-amber-300 group-hover:text-amber-200 transition-colors">ق</span>
            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_#00E676]" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-wide text-white font-tajawal group-hover:text-cyan-300 transition-colors">
              {t('brand.name')} <span className="text-xs text-cyan-400 font-mono font-normal tracking-widest uppercase mr-1">QABAS</span>
            </span>
          </div>
        </Link>

        {/* Zone 2: 4-5 Clean nav links with subtle hover underlines */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-300">
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative py-1 whitespace-nowrap transition-colors duration-200 flex items-center gap-1.5 ${
                  active 
                    ? 'text-cyan-400 font-semibold' 
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <span>{link.name}</span>
                {link.isProtected && (
                  isAdmin ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="جلسة المشرف نشطة" />
                  ) : (
                    <span title="بوابة المشرف (محمية)">
                      <Lock className="w-3 h-3 text-slate-500" />
                    </span>
                  )
                )}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 rounded-full shadow-[0_0_8px_rgba(0,229,255,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (Language, Search, Admin, Download CTA) */}
        <div className="flex items-center gap-2.5">
          {/* Language Switcher */}
          <LanguageSwitcher />

          {isAdmin && (
            <button
              onClick={() => openAuthModal()}
              className="hidden md:flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold cursor-pointer hover:bg-amber-500/25 transition-all"
              title="إعدادات وحماية المشرف"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('nav.admin')}</span>
            </button>
          )}

          <button
            onClick={triggerDemoAlert}
            className="p-2 rounded-xl text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-400/40 transition-all cursor-pointer relative group"
            title="تجربة إشعار عاجل أو درس جديد (Live Toast)"
          >
            <Bell className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_6px_#F59E0B]" />
          </button>

          <button
            onClick={onOpenSearch}
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 transition-all cursor-pointer focus:outline-none focus:ring-1 focus:ring-cyan-400"
            title="بحث شامل في المحتوى (Ctrl+K)"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">{t('common.language') === 'Language' ? 'Search...' : 'بحث...'}</span>
            <kbd className="hidden md:inline-block px-1.5 py-0.5 text-[10px] font-mono bg-slate-800 text-slate-400 border border-slate-700 rounded">
              ⌘K
            </kbd>
          </button>

          {/* Dedicated App Update Button (Fetch Latest Release) */}
          <AppUpdateButton variant="navbar" />

          <Link
            to="/app-repository"
            className="hidden xl:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 hover:to-amber-400 shadow-[0_0_20px_rgba(255,215,0,0.25)] hover:shadow-[0_0_25px_rgba(255,215,0,0.4)] transition-all transform active:scale-95 whitespace-nowrap"
          >
            <Download className="w-3.5 h-3.5" />
            <span>APK v1.2.1</span>
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-300 bg-white/5 border border-white/10 hover:text-white"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#080C14]/98 backdrop-blur-2xl px-4 py-5 space-y-3 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    active
                      ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <AppUpdateButton variant="prominent" />
            <Link
              to="/app-repository"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 shadow-md"
            >
              <Download className="w-4 h-4" />
              <span>{t('hero.downloadApk')} (v1.2.1)</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
