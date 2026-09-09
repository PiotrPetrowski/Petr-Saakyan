import { CountryWithCities } from '../types';

export const COUNTRIES_AND_CITIES: CountryWithCities[] = [
  {
    code: 'RU',
    name: 'Россия',
    flag: '🇷🇺',
    center: { lat: 55.7512, lng: 37.6184, zoom: 6 },
    cities: [
      { name: 'Москва', lat: 55.7512, lng: 37.6184 },
      { name: 'Санкт-Петербург', lat: 59.9311, lng: 30.3609 },
      { name: 'Сочи', lat: 43.5855, lng: 39.7231 },
      { name: 'Казань', lat: 55.7963, lng: 49.1088 },
      { name: 'Калининград', lat: 54.7104, lng: 20.4522 },
      { name: 'Екатеринбург', lat: 56.8389, lng: 60.6057 },
      { name: 'Владивосток', lat: 43.1155, lng: 131.8855 }
    ]
  },
  {
    code: 'AM',
    name: 'Армения',
    flag: '🇦🇲',
    center: { lat: 40.1872, lng: 44.5152, zoom: 9 },
    cities: [
      { name: 'Ереван', lat: 40.1872, lng: 44.5152 },
      { name: 'Дилижан', lat: 40.7410, lng: 44.8638 },
      { name: 'Гюмри', lat: 40.7853, lng: 43.8416 }
    ]
  },
  {
    code: 'GE',
    name: 'Грузия',
    flag: '🇬🇪',
    center: { lat: 41.7151, lng: 44.8271, zoom: 8 },
    cities: [
      { name: 'Тбилиси', lat: 41.7151, lng: 44.8271 },
      { name: 'Батуми', lat: 41.6168, lng: 41.6367 },
      { name: 'Кутаиси', lat: 42.2679, lng: 42.6946 }
    ]
  },
  {
    code: 'KZ',
    name: 'Казахстан',
    flag: '🇰🇿',
    center: { lat: 43.2389, lng: 76.8897, zoom: 6 },
    cities: [
      { name: 'Алматы', lat: 43.2389, lng: 76.8897 },
      { name: 'Астана', lat: 51.1694, lng: 71.4491 },
      { name: 'Шымкент', lat: 42.3417, lng: 69.5901 }
    ]
  },
  {
    code: 'BY',
    name: 'Беларусь',
    flag: '🇧🇾',
    center: { lat: 53.9006, lng: 27.5590, zoom: 7 },
    cities: [
      { name: 'Минск', lat: 53.9006, lng: 27.5590 },
      { name: 'Брест', lat: 52.0976, lng: 23.7341 },
      { name: 'Гродно', lat: 53.6688, lng: 23.8295 }
    ]
  },
  {
    code: 'TR',
    name: 'Турция',
    flag: '🇹🇷',
    center: { lat: 38.9637, lng: 35.2433, zoom: 6 },
    cities: [
      { name: 'Стамбул', lat: 41.0082, lng: 28.9784 },
      { name: 'Анталья', lat: 36.8969, lng: 30.7133 },
      { name: 'Аланья', lat: 36.5438, lng: 31.9998 },
      { name: 'Бодрум', lat: 37.0344, lng: 27.4305 }
    ]
  },
  {
    code: 'AE',
    name: 'ОАЭ',
    flag: '🇦🇪',
    center: { lat: 25.2048, lng: 55.2708, zoom: 9 },
    cities: [
      { name: 'Дубай', lat: 25.2048, lng: 55.2708 },
      { name: 'Абу-Даби', lat: 24.4539, lng: 54.3773 }
    ]
  },
  {
    code: 'UZ',
    name: 'Узбекистан',
    flag: '🇺🇿',
    center: { lat: 41.2995, lng: 69.2401, zoom: 6 },
    cities: [
      { name: 'Ташкент', lat: 41.2995, lng: 69.2401 },
      { name: 'Самарканд', lat: 39.6270, lng: 66.9750 },
      { name: 'Бухара', lat: 39.7681, lng: 64.4556 }
    ]
  },
  {
    code: 'TH',
    name: 'Таиланд',
    flag: '🇹🇭',
    center: { lat: 13.7563, lng: 100.5018, zoom: 6 },
    cities: [
      { name: 'Бангкок', lat: 13.7563, lng: 100.5018 },
      { name: 'Пхукет', lat: 7.8804, lng: 98.3923 },
      { name: 'Паттайя', lat: 12.9276, lng: 100.8771 }
    ]
  },
  {
    code: 'CY',
    name: 'Кипр',
    flag: '🇨🇾',
    center: { lat: 34.9003, lng: 33.6232, zoom: 9 },
    cities: [
      { name: 'Лимассол', lat: 34.6841, lng: 33.0379 },
      { name: 'Пафос', lat: 34.7754, lng: 32.4218 },
      { name: 'Ларнака', lat: 34.9003, lng: 33.6232 }
    ]
  }
];

export const getCountryByName = (countryName: string): CountryWithCities | undefined => {
  return COUNTRIES_AND_CITIES.find(
    c => c.name.toLowerCase() === countryName.toLowerCase() || c.code.toLowerCase() === countryName.toLowerCase()
  );
};

export const getCityCoordinates = (cityName: string): { lat: number; lng: number } | null => {
  for (const country of COUNTRIES_AND_CITIES) {
    const found = country.cities.find(c => c.name.toLowerCase() === cityName.toLowerCase());
    if (found) return { lat: found.lat, lng: found.lng };
  }
  return null;
};
