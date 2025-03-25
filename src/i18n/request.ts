import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

interface MessagesModule {
  default: Record<string, string>;
}

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as 'en' | 'es')) {
    locale = routing.defaultLocale;
  }

  // Import and type the messages module
  const messagesModule = (await import(
    `../messages/${locale}.json`
  )) as MessagesModule;

  return {
    locale,
    messages: messagesModule.default,
  };
});
