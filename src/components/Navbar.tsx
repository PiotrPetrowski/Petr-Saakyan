import React from 'react';
import { 
  Building2, 
  Heart, 
  MessageSquare, 
  User, 
  PlusCircle, 
  Search, 
  ShieldCheck, 
  Menu, 
  X,
  LogOut,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar: React.FC = () => {
  const { 
    user, 
    setIsAuthModalOpen, 
    setAuthModalTab, 
    setIsProfileOpen, 
    setProfileTab,
    setIsAddListingOpen, 
    setIsChatOpen,
    threads,
    logout
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = React.useState(false);

  const totalUnread = threads.reduce((acc, t) => acc + (t.unreadCountTenant || 0), 0);
  const favoritesCount = user?.favorites?.length || 0;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div 
            id="app-logo"
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Аренда<span className="text-rose-600">Жилья</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200">
                  24/7
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Посуточная и помесячная аренда</p>
            </div>
          </div>

          {/* Quick trust badge / middle feature */}
          <div className="hidden lg:flex items-center gap-2 text-xs text-slate-600 bg-slate-100/80 px-3 py-1.5 rounded-full border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Безопасная сделка: 100% защита платежей до заселения</span>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Post listing button */}
            <button
              id="btn-add-listing-nav"
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                } else {
                  setIsAddListingOpen(true);
                }
              }}
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-rose-600" />
              <span>Сдать жилье</span>
            </button>

            {/* Favorites */}
            <button
              id="btn-favorites-nav"
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                } else {
                  setProfileTab('favorites');
                  setIsProfileOpen(true);
                }
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Избранное"
            >
              <Heart className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Chat button */}
            <button
              id="btn-chat-nav"
              onClick={() => {
                if (!user) {
                  setIsAuthModalOpen(true);
                } else {
                  setIsChatOpen(true);
                }
              }}
              className="relative p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Сообщения"
            >
              <MessageSquare className="w-5 h-5" />
              {totalUnread > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-pulse">
                  {totalUnread}
                </span>
              )}
            </button>

            {/* Profile / Auth */}
            {user ? (
              <div className="relative">
                <button
                  id="btn-user-menu"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pl-2 pr-3 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200"
                  />
                  <div className="text-left hidden sm:block">
                    <p className="text-xs font-semibold text-slate-800 line-clamp-1 max-w-[120px]">{user.name}</p>
                    <p className="text-[10px] text-emerald-600 font-medium">Верифицирован</p>
                  </div>
                </button>

                {/* Dropdown */}
                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    <button
                      id="menu-item-profile"
                      onClick={() => {
                        setProfileTab('profile');
                        setIsProfileOpen(true);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-rose-600 flex items-center gap-2"
                    >
                      <User className="w-4 h-4" />
                      Личный кабинет
                    </button>

                    <button
                      id="menu-item-my-listings"
                      onClick={() => {
                        setProfileTab('listings');
                        setIsProfileOpen(true);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-rose-600 flex items-center gap-2"
                    >
                      <Building2 className="w-4 h-4" />
                      Мои объявления
                    </button>

                    <button
                      id="menu-item-my-bookings"
                      onClick={() => {
                        setProfileTab('tenant_bookings');
                        setIsProfileOpen(true);
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-rose-600 flex items-center gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Мои бронирования
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    <button
                      id="menu-item-logout"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Выйти из аккаунта
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="btn-login-nav"
                  onClick={() => {
                    setAuthModalTab('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Войти
                </button>
                <button
                  id="btn-register-nav"
                  onClick={() => {
                    setAuthModalTab('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 shadow-md shadow-rose-600/25 transition-all cursor-pointer"
                >
                  Регистрация
                </button>
              </div>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-slate-600 hover:bg-slate-100 rounded-xl"
              aria-label="Меню"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>
        </div>

        {/* Mobile menu collapsible */}
        {mobileMenuOpen && (
          <div className="md:hidden py-3 border-t border-slate-100 space-y-2">
            <button
              onClick={() => {
                if (!user) setIsAuthModalOpen(true);
                else setIsAddListingOpen(true);
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4 text-rose-600" />
              Сдать квартиру, дом или мини-отель
            </button>
            <button
              onClick={() => {
                if (!user) setIsAuthModalOpen(true);
                else {
                  setProfileTab('tenant_bookings');
                  setIsProfileOpen(true);
                }
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 px-4 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-lg flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Мои поездки и безопасные бронирования
            </button>
          </div>
        )}

      </div>
    </header>
  );
};
