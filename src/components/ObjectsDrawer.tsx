import React from 'react';
import { 
  Building2, 
  X, 
  MapPin, 
  Star, 
  Heart, 
  ExternalLink, 
  RotateCcw,
  SlidersHorizontal,
  Home,
  Building,
  Hotel
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Property } from '../types';

interface ObjectsDrawerProps {
  properties: Property[];
}

export const ObjectsDrawer: React.FC<ObjectsDrawerProps> = ({ properties }) => {
  const { 
    isObjectsDrawerOpen, 
    setIsObjectsDrawerOpen, 
    setSelectedProperty, 
    highlightedPropertyId, 
    setHighlightedPropertyId,
    toggleFavorite,
    user,
    filters,
    setFilters,
    resetFilters
  } = useApp();

  if (!isObjectsDrawerOpen) return null;

  return (
    <aside 
      id="objects-drawer-panel"
      className="absolute top-0 left-0 sm:top-3 sm:left-4 z-20 w-full sm:w-[420px] max-w-[calc(100vw-16px)] h-[calc(100vh-140px)] sm:h-[calc(100vh-180px)] bg-white/95 backdrop-blur-md rounded-none sm:rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden transition-all animate-in fade-in slide-in-from-left-4 duration-200"
    >
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center font-bold">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Объекты рядом с поиском</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700">
                {properties.length}
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {filters.city ? `В городе ${filters.city}` : filters.country ? `В стране ${filters.country}` : 'Все доступные локации'}
            </p>
          </div>
        </div>

        <button
          id="btn-close-objects-drawer"
          onClick={() => setIsObjectsDrawerOpen(false)}
          className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Скрыть панель объектов"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Filter bar inside drawer */}
      <div className="px-3 py-2 border-b border-slate-100 bg-slate-50/70 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
        <button
          onClick={() => setFilters(prev => ({ ...prev, rentMode: 'all' }))}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
            filters.rentMode === 'all' ? 'bg-slate-900 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Все форматы
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, rentMode: 'daily' }))}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
            filters.rentMode === 'daily' ? 'bg-rose-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Посуточно
        </button>
        <button
          onClick={() => setFilters(prev => ({ ...prev, rentMode: 'monthly' }))}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
            filters.rentMode === 'monthly' ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
          }`}
        >
          Помесячно
        </button>
      </div>

      {/* Properties List Scroll Area */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {properties.length === 0 ? (
          <div className="py-16 text-center space-y-3 px-4">
            <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
            <h4 className="text-xs font-bold text-slate-800">Объектов не найдено</h4>
            <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
              Попробуйте выбрать другую страну, город или сбросить критерии цены и типа жилья.
            </p>
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Сбросить фильтры</span>
            </button>
          </div>
        ) : (
          properties.map((prop) => {
            const isFav = user?.favorites.includes(prop.id) ?? false;
            const isHovered = highlightedPropertyId === prop.id;

            return (
              <div
                key={prop.id}
                id={`drawer-property-item-${prop.id}`}
                onMouseEnter={() => setHighlightedPropertyId(prop.id)}
                onMouseLeave={() => setHighlightedPropertyId(null)}
                className={`group p-2.5 rounded-2xl border transition-all bg-white flex gap-3 cursor-pointer ${
                  isHovered 
                    ? 'border-rose-500 shadow-md ring-2 ring-rose-500/20' 
                    : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                }`}
                onClick={() => setSelectedProperty(prop)}
              >
                {/* Image */}
                <div className="relative w-28 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={prop.images[0]}
                    alt={prop.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prop.id);
                    }}
                    className={`absolute top-1.5 right-1.5 p-1 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                      isFav 
                        ? 'bg-rose-500 text-white shadow-xs' 
                        : 'bg-black/30 text-white hover:bg-black/50'
                    }`}
                  >
                    <Heart className={`w-3 h-3 ${isFav ? 'fill-current' : ''}`} />
                  </button>
                  <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-xs text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded">
                    {prop.type === 'apartment' ? 'Квартира' : prop.type === 'house' ? 'Дом' : 'Отель'}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1 text-[11px] text-slate-500 truncate">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span className="truncate">{prop.city}, {prop.district}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[11px] font-bold text-slate-800 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        <span>{prop.rating}</span>
                      </div>
                    </div>

                    <h5 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5 group-hover:text-rose-600 transition-colors">
                      {prop.title}
                    </h5>

                    <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                      {prop.rooms} комн. • до {prop.maxGuests} гостей • {prop.area} м²
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div>
                      <span className="text-xs font-black text-rose-600">
                        {prop.rentMode === 'monthly'
                          ? `${prop.priceMonthly.toLocaleString()} ₽`
                          : `${prop.priceDaily.toLocaleString()} ₽`}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {prop.rentMode === 'monthly' ? ' /мес' : ' /сут'}
                      </span>
                    </div>

                    <span className="text-[11px] font-bold text-slate-700 group-hover:text-rose-600 flex items-center gap-0.5">
                      <span>Смотреть</span>
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Drawer Footer */}
      <div className="p-3 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-[11px] text-slate-500 shrink-0">
        <span>Кликните по объекту для подробностей</span>
        <button
          onClick={() => setIsObjectsDrawerOpen(false)}
          className="font-bold text-rose-600 hover:underline cursor-pointer"
        >
          Свернуть на карту
        </button>
      </div>
    </aside>
  );
};
