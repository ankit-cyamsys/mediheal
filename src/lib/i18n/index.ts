import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';
import { mmkvStorage } from '@/lib/storage';
import { STORAGE_KEYS, DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '@/lib/constants';
import en from './locales/en.json';
import hi from './locales/hi.json';

const deviceLanguage = getLocales()[0]?.languageCode ?? DEFAULT_LANGUAGE;
const savedLanguage = mmkvStorage.getItem(STORAGE_KEYS.LANGUAGE);

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    hi: { translation: hi },
  },
  lng: savedLanguage ?? deviceLanguage,
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: { escapeValue: false },
});

export function changeLanguage(lng: string) {
  i18n.changeLanguage(lng);
  mmkvStorage.setItem(STORAGE_KEYS.LANGUAGE, lng);
}

export { SUPPORTED_LANGUAGES };

export default i18n;
