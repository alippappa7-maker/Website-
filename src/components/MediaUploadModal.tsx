import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  Film, 
  Headphones, 
  Image as ImageIcon, 
  Sparkles, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Tag
} from 'lucide-react';
import { useMediaVault } from '../context/MediaVaultContext';
import { useUplink } from '../context/UplinkContext';
import { MediaType, MediaCategory } from '../types';
import { calculateFileSha256 } from '../lib/supabase';

export const MediaUploadModal: React.FC = () => {
  const { isUploadModalOpen, closeUploadModal, addMediaItem } = useMediaVault();
  const { startUplink, updateUplinkProgress, completeUplink } = useUplink();

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [calculatedSha256, setCalculatedSha256] = useState('');
  const [isHashing, setIsHashing] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<MediaType>('video');
  const [category, setCategory] = useState<MediaCategory>('video_lectures');
  const [authorName, setAuthorName] = useState('فريق قبس للإنتاج');
  const [authorRole, setAuthorRole] = useState('إنتاج وتصميم');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('قبس, ستوديو, إنتاج');
  const [resolution, setResolution] = useState('1080p Full HD');

  const [isUploading, setIsUploading] = useState(false);
  const [uploadPercent, setUploadPercent] = useState(0);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isUploadModalOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);

    // Auto-detect type
    let detectedType: MediaType = 'image';
    let defaultRes = '1080p FHD';
    if (file.type.startsWith('video/')) {
      detectedType = 'video';
      setCategory('video_lectures');
      defaultRes = '1080p Full HD';
    } else if (file.type.startsWith('audio/')) {
      detectedType = 'audio';
      setCategory('quran');
      defaultRes = '320 kbps HQ';
    } else if (file.type.startsWith('image/')) {
      detectedType = 'image';
      setCategory('cards_designs');
      defaultRes = '4K UHD (3840x2160)';
    }
    setType(detectedType);
    setResolution(defaultRes);

    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, ''));
    }

    // Object URL for preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Calculate SHA-256
    setIsHashing(true);
    try {
      const hash = await calculateFileSha256(file);
      setCalculatedSha256(hash);
    } catch {
      setCalculatedSha256('hash-error');
    } finally {
      setIsHashing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const fakeEvent = { target: { files: [file] } } as any;
      handleFileChange(fakeEvent);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);
    setUploadPercent(0);

    // Start Live Uplink Telemetry Broadcast for site visitors
    startUplink({
      type: type === 'audio' ? 'audio' : 'news',
      title: `رفع وسائط جديدة: ${title}`,
      totalSize: selectedFile ? `${(selectedFile.size / 1048576).toFixed(1)} MB` : '15 MB',
      sha256: calculatedSha256
    });

    let current = 0;
    const interval = setInterval(() => {
      current += 15;
      if (current >= 100) {
        clearInterval(interval);
        setUploadPercent(100);

        // Finalize item addition
        const categoryLabels: Record<MediaCategory, string> = {
          quran: 'تلاوات قرآنية',
          video_lectures: 'شروحات ودروس مرئية',
          daawah_shorts: 'مقاطع دعوية وفيديو قصير',
          cards_designs: 'بطاقات وتصاميم دعوية',
          wallpapers: 'خلفيات ومخطوطات إسلامية',
          sound_fx: 'مؤثرات واستوديو قبس'
        };

        const finalUrl = previewUrl || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=2400&q=90';
        const finalThumbnail = type === 'image' 
          ? finalUrl 
          : type === 'video'
          ? '/src/assets/images/app_apk_preview_1791004602629.jpg'
          : '/src/assets/images/lesson_tafsir_cover_1791004582862.jpg';

        const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

        addMediaItem({
          title,
          type,
          category,
          categoryLabel: categoryLabels[category],
          fileUrl: finalUrl,
          thumbnailUrl: finalThumbnail,
          fileSize: selectedFile ? `${(selectedFile.size / 1048576).toFixed(1)} ميغابايت` : '14.2 ميغابايت',
          fileSizeBytes: selectedFile ? selectedFile.size : 14800000,
          format: selectedFile ? selectedFile.name.split('.').pop()?.toUpperCase() || 'MP4' : 'MP4',
          resolution,
          duration: type !== 'image' ? '03:45' : undefined,
          authorName,
          authorRole,
          description: description || 'مادة وسائط مخصصة لمجتمع قبس.',
          tags: tags.length > 0 ? tags : ['قبس', 'وسائط'],
          sha256: calculatedSha256 || undefined,
          isFeatured: true
        }, selectedFile || undefined);

        completeUplink({
          type: type === 'audio' ? 'audio' : 'news',
          item: { title },
          title: `تم رفع ونشر المادة: ${title}`
        });

        setIsUploading(false);
        closeUploadModal();
      } else {
        setUploadPercent(current);
        updateUplinkProgress(
          current, 
          `${(Math.random() * 3 + 6).toFixed(1)} MB/s`,
          `${((current / 100) * (selectedFile ? selectedFile.size / 1048576 : 15)).toFixed(1)} MB`
        );
      }
    }, 280);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-3xl bg-[#090E1A] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(0,229,255,0.2)] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2">
            <UploadCloud className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white font-tajawal">
              رفع وسائط جديدة (فيديو / صوت / صور)
            </h2>
          </div>

          <button
            onClick={closeUploadModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
          
          {/* Drag & Drop File Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/70 bg-black/40 hover:bg-black/60 rounded-2xl p-6 text-center transition-all cursor-pointer group space-y-3"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*,audio/*,image/*"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 mx-auto rounded-full bg-cyan-500/10 border border-cyan-400/30 flex items-center justify-center text-cyan-300 group-hover:scale-110 transition-transform">
              <UploadCloud className="w-7 h-7" />
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                {selectedFile ? selectedFile.name : 'اسحب الملف هنا أو انقر للاختيار من جهازك'}
              </p>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                يدعم الفيديوهات (MP4, MKV)، الصوتيات (MP3, WAV)، والصور والبطاقات (PNG, JPG, WEBP)
              </p>
            </div>

            {selectedFile && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/30 text-xs font-mono text-cyan-300">
                <FileCheck className="w-3.5 h-3.5" />
                <span>{(selectedFile.size / 1048576).toFixed(2)} MB · {selectedFile.type || 'ملف وسائط'}</span>
              </div>
            )}
          </div>

          {/* Live Preview if file chosen */}
          {previewUrl && (
            <div className="p-4 rounded-2xl bg-black/50 border border-white/10 space-y-3">
              <span className="text-xs font-bold text-slate-300 font-mono flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>معاينة فورية للملف المختار:</span>
              </span>

              <div className="max-h-56 flex items-center justify-center overflow-hidden rounded-xl bg-black/80">
                {type === 'video' && (
                  <video src={previewUrl} controls className="max-h-52 rounded-xl" />
                )}
                {type === 'image' && (
                  <img src={previewUrl} alt="معاينة" className="max-h-52 object-contain rounded-xl" />
                )}
                {type === 'audio' && (
                  <audio src={previewUrl} controls className="w-full my-4" />
                )}
              </div>
            </div>
          )}

          {/* Type Selector Buttons */}
          <div className="space-y-2">
            <label className="text-xs font-mono text-slate-300">نوع الوسائط (Media Type):</label>
            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => { setType('video'); setCategory('video_lectures'); setResolution('1080p Full HD'); }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                  type === 'video'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_15px_rgba(255,191,0,0.3)]'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <Film className="w-4 h-4" />
                <span>🎬 مرئي وفيديو</span>
              </button>

              <button
                type="button"
                onClick={() => { setType('audio'); setCategory('quran'); setResolution('320 kbps Studio'); }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                  type === 'audio'
                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(0,229,255,0.3)]'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <Headphones className="w-4 h-4" />
                <span>🎵 صوت واستوديو</span>
              </button>

              <button
                type="button"
                onClick={() => { setType('image'); setCategory('cards_designs'); setResolution('4K UHD (3840x2160)'); }}
                className={`flex items-center justify-center gap-2 py-3 rounded-xl border text-xs font-bold font-mono transition-all cursor-pointer ${
                  type === 'image'
                    ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(0,230,118,0.3)]'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:border-white/20'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>🖼️ بطاقة وتصميم</span>
              </button>
            </div>
          </div>

          {/* Title & Category Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">عنوان المادة *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: سورة الواقعة - تلاوة خاشعة"
                required
                className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">التصنيف الموضوعي</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MediaCategory)}
                className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              >
                <option value="quran">تلاوات قرآنية</option>
                <option value="video_lectures">شروحات ودروس مرئية</option>
                <option value="daawah_shorts">مقاطع دعوية وفيديو قصير</option>
                <option value="cards_designs">بطاقات وتصاميم دعوية</option>
                <option value="wallpapers">خلفيات ومخطوطات إسلامية</option>
                <option value="sound_fx">مؤثرات واستوديو قبس</option>
              </select>
            </div>

          </div>

          {/* Author Name & Role */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">اسم القارئ / المحاضر / المصمم</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono text-slate-300">الدقة أو جودة الصوت (Resolution / Bitrate)</label>
              <input
                type="text"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="1080p FHD أو 320 kbps"
                className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300">الوصف والتفاصيل</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              placeholder="اكتب نبذة مختصرة عن محتوى المادة..."
              className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl p-3 text-xs text-white placeholder-slate-500 outline-none resize-none"
            />
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center gap-1">
              <Tag className="w-3.5 h-3.5 text-cyan-400" />
              <span>الوسوم والكلمات المفتاحية (مفصولة بفواصل):</span>
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="قرآن, تلاوة خاشعة, تصميم, 4K"
              className="w-full bg-black/60 border border-white/15 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-xs text-white outline-none"
            />
          </div>

          {/* Security Telemetry (SHA-256) */}
          <div className="p-3.5 rounded-xl bg-black/70 border border-white/10 space-y-1 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400">
              <span>بصمة التشفير الآلية (SHA-256):</span>
              {isHashing ? (
                <span className="text-amber-400 flex items-center gap-1">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  جاري الحساب...
                </span>
              ) : (
                <span className="text-emerald-400">✓ جاهز</span>
              )}
            </div>
            <div className="text-[10px] text-cyan-300 break-all select-all">
              {calculatedSha256 || 'سيتم استخراج بصمة الأمان بمجرد اختيار الملف'}
            </div>
          </div>

          {/* Progress Bar (if uploading) */}
          {isUploading && (
            <div className="space-y-2 p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300">
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>جاري البث والرفع الحي إلى المنظومة...</span>
                </span>
                <span>{uploadPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-black/60 overflow-hidden">
                <div 
                  style={{ width: `${uploadPercent}%` }}
                  className="h-full bg-gradient-to-r from-cyan-400 to-amber-400 rounded-full transition-all"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isUploading || !title.trim()}
            className="w-full py-3.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-cyan-400 via-cyan-300 to-amber-400 hover:from-cyan-300 transition-all shadow-[0_0_25px_rgba(0,229,255,0.35)] cursor-pointer disabled:opacity-50"
          >
            {isUploading ? 'جاري البث والرفع الحي...' : 'نشر وتثبيت المادة في مركز الوسائط فوراً'}
          </button>

        </form>

      </div>

    </div>
  );
};
