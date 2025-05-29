import { getRequestConfig } from 'next-intl/server';

import { routing } from './routing';

interface MessagesModule {
  default: Record<string, string>;
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !routing.locales.includes(locale as 'en' | 'es')) {
    locale = routing.defaultLocale;
  }

  const messagesModule = (await import(
    `../messages/${locale}.json`
  )) as MessagesModule;

  return {
    locale,
    messages: messagesModule.default,
  };
});
