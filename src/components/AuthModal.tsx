import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Send, 
  Github, 
  Sparkles,
  KeyRound
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalTab, 
    setAuthModalTab, 
    setIsPasswordRecoveryOpen,
    login 
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Пожалуйста, заполните все обязательные поля');
      return;
    }
    if (authModalTab === 'register' && !name) {
      setError('Пожалуйста, введите ваше имя');
      return;
    }

    login('email', email, name || email.split('@')[0]);
    setEmail('');
    setPassword('');
    setName('');
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {authModalTab === 'login' ? 'Вход в аккаунт' : 'Регистрация на сервисе'}
            </h3>
            <p className="text-xs text-slate-500">
              {authModalTab === 'login' ? 'Добро пожаловать в АрендаЖилья' : 'Создайте аккаунт для бронирования и сдачи жилья'}
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="grid grid-cols-2 p-1.5 mx-6 mt-4 bg-slate-100 rounded-2xl">
          <button
            id="tab-login-btn"
            onClick={() => {
              setAuthModalTab('login');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              authModalTab === 'login' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Вход
          </button>
          <button
            id="tab-register-btn"
            onClick={() => {
              setAuthModalTab('register');
              setError('');
            }}
            className={`py-2 text-xs font-bold rounded-xl transition-all ${
              authModalTab === 'register' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Регистрация
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Social Network Login Buttons */}
          <div className="space-y-2">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">
              Быстрый вход через соцсети
            </p>

            <div className="grid grid-cols-2 gap-2">
              
              {/* Google */}
              <button
                id="social-login-google"
                type="button"
                onClick={() => login('google')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                </svg>
                <span>Google</span>
              </button>

              {/* Telegram */}
              <button
                id="social-login-telegram"
                type="button"
                onClick={() => login('telegram')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <div className="w-4 h-4 rounded-full bg-[#2AABEE] flex items-center justify-center text-white">
                  <Send className="w-2.5 h-2.5" />
                </div>
                <span>Telegram</span>
              </button>

              {/* VK */}
              <button
                id="social-login-vk"
                type="button"
                onClick={() => login('vk')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <span className="w-4 h-4 rounded-full bg-[#0077FF] text-white flex items-center justify-center text-[9px] font-black">
                  VK
                </span>
                <span>ВКонтакте</span>
              </button>

              {/* GitHub */}
              <button
                id="social-login-github"
                type="button"
                onClick={() => login('github')}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-xs font-semibold text-slate-700 transition-all cursor-pointer"
              >
                <Github className="w-4 h-4 text-slate-900" />
                <span>GitHub</span>
              </button>

            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[11px] text-slate-400 uppercase font-bold absolute">
              или через Email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs">
                {error}
              </div>
            )}

            {authModalTab === 'register' && (
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Имя и фамилия</label>
                <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500">
                  <User className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                  <input
                    id="register-name-input"
                    type="text"
                    placeholder="Например: Иван Иванов"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-transparent text-xs text-slate-900 outline-hidden"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Электронная почта</label>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500">
                <Mail className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  id="auth-email-input"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-900 outline-hidden"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Пароль</label>
                {authModalTab === 'login' && (
                  <button
                    id="btn-forgot-password-trigger"
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      setIsPasswordRecoveryOpen(true);
                    }}
                    className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                  >
                    Забыли пароль?
                  </button>
                )}
              </div>
              <div className="flex items-center bg-slate-50 rounded-xl border border-slate-200 px-3 py-2.5 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500">
                <Lock className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <input
                  id="auth-password-input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-transparent text-xs text-slate-900 outline-hidden"
                />
              </div>
            </div>

            <button
              id="btn-auth-submit"
              type="submit"
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md shadow-rose-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
            >
              <span>{authModalTab === 'login' ? 'Войти в профиль' : 'Создать аккаунт'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
};
