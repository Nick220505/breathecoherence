import { type Config } from 'prettier';

const config: Config = {
  plugins: ['prettier-plugin-tailwindcss'],
  semi: true,
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
};

export default config;
