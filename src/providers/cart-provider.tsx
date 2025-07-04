'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import type { Product } from '@prisma/client';

import type { CartItem } from '@/features/product/types';

interface CartContextType {
  cart: CartItem[];
  total: string;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product) => boolean;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => boolean;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  canAddToCart: (product: Product, additionalQuantity?: number) => boolean;
  getAvailableStock: (productId: string, productStock: number) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getAvailableStock = useCallback(
    (productId: string, productStock: number) => {
      const cartItem = cart.find((item) => item.id === productId);
      const cartQuantity = cartItem?.quantity ?? 0;
      return Math.max(0, productStock - cartQuantity);
    },
    [cart],
  );

  const canAddToCart = useCallback(
    (product: Product, additionalQuantity = 1) => {
      const availableStock = getAvailableStock(product.id, product.stock);
      return availableStock >= additionalQuantity;
    },
    [getAvailableStock],
  );

  const addToCart = useCallback(
    (product: Product): boolean => {
      if (!canAddToCart(product)) {
        return false;
      }

      setCart((prevCart) => {
        const existingItem = prevCart.find((item) => item.id === product.id);
        if (existingItem) {
          const newQuantity = (existingItem.quantity ?? 0) + 1;
          if (newQuantity > product.stock) {
            return prevCart;
          }
          return prevCart.map((item) =>
            item.id === product.id ? { ...item, quantity: newQuantity } : item,
          );
        }
        return [...prevCart, { ...product, quantity: 1 }];
      });
      return true;
    },
    [canAddToCart],
  );

  const removeFromCart = useCallback((itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback(
    (itemId: string, quantity: number): boolean => {
      if (quantity < 1) return false;

      const cartItem = cart.find((item) => item.id === itemId);
      if (!cartItem) return false;

      if (quantity > cartItem.stock) {
        return false;
      }

      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity } : item,
        ),
      );
      return true;
    },
    [cart],
  );

  const getTotalPrice = useCallback(() => {
    return cart.reduce((total, item) => {
      const itemQuantity = item.quantity ?? 0;
      const itemPrice = item.price ?? 0;
      return total + itemPrice * itemQuantity;
    }, 0);
  }, [cart]);

  const getTotalItems = useCallback(() => {
    return cart.reduce((total, item) => total + (item.quantity ?? 0), 0);
  }, [cart]);

  const total = (getTotalPrice() ?? 0).toFixed(2);

  const contextValue = useMemo(
    () => ({
      cart,
      total,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems,
      canAddToCart,
      getAvailableStock,
    }),
    [
      cart,
      total,
      isCartOpen,
      setIsCartOpen,
      addToCart,
      removeFromCart,
      updateQuantity,
      getTotalPrice,
      getTotalItems,
      canAddToCart,
      getAvailableStock,
    ],
  );

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
