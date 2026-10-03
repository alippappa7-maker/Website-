import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Star, X, Check, Sparkles, Send, Smartphone, ShieldCheck, Heart } from 'lucide-react';
import { useRating } from '../context/RatingContext';

export const RatingModal: React.FC = () => {
  const { isRatingModalOpen, closeRatingModal, submitReview } = useRating();

  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [authorName, setAuthorName] = useState('');
  const [deviceModel, setDeviceModel] = useState('');
  const [categoryRating, setCategoryRating] = useState<'overall' | 'studio' | 'quran' | 'stability'>('overall');
  const [comment, setComment] = useState('');
  const [appVersion, setAppVersion] = useState('v1.2.1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSubmitted, setSuccessSubmitted] = useState(false);

  if (!isRatingModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) {
      alert('يرجى كتابة اسمك وملاحظتك الصادقة حول التطبيق.');
      return;
    }

    setIsSubmitting(true);
    try {
      await submitReview({
        authorName: authorName.trim(),
        rating,
        categoryRating,
        appVersion,
        deviceModel: deviceModel.trim() || 'Android Device',
        comment: comment.trim()
      });

      // Launch celebration
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 }
      });

      setSuccessSubmitted(true);
      setTimeout(() => {
        setSuccessSubmitted(false);
        closeRatingModal();
        // Reset form
        setAuthorName('');
        setDeviceModel('');
        setComment('');
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#090E1A] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,229,255,0.15)] space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-300 border border-amber-400/40 flex items-center justify-center">
              <Star className="w-4 h-4 fill-amber-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-tajawal">نظام التقييم الحقيقي</h3>
              <p className="text-[11px] text-cyan-400 font-mono">Real-Time Community Rating Engine</p>
            </div>
          </div>

          <button
            onClick={closeRatingModal}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {successSubmitted ? (
          <div className="py-12 text-center space-y-3 animate-in zoom-in-95 duration-300">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(0,230,118,0.3)]">
              <Check className="w-8 h-8" />
            </div>
            <h4 className="text-lg font-bold text-white">شكراً لتقييمك الصادق!</h4>
            <p className="text-xs text-slate-300 max-w-xs mx-auto">
              تم تسجيل تقييمك واحتسابه فوراً في المعدل العام ونسب الرضا الحقيقية للمنظومة.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Transparent Integrity Notice */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs text-slate-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                نلتزم بالشفافية والصدق التام: لا توجد أي تقييمات وهمية، وملاحظتك تنعكس في المتوسط الرياضي الفعلي للتطبيق مباشرة.
              </span>
            </div>

            {/* Star Picker */}
            <div className="text-center space-y-2 py-2">
              <label className="text-xs font-mono text-slate-400 block">
                حدد تقييمك العام للتطبيق:
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((starValue) => {
                  const isFilled = (hoverRating || rating) >= starValue;
                  return (
                    <button
                      key={starValue}
                      type="button"
                      onMouseEnter={() => setHoverRating(starValue)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(starValue)}
                      className="p-1 focus:outline-none transition-transform hover:scale-125 cursor-pointer"
                    >
                      <Star
                        className={`w-8 h-8 transition-colors ${
                          isFilled
                            ? 'text-amber-400 fill-amber-400 drop-shadow-[0_0_12px_rgba(255,215,0,0.6)]'
                            : 'text-slate-600'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-xs font-bold text-amber-300 font-mono">
                {rating === 5 && 'ممتاز جداً — 5 من 5 نجوم'}
                {rating === 4 && 'جيد جداً — 4 من 5 نجوم'}
                {rating === 3 && 'متوسط — 3 من 5 نجوم'}
                {rating === 2 && 'يحتاج تحسينات — نجمتان'}
                {rating === 1 && 'ضعيف — نجمة واحدة'}
              </div>
            </div>

            {/* Category of review */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 block">أبرز جانب ركز عليه تقييمك:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { id: 'overall', label: 'تجربة التطبيق العامة' },
                  { id: 'studio', label: 'استوديو ومحرر الفيديو والـ SFX' },
                  { id: 'quran', label: 'المكتبة والقرآن والتجويد' },
                  { id: 'stability', label: 'الأداء والخفة وسرعة التنزيل' },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategoryRating(item.id as any)}
                    className={`p-2.5 rounded-xl border text-right transition-colors cursor-pointer ${
                      categoryRating === item.id
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 shadow-sm'
                        : 'bg-black/30 border-white/10 text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Inputs: Name & Device */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">الاسم أو اللقب:</label>
                <input
                  type="text"
                  required
                  placeholder="مثال: م. عبد الرحمن"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">نوع جهازك ونظام أندرويد:</label>
                <input
                  type="text"
                  placeholder="مثال: Galaxy S23 / Android 14"
                  value={deviceModel}
                  onChange={(e) => setDeviceModel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                رأيك الصادق، الميزات التي أعجبتك، أو مقترحات للتطوير:
              </label>
              <textarea
                required
                rows={3}
                placeholder="اكتب تقييمك الواقعي لتطبيق قبس واستوديو الإنتاج..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-300 to-amber-400 hover:from-amber-200 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_25px_rgba(255,215,0,0.3)]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'جاري الاعتماد...' : 'نشر التقييم وتحديث النسبة فوراً'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
