import { createNavigation } from "next-intl/navigation";
import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "es"],
  defaultLocale: "en",
  pathnames: {
    "/": "/",
    "/store": {
      en: "/store",
      es: "/tienda",
    },
    "/store/custom-blend": {
      en: "/store/custom-blend",
      es: "/tienda/mezcla-personalizada",
    },
    "/store/flower-essences": {
      en: "/store/flower-essences",
      es: "/tienda/esencias-florales",
    },
    "/product/[id]": {
      en: "/product/[id]",
      es: "/producto/[id]",
    },
    "/login": {
      en: "/login",
      es: "/iniciar-sesion",
    },
    "/register": {
      en: "/register",
      es: "/registrarse",
    },
    "/verify": {
      en: "/verify",
      es: "/verificar",
    },
    "/checkout": {
      en: "/checkout",
      es: "/pagar",
    },
    "/dashboard": "/dashboard",
  },
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
