import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  MapPin, 
  Home, 
  Building, 
  Hotel, 
  Upload, 
  Check, 
  Sparkles,
  Bed,
  Bath,
  Users,
  Maximize2,
  Image as ImageIcon,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyType, RentMode } from '../types';
import { COUNTRIES_AND_CITIES } from '../data/locations';

const PRESET_PHOTOS: Record<PropertyType, string[]> = {
  apartment: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80'
  ],
  house: [
    'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80'
  ],
  hotel: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80'
  ]
};

export const AddListingModal: React.FC = () => {
  const { isAddListingOpen, setIsAddListingOpen, addProperty, setSelectedProperty } = useApp();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [type, setType] = useState<PropertyType>('apartment');
  const [rentMode, setRentMode] = useState<RentMode>('both');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceDaily, setPriceDaily] = useState<number>(4500);
  const [priceMonthly, setPriceMonthly] = useState<number>(90000);
  const [country, setCountry] = useState('Россия');
  const [city, setCity] = useState('Москва');
  const [district, setDistrict] = useState('Центральный район');
  const [address, setAddress] = useState('ул. Арбат, д. 25');
  const [lat, setLat] = useState<number>(55.7512);
  const [lng, setLng] = useState<number>(37.5927);
  const [bedrooms, setBedrooms] = useState<number>(1);
  const [bathrooms, setBathrooms] = useState<number>(1);
  const [maxGuests, setMaxGuests] = useState<number>(2);
  const [area, setArea] = useState<number>(48);
  const [amenities, setAmenities] = useState<string[]>([
    'Wi-Fi 500 Мбит/с', 'Кондиционер', 'Кухня', 'Стиральная машина'
  ]);
  const [customPhotoUrl, setCustomPhotoUrl] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [error, setError] = useState('');

  if (!isAddListingOpen) return null;

  const currentCountryData = COUNTRIES_AND_CITIES.find(c => c.name === country) || COUNTRIES_AND_CITIES[0];

  const handleCountryChange = (newCountryName: string) => {
    setCountry(newCountryName);
    const countryObj = COUNTRIES_AND_CITIES.find(c => c.name === newCountryName);
    if (countryObj && countryObj.cities.length > 0) {
      const firstCity = countryObj.cities[0];
      setCity(firstCity.name);
      const jitterLat = (Math.random() - 0.5) * 0.04;
      const jitterLng = (Math.random() - 0.5) * 0.04;
      setLat(Number((firstCity.lat + jitterLat).toFixed(4)));
      setLng(Number((firstCity.lng + jitterLng).toFixed(4)));
    }
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    const cityObj = currentCountryData.cities.find(c => c.name === newCity);
    if (cityObj) {
      const jitterLat = (Math.random() - 0.5) * 0.04;
      const jitterLng = (Math.random() - 0.5) * 0.04;
      setLat(Number((cityObj.lat + jitterLat).toFixed(4)));
      setLng(Number((cityObj.lng + jitterLng).toFixed(4)));
    }
  };

  const allAmenities = [
    'Wi-Fi 500 Мбит/с',
    'Кондиционер',
    'Кухня',
    'Парковка',
    'Сауна',
    'Камин',
    'Бассейн с подогревом',
    'Вид на море',
    'Вид на город',
    'Вид на горы',
    'Джакузи на террасе',
    'Посудомоечная машина',
    'Стиральная машина',
    'Разрешено с питомцами',
    'Завтрак включен',
    'Смарт ТВ'
  ];

  const toggleAmenity = (amenity: string) => {
    setAmenities(prev => 
      prev.includes(amenity) ? prev.filter(a => a !== amenity) : [...prev, amenity]
    );
  };

  const handleAddCustomPhoto = () => {
    if (customPhotoUrl.trim()) {
      setImages(prev => [...prev, customPhotoUrl.trim()]);
      setCustomPhotoUrl('');
      setError('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImages(prev => [...prev, event.target!.result as string]);
          setError('');
        }
      };
      reader.readAsDataURL(file as Blob);
    });
  };

  const handleRemovePhoto = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !address.trim()) {
      setError('Пожалуйста, заполните название, подробное описание и точный адрес жилья');
      return;
    }

    if (images.length === 0) {
      setError('Обязательно добавьте хотя бы 1 фотографию жилья! Без реальных фотографий публикация невозможна.');
      return;
    }

    const newProp = addProperty({
      title,
      description,
      type,
      rentMode,
      priceDaily: Number(priceDaily) || 0,
      priceMonthly: Number(priceMonthly) || 0,
      country,
      city,
      district,
      address,
      lat: Number(lat),
      lng: Number(lng),
      bedrooms: Number(bedrooms),
      bathrooms: Number(bathrooms),
      maxGuests: Number(maxGuests),
      area: Number(area),
      images,
      amenities,
      rules: ['Без курения в помещениях', 'Тихие часы после 23:00', 'Бережное отношение к имуществу'],
      instantBook: true,
    });

    setIsAddListingOpen(false);
    setSelectedProperty(newProp);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Сдать жилье в аренду</h3>
            <p className="text-xs text-slate-500">Квартиры, загородные дома, виллы и мини-гостиницы</p>
          </div>
          <button
            id="btn-close-add-listing"
            onClick={() => setIsAddListingOpen(false)}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
          
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold">
              {error}
            </div>
          )}

          {/* 1. Property Type Selector */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Тип объекта
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Квартира / Апартаменты', val: 'apartment', icon: Building },
                { label: 'Дом / Коттедж', val: 'house', icon: Home },
                { label: 'Мини-гостиница / Отель', val: 'hotel', icon: Hotel },
              ].map(item => {
                const Icon = item.icon;
                const isSel = type === item.val;
                return (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => {
                      setType(item.val as PropertyType);
                      // Update default images to matching preset
                      setImages(PRESET_PHOTOS[item.val as PropertyType]);
                    }}
                    className={`p-3 rounded-2xl border text-left flex flex-col justify-between gap-3 transition-all cursor-pointer ${
                      isSel
                        ? 'border-rose-600 bg-rose-50/50 text-slate-900 shadow-sm'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Icon className={`w-5 h-5 ${isSel ? 'text-rose-600' : 'text-slate-400'}`} />
                    <span className="text-xs font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Rental Term / Format (Посуточно, Помесячно, Оба) */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              2. Формат сдачи
            </label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Посуточно', val: 'daily', desc: 'Для туристов и командировок' },
                { label: 'Помесячно', val: 'monthly', desc: 'Долгосрочная стабильная аренда' },
                { label: 'Посуточно и помесячно', val: 'both', desc: 'Гибкие тарифы на выбор гостя' },
              ].map(item => (
                <button
                  key={item.val}
                  type="button"
                  onClick={() => setRentMode(item.val as RentMode)}
                  className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                    rentMode === item.val
                      ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-slate-50'
                  }`}
                >
                  <p className="text-xs font-bold">{item.label}</p>
                  <p className={`text-[10px] mt-0.5 ${rentMode === item.val ? 'text-slate-300' : 'text-slate-500'}`}>
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Pricing */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(rentMode === 'daily' || rentMode === 'both') && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Стоимость посуточно (₽ / сутки)
                </label>
                <input
                  id="input-price-daily"
                  type="number"
                  min="500"
                  value={priceDaily}
                  onChange={(e) => setPriceDaily(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-rose-500 outline-hidden"
                  placeholder="4500"
                />
              </div>
            )}
            {(rentMode === 'monthly' || rentMode === 'both') && (
              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  Стоимость в месяц (₽ / месяц)
                </label>
                <input
                  id="input-price-monthly"
                  type="number"
                  min="10000"
                  value={priceMonthly}
                  onChange={(e) => setPriceMonthly(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-rose-500 outline-hidden"
                  placeholder="90000"
                />
              </div>
            )}
          </div>

          {/* 4. Location & Map Geolocation Coordinates */}
          <div className="space-y-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                <span>3. Страна, город и геолокация</span>
              </label>
              <span className="text-[11px] text-slate-500">Автоматически позиционируется на карте</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Страна</label>
                <select
                  id="select-listing-country"
                  value={country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-hidden cursor-pointer"
                >
                  {COUNTRIES_AND_CITIES.map(c => (
                    <option key={c.code} value={c.name}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Город</label>
                <select
                  id="select-listing-city"
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-hidden cursor-pointer"
                >
                  {currentCountryData.cities.map(ct => (
                    <option key={ct.name} value={ct.name}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Район / Метро / Пляж</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Например: Центральный или Dubai Marina"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Точный адрес (улица, дом)</label>
                <input
                  id="input-listing-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ул. Арбат, д. 25"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-hidden"
                />
              </div>
            </div>

            {/* Coordinates Lat / Lng with auto-pin */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Широта (Latitude)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lat}
                  onChange={(e) => setLat(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold bg-white"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase">Долгота (Longitude)</label>
                <input
                  type="number"
                  step="0.0001"
                  value={lng}
                  onChange={(e) => setLng(Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-mono font-bold bg-white"
                />
              </div>
            </div>
          </div>

          {/* 5. Title & Description */}
          <div className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Название объявления</label>
              <input
                id="input-listing-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Например: Видовая студия с камином в центре"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold focus:ring-2 focus:ring-rose-500 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1">Подробное описание</label>
              <textarea
                id="input-listing-desc"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Расскажите о преимуществах жилья, ремонте, виде из окон, инфраструктуре и правилах..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-rose-500 outline-hidden"
              ></textarea>
            </div>
          </div>

          {/* 6. Parameters (Bedrooms, Bathrooms, Guests, Area) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Спальни</label>
              <input
                type="number"
                min="1"
                value={bedrooms}
                onChange={(e) => setBedrooms(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Санузлы</label>
              <input
                type="number"
                min="1"
                value={bathrooms}
                onChange={(e) => setBathrooms(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Макс. гостей</label>
              <input
                type="number"
                min="1"
                value={maxGuests}
                onChange={(e) => setMaxGuests(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Площадь (м²)</label>
              <input
                type="number"
                min="10"
                value={area}
                onChange={(e) => setArea(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold"
              />
            </div>
          </div>

          {/* 7. Photos - MANDATORY REQUIREMENT */}
          <div className={`space-y-3 p-4 rounded-2xl border ${images.length === 0 ? 'bg-rose-50/50 border-rose-300' : 'bg-slate-50/70 border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-rose-600" />
                <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  6. Фотографии объекта <span className="text-rose-600 font-extrabold">* Обязательно</span>
                </label>
              </div>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${images.length > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                {images.length > 0 ? `Загружено: ${images.length} фото` : 'Требуется фото'}
              </span>
            </div>

            {images.length === 0 && (
              <div className="p-3 rounded-xl bg-rose-100/70 border border-rose-300 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>При добавлении жилья <strong>обязательно загрузите фото</strong>. Без фото объявление не публикуется на карте.</span>
              </div>
            )}

            {/* Photo thumbnails */}
            {images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {images.map((img, i) => (
                  <div key={i} className="relative aspect-4/3 rounded-xl overflow-hidden group border border-slate-200 shadow-xs">
                    <img src={img} alt="" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => handleRemovePhoto(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="Удалить фото"
                    >
                      ×
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-slate-900/80 text-white px-1.5 py-0.5 rounded">
                        Главное фото
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Upload from device / Drag & Drop */}
            <div 
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const files = e.dataTransfer.files;
                if (!files || files.length === 0) return;
                Array.from(files).forEach((file) => {
                  const reader = new FileReader();
                  reader.onload = (ev) => {
                    if (ev.target?.result) {
                      setImages(prev => [...prev, ev.target!.result as string]);
                      setError('');
                    }
                  };
                  reader.readAsDataURL(file as Blob);
                });
              }}
              className="border-2 border-dashed border-rose-300 hover:border-rose-500 bg-white p-4 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-colors"
            >
              <Upload className="w-6 h-6 text-rose-600 mb-1" />
              <p className="text-xs font-bold text-slate-800">
                Нажмите для выбора фото с телефона или компьютера
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Или перетащите файлы изображений сюда (JPG, PNG, WebP)
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Add photo URL */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Или вставьте прямую ссылку на фото (URL)"
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddCustomPhoto}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
              >
                + Добавить URL
              </button>
            </div>
          </div>

          {/* 8. Amenities */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              Удобства
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {allAmenities.map(item => {
                const hasIt = amenities.includes(item);
                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => toggleAmenity(item)}
                    className={`flex items-center gap-2 p-2 rounded-xl text-xs text-left border transition-all cursor-pointer ${
                      hasIt
                        ? 'border-rose-300 bg-rose-50 text-rose-700 font-semibold'
                        : 'border-slate-200 text-slate-600 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                      hasIt ? 'bg-rose-600 text-white' : 'border border-slate-300'
                    }`}>
                      {hasIt && <Check className="w-3 h-3" />}
                    </div>
                    <span className="truncate">{item}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsAddListingOpen(false)}
              className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Отмена
            </button>
            <button
              id="btn-publish-listing"
              type="submit"
              className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold rounded-xl shadow-md shadow-rose-600/25 cursor-pointer"
            >
              Опубликовать на карте
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
