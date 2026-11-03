export type ProductCategory = 'all' | 'juices' | 'smoothies' | 'shakes' | 'detox' | 'shots';

export type FunctionalBenefit = 
  | 'All'
  | 'Immunity' 
  | 'Gut Health' 
  | 'Energy Boost' 
  | 'Anti-Inflammatory' 
  | 'Muscle Recovery' 
  | 'Cellular Detox' 
  | 'Skin Glow'
  | 'Natural Glow'
  | 'Joint Comfort'
  | 'Daily Energy'
  | 'Deep Hydration'
  | 'Daily Stamina'
  | 'Workout Energy'
  | 'Heart Health'
  | 'Mental Focus'
  | 'Daily Reset'
  | 'Gentle Reset'
  | 'Throat Comfort'
  | 'Digestive Health'
  | 'All-Day Energy';

export interface NutritionFacts {
  servingSize: string;
  servingsPerContainer: number;
  calories: number;
  totalFat: string;
  sodium: string;
  totalCarb: string;
  dietaryFiber: string;
  totalSugars: string;
  addedSugars: string;
  protein: string;
  vitaminC: string;
  vitaminA: string;
  iron: string;
  potassium: string;
}

export interface TasteProfile {
  sweetness: number; // 1 to 5
  tartness: number;  // 1 to 5
  earthiness: number;// 1 to 5
  crispness: number; // 1 to 5
}

export interface Product {
  id: string;
  name: string;
  subname: string;
  tagline: string;
  description: string;
  category: 'juices' | 'smoothies' | 'shakes' | 'detox' | 'shots';
  price: number;
  subscriptionPrice: number;
  volume: string;
  calories: number;
  benefits: FunctionalBenefit[];
  ingredients: string[];
  ingredientHighlights: {
    name: string;
    benefit: string;
    origin: string;
  }[];
  nutritionFacts: NutritionFacts;
  tasteProfile: TasteProfile;
  colorHex: string;
  accentColor: string;
  badge?: string;
  image: string;
  rating: number;
  reviewsCount: number;
  bestSeller?: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  isSubscription: boolean;
  cadence: 'weekly' | 'biweekly' | 'monthly';
  bottleSize: string;
}

export interface CleanseProgram {
  id: string;
  name: string;
  level: 'Beginner Gentle' | 'Balanced Reset' | 'Deep Green Pro';
  tagline: string;
  days: number;
  bottlesPerDay: number;
  pricePerDay: number;
  totalPrice: number;
  savings: number;
  description: string;
  includes: string[];
  color: string;
  schedule: { time: string; drink: string; benefit: string }[];
}

export interface OrderDetails {
  orderId: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    zip: string;
  };
  fulfillment: 'local-courier' | 'express-cold' | 'pickup';
  deliveryWindow?: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  bottleDeposit: number;
  total: number;
  createdAt: string;
  status: 'confirmed' | 'chilling' | 'out-for-delivery' | 'delivered';
}
