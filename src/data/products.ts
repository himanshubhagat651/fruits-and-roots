import { Product, CleanseProgram } from '../types';

export const PRODUCTS: Product[] = [
  {
    id: 'golden-roots-glow',
    name: 'Golden Roots Glow',
    subname: 'Raw Cold-Pressed Elixir',
    tagline: 'Liquid sunshine with wild Lakadong turmeric, Nagpur oranges & Wayanad ginger.',
    description: 'Our signature anti-inflammatory botanical blend handcrafted with over 1.5 kg of fresh Indian harvest. Designed to ignite internal radiance, enhance cellular repair, and soothe gut digestion.',
    category: 'juices',
    price: 295,
    subscriptionPrice: 250,
    volume: '473 ml (16 fl oz)',
    calories: 140,
    benefits: ['Immunity', 'Anti-Inflammatory', 'Skin Glow'],
    ingredients: [
      'Sun-Ripened Nagpur Oranges',
      'Crisp Kashmiri Golden Apples',
      'Organic Lakadong Turmeric Root (7.5% Curcumin)',
      'Fresh Wayanad Baby Ginger Root',
      'Fresh Assam Kaji Nemu Lime',
      'Cracked Malabar Black Peppercorn (for 2000% curcumin absorption)'
    ],
    ingredientHighlights: [
      { name: 'Lakadong Turmeric', benefit: 'World-renowned 7.5% curcumin content for deep joint ease', origin: 'Jaintia Hills, Meghalaya' },
      { name: 'Wayanad Ginger', benefit: 'Stimulates digestive agni & beneficial gut microflora', origin: 'Western Ghats, Kerala' },
      { name: 'Nagpur Oranges', benefit: '180% Daily Value of raw, unpasteurised natural Vitamin C', origin: 'Vidarbha Belt, Maharashtra' }
    ],
    nutritionFacts: {
      servingSize: '1 Bottle (473 ml / 16 fl oz)',
      servingsPerContainer: 1,
      calories: 140,
      totalFat: '0g',
      sodium: '15mg',
      totalCarb: '34g',
      dietaryFiber: '1g',
      totalSugars: '28g (Zero Added Sugar)',
      addedSugars: '0g',
      protein: '2g',
      vitaminC: '180%',
      vitaminA: '45%',
      iron: '6%',
      potassium: '14%'
    },
    tasteProfile: {
      sweetness: 4,
      tartness: 3,
      earthiness: 2,
      crispness: 5
    },
    colorHex: '#FFA826',
    accentColor: '#FF7A00',
    badge: 'Signature Cold-Press',
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 384,
    bestSeller: true
  },
  {
    id: 'emerald-canopy-detox',
    name: 'Emerald Canopy',
    subname: 'Deep Green Cold-Pressed Juice',
    tagline: 'Crisp, alkalising chlorophyll powerhouse with Nilgiri greens, cucumber and cooling pudina.',
    description: 'An intensely refreshing, crisp green tonic packed with over 1.8 kg of living leafy greens per bottle. Alkaline-balancing and deeply hydrating for tired metropolitan routines.',
    category: 'juices',
    price: 315,
    subscriptionPrice: 265,
    volume: '473 ml (16 fl oz)',
    calories: 90,
    benefits: ['Cellular Detox', 'Gut Health', 'Energy Boost'],
    ingredients: [
      'Organic Nilgiri Curly Kale & Baby Spinach',
      'Crisp Shinkansen Cucumber',
      'Fresh Himalayan Celery Stalks',
      'Kinnaur Green Sour Apple',
      'Fresh Coriander & Flat-Leaf Parsley',
      'Sahyadri Garden Pudina (Spearmint)',
      'Fresh Kaji Nemu Lime'
    ],
    ingredientHighlights: [
      { name: 'Nilgiri Mountain Kale', benefit: 'Bioavailable chlorophyll & micronutrient dense', origin: 'Ooty Organic Farms, Tamil Nadu' },
      { name: 'Shinkansen Cucumber', benefit: 'Electrolyte hydration with natural bio-silica', origin: 'Pune Valley, Maharashtra' },
      { name: 'Sahyadri Pudina', benefit: 'Calms bloated digestion and uplifts the senses', origin: 'Western Ghats, Maharashtra' }
    ],
    nutritionFacts: {
      servingSize: '1 Bottle (473 ml / 16 fl oz)',
      servingsPerContainer: 1,
      calories: 90,
      totalFat: '0g',
      sodium: '65mg',
      totalCarb: '20g',
      dietaryFiber: '2g',
      totalSugars: '14g (Zero Added Sugar)',
      addedSugars: '0g',
      protein: '3g',
      vitaminC: '140%',
      vitaminA: '90%',
      iron: '15%',
      potassium: '18%'
    },
    tasteProfile: {
      sweetness: 2,
      tartness: 4,
      earthiness: 3,
      crispness: 5
    },
    colorHex: '#3D6847',
    accentColor: '#88D628',
    badge: 'Cleanse Favourite',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    reviewsCount: 512,
    bestSeller: true
  },
  {
    id: 'ruby-beet-vitality',
    name: 'Ruby Beet Vitality',
    subname: 'Nitric Oxide & Root Elixir',
    tagline: 'Deep Ooty beetroot, Himalayan wild berries and cold-pressed Solan pomegranate.',
    description: 'Engineered for cardiovascular endurance and natural oxygenation. Rich in dietary nitrates that naturally dilate blood vessels, elevating athletic stamina and mental focus.',
    category: 'juices',
    price: 295,
    subscriptionPrice: 250,
    volume: '473 ml (16 fl oz)',
    calories: 130,
    benefits: ['Energy Boost', 'Anti-Inflammatory', 'Cellular Detox'],
    ingredients: [
      'Organic Ooty Table Beetroots',
      'Wild Himalayan Seabuckthorn Berries',
      'Cold-Pressed Kandahari Pomegranate Arils',
      'Crisp Kashmiri Red Delicious Apples',
      'Fresh Lemon',
      'Organic Garden Rosemary'
    ],
    ingredientHighlights: [
      { name: 'Ooty Crimson Beets', benefit: 'Boosts natural nitric oxide for stamina & blood flow', origin: 'Nilgiris, Tamil Nadu' },
      { name: 'Himalayan Seabuckthorn', benefit: 'Potent Omega-7 & bioflavonoids for cell longevity', origin: 'Spiti Valley, Himachal' },
      { name: 'Kandahari Pomegranate', benefit: 'Potent polyphenols support heart & vascular health', origin: 'Solan Orchards, Himachal' }
    ],
    nutritionFacts: {
      servingSize: '1 Bottle (473 ml / 16 fl oz)',
      servingsPerContainer: 1,
      calories: 130,
      totalFat: '0g',
      sodium: '45mg',
      totalCarb: '31g',
      dietaryFiber: '3g',
      totalSugars: '24g (Zero Added Sugar)',
      addedSugars: '0g',
      protein: '3g',
      vitaminC: '95%',
      vitaminA: '20%',
      iron: '10%',
      potassium: '22%'
    },
    tasteProfile: {
      sweetness: 3,
      tartness: 3,
      earthiness: 5,
      crispness: 4
    },
    colorHex: '#8F1E42',
    accentColor: '#C02856',
    badge: 'Stamina & Blood Flow',
    image: 'https://images.unsplash.com/photo-1556881286-fc6915169721?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 290
  },
  {
    id: 'pitaya-sunrise-velvet',
    name: 'Dragon Fruit Sunrise Nectar',
    subname: 'Cold-Pressed Dragonfruit & Citrus Juice',
    tagline: 'Vibrant Kutch pink dragonfruit, Ratnagiri Alphonso mango & Pollachi tender coconut cold-pressed.',
    description: 'An exotic magenta botanical cold-press. Hydrating tender coconut electrolytes pressed with antioxidant-rich pink dragonfruit and Vitamin C-dense Alphonso mango at 15,000 PSI.',
    category: 'juices',
    price: 335,
    subscriptionPrice: 285,
    volume: '473 ml (16 fl oz)',
    calories: 160,
    benefits: ['Skin Glow', 'Gut Health', 'Energy Boost'],
    ingredients: [
      'Organic Pink Dragon Fruit (Kamalam)',
      'GI-Tagged Ratnagiri Alphonso Mango',
      'Golden Queen Pineapple',
      'Fresh Pollachi Tender Coconut Water',
      'Assam Kaji Nemu Lime Juice'
    ],
    ingredientHighlights: [
      { name: 'Kutch Pink Dragon Fruit', benefit: 'Natural Vitamin C & lycopene for radiant skin elasticity', origin: 'Kutch Belt, Gujarat' },
      { name: 'Ratnagiri Alphonso', benefit: 'Pure unadulterated sunshine aroma & beta-carotene', origin: 'Konkan Coast, Maharashtra' },
      { name: 'Pollachi Coconut Water', benefit: '5 essential natural isotonic bio-electrolytes', origin: 'Coimbatore Belt, Tamil Nadu' }
    ],
    nutritionFacts: {
      servingSize: '1 Bottle (473 ml / 16 fl oz)',
      servingsPerContainer: 1,
      calories: 160,
      totalFat: '0.5g',
      sodium: '30mg',
      totalCarb: '36g',
      dietaryFiber: '3g',
      totalSugars: '28g (Zero Added Sugar)',
      addedSugars: '0g',
      protein: '2g',
      vitaminC: '210%',
      vitaminA: '50%',
      iron: '8%',
      potassium: '16%'
    },
    tasteProfile: {
      sweetness: 5,
      tartness: 2,
      earthiness: 1,
      crispness: 4
    },
    colorHex: '#C02856',
    accentColor: '#FFA826',
    badge: 'Customer Obsession',
    image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=800&q=80',
    rating: 5.0,
    reviewsCount: 440,
    bestSeller: true
  },
  {
    id: 'blue-majik-cloud',
    name: 'Blue Majik Marine Tonic',
    subname: 'Cold-Pressed Blue Spirulina & Coconut Juice',
    tagline: 'Rare wild blue spirulina, raw Pollachi coconut water, sweet Kaji Nemu lime & pure ocean electrolytes.',
    description: 'A radiant azure cold-pressed botanical tonic. Formulated with phycocyanin-rich spirulina, organic lime, and pure isotonic coconut water for profound cellular rehydration and mental clarity.',
    category: 'juices',
    price: 365,
    subscriptionPrice: 310,
    volume: '473 ml (16 fl oz)',
    calories: 110,
    benefits: ['Energy Boost', 'Anti-Inflammatory', 'Skin Glow'],
    ingredients: [
      'Wild-Cultivated Blue Majik Spirulina Extract',
      'Fresh Pollachi Tender Coconut Water',
      'Crisp Kinnaur Green Apple Juice',
      'Fresh Kaji Nemu Lime Juice',
      'Pure Himalayan Rock Salt'
    ],
    ingredientHighlights: [
      { name: 'Blue Spirulina Extract', benefit: 'Pure phycocyanin antioxidant for cognitive resilience', origin: 'Auroville Organic Biotech, Puducherry' },
      { name: 'Pollachi Coconut Water', benefit: 'Natural plant electrolytes with zero synthetic additives', origin: 'Western Ghats, Tamil Nadu' },
      { name: 'Kaji Nemu Lime', benefit: 'Alkalising natural citric acid for cellular energy balance', origin: 'Brahmaputra Valley, Assam' }
    ],
    nutritionFacts: {
      servingSize: '1 Bottle (473 ml / 16 fl oz)',
      servingsPerContainer: 1,
      calories: 110,
      totalFat: '0g',
      sodium: '60mg',
      totalCarb: '24g',
      dietaryFiber: '1g',
      totalSugars: '19g (Zero Added Sugar)',
      addedSugars: '0g',
      protein: '2g',
      vitaminC: '90%',
      vitaminA: '30%',
      iron: '14%',
      potassium: '18%'
    },
    tasteProfile: {
      sweetness: 3,
      tartness: 3,
      earthiness: 1,
      crispness: 5
    },
    colorHex: '#25595B',
    accentColor: '#DDA74F',
    badge: 'Nootropic Focus',
    image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 318
  },
  {
    id: 'raw-cacao-reishi-bliss',
    name: 'Pure Celery & Fennel Cleanse',
    subname: '100% Raw Cold-Pressed Living Juice',
    tagline: 'High-elevation Himalayan celery stalks, sweet Florence fennel, Kinnaur apple & lime.',
    description: 'Pure gut hydration and digestive balance with over 1.6 kg of crisp organic celery stalks cold-pressed at 15,000 PSI. Natural mineral cluster salts replenish essential electrolytes.',
    category: 'juices',
    price: 325,
    subscriptionPrice: 275,
    volume: '473 ml (16 fl oz)',
    calories: 75,
    benefits: ['Cellular Detox', 'Gut Health', 'Energy Boost'],
    ingredients: [
      'Cold-Pressed Himalayan Celery Stalks',
      'Sweet Florence Fennel Bulb',
      'Kinnaur Green Sour Apple',
      'Fresh Kaji Nemu Lime Juice',
      'Sahyadri Garden Spearmint'
    ],
    ingredientHighlights: [
      { name: 'Himalayan Celery', benefit: 'Bioavailable sodium cluster salts to hydrate and support natural digestion', origin: 'Shimla Slopes, Himachal' },
      { name: 'Sweet Fennel Bulb', benefit: 'Relaxes gastrointestinal muscles and relieves metabolic bloating', origin: 'Ooty Hills, Tamil Nadu' },
      { name: 'Kinnaur Green Apple', benefit: 'Malic acid helps soften gallstones and aids hepatic bile flow', origin: 'Kinnaur, Himachal' }
    ],
    nutritionFacts: {
      servingSize: '1 Bottle (473 ml / 16 fl oz)',
      servingsPerContainer: 1,
      calories: 75,
      totalFat: '0g',
      sodium: '85mg',
      totalCarb: '16g',
      dietaryFiber: '2g',
      totalSugars: '11g (Zero Added Sugar)',
      addedSugars: '0g',
      protein: '2g',
      vitaminC: '110%',
      vitaminA: '45%',
      iron: '12%',
      potassium: '16%'
    },
    tasteProfile: {
      sweetness: 2,
      tartness: 4,
      earthiness: 2,
      crispness: 5
    },
    colorHex: '#487834',
    accentColor: '#7BC442',
    badge: 'Digestive Favourite',
    image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 410,
    bestSeller: true
  },
  {
    id: 'activated-charcoal-zen',
    name: 'Activated Charcoal Botanical Elixir',
    subname: 'Cold-Pressed Botanical Cleanse',
    tagline: 'Steam-activated coconut shell charcoal, Gondhoraj lime, Valencia orange & pure spring water.',
    description: 'A midnight-black refreshing masterwork. Micro-porous coconut charcoal paired with fresh lime and ginger gently cleanses and balances your digestive tract.',
    category: 'juices',
    price: 275,
    subscriptionPrice: 235,
    volume: '473 ml (16 fl oz)',
    calories: 60,
    benefits: ['Cellular Detox', 'Gut Health'],
    ingredients: [
      'Steam-Activated Virgin Coconut Charcoal',
      'Fresh Aromatic Gondhoraj Lime Juice',
      'Raw Wild Forest Honey',
      'Filtered 9.5 pH Alkaline Himalayan Spring Water',
      'Pinch of Pink Rock Salt (Sendha Namak)'
    ],
    ingredientHighlights: [
      { name: 'Activated Coconut Charcoal', benefit: 'Micro-porous structure promotes digestive balance & comfort', origin: 'Pollachi, Tamil Nadu' },
      { name: 'Gondhoraj Lime', benefit: 'Rich in citrus bioflavonoids to stimulate hepatic bile flow', origin: 'Hooghly Belt, West Bengal' },
      { name: 'Himalayan Spring Water', benefit: 'Naturally micro-clustered mineral water without acidity', origin: 'Uttarkashi, Uttarakhand' }
    ],
    nutritionFacts: {
      servingSize: '1 Bottle (473 ml / 16 fl oz)',
      servingsPerContainer: 1,
      calories: 60,
      totalFat: '0g',
      sodium: '50mg',
      totalCarb: '15g',
      dietaryFiber: '1g',
      totalSugars: '12g',
      addedSugars: '0g',
      protein: '0g',
      vitaminC: '60%',
      vitaminA: '0%',
      iron: '4%',
      potassium: '6%'
    },
    tasteProfile: {
      sweetness: 2,
      tartness: 4,
      earthiness: 2,
      crispness: 5
    },
    colorHex: '#1F2937',
    accentColor: '#C8741B',
    badge: 'Deep Cleanse',
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    reviewsCount: 198
  },
  {
    id: 'fire-ginger-immunity-shot',
    name: 'Fire & Root Immunity Booster',
    subname: 'Concentrated Cold-Pressed Botanical Elixir',
    tagline: 'High-pungency Wayanad ginger, Lakadong turmeric, Guntur chilli and wild tulsi extract.',
    description: 'An explosive, throat-warming 60 ml tonic shot that kickstarts circulation, activates white blood cells, and dissolves mental fog in seconds.',
    category: 'juices',
    price: 145,
    subscriptionPrice: 125,
    volume: '60 ml (2 fl oz)',
    calories: 25,
    benefits: ['Immunity', 'Anti-Inflammatory', 'Energy Boost'],
    ingredients: [
      '100% Raw Wayanad Ginger Juice',
      'Cold-Pressed Lakadong Turmeric Juice',
      'Fresh Lemon Juice',
      'Wild Krishna Tulsi Oil (Holy Basil)',
      'Pinch of Guntur Sanam Red Chilli (40,000 SHU)'
    ],
    ingredientHighlights: [
      { name: 'Wayanad High-Gingerol Root', benefit: 'Immediate thermogenic digestive kick & sinus clearing', origin: 'Wayanad, Kerala' },
      { name: 'Krishna Tulsi Extract', benefit: 'Eugenol compound provides natural microbial defense', origin: 'Vrindavan, UP' },
      { name: 'Guntur Red Chilli', benefit: 'Stimulates peripheral circulation & lymphatic flow', origin: 'Guntur, Andhra Pradesh' }
    ],
    nutritionFacts: {
      servingSize: '1 Shot (60 ml / 2 fl oz)',
      servingsPerContainer: 1,
      calories: 25,
      totalFat: '0g',
      sodium: '5mg',
      totalCarb: '6g',
      dietaryFiber: '0g',
      totalSugars: '4g',
      addedSugars: '0g',
      protein: '1g',
      vitaminC: '70%',
      vitaminA: '25%',
      iron: '4%',
      potassium: '8%'
    },
    tasteProfile: {
      sweetness: 1,
      tartness: 4,
      earthiness: 3,
      crispness: 5
    },
    colorHex: '#FF7A00',
    accentColor: '#FFD13B',
    badge: 'Immunity Kick',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    reviewsCount: 710,
    bestSeller: true
  }
];

