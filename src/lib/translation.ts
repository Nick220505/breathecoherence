import * as deepl from 'deepl-node';

import { Locale } from '@/i18n/routing';

const deeplApiKey = process.env.DEEPL_API_KEY;

if (!deeplApiKey) {
  throw new Error('DEEPL_AUTH_KEY is not set in the environment variables');
}

const translator = new deepl.Translator(deeplApiKey);

export async function translate(
  text: string,
  targetLocale: Locale,
): Promise<string> {
  const deepLTargetLang = (
    targetLocale === 'en' ? 'en-US' : targetLocale
  ).toUpperCase() as deepl.TargetLanguageCode;

  const result = await translator.translateText(text, null, deepLTargetLang);
  return result.text;
}
