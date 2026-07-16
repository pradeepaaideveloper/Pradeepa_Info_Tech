import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartEndpoints } from '../services/endpoints';
import { useAuth } from './AuthContext';

export interface CartItem {
  id: number;
  product_id: number;
  name: string;
  name_ta: string;
  price: number;
  gst_rate: number;
  image_url: string;
  quantity: number;
}

interface Coupon {
  code: string;
  discount_type: 'percentage' | 'flat';
  discount_value: number;
  min_order_value: number;
}

interface CartContextType {
  cartItems: CartItem[];
  wishlist: number[]; // Array of product IDs
  coupon: Coupon | null;
  loading: boolean;
  addToCart: (product: any, qty?: number) => Promise<void>;
  updateCartQty: (productId: number, qty: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  clearCart: () => void;
  toggleWishlist: (productId: number) => void;
  applyCoupon: (couponData: Coupon) => void;
  removeCoupon: () => void;
  cartCalculations: {
    subtotal: number;
    discount: number;
    gstTotal: number;
    total: number;
  };
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  // Load wishlist from localStorage on start
  useEffect(() => {
    const savedWish = localStorage.getItem('pradeepa_wishlist');
    if (savedWish) {
      setWishlist(JSON.parse(savedWish));
    }
  }, []);

  // Sync cart from backend if authenticated, else from localStorage
  const syncCart = async () => {
    if (!isAuthenticated) {
      const localCart = localStorage.getItem('pradeepa_cart');
      if (localCart) {
        setCartItems(JSON.parse(localCart));
      } else {
        setCartItems([]);
      }
      return;
    }

    try {
      setLoading(true);
      const res = await cartEndpoints.get();
      // Map API response to CartItem schema
      const items = res.data.map((item: any) => ({
        id: item.id,
        product_id: item.product.id,
        name: item.product.name,
        name_ta: item.product.name_ta,
        price: item.product.selling_price,
        gst_rate: item.product.gst_rate,
        image_url: item.product.image_url,
        quantity: item.quantity,
      }));
      setCartItems(items);
    } catch (err) {
      console.error('Failed to fetch cart from server:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    syncCart();
  }, [isAuthenticated]);

  const addToCart = async (product: any, qty = 1) => {
    if (isAuthenticated) {
      try {
        await cartEndpoints.addItem(product.id, qty);
        await syncCart();
      } catch (err) {
        console.error('Failed to add cart item to server:', err);
      }
    } else {
      setCartItems((prev) => {
        const existing = prev.find((item) => item.product_id === product.id);
        let updated;
        if (existing) {
          updated = prev.map((item) =>
            item.product_id === product.id ? { ...item, quantity: item.quantity + qty } : item
          );
        } else {
          updated = [
            ...prev,
            {
              id: Date.now(), // Temp ID
              product_id: product.id,
              name: product.name,
              name_ta: product.name_ta,
              price: product.selling_price,
              gst_rate: product.gst_rate,
              image_url: product.image_url,
              quantity: qty,
            },
          ];
        }
        localStorage.setItem('pradeepa_cart', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const updateCartQty = async (productId: number, qty: number) => {
    if (qty <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (isAuthenticated) {
      try {
        const item = cartItems.find((ci) => ci.product_id === productId);
        if (item) {
          await cartEndpoints.updateItem(item.id, qty);
          await syncCart();
        }
      } catch (err) {
        console.error('Failed to update cart quantity on server:', err);
      }
    } else {
      setCartItems((prev) => {
        const updated = prev.map((item) =>
          item.product_id === productId ? { ...item, quantity: qty } : item
        );
        localStorage.setItem('pradeepa_cart', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const removeFromCart = async (productId: number) => {
    if (isAuthenticated) {
      try {
        const item = cartItems.find((ci) => ci.product_id === productId);
        if (item) {
          await cartEndpoints.removeItem(item.id);
          await syncCart();
        }
      } catch (err) {
        console.error('Failed to remove cart item from server:', err);
      }
    } else {
      setCartItems((prev) => {
        const updated = prev.filter((item) => item.product_id !== productId);
        localStorage.setItem('pradeepa_cart', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setCoupon(null);
    localStorage.removeItem('pradeepa_cart');
  };

  const toggleWishlist = (productId: number) => {
    setWishlist((prev) => {
      const updated = prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId];
      localStorage.setItem('pradeepa_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const applyCoupon = (couponData: Coupon) => {
    setCoupon(couponData);
  };

  const removeCoupon = () => {
    setCoupon(null);
  };

  // Perform Calculations
  const getCartCalculations = () => {
    let subtotal = 0;
    let gstTotal = 0;

    cartItems.forEach((item) => {
      const itemSubtotal = item.price * item.quantity;
      const taxRate = item.gst_rate; // e.g. 0.18
      const itemGst = itemSubtotal * taxRate;

      subtotal += itemSubtotal;
      gstTotal += itemGst;
    });

    let discount = 0;
    if (coupon && subtotal >= coupon.min_order_value) {
      if (coupon.discount_type === 'percentage') {
        discount = subtotal * (coupon.discount_value / 100);
      } else {
        discount = coupon.discount_value;
      }
    }

    const total = subtotal + gstTotal - discount;

    return {
      subtotal: Math.round(subtotal * 100) / 100,
      discount: Math.round(discount * 100) / 100,
      gstTotal: Math.round(gstTotal * 100) / 100,
      total: Math.max(0, Math.round(total * 100) / 100),
    };
  };

  const cartCalculations = getCartCalculations();

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlist,
        coupon,
        loading,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        toggleWishlist,
        applyCoupon,
        removeCoupon,
        cartCalculations,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
