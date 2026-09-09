import React from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  CreditCard, 
  Heart,
  Home,
  CheckCircle2,
  Building,
  HelpCircle,
  FileText
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Footer: React.FC = () => {
  const { properties, setIsProfileOpen, setProfileTab, setIsAddListingOpen } = useApp();

  return (
    <footer className="bg-white border-t border-slate-200 text-slate-600 shrink-0 z-20">
      {/* Platform Guarantees Bar */}
      <div className="border-b border-slate-100 bg-slate-50/70 py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-xs">
            
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Безопасная сделка</p>
                <p className="text-[11px] text-slate-500">Защита платежей по эскроу-протоколу</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Точная геолокация</p>
                <p className="text-[11px] text-slate-500">Все объекты проверены на карте</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">Быстрые выплаты СБП</p>
                <p className="text-[11px] text-slate-500">Деньги владельцам в день заселения</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <p className="font-bold text-slate-800">100% реальные фото</p>
                <p className="text-[11px] text-slate-500">Обязательная модерация фотографий</p>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-black text-sm">
                AR
              </div>
              <span className="font-black text-base text-slate-900 tracking-tight">
                Аренда<span className="text-rose-600">Карта</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              Международная экосистема посуточной и долгосрочной аренды квартир, домов, коттеджей и отелей с отображением объектов на интерактивной карте в реальном времени.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 pt-1">
              <Globe className="w-3.5 h-3.5 text-rose-600" />
              <span>10 стран • Более 40 городов</span>
            </div>
          </div>

          {/* Tenants */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Арендаторам</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <button 
                  onClick={() => {
                    setIsProfileOpen(true);
                    setProfileTab('tenant_bookings');
                  }}
                  className="hover:text-rose-600 transition-colors cursor-pointer text-left"
                >
                  Мои поездки и бронирования
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setIsProfileOpen(true);
                    setProfileTab('favorites');
                  }}
                  className="hover:text-rose-600 transition-colors cursor-pointer text-left"
                >
                  Избранные квартиры и дома
                </button>
              </li>
              <li>
                <span className="hover:text-rose-600 transition-colors cursor-pointer">
                  Правила безопасной оплаты
                </span>
              </li>
              <li>
                <span className="hover:text-rose-600 transition-colors cursor-pointer">
                  Бесплатная отмена бронирования
                </span>
              </li>
            </ul>
          </div>

          {/* Hosts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Владельцам жилья</h4>
            <ul className="space-y-2 text-xs text-slate-500">
              <li>
                <button 
                  onClick={() => {
                    setIsProfileOpen(true);
                    setProfileTab('listings');
                  }}
                  className="hover:text-rose-600 transition-colors cursor-pointer text-left"
                >
                  Сдать жилье в аренду (с фото)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setIsProfileOpen(true);
                    setProfileTab('host_bookings');
                  }}
                  className="hover:text-rose-600 transition-colors cursor-pointer text-left"
                >
                  Управление доходами и календарем
                </button>
              </li>
              <li>
                <span className="hover:text-rose-600 transition-colors cursor-pointer">
                  Страхование имущества до 1 000 000 ₽
                </span>
              </li>
              <li>
                <button 
                  onClick={() => {
                    setIsProfileOpen(true);
                    setProfileTab('settings');
                  }}
                  className="hover:text-rose-600 transition-colors cursor-pointer text-left"
                >
                  Реквизиты выплат и СБП
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Поддержка 24/7</h4>
            <div className="space-y-2 text-xs text-slate-500">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>8 (800) 555-35-35 (Бесплатно)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>support@arendamap.com</span>
              </p>
              <p className="pt-1 text-[11px] text-slate-400">
                Круглосуточная служба поддержки гостей и хозяев в онлайн-чате и по телефону.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 mt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <p>© {new Date().getFullYear()} АрендаКарта Inc. Все права защищены.</p>
          <div className="flex flex-wrap items-center gap-4 text-slate-500">
            <span className="hover:underline cursor-pointer">Конфиденциальность</span>
            <span className="hover:underline cursor-pointer">Пользовательское соглашение</span>
            <span className="hover:underline cursor-pointer">Реквизиты сервиса</span>
            <span className="font-semibold text-slate-700">RUB (₽)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
