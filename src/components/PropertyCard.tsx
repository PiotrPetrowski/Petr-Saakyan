import React from 'react';
import { 
  Heart, 
  Star, 
  MapPin, 
  Users, 
  Bed, 
  Maximize2, 
  ShieldCheck, 
  MessageSquare,
  Sparkles
} from 'lucide-react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';

interface PropertyCardProps {
  property: Property;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const { 
    user, 
    toggleFavorite, 
    setSelectedProperty, 
    openChatWithHost,
    setHighlightedPropertyId,
    highlightedPropertyId
  } = useApp();

  const isFavorite = user?.favorites?.includes(property.id) || false;
  const isHighlighted = highlightedPropertyId === property.id;

  const typeLabels: Record<string, string> = {
    apartment: 'Квартира',
    house: 'Дом / Коттедж',
    hotel: 'Мини-гостиница',
  };

  return (
    <div
      id={`property-card-${property.id}`}
      onMouseEnter={() => setHighlightedPropertyId(property.id)}
      onMouseLeave={() => setHighlightedPropertyId(null)}
      className={`group bg-white rounded-3xl border transition-all duration-200 overflow-hidden flex flex-col ${
        isHighlighted
          ? 'border-rose-500 shadow-xl shadow-rose-500/10 -translate-y-1'
          : 'border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300'
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 overflow-hidden bg-slate-100">
        <img
          src={property.images[0]}
          alt={property.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Favorite Button */}
        <button
          id={`btn-fav-${property.id}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(property.id);
          }}
          title={isFavorite ? 'Удалить из избранного' : 'Добавить в избранное'}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-rose-600 shadow-md transition-transform active:scale-90 cursor-pointer z-10"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5 z-10">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md text-white shadow-xs">
            {typeLabels[property.type]}
          </span>
          {property.host.isSuperhost && (
            <span className="text-[10px] font-extrabold px-2 py-1 rounded-full bg-amber-500 text-white shadow-xs flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Суперхозяин
            </span>
          )}
        </div>

        {/* Rent mode badge at bottom of image */}
        <div className="absolute bottom-3 left-3 z-10">
          {property.rentMode === 'daily' && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-rose-600/95 text-white backdrop-blur-xs">
              Посуточно
            </span>
          )}
          {property.rentMode === 'monthly' && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-600/95 text-white backdrop-blur-xs">
              Помесячно
            </span>
          )}
          {property.rentMode === 'both' && (
            <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-600/95 text-white backdrop-blur-xs">
              Посуточно и Помесячно
            </span>
          )}
        </div>

        {/* Photos count */}
        <div className="absolute bottom-3 right-3 text-[10px] font-semibold text-white/90 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-full">
          1/{property.images.length} фото
        </div>
      </div>

      {/* Details body */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        
        <div className="space-y-2">
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-slate-500 font-medium truncate max-w-[70%]">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{property.city}, {property.district}</span>
            </div>
            <div className="flex items-center gap-1 font-bold text-slate-900 shrink-0">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{property.rating}</span>
              <span className="text-slate-400 text-[11px] font-normal">({property.reviewsCount})</span>
            </div>
          </div>

          {/* Title */}
          <h3 
            onClick={() => setSelectedProperty(property)}
            className="text-sm font-bold text-slate-900 group-hover:text-rose-600 transition-colors line-clamp-1 cursor-pointer"
          >
            {property.title}
          </h3>

          {/* Quick Specs */}
          <div className="flex items-center gap-3 text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              {property.bedrooms} спальн{property.bedrooms > 1 ? 'и' : 'я'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              до {property.maxGuests} мест
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              {property.area} м²
            </span>
          </div>
        </div>

        {/* Pricing & Footer Actions */}
        <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            {property.rentMode === 'monthly' ? (
              <div>
                <span className="text-base font-extrabold text-slate-900">
                  {property.priceMonthly.toLocaleString()} ₽
                </span>
                <span className="text-xs text-slate-500"> / месяц</span>
              </div>
            ) : (
              <div>
                <span className="text-base font-extrabold text-slate-900">
                  {property.priceDaily.toLocaleString()} ₽
                </span>
                <span className="text-xs text-slate-500"> / сутки</span>
                {property.rentMode === 'both' && (
                  <p className="text-[10px] text-slate-400">или {property.priceMonthly.toLocaleString()} ₽/мес</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`btn-chat-${property.id}`}
              onClick={(e) => {
                e.stopPropagation();
                openChatWithHost(property);
              }}
              title="Написать владельцу"
              className="p-2 rounded-xl text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors border border-slate-200 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
            </button>

            <button
              id={`btn-view-${property.id}`}
              onClick={() => setSelectedProperty(property)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-rose-600 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              Смотреть
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
