// src/i18n.js

// نستخدم require لتفادي مشاكل استيراد JSON في بعض الإعدادات

import ar from "./locales/ar.json";
import en from "./locales/en.json";


export const translations = {
  ar,
  en,
};

export function createTranslator(locale) {
  const dict = translations[locale] || translations.ar;

  const t = (path) => {
    const parts = path.split('.');
    let value = dict;
    for (const part of parts) {
      value = value?.[part];
    }
    return value ?? path;
  };

  return {
    t,
    direction: dict.direction || 'rtl',
    langName: dict.langName || 'العربية',
  };
}
