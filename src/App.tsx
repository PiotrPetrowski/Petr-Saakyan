import React, { useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { InteractiveMap } from './components/InteractiveMap';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { AuthModal } from './components/AuthModal';
import { PasswordRecoveryModal } from './components/PasswordRecoveryModal';
import { AddListingModal } from './components/AddListingModal';
import { ProfileCabinetModal } from './components/ProfileCabinetModal';
import { ChatModal } from './components/ChatModal';
import { SafePaymentModal } from './components/SafePaymentModal';
import { ReviewModal } from './components/ReviewModal';
import { 
  Building2, 
  Map as MapIcon, 
  List, 
  RotateCcw, 
  ShieldCheck, 
  Sparkles,
  CheckCircle2
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    properties, 
    filters, 
    resetFilters, 
    viewMode, 
    setViewMode, 
    toastMessage,
    setIsAddListingOpen,
    user,
    setIsAuthModalOpen 
  } = useApp();

  // Filter and sort properties
  const filteredProperties = useMemo(() => {
    return properties.filter((prop) => {
      // 1. Text Query
      if (filters.query) {
        const q = filters.query.toLowerCase();
        const matchTitle = prop.title.toLowerCase().includes(q);
        const matchCity = prop.city.toLowerCase().includes(q);
        const matchDistrict = prop.district.toLowerCase().includes(q);
        const matchAddress = prop.address.toLowerCase().includes(q);
        const matchDesc = prop.description.toLowerCase().includes(q);
        if (!matchTitle && !matchCity && !matchDistrict && !matchAddress && !matchDesc) {
          return false;
        }
      }

      // 2. City
      if (filters.city && prop.city !== filters.city) {
        return false;
      }

      // 3. Rent Mode (daily vs monthly)
      if (filters.rentMode === 'daily') {
        if (prop.rentMode !== 'daily' && prop.rentMode !== 'both') return false;
      } else if (filters.rentMode === 'monthly') {
        if (prop.rentMode !== 'monthly' && prop.rentMode !== 'both') return false;
      }

      // 4. Property Type (apartment, house, hotel)
      if (filters.propertyType !== 'all' && prop.type !== filters.propertyType) {
        return false;
      }

      // 5. Price
      const comparePrice = filters.rentMode === 'monthly' ? prop.priceMonthly : prop.priceDaily;
      if (comparePrice < filters.minPrice || comparePrice > filters.maxPrice) {
        return false;
      }

      // 6. Guests
      if (prop.maxGuests < filters.guests) {
        return false;
      }

      // 7. Amenities
      if (filters.amenities.length > 0) {
        const hasAll = filters.amenities.every((a) => prop.amenities.includes(a));
        if (!hasAll) return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price_asc') {
        const priceA = filters.rentMode === 'monthly' ? a.priceMonthly : a.priceDaily;
        const priceB = filters.rentMode === 'monthly' ? b.priceMonthly : b.priceDaily;
        return priceA - priceB;
      }
      if (filters.sortBy === 'price_desc') {
        const priceA = filters.rentMode === 'monthly' ? a.priceMonthly : a.priceDaily;
        const priceB = filters.rentMode === 'monthly' ? b.priceMonthly : b.priceDaily;
        return priceB - priceA;
      }
      if (filters.sortBy === 'rating') {
        return b.rating - a.rating;
      }
      // 'popular'
      return (b.reviewsCount * b.rating) - (a.reviewsCount * a.rating);
    });
  }, [properties, filters]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      
      {/* Toast alert popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-bottom-5 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Navigation Header */}
      <Navbar />

      {/* Filter and Search Bar */}
      <FilterBar />

      {/* Main Content Layout */}
      <main className="flex-1 flex flex-col">
        
        {/* VIEW 1: Split View (Map on right/top, listings on left) */}
        {viewMode === 'split' && (
          <div className="flex-1 flex flex-col lg:flex-row h-[calc(100vh-125px)] overflow-hidden">
            
            {/* Left listings scroll area */}
            <div className="w-full lg:w-7/12 h-full overflow-y-auto p-4 sm:p-6 border-r border-slate-200">
              
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-slate-800">
                  Найдено объектов: <strong className="text-rose-600 font-extrabold">{filteredProperties.length}</strong>
                </h2>
                <span className="text-xs text-slate-500">
                  {filters.rentMode === 'daily' ? 'Посуточная аренда' : filters.rentMode === 'monthly' ? 'Помесячная аренда' : 'Все форматы аренды'}
                </span>
              </div>

              {filteredProperties.length === 0 ? (
                <div className="py-16 text-center space-y-3">
                  <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-bold text-slate-800">Объектов по вашему запросу не найдено</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Попробуйте расширить диапазон цен, выбрать другой город или сбросить фильтры.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Сбросить все фильтры</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredProperties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop} />
                  ))}
                </div>
              )}

            </div>

            {/* Right Interactive Leaflet OpenStreetMap */}
            <div className="w-full lg:w-5/12 h-72 lg:h-full shrink-0">
              <InteractiveMap properties={filteredProperties} className="h-full" />
            </div>

          </div>
        )}

        {/* VIEW 2: Grid Only (Full width grid) */}
        {viewMode === 'grid' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold text-slate-900">
                Каталог жилья в аренду (<span className="text-rose-600 font-extrabold">{filteredProperties.length}</span> доступно)
              </h2>
              <button
                onClick={() => setViewMode('split')}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1"
              >
                <MapIcon className="w-4 h-4" />
                <span>Открыть карту</span>
              </button>
            </div>

            {filteredProperties.length === 0 ? (
              <div className="py-20 text-center space-y-3 bg-white rounded-3xl border border-slate-200 p-8">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">Объектов не найдено</h3>
                <p className="text-xs text-slate-500">Попробуйте изменить параметры поиска или очистить фильтры.</p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer"
                >
                  Сбросить фильтры
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {filteredProperties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: Full Map View */}
        {viewMode === 'map' && (
          <div className="relative flex-1 w-full h-[calc(100vh-125px)]">
            <InteractiveMap properties={filteredProperties} className="w-full h-full" />
          </div>
        )}

      </main>

      {/* Floating mobile toggle button between Map and List */}
      <div className="sm:hidden fixed bottom-6 left-1/2 -translate-x-1/2 z-30">
        <button
          onClick={() => setViewMode(viewMode === 'map' ? 'split' : 'map')}
          className="bg-slate-900/95 hover:bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-bold cursor-pointer transition-transform active:scale-95"
        >
          {viewMode === 'map' ? (
            <>
              <List className="w-4 h-4" />
              <span>Показать список</span>
            </>
          ) : (
            <>
              <MapIcon className="w-4 h-4" />
              <span>Показать карту ({filteredProperties.length})</span>
            </>
          )}
        </button>
      </div>

      {/* All Application Modals */}
      <PropertyDetailModal />
      <AuthModal />
      <PasswordRecoveryModal />
      <AddListingModal />
      <ProfileCabinetModal />
      <ChatModal />
      <SafePaymentModal />
      <ReviewModal />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
