import React from 'react';
import { useAudioPlayer } from '../context/AudioPlayerContext';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Download, 
  X, 
  ExternalLink,
  Radio,
  Sliders
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const GlobalStickyPlayer: React.FC = () => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    isMuted,
    isPlayerVisible,
    togglePlay,
    seekTo,
    skipSeconds,
    setRate,
    setVol,
    toggleMute,
    closePlayer,
    downloadAudioFile,
  } = useAudioPlayer();

  if (!isPlayerVisible || !currentTrack) return null;

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    seekTo((val / 100) * duration);
  };

  const rates = [1, 1.25, 1.5, 2];

  const detailPath = currentTrack.contentType === 'lesson' 
    ? `/lesson/${currentTrack.id}` 
    : `/podcast/${currentTrack.id}`;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#070B13]/95 backdrop-blur-2xl border-t border-cyan-500/25 shadow-[0_-10px_35px_rgba(0,0,0,0.8)] transition-all">
      {/* Precision scrub bar across top edge of player */}
      <div className="relative w-full h-1.5 bg-slate-800/80 cursor-pointer group">
        <div 
          className="absolute top-0 right-0 h-full bg-gradient-to-l from-cyan-400 via-amber-400 to-emerald-400 group-hover:h-2 transition-all duration-150"
          style={{ width: `${progressPercent}%` }}
        />
        <input
          type="range"
          min="0"
          max="100"
          value={isNaN(progressPercent) ? 0 : progressPercent}
          onChange={handleSeekChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          aria-label="شريط تقدم التشغيل الصوتي"
        />
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-6">
        
        {/* Track Metadata & Cover */}
        <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0 max-w-[45%] sm:max-w-xs md:max-w-sm">
          <div className="relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl overflow-hidden shrink-0 border border-white/15 bg-slate-900 shadow-md">
            <img 
              src={currentTrack.coverImage} 
              alt={currentTrack.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            {isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-0.5 px-1">
                <span className="w-1 h-3.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                <span className="w-1 h-5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                <span className="w-1 h-2.5 bg-emerald-400 rounded-full animate-bounce" />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-cyan-400 truncate">
                {currentTrack.contentType === 'lesson' ? 'درس صوتي' : 'بودكاست قبس'}
              </span>
              <span className="text-slate-600 hidden sm:inline">·</span>
              <span className="text-[11px] text-slate-400 truncate hidden sm:inline">
                {currentTrack.scholarName}
              </span>
            </div>
            <Link
              to={detailPath}
              className="block text-xs sm:text-sm font-semibold text-white truncate hover:text-amber-300 transition-colors"
              title={currentTrack.title}
            >
              {currentTrack.title}
            </Link>
          </div>
        </div>

        {/* Core Audio Controls & Timeline */}
        <div className="flex flex-col items-center gap-1 flex-1 max-w-md">
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Skip back 10s */}
            <button
              onClick={() => skipSeconds(-10)}
              className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded-lg cursor-pointer"
              title="تأخير 10 ثوانٍ"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-r from-cyan-400 to-amber-400 text-slate-950 font-bold hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(0,229,255,0.4)] transition-all cursor-pointer"
              aria-label={isPlaying ? 'إيقاف مؤقت' : 'تشغيل'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-slate-950" />
              ) : (
                <Play className="w-5 h-5 fill-slate-950 mr-0.5" />
              )}
            </button>

            {/* Skip forward 10s */}
            <button
              onClick={() => skipSeconds(10)}
              className="p-1.5 text-slate-400 hover:text-cyan-300 transition-colors rounded-lg cursor-pointer"
              title="تقديم 10 ثوانٍ"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Speed toggle pills */}
            <div className="hidden sm:flex items-center bg-white/5 rounded-lg p-0.5 border border-white/10 text-[10px] font-mono">
              {rates.map((r) => (
                <button
                  key={r}
                  onClick={() => setRate(r)}
                  className={`px-1.5 py-0.5 rounded transition-colors ${
                    playbackRate === r 
                      ? 'bg-cyan-500/30 text-cyan-300 font-bold' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>

          {/* Time indicator */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 tabular-nums">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume & Aux Actions */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          
          {/* Volume Control */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="p-1 text-slate-400 hover:text-cyan-300 transition-colors"
              title={isMuted ? 'إلغاء الكتم' : 'كتم الصوت'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => setVol(parseFloat(e.target.value))}
              className="w-16 h-1 accent-cyan-400 cursor-pointer"
              aria-label="التحكم بمستوى الصوت"
            />
          </div>

          {/* Download Track Audio */}
          <button
            onClick={() => downloadAudioFile(currentTrack)}
            className="p-1.5 sm:p-2 text-slate-300 hover:text-amber-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all cursor-pointer"
            title="تحميل المادة الصوتية (MP3)"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Go to full detail page */}
          <Link
            to={detailPath}
            className="hidden sm:inline-flex p-1.5 sm:p-2 text-slate-300 hover:text-cyan-300 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
            title="صفحة المادة الكاملة"
          >
            <ExternalLink className="w-4 h-4" />
          </Link>

          {/* Close Player */}
          <button
            onClick={closePlayer}
            className="p-1.5 sm:p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
            title="إغلاق المشغل"
            aria-label="إغلاق المشغل الصوتي"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
