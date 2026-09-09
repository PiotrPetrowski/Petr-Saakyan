import React, { useState } from 'react';
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
  Maximize2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyType, RentMode } from '../types';

export const AddListingModal: React.FC = () => {
  const { isAddListingOpen, setIsAddListingOpen, addProperty, setSelectedProperty } = useApp();

  const [type, setType] = useState<PropertyType>('apartment');
  const [rentMode, setRentMode] = useState<RentMode>('both');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priceDaily, setPriceDaily] = useState<number>(4500);
  const [priceMonthly, setPriceMonthly] = useState<number>(90000);
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
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1000&auto=format&fit=crop&q=80'
  ]);
  const [error, setError] = useState('');

  if (!isAddListingOpen) return null;

  const cityCoordinates: Record<string, { lat: number; lng: number }> = {
    'Москва': { lat: 55.7512, lng: 37.6184 },
    'Санкт-Петербург': { lat: 59.9311, lng: 30.3609 },
    'Сочи': { lat: 43.5855, lng: 39.7231 },
    'Казань': { lat: 55.7963, lng: 49.1088 },
    'Калининград': { lat: 54.7104, lng: 20.4522 },
  };

  const handleCityChange = (newCity: string) => {
    setCity(newCity);
    if (cityCoordinates[newCity]) {
      // Add slight random jitter so multiple listings don't perfectly stack
      const jitterLat = (Math.random() - 0.5) * 0.04;
      const jitterLng = (Math.random() - 0.5) * 0.04;
      setLat(Number((cityCoordinates[newCity].lat + jitterLat).toFixed(4)));
      setLng(Number((cityCoordinates[newCity].lng + jitterLng).toFixed(4)));
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

  const presetPhotos: Record<PropertyType, string[]> = {
    apartment: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop&q=80'
    ],
    house: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1000&auto=format&fit=crop&q=80'
    ],
    hotel: [
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?w=1000&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1000&auto=format&fit=crop&q=80'
    ]
  };

  const handleAddCustomPhoto = () => {
    if (customPhotoUrl.trim()) {
      setImages(prev => [...prev, customPhotoUrl.trim()]);
      setCustomPhotoUrl('');
    }
  };

  const handleRemovePhoto = (index: number) => {
    if (images.length <= 1) return;
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !address.trim()) {
      setError('Пожалуйста, заполните заголовок, описание и адрес объекта');
      return;
    }

    const newProp = addProperty({
      title,
      description,
      type,
      rentMode,
      priceDaily: Number(priceDaily) || 0,
      priceMonthly: Number(priceMonthly) || 0,
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
                      setImages(presetPhotos[item.val as PropertyType]);
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
                <span>3. Местоположение и точная геолокация</span>
              </label>
              <span className="text-[11px] text-slate-500">Отобразится на интерактивной карте</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Город</label>
                <select
                  value={city}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-hidden cursor-pointer"
                >
                  <option value="Москва">Москва</option>
                  <option value="Санкт-Петербург">Санкт-Петербург</option>
                  <option value="Сочи">Сочи</option>
                  <option value="Казань">Казань</option>
                  <option value="Калининград">Калининград</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Район / Метро</label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Например: Центральный"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Улица и номер дома</label>
                <input
                  id="input-listing-address"
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="ул. Арбат, 25"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold bg-white outline-hidden"
                />
              </div>
            </div>

            {/* Coordinates Lat / Lng with auto-pin */}
            <div className="grid grid-cols-2 gap-3 pt-2">
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

          {/* 7. Photos */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Фотографии объекта ({images.length})
              </label>
              <span className="text-[11px] text-slate-500">Первое фото — обложка</span>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {images.map((img, i) => (
                <div key={i} className="relative aspect-4/3 rounded-xl overflow-hidden group border border-slate-200">
                  <img src={img} alt="" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemovePhoto(i)}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 hover:bg-rose-600 text-white flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 text-[9px] font-bold bg-slate-900/80 text-white px-1.5 py-0.5 rounded">
                      Главное
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Add photo URL */}
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="Вставьте ссылку на фото (URL)"
                value={customPhotoUrl}
                onChange={(e) => setCustomPhotoUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddCustomPhoto}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                + Добавить
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
