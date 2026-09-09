import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal, 
  MapPin, 
  Calendar, 
  Users, 
  Home, 
  Building, 
  Hotel, 
  X, 
  Check, 
  ArrowUpDown, 
  Sparkles,
  Building2,
  Globe
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PropertyType } from '../types';
import { COUNTRIES_AND_CITIES } from '../data/locations';

export const FilterBar: React.FC = () => {
  const { 
    filters, 
    setFilters, 
    resetFilters, 
    properties, 
    isObjectsDrawerOpen,
    setIsObjectsDrawerOpen 
  } = useApp();

  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

  // Selected country object
  const selectedCountryObj = COUNTRIES_AND_CITIES.find(c => c.name === filters.country);

  // Available cities based on selected country or all
  const availableCities = selectedCountryObj 
    ? selectedCountryObj.cities 
    : COUNTRIES_AND_CITIES.flatMap(c => c.cities);

  const handleCountryChange = (countryName: string) => {
    setFilters(prev => ({
      ...prev,
      country: countryName,
      city: '', // reset city when country changes
    }));
  };

  const propertyTypeButtons: { label: string; value: 'all' | PropertyType; icon: any }[] = [
    { label: 'Все объекты', value: 'all', icon: Home },
    { label: 'Квартиры', value: 'apartment', icon: Building },
    { label: 'Дома и коттеджи', value: 'house', icon: Home },
    { label: 'Мини-гостиницы', value: 'hotel', icon: Hotel },
  ];

  const amenityOptions = [
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
  ];

  const toggleAmenity = (amenity: string) => {
    setFilters(prev => {
      const exists = prev.amenities.includes(amenity);
      return {
        ...prev,
        amenities: exists ? prev.amenities.filter(a => a !== amenity) : [...prev.amenities, amenity]
      };
    });
  };

  const activeFiltersCount = 
    (filters.rentMode !== 'all' ? 1 : 0) +
    (filters.propertyType !== 'all' ? 1 : 0) +
    (filters.country ? 1 : 0) +
    (filters.city ? 1 : 0) +
    (filters.minPrice > 0 || filters.maxPrice < 300000 ? 1 : 0) +
    (filters.guests > 1 ? 1 : 0) +
    filters.amenities.length;

  return (
    <div className="bg-white border-b border-slate-200 py-2.5 shadow-xs shrink-0 z-10">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 space-y-2.5">
        
        {/* Top search controls bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-2 sm:gap-3">
          
          {/* Main search input with city and keyword */}
          <div className="flex-1 flex items-center bg-slate-100/90 rounded-2xl border border-slate-200 px-3 py-1.5 focus-within:ring-2 focus-within:ring-rose-500/20 focus-within:border-rose-500 transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              id="filter-query-input"
              type="text"
              placeholder="Поиск по названию, адресу или району..."
              value={filters.query}
              onChange={(e) => setFilters(prev => ({ ...prev, query: e.target.value }))}
              className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-hidden"
            />
            {filters.query && (
              <button 
                onClick={() => setFilters(prev => ({ ...prev, query: '' }))}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Direct "Все объекты" toggle button placed right next to search */}
          <button
            id="btn-toggle-objects-drawer"
            onClick={() => setIsObjectsDrawerOpen(!isObjectsDrawerOpen)}
            className={`flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer border shrink-0 ${
              isObjectsDrawerOpen
                ? 'bg-rose-600 border-rose-600 text-white shadow-sm shadow-rose-600/20 ring-2 ring-rose-600/30'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-800'
            }`}
            title="Открыть список всех объектов рядом с поиском"
          >
            <Building2 className="w-4 h-4 text-rose-500" />
            <span>Все объекты</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-extrabold ${
              isObjectsDrawerOpen ? 'bg-white text-rose-600' : 'bg-rose-100 text-rose-700'
            }`}>
              {properties.length}
            </span>
          </button>

          {/* Country selector dropdown */}
          <div className="relative shrink-0 min-w-[140px]">
            <div className="flex items-center bg-slate-100/90 rounded-2xl border border-slate-200 px-3 py-1.5">
              <Globe className="w-4 h-4 text-rose-600 mr-1.5 shrink-0" />
              <select
                id="filter-country-select"
                value={filters.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-800 outline-hidden font-medium cursor-pointer"
              >
                <option value="">Все страны (10)</option>
                {COUNTRIES_AND_CITIES.map(c => (
                  <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* City selector dropdown */}
          <div className="relative shrink-0 min-w-[140px]">
            <div className="flex items-center bg-slate-100/90 rounded-2xl border border-slate-200 px-3 py-1.5">
              <MapPin className="w-4 h-4 text-rose-600 mr-1.5 shrink-0" />
              <select
                id="filter-city-select"
                value={filters.city}
                onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value }))}
                className="w-full bg-transparent text-xs text-slate-800 outline-hidden font-medium cursor-pointer"
              >
                <option value="">{filters.country ? 'Все города страны' : 'Все города'}</option>
                {availableCities.map(city => (
                  <option key={city.name} value={city.name}>{city.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Daily vs Monthly Rental format toggle */}
          <div className="inline-flex p-1 bg-slate-100 rounded-2xl border border-slate-200 shrink-0">
            <button
              id="filter-rent-mode-all"
              onClick={() => setFilters(prev => ({ ...prev, rentMode: 'all' }))}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                filters.rentMode === 'all'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Все сроки
            </button>
            <button
              id="filter-rent-mode-daily"
              onClick={() => setFilters(prev => ({ ...prev, rentMode: 'daily' }))}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                filters.rentMode === 'daily'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Посуточно
            </button>
            <button
              id="filter-rent-mode-monthly"
              onClick={() => setFilters(prev => ({ ...prev, rentMode: 'monthly' }))}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all cursor-pointer ${
                filters.rentMode === 'monthly'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Помесячно
            </button>
          </div>

          {/* Filter modal */}
          <div className="flex items-center gap-2">
            <button
              id="btn-advanced-filters"
              onClick={() => setIsAdvancedModalOpen(true)}
              className={`flex items-center justify-center gap-2 px-3 py-2 rounded-2xl border text-xs font-semibold transition-all cursor-pointer ${
                activeFiltersCount > 0 
                  ? 'bg-rose-50 border-rose-300 text-rose-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Фильтры</span>
              {activeFiltersCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category icons row & quick sorting */}
        <div className="flex items-center justify-between gap-4 overflow-x-auto no-scrollbar pt-1">
          <div className="flex items-center gap-2">
            {propertyTypeButtons.map(item => {
              const Icon = item.icon;
              const isSelected = filters.propertyType === item.value;
              return (
                <button
                  key={item.value}
                  id={`filter-type-${item.value}`}
                  onClick={() => setFilters(prev => ({ ...prev, propertyType: item.value }))}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100/70 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              id="filter-sort-select"
              value={filters.sortBy}
              onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
              className="text-xs text-slate-600 bg-transparent font-medium outline-hidden cursor-pointer"
            >
              <option value="popular">Сначала популярные</option>
              <option value="price_asc">Сначала дешевле</option>
              <option value="price_desc">Сначала дороже</option>
              <option value="rating">По рейтингу</option>
            </select>
          </div>
        </div>

      </div>

      {/* Advanced Filter Modal */}
      {isAdvancedModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-rose-600" />
                <h3 className="font-bold text-slate-900 text-base">Все фильтры</h3>
              </div>
              <button 
                onClick={() => setIsAdvancedModalOpen(false)}
                className="p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              
              {/* Price range */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Диапазон цен (в рублях)</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium">От (₽)</label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, minPrice: Number(e.target.value) || 0 }))}
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-rose-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-500 font-medium">До (₽)</label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: Number(e.target.value) || 300000 }))}
                      className="w-full mt-1 px-3 py-2 text-xs rounded-xl border border-slate-200 outline-hidden focus:ring-2 focus:ring-rose-500"
                      placeholder="300 000"
                    />
                  </div>
                </div>
                <div className="text-[11px] text-slate-400">
                  Посуточно: от 2 000 до 25 000 ₽/сут. Помесячно: от 40 000 до 300 000 ₽/мес.
                </div>
              </div>

              {/* Number of Guests */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Количество гостей</h4>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      onClick={() => setFilters(prev => ({ ...prev, guests: num }))}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        filters.guests === num
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {num === 6 ? '6+' : num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Удобства и особенности</h4>
                <div className="grid grid-cols-2 gap-2">
                  {amenityOptions.map(amenity => {
                    const isSelected = filters.amenities.includes(amenity);
                    return (
                      <button
                        key={amenity}
                        onClick={() => toggleAmenity(amenity)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-xs text-left border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-rose-50 border-rose-300 text-rose-700 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center text-[10px] ${
                          isSelected ? 'bg-rose-600 text-white' : 'border border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3" />}
                        </div>
                        <span className="truncate">{amenity}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* Modal actions */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => {
                  resetFilters();
                  setIsAdvancedModalOpen(false);
                }}
                className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
              >
                Сбросить все
              </button>
              <button
                onClick={() => setIsAdvancedModalOpen(false)}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/25 transition-all"
              >
                Показать результаты
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
