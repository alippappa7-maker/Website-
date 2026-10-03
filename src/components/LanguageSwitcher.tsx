import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, Check } from 'lucide-react';

export const LanguageSwitcher: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { i18n, t } = useTranslation();
  const currentLang = i18n.language.startsWith('en') ? 'en' : 'ar';

  const toggleLanguage = () => {
    const nextLang = currentLang === 'ar' ? 'en' : 'ar';
    i18n.changeLanguage(nextLang);
  };

  if (compact) {
    return (
      <button
        onClick={toggleLanguage}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-xs font-mono text-cyan-300 hover:text-white transition-all cursor-pointer shadow-[0_0_10px_rgba(0,229,255,0.1)]"
        title={t('common.switchLang')}
        aria-label={t('common.switchLang')}
      >
        <Globe className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-bold uppercase">{currentLang === 'ar' ? 'EN' : 'عربي'}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#0B1526]/80 hover:bg-[#0D1D35] border border-cyan-500/30 hover:border-cyan-400/60 text-slate-200 hover:text-white text-xs font-medium transition-all duration-200 shadow-[0_0_15px_rgba(0,229,255,0.15)] group cursor-pointer"
      title={t('common.switchLang')}
      aria-label={t('common.switchLang')}
    >
      <Globe className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-45 transition-transform duration-300" />
      <span className="font-tajawal font-bold text-cyan-300 group-hover:text-cyan-200">
        {currentLang === 'ar' ? 'English' : 'العربية'}
      </span>
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30 text-cyan-400">
        {currentLang === 'ar' ? 'EN' : 'AR'}
      </span>
    </button>
  );
};
