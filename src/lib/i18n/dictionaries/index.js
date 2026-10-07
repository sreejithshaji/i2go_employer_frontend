import { DEFAULT_LOCALE } from '../config';
import de from './de';
import en from './en';

const DICTIONARIES = { de, en };

/**
 * UI strings for one language. Server code reads it directly; client
 * components get the same object through I18nProvider (features/i18n), so only
 * the current language reaches the browser.
 */
export function getDictionary(lang) {
    return DICTIONARIES[lang] ?? DICTIONARIES[DEFAULT_LOCALE];
}
