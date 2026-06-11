import it from './it.json';
import en from './en.json';
import pl from './pl.json';

const translations = { it, en, pl } as const;
export type Locale = keyof typeof translations;
export const locales = Object.keys(translations) as Locale[];
export const defaultLocale: Locale = 'en';

export function useTranslations(locale: Locale) {
  return function t(key: string): string {
    return key
      .split('.')
      .reduce((obj: unknown, k) => (obj as Record<string, unknown>)?.[k], translations[locale]) as string ?? key;
  };
}

export function getLangFromUrl(url: URL): Locale {
  const [, lang] = url.pathname.split('/');
  if (lang in translations) return lang as Locale;
  return defaultLocale;
}

export function getLocalePath(lang: Locale, path: string = '') {
  const base = import.meta.env.BASE_URL ?? '/';
  if (lang === defaultLocale) return `${base}${path}`;
  return `${base}${lang}/${path}`;
}

export function getLocalizedPath(lang: Locale, currentPath: string) {
  const base = import.meta.env.BASE_URL ?? '/';
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const currentRelativePath = currentPath.startsWith(normalizedBase)
    ? currentPath.slice(normalizedBase.length)
    : currentPath.replace(/^\//, '');
  const pathWithoutLocale = currentRelativePath.replace(/^(it|pl)\//, '');

  if (lang === defaultLocale) {
    return `${normalizedBase}${pathWithoutLocale}`;
  }

  return `${normalizedBase}${lang}/${pathWithoutLocale}`;
}
