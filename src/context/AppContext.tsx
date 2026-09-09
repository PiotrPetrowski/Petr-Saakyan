import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Property, ReviewItem, UserProfile, Booking, ChatThread, ChatMessage, SearchFilters, RentMode, AppLanguage 
} from '../types';
import { 
  INITIAL_USER, INITIAL_PROPERTIES, INITIAL_REVIEWS, INITIAL_THREADS, INITIAL_MESSAGES, INITIAL_BOOKINGS 
} from '../data/mockData';
import { TRANSLATIONS, Translations } from '../i18n/translations';

interface AppContextType {
  user: UserProfile | null;
  properties: Property[];
  reviews: ReviewItem[];
  bookings: Booking[];
  threads: ChatThread[];
  messages: Record<string, ChatMessage[]>;
  filters: SearchFilters;
  
  // Internationalization
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  t: (key: keyof Translations) => string;
  translations: Translations;
  
  // UI states
  selectedProperty: Property | null;
  setSelectedProperty: (prop: Property | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalTab: 'login' | 'register';
  setAuthModalTab: (tab: 'login' | 'register') => void;
  isPasswordRecoveryOpen: boolean;
  setIsPasswordRecoveryOpen: (open: boolean) => void;
  isAddListingOpen: boolean;
  setIsAddListingOpen: (open: boolean) => void;
  isProfileOpen: boolean;
  setIsProfileOpen: (open: boolean) => void;
  profileTab: 'profile' | 'listings' | 'tenant_bookings' | 'host_bookings' | 'favorites' | 'settings' | 'chat';
  setProfileTab: (tab: 'profile' | 'listings' | 'tenant_bookings' | 'host_bookings' | 'favorites' | 'settings' | 'chat') => void;
  isObjectsDrawerOpen: boolean;
  setIsObjectsDrawerOpen: (open: boolean) => void;
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
  activeThreadId: string | null;
  setActiveThreadId: (id: string | null) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  bookingProperty: Property | null;
  setBookingProperty: (prop: Property | null) => void;
  bookingDraft: {
    checkIn: string;
    checkOut: string;
    rentMode: 'daily' | 'monthly';
    duration: number;
    guests: number;
  } | null;
  setBookingDraft: (draft: any) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;
  reviewingProperty: Property | null;
  setReviewingProperty: (prop: Property | null) => void;
  viewMode: 'split' | 'grid' | 'map';
  setViewMode: (mode: 'split' | 'grid' | 'map') => void;
  highlightedPropertyId: string | null;
  setHighlightedPropertyId: (id: string | null) => void;
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Actions
  login: (provider: 'email' | 'google' | 'telegram' | 'vk' | 'github', email?: string, name?: string) => void;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  updateSettings: (settings: Partial<UserProfile['settings']>) => void;
  recoverPassword: (emailOrPhone: string, newPass: string) => boolean;
  toggleFavorite: (propertyId: string) => void;
  addProperty: (propertyData: Omit<Property, 'id' | 'createdAt' | 'rating' | 'reviewsCount' | 'host' | 'isAvailable'>) => Property;
  deleteProperty: (propertyId: string) => void;
  createBooking: (details: {
    checkIn: string;
    checkOut: string;
    rentMode: 'daily' | 'monthly';
    durationCount: number;
    guestsCount: number;
    totalPrice: number;
    deposit: number;
    paymentMethod: string;
    last4: string;
  }) => Booking;
  addReview: (data: {
    propertyId: string;
    rating: number;
    comment: string;
    cleanliness: number;
    location: number;
    value: number;
    communication: number;
  }) => void;
  sendMessage: (threadId: string, text: string) => void;
  openChatWithHost: (property: Property) => void;
  setFilters: React.Dispatch<React.SetStateAction<SearchFilters>>;
  resetFilters: () => void;
}

const defaultFilters: SearchFilters = {
  query: '',
  country: '',
  city: '',
  rentMode: 'all',
  propertyType: 'all',
  minPrice: 0,
  maxPrice: 300000,
  guests: 1,
  amenities: [],
  sortBy: 'popular',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('rent_app_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('rent_app_properties_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_PROPERTIES.length) {
          return parsed;
        }
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_PROPERTIES;
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('rent_app_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('rent_app_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('rent_app_threads');
    return saved ? JSON.parse(saved) : INITIAL_THREADS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('rent_app_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);

  // Internationalization state
  const [language, setLanguageState] = useState<AppLanguage>(() => {
    const saved = localStorage.getItem('rent_app_lang') as AppLanguage;
    if (saved && (saved === 'ru' || saved === 'en' || saved === 'hy' || saved === 'ka')) {
      return saved;
    }
    return (user?.settings?.language as AppLanguage) || 'ru';
  });

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
    localStorage.setItem('rent_app_lang', lang);
  };

  const translations = TRANSLATIONS[language] || TRANSLATIONS.ru;
  const t = (key: keyof Translations): string => {
    return translations[key] || TRANSLATIONS.ru[key] || key;
  };

  // UI state
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<'login' | 'register'>('login');
  const [isPasswordRecoveryOpen, setIsPasswordRecoveryOpen] = useState(false);
  const [isAddListingOpen, setIsAddListingOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [profileTab, setProfileTab] = useState<'profile' | 'listings' | 'tenant_bookings' | 'host_bookings' | 'favorites' | 'settings' | 'chat'>('profile');
  const [isObjectsDrawerOpen, setIsObjectsDrawerOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [bookingProperty, setBookingProperty] = useState<Property | null>(null);
  const [bookingDraft, setBookingDraft] = useState<any>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewingProperty, setReviewingProperty] = useState<Property | null>(null);
  const [viewMode, setViewMode] = useState<'split' | 'grid' | 'map'>('map');
  const [highlightedPropertyId, setHighlightedPropertyId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Sync to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('rent_app_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('rent_app_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('rent_app_properties_v3', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('rent_app_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('rent_app_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('rent_app_threads', JSON.stringify(threads));
  }, [threads]);

  useEffect(() => {
    localStorage.setItem('rent_app_messages', JSON.stringify(messages));
  }, [messages]);

  // Auth actions
  const login = (provider: 'email' | 'google' | 'telegram' | 'vk' | 'github', email?: string, name?: string) => {
    const providerNames: Record<string, string> = {
      google: 'Google Аккаунт',
      telegram: 'Telegram Пользователь',
      vk: 'ВКонтакте ID',
      github: 'GitHub Developer',
      email: name || 'Пользователь платформы',
    };

    const providerAvatars: Record<string, string> = {
      google: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      telegram: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80',
      vk: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      github: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      email: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    };

    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name || providerNames[provider] || 'Новый пользователь',
      email: email || `${provider}.user@rent-app.ru`,
      phone: '+7 (999) 000-11-22',
      avatar: providerAvatars[provider] || INITIAL_USER.avatar,
      provider,
      role: 'both',
      bio: 'Путешественник и гость платформы',
      isVerified: true,
      favorites: [],
      createdAt: new Date().toISOString().split('T')[0],
    };

    setUser(newUser);
    setIsAuthModalOpen(false);
    showToast(`Успешный вход через ${provider === 'email' ? 'Email' : provider.toUpperCase()}!`);
  };

  const logout = () => {
    setUser(null);
    showToast('Вы вышли из профиля');
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    if (!user) return;
    setUser({ ...user, ...updated });
    showToast('Профиль успешно обновлен');
  };

  const updateSettings = (newSettings: Partial<UserProfile['settings']>) => {
    if (!user) return;
    const currentSettings = user.settings || {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: true,
      marketingEmails: false,
      twoFactorAuth: false,
      currency: 'RUB',
      language: 'ru',
      hidePhoneUntilBooking: true,
      payoutCardNumber: '',
      payoutPhoneSbp: ''
    };
    const updated = {
      ...user,
      settings: {
        ...currentSettings,
        ...newSettings
      }
    };
    setUser(updated);
    showToast('Настройки успешно сохранены');
  };

  const recoverPassword = (emailOrPhone: string, newPass: string): boolean => {
    if (user && (user.email === emailOrPhone || user.phone === emailOrPhone)) {
      showToast('Пароль успешно изменен! Вы можете войти с новыми данными.');
      return true;
    }
    showToast('Новый пароль успешно установлен для ' + emailOrPhone);
    return true;
  };

  const toggleFavorite = (propertyId: string) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }
    const isFav = user.favorites.includes(propertyId);
    const updated = isFav 
      ? user.favorites.filter(id => id !== propertyId)
      : [...user.favorites, propertyId];
    
    setUser({ ...user, favorites: updated });
    showToast(isFav ? 'Удалено из избранного' : 'Добавлено в избранное ❤️');
  };

  const addProperty = (
    propertyData: Omit<Property, 'id' | 'createdAt' | 'rating' | 'reviewsCount' | 'host' | 'isAvailable'>
  ): Property => {
    const hostInfo = user ? {
      id: user.id,
      name: user.name,
      avatar: user.avatar,
      phone: user.phone || '+7 (999) 111-22-33',
      rating: 5.0,
      reviewsCount: 0,
      isSuperhost: true,
      joinedDate: 'Недавно',
      responseRate: '100% мгновенно'
    } : {
      id: 'demo-host',
      name: 'Владелец объекта',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      phone: '+7 (999) 111-22-33',
      rating: 5.0,
      reviewsCount: 0,
      isSuperhost: true,
      joinedDate: 'Сегодня',
      responseRate: '100% мгновенно'
    };

    const newProp: Property = {
      ...propertyData,
      id: `prop-${Date.now()}`,
      host: hostInfo,
      rating: 5.0,
      reviewsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      isAvailable: true
    };

    setProperties(prev => [newProp, ...prev]);
    showToast('Объявление успешно опубликовано и доступно на карте!');
    return newProp;
  };

  const deleteProperty = (propertyId: string) => {
    setProperties(prev => prev.filter(p => p.id !== propertyId));
    showToast('Объявление удалено');
  };

  const createBooking = (details: {
    checkIn: string;
    checkOut: string;
    rentMode: 'daily' | 'monthly';
    durationCount: number;
    guestsCount: number;
    totalPrice: number;
    deposit: number;
    paymentMethod: string;
    last4: string;
  }): Booking => {
    if (!bookingProperty) throw new Error('No property selected');
    
    const newBooking: Booking = {
      id: `book-${Date.now()}`,
      propertyId: bookingProperty.id,
      propertyTitle: bookingProperty.title,
      propertyImage: bookingProperty.images[0],
      propertyCity: bookingProperty.city,
      propertyAddress: bookingProperty.address,
      tenantId: user?.id || 'guest-user',
      tenantName: user?.name || 'Гость',
      landlordId: bookingProperty.host.id,
      checkIn: details.checkIn,
      checkOut: details.checkOut,
      rentMode: details.rentMode,
      durationCount: details.durationCount,
      pricePerUnit: details.rentMode === 'daily' ? bookingProperty.priceDaily : bookingProperty.priceMonthly,
      totalPrice: details.totalPrice,
      deposit: details.deposit,
      serviceFee: 0,
      status: 'confirmed',
      paymentStatus: 'held_in_escrow',
      paymentMethod: details.paymentMethod,
      last4: details.last4,
      guestsCount: details.guestsCount,
      createdAt: new Date().toISOString().split('T')[0],
      reviewed: false,
    };

    setBookings(prev => [newBooking, ...prev]);

    // Send automated notification in chat thread
    openChatWithHost(bookingProperty);
    setTimeout(() => {
      if (bookingProperty) {
        const thread = threads.find(t => t.propertyId === bookingProperty.id);
        const threadId = thread ? thread.id : `thread-${Date.now()}`;
        sendMessage(threadId, `🎉 Новое бронирование подтверждено! Даты: ${details.checkIn} — ${details.checkOut}. Оплата заморожена в системе «Безопасная сделка».`);
      }
    }, 500);

    showToast('Оплата успешно проведена! Бронирование подтверждено.');
    return newBooking;
  };

  const addReview = (data: {
    propertyId: string;
    rating: number;
    comment: string;
    cleanliness: number;
    location: number;
    value: number;
    communication: number;
  }) => {
    const newReview: ReviewItem = {
      id: `rev-${Date.now()}`,
      propertyId: data.propertyId,
      authorId: user?.id || 'anon-guest',
      authorName: user?.name || 'Анонимный гость',
      authorAvatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      rating: data.rating,
      comment: data.comment,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      cleanliness: data.cleanliness,
      location: data.location,
      value: data.value,
      communication: data.communication,
    };

    setReviews(prev => [newReview, ...prev]);

    // Update property rating & reviewsCount
    setProperties(prev => prev.map(p => {
      if (p.id === data.propertyId) {
        const propReviews = [...reviews.filter(r => r.propertyId === p.id), newReview];
        const avg = propReviews.reduce((acc, r) => acc + r.rating, 0) / propReviews.length;
        return {
          ...p,
          rating: Number(avg.toFixed(2)),
          reviewsCount: propReviews.length
        };
      }
      return p;
    }));

    // Mark booking as reviewed if matching
    setBookings(prev => prev.map(b => b.propertyId === data.propertyId ? { ...b, reviewed: true } : b));

    showToast('Спасибо! Ваш отзыв опубликован.');
  };

  const sendMessage = (threadId: string, text: string) => {
    const sender = user || INITIAL_USER;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      threadId,
      senderId: sender.id,
      senderName: sender.name,
      senderAvatar: sender.avatar,
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [threadId]: [...(prev[threadId] || []), newMsg]
    }));

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          lastMessage: text,
          lastMessageTime: newMsg.timestamp,
        };
      }
      return t;
    }));

    // Auto-respond from host if sender is tenant
    const thread = threads.find(t => t.id === threadId);
    if (thread && thread.landlordId !== sender.id) {
      setTimeout(() => {
        const responses = [
          'Здравствуйте! Спасибо за сообщение, отвечу вам в течение пары минут.',
          'Добрый день! Все подробности по заселению актуальны, ключи можно забрать на месте.',
          'Приветствую! Да, конечно, с радостью примем вас. Если нужны рекомендации по ресторанам рядом — с удовольствием поделюсь!',
          'Здравствуйте! Оплата через сервис полностью защищена, буду рад ответить на любые дополнительные вопросы.'
        ];
        const randomResp = responses[Math.floor(Math.random() * responses.length)];
        const hostMsg: ChatMessage = {
          id: `msg-host-${Date.now()}`,
          threadId,
          senderId: thread.landlordId,
          senderName: thread.landlordName,
          senderAvatar: thread.landlordAvatar,
          text: randomResp,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessages(curr => ({
          ...curr,
          [threadId]: [...(curr[threadId] || []), hostMsg]
        }));

        setThreads(curr => curr.map(t => {
          if (t.id === threadId) {
            return {
              ...t,
              lastMessage: randomResp,
              lastMessageTime: hostMsg.timestamp,
              unreadCountTenant: (t.unreadCountTenant || 0) + 1
            };
          }
          return t;
        }));
      }, 1200);
    }
  };

  const openChatWithHost = (property: Property) => {
    if (!user) {
      setIsAuthModalOpen(true);
      return;
    }

    let existing = threads.find(t => t.propertyId === property.id && t.tenantId === user.id);
    if (!existing) {
      const newThreadId = `thread-${Date.now()}`;
      const newThread: ChatThread = {
        id: newThreadId,
        propertyId: property.id,
        propertyTitle: property.title,
        propertyImage: property.images[0],
        landlordId: property.host.id,
        landlordName: property.host.name,
        landlordAvatar: property.host.avatar,
        tenantId: user.id,
        tenantName: user.name,
        tenantAvatar: user.avatar,
        lastMessage: 'Начат диалог с владельцем жилья',
        lastMessageTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        unreadCountTenant: 0,
        unreadCountLandlord: 0
      };

      setThreads(prev => [newThread, ...prev]);
      setActiveThreadId(newThreadId);
    } else {
      setActiveThreadId(existing.id);
    }

    setIsProfileOpen(true);
    setProfileTab('chat');
    setIsChatOpen(true);
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return (
    <AppContext.Provider value={{
      user,
      properties,
      reviews,
      bookings,
      threads,
      messages,
      filters,
      language,
      setLanguage,
      t,
      translations,
      selectedProperty,
      setSelectedProperty,
      isAuthModalOpen,
      setIsAuthModalOpen,
      authModalTab,
      setAuthModalTab,
      isPasswordRecoveryOpen,
      setIsPasswordRecoveryOpen,
      isAddListingOpen,
      setIsAddListingOpen,
      isProfileOpen,
      setIsProfileOpen,
      profileTab,
      setProfileTab,
      isObjectsDrawerOpen,
      setIsObjectsDrawerOpen,
      isChatOpen,
      setIsChatOpen,
      activeThreadId,
      setActiveThreadId,
      isPaymentModalOpen,
      setIsPaymentModalOpen,
      bookingProperty,
      setBookingProperty,
      bookingDraft,
      setBookingDraft,
      isReviewModalOpen,
      setIsReviewModalOpen,
      reviewingProperty,
      setReviewingProperty,
      viewMode,
      setViewMode,
      highlightedPropertyId,
      setHighlightedPropertyId,
      toastMessage,
      showToast,
      login,
      logout,
      updateProfile,
      updateSettings,
      recoverPassword,
      toggleFavorite,
      addProperty,
      deleteProperty,
      createBooking,
      addReview,
      sendMessage,
      openChatWithHost,
      setFilters,
      resetFilters
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
