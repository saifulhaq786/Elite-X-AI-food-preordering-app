export interface FoodItem {
  id: string;
  vendorId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image: string;
  rating: number;
  reviewCount: number;
  prepTime: number;
  isAvailable: boolean;
  stockCount: number;
  ingredients: string[];
  nutrition?: { calories: number; protein: string; carbs: string; fat: string };
  isBestseller?: boolean;
  isNew?: boolean;
}

export interface Vendor {
  id: string;
  name: string;
  tagline: string;
  logo: string;
  coverImage: string;
  rating: number;
  reviewCount: number;
  cuisineType: string;
  cuisine?: string[];
  college?: string;
  openingTime: string;
  closingTime: string;
  isOpen: boolean;
  isAcceptingOrders?: boolean;
  deliveryTypes: ('plate' | 'parcel')[];
  categories: string[];
  address: string;
  phone: string;
}

export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  vendorId: string;
  foodId?: string;
  rating: number;
  comment: string;
  date: string;
  images?: string[];
}

export const vendors: Vendor[] = [
  {
    id: 'tasty-times',
    name: 'Tasty Times',
    tagline: 'Authentic South Indian & Dum Biryani',
    logo: '🍛',
    coverImage: '/images/vendors/tasty-times-cover.png',
    rating: 4.6,
    reviewCount: 412,
    cuisineType: 'South Indian',
    cuisine: ['Biryani', 'Dosa', 'South Indian'],
    college: 'Elite Tech Campus',
    openingTime: '08:00',
    closingTime: '21:00',
    isOpen: true,
    isAcceptingOrders: true,
    deliveryTypes: ['plate', 'parcel'],
    categories: ['Biryani', 'Dosa', 'Tiffin', 'Rice & Meals', 'Beverages'],
    address: 'Stall #1, Central Food Court',
    phone: '+91 98765 43210',
  },
  {
    id: 'campus-kitchen',
    name: 'Campus Kitchen',
    tagline: 'Multi-Cuisine Burgers & Fast Food Hub',
    logo: '🍔',
    coverImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    rating: 4.4,
    reviewCount: 328,
    cuisineType: 'Multi-Cuisine',
    cuisine: ['Burgers', 'Sandwiches', 'Fast Food'],
    college: 'Elite Tech Campus',
    openingTime: '09:00',
    closingTime: '22:00',
    isOpen: true,
    isAcceptingOrders: true,
    deliveryTypes: ['plate', 'parcel'],
    categories: ['Burgers', 'Sandwiches', 'Pasta', 'Chinese', 'Wraps'],
    address: 'Stall #2, Central Food Court',
    phone: '+91 98765 43211',
  },
  {
    id: 'royal-kitchen',
    name: 'Royal Kitchen',
    tagline: 'Rich North Indian Delicacies & Thalis',
    logo: '👑',
    coverImage: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=800&auto=format&fit=crop&q=80',
    rating: 4.7,
    reviewCount: 512,
    cuisineType: 'North Indian',
    cuisine: ['North Indian', 'Paneer', 'Thali'],
    college: 'Elite Tech Campus',
    openingTime: '08:30',
    closingTime: '21:30',
    isOpen: true,
    isAcceptingOrders: true,
    deliveryTypes: ['plate', 'parcel'],
    categories: ['Thali', 'Paneer', 'Breads', 'Curries', 'Snacks'],
    address: 'Stall #3, Central Food Court',
    phone: '+91 98765 43212',
  },
  {
    id: 'chai-point',
    name: 'Chai & Snack Point',
    tagline: 'Kulhad Tea, Samosas & Evening Bites',
    logo: '☕',
    coverImage: 'https://images.unsplash.com/photo-1571934811356-5cc531766b84?w=800&auto=format&fit=crop&q=80',
    rating: 4.8,
    reviewCount: 680,
    cuisineType: 'Beverages & Snacks',
    cuisine: ['Tea', 'Samosa', 'Snacks'],
    college: 'Elite Tech Campus',
    openingTime: '07:30',
    closingTime: '22:30',
    isOpen: true,
    isAcceptingOrders: true,
    deliveryTypes: ['plate', 'parcel'],
    categories: ['Tea & Coffee', 'Samosa & Snacks', 'Maska Bun'],
    address: 'Stall #4, Central Food Court',
    phone: '+91 98765 43213',
  },
  {
    id: 'shake-hub',
    name: 'The Shake Hub',
    tagline: 'Thick Milkshakes, Desserts & Waffles',
    logo: '🥤',
    coverImage: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=800&auto=format&fit=crop&q=80',
    rating: 4.5,
    reviewCount: 290,
    cuisineType: 'Desserts',
    cuisine: ['Shakes', 'Desserts', 'Waffles'],
    college: 'Elite Tech Campus',
    openingTime: '10:00',
    closingTime: '22:00',
    isOpen: true,
    isAcceptingOrders: true,
    deliveryTypes: ['plate', 'parcel'],
    categories: ['Milkshakes', 'Waffles', 'Sundaes', 'Ice Cream'],
    address: 'Stall #5, Central Food Court',
    phone: '+91 98765 43214',
  },
  {
    id: 'green-bowl',
    name: 'Green Bowl Canteen',
    tagline: 'Fresh Protein Bowls & Detox Juices',
    logo: '🥗',
    coverImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    rating: 4.6,
    reviewCount: 215,
    cuisineType: 'Healthy & Fresh',
    cuisine: ['Salads', 'Protein Bowls', 'Juices'],
    college: 'Elite Tech Campus',
    openingTime: '08:00',
    closingTime: '20:00',
    isOpen: true,
    isAcceptingOrders: true,
    deliveryTypes: ['plate', 'parcel'],
    categories: ['Protein Bowls', 'Fresh Juices', 'Salads'],
    address: 'Stall #6, Central Food Court',
    phone: '+91 98765 43215',
  },
];

