import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  User, 
  Building2, 
  Calendar, 
  Heart, 
  ShieldCheck, 
  Edit3, 
  Save, 
  Phone, 
  Mail, 
  Trash2, 
  ExternalLink,
  DollarSign,
  Receipt,
  Star,
  Sparkles,
  Settings as SettingsIcon,
  Plus,
  Bell,
  CreditCard,
  Globe,
  Lock,
  Camera,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  CheckCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfileCabinetModal: React.FC = () => {
  const { 
    isProfileOpen, 
    setIsProfileOpen, 
    profileTab, 
    setProfileTab,
    user, 
    updateProfile,
    updateSettings,
    properties,
    deleteProperty,
    bookings,
    setSelectedProperty,
    setIsAddListingOpen,
    setIsPasswordRecoveryOpen,
    showToast,
    setReviewingProperty,
    setIsReviewModalOpen,
    threads,
    messages,
    activeThreadId,
    setActiveThreadId,
    sendMessage,
    language,
    setLanguage,
    t
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

  // Chat in profile state
  const [chatInputText, setChatInputText] = useState('');
  const chatMessagesEndRef = useRef<HTMLDivElement>(null);

  // Local settings state initialized from user settings
  const [emailNotifications, setEmailNotifications] = useState(user?.settings?.emailNotifications ?? true);
  const [pushNotifications, setPushNotifications] = useState(user?.settings?.pushNotifications ?? true);
  const [smsNotifications, setSmsNotifications] = useState(user?.settings?.smsNotifications ?? true);
  const [currency, setCurrency] = useState(user?.settings?.currency ?? 'RUB');
  const [payoutCard, setPayoutCard] = useState(user?.settings?.payoutCard ?? '4276 •••• •••• 8812');
  const [payoutSbpPhone, setPayoutSbpPhone] = useState(user?.settings?.payoutSbpPhone ?? user?.phone ?? '+7 (999) 000-11-22');
  const [twoFactorAuth, setTwoFactorAuth] = useState(user?.settings?.twoFactorAuth ?? false);
  const [hidePhoneUntilBooking, setHidePhoneUntilBooking] = useState(user?.settings?.hidePhoneUntilBooking ?? true);

  if (!isProfileOpen || !user) return null;

  // Filter properties owned by this user (or if none, demo properties)
  const myListings = properties.filter(p => p.host.id === user.id || p.host.name === user.name);
  const myBookings = bookings.filter(b => b.tenantId === user.id);
  const hostBookings = bookings.filter(b => b.landlordId === user.id || myListings.some(l => l.id === b.propertyId));
  const favoriteProperties = properties.filter(p => user.favorites?.includes(p.id));

  const totalHostEarnings = hostBookings.reduce((sum, b) => sum + b.totalPrice, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      phone,
      bio,
      avatar: avatar || user.avatar
    });
    setIsEditing(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      emailNotifications,
      pushNotifications,
      smsNotifications,
      currency,
      language,
      payoutCard,
      payoutSbpPhone,
      twoFactorAuth,
      hidePhoneUntilBooking
    });
    showToast('Настройки профиля успешно сохранены!');
  };

  const handleOpenAddListing = () => {
    setIsProfileOpen(false);
    setIsAddListingOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Личный кабинет</h3>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              id="btn-profile-add-listing-header"
              onClick={handleOpenAddListing}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-rose-600/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Сдать жилье</span>
            </button>
            <button
              id="btn-close-profile-cabinet"
              onClick={() => setIsProfileOpen(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-2 border-b border-slate-100 overflow-x-auto bg-slate-50/50">
          <button
            id="tab-profile-info"
            onClick={() => setProfileTab('profile')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              profileTab === 'profile' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <User className="w-4 h-4 text-rose-600" />
            <span>Мой профиль</span>
          </button>

          <button
            id="tab-profile-listings"
            onClick={() => setProfileTab('listings')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              profileTab === 'listings' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-4 h-4 text-blue-600" />
            <span>Мои объявления ({myListings.length})</span>
          </button>

          <button
            id="tab-profile-tenant-bookings"
            onClick={() => setProfileTab('tenant_bookings')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              profileTab === 'tenant_bookings' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4 text-emerald-600" />
            <span>Мои поездки ({myBookings.length})</span>
          </button>

          <button
            id="tab-profile-host-bookings"
            onClick={() => setProfileTab('host_bookings')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              profileTab === 'host_bookings' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <DollarSign className="w-4 h-4 text-amber-600" />
            <span>Доходы и брони ({hostBookings.length})</span>
          </button>

          <button
            id="tab-profile-favorites"
            onClick={() => setProfileTab('favorites')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              profileTab === 'favorites' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Heart className="w-4 h-4 text-rose-600" />
            <span>Избранное ({favoriteProperties.length})</span>
          </button>

          <button
            id="tab-profile-chat"
            onClick={() => setProfileTab('chat')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              profileTab === 'chat' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            <span>Чат и сообщения {threads.length > 0 && `(${threads.length})`}</span>
          </button>

          <button
            id="tab-profile-settings"
            onClick={() => setProfileTab('settings')}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-2 cursor-pointer ${
              profileTab === 'settings' ? 'bg-white text-slate-900 shadow-xs border border-slate-200' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <SettingsIcon className="w-4 h-4 text-slate-700" />
            <span>Настройки</span>
          </button>
        </div>

        {/* Tab Contents */}
        <div className="overflow-y-auto p-6 flex-1">
          
          {/* TAB 1: Profile Details & Edit */}
          {profileTab === 'profile' && (
            <div className="max-w-2xl space-y-6">
              
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 p-6 rounded-3xl bg-slate-50 border border-slate-200">
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-3xl object-cover ring-4 ring-white shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-emerald-600 text-white p-1 rounded-full ring-2 ring-white">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                </div>

                <div className="flex-1 text-center sm:text-left space-y-2">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h4 className="text-lg font-bold text-slate-900">{user.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Личность подтверждена
                    </span>
                  </div>

                  <p className="text-xs text-slate-500">{user.bio || 'Пользователь платформы аренды'}</p>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-600 pt-1">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {user.email}
                    </span>
                    <span className="flex items-center gap-1">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {user.phone || 'Телефон не указан'}
                    </span>
                  </div>

                  {/* Auth Provider Badge */}
                  <div className="pt-2 flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-[11px] text-slate-400">Способ входа:</span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 uppercase">
                      {user.provider}
                    </span>
                  </div>
                </div>

                <button
                  id="btn-edit-profile-toggle"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-3.5 py-2 rounded-xl border border-slate-300 hover:bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{isEditing ? 'Закрыть' : 'Редактировать'}</span>
                </button>
              </div>

              {/* Edit form */}
              {isEditing && (
                <form onSubmit={handleSaveProfile} className="p-6 rounded-3xl border border-slate-200 bg-white space-y-4 animate-in fade-in duration-150">
                  <h5 className="text-sm font-bold text-slate-900">Редактирование профиля</h5>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Имя и фамилия</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Номер телефона</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+7 (999) 000-00-00"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">О себе</label>
                    <textarea
                      rows={2}
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    ></textarea>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Ссылка на фото аватарки</label>
                    <input
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-600/20"
                  >
                    <Save className="w-3.5 h-3.5" />
                    <span>Сохранить изменения</span>
                  </button>
                </form>
              )}

              {/* Safety & Escrow Platform Guarantee */}
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start gap-3 text-xs text-emerald-800">
                <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-emerald-950">Защита профиля и сделок</h5>
                  <p className="mt-0.5 text-emerald-800 leading-relaxed">
                    Все ваши контактные данные зашифрованы по стандарту PCI DSS. Номера телефонов передаются арендодателям только после официального подтверждения бронирования.
                  </p>
                </div>
              </div>

              {/* Host CTA card */}
              <div className="p-5 rounded-3xl bg-linear-to-r from-rose-50 to-amber-50 border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-extrabold text-slate-900">Хотите сдать жилье?</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      * Фото обязательны
                    </span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Разместите квартиру, дом или мини-гостиницу на интерактивной карте за 2 минуты.
                  </p>
                </div>
                <button
                  onClick={handleOpenAddListing}
                  className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-600/20 shrink-0 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Сдать жилье в аренду</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 2: My Listings */}
          {profileTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Ваши объекты на карте</h4>
                  <p className="text-xs text-slate-500">Управляйте объявлениями, редактируйте цены или добавьте новое жилье</p>
                </div>
                <button
                  id="btn-profile-add-new-listing"
                  onClick={handleOpenAddListing}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm shadow-rose-600/20 shrink-0 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Добавить новое жилье</span>
                </button>
              </div>

              {myListings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-300 space-y-3">
                  <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
                  <div>
                    <p className="text-xs font-bold text-slate-800">У вас пока нет опубликованных объектов</p>
                    <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                      Вы можете сдать квартиру, дом или номер в мини-отеле прямо сейчас. Обязательно загрузите реальные фотографии жилья.
                    </p>
                  </div>
                  <button
                    onClick={handleOpenAddListing}
                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Сдать жилье в аренду (с фото)</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {myListings.map(prop => (
                    <div key={prop.id} className="p-3 rounded-2xl border border-slate-200 bg-white flex gap-3">
                      <img src={prop.images[0]} alt="" className="w-24 h-24 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Активно на карте
                            </span>
                            <button
                              onClick={() => deleteProperty(prop.id)}
                              className="text-slate-400 hover:text-rose-600 p-1"
                              title="Удалить"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 line-clamp-1 mt-1">{prop.title}</h5>
                          <p className="text-[11px] text-slate-500">{prop.city}, {prop.district}</p>
                        </div>

                        <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                          <span className="font-extrabold text-slate-900">
                            {prop.rentMode === 'monthly' ? `${prop.priceMonthly.toLocaleString()} ₽/мес` : `${prop.priceDaily.toLocaleString()} ₽/сут`}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedProperty(prop);
                              setIsProfileOpen(false);
                            }}
                            className="text-rose-600 font-bold hover:underline flex items-center gap-1"
                          >
                            <span>Открыть</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: My Bookings (Tenant View) */}
          {profileTab === 'tenant_bookings' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Ваши поездки и бронирования</h4>
                <p className="text-xs text-slate-500">История безопасных оплат и бронирований</p>
              </div>

              {myBookings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">У вас пока нет активных бронирований</p>
                  <p className="text-[11px] text-slate-500 mt-1">Выберите понравившееся жилье на карте и забронируйте безопасно</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {myBookings.map(book => (
                    <div key={book.id} className="p-4 rounded-2xl border border-slate-200 bg-white flex flex-col sm:flex-row gap-4 justify-between">
                      <div className="flex gap-3.5">
                        <img src={book.propertyImage} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Оплата в эскроу (защищено)
                            </span>
                            <span className="text-[10px] text-slate-400">№ {book.id}</span>
                          </div>
                          <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{book.propertyTitle}</h5>
                          <p className="text-[11px] text-slate-500">{book.propertyCity}, {book.propertyAddress}</p>
                          <p className="text-xs font-medium text-slate-700">
                            Даты: <strong>{book.checkIn}</strong> — <strong>{book.checkOut}</strong> ({book.durationCount} {book.rentMode === 'daily' ? 'сут.' : 'мес.'})
                          </p>
                        </div>
                      </div>

                      <div className="flex sm:flex-col justify-between items-end shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block">Оплачено онлайн</span>
                          <span className="text-sm font-extrabold text-slate-900">{book.totalPrice.toLocaleString()} ₽</span>
                          <span className="text-[10px] text-slate-500 block">Карта *{book.last4}</span>
                        </div>

                        {!book.reviewed && (
                          <button
                            onClick={() => {
                              const prop = properties.find(p => p.id === book.propertyId);
                              if (prop) {
                                setReviewingProperty(prop);
                                setIsReviewModalOpen(true);
                              }
                            }}
                            className="mt-2 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold flex items-center gap-1 cursor-pointer"
                          >
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>Оставить отзыв</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: Host Incoming Bookings & Earnings */}
          {profileTab === 'host_bookings' && (
            <div className="space-y-6">
              
              {/* Earnings summary card */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-900 text-white">
                  <span className="text-xs text-slate-400">Общий заработок</span>
                  <p className="text-2xl font-black mt-1">{totalHostEarnings.toLocaleString()} ₽</p>
                  <span className="text-[10px] text-emerald-400 mt-1 block">Выплаты защищены сервисом</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500">Бронирований всего</span>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{hostBookings.length}</p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Подтверждено</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <span className="text-xs text-slate-500">Рейтинг хозяина</span>
                  <p className="text-2xl font-bold text-amber-600 mt-1 flex items-center gap-1">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                    4.98
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">Суперхозяин</span>
                </div>
              </div>

              {/* Reservations list */}
              <div>
                <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Запросы и гости</h5>
                {hostBookings.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4">Бронирований пока нет.</p>
                ) : (
                  <div className="space-y-2">
                    {hostBookings.map(b => (
                      <div key={b.id} className="p-3 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-slate-900">Гость: {b.tenantName}</p>
                          <p className="text-slate-500">{b.propertyTitle} • {b.checkIn} — {b.checkOut}</p>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-slate-900">{b.totalPrice.toLocaleString()} ₽</span>
                          <span className="block text-[10px] text-emerald-600 font-semibold">В эскроу</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* TAB 5: Favorites */}
          {profileTab === 'favorites' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Сохраненные объекты</h4>
                <p className="text-xs text-slate-500">Жилье, которое вы отметили сердечком</p>
              </div>

              {favoriteProperties.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <Heart className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">В избранном пока пусто</p>
                  <p className="text-[11px] text-slate-500 mt-1">Нажимайте на сердечко на карточке любого жилья, чтобы сохранить его сюда</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {favoriteProperties.map(prop => (
                    <div key={prop.id} className="p-3 rounded-2xl border border-slate-200 bg-white flex gap-3">
                      <img src={prop.images[0]} alt="" className="w-20 h-20 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 line-clamp-1">{prop.title}</h5>
                          <p className="text-[11px] text-slate-500">{prop.city}</p>
                        </div>
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-extrabold text-slate-900">
                            {prop.rentMode === 'monthly' ? `${prop.priceMonthly.toLocaleString()} ₽/мес` : `${prop.priceDaily.toLocaleString()} ₽`}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedProperty(prop);
                              setIsProfileOpen(false);
                            }}
                            className="text-xs text-rose-600 font-bold hover:underline"
                          >
                            Смотреть
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: Chat inside Profile */}
          {profileTab === 'chat' && (
            <div className="h-[540px] flex flex-col md:flex-row rounded-3xl border border-slate-200 overflow-hidden bg-white shadow-xs">
              {/* Left sidebar: threads list */}
              <div className="w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50/50 shrink-0">
                <div className="p-3.5 border-b border-slate-200 flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Диалоги ({threads.length})</h4>
                  <span className="text-[11px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">
                    Онлайн
                  </span>
                </div>

                <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                  {threads.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs">
                      Нет активных переписок. Выберите объект и напишите хозяину!
                    </div>
                  ) : (
                    threads.map((thread) => {
                      const isSelected = thread.id === activeThreadId;
                      const otherParticipant = thread.tenantId === user.id ? thread.landlordName : thread.tenantName;
                      const otherAvatar = thread.tenantId === user.id ? thread.landlordAvatar : thread.tenantAvatar;

                      return (
                        <div
                          key={thread.id}
                          onClick={() => setActiveThreadId(thread.id)}
                          className={`p-3 flex items-start gap-3 cursor-pointer transition-colors ${
                            isSelected ? 'bg-white shadow-xs border-l-4 border-rose-600' : 'hover:bg-slate-100/70'
                          }`}
                        >
                          <img
                            src={otherAvatar}
                            alt={otherParticipant}
                            className="w-10 h-10 rounded-2xl object-cover shrink-0 border border-slate-200"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className="text-xs font-bold text-slate-900 truncate">{otherParticipant}</h5>
                              <span className="text-[10px] text-slate-400">{thread.lastMessageTime}</span>
                            </div>
                            <p className="text-[11px] font-semibold text-rose-600 truncate mt-0.5">{thread.propertyTitle}</p>
                            <p className="text-[11px] text-slate-500 truncate mt-0.5">{thread.lastMessage}</p>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Right area: Active conversation messages */}
              <div className="flex-1 flex flex-col bg-white">
                {(() => {
                  const currentThread = threads.find((t) => t.id === activeThreadId) || threads[0];

                  if (!currentThread) {
                    return (
                      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                        <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
                        <p className="text-sm font-bold text-slate-600">Выберите диалог</p>
                        <p className="text-xs text-slate-400 mt-1">Здесь вы можете общаться с владельцами жилья в реальном времени</p>
                      </div>
                    );
                  }

                  const otherName = currentThread.tenantId === user.id ? currentThread.landlordName : currentThread.tenantName;
                  const otherAvatar = currentThread.tenantId === user.id ? currentThread.landlordAvatar : currentThread.tenantAvatar;
                  const currentMessages = messages[currentThread.id] || [];

                  const handleSend = (e: React.FormEvent) => {
                    e.preventDefault();
                    if (!chatInputText.trim()) return;
                    sendMessage(currentThread.id, chatInputText.trim());
                    setChatInputText('');
                  };

                  return (
                    <>
                      {/* Chat Header */}
                      <div className="p-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/40">
                        <div className="flex items-center gap-3">
                          <img
                            src={otherAvatar}
                            alt={otherName}
                            className="w-9 h-9 rounded-2xl object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-xs font-bold text-slate-900">{otherName}</h4>
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            </div>
                            <p className="text-[11px] text-slate-500 truncate max-w-xs">{currentThread.propertyTitle}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const prop = properties.find((p) => p.id === currentThread.propertyId);
                            if (prop) {
                              setIsProfileOpen(false);
                              setSelectedProperty(prop);
                            }
                          }}
                          className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>Объект</span>
                        </button>
                      </div>

                      {/* Messages Stream */}
                      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/30">
                        <div className="text-center my-1">
                          <span className="text-[10px] font-semibold text-slate-500 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
                            Безопасный чат: телефон передается только после бронирования
                          </span>
                        </div>

                        {currentMessages.map((msg) => {
                          const isMe = msg.senderId === user.id;

                          return (
                            <div
                              key={msg.id}
                              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs ${
                                  isMe
                                    ? 'bg-rose-600 text-white rounded-br-none'
                                    : 'bg-white text-slate-900 border border-slate-200 rounded-bl-none'
                                }`}
                              >
                                <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                                <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${isMe ? 'text-rose-100' : 'text-slate-400'}`}>
                                  <span>{msg.timestamp}</span>
                                  {isMe && <CheckCheck className="w-3.5 h-3.5" />}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={chatMessagesEndRef} />
                      </div>

                      {/* Quick reply suggestions */}
                      <div className="px-4 py-1.5 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto scrollbar-none">
                        {[
                          'Здравствуйте! Жилье свободно на эти даты?',
                          'Возможен ли поздний заезд?',
                          'Какая скидка при аренде на месяц?',
                          'Предоставляете ли отчетные документы?'
                        ].map((suggestion, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              sendMessage(currentThread.id, suggestion);
                            }}
                            className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-full whitespace-nowrap cursor-pointer transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>

                      {/* Chat Input Bar */}
                      <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                        <input
                          type="text"
                          value={chatInputText}
                          onChange={(e) => setChatInputText(e.target.value)}
                          placeholder="Напишите сообщение хозяину..."
                          className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:outline-hidden focus:border-rose-500 bg-slate-50 focus:bg-white"
                        />
                        <button
                          type="submit"
                          disabled={!chatInputText.trim()}
                          className="p-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl transition-colors cursor-pointer shadow-md shadow-rose-600/20"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </form>
                    </>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 6: Settings - Vertical List from Top to Bottom */}
          {profileTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="max-w-2xl mx-auto space-y-6">
              <div>
                <h4 className="text-base font-bold text-slate-900">Настройки аккаунта</h4>
                <p className="text-xs text-slate-500">Управляйте языком, личными данными, уведомлениями и безопасностью</p>
              </div>

              {/* VERTICAL LIST ITEM 1: Language Switcher (Armenian, Georgian, English, Russian) */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
                <div className="p-4 bg-slate-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <Globe className="w-4 h-4 text-rose-600" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Язык интерфейса</h5>
                      <p className="text-[11px] text-slate-500">Выберите язык сайта для мгновенного перевода</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                    {language === 'ru' ? '🇷🇺 Русский' : language === 'en' ? '🇬🇧 English' : language === 'hy' ? '🇦🇲 Հայերեն' : '🇬🇪 ქართული'}
                  </span>
                </div>

                <div className="p-2 space-y-1">
                  {[
                    { code: 'ru', label: 'Русский', native: 'Русский язык', flag: '🇷🇺', sub: 'Полный интерфейс платформы на русском' },
                    { code: 'en', label: 'English', native: 'English language', flag: '🇬🇧', sub: 'Entire interface translated into English' },
                    { code: 'hy', label: 'Հայերեն (Armenian)', native: 'Հայերեն լեզու', flag: '🇦🇲', sub: 'Ամբողջ կայքի ինտերֆեյսը հայերեն լեզվով' },
                    { code: 'ka', label: 'ქართული (Georgian)', native: 'ქართული ენა', flag: '🇬🇪', sub: 'პლატფორმის სრული ინტერფეისი ქართულ ენაზე' },
                  ].map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => {
                        setLanguage(item.code as any);
                        showToast(`Язык переключен: ${item.label}`);
                      }}
                      className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left cursor-pointer ${
                        language === item.code 
                          ? 'bg-rose-50 border border-rose-200 text-rose-950 shadow-xs' 
                          : 'hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{item.flag}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold">{item.label}</span>
                            <span className="text-[10px] text-slate-400">({item.native})</span>
                          </div>
                          <p className="text-[11px] text-slate-500">{item.sub}</p>
                        </div>
                      </div>
                      {language === item.code ? (
                        <CheckCircle2 className="w-5 h-5 text-rose-600 shrink-0" />
                      ) : (
                        <span className="text-xs text-slate-400">Выбрать</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* VERTICAL LIST ITEM 2: Currency */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
                <div className="p-4 bg-slate-50/70 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Основная валюта цен</h5>
                      <p className="text-[11px] text-slate-500">Цены за сутки и за месяц будут пересчитаны в этой валюте</p>
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold bg-white text-slate-800 outline-hidden cursor-pointer"
                  >
                    <option value="RUB">RUB (₽) — Российский рубль</option>
                    <option value="USD">USD ($) — Доллар США</option>
                    <option value="EUR">EUR (€) — Евро</option>
                    <option value="AMD">AMD (֏) — Армянский драм</option>
                    <option value="GEL">GEL (₾) — Грузинский лари</option>
                    <option value="KZT">KZT (₸) — Казахстанский тенге</option>
                    <option value="AED">AED (د.إ) — Дирхам ОАЭ</option>
                  </select>
                </div>
              </div>

              {/* VERTICAL LIST ITEM 3: Personal Data */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
                <div className="p-4 bg-slate-50/70 flex items-center gap-2.5">
                  <User className="w-4 h-4 text-blue-600" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Личные данные</h5>
                    <p className="text-[11px] text-slate-500">Информация отображается в профиле и при заселении</p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Имя и Фамилия</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-hidden"
                      placeholder="Иван Иванов"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Номер телефона</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-hidden"
                      placeholder="+7 (999) 000-00-00"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">О себе</label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-white outline-hidden resize-none"
                      placeholder="Расскажите немного о себе гостям или хозяевам..."
                    />
                  </div>
                </div>
              </div>

              {/* VERTICAL LIST ITEM 4: Notifications */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
                <div className="p-4 bg-slate-50/70 flex items-center gap-2.5">
                  <Bell className="w-4 h-4 text-amber-600" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Уведомления и оповещения</h5>
                    <p className="text-[11px] text-slate-500">Каналы получения сообщений и статусов брони</p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Email-уведомления</p>
                      <p className="text-[11px] text-slate-500">О новых бронированиях и ответах хозяев</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={emailNotifications}
                      onChange={(e) => setEmailNotifications(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Push-уведомления в браузере</p>
                      <p className="text-[11px] text-slate-500">Всплывающие звонки и сообщения в реальном времени</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={pushNotifications}
                      onChange={(e) => setPushNotifications(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-800">SMS-оповещения</p>
                      <p className="text-[11px] text-slate-500">Коды заселения и экстренная связь</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsNotifications}
                      onChange={(e) => setSmsNotifications(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* VERTICAL LIST ITEM 5: Payouts for Host */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
                <div className="p-4 bg-slate-50/70 flex items-center gap-2.5">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Реквизиты выплат арендодателю</h5>
                    <p className="text-[11px] text-slate-500">Безопасная сделка: средства переводятся в день заселения гостя</p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Банковская карта для выплат</label>
                    <input
                      type="text"
                      value={payoutCard}
                      onChange={(e) => setPayoutCard(e.target.value)}
                      placeholder="4276 •••• •••• ••••"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Номер телефона для выплат по СБП</label>
                    <input
                      type="text"
                      value={payoutSbpPhone}
                      onChange={(e) => setPayoutSbpPhone(e.target.value)}
                      placeholder="+7 (999) 000-00-00"
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* VERTICAL LIST ITEM 6: Security & Password */}
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100 shadow-xs">
                <div className="p-4 bg-slate-50/70 flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-slate-800" />
                  <div>
                    <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Безопасность</h5>
                    <p className="text-[11px] text-slate-500">Защита профиля, двухфакторная авторизация и пароль</p>
                  </div>
                </div>

                <div className="p-4 space-y-3">
                  <label className="flex items-center justify-between cursor-pointer">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Двухфакторная защита (2FA)</p>
                      <p className="text-[11px] text-slate-500">Подтверждать вход через SMS или приложение</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={twoFactorAuth}
                      onChange={(e) => setTwoFactorAuth(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between cursor-pointer pt-2 border-t border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Скрывать номер телефона до бронирования</p>
                      <p className="text-[11px] text-slate-500">Номер видят только подтвержденные гости</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={hidePhoneUntilBooking}
                      onChange={(e) => setHidePhoneUntilBooking(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded border-slate-300 focus:ring-rose-500 cursor-pointer"
                    />
                  </label>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-slate-800">Пароль учетной записи</p>
                      <p className="text-[11px] text-slate-500">Надежный пароль для входа</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsProfileOpen(false);
                        setIsPasswordRecoveryOpen(true);
                      }}
                      className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer"
                    >
                      Сменить пароль
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex justify-end">
                <button
                  id="btn-save-profile-settings"
                  type="submit"
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-2xl flex items-center gap-2 shadow-md shadow-slate-900/20 cursor-pointer transition-all active:scale-95"
                >
                  <Save className="w-4 h-4" />
                  <span>Сохранить настройки</span>
                </button>
              </div>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
