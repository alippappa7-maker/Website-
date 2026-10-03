import React, { useRef, useState, useEffect } from 'react';
import { 
  X, 
  Download, 
  Heart, 
  Share2, 
  Check, 
  ShieldCheck, 
  ExternalLink,
  Film,
  Headphones,
  Image as ImageIcon,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Sparkles,
  Layers,
  FileCode
} from 'lucide-react';
import { useMediaVault } from '../context/MediaVaultContext';
import { useAudioPlayer } from '../context/AudioPlayerContext';

export const MediaViewerModal: React.FC = () => {
  const { activeItem, isViewerOpen, closeViewer, downloadItem, toggleLike } = useMediaVault();
  const { playTrack } = useAudioPlayer();

  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioCurrentTime, setAudioCurrentTime] = useState('00:00');
  const [audioDurationFormatted, setAudioDurationFormatted] = useState('00:00');
  const [isMuted, setIsMuted] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    setIsPlayingAudio(false);
    setAudioProgress(0);
  }, [activeItem]);

  if (!isViewerOpen || !activeItem) return null;

  const handleShare = () => {
    const url = `${window.location.origin}/media-vault?id=${activeItem.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePlayGlobalAudio = () => {
    // Also transfer to continuous global audio player
    playTrack({
      id: activeItem.id,
      title: activeItem.title,
      seriesOrHost: activeItem.categoryLabel,
      scholarName: activeItem.authorName,
      coverImage: activeItem.thumbnailUrl,
      audioUrl: activeItem.fileUrl,
      durationSeconds: 300,
      contentType: 'lesson'
    });
  };

  const toggleAudioPlay = () => {
    if (!audioRef.current) return;
    if (isPlayingAudio) {
      audioRef.current.pause();
      setIsPlayingAudio(false);
    } else {
      audioRef.current.play();
      setIsPlayingAudio(true);
    }
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleAudioTimeUpdate = () => {
    if (!audioRef.current) return;
    const cur = audioRef.current.currentTime;
    const dur = audioRef.current.duration || 1;
    setAudioProgress((cur / dur) * 100);
    setAudioCurrentTime(formatSeconds(cur));
    if (dur && !isNaN(dur)) {
      setAudioDurationFormatted(formatSeconds(dur));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-2 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      {/* Container Card */}
      <div className="relative w-full max-w-5xl bg-[#090E1A] border border-cyan-500/30 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,229,255,0.15)] flex flex-col max-h-[92vh]">
        
        {/* Top Spatial HUD Header */}
        <div className="flex items-center justify-between px-5 sm:px-7 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase tracking-wider bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
              {activeItem.type === 'video' && <Film className="w-3.5 h-3.5" />}
              {activeItem.type === 'audio' && <Headphones className="w-3.5 h-3.5" />}
              {activeItem.type === 'image' && <ImageIcon className="w-3.5 h-3.5" />}
              <span>{activeItem.categoryLabel}</span>
            </span>

            <span className="hidden sm:inline-block text-xs font-mono text-slate-400">
              {activeItem.format} · {activeItem.resolution || activeItem.fileSize}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => toggleLike(activeItem.id)}
              className="p-2 rounded-xl text-slate-300 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="إعجاب"
            >
              <Heart className="w-4 h-4" />
            </button>

            <button
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-300 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
              title="مشاركة"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>

            <button
              onClick={() => downloadItem(activeItem)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 font-bold text-xs hover:from-cyan-300 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,229,255,0.3)]"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل ({activeItem.fileSize})</span>
            </button>

            <button
              onClick={closeViewer}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Media Viewer + Metadata */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          
          {/* Main Stage Media Render */}
          <div className="relative rounded-2xl overflow-hidden bg-black/80 border border-white/10 flex items-center justify-center shadow-2xl min-h-[300px] sm:min-h-[420px]">
            
            {/* 1. Video Player */}
            {activeItem.type === 'video' && (
              <video
                ref={videoRef}
                src={activeItem.fileUrl}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[65vh] object-contain rounded-2xl"
              />
            )}

            {/* 2. Image Fullscreen Lightbox */}
            {activeItem.type === 'image' && (
              <div className="relative group w-full flex items-center justify-center p-2">
                <img
                  src={activeItem.fileUrl}
                  alt={activeItem.title}
                  className="max-h-[65vh] max-w-full object-contain rounded-xl shadow-2xl"
                />
              </div>
            )}

            {/* 3. Audio Player with Spatial Waveform HUD */}
            {activeItem.type === 'audio' && (
              <div className="w-full max-w-2xl p-6 sm:p-10 space-y-8 text-center flex flex-col items-center">
                
                {/* Audio Artwork */}
                <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.25)] border border-cyan-500/40">
                  <img
                    src={activeItem.thumbnailUrl}
                    alt={activeItem.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-center p-2">
                    <span className="text-[10px] font-mono text-cyan-300 bg-black/60 px-2 py-0.5 rounded">
                      {activeItem.resolution || '320 kbps'}
                    </span>
                  </div>
                </div>

                {/* Hidden Audio Element */}
                <audio
                  ref={audioRef}
                  src={activeItem.fileUrl}
                  onTimeUpdate={handleAudioTimeUpdate}
                  onEnded={() => setIsPlayingAudio(false)}
                />

                {/* Audio Waveform Visualization Simulation */}
                <div className="w-full flex items-center justify-center gap-1 sm:gap-1.5 h-12 px-4">
                  {Array.from({ length: 36 }).map((_, idx) => {
                    const heightPercent = isPlayingAudio 
                      ? Math.sin(idx * 0.4 + audioProgress * 0.1) * 35 + 50 
                      : 25;
                    const isActiveBar = (idx / 36) * 100 <= audioProgress;
                    return (
                      <span
                        key={idx}
                        style={{ height: `${Math.max(15, heightPercent)}%` }}
                        className={`w-1.5 rounded-full transition-all duration-150 ${
                          isActiveBar
                            ? 'bg-gradient-to-t from-cyan-400 to-cyan-200 shadow-[0_0_8px_#00E5FF]'
                            : 'bg-white/15'
                        }`}
                      />
                    );
                  })}
                </div>

                {/* Progress Bar & Timers */}
                <div className="w-full space-y-2">
                  <div 
                    onClick={(e) => {
                      if (!audioRef.current) return;
                      const rect = e.currentTarget.getBoundingClientRect();
                      const clickX = e.clientX - rect.left;
                      const pct = clickX / rect.width;
                      audioRef.current.currentTime = pct * (audioRef.current.duration || 1);
                    }}
                    className="relative w-full h-2 rounded-full bg-white/10 overflow-hidden cursor-pointer group"
                  >
                    <div 
                      style={{ width: `${audioProgress}%` }}
                      className="h-full bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-full group-hover:from-cyan-400 group-hover:to-cyan-200 transition-all"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>{audioCurrentTime}</span>
                    <span>{audioDurationFormatted !== '00:00' ? audioDurationFormatted : activeItem.duration || '04:12'}</span>
                  </div>
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={toggleAudioPlay}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-500 text-slate-950 flex items-center justify-center shadow-[0_0_25px_rgba(0,229,255,0.4)] hover:scale-105 active:scale-95 transition-transform cursor-pointer"
                  >
                    {isPlayingAudio ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current ml-0.5" />}
                  </button>

                  <button
                    onClick={handlePlayGlobalAudio}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-white transition-all cursor-pointer"
                    title="مواصلة الاستماع في المشغل العائم أثناء تصفح الموقع"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                    <span>تشغيل في المشغل العائم</span>
                  </button>
                </div>

              </div>
            )}

          </div>

          {/* Details & Telemetry Information Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
            
            {/* Column 1 & 2: Info & Description */}
            <div className="lg:col-span-2 space-y-4 text-right">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white font-tajawal leading-snug">
                  {activeItem.title}
                </h2>
                <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-400">
                  <span className="text-cyan-300 font-bold">{activeItem.authorName}</span>
                  {activeItem.authorRole && (
                    <>
                      <span>•</span>
                      <span>{activeItem.authorRole}</span>
                    </>
                  )}
                  <span>•</span>
                  <span className="font-mono">{activeItem.createdAt}</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 space-y-2">
                <h4 className="text-xs font-bold text-slate-300 font-mono">تفاصيل ومحتوى المادة:</h4>
                <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeItem.description}
                </p>
              </div>

              {/* Tags */}
              <div className="space-y-1.5">
                <span className="text-xs font-mono text-slate-400">الوسوم والتصنيفات الدلالية:</span>
                <div className="flex flex-wrap gap-2">
                  {activeItem.tags.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 text-xs font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Column 3: Telemetry & Verification Card */}
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-[#0C1424] border border-cyan-500/30 space-y-4">
                
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>بطاقة التوثيق والبيانات</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/30">
                    مصدق رسمياً
                  </span>
                </div>

                <div className="space-y-2.5 text-xs font-mono">
                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">حجم الملف:</span>
                    <span className="font-bold text-white">{activeItem.fileSize}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">الصيغة والجودة:</span>
                    <span className="font-bold text-cyan-300">{activeItem.format} ({activeItem.resolution || 'HQ'})</span>
                  </div>

                  {activeItem.duration && (
                    <div className="flex items-center justify-between text-slate-300">
                      <span className="text-slate-500">المدة الزمنية:</span>
                      <span className="text-white">{activeItem.duration}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">المشاهدات:</span>
                    <span className="text-white">{activeItem.viewsCount}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-300">
                    <span className="text-slate-500">مرات التحميل:</span>
                    <span className="text-white">{activeItem.downloadsCount}</span>
                  </div>
                </div>

                {/* SHA-256 Fingerprint */}
                {activeItem.sha256 && (
                  <div className="pt-2 border-t border-white/10 space-y-1">
                    <span className="text-[10px] font-mono text-slate-400">بصمة التشفير (SHA-256 Checksum):</span>
                    <div className="p-2 rounded bg-black/60 border border-white/10 text-[9px] font-mono text-cyan-300 break-all select-all">
                      {activeItem.sha256}
                    </div>
                  </div>
                )}

                {/* Big Action Download */}
                <button
                  onClick={() => downloadItem(activeItem)}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 transition-all shadow-[0_0_20px_rgba(255,215,0,0.3)] cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>تحميل المادة فوراً ({activeItem.fileSize})</span>
                </button>

              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
