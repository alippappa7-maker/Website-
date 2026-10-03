import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { 
  X, 
  Type, 
  Sun, 
  Moon, 
  BookOpen, 
  Sparkles, 
  Maximize2, 
  Minimize2,
  ZoomIn,
  ZoomOut,
  AlignLeft,
  ArrowRight
} from 'lucide-react';
import { useReadingMode, ReadingTheme } from '../context/ReadingModeContext';
import { LanguageSwitcher } from './LanguageSwitcher';

export const ReadingModeToolbar: React.FC<{ title?: string }> = ({ title }) => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language.startsWith('ar');

  const { 
    isReadingMode, 
    exitReadingMode, 
    fontSize, 
    increaseFontSize, 
    decreaseFontSize, 
    theme, 
    setTheme,
    lineHeight,
    setLineHeight,
  } = useReadingMode();

  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isReadingMode) return null;

  const themes: { id: ReadingTheme; name: string; bg: string; border: string }[] = [
    { id: 'cosmic', name: t('readingMode.themeCosmic'), bg: 'bg-[#080C14]', border: 'border-cyan-500/40 text-cyan-300' },
    { id: 'sepia', name: t('readingMode.themeSepia'), bg: 'bg-[#1C1813]', border: 'border-amber-500/40 text-amber-300' },
    { id: 'dark', name: t('readingMode.themeDark'), bg: 'bg-[#000000]', border: 'border-white/20 text-white' },
  ];

  return (
    <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Micro reading scroll progress bar */}
      <div className="w-full h-1 bg-white/5">
        <div 
          className="h-full bg-gradient-to-r from-amber-400 via-cyan-400 to-emerald-400 transition-all duration-75"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating HUD Reading Island */}
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-[#090E1A]/95 border border-cyan-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          
          {/* Exit Button & Title */}
          <div className="flex items-center gap-3">
            <button
              onClick={exitReadingMode}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-tajawal transition-all cursor-pointer group"
              title="ESC"
            >
              <ArrowRight className={`w-4 h-4 transition-transform ${isRtl ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1 rotate-180'}`} />
              <span>{t('readingMode.exit')}</span>
              <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[9px] font-mono bg-slate-900 text-cyan-400 border border-cyan-500/30 rounded">
                ESC
              </kbd>
            </button>

            {title && (
              <span className="hidden md:inline-block text-xs font-tajawal text-slate-300 truncate max-w-xs">
                {title}
              </span>
            )}
          </div>

          {/* Typography and Style controls */}
          <div className="flex items-center gap-2.5">
            {/* Language Switcher compact */}
            <LanguageSwitcher compact />

            {/* Font Size Adjuster */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1 text-xs">
              <button
                onClick={decreaseFontSize}
                disabled={fontSize <= 16}
                className="px-2 py-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer font-bold"
                title={t('readingMode.textSize')}
              >
                A-
              </button>
              <span className="px-1 font-mono text-[11px] text-cyan-300">{fontSize}px</span>
              <button
                onClick={increaseFontSize}
                disabled={fontSize >= 32}
                className="px-2 py-1 rounded-lg hover:bg-white/10 text-slate-300 hover:text-white disabled:opacity-40 transition-colors cursor-pointer font-bold"
                title={t('readingMode.textSize')}
              >
                A+
              </button>
            </div>

            {/* Line Height Toggle */}
            <button
              onClick={() => setLineHeight(lineHeight >= 2.6 ? 1.9 : lineHeight + 0.3)}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs"
              title={t('readingMode.lineSpacing')}
            >
              <span className="font-mono text-[11px]">↕ {lineHeight.toFixed(1)}</span>
            </button>

            {/* Theme Switches */}
            <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-xl p-1">
              {themes.map((themeItem) => (
                <button
                  key={themeItem.id}
                  onClick={() => setTheme(themeItem.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-tajawal transition-all cursor-pointer ${
                    theme === themeItem.id 
                      ? `${themeItem.bg} ${themeItem.border} font-bold shadow-sm` 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {themeItem.name}
                </button>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