export const foodItems: FoodItem[] = [
  // TASTY TIMES
  { id: 'tt-001', vendorId: 'tasty-times', name: 'Hyderabadi Chicken Biryani', description: 'Fragrant basmati rice slow-cooked with spiced chicken leg, saffron, caramelized onions & fresh mint. Served with raita.', price: 180, category: 'Biryani', isVeg: false, image: '/images/food/chicken-biryani.png', rating: 4.8, reviewCount: 280, prepTime: 15, isAvailable: true, stockCount: 50, ingredients: ['Basmati Rice', 'Chicken', 'Yogurt', 'Onions', 'Mint', 'Saffron'], nutrition: { calories: 520, protein: '28g', carbs: '62g', fat: '18g' }, isBestseller: true },
  { id: 'tt-002', vendorId: 'tasty-times', name: 'Egg Dum Biryani', description: 'Aromatic biryani rice with 2 hard-boiled eggs marinated in special garam masala.', price: 130, category: 'Biryani', isVeg: false, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', rating: 4.4, reviewCount: 120, prepTime: 12, isAvailable: true, stockCount: 35, ingredients: ['Basmati Rice', 'Eggs', 'Onions', 'Spices'], nutrition: { calories: 450, protein: '18g', carbs: '58g', fat: '15g' } },
  { id: 'tt-003', vendorId: 'tasty-times', name: 'Paneer Veg Dum Biryani', description: 'Loaded with grilled paneer cubes, green peas, carrots, and whole spices.', price: 140, category: 'Biryani', isVeg: true, image: 'https://images.unsplash.com/photo-1645177628172-a94c1f96e6db?w=500&auto=format&fit=crop&q=80', rating: 4.5, reviewCount: 145, prepTime: 12, isAvailable: true, stockCount: 30, ingredients: ['Basmati Rice', 'Paneer', 'Peas', 'Carrots', 'Spices'], nutrition: { calories: 410, protein: '16g', carbs: '58g', fat: '12g' } },
  { id: 'tt-004', vendorId: 'tasty-times', name: 'Ghee Podi Masala Dosa', description: 'Crispy golden dosa brushed with aromatic pure ghee and podi masala, filled with potato bhaji.', price: 95, category: 'Dosa', isVeg: true, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80', rating: 4.7, reviewCount: 310, prepTime: 8, isAvailable: true, stockCount: 60, ingredients: ['Rice Batter', 'Ghee', 'Podi Masala', 'Potatoes'], nutrition: { calories: 320, protein: '9g', carbs: '46g', fat: '12g' }, isBestseller: true },
  { id: 'tt-005', vendorId: 'tasty-times', name: 'Onion Rava Dosa', description: 'Super crisp semolina dosa studded with chopped onions, green chillies and cumin.', price: 85, category: 'Dosa', isVeg: true, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=500&auto=format&fit=crop&q=80', rating: 4.3, reviewCount: 140, prepTime: 8, isAvailable: true, stockCount: 40, ingredients: ['Semolina', 'Rice Flour', 'Onions', 'Chillies'], nutrition: { calories: 280, protein: '7g', carbs: '40g', fat: '10g' } },
  { id: 'tt-006', vendorId: 'tasty-times', name: 'Steamed Idli Sambar (4 pcs)', description: 'Melt-in-mouth rice idlis served with hot drumstick sambar and fresh coconut chutney.', price: 50, category: 'Tiffin', isVeg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80', rating: 4.6, reviewCount: 220, prepTime: 5, isAvailable: true, stockCount: 80, ingredients: ['Steamed Rice', 'Urad Dal'], nutrition: { calories: 220, protein: '6g', carbs: '40g', fat: '2g' } },
  { id: 'tt-007', vendorId: 'tasty-times', name: 'Crispy Medu Vada (3 pcs)', description: 'Golden crunchy urad dal fritters infused with curry leaves and ginger.', price: 45, category: 'Tiffin', isVeg: true, image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=80', rating: 4.4, reviewCount: 160, prepTime: 6, isAvailable: true, stockCount: 50, ingredients: ['Urad Dal', 'Ginger', 'Curry Leaves'], nutrition: { calories: 280, protein: '10g', carbs: '30g', fat: '14g' } },
  { id: 'tt-008', vendorId: 'tasty-times', name: 'Chicken Schezwan Fried Rice', description: 'Spicy wok-tossed basmati rice with diced chicken, eggs, bell peppers & Schezwan sauce.', price: 150, category: 'Rice & Meals', isVeg: false, image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80', rating: 4.5, reviewCount: 190, prepTime: 10, isAvailable: true, stockCount: 40, ingredients: ['Rice', 'Chicken', 'Egg', 'Schezwan Sauce'], nutrition: { calories: 510, protein: '26g', carbs: '56g', fat: '18g' } },

  // CAMPUS KITCHEN
  { id: 'ck-001', vendorId: 'campus-kitchen', name: 'Double Crunchy Chicken Burger', description: 'Crispy fried chicken breast, melted cheddar cheese, iceberg lettuce & garlic mayo in sesame bun.', price: 135, category: 'Burgers', isVeg: false, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80', rating: 4.7, reviewCount: 340, prepTime: 10, isAvailable: true, stockCount: 45, ingredients: ['Crispy Chicken', 'Cheddar Cheese', 'Mayo', 'Sesame Bun'], nutrition: { calories: 520, protein: '29g', carbs: '42g', fat: '24g' }, isBestseller: true },
  { id: 'ck-002', vendorId: 'campus-kitchen', name: 'Loaded Veggie Supreme Burger', description: 'Herb vegetable patty topped with melted cheese, jalapeños, onion rings & smoky BBQ sauce.', price: 110, category: 'Burgers', isVeg: true, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=500&auto=format&fit=crop&q=80', rating: 4.4, reviewCount: 180, prepTime: 8, isAvailable: true, stockCount: 50, ingredients: ['Veg Patty', 'Jalapeños', 'BBQ Sauce', 'Cheese'], nutrition: { calories: 410, protein: '14g', carbs: '45g', fat: '18g' } },
  { id: 'ck-003', vendorId: 'campus-kitchen', name: 'Tandoori Paneer Sandwich', description: 'Grilled multi-grain bread stuffed with spicy tandoori paneer cubes, capsicum & mint dip.', price: 95, category: 'Sandwiches', isVeg: true, image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=500&auto=format&fit=crop&q=80', rating: 4.5, reviewCount: 210, prepTime: 7, isAvailable: true, stockCount: 35, ingredients: ['Paneer', 'Multi-grain Bread', 'Mint Chutney'], nutrition: { calories: 360, protein: '18g', carbs: '34g', fat: '16g' } },
  { id: 'ck-004', vendorId: 'campus-kitchen', name: 'Chicken Club Triple Decker', description: 'Layered toast with roasted chicken breast, fried egg, cucumber, tomatoes & honey mustard.', price: 145, category: 'Sandwiches', isVeg: false, image: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=500&auto=format&fit=crop&q=80', rating: 4.6, reviewCount: 160, prepTime: 10, isAvailable: true, stockCount: 30, ingredients: ['Chicken', 'Egg', 'Bread', 'Mustard Sauce'], nutrition: { calories: 540, protein: '32g', carbs: '38g', fat: '25g' }, isBestseller: true },
  { id: 'ck-005', vendorId: 'campus-kitchen', name: 'Creamy White Sauce Pasta', description: 'Penne pasta tossed in rich parmesan garlic cream sauce with mushrooms and sweet corn.', price: 150, category: 'Pasta', isVeg: true, image: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=500&auto=format&fit=crop&q=80', rating: 4.3, reviewCount: 130, prepTime: 12, isAvailable: true, stockCount: 25, ingredients: ['Penne', 'Parmesan Cream', 'Mushrooms', 'Corn'], nutrition: { calories: 480, protein: '14g', carbs: '54g', fat: '22g' } },
  { id: 'ck-007', vendorId: 'campus-kitchen', name: 'Veg Hakka Noodles', description: 'Stir-fried wok noodles with shredded cabbage, carrots, bell peppers & soya garlic seasoning.', price: 110, category: 'Chinese', isVeg: true, image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80', rating: 4.5, reviewCount: 260, prepTime: 8, isAvailable: true, stockCount: 50, ingredients: ['Noodles', 'Cabbage', 'Soy Sauce', 'Chillies'], nutrition: { calories: 360, protein: '11g', carbs: '54g', fat: '12g' } },
  { id: 'ck-011', vendorId: 'campus-kitchen', name: 'Spiced Chicken Shawarma Roll', description: 'Shredded roasted chicken marinated in Middle Eastern spices, wrapped in warm pita with garlic toum.', price: 130, category: 'Wraps', isVeg: false, image: 'https://images.unsplash.com/photo-1561651823-34feb02250e4?w=500&auto=format&fit=crop&q=80', rating: 4.8, reviewCount: 390, prepTime: 8, isAvailable: true, stockCount: 40, ingredients: ['Chicken', 'Pita Bread', 'Garlic Toum', 'Pickles'], nutrition: { calories: 460, protein: '30g', carbs: '36g', fat: '19g' }, isBestseller: true },

  // ROYAL KITCHEN
  { id: 'rk-001', vendorId: 'royal-kitchen', name: 'Shahi Paneer Butter Masala', description: 'Soft cottage cheese cubes simmered in rich cashew, butter & makhani tomato gravy.', price: 165, category: 'Paneer', isVeg: true, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80', rating: 4.8, reviewCount: 450, prepTime: 12, isAvailable: true, stockCount: 40, ingredients: ['Paneer', 'Cashews', 'Butter', 'Cream', 'Tomatoes'], nutrition: { calories: 430, protein: '19g', carbs: '22g', fat: '29g' }, isBestseller: true },
  { id: 'rk-003', vendorId: 'royal-kitchen', name: 'Amritsari Chole Bhature (2 pcs)', description: 'Spicy Punjabi chickpea curry topped with ginger juliennes, served with 2 large fluffy bhaturas.', price: 120, category: 'Snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=500&auto=format&fit=crop&q=80', rating: 4.7, reviewCount: 380, prepTime: 10, isAvailable: true, stockCount: 50, ingredients: ['Chickpeas', 'Flour Bhatura', 'Pickled Onion'], nutrition: { calories: 540, protein: '17g', carbs: '64g', fat: '23g' }, isBestseller: true },
  { id: 'rk-007', vendorId: 'royal-kitchen', name: 'Royal Grand Veg Thali', description: 'Paneer Butter Masala, Dal Makhani, Mixed Sabzi, Jeera Rice, 2 Butter Naans, Raita & Gulab Jamun.', price: 180, category: 'Thali', isVeg: true, image: 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=500&auto=format&fit=crop&q=80', rating: 4.8, reviewCount: 490, prepTime: 12, isAvailable: true, stockCount: 35, ingredients: ['Paneer', 'Dal Makhani', 'Rice', 'Naan', 'Sweet'], nutrition: { calories: 710, protein: '24g', carbs: '88g', fat: '26g' }, isBestseller: true },
  { id: 'rk-011', vendorId: 'royal-kitchen', name: 'Tandoori Chicken Tikka (8 pcs)', description: 'Tender chicken thighs marinated in hung curd, red chilli & tandoori spices, grilled on skewers.', price: 190, category: 'Snacks', isVeg: false, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=500&auto=format&fit=crop&q=80', rating: 4.7, reviewCount: 310, prepTime: 15, isAvailable: true, stockCount: 30, ingredients: ['Chicken Thighs', 'Hung Curd', 'Tandoori Masala'], nutrition: { calories: 340, protein: '38g', carbs: '6g', fat: '17g' } },

  // CHAI & SNACK POINT
  { id: 'cp-001', vendorId: 'chai-point', name: 'Adrak Elaichi Kulhad Chai', description: 'Freshly brewed Indian tea with crushed ginger and green cardamom, served in clay kulhad.', price: 25, category: 'Tea & Coffee', isVeg: true, image: 'https://images.unsplash.com/photo-1571934811356-5cc531766b84?w=500&auto=format&fit=crop&q=80', rating: 4.9, reviewCount: 750, prepTime: 3, isAvailable: true, stockCount: 150, ingredients: ['Tea Leaves', 'Ginger', 'Cardamom', 'Milk'], nutrition: { calories: 95, protein: '3g', carbs: '14g', fat: '3g' }, isBestseller: true },
  { id: 'cp-002', vendorId: 'chai-point', name: 'Crispy Potato Samosa (2 pcs)', description: 'Golden fried pastry triangles filled with spiced potatoes, green peas & cashews. Served with mint chutney.', price: 35, category: 'Samosa & Snacks', isVeg: true, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80', rating: 4.7, reviewCount: 520, prepTime: 3, isAvailable: true, stockCount: 100, ingredients: ['Potato', 'Flour', 'Peas', 'Cumin', 'Mint Chutney'], nutrition: { calories: 240, protein: '5g', carbs: '32g', fat: '11g' }, isBestseller: true },
  { id: 'cp-003', vendorId: 'chai-point', name: 'Amul Maska Bun Toast', description: 'Soft sweet bun toasted with generous dollops of Amul butter.', price: 40, category: 'Maska Bun', isVeg: true, image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&auto=format&fit=crop&q=80', rating: 4.6, reviewCount: 290, prepTime: 4, isAvailable: true, stockCount: 60, ingredients: ['Sweet Bun', 'Amul Butter'], nutrition: { calories: 260, protein: '6g', carbs: '35g', fat: '12g' } },

  // THE SHAKE HUB
  { id: 'sh-001', vendorId: 'shake-hub', name: 'Belgian Chocolate Milkshake', description: 'Thick creamy milkshake blended with dark Belgian chocolate sauce, ice cream & chocolate chips.', price: 95, category: 'Milkshakes', isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80', rating: 4.8, reviewCount: 380, prepTime: 5, isAvailable: true, stockCount: 50, ingredients: ['Dark Chocolate', 'Milk', 'Vanilla Ice Cream'], nutrition: { calories: 380, protein: '8g', carbs: '52g', fat: '16g' }, isBestseller: true },
  { id: 'sh-002', vendorId: 'shake-hub', name: 'Crunchy Oreo Overload Shake', description: 'Blended with crushed Oreo cookies, chocolate syrup, topped with whipped cream.', price: 105, category: 'Milkshakes', isVeg: true, image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80', rating: 4.7, reviewCount: 290, prepTime: 5, isAvailable: true, stockCount: 45, ingredients: ['Oreo Cookies', 'Milk', 'Ice Cream', 'Whipped Cream'], nutrition: { calories: 420, protein: '9g', carbs: '58g', fat: '18g' } },
  { id: 'sh-003', vendorId: 'shake-hub', name: 'Nutella Waffle with Ice Cream', description: 'Freshly baked Belgian waffle smothered in warm Nutella and a scoop of vanilla ice cream.', price: 140, category: 'Waffles', isVeg: true, image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80', rating: 4.9, reviewCount: 310, prepTime: 10, isAvailable: true, stockCount: 30, ingredients: ['Waffle Batter', 'Nutella', 'Vanilla Scoop'], nutrition: { calories: 490, protein: '9g', carbs: '64g', fat: '22g' }, isBestseller: true },

  // GREEN BOWL
  { id: 'gb-001', vendorId: 'green-bowl', name: 'Grilled Chicken Protein Bowl', description: 'Herb grilled chicken breast, quinoa, avocado slices, roasted chickpeas & lemon tahini dressing.', price: 175, category: 'Protein Bowls', isVeg: false, image: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&auto=format&fit=crop&q=80', rating: 4.7, reviewCount: 210, prepTime: 10, isAvailable: true, stockCount: 30, ingredients: ['Grilled Chicken', 'Quinoa', 'Avocado', 'Tahini'], nutrition: { calories: 420, protein: '36g', carbs: '32g', fat: '14g' }, isBestseller: true },
  { id: 'gb-002', vendorId: 'green-bowl', name: 'Fresh Cold Pressed Detox Juice', description: 'Green apple, spinach, cucumber, celery, mint and ginger blend with no added sugar.', price: 75, category: 'Fresh Juices', isVeg: true, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?w=500&auto=format&fit=crop&q=80', rating: 4.6, reviewCount: 170, prepTime: 4, isAvailable: true, stockCount: 40, ingredients: ['Green Apple', 'Spinach', 'Cucumber', 'Ginger'], nutrition: { calories: 110, protein: '2g', carbs: '24g', fat: '0g' } },
];

export const colleges = [
  { id: 'college-1', name: 'Elite Tech Campus', location: 'Main Food Court', vendorCount: 6, isActive: true },
  { id: 'college-2', name: 'Anna University', location: 'Chennai, Tamil Nadu', vendorCount: 3, isActive: true },
  { id: 'college-3', name: 'VIT University', location: 'Vellore, Tamil Nadu', vendorCount: 2, isActive: true },
];

export const reviews: Review[] = [
  { id: 'rev-001', userId: 'u1', userName: 'Rahul S.', userAvatar: '👨‍🎓', vendorId: 'tasty-times', foodId: 'tt-001', rating: 5, comment: 'Best biryani on campus! Perfectly spiced and generous portions.', date: '2026-01-15' },
  { id: 'rev-002', userId: 'u2', userName: 'Priya M.', userAvatar: '👩‍🎓', vendorId: 'chai-point', foodId: 'cp-001', rating: 5, comment: 'Authentic kulhad chai! Super refreshing between lectures.', date: '2026-01-18' },
];

export const offers = [
  { id: 'offer-1', title: '1st Order Special', description: 'Get 1 free juice on your first order above ₹149', minOrder: 149, orderNumber: 1, reward: 'Free Juice', isActive: true, emoji: '🎉' },
  { id: 'offer-2', title: '10th Order Reward', description: 'Get 1 free juice on your 10th order above ₹199', minOrder: 199, orderNumber: 10, reward: 'Free Juice', isActive: true, emoji: '🏆' },
  { id: 'offer-3', title: '15th Order Reward', description: 'Get 1 free juice on your 15th order above ₹229', minOrder: 229, orderNumber: 15, reward: 'Free Juice', isActive: true, emoji: '⭐' },
  { id: 'offer-4', title: '20th Order Bonus', description: '₹50 Smart Card Bonus on your 20th order above ₹299', minOrder: 299, orderNumber: 20, reward: '₹50 Smart Card Cashback', isActive: true, emoji: '💳' },
];

export function generateTimeSlots(openingTime: string, closingTime: string) {
  const slots: { slot: string; isAvailable: boolean; isPeakHour: boolean }[] = [];
  const [openHour, openMin] = openingTime.split(':').map(Number);
  const [closeHour, closeMin] = closingTime.split(':').map(Number);
  const now = new Date();
  const currentHour = now.getHours();
  const currentMin = now.getMinutes();

  for (let h = openHour; h <= closeHour; h++) {
    for (let m = 0; m < 60; m += 10) {
      if (h === openHour && m < openMin) continue;
      if (h === closeHour && m > closeMin) break;
      const endM = m + 10;
      const endH = endM >= 60 ? h + 1 : h;
      const endMin = endM >= 60 ? endM - 60 : endM;
      const startStr = `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
      const endStr = `${String(endH).padStart(2, '0')}:${String(endMin).padStart(2, '0')}`;
      const isPast = h < currentHour || (h === currentHour && m <= currentMin);
      const isPeakHour = (h >= 12 && h <= 14) || (h >= 18 && h <= 20);
      slots.push({ slot: `${formatTime(startStr)} - ${formatTime(endStr)}`, isAvailable: !isPast, isPeakHour });
    }
  }
  return slots;
}

function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${hour}:${String(m).padStart(2, '0')} ${period}`;
}

export function generateOrderId(): string {
  const prefixes = ['AP', 'MS', 'CK', 'TT', 'RK', 'CP', 'SH', 'GB'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const number = String(Math.floor(Math.random() * 9999) + 1).padStart(4, '0');
  return `${prefix}${number}`;
}

export const PLATFORM_FEE = 3;
export const PARCEL_CHARGE = 8;
export const SMART_CARD_BONUS = 50;
