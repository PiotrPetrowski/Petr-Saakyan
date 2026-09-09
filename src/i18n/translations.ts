import { AppLanguage } from '../types';

export interface Translations {
  appName: string;
  appSlogan: string;
  safeDealHeader: string;
  allObjects: string;
  allCountries: string;
  allCities: string;
  citiesInCountry: string;
  searchPlaceholder: string;
  allFormats: string;
  daily: string;
  monthly: string;
  allTypes: string;
  apartments: string;
  houses: string;
  hotels: string;
  filters: string;
  resetFilters: string;
  sortPopular: string;
  sortPriceAsc: string;
  sortPriceDesc: string;
  sortRating: string;
  mapRoadmap: string;
  mapSatellite: string;
  mapOSM: string;
  mapLayerTitle: string;
  locateMe: string;
  availableOnMap: string;
  objectsNearSearch: string;
  clickToInspect: string;
  collapseToMap: string;
  perDay: string;
  perMonth: string;
  rooms: string;
  guestsUpTo: string;
  viewDetails: string;
  noObjectsFound: string;
  noObjectsDesc: string;
  bookNow: string;
  writeToHost: string;
  superhost: string;
  instantBook: string;
  safetyGuarantee: string;
  myProfile: string;
  myListings: string;
  myTrips: string;
  earningsAndBookings: string;
  favorites: string;
  messagesAndChat: string;
  settings: string;
  listProperty: string;
  saveSettings: string;
  profileSettingsListTitle: string;
  personalDataSection: string;
  fullName: string;
  email: string;
  phone: string;
  aboutMe: string;
  languageSection: string;
  currencySection: string;
  notificationsSection: string;
  emailNotif: string;
  pushNotif: string;
  smsNotif: string;
  payoutSection: string;
  payoutCard: string;
  payoutSbp: string;
  payoutNotice: string;
  securitySection: string;
  twoFactor: string;
  hidePhoneBeforeBook: string;
  changePassword: string;
  terminateOtherSessions: string;
  chatPlaceholder: string;
  send: string;
  login: string;
  logout: string;
  quickCities: string;
}

