import React, { useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { FilterBar } from './components/FilterBar';
import { InteractiveMap } from './components/InteractiveMap';
import { ObjectsDrawer } from './components/ObjectsDrawer';
import { Footer } from './components/Footer';
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
  RotateCcw, 
  ShieldCheck, 
  CheckCircle2
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    properties, 
    filters, 
    resetFilters, 
    toastMessage,
    isObjectsDrawerOpen,
    setIsObjectsDrawerOpen
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

      // 2. Country
      if (filters.country && prop.country && prop.country !== filters.country) {
        return false;
      }

      // 3. City
      if (filters.city && prop.city !== filters.city) {
        return false;
      }

      // 4. Rent Mode (daily vs monthly)
      if (filters.rentMode === 'daily') {
        if (prop.rentMode !== 'daily' && prop.rentMode !== 'both') return false;
      } else if (filters.rentMode === 'monthly') {
        if (prop.rentMode !== 'monthly' && prop.rentMode !== 'both') return false;
      }

      // 5. Property Type (apartment, house, hotel)
      if (filters.propertyType !== 'all' && prop.type !== filters.propertyType) {
        return false;
      }

      // 6. Price
      const comparePrice = filters.rentMode === 'monthly' ? prop.priceMonthly : prop.priceDaily;
      if (comparePrice < filters.minPrice || comparePrice > filters.maxPrice) {
        return false;
      }

      // 7. Guests
      if (prop.maxGuests < filters.guests) {
        return false;
      }

      // 8. Amenities
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

      {/* Filter and Search Bar with Country, City, and Objects toggle */}
      <FilterBar />

      {/* Main Content Layout: MAP-ONLY as requested, with Objects Drawer right beside search */}
      <main className="relative flex-1 flex flex-col h-[calc(100vh-130px)] min-h-[520px] overflow-hidden">
        
        {/* Full interactive map showing live coordinates */}
        <InteractiveMap properties={filteredProperties} className="w-full h-full" />

        {/* Objects list panel placed right next to search */}
        <ObjectsDrawer properties={filteredProperties} />

      </main>

      {/* Mobile Floating quick button to toggle objects near search */}
      <div className="sm:hidden fixed bottom-5 left-1/2 -translate-x-1/2 z-30">
        <button
          id="btn-mobile-toggle-objects"
          onClick={() => setIsObjectsDrawerOpen(!isObjectsDrawerOpen)}
          className="bg-slate-900/95 hover:bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl backdrop-blur-md flex items-center gap-2 text-xs font-bold cursor-pointer transition-transform active:scale-95 border border-slate-700"
        >
          <Building2 className="w-4 h-4 text-rose-400" />
          <span>{isObjectsDrawerOpen ? 'Скрыть объекты' : `Все объекты (${filteredProperties.length})`}</span>
        </button>
      </div>

      {/* Platform Footer */}
      <Footer />

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
