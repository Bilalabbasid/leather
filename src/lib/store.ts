import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Currency, Product, Variant } from './types';
import { CURRENCY_RATES, formatPence } from './config';

interface StoreState {
  // Cart
  cart: CartItem[];
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addToCart: (product: Product, variant: Variant, quantity?: number) => void;
  removeFromCart: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  getCartCount: () => number;
  getCartSubtotalPence: () => number;

  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
  formatPricePence: (pence: number) => string;

  // Search Modal
  isSearchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;

  // Size Guide Modal
  sizeGuideCategory: string | null;
  openSizeGuide: (category: string) => void;
  closeSizeGuide: () => void;

  // Global Notification / Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
  clearToast: () => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      cart: [],
      isCartOpen: false,
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),

      addToCart: (product, variant, quantity = 1) => {
        set((state) => {
          const variantId = variant.id;
          const existing = state.cart.find((item) => item.variantId === variantId);

          let updatedCart: CartItem[];
          const unitPrice = variant.priceOverrideInPence ?? product.priceInPence;

          if (existing) {
            updatedCart = state.cart.map((item) =>
              item.variantId === variantId
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          } else {
            const newItem: CartItem = {
              id: variantId,
              productId: product.id,
              product,
              variantId: variant.id,
              variant,
              quantity,
              unitPriceInPence: unitPrice,
            };
            updatedCart = [newItem, ...state.cart];
          }

          return {
            cart: updatedCart,
            isCartOpen: true,
            toastMessage: `Added "${product.title}" (${variant.size}) to your Shopping Bag.`,
          };
        });
      },

      removeFromCart: (variantId) => {
        set((state) => ({
          cart: state.cart.filter((item) => item.variantId !== variantId),
        }));
      },

      updateQuantity: (variantId, quantity) => {
        if (quantity <= 0) {
          get().removeFromCart(variantId);
          return;
        }
        set((state) => ({
          cart: state.cart.map((item) =>
            item.variantId === variantId ? { ...item, quantity } : item
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      getCartCount: () => {
        return get().cart.reduce((total, item) => total + item.quantity, 0);
      },

      getCartSubtotalPence: () => {
        return get().cart.reduce(
          (total, item) => total + item.unitPriceInPence * item.quantity,
          0
        );
      },

      // Currency
      currency: 'GBP',
      setCurrency: (currency) => set({ currency }),
      formatPricePence: (pence: number) => {
        return formatPence(pence, get().currency);
      },

      // Search Modal
      isSearchOpen: false,
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),

      // Size Guide
      sizeGuideCategory: null,
      openSizeGuide: (category) => set({ sizeGuideCategory: category }),
      closeSizeGuide: () => set({ sizeGuideCategory: null }),

      // Toast
      toastMessage: null,
      showToast: (msg) => {
        set({ toastMessage: msg });
        setTimeout(() => {
          set((s) => (s.toastMessage === msg ? { toastMessage: null } : s));
        }, 4000);
      },
      clearToast: () => set({ toastMessage: null }),
    }),
    {
      name: 'acemen-store-v2',
      partialize: (state) => ({ cart: state.cart, currency: state.currency }),
    }
  )
);
