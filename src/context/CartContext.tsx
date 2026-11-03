import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, OrderDetails } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (
    product: Product,
    options?: {
      isSubscription?: boolean;
      cadence?: 'weekly' | 'biweekly' | 'monthly';
      quantity?: number;
      bottleSize?: string;
    }
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleSubscriptionItem: (id: string) => void;
  updateCadence: (id: string, cadence: 'weekly' | 'biweekly' | 'monthly') => void;
  clearCart: () => void;
  
  // UI states
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  selectedProduct: Product | null;
  openProductModal: (product: Product) => void;
  closeProductModal: () => void;

  isQuizOpen: boolean;
  openQuiz: () => void;
  closeQuiz: () => void;

  // Custom Box Builder State
  boxItems: Product[];
  boxTarget: 6 | 12;
  setBoxTarget: (target: 6 | 12) => void;
  addToBox: (product: Product) => void;
  removeFromBox: (index: number) => void;
  clearBox: () => void;
  addBoxToCart: () => void;

  // Pricing & Calculations
  subtotal: number;
  itemCount: number;
  freeShippingProgress: number; // 0 to 100%
  freeShippingThreshold: number;
  isFreeShipping: boolean;
  discount: number;
  promoCode: string;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
  bottleDeposit: number;
  total: number;

  // Delivery Setting
  deliveryMode: 'local-courier' | 'express-cold' | 'pickup';
  setDeliveryMode: (mode: 'local-courier' | 'express-cold' | 'pickup') => void;
  zipCode: string;
  setZipCode: (zip: string) => void;

  // Orders
  lastOrder: OrderDetails | null;
  setLastOrder: (order: OrderDetails | null) => void;

  // Notification Toast
  toast: string | null;
  showToast: (msg: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fnr_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isQuizOpen, setIsQuizOpen] = useState(false);

  // Box Builder
  const [boxItems, setBoxItems] = useState<Product[]>([]);
  const [boxTarget, setBoxTarget] = useState<6 | 12>(6);

  // Delivery & Promo (Default Mumbai Bandra West 400050)
  const [deliveryMode, setDeliveryMode] = useState<'local-courier' | 'express-cold' | 'pickup'>('local-courier');
  const [zipCode, setZipCode] = useState('400050');
  const [promoCode, setPromoCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);

  // Last simulated order
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);

  // Toast feedback
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('fnr_cart', JSON.stringify(cart));
  }, [cart]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (
    product: Product,
    options?: {
      isSubscription?: boolean;
      cadence?: 'weekly' | 'biweekly' | 'monthly';
      quantity?: number;
      bottleSize?: string;
    }
  ) => {
    const isSub = options?.isSubscription ?? false;
    const cadence = options?.cadence ?? 'weekly';
    const quantity = options?.quantity ?? 1;
    const bottleSize = options?.bottleSize ?? product.volume;

    const cartItemId = `${product.id}-${isSub ? 'sub-' + cadence : 'onetime'}-${bottleSize}`;

    setCart((prev) => {
      const existing = prev.find((item) => item.id === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.id === cartItemId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [
        ...prev,
        {
          id: cartItemId,
          product,
          quantity,
          isSubscription: isSub,
          cadence,
          bottleSize,
        },
      ];
    });

    showToast(`Added ${quantity}x ${product.name} to bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const toggleSubscriptionItem = (id: string) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            isSubscription: !item.isSubscription,
          };
        }
        return item;
      })
    );
  };

  const updateCadence = (id: string, cadence: 'weekly' | 'biweekly' | 'monthly') => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, cadence };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  // Box Builder Actions
  const addToBox = (product: Product) => {
    if (boxItems.length < boxTarget) {
      setBoxItems([...boxItems, product]);
    }
  };

  const removeFromBox = (index: number) => {
    setBoxItems(boxItems.filter((_, i) => i !== index));
  };

  const clearBox = () => {
    setBoxItems([]);
  };

  const addBoxToCart = () => {
    if (boxItems.length !== boxTarget) return;

    // Indian custom box bundle pricing (₹1,699 for 6-pack, ₹3,199 for 12-pack)
    const bundlePrice = boxTarget === 6 ? 1699 : 3199;
    const bundleSubPrice = boxTarget === 6 ? 1499 : 2799;

    const bundleProduct: Product = {
      id: `custom-box-${Date.now()}`,
      name: `Custom ${boxTarget}-Pack Cleanse Box`,
      subname: 'Curated Cold-Pressed Bundle',
      tagline: `Hand-selected variety: ${boxItems.map((p) => p.name).join(', ')}`,
      description: `Your bespoke curated box featuring: ${boxItems.map((b) => b.name).join(', ')}. Freshly cold-pressed and packed in insulated chilled packaging.`,
      category: 'detox',
      price: bundlePrice,
      subscriptionPrice: bundleSubPrice,
      volume: `${boxTarget}x 473 ml Glass Bottles`,
      calories: Math.round(boxItems.reduce((acc, curr) => acc + curr.calories, 0) / boxTarget),
      benefits: ['Cellular Detox', 'Immunity', 'Energy Boost'],
      ingredients: Array.from(new Set(boxItems.flatMap((b) => b.ingredients))),
      ingredientHighlights: boxItems[0]?.ingredientHighlights || [],
      nutritionFacts: boxItems[0]?.nutritionFacts || {
        servingSize: '1 Bottle',
        servingsPerContainer: boxTarget,
        calories: 120,
        totalFat: '0g',
        sodium: '40mg',
        totalCarb: '26g',
        dietaryFiber: '2g',
        totalSugars: '20g',
        addedSugars: '0g',
        protein: '3g',
        vitaminC: '150%',
        vitaminA: '50%',
        iron: '10%',
        potassium: '15%'
      },
      tasteProfile: { sweetness: 4, tartness: 3, earthiness: 3, crispness: 5 },
      colorHex: '#3D6847',
      accentColor: '#FFA826',
      image: boxItems[0]?.image || 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
      rating: 5.0,
      reviewsCount: 1,
      badge: `${boxTarget === 6 ? '15%' : '20%'} Bundle Savings`,
    };

    addToCart(bundleProduct, {
      isSubscription: false,
      quantity: 1,
      bottleSize: `${boxTarget}x 473 ml Bottles`,
    });

    clearBox();
    showToast(`Your Custom ${boxTarget}-pack Box was added to your bag!`);
  };

  // Promo Code
  const applyPromoCode = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'FRESH15' || clean === 'TASTE15' || clean === 'ROOTS15') {
      setPromoCode(clean);
      setDiscountPercent(15);
      showToast('15% discount applied successfully!');
      return true;
    } else if (clean === 'CLEANSE20') {
      setPromoCode(clean);
      setDiscountPercent(20);
      showToast('20% Cleanse discount applied!');
      return true;
    } else {
      showToast('Invalid promo code. Try "FRESH15" or "CLEANSE20"');
      return false;
    }
  };

  const removePromoCode = () => {
    setPromoCode('');
    setDiscountPercent(0);
    showToast('Promo code removed');
  };

  // Pricing calculations in ₹ (INR)
  const subtotal = cart.reduce((sum, item) => {
    const unitPrice = item.isSubscription ? item.product.subscriptionPrice : item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  const itemCount = cart.reduce((count, item) => count + item.quantity, 0);

  // Free delivery threshold: ₹499
  const freeShippingThreshold = 499.0;
  const isFreeShipping = subtotal >= freeShippingThreshold;
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const discount = (subtotal * discountPercent) / 100;
  // Glass bottle deposit refundable program (₹25 per bottle refunded via UPI)
  const bottleDeposit = itemCount * 25;
  const shippingFee = isFreeShipping || deliveryMode === 'pickup' ? 0 : 50;
  const total = Math.max(0, subtotal - discount + bottleDeposit + shippingFee);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleSubscriptionItem,
        updateCadence,
        clearCart,

        isCartOpen,
        openCart: () => setIsCartOpen(true),
        closeCart: () => setIsCartOpen(false),

        isCheckoutOpen,
        openCheckout: () => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        },
        closeCheckout: () => setIsCheckoutOpen(false),

        selectedProduct,
        openProductModal: (p) => setSelectedProduct(p),
        closeProductModal: () => setSelectedProduct(null),

        isQuizOpen,
        openQuiz: () => setIsQuizOpen(true),
        closeQuiz: () => setIsQuizOpen(false),

        boxItems,
        boxTarget,
        setBoxTarget,
        addToBox,
        removeFromBox,
        clearBox,
        addBoxToCart,

        subtotal,
        itemCount,
        freeShippingProgress,
        freeShippingThreshold,
        isFreeShipping,
        discount,
        promoCode,
        applyPromoCode,
        removePromoCode,
        bottleDeposit,
        total,

        deliveryMode,
        setDeliveryMode,
        zipCode,
        setZipCode,

        lastOrder,
        setLastOrder,

        toast,
        showToast,
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
