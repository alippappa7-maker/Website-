import React, { useState, useEffect } from 'react';
import { LIVE_TICKER_ITEMS } from '../data/mockData';
import { Radio, ChevronLeft, ChevronRight, Pause, Play, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVisitorStats } from '../context/VisitorStatsContext';

export const LiveTicker: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { onlineUsers, isLiveConnected } = useVisitorStats();

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % LIVE_TICKER_ITEMS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + LIVE_TICKER_ITEMS.length) % LIVE_TICKER_ITEMS.length);
  };

  return (
    <div className="relative w-full bg-[#05080E] border-b border-cyan-500/15 py-2 px-4 text-xs overflow-hidden z-30">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Badge & Label */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
          </span>
          <span className="text-cyan-400 font-bold uppercase tracking-wider font-mono text-[11px] flex items-center gap-1">
            <Radio className="w-3 h-3 text-cyan-400" />
            بث الإعلانات
          </span>
          <span className="hidden sm:inline text-slate-500">|</span>
        </div>

        {/* Ticker Content */}
        <div 
          className="flex-1 overflow-hidden relative cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <Link 
            to="/news" 
            className="block truncate text-slate-200 hover:text-amber-300 transition-colors"
          >
            {LIVE_TICKER_ITEMS[currentIndex]}
          </Link>
        </div>

        {/* Controls & Live Users Badge */}
        <div className="flex items-center gap-3 shrink-0 text-slate-400">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-[11px] font-mono text-cyan-300">
            <span className="flex h-1.5 w-1.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
            </span>
            <Users className="w-3 h-3 text-cyan-400" />
            <span>{onlineUsers} نشط</span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 hover:text-cyan-300 transition-colors rounded"
              title={isPaused ? 'استئناف الحركة' : 'إيقاف مؤقت'}
            >
              {isPaused ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
            </button>
            <button
              onClick={handlePrev}
              className="p-1 hover:text-cyan-300 transition-colors rounded"
              title="السابق"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-1 hover:text-cyan-300 transition-colors rounded"
              title="التالي"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
