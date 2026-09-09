import React, { useState } from 'react';
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
  Sparkles
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
    properties,
    deleteProperty,
    bookings,
    setSelectedProperty,
    setReviewingProperty,
    setIsReviewModalOpen,
    showToast 
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');

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
          <button
            id="btn-close-profile-cabinet"
            onClick={() => setIsProfileOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
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

            </div>
          )}

          {/* TAB 2: My Listings */}
          {profileTab === 'listings' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Ваши опубликованные объекты</h4>
                  <p className="text-xs text-slate-500">Управляйте объявлениями, меняйте цены и проверяйте статус</p>
                </div>
              </div>

              {myListings.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <Building2 className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-700">У вас пока нет опубликованных объявлений</p>
                  <p className="text-[11px] text-slate-500 mt-1">Вы можете сдать квартиру, дом или номер в мини-отеле прямо сейчас</p>
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

        </div>

      </div>
    </div>
  );
};
