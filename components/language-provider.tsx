"use client";

import React, { createContext, useContext, useState } from "react";

type Language = "en" | "es";

interface Translations {
  [key: string]: {
    en: string;
    es: string;
  };
}

export const translations: Translations = {
  "nav.store": {
    en: "Store",
    es: "Tienda",
  },
  "nav.dashboard": {
    en: "Dashboard",
    es: "Panel de Control",
  },
  "store.title": {
    en: "Our Products",
    es: "Nuestros Productos",
  },
  "store.cart": {
    en: "Cart",
    es: "Carrito",
  },
  "store.cart.empty": {
    en: "Your cart is empty",
    es: "Tu carrito está vacío",
  },
  "store.cart.total": {
    en: "Total",
    es: "Total",
  },
  "store.cart.checkout": {
    en: "Checkout",
    es: "Pagar",
  },
  "store.cart.remove": {
    en: "Remove",
    es: "Eliminar",
  },
  "store.cart.description": {
    en: "Review your items and proceed to checkout",
    es: "Revisa tus artículos y procede al pago",
  },
  "store.add_to_cart": {
    en: "Add to Cart",
    es: "Añadir al Carrito",
  },
  "store.view_details": {
    en: "View Details",
    es: "Ver Detalles",
  },
  "store.product.addToCart": {
    en: "Add to Cart",
    es: "Añadir al Carrito",
  },
  "store.product.platonic.title": {
    en: "Platonic Solids Set",
    es: "Set de Sólidos Platónicos",
  },
  "store.product.platonic.description": {
    en: "A complete set of all five Platonic solids: tetrahedron, cube, octahedron, dodecahedron, and icosahedron.",
    es: "Un set completo de los cinco sólidos platónicos: tetraedro, cubo, octaedro, dodecaedro e icosaedro.",
  },
  "store.product.rose.title": {
    en: "Rose Essence",
    es: "Esencia de Rosa",
  },
  "store.product.rose.description": {
    en: "Pure rose flower essence for emotional balance and heart healing.",
    es: "Esencia pura de rosa para el equilibrio emocional y la sanación del corazón.",
  },
  "store.product.sacred.title": {
    en: "Sacred Geometry Set",
    es: "Set de Geometría Sagrada",
  },
  "store.product.sacred.description": {
    en: "Advanced geometric shapes including the Merkaba, Flower of Life, and more.",
    es: "Formas geométricas avanzadas incluyendo Merkaba, Flor de la Vida y más.",
  },
  "store.product.lavender.title": {
    en: "Lavender Essence",
    es: "Esencia de Lavanda",
  },
  "store.product.lavender.description": {
    en: "Calming lavender essence for relaxation and stress relief.",
    es: "Esencia calmante de lavanda para relajación y alivio del estrés.",
  },
  "store.category.geometry": {
    en: "3D Geometry",
    es: "Geometría 3D",
  },
  "store.category.essence": {
    en: "Flower Essence",
    es: "Esencia Floral",
  },
  "hero.title": {
    en: "Sacred Geometry & Healing Essences",
    es: "Geometría Sagrada & Esencias Sanadoras",
  },
  "hero.subtitle": {
    en: "Discover the perfect harmony between sacred geometric forms and the healing power of flower essences.",
    es: "Descubre la perfecta armonía entre las formas geométricas sagradas y el poder sanador de las esencias florales.",
  },
  "hero.cta": {
    en: "Explore Our Collection",
    es: "Explora Nuestra Colección",
  },
  "features.title": {
    en: "Why Choose Us",
    es: "Por Qué Elegirnos",
  },
  "features.geometry.title": {
    en: "Sacred Geometry",
    es: "Geometría Sagrada",
  },
  "features.geometry.description": {
    en: "Handcrafted geometric forms that embody universal patterns of creation.",
    es: "Formas geométricas artesanales que encarnan patrones universales de la creación.",
  },
  "features.essences.title": {
    en: "Flower Essences",
    es: "Esencias Florales",
  },
  "features.essences.description": {
    en: "Pure, natural essences that promote emotional and spiritual well-being.",
    es: "Esencias naturales puras que promueven el bienestar emocional y espiritual.",
  },
  "features.harmony.title": {
    en: "Holistic Harmony",
    es: "Armonía Holística",
  },
  "features.harmony.description": {
    en: "The perfect blend of form and essence for complete spiritual alignment.",
    es: "La mezcla perfecta de forma y esencia para un alineamiento espiritual completo.",
  },
  "cta.title": {
    en: "Ready to Begin Your Journey?",
    es: "¿Listo para Comenzar tu Viaje?",
  },
  "cta.description": {
    en: "Join us in exploring the intersection of sacred geometry and natural healing.",
    es: "Únete a nosotros en la exploración de la intersección entre la geometría sagrada y la sanación natural.",
  },
  "cta.shop": {
    en: "Shop Now",
    es: "Comprar Ahora",
  },
  "cta.signin": {
    en: "Sign In",
    es: "Iniciar Sesión",
  },
  "auth.register.title": {
    en: "Register",
    es: "Registrarse",
  },
  "auth.register.description": {
    en: "Create a new account to start shopping",
    es: "Crea una nueva cuenta para empezar a comprar",
  },
  "auth.register.name": {
    en: "Full Name",
    es: "Nombre Completo",
  },
  "auth.register.email": {
    en: "Email",
    es: "Correo Electrónico",
  },
  "auth.register.password": {
    en: "Password",
    es: "Contraseña",
  },
  "auth.register.confirmPassword": {
    en: "Confirm Password",
    es: "Confirmar Contraseña",
  },
  "auth.register.submit": {
    en: "Create Account",
    es: "Crear Cuenta",
  },
  "auth.register.haveAccount": {
    en: "Already have an account?",
    es: "¿Ya tienes una cuenta?",
  },
  "auth.register.login": {
    en: "Login here",
    es: "Inicia sesión aquí",
  },
  "validation.nameRequired": {
    en: "Name is required",
    es: "El nombre es requerido",
  },
  "validation.emailRequired": {
    en: "Email is required",
    es: "El correo electrónico es requerido",
  },
  "validation.invalidEmail": {
    en: "Invalid email format",
    es: "Formato de correo electrónico inválido",
  },
  "validation.passwordRequired": {
    en: "Password is required",
    es: "La contraseña es requerida",
  },
  "validation.passwordLength": {
    en: "Password must be at least 6 characters",
    es: "La contraseña debe tener al menos 6 caracteres",
  },
  "validation.passwordsMatch": {
    en: "Passwords do not match",
    es: "Las contraseñas no coinciden",
  },
  "nav.sacred_geometry": {
    en: "Sacred Geometry",
    es: "Geometría Sagrada",
  },
  "nav.flower_essences": {
    en: "Flower Essences",
    es: "Esencias Florales",
  },
  "store.category.sacred geometry": {
    en: "Sacred Geometry Items",
    es: "Items de Geometría Sagrada",
  },
  "store.category.flower essence": {
    en: "Flower Essences",
    es: "Esencias Florales",
  },
  "store.filtering_by": {
    en: "Filtering by",
    es: "Filtrando por",
  },
  "admin.title": {
    en: "Product Management",
    es: "Gestión de Productos",
  },
  "admin.add_product": {
    en: "Add Product",
    es: "Añadir Producto",
  },
  "admin.add_new_product": {
    en: "Add New Product",
    es: "Añadir Nuevo Producto",
  },
  "admin.edit_product": {
    en: "Edit Product",
    es: "Editar Producto",
  },
  "admin.product_name": {
    en: "Product Name",
    es: "Nombre del Producto",
  },
  "admin.description": {
    en: "Description",
    es: "Descripción",
  },
  "admin.type": {
    en: "Type",
    es: "Tipo",
  },
  "admin.price": {
    en: "Price",
    es: "Precio",
  },
  "admin.stock": {
    en: "Stock",
    es: "Existencias",
  },
  "admin.product_image": {
    en: "Product Image",
    es: "Imagen del Producto",
  },
  "admin.uploading_image": {
    en: "Uploading image...",
    es: "Subiendo imagen...",
  },
  "admin.product_preview": {
    en: "Product preview",
    es: "Vista previa del producto",
  },
  "admin.adding": {
    en: "Adding...",
    es: "Añadiendo...",
  },
  "admin.add": {
    en: "Add Product",
    es: "Añadir Producto",
  },
  "admin.image": {
    en: "Image",
    es: "Imagen",
  },
  "admin.name": {
    en: "Name",
    es: "Nombre",
  },
  "admin.actions": {
    en: "Actions",
    es: "Acciones",
  },
  "admin.edit": {
    en: "Edit",
    es: "Editar",
  },
  "admin.delete": {
    en: "Delete",
    es: "Eliminar",
  },
  "admin.delete_confirm_title": {
    en: "Delete Product",
    es: "Eliminar Producto",
  },
  "admin.delete_confirm_description": {
    en: "Are you sure you want to delete this product? This action cannot be undone.",
    es: "¿Estás seguro de que deseas eliminar este producto? Esta acción no se puede deshacer.",
  },
  "admin.cancel": {
    en: "Cancel",
    es: "Cancelar",
  },
  "admin.confirm_delete": {
    en: "Delete",
    es: "Eliminar",
  },
  "admin.deleting": {
    en: "Deleting...",
    es: "Eliminando...",
  },
  "store.loading": {
    en: "Loading...",
    es: "Cargando...",
  },
  "store.error.failed_load": {
    en: "Failed to load products",
    es: "Error al cargar los productos",
  },
  "nav.signout": {
    en: "Sign Out",
    es: "Cerrar Sesión",
  },
  "admin.search_by_name": {
    en: "Search by name...",
    es: "Buscar por nombre...",
  },
  "admin.filter_by_type": {
    en: "Filter by type",
    es: "Filtrar por tipo",
  },
  "admin.all_types": {
    en: "All types",
    es: "Todos los tipos",
  },
  "admin.min_price": {
    en: "Min price",
    es: "Precio mínimo",
  },
  "admin.max_price": {
    en: "Max price",
    es: "Precio máximo",
  },
  "admin.products_found": {
    en: "products found",
    es: "productos encontrados",
  },
  "pagination.previous": {
    en: "Previous",
    es: "Anterior",
  },
  "pagination.next": {
    en: "Next",
    es: "Siguiente",
  },
  "pagination.page": {
    en: "Page",
    es: "Página",
  },
  "admin.sort_by_name": {
    en: "Sort by name",
    es: "Ordenar por nombre",
  },
  "admin.sort_by_type": {
    en: "Sort by type",
    es: "Ordenar por tipo",
  },
  "admin.editing": {
    en: "Editing...",
    es: "Editando...",
  },
  "admin.edit_tooltip": {
    en: "Edit product",
    es: "Editar producto",
  },
  "admin.delete_tooltip": {
    en: "Delete product",
    es: "Eliminar producto",
  },
  "store.essence.instructions": {
    en: "Here you can combine Bach essences that you consider will serve your emotional health and well-being and that of your family. We recommend choosing 2 to 5 essences maximum 7.",
    es: "Aquí puedes combinar las esencias de Bach que consideres te servirán para tu salud y bienestar emocional y la de tu familia. Te recomendamos elegir de 2 a 5 esencias máximo 7.",
  },
  "store.essence.empty_slots": {
    en: "If your combination for example only has 2 essences, leave the other spaces blank or unfilled, add your selection to the cart and proceed to payment.",
    es: "Si tu combinación por ejemplo solo lleva 2 esencias deja los demás espacios en blanco o sin llenar, agrega tu selección a la cesta y procede a tu pago.",
  },
  "store.essence.dosage": {
    en: "Remember that the recommended dose is 4 drops 4 to 6 times a day for 3 weeks.",
    es: "Recuerda que la dosis recomendada es 4 gotas de 4 a 6 veces al día durante 3 semanas.",
  },
  "store.essence.whatsapp_help": {
    en: "Need help selecting essences? Contact us via WhatsApp for personalized guidance.",
    es: "¿Necesitas ayuda seleccionando esencias? Contáctanos por WhatsApp para una guía personalizada.",
  },
  "store.essence.learn_more": {
    en: "Learn More About Flower Essences",
    es: "Aprende Más Sobre las Esencias Florales",
  },
  "store.essence.select_base": {
    en: "Select Base",
    es: "Seleccionar Base",
  },
  "store.essence.select_option": {
    en: "Select an option",
    es: "Selecciona una opción",
  },
  "store.essence.skip_option": {
    en: "Optional - Skip",
    es: "Opcional - Omitir",
  },
  "store.essence.essence_number": {
    en: "Essence",
    es: "Esencia",
  },
  "store.essence.base.brandy": {
    en: "Brandy Base",
    es: "Base de Brandy",
  },
  "store.essence.base.water": {
    en: "Water Base",
    es: "Base de Agua",
  },
  "store.essence.understanding.title": {
    en: "Understanding Flower Essences",
    es: "Entendiendo las Esencias Florales",
  },
  "store.essence.understanding.intro": {
    en: "Flower essences are natural preparations extracted from specific flowers in their natural habitat, carefully crafted to maintain their purity and energy. These essences are known for their ability to harmonize and balance our energetic body, acting as vibration and liquid consciousness.",
    es: "Las esencias florales son preparaciones naturales extraídas de flores específicas en su hábitat natural, cuidadosamente elaboradas para mantener su pureza y energía. Estas esencias son conocidas por su capacidad para armonizar y equilibrar nuestro cuerpo energético, actuando como vibración y conciencia líquida.",
  },
  "store.essence.understanding.interaction": {
    en: "When we use flower essences, we are interacting with the vital energy of flowers. Each flower possesses a unique vibration that is transmuted into the flower essence, and upon entering our system, these vibrations can help release emotional and energetic blockages, promoting a state of well-being and balance.",
    es: "Cuando usamos esencias florales, estamos interactuando con la energía vital de las flores. Cada flor posee una vibración única que se transmuta en la esencia floral, y al entrar en nuestro sistema, estas vibraciones pueden ayudar a liberar bloqueos emocionales y energéticos, promoviendo un estado de bienestar y equilibrio.",
  },
  "store.essence.understanding.process": {
    en: "Flower essences work in a subtle but profound way, facilitating connection with our emotions and fostering greater understanding and inner clarity. When using them, the harmonization of the body's energy centers is promoted, which can result in an overall improvement in emotional and mental state.",
    es: "Las esencias florales trabajan de manera sutil pero profunda, facilitando la conexión con nuestras emociones y fomentando una mayor comprensión y claridad interior. Al usarlas, se promueve la armonización de los centros energéticos del cuerpo, lo que puede resultar en una mejora general del estado emocional y mental.",
  },
  "store.essence.understanding.benefits": {
    en: "The use of flower essences is a natural and conscious way to work with our internal energies, allowing the flower's vibration to interweave with our own frequency, and guiding us towards a state of greater peace and balance.",
    es: "El uso de esencias florales es una forma natural y consciente de trabajar con nuestras energías internas, permitiendo que la vibración de la flor se entrelace con nuestra propia frecuencia, y guiándonos hacia un estado de mayor paz y equilibrio.",
  },
  "store.essence.explore": {
    en: "Explore Our Flower Essences",
    es: "Explora Nuestras Esencias Florales",
  },
  "admin.error": {
    en: "Error",
    es: "Error",
  },
  "admin.error.delete": {
    en: "Failed to delete product",
    es: "Error al eliminar el producto",
  },
  "admin.success": {
    en: "Success",
    es: "Éxito",
  },
  "admin.success.delete": {
    en: "Product deleted successfully",
    es: "Producto eliminado exitosamente",
  },
  "admin.success.create": {
    en: "Product created successfully",
    es: "Producto creado exitosamente",
  },
  "admin.filter_by_name": {
    en: "Filter by name",
    es: "Filtrar por nombre",
  },
  "admin.all": {
    en: "All",
    es: "Todos",
  },
  "admin.flower_essence": {
    en: "Flower Essence",
    es: "Esencia Floral",
  },
  "admin.sacred_geometry": {
    en: "Sacred Geometry",
    es: "Geometría Sagrada",
  },
  "admin.of": {
    en: "of",
    es: "de",
  },
  "admin.page": {
    en: "Page",
    es: "Página",
  },
  "footer.rights": {
    en: "All rights reserved.",
    es: "Todos los derechos reservados.",
  },
  "store.custom_blend.title": {
    en: "Create Your Custom Blend",
    es: "Crea Tu Mezcla Personalizada",
  },
  "store.custom_blend.subtitle": {
    en: "Personalized Flower Essence",
    es: "Esencia Floral Personalizada",
  },
  "store.custom_blend.description": {
    en: "Design your own unique blend of flower essences tailored to your specific needs. Select from our curated collection to create a personalized remedy that resonates with your journey.",
    es: "Diseña tu propia mezcla única de esencias florales adaptada a tus necesidades específicas. Selecciona de nuestra colección para crear un remedio personalizado que resuene con tu camino.",
  },
  "store.custom_blend.price": {
    en: "$24.99",
    es: "$24.99",
  },
  "store.custom_blend.cta": {
    en: "Create Your Blend",
    es: "Crear Tu Mezcla",
  },
  "store.no_products": {
    en: "No products found",
    es: "No se encontraron productos",
  },
  "store.try_adjusting": {
    en: "Try adjusting your search or filters",
    es: "Intenta ajustar tu búsqueda o filtros",
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
}
