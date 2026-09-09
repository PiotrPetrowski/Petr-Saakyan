import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Locate, Plus, Minus, Navigation, Layers } from 'lucide-react';
import { Property } from '../types';
import { useApp } from '../context/AppContext';

interface InteractiveMapProps {
  properties: Property[];
  className?: string;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ properties, className = '' }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const { 
    setSelectedProperty, 
    highlightedPropertyId, 
    setHighlightedPropertyId,
    showToast 
  } = useApp();

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Default center to Moscow
    const initialLat = 55.7558;
    const initialLng = 37.6173;

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 11,
      zoomControl: false,
    });

    // Clean, modern OpenStreetMap CartoDB Positron / OSM tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map);

    const markersLayer = L.layerGroup().addTo(map);
    markersLayerRef.current = markersLayer;
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

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

      // Custom HTML Marker Element
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
        <div style="font-family: inherit; width: 220px;" class="text-slate-800">
          <img src="${prop.images[0]}" alt="${prop.title}" style="width: 100%; height: 110px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
          <div style="font-weight: 700; font-size: 13px; line-height: 1.2; margin-bottom: 4px;">${prop.title}</div>
          <div style="font-size: 11px; color: #64748b; margin-bottom: 6px;">${prop.city}, ${prop.district}</div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 800; font-size: 14px; color: #e11d48;">${priceText}</span>
            <span style="font-size: 11px; font-weight: 600;">★ ${prop.rating}</span>
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

    // If properties exist and bounds are valid, fit bounds
    if (properties.length > 0 && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 14 });
    }
  }, [properties, highlightedPropertyId]);

  // Handle container resize when viewMode changes
  useEffect(() => {
    const timer = setTimeout(() => {
      mapInstanceRef.current?.invalidateSize();
    }, 200);
    return () => clearTimeout(timer);
  }, [className]);

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
                <div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg animate-pulse"></div>
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

  const flyToCity = (lat: number, lng: number, zoom: number = 12) => {
    mapInstanceRef.current?.flyTo([lat, lng], zoom, { duration: 1.2 });
  };

  return (
    <div className={`relative w-full h-full min-h-[350px] bg-slate-100 overflow-hidden ${className}`}>
      {/* Map DOM target */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Quick city navigation chips floating on top */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 flex-wrap pointer-events-auto">
        <span className="text-[11px] font-bold text-slate-700 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg shadow-sm border border-slate-200">
          Города:
        </span>
        <button
          onClick={() => flyToCity(55.7558, 37.6173)}
          className="text-xs font-semibold bg-white/95 hover:bg-slate-50 text-slate-800 px-3 py-1 rounded-lg shadow-sm border border-slate-200 transition-transform active:scale-95 cursor-pointer"
        >
          Москва
        </button>
        <button
          onClick={() => flyToCity(59.9343, 30.3351)}
          className="text-xs font-semibold bg-white/95 hover:bg-slate-50 text-slate-800 px-3 py-1 rounded-lg shadow-sm border border-slate-200 transition-transform active:scale-95 cursor-pointer"
        >
          Санкт-Петербург
        </button>
        <button
          onClick={() => flyToCity(43.5855, 39.7231)}
          className="text-xs font-semibold bg-white/95 hover:bg-slate-50 text-slate-800 px-3 py-1 rounded-lg shadow-sm border border-slate-200 transition-transform active:scale-95 cursor-pointer"
        >
          Сочи
        </button>
        <button
          onClick={() => flyToCity(55.7963, 49.1088)}
          className="text-xs font-semibold bg-white/95 hover:bg-slate-50 text-slate-800 px-3 py-1 rounded-lg shadow-sm border border-slate-200 transition-transform active:scale-95 cursor-pointer"
        >
          Казань
        </button>
      </div>

      {/* Map Control buttons: Zoom & Geolocation */}
      <div className="absolute bottom-6 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
        
        {/* Geolocation Button */}
        <button
          id="btn-locate-me"
          onClick={handleLocateMe}
          title="Мое местоположение"
          className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-700 hover:text-blue-600 rounded-xl shadow-md border border-slate-200 flex items-center justify-center transition-all cursor-pointer"
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
      <div className="absolute bottom-6 left-4 z-10 bg-slate-900/85 backdrop-blur-md text-white text-xs px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-slate-700/50">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Доступно на карте: <strong className="font-bold">{properties.length}</strong> объектов</span>
      </div>

    </div>
  );
};
