import * as deepl from 'deepl-node';

const authKey = process.env.DEEPL_API_KEY;

const freeApiUrl = 'https://api-free.deepl.com';

const translator = authKey
  ? new deepl.Translator(authKey, {
      serverUrl: freeApiUrl,
    })
  : null;

export async function translate(
  text: string,
  targetLocale: 'en' | 'es',
): Promise<string> {
  const deepLTargetLang =
    targetLocale.toUpperCase() as deepl.TargetLanguageCode;

  if (!translator) {
    console.warn(
      'DeepL API key is missing. Using mock translation. Please set the DEEPL_API_KEY environment variable.',
    );
    return `${text} (${targetLocale})`;
  }

  try {
    const result = await translator.translateText(text, 'en', deepLTargetLang);
    return result.text;
  } catch (error) {
    console.error('DeepL translation process failed:', error);
    return `${text} (${targetLocale})`;
  }
}
