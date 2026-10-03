import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Unlock, 
  KeyRound, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  Key, 
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useAdminAuth } from '../context/AdminAuthContext';

export const AdminAuthModal: React.FC = () => {
  const { isAuthModalOpen, closeAuthModal, loginAdmin, changeMasterPasskey, isAdmin, logoutAdmin } = useAdminAuth();
  
  const [passkey, setPasskey] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isChangeMode, setIsChangeMode] = useState(false);

  // Change passkey inputs
  const [oldPasskey, setOldPasskey] = useState('');
  const [newPasskey, setNewPasskey] = useState('');
  const [changeMsg, setChangeMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const success = loginAdmin(passkey);
    if (success) {
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setPasskey('');
        closeAuthModal();
      }, 700);
    } else {
      setErrorMsg('رمز المرور غير صحيح. الوصول محصور للمشرف المعتمد فقط.');
    }
  };

  const handleChangePasskey = (e: React.FormEvent) => {
    e.preventDefault();
    setChangeMsg(null);

    const changed = changeMasterPasskey(oldPasskey, newPasskey);
    if (changed) {
      setChangeMsg({ type: 'success', text: 'تم تحديث رمز الإدارة الرئيسي بنجاح!' });
      setOldPasskey('');
      setNewPasskey('');
      setTimeout(() => {
        setIsChangeMode(false);
        setChangeMsg(null);
      }, 1500);
    } else {
      setChangeMsg({ type: 'error', text: 'الرمز الحالي غير صحيح أو أن الرمز الجديد أقل من 6 خانات.' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-xl p-4 overflow-y-auto animate-in fade-in duration-200">
      
      <div className="relative w-full max-w-md bg-[#090E1A] border border-amber-500/40 rounded-3xl overflow-hidden shadow-[0_0_80px_rgba(255,191,0,0.2)] flex flex-col">
        
        {/* Header with Cybernetic Neon Shield */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
            <Lock className="w-4 h-4 text-amber-400" />
            <span>ADMIN SECURITY GATE · بوابة التحقق الإداري</span>
          </div>

          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-right">
          
          {/* Visual Beacon */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-amber-500/10 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(255,191,0,0.25)]">
              {isAdmin ? <ShieldCheck className="w-8 h-8 text-emerald-400" /> : <KeyRound className="w-8 h-8" />}
            </div>
            
            <h3 className="text-lg font-bold text-white font-tajawal">
              {isAdmin ? 'أنت مسجل الدخول كـ مشرف النظام' : 'صلاحيات رفع وإدارة المحتوى محصورة'}
            </h3>

            <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
              {isAdmin 
                ? 'لديك صلاحيات كاملة لنشر وتحديث وحذف المواد الصوتية والمرئية والـ APK.' 
                : 'يمنع النظام المستخدمين والزوار العاديين من الرفع أو التعديل لحماية بيانات الموقع. أدخل الرمز السري للمتابعة:'}
            </p>
          </div>

          {isAdmin ? (
            /* If already Admin */
            <div className="space-y-4 pt-2">
              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>جلسة الإدارة نشطة وآمنة (Admin Session Active)</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setIsChangeMode(!isChangeMode)}
                  className="flex-1 py-2.5 px-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-mono text-slate-200 transition-colors"
                >
                  {isChangeMode ? 'إلغاء تغيير الرمز' : 'تغيير الرمز السري'}
                </button>

                <button
                  type="button"
                  onClick={logoutAdmin}
                  className="py-2.5 px-4 rounded-xl border border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 text-xs font-bold transition-colors"
                >
                  قفل الجلسة (خروج)
                </button>
              </div>

              {isChangeMode && (
                <form onSubmit={handleChangePasskey} className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">الرمز السري الحالي</label>
                    <input
                      type="password"
                      value={oldPasskey}
                      onChange={(e) => setOldPasskey(e.target.value)}
                      required
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-mono text-slate-400">الرمز السري الجديد (6 خانات فأكثر)</label>
                    <input
                      type="password"
                      value={newPasskey}
                      onChange={(e) => setNewPasskey(e.target.value)}
                      required
                      className="w-full bg-black/80 border border-white/15 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-amber-400"
                    />
                  </div>

                  {changeMsg && (
                    <div className={`p-2 rounded text-xs font-mono ${changeMsg.type === 'success' ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'}`}>
                      {changeMsg.text}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors"
                  >
                    حفظ الرمز السري الجديد
                  </button>
                </form>
              )}
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit} className="space-y-4 pt-1">
              
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-slate-300">الرمز السري للمشرف (Master Passkey):</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passkey}
                    onChange={(e) => { setPasskey(e.target.value); setErrorMsg(''); }}
                    placeholder="أدخل رمز مرور الإدارة..."
                    required
                    autoFocus
                    className="w-full bg-black/80 border border-amber-400/40 focus:border-amber-400 rounded-xl pr-4 pl-10 py-3 text-xs text-white placeholder-slate-500 outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {isSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>تم التحقق بنجاح! جاري فتح الصلاحيات...</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl text-xs font-extrabold text-slate-950 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 hover:from-amber-200 transition-all shadow-[0_0_25px_rgba(255,215,0,0.35)] cursor-pointer"
              >
                تأكيد الدخول وفتح صلاحيات الرفع
              </button>

              <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[11px] font-mono text-slate-400 space-y-1 text-right">
                <div className="flex items-center gap-1.5 text-amber-300 font-bold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الرمز السري الافتراضي للمشرف:</span>
                </div>
                <div className="bg-black/60 p-1.5 rounded border border-white/10 select-all text-cyan-300 text-left ltr font-mono text-[11px]">
                  qabas@admin2026
                </div>
                <p className="text-[10px] text-slate-400">
                  (يمكنك تغييره في أي وقت من زر «تغيير الرمز السري» بعد تسجيل الدخول).
                </p>
              </div>

            </form>
          )}

        </div>

      </div>

    </div>
  );
};