export const TRANSLATIONS: Record<AppLanguage, Translations> = {
  ru: {
    appName: 'АрендаЖилья',
    appSlogan: 'Посуточная и помесячная аренда',
    safeDealHeader: 'Безопасная сделка: 100% защита платежей до заселения',
    allObjects: 'Все объекты',
    allCountries: 'Все страны',
    allCities: 'Все города',
    citiesInCountry: 'Все города страны',
    searchPlaceholder: 'Поиск по городу, адресу или названию...',
    allFormats: 'Все форматы',
    daily: 'Посуточно',
    monthly: 'Помесячно',
    allTypes: 'Все типы',
    apartments: 'Квартиры',
    houses: 'Дома',
    hotels: 'Отели',
    filters: 'Фильтры',
    resetFilters: 'Сбросить',
    sortPopular: 'По популярности',
    sortPriceAsc: 'Сначала дешевле',
    sortPriceDesc: 'Сначала дороже',
    sortRating: 'По рейтингу',
    mapRoadmap: 'Гугл Схема',
    mapSatellite: 'Гугл Спутник',
    mapOSM: 'OpenStreetMap',
    mapLayerTitle: 'Слой карты',
    locateMe: 'Мое местоположение',
    availableOnMap: 'Доступно на карте',
    objectsNearSearch: 'Объекты рядом с поиском',
    clickToInspect: 'Кликните по объекту для подробностей',
    collapseToMap: 'Свернуть на карту',
    perDay: 'сут',
    perMonth: 'мес',
    rooms: 'комн.',
    guestsUpTo: 'до',
    viewDetails: 'Смотреть',
    noObjectsFound: 'Объектов не найдено',
    noObjectsDesc: 'Попробуйте изменить параметры поиска или сбросить фильтры.',
    bookNow: 'Забронировать',
    writeToHost: 'Написать владельцу',
    superhost: 'Суперхозяин',
    instantBook: 'Мгновенная бронь',
    safetyGuarantee: 'Гарантия безопасности: деньги переводятся хозяину только после заселения.',
    myProfile: 'Мой профиль',
    myListings: 'Мои объявления',
    myTrips: 'Мои поездки',
    earningsAndBookings: 'Доходы и брони',
    favorites: 'Избранное',
    messagesAndChat: 'Сообщения и чаты',
    settings: 'Настройки',
    listProperty: 'Сдать жилье',
    saveSettings: 'Сохранить настройки',
    profileSettingsListTitle: 'Настройки аккаунта',
    personalDataSection: 'Личные данные',
    fullName: 'ФИО / Имя',
    email: 'Электронная почта',
    phone: 'Номер телефона',
    aboutMe: 'О себе',
    languageSection: 'Язык приложения',
    currencySection: 'Валюта расчетов',
    notificationsSection: 'Уведомления',
    emailNotif: 'Email-уведомления о бронированиях',
    pushNotif: 'Push-уведомления в браузере',
    smsNotif: 'SMS-уведомления о статусе оплаты',
    payoutSection: 'Реквизиты для выплат (Безопасная сделка)',
    payoutCard: 'Номер карты для зачисления',
    payoutSbp: 'Телефон для СБП выплат',
    payoutNotice: 'Выплаты переводятся автоматически в день успешного заселения гостя.',
    securitySection: 'Безопасность и вход',
    twoFactor: 'Двухфакторная аутентификация (2FA)',
    hidePhoneBeforeBook: 'Скрывать телефон до подтверждения брони',
    changePassword: 'Сменить пароль',
    terminateOtherSessions: 'Завершить все другие сеансы',
    chatPlaceholder: 'Напишите сообщение хозяину...',
    send: 'Отправить',
    login: 'Войти',
    logout: 'Выйти',
    quickCities: 'Города'
  },
  en: {
    appName: 'RentHomes',
    appSlogan: 'Daily and monthly rentals',
    safeDealHeader: 'Safe Deal: 100% payment protection until check-in',
    allObjects: 'All properties',
    allCountries: 'All countries',
    allCities: 'All cities',
    citiesInCountry: 'All cities in country',
    searchPlaceholder: 'Search by city, address or title...',
    allFormats: 'All formats',
    daily: 'Daily',
    monthly: 'Monthly',
    allTypes: 'All types',
    apartments: 'Apartments',
    houses: 'Houses',
    hotels: 'Hotels',
    filters: 'Filters',
    resetFilters: 'Reset',
    sortPopular: 'Most popular',
    sortPriceAsc: 'Price: Low to High',
    sortPriceDesc: 'Price: High to Low',
    sortRating: 'Top rated',
    mapRoadmap: 'Google Map',
    mapSatellite: 'Google Satellite',
    mapOSM: 'OpenStreetMap',
    mapLayerTitle: 'Map style',
    locateMe: 'My location',
    availableOnMap: 'Available on map',
    objectsNearSearch: 'Properties near search',
    clickToInspect: 'Click a property for details',
    collapseToMap: 'Collapse to map',
    perDay: 'night',
    perMonth: 'mo',
    rooms: 'rms',
    guestsUpTo: 'up to',
    viewDetails: 'View',
    noObjectsFound: 'No properties found',
    noObjectsDesc: 'Try widening your search filters or choosing another location.',
    bookNow: 'Book now',
    writeToHost: 'Contact host',
    superhost: 'Superhost',
    instantBook: 'Instant book',
    safetyGuarantee: 'Security guarantee: funds are transferred to the host only after successful check-in.',
    myProfile: 'My profile',
    myListings: 'My listings',
    myTrips: 'My trips',
    earningsAndBookings: 'Earnings & bookings',
    favorites: 'Favorites',
    messagesAndChat: 'Messages & Chat',
    settings: 'Settings',
    listProperty: 'List a property',
    saveSettings: 'Save settings',
    profileSettingsListTitle: 'Account Settings',
    personalDataSection: 'Personal details',
    fullName: 'Full name',
    email: 'Email address',
    phone: 'Phone number',
    aboutMe: 'Bio / About',
    languageSection: 'Application language',
    currencySection: 'Display currency',
    notificationsSection: 'Notifications',
    emailNotif: 'Email notifications for bookings',
    pushNotif: 'Push notifications in browser',
    smsNotif: 'SMS alerts for payment updates',
    payoutSection: 'Payout details (Safe Deal)',
    payoutCard: 'Payout debit card number',
    payoutSbp: 'Instant transfer phone number',
    payoutNotice: 'Payouts are released automatically on check-in day.',
    securitySection: 'Security & login',
    twoFactor: 'Two-factor authentication (2FA)',
    hidePhoneBeforeBook: 'Hide phone number until booking is confirmed',
    changePassword: 'Change password',
    terminateOtherSessions: 'Log out from other devices',
    chatPlaceholder: 'Write a message to host...',
    send: 'Send',
    login: 'Log in',
    logout: 'Log out',
    quickCities: 'Cities'
  },
  hy: {
    appName: 'Բնակարանների Վարձույթ',
    appSlogan: 'Օրավարձով և ամսավարձով բնակարաններ',
    safeDealHeader: 'Ապահով գործարք՝ 100% պաշտպանություն մինչև տեղավորվելը',
    allObjects: 'Բոլոր օբյեկտները',
    allCountries: 'Բոլոր երկրները',
    allCities: 'Բոլոր քաղաքները',
    citiesInCountry: 'Երկրի բոլոր քաղաքները',
    searchPlaceholder: 'Փնտրել ըստ քաղաքի, հասցեի կամ անվան...',
    allFormats: 'Բոլոր ձևաչափերը',
    daily: 'Օրավարձով',
    monthly: 'Ամսավարձով',
    allTypes: 'Բոլոր տեսակները',
    apartments: 'Բնակարաններ',
    houses: 'Տներ / Առանձնատներ',
    hotels: 'Հյուրանոցներ',
    filters: 'Ֆիլտրեր',
    resetFilters: 'Մաքրել',
    sortPopular: 'Ըստ ժողովրդականության',
    sortPriceAsc: 'Նախ էժանները',
    sortPriceDesc: 'Նախ թանկերը',
    sortRating: 'Ըստ վարկանիշի',
    mapRoadmap: 'Գուգլ Քարտեզ',
    mapSatellite: 'Գուգլ Արբանյակ',
    mapOSM: 'OpenStreetMap',
    mapLayerTitle: 'Քարտեզի տեսք',
    locateMe: 'Իմ գտնվելու վայրը',
    availableOnMap: 'Հասանելի է քարտեզի վրա',
    objectsNearSearch: 'Օբյեկտներ որոնման շրջանում',
    clickToInspect: 'Սեղմեք օբյեկտին՝ մանրամասների համար',
    collapseToMap: 'Ծալել քարտեզին',
    perDay: 'օր',
    perMonth: 'ամիս',
    rooms: 'սենյակ',
    guestsUpTo: 'մինչև',
    viewDetails: 'Դիտել',
    noObjectsFound: 'Օբյեկտներ չեն գտնվել',
    noObjectsDesc: 'Փորձեք փոխել որոնման պարամետրերը կամ ընտրել այլ քաղաք։',
    bookNow: 'Ամրագրել հիմա',
    writeToHost: 'Գրել տանտիրոջը',
    superhost: 'Սուպերհոսթ',
    instantBook: 'Անհապաղ ամրագրում',
    safetyGuarantee: 'Անվտանգության երաշխիք՝ գումարը փոխանցվում է միայն տեղավորվելուց հետո։',
    myProfile: 'Իմ պրոֆիլը',
    myListings: 'Իմ հայտարարությունները',
    myTrips: 'Իմ ճամփորդությունները',
    earningsAndBookings: 'Եկամուտներ և ամրագրումներ',
    favorites: 'Նախընտրածներ',
    messagesAndChat: 'Հաղորդագրություններ և չաթ',
    settings: 'Կարգավորումներ',
    listProperty: 'Հանձնել բնակարան',
    saveSettings: 'Պահպանել կարգավորումները',
    profileSettingsListTitle: 'Հաշվի կարգավորումներ',
    personalDataSection: 'Անձնական տվյալներ',
    fullName: 'Անուն Ազգանուն',
    email: 'Էլ․ փոստ',
    phone: 'Հեռախոսահամար',
    aboutMe: 'Իմ մասին',
    languageSection: 'Հավելվածի լեզուն',
    currencySection: 'Հիմնական արժույթը',
    notificationsSection: 'Ծանուցումներ',
    emailNotif: 'Էլ․ փոստի ծանուցումներ ամրագրումների մասին',
    pushNotif: 'Push ծանուցումներ բրաուզերում',
    smsNotif: 'SMS ծանուցումներ վճարումների մասին',
    payoutSection: 'Վճարման տվյալներ (Ապահով գործարք)',
    payoutCard: 'Բանկային քարտի համարը',
    payoutSbp: 'Հեռախոսահամար փոխանցման համար',
    payoutNotice: 'Վճարումները փոխանցվում են ավտոմատ՝ հյուրի տեղավորման օրը։',
    securitySection: 'Անվտանգություն և մուտք',
    twoFactor: 'Երկփուլ նույնականացում (2FA)',
    hidePhoneBeforeBook: 'Թաքցնել հեռախոսահամարը մինչև ամրագրումը',
    changePassword: 'Փոխել գաղտնաբառը',
    terminateOtherSessions: 'Դուրս գալ մյուս սարքերից',
    chatPlaceholder: 'Գրեք հաղորդագրություն տանտիրոջը...',
    send: 'Ուղարկել',
    login: 'Մուտք',
    logout: 'Ելք',
    quickCities: 'Քաղաքներ'
  },
  ka: {
    appName: 'ბინების გაქირავება',
    appSlogan: 'დღიური და თვიური გაქირავება',
    safeDealHeader: 'უსაფრთხო გარიგება: 100% დაცვა დაბინავებამდე',
    allObjects: 'ყველა ობიექტი',
    allCountries: 'ყველა ქვეყანა',
    allCities: 'ყველა ქალაქი',
    citiesInCountry: 'ქვეყნის ყველა ქალაქი',
    searchPlaceholder: 'ძებნა ქალაქის, მისამართის ან სახელის მიხედვით...',
    allFormats: 'ყველა ფორმატი',
    daily: 'დღიურად',
    monthly: 'თვიურად',
    allTypes: 'ყველა ტიპი',
    apartments: 'ბინები',
    houses: 'სახლები / კოტეჯები',
    hotels: 'სასტუმროები',
    filters: 'ფილტრები',
    resetFilters: 'გასუფთავება',
    sortPopular: 'პოპულარობით',
    sortPriceAsc: 'ჯერ იაფი',
    sortPriceDesc: 'ჯერ ძვირი',
    sortRating: 'რეიტინგით',
    mapRoadmap: 'გუგლის რუკა',
    mapSatellite: 'გუგლის სატელიტი',
    mapOSM: 'OpenStreetMap',
    mapLayerTitle: 'რუკის სტილი',
    locateMe: 'ჩემი ადგილმდებარეობა',
    availableOnMap: 'ხელმისაწვდომია რუკაზე',
    objectsNearSearch: 'ობიექტები ძებნის სიახლოვეს',
    clickToInspect: 'დააჭირეთ ობიექტს დეტალებისთვის',
    collapseToMap: 'რუკაზე დაბრუნება',
    perDay: 'დღე',
    perMonth: 'თვე',
    rooms: 'ოთახი',
    guestsUpTo: 'მაქს.',
    viewDetails: 'ნახვა',
    noObjectsFound: 'ობიექტები ვერ მოიძებნა',
    noObjectsDesc: 'სცადეთ ფილტრების შეცვლა ან სხვა ქალაქის არჩევა.',
    bookNow: 'დაჯავშნა',
    writeToHost: 'მასპინძელთან დაკავშირება',
    superhost: 'სუპერმასპინძელი',
    instantBook: 'მყისიერი ჯავშანი',
    safetyGuarantee: 'უსაფრთხოების გარანტია: თანხა გადაეცემა მასპინძელს მხოლოდ დაბინავების შემდეგ.',
    myProfile: 'ჩემი პროფილი',
    myListings: 'ჩემი განცხადებები',
    myTrips: 'ჩემი მოგზაურობები',
    earningsAndBookings: 'შემოსავალი და ჯავშნები',
    favorites: 'რჩეულები',
    messagesAndChat: 'შეტყობინებები და ჩატი',
    settings: 'პარამეტრები',
    listProperty: 'ბინის გაქირავება',
    saveSettings: 'პარამეტრების შენახვა',
    profileSettingsListTitle: 'ანგარიშის პარამეტრები',
    personalDataSection: 'პირადი მონაცემები',
    fullName: 'სახელი და გვარი',
    email: 'ელ. ფოსტა',
    phone: 'ტელეფონის ნომერი',
    aboutMe: 'ჩემს შესახებ',
    languageSection: 'აპლიკაციის ენა',
    currencySection: 'ძირითადი ვალუტა',
    notificationsSection: 'შეტყობინებები',
    emailNotif: 'ელ. ფოსტის შეტყობინებები ჯავშნებზე',
    pushNotif: 'Push შეტყობინებები ბრაუზერში',
    smsNotif: 'SMS შეტყობინებები გადახდის სტატუსზე',
    payoutSection: 'გადახდის რეკვიზიტები (უსაფრთხო გარიგება)',
    payoutCard: 'საბანკო ბარათის ნომერი',
    payoutSbp: 'ტელეფონი გადარიცხვისთვის',
    payoutNotice: 'თანხა ავტომატურად ირიცხება სტუმრის დაბინავების დღეს.',
    securitySection: 'უსაფრთხოება და შესვლა',
    twoFactor: 'ორფაქტორიანი ავთენტიფიკაცია (2FA)',
    hidePhoneBeforeBook: 'ტელეფონის ნომრის დამალვა დადასტურებამდე',
    changePassword: 'პაროლის შეცვლა',
    terminateOtherSessions: 'სხვა სესიების დასრულება',
    chatPlaceholder: 'მიწერეთ მასპინძელს...',
    send: 'გაგზავნა',
    login: 'შესვლა',
    logout: 'გასვლა',
    quickCities: 'ქალაქები'
  }
};
