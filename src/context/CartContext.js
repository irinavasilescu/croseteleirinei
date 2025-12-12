import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'cart_data';
const CART_EXPIRATION_HOURS = 1;

// Helper functions for localStorage
const saveCartToStorage = (items) => {
  try {
    const expirationTime = Date.now() + (CART_EXPIRATION_HOURS * 60 * 60 * 1000);
    const cartData = {
      items,
      expirationTime,
    };
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartData));
  } catch (error) {
    console.error('Error saving cart to localStorage:', error);
  }
};

const loadCartFromStorage = () => {
  try {
    const cartDataStr = localStorage.getItem(CART_STORAGE_KEY);
    if (!cartDataStr) return null;

    const cartData = JSON.parse(cartDataStr);
    const now = Date.now();

    // Check if cart data has expired
    if (cartData.expirationTime && cartData.expirationTime < now) {
      localStorage.removeItem(CART_STORAGE_KEY);
      return null;
    }

    return cartData.items || [];
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
    return null;
  }
};

export function CartProvider({ children }) {
  // Initialize cart from localStorage or empty array
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = loadCartFromStorage();
    return savedCart || [];
  });
  const MAX_QUANTITY = 10;

  // Save cart to localStorage whenever cartItems changes
  useEffect(() => {
    if (cartItems.length > 0) {
      saveCartToStorage(cartItems);
    } else {
      // Clear localStorage when cart is empty
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [cartItems]);

  const addToCart = useCallback((item) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      
      if (existingItem) {
        // If item exists, increase quantity up to max
        if (existingItem.quantity < MAX_QUANTITY) {
          return prevItems.map(cartItem =>
            cartItem.id === item.id
              ? { ...cartItem, quantity: cartItem.quantity + 1 }
              : cartItem
          );
        }
        // Already at max quantity
        return prevItems;
      } else {
        // New item, add with quantity 1
        return [...prevItems, { ...item, quantity: 1 }];
      }
    });
  }, []);

  const removeFromCart = useCallback((itemId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    
    if (newQuantity > MAX_QUANTITY) {
      newQuantity = MAX_QUANTITY;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      if (!existingItem) {
        // Item not in cart, can't update - return unchanged
        return prevItems;
      }
      return prevItems.map(item =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      );
    });
  }, [removeFromCart]);

  const setItemQuantity = useCallback((item, quantity) => {
    if (quantity <= 0) {
      removeFromCart(item.id);
      return;
    }
    
    if (quantity > MAX_QUANTITY) {
      quantity = MAX_QUANTITY;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        // Update existing item
        return prevItems.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity } : cartItem
        );
      } else {
        // Add new item with specified quantity
        return [...prevItems, { ...item, quantity }];
      }
    });
  }, [removeFromCart]);

  const updateKeychain = useCallback((itemId, keychainType) => {
    setCartItems(prevItems => {
      return prevItems.map(item =>
        item.id === itemId ? { ...item, keychain: keychainType } : item
      );
    });
  }, []);

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const getTotalItems = useCallback(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const getTotalPrice = useCallback(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    setItemQuantity,
    updateKeychain,
    clearCart,
    getTotalItems,
    getTotalPrice,
    MAX_QUANTITY,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

