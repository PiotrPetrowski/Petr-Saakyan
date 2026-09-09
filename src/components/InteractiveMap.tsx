import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Locate, Plus, Minus, Layers, Navigation, MapPin } from 'lucide-react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';
import { COUNTRIES_AND_CITIES } from '../data/locations';

interface InteractiveMapProps {
  properties: Property[];
  className?: string;
}

type MapTileStyle = 'google_roadmap' | 'google_satellite' | 'osm';

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ properties, className = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [tileStyle, setTileStyle] = useState<MapTileStyle>('google_roadmap');
  const [showLayerMenu, setShowLayerMenu] = useState(false);

  const { 
    setSelectedProperty, 
    highlightedPropertyId, 
    setHighlightedPropertyId,
    showToast,
    filters,
    setFilters,
    t
  } = useApp();

  // Helper to get tile layer config
  const getTileUrl = (style: MapTileStyle) => {
    switch (style) {
      case 'google_roadmap':
        // Google Maps Standard Roadmap tiles
        return 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
      case 'google_satellite':
        // Google Maps Satellite with roads and labels (hybrid)
        return 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}';
      case 'osm':
      default:
        // High contrast OpenStreetMap
        return 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center to Moscow or first country
    const initialLat = 55.7558;
    const initialLng = 37.6173;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 11,
      zoomControl: false,
    });

    const initialLayer = L.tileLayer(getTileUrl('google_roadmap'), {
      attribution: '&copy; Google Maps &copy; OpenStreetMap contributors',
      maxZoom: 20,
    }).addTo(map);

    tileLayerRef.current = initialLayer;

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    // Call invalidateSize after DOM renders to prevent blank/gray map
    setTimeout(() => {
      map.invalidateSize();
    }, 100);
    setTimeout(() => {
      map.invalidateSize();
    }, 400);

    // Watch for container resizes
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Switch Tile Layer when tileStyle changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    const newLayer = L.tileLayer(getTileUrl(tileStyle), {
      attribution: '&copy; Google Maps &copy; OpenStreetMap',
      maxZoom: 20,
    }).addTo(map);

    tileLayerRef.current = newLayer;
  }, [tileStyle]);

  // React to Country / City filter changes by smoothly navigating to country or city
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (filters.city) {
      // Find coordinates for this city
      let targetLat: number | null = null;
      let targetLng: number | null = null;

      for (const country of COUNTRIES_AND_CITIES) {
        const foundCity = country.cities.find(c => c.name === filters.city);
        if (foundCity) {
          targetLat = foundCity.lat;
          targetLng = foundCity.lng;
          break;
        }
      }

      // Fallback: check matching properties
      if (targetLat === null) {
        const prop = properties.find(p => p.city === filters.city);
        if (prop) {
          targetLat = prop.lat;
          targetLng = prop.lng;
        }
      }

      if (targetLat !== null && targetLng !== null) {
        map.flyTo([targetLat, targetLng], 13, { duration: 1.2 });
        return;
      }
    }

    if (filters.country) {
      const countryObj = COUNTRIES_AND_CITIES.find(c => c.name === filters.country);
      if (countryObj && countryObj.center) {
        map.flyTo([countryObj.center.lat, countryObj.center.lng], countryObj.center.zoom, { duration: 1.2 });
        return;
      }
    }
  }, [filters.country, filters.city]);

  // Update markers whenever properties or highlightedPropertyId change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layer = markersLayerRef.current;
    if (!map || !layer) return;

    layer.clearLayers();

    if (properties.length === 0) return;

    const bounds: L.LatLngBounds = L.latLngBounds([]);

    properties.forEach((prop) => {
      bounds.extend([prop.lat, prop.lng]);
      const isHighlighted = highlightedPropertyId === prop.id;

      // Price display
      const priceText = prop.rentMode === 'monthly'
        ? `${prop.priceMonthly.toLocaleString()} ₽/мес`
        : `${prop.priceDaily.toLocaleString()} ₽`;

      const typeEmoji = prop.type === 'house' ? '🏡' : prop.type === 'hotel' ? '🏨' : '🏢';

      // Custom HTML Marker Element matching Google Maps modern pins
      const customHtml = `
        <div class="custom-map-pin ${isHighlighted ? 'pin-highlighted' : ''}" id="map-pin-${prop.id}">
          <span class="pin-icon">${typeEmoji}</span>
          <span class="pin-price">${priceText}</span>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-div-icon',
        html: customHtml,
        iconSize: [110, 34],
        iconAnchor: [55, 17],
      });

      const marker = L.marker([prop.lat, prop.lng], { icon: customIcon });

      // Popup on marker with preview card
      const popupContent = `
        <div style="font-family: inherit; width: 230px;" class="text-slate-800">
          <img src="${prop.images[0]}" alt="${prop.title}" style="width: 100%; height: 115px; object-fit: cover; border-radius: 10px; margin-bottom: 8px;" />
          <div style="font-weight: 800; font-size: 13px; line-height: 1.3; margin-bottom: 4px;">${prop.title}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${prop.city}, ${prop.district || ''}</div>
          <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid #f1f5f9; padding-top: 6px;">
            <span style="font-weight: 800; font-size: 14px; color: #e11d48;">${priceText}</span>
            <span style="font-size: 11px; font-weight: 700; color: #d97706;">★ ${prop.rating}</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent);

      marker.on('mouseover', () => {
        setHighlightedPropertyId(prop.id);
      });

      marker.on('mouseout', () => {
        setHighlightedPropertyId(null);
      });

      marker.on('click', () => {
        setSelectedProperty(prop);
      });

      layer.addLayer(marker);
    });

    // If country or city is NOT explicitly selected, auto fit bounds
    if (!filters.country && !filters.city && properties.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [properties, highlightedPropertyId, filters.country, filters.city]);

  // Geolocation trigger
  const handleLocateMe = () => {
    if (!navigator.geolocation) {
      showToast('Геолокация не поддерживается вашим браузером');
      return;
    }

    showToast('Определяем ваше местоположение...');
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const map = mapInstanceRef.current;
        if (!map) return;

        map.flyTo([latitude, longitude], 14, { duration: 1.5 });

        // Place or update user location marker
        if (userMarkerRef.current) {
          userMarkerRef.current.setLatLng([latitude, longitude]);
        } else {
          const userIcon = L.divIcon({
            className: 'user-location-marker',
            html: `
              <div class="relative flex items-center justify-center">
                <div class="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg animate-pulse"></div>
                <div class="absolute w-12 h-12 rounded-full bg-blue-400/30 animate-ping"></div>
              </div>
            `,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          });
          userMarkerRef.current = L.marker([latitude, longitude], { icon: userIcon }).addTo(map);
        }

        showToast('Вы находитесь здесь! Показаны ближайшие объекты.');
      },
      (error) => {
        showToast('Не удалось получить доступ к геолокации');
      },
      { timeout: 10000 }
    );
  };

  const handleSelectCountry = (countryName: string) => {
    setFilters(prev => ({
      ...prev,
      country: countryName === prev.country ? '' : countryName,
      city: ''
    }));
  };

  const handleSelectCity = (cityName: string) => {
    setFilters(prev => ({
      ...prev,
      city: cityName === prev.city ? '' : cityName
    }));
  };

  return (
    <div className={`relative w-full h-full min-h-[400px] bg-slate-200 overflow-hidden ${className}`}>
      {/* Map DOM target */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Floating Quick Navigation Bar on top of map */}
      <div className="absolute top-3 left-3 right-3 sm:right-auto z-10 flex flex-col gap-2 pointer-events-auto max-w-full">
        {/* Country Quick Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-[92vw] sm:max-w-2xl scrollbar-none">
          <button
            onClick={() => {
              setFilters(prev => ({ ...prev, country: '', city: '' }));
              mapInstanceRef.current?.setView([48.0, 45.0], 4);
            }}
            className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-md border transition-all cursor-pointer whitespace-nowrap ${
              !filters.country 
                ? 'bg-slate-900 text-white border-slate-900' 
                : 'bg-white/95 hover:bg-white text-slate-800 border-slate-200 backdrop-blur-md'
            }`}
          >
            Все страны ({COUNTRIES_AND_CITIES.length})
          </button>

          {COUNTRIES_AND_CITIES.slice(0, 6).map(country => (
            <button
              key={country.code}
              onClick={() => handleSelectCountry(country.name)}
              className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-md border transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                filters.country === country.name
                  ? 'bg-rose-600 text-white border-rose-600 shadow-rose-600/30'
                  : 'bg-white/95 hover:bg-white text-slate-800 border-slate-200 backdrop-blur-md'
              }`}
            >
              <span>{country.flag}</span>
              <span>{country.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Country's Cities or Popular Cities Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-[92vw] sm:max-w-2xl scrollbar-none">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg shadow-xs border border-slate-200 whitespace-nowrap">
            {filters.country ? `${filters.country}:` : 'Города:'}
          </span>

          {(() => {
            const currentCountryObj = COUNTRIES_AND_CITIES.find(c => c.name === filters.country);
            const citiesToRender = currentCountryObj 
              ? currentCountryObj.cities 
              : [
                  { name: 'Москва', lat: 55.7558, lng: 37.6173 },
                  { name: 'Ереван', lat: 40.1792, lng: 44.4991 },
                  { name: 'Тбилиси', lat: 41.7151, lng: 44.8271 },
                  { name: 'Батуми', lat: 41.6434, lng: 41.6399 },
                  { name: 'Санкт-Петербург', lat: 59.9343, lng: 30.3351 },
                  { name: 'Сочи', lat: 43.5855, lng: 39.7231 },
                  { name: 'Алматы', lat: 43.2389, lng: 76.8897 },
                  { name: 'Дубай', lat: 25.2048, lng: 55.2708 },
                ];

            return citiesToRender.map(city => (
              <button
                key={city.name}
                onClick={() => handleSelectCity(city.name)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-lg shadow-xs border transition-all cursor-pointer whitespace-nowrap ${
                  filters.city === city.name
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white/95 hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {city.name}
              </button>
            ));
          })()}
        </div>
      </div>

      {/* Map Layer Switcher & Tools (Google Map / Satellite / OSM) */}
      <div className="absolute top-4 right-4 z-10 flex flex-col items-end gap-2 pointer-events-auto">
        <div className="relative">
          <button
            onClick={() => setShowLayerMenu(!showLayerMenu)}
            className="flex items-center gap-1.5 px-3 py-2 bg-white/95 hover:bg-white text-slate-800 text-xs font-bold rounded-xl shadow-md border border-slate-200 backdrop-blur-md cursor-pointer transition-all"
            title="Выбрать слой карты (Google Схема, Спутник, OSM)"
          >
            <Layers className="w-4 h-4 text-rose-600" />
            <span className="hidden sm:inline">
              {tileStyle === 'google_roadmap' ? 'Google Схема' : tileStyle === 'google_satellite' ? 'Google Спутник' : 'OpenStreetMap'}
            </span>
          </button>

          {showLayerMenu && (
            <div className="absolute right-0 top-11 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 w-48 space-y-1 z-20 animate-in fade-in zoom-in-95 duration-150">
              <button
                onClick={() => {
                  setTileStyle('google_roadmap');
                  setShowLayerMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                  tileStyle === 'google_roadmap' ? 'bg-rose-50 text-rose-700' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>🗺️ Google Схема</span>
                {tileStyle === 'google_roadmap' && <span className="text-rose-600">✓</span>}
              </button>
              <button
                onClick={() => {
                  setTileStyle('google_satellite');
                  setShowLayerMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                  tileStyle === 'google_satellite' ? 'bg-rose-50 text-rose-700' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>🛰️ Google Спутник</span>
                {tileStyle === 'google_satellite' && <span className="text-rose-600">✓</span>}
              </button>
              <button
                onClick={() => {
                  setTileStyle('osm');
                  setShowLayerMenu(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-bold flex items-center justify-between cursor-pointer ${
                  tileStyle === 'osm' ? 'bg-rose-50 text-rose-700' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <span>🌐 OpenStreetMap</span>
                {tileStyle === 'osm' && <span className="text-rose-600">✓</span>}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Map Zoom & Locate Controls (Google Maps-style bottom-right controls) */}
      <div className="absolute bottom-6 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
        {/* Geolocation Button */}
        <button
          id="btn-locate-me"
          onClick={handleLocateMe}
          title="Мое местоположение"
          className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 rounded-xl shadow-md border border-slate-200 flex items-center justify-center transition-all cursor-pointer active:scale-95"
        >
          <Locate className="w-5 h-5" />
        </button>

        {/* Zoom controls */}
        <div className="bg-white rounded-xl shadow-md border border-slate-200 overflow-hidden flex flex-col">
          <button
            onClick={() => mapInstanceRef.current?.zoomIn()}
            className="w-10 h-10 hover:bg-slate-50 text-slate-700 flex items-center justify-center border-b border-slate-100 cursor-pointer"
            title="Приблизить"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button
            onClick={() => mapInstanceRef.current?.zoomOut()}
            className="w-10 h-10 hover:bg-slate-50 text-slate-700 flex items-center justify-center cursor-pointer"
            title="Отдалить"
          >
            <Minus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live count overlay badge */}
      <div className="absolute bottom-6 left-4 z-10 bg-slate-900/90 backdrop-blur-md text-white text-xs px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 border border-slate-700">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>
          {filters.city 
            ? `Свободно в г. ${filters.city}: ` 
            : filters.country 
            ? `Свободно в стране ${filters.country}: ` 
            : 'Доступно на карте: '}
          <strong className="font-extrabold text-emerald-300">{properties.length}</strong> объектов
        </span>
      </div>

    </div>
  );
};
