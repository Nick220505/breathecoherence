interface TranslationResponse {
  data: { translations: { translatedText: string }[] };
}

export const translationService = {
  async translate(text: string, targetLocale: string): Promise<string> {
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY;

      if (!apiKey) {
        console.warn(
          'Google Translate API key is missing. Using mock translation.',
        );
        return `${text} (${targetLocale})`;
      }

      const response = await fetch(
        `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: text,
            target: targetLocale,
            source: 'en',
          }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        console.error('Translation API error response:', errorBody);
        throw new Error(`Translation failed with status: ${response.status}`);
      }

      const { data } = (await response.json()) as TranslationResponse;

      if (!data?.translations?.[0]?.translatedText) {
        throw new Error('No valid translation returned from API');
      }

      return data.translations[0].translatedText;
    } catch (error) {
      console.error('Translation process failed:', error);
      return `${text} (${targetLocale})`;
    }
  },
};
