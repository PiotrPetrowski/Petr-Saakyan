import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  ShieldCheck, 
  Heart, 
  Share2, 
  Check, 
  Users, 
  Bed, 
  Maximize2, 
  Bath, 
  MessageSquare, 
  Sparkles, 
  Calendar, 
  ChevronRight,
  Lock
} from 'lucide-react';
import { Property, ReviewItem } from '../types';
import { useApp } from '../context/AppContext';

export const PropertyDetailModal: React.FC = () => {
  const { 
    selectedProperty, 
    setSelectedProperty, 
    reviews, 
    user, 
    toggleFavorite, 
    openChatWithHost,
    setBookingProperty,
    setBookingDraft,
    setIsPaymentModalOpen,
    setIsReviewModalOpen,
    setReviewingProperty,
    showToast
  } = useApp();

  if (!selectedProperty) return null;

  const propReviews = reviews.filter(r => r.propertyId === selectedProperty.id);
  const isFavorite = user?.favorites?.includes(selectedProperty.id) || false;

  // Booking calculator state
  const [selectedRentMode, setSelectedRentMode] = useState<'daily' | 'monthly'>(
    selectedProperty.rentMode === 'monthly' ? 'monthly' : 'daily'
  );

  const todayStr = new Date().toISOString().split('T')[0];
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 3);
  const nextWeekStr = nextWeek.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState<string>(todayStr);
  const [checkOut, setCheckOut] = useState<string>(nextWeekStr);
  const [guestCount, setGuestCount] = useState<number>(Math.min(2, selectedProperty.maxGuests));
  const [activeImageIndex, setActiveImageIndex] = useState<number>(0);

  // Calculate days
  const date1 = new Date(checkIn);
  const date2 = new Date(checkOut);
  const diffTime = Math.abs(date2.getTime() - date1.getTime());
  const diffDays = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const diffMonths = Math.max(1, Math.round(diffDays / 30));

  const durationCount = selectedRentMode === 'daily' ? diffDays : diffMonths;
  const unitPrice = selectedRentMode === 'daily' ? selectedProperty.priceDaily : selectedProperty.priceMonthly;
  const rentTotal = durationCount * unitPrice;
  const deposit = selectedRentMode === 'daily' ? 3000 : 25000;
  const serviceFee = 0; // Free for tenant!
  const grandTotal = rentTotal + deposit + serviceFee;

  const handleStartBooking = () => {
    setBookingProperty(selectedProperty);
    setBookingDraft({
      checkIn,
      checkOut,
      rentMode: selectedRentMode,
      durationCount,
      guestsCount: guestCount,
      pricePerUnit: unitPrice,
      rentTotal,
      deposit,
      serviceFee,
      grandTotal
    });
    setIsPaymentModalOpen(true);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    showToast('Ссылка на объект скопирована в буфер обмена!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Top Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              {selectedProperty.type === 'apartment' ? 'Квартира' : selectedProperty.type === 'house' ? 'Дом' : 'Мини-гостиница'}
            </span>
            <span>•</span>
            <span className="text-xs text-slate-500 font-medium">{selectedProperty.city}, {selectedProperty.district}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="Поделиться"
            >
              <Share2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleFavorite(selectedProperty.id)}
              className="p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
              title="В избранное"
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
            </button>
            <button
              id="btn-close-property-detail"
              onClick={() => setSelectedProperty(null)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8">
          
          {/* Title and Rating headline */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {selectedProperty.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-600">
              <div className="flex items-center gap-1 font-bold text-slate-900">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{selectedProperty.rating}</span>
                <span className="text-slate-400 font-normal">({selectedProperty.reviewsCount} отзывов)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-500" />
                <span>{selectedProperty.address}</span>
              </div>
              <span>•</span>
              <div className="text-emerald-700 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Проверенное жилье</span>
              </div>
            </div>
          </div>

          {/* Photo Gallery with Big Image and Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-16/9 sm:aspect-21/9 rounded-2xl overflow-hidden bg-slate-900">
              <img
                src={selectedProperty.images[activeImageIndex]}
                alt={selectedProperty.title}
                className="w-full h-full object-cover transition-all duration-300"
              />
              <div className="absolute bottom-3 right-3 text-xs font-semibold text-white bg-black/60 backdrop-blur-md px-3 py-1 rounded-full">
                Фото {activeImageIndex + 1} из {selectedProperty.images.length}
              </div>
            </div>
            
            {/* Thumbnails */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {selectedProperty.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx ? 'border-rose-600 scale-105 shadow-md' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Main Grid: Left Details & Right Booking Box */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Col: Specs, Description, Amenities, Host, Map */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Specs badges */}
              <div className="flex flex-wrap items-center gap-4 py-3 border-y border-slate-100 text-slate-700 text-xs font-medium">
                <div className="flex items-center gap-2">
                  <Bed className="w-4 h-4 text-rose-600" />
                  <span>{selectedProperty.bedrooms} спальн{selectedProperty.bedrooms > 1 ? 'и' : 'я'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Bath className="w-4 h-4 text-rose-600" />
                  <span>{selectedProperty.bathrooms} ванная комната</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-rose-600" />
                  <span>до {selectedProperty.maxGuests} гостей</span>
                </div>
                <div className="flex items-center gap-2">
                  <Maximize2 className="w-4 h-4 text-rose-600" />
                  <span>{selectedProperty.area} м² общая площадь</span>
                </div>
              </div>

              {/* Host Profile Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedProperty.host.avatar}
                    alt={selectedProperty.host.name}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 text-sm">{selectedProperty.host.name}</h4>
                      {selectedProperty.host.isSuperhost && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                          Суперхозяин
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">
                      На сервисе с {selectedProperty.host.joinedDate} • Скорость ответа: {selectedProperty.host.responseRate}
                    </p>
                  </div>
                </div>

                <button
                  id="btn-chat-with-host-detail"
                  onClick={() => openChatWithHost(selectedProperty)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-200 text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 text-rose-600" />
                  <span>Написать в чат</span>
                </button>
              </div>

              {/* Description */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">Об этом жилье</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                  {selectedProperty.description}
                </p>
              </div>

              {/* Amenities Grid */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">Что есть в этом жилье</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {selectedProperty.amenities.map((amenity, i) => (
                    <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 text-xs font-medium text-slate-700">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* House Rules */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">Правила проживания</h3>
                <ul className="space-y-1.5 text-xs text-slate-600">
                  {selectedProperty.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Geolocation & Exact Address */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-900">Точное местоположение</h3>
                <p className="text-xs text-slate-500">
                  {selectedProperty.city}, {selectedProperty.district}, {selectedProperty.address}
                </p>
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-600" />
                    <span>Координаты: <strong>{selectedProperty.lat.toFixed(4)}, {selectedProperty.lng.toFixed(4)}</strong></span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold">Точная геолокация подтверждена</span>
                </div>
              </div>

              {/* Verified Guest Reviews Section */}
              <div className="space-y-4 pt-6 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                    <h3 className="text-base font-bold text-slate-900">
                      {selectedProperty.rating} • {propReviews.length} отзывов гостей
                    </h3>
                  </div>

                  <button
                    id="btn-open-add-review"
                    onClick={() => {
                      setReviewingProperty(selectedProperty);
                      setIsReviewModalOpen(true);
                    }}
                    className="text-xs font-bold text-rose-600 hover:text-rose-700 underline cursor-pointer"
                  >
                    + Оставить свой отзыв
                  </button>
                </div>

                {/* Sub-ratings Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[11px]">Чистота</span>
                    <strong className="font-bold text-slate-900">5.0 / 5.0</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Расположение</span>
                    <strong className="font-bold text-slate-900">4.9 / 5.0</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Цена / качество</span>
                    <strong className="font-bold text-slate-900">4.8 / 5.0</strong>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px]">Общение</span>
                    <strong className="font-bold text-slate-900">5.0 / 5.0</strong>
                  </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-4">
                  {propReviews.length === 0 ? (
                    <p className="text-xs text-slate-500 py-4 italic">Отзывов пока нет. Будьте первым, кто оставит отзыв после проживания!</p>
                  ) : (
                    propReviews.map((rev) => (
                      <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 bg-white space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <img src={rev.authorAvatar} alt={rev.authorName} className="w-8 h-8 rounded-full object-cover" />
                            <div>
                              <p className="text-xs font-bold text-slate-900">{rev.authorName}</p>
                              <p className="text-[10px] text-slate-400">{rev.date}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs font-bold text-amber-600">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span>{rev.rating}.0</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>

            </div>

            {/* Right Col: Sticky Booking & Safe Payment Box */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 bg-white p-6 rounded-3xl border border-slate-200 shadow-xl space-y-6">
                
                {/* Price Header */}
                <div className="space-y-2">
                  {selectedProperty.rentMode === 'both' && (
                    <div className="grid grid-cols-2 gap-1 p-1 bg-slate-100 rounded-xl">
                      <button
                        onClick={() => setSelectedRentMode('daily')}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                          selectedRentMode === 'daily' ? 'bg-white text-rose-600 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Посуточно
                      </button>
                      <button
                        onClick={() => setSelectedRentMode('monthly')}
                        className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
                          selectedRentMode === 'monthly' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600'
                        }`}
                      >
                        Помесячно
                      </button>
                    </div>
                  )}

                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-2xl font-black text-slate-900">
                        {unitPrice.toLocaleString()} ₽
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        {selectedRentMode === 'daily' ? ' / сутки' : ' / месяц'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{selectedProperty.rating}</span>
                    </div>
                  </div>
                </div>

                {/* Booking Inputs */}
                <div className="border border-slate-200 rounded-2xl overflow-hidden divide-y divide-slate-200">
                  <div className="grid grid-cols-2 divide-x divide-slate-200 bg-slate-50/50">
                    <div className="p-2.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Заезд</label>
                      <input
                        type="date"
                        value={checkIn}
                        min={todayStr}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-hidden mt-0.5"
                      />
                    </div>
                    <div className="p-2.5">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase">Выезд</label>
                      <input
                        type="date"
                        value={checkOut}
                        min={checkIn}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="w-full bg-transparent text-xs font-semibold text-slate-900 outline-hidden mt-0.5"
                      />
                    </div>
                  </div>
                  
                  <div className="p-2.5 bg-slate-50/50 flex items-center justify-between">
                    <label className="text-[10px] font-bold text-slate-500 uppercase">Гости</label>
                    <select
                      value={guestCount}
                      onChange={(e) => setGuestCount(Number(e.target.value))}
                      className="bg-transparent text-xs font-semibold text-slate-900 outline-hidden cursor-pointer"
                    >
                      {Array.from({ length: selectedProperty.maxGuests }, (_, i) => i + 1).map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'гость' : n < 5 ? 'гостя' : 'гостей'}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Calculation Breakdown */}
                <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
                  <div className="flex justify-between text-slate-600">
                    <span>
                      {unitPrice.toLocaleString()} ₽ × {durationCount} {selectedRentMode === 'daily' ? 'сут.' : 'мес.'}
                    </span>
                    <span className="font-semibold text-slate-900">{rentTotal.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span className="flex items-center gap-1">
                      Возвратный залог
                      <span className="text-[10px] text-emerald-600 font-bold">(возврат при выезде)</span>
                    </span>
                    <span className="font-semibold text-slate-900">{deposit.toLocaleString()} ₽</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Комиссия сервиса</span>
                    <span className="font-bold text-emerald-600">0 ₽ (Бесплатно)</span>
                  </div>

                  <div className="border-t border-slate-200 pt-3 flex justify-between items-baseline">
                    <span className="text-sm font-bold text-slate-900">Итого к оплате</span>
                    <span className="text-xl font-black text-slate-900">{grandTotal.toLocaleString()} ₽</span>
                  </div>
                </div>

                {/* Booking Button */}
                <button
                  id="btn-book-now-safe"
                  onClick={handleStartBooking}
                  className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <Lock className="w-4 h-4" />
                  <span>Забронировать безопасно</span>
                </button>

                {/* Safe Escrow Assurance Badge */}
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-emerald-800 leading-snug">
                    <strong>Безопасная сделка:</strong> средства замораживаются и перечисляются владельцу только через 24 часа после вашего заселения.
                  </p>
                </div>

              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
