import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  KeyRound, 
  CheckCircle, 
  ArrowLeft, 
  ArrowRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const PasswordRecoveryModal: React.FC = () => {
  const { 
    isPasswordRecoveryOpen, 
    setIsPasswordRecoveryOpen, 
    setIsAuthModalOpen, 
    setAuthModalTab,
    recoverPassword,
    showToast 
  } = useApp();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  if (!isPasswordRecoveryOpen) return null;

  const demoCode = '7429';

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      setError('Введите email или номер телефона');
      return;
    }
    setError('');
    setStep(2);
    showToast(`Код подтверждения отправлен на ${emailOrPhone}`);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (code !== demoCode && code !== '1234') {
      setError(`Неверный код. Для быстрого теста введите ${demoCode}`);
      return;
    }
    setError('');
    setStep(3);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    recoverPassword(emailOrPhone, newPassword);
    setStep(4);
  };

  const handleFinish = () => {
    setIsPasswordRecoveryOpen(false);
    setAuthModalTab('login');
    setIsAuthModalOpen(true);
    setStep(1);
    setEmailOrPhone('');
    setCode('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Восстановление пароля</h3>
              <p className="text-xs text-slate-500">Шаг {step} из 3</p>
            </div>
          </div>
          <button
            onClick={() => setIsPasswordRecoveryOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
              {error}
            </div>
          )}

          {/* Step 1: Input Email or Phone */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Введите адрес электронной почты или номер телефона, привязанный к вашему аккаунту. Мы отправим вам одноразовый проверочный код.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email или телефон</label>
                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500">
                  <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    id="recovery-email-input"
                    type="text"
                    placeholder="alex.smirnov@example.com"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <button
                id="btn-send-recovery-code"
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Получить проверочный код</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Step 2: Input 4-digit code */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Мы отправили 4-значный код на <strong>{emailOrPhone}</strong>.
              </p>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between">
                <span className="text-slate-500">Демо-код подтверждения:</span>
                <button
                  type="button"
                  onClick={() => setCode(demoCode)}
                  className="font-bold text-rose-600 hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Вставить {demoCode}</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Код подтверждения</label>
                <input
                  id="recovery-code-input"
                  type="text"
                  maxLength={6}
                  placeholder="7429"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full text-center tracking-widest text-lg font-mono font-bold bg-slate-50 rounded-xl border border-slate-200 py-2.5 outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="w-1/3 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 cursor-pointer"
                >
                  Назад
                </button>
                <button
                  id="btn-verify-recovery-code"
                  type="submit"
                  className="w-2/3 py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Подтвердить</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Enter new password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-xs text-slate-600 leading-relaxed">
                Придумайте новый надежный пароль для вашей учетной записи.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Новый пароль</label>
                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500">
                  <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    id="new-password-input"
                    type="password"
                    placeholder="Минимум 6 символов"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Повторите новый пароль</label>
                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500">
                  <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    id="confirm-new-password-input"
                    type="password"
                    placeholder="Повторите пароль"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 outline-hidden"
                  />
                </div>
              </div>

              <button
                id="btn-save-new-password"
                type="submit"
                className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Сохранить новый пароль</span>
              </button>
            </form>
          )}

          {/* Step 4: Success confirmation */}
          {step === 4 && (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-base">Пароль успешно обновлен!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  Теперь вы можете войти в систему, используя ваш новый пароль.
                </p>
              </div>
              <button
                id="btn-recovery-done"
                onClick={handleFinish}
                className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md cursor-pointer"
              >
                Войти в систему
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
