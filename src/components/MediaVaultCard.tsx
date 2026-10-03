import React, { useState } from 'react';
import { 
  Play, 
  Headphones, 
  Image as ImageIcon, 
  Download, 
  Heart, 
  Share2, 
  Check, 
  Eye, 
  Film,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { MediaVaultItem } from '../types';
import { useMediaVault } from '../context/MediaVaultContext';

interface MediaVaultCardProps {
  item: MediaVaultItem;
}

export const MediaVaultCard: React.FC<MediaVaultCardProps> = ({ item }) => {
  const { openViewer, downloadItem, toggleLike } = useMediaVault();
  const [copied, setCopied] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/media-vault?id=${item.id}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    downloadItem(item);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleLike(item.id);
  };

  const typeConfig = {
    video: {
      label: 'مرئي / فيديو',
      icon: Film,
      badgeColor: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
      actionIcon: Play,
      accentBorder: 'hover:border-amber-400/50',
      glowShadow: 'group-hover:shadow-[0_0_30px_rgba(255,191,0,0.2)]'
    },
    audio: {
      label: 'صوتي / استوديو',
      icon: Headphones,
      badgeColor: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
      actionIcon: Headphones,
      accentBorder: 'hover:border-cyan-400/50',
      glowShadow: 'group-hover:shadow-[0_0_30px_rgba(0,229,255,0.2)]'
    },
    image: {
      label: 'تصميم / بطاقة',
      icon: ImageIcon,
      badgeColor: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
      actionIcon: Eye,
      accentBorder: 'hover:border-emerald-400/50',
      glowShadow: 'group-hover:shadow-[0_0_30px_rgba(0,230,118,0.2)]'
    }
  }[item.type];

  const ActionIcon = typeConfig.actionIcon;
  const TypeIcon = typeConfig.icon;

  return (
    <div 
      onClick={() => openViewer(item)}
      className={`group relative rounded-2xl bg-[#090E1A]/85 backdrop-blur-xl border border-white/10 ${typeConfig.accentBorder} transition-all duration-300 flex flex-col overflow-hidden cursor-pointer shadow-lg ${typeConfig.glowShadow}`}
    >
      {/* Top Media Thumbnail / Preview Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-black/60">
        <img 
          src={item.thumbnailUrl} 
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Ambient Dark Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#090E1A] via-transparent to-black/40" />

        {/* Top Badges (Type & Format) */}
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5">
            <span className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold uppercase tracking-wider border backdrop-blur-md ${typeConfig.badgeColor}`}>
              <TypeIcon className="w-3 h-3" />
              <span>{typeConfig.label}</span>
            </span>

            {item.isFeatured && (
              <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono font-bold bg-amber-400 text-slate-950 shadow-[0_0_10px_rgba(255,215,0,0.5)]">
                <Sparkles className="w-2.5 h-2.5" />
                <span>مميز</span>
              </span>
            )}
          </div>

          <span className="px-2 py-0.5 rounded text-[10px] font-mono text-slate-300 bg-black/60 backdrop-blur-md border border-white/10">
            {item.format}
          </span>
        </div>

        {/* Hover Action HUD Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/35 backdrop-blur-[2px]">
          <div className="w-13 h-13 rounded-full bg-gradient-to-br from-white/20 to-white/5 border border-white/30 backdrop-blur-xl flex items-center justify-center text-white shadow-[0_0_25px_rgba(255,255,255,0.3)] transform scale-90 group-hover:scale-100 transition-transform">
            <ActionIcon className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Bottom Thumbnail Telemetry (Duration / Resolution / Size) */}
        <div className="absolute bottom-2.5 right-3 left-3 flex items-center justify-between text-[11px] font-mono text-slate-200">
          <span className="bg-black/70 px-2 py-0.5 rounded backdrop-blur-md border border-white/10">
            {item.duration || item.resolution || item.fileSize}
          </span>

          <span className="bg-black/70 px-2 py-0.5 rounded backdrop-blur-md border border-white/10 text-cyan-300">
            {item.categoryLabel}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div className="space-y-2">
          {/* Author / Creator */}
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
              {item.authorName}
            </span>
            <span className="text-[10px] font-mono text-slate-500">
              {item.createdAt}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors leading-snug font-tajawal">
            {item.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Tags */}
        {item.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {item.tags.slice(0, 3).map((tag, idx) => (
              <span 
                key={idx} 
                className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 border border-white/5"
              >
                #{tag}
              </span>
            ))}
            {item.tags.length > 3 && (
              <span className="text-[10px] font-mono text-slate-500 self-center">
                +{item.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Bottom Interactive Action Bar */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
          
          {/* Stats (Views & Downloads) */}
          <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
            <span className="flex items-center gap-1" title="المشاهدات / الاستماع">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{item.viewsCount}</span>
            </span>
            <span className="flex items-center gap-1" title="التحميلات">
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>{item.downloadsCount}</span>
            </span>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
            {/* Like */}
            <button
              onClick={handleLike}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
              title="إعجاب"
            >
              <Heart className="w-3.5 h-3.5" />
            </button>

            {/* Share */}
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-cyan-500/10 transition-colors"
              title="مشاركة الرابط"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>

            {/* Download */}
            <button
              onClick={handleDownload}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/30 text-cyan-300 font-bold font-mono text-[11px] transition-all cursor-pointer"
              title="تحميل الملف"
            >
              <Download className="w-3.5 h-3.5" />
              <span>تحميل</span>
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