export const CLEANSE_PROGRAMS: CleanseProgram[] = [
  {
    id: 'cleanse-beginner',
    name: 'The Gentle Reset Cleanse',
    level: 'Beginner Gentle',
    tagline: 'For first-time cleansers or those needing an easy, energising reboot.',
    days: 3,
    bottlesPerDay: 6,
    pricePerDay: 1433,
    totalPrice: 4299,
    savings: 650,
    description: 'A friendly balance of nutrient-dense greens, grounding root juices, a hearty plant smoothie, and an evening soothing cashew milk to keep hunger at bay while cleansing.',
    color: '#FFA826',
    includes: [
      '18 Chilled Borosilicate Glass Bottles (6 per day)',
      '3x Morning Fire & Root Immunity Shots daily',
      'Digital Ayurvedic Cleanse Guide & Meal Transition Protocol',
      'Insulated Thermal Courier Box with dry-chill packs',
      'Daily WhatsApp motivational check-in guidance from certified nutritionists'
    ],
    schedule: [
      { time: '8:00 AM IST', drink: 'Fire & Root Immunity Shot + 500ml Warm Jeera Water', benefit: 'Awakens digestive agni & stimulates bile' },
      { time: '9:30 AM IST', drink: 'Golden Roots Glow', benefit: 'Circulation & gentle antioxidant awakening' },
      { time: '12:00 PM IST', drink: 'Emerald Canopy Detox', benefit: 'High-chlorophyll midday cellular nourishment' },
      { time: '2:30 PM IST', drink: 'Dragon Fruit Sunrise Velvet', benefit: 'Fiber-rich fruit vitality & natural satiety' },
      { time: '5:00 PM IST', drink: 'Ruby Beet Vitality', benefit: 'Cardiovascular support & evening stamina' },
      { time: '7:30 PM IST', drink: 'Raw Cacao & Reishi Bliss', benefit: 'Calming nervous system unwind & amino replenishment' }
    ]
  },
  {
    id: 'cleanse-deep-green',
    name: 'The Deep Green Alkaline Master',
    level: 'Deep Green Pro',
    tagline: 'Low glycemic, ultra-pure alkaline flood for seasoned cleanse practitioners.',
    days: 3,
    bottlesPerDay: 6,
    pricePerDay: 1566,
    totalPrice: 4699,
    savings: 800,
    description: 'Strictly zero high-sugar fruits. 100% cold-pressed organic leafy greens, herbs, activated charcoal, and celery to support deep cellular rejuvenation and metabolic balance.',
    color: '#3D6847',
    includes: [
      '18 Pure Green & Functional Borosilicate Bottles',
      '3x Activated Charcoal Evening Cleansers',
      'Himalayan electrolyte pink rock salt pouch',
      'Pre- and Post-Cleanse Organic Herbal Kadhai Broth Pack',
      'VIP WhatsApp Concierge Support'
    ],
    schedule: [
      { time: '7:30 AM IST', drink: 'Morning Pure Himalayan Celery Elixir (473ml)', benefit: 'Natural mineral salts balance hydration and digestion' },
      { time: '10:00 AM IST', drink: 'Emerald Canopy (Extra Nilgiri Kale & Parsley)', benefit: 'Deep cellular oxygenation' },
      { time: '12:30 PM IST', drink: 'Deep Earth Chlorophyll Tonic', benefit: 'Rich bioavailable greens & cellular hydration' },
      { time: '3:00 PM IST', drink: 'Emerald Canopy Detox', benefit: 'Alkaline blood pH rebalancing' },
      { time: '5:30 PM IST', drink: 'Fire & Ginger Immunity Shot + Lemon Cucumber', benefit: 'Lymphatic drainage stimulant' },
      { time: '8:00 PM IST', drink: 'Activated Charcoal Zen', benefit: 'Calming digestive balance before sleep' }
    ]
  }
];

