import { Product } from '@prisma/client';

interface TranslationResponse {
  data: { translations: { translatedText: string }[] };
}

export async function translateText(
  text: string,
  targetLanguage: string = 'es',
): Promise<string> {
  try {
    if (!process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY) {
      console.warn('Missing NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY');
      return text;
    }

    const response = await fetch(
      `https://translation.googleapis.com/language/translate/v2?key=${process.env.NEXT_PUBLIC_GOOGLE_TRANSLATE_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: targetLanguage,
          source: 'en',
        }),
      },
    );

    if (!response.ok) {
      throw new Error('Translation failed');
    }

    const { data } = (await response.json()) as TranslationResponse;
    return data.translations[0].translatedText;
  } catch (error) {
    console.error('Translation error:', error);
    return text;
  }
}

export async function translateProduct(
  product: Product,
  targetLanguage: string = 'es',
): Promise<Product> {
  if (!product) return product;

  const translatedProduct = { ...product };

  try {
    translatedProduct.name = await translateText(product.name, targetLanguage);
    translatedProduct.description = await translateText(
      product.description,
      targetLanguage,
    );
    if (product.type) {
      translatedProduct.type = await translateText(
        product.type,
        targetLanguage,
      );
    }
  } catch (error) {
    console.error('Error translating product:', error);
  }

  return translatedProduct;
}

export async function translateProducts(
  products: Product[],
  targetLanguage: string = 'es',
): Promise<Product[]> {
  return Promise.all(
    products.map((product) => translateProduct(product, targetLanguage)),
  );
}