export const REVIEWS = [
  {
    id: 'rev-1',
    name: 'Dr. Ananya Sen',
    role: 'Integrative Medicine Physician',
    rating: 5,
    comment: 'Fruits & Roots is the gold standard for India. Most commercial supermarket juices in India are heat-pasteurised or stuffed with synthetic preservatives and sugar. Their non-thermal 15,000 PSI HPP extraction keeps living enzymes and raw bioflavonoids intact.',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=200&q=80',
    location: 'Bandra West, Mumbai'
  },
  {
    id: 'rev-2',
    name: 'Karan Singhania',
    role: 'Ironman Triathlete & Endurance Coach',
    rating: 5,
    comment: 'The Ruby Beet and Golden Roots have permanently replaced synthetic pre-workouts in my routine. The natural nitric oxide from fresh Nilgiri beets gives me relentless stamina on the road, and the 22g protein cacao shake is pure gold for muscle recovery.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    location: 'Indiranagar, Bengaluru'
  },
  {
    id: 'rev-3',
    name: 'Rhea Kapoor-Malhotra',
    role: 'Weekly Cleanse Subscriber',
    rating: 5,
    comment: 'Their 2.2°C cold-chain delivery is phenomenal! Every Monday morning by 6:30 AM IST, our chilled thermal cooler arrives at our doorstep. Returning 6 glass bottles to the delivery rider gives us ₹150 wallet credit instantly on UPI. Total gamechanger!',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    location: 'Vasant Vihar, New Delhi'
  }
];

export const PRESS_MENTIONS = [
  { outlet: 'Vogue India', quote: 'The chicest, most potent raw cold-pressed elixir brand in India.' },
  { outlet: 'GQ India', quote: 'Finally, an artisanal juice dispensary that treats Indian organic produce with Michelin-level reverence.' },
  { outlet: 'Architectural Digest India', quote: 'From bespoke borosilicate glass bottles to 15,000 PSI extraction, Fruits & Roots is redefining wellness design.' },
  { outlet: 'The Hindu Weekend', quote: 'Remarkably vibrant, zero added sugars, and unparalleled farm-to-bottle single-origin transparency.' }
];
