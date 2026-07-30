// ML & Business Intelligence Engine for Elite X Campus Preordering

export interface RushHourData {
  hour: string; // e.g. "8:20 AM"
  rushLevel: 'Low' | 'Moderate' | 'Peak';
  score: number; // 0 - 100
  color: string;
  recommended: boolean;
}

export interface DemandPrediction {
  foodId: string;
  foodName: string;
  predictedDemand: number;
  currentStock: number;
  confidenceScore: number; // e.g. 94%
  peakHour: string;
  recommendation: string;
  category: string;
}

export interface SmartPairing {
  id: string;
  name: string;
  price: number;
  image: string;
  reason: string;
  discountPrice?: number;
}

export interface VendorOffer {
  code: string;
  minSpend: number;
  discountPercentage: number;
  description: string;
  complimentaryItem?: string;
}

export interface TimeSlot {
  id: string;
  timeRange: string;
  windowGroup: 'Morning (8-9 AM)' | 'Lunch (12-2 PM)' | 'Snacks (3:30-5 PM)';
  available: boolean;
  isPeak: boolean;
}

export interface CollegeAnalytics {
  id: string;
  name: string;
  location: string;
  totalRevenue: number;
  totalOrders: number;
  activeStudents: number;
  vendorStallsCount: number;
  growthPct: number;
  peakWindow: string;
  avgOrderValue: number;
  topDishes: { name: string; salesCount: number; revenue: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

// ============================================================
// 1. CANTEEN RUSH HEATMAP GENERATOR (Only 8-9 AM, 12-2 PM, 3:30-5 PM)
// ============================================================

export function getCanteenRushHeatmap(): RushHourData[] {
  const hours = [
    // Morning Window (8:00 AM - 9:00 AM)
    { hour: '8:00 AM', score: 25, level: 'Low' },
    { hour: '8:20 AM', score: 40, level: 'Low' },
    { hour: '8:40 AM', score: 65, level: 'Moderate' },
    { hour: '9:00 AM', score: 35, level: 'Low' },

    // Lunch Window (12:00 PM - 2:00 PM)
    { hour: '12:00 PM', score: 85, level: 'Peak' },
    { hour: '12:20 PM', score: 92, level: 'Peak' },
    { hour: '12:40 PM', score: 98, level: 'Peak' },
    { hour: '1:00 PM', score: 95, level: 'Peak' },
    { hour: '1:20 PM', score: 80, level: 'Peak' },
    { hour: '1:40 PM', score: 60, level: 'Moderate' },
    { hour: '2:00 PM', score: 40, level: 'Low' },

    // Snacks Window (3:30 PM - 5:00 PM)
    { hour: '3:30 PM', score: 30, level: 'Low' },
    { hour: '3:50 PM', score: 55, level: 'Moderate' },
    { hour: '4:10 PM', score: 75, level: 'Peak' },
    { hour: '4:30 PM', score: 88, level: 'Peak' },
    { hour: '4:50 PM', score: 65, level: 'Moderate' },
    { hour: '5:00 PM', score: 45, level: 'Low' },
  ];

  return hours.map(h => ({
    hour: h.hour,
    rushLevel: h.level as RushHourData['rushLevel'],
    score: h.score,
    color: h.level === 'Peak' ? '#DC2626' : h.level === 'Moderate' ? '#F5A623' : '#16A34A',
    recommended: h.level === 'Low',
  }));
}

// ============================================================
// 2. 20-MINUTE PICKUP TIME SLOTS GENERATOR
// ============================================================

export function generate20MinTimeSlots(): TimeSlot[] {
  return [
    // Morning Window (8:00 AM - 9:00 AM)
    { id: '08:00', timeRange: '8:00 AM - 8:20 AM', windowGroup: 'Morning (8-9 AM)', available: true, isPeak: false },
    { id: '08:20', timeRange: '8:20 AM - 8:40 AM', windowGroup: 'Morning (8-9 AM)', available: true, isPeak: false },
    { id: '08:40', timeRange: '8:40 AM - 9:00 AM', windowGroup: 'Morning (8-9 AM)', available: true, isPeak: true },

    // Lunch Window (12:00 PM - 2:00 PM)
    { id: '12:00', timeRange: '12:00 PM - 12:20 PM', windowGroup: 'Lunch (12-2 PM)', available: true, isPeak: true },
    { id: '12:20', timeRange: '12:20 PM - 12:40 PM', windowGroup: 'Lunch (12-2 PM)', available: true, isPeak: true },
    { id: '12:40', timeRange: '12:40 PM - 1:00 PM', windowGroup: 'Lunch (12-2 PM)', available: true, isPeak: true },
    { id: '13:00', timeRange: '1:00 PM - 1:20 PM', windowGroup: 'Lunch (12-2 PM)', available: true, isPeak: true },
    { id: '13:20', timeRange: '1:20 PM - 1:40 PM', windowGroup: 'Lunch (12-2 PM)', available: true, isPeak: false },
    { id: '13:40', timeRange: '1:40 PM - 2:00 PM', windowGroup: 'Lunch (12-2 PM)', available: true, isPeak: false },

    // Snacks Window (3:30 PM - 5:00 PM)
    { id: '15:30', timeRange: '3:30 PM - 3:50 PM', windowGroup: 'Snacks (3:30-5 PM)', available: true, isPeak: false },
    { id: '15:50', timeRange: '3:50 PM - 4:10 PM', windowGroup: 'Snacks (3:30-5 PM)', available: true, isPeak: false },
    { id: '16:10', timeRange: '4:10 PM - 4:30 PM', windowGroup: 'Snacks (3:30-5 PM)', available: true, isPeak: true },
    { id: '16:30', timeRange: '4:30 PM - 4:50 PM', windowGroup: 'Snacks (3:30-5 PM)', available: true, isPeak: true },
    { id: '16:50', timeRange: '4:50 PM - 5:00 PM', windowGroup: 'Snacks (3:30-5 PM)', available: true, isPeak: false },
  ];
}

// ============================================================
// 3. AI BEST TIME SLOT PREDICTOR
// ============================================================

export function getBestTimeSlotRecommendation(): {
  slot: string;
  estimatedWaitMinutes: number;
  confidenceScore: number;
  badge: string;
} {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= 12 && currentHour <= 14) {
    return {
      slot: '1:40 PM - 2:00 PM (20 min slot)',
      estimatedWaitMinutes: 2,
      confidenceScore: 96,
      badge: '⚡ Recommended Lunch Slot',
    };
  } else if (currentHour >= 15 && currentHour <= 17) {
    return {
      slot: '3:30 PM - 3:50 PM (20 min slot)',
      estimatedWaitMinutes: 1,
      confidenceScore: 94,
      badge: '⚡ Low Traffic Evening Slot',
    };
  }

  return {
    slot: '8:20 AM - 8:40 AM (20 min slot)',
    estimatedWaitMinutes: 1,
    confidenceScore: 98,
    badge: '⚡ Fast Track Morning Slot',
  };
}

// ============================================================
// 4. SMART CART RECOMMENDATIONS
// ============================================================

export function getSmartCartPairings(cartItemNames: string[]): SmartPairing[] {
  const pairings: Record<string, SmartPairing[]> = {
    biryani: [
      { id: 'pair-1', name: 'Chilled Coke 300ml', price: 35, image: '🥤', reason: 'Pairs great with spicy biryani', discountPrice: 30 },
      { id: 'pair-2', name: 'Special Double Ka Meetha', price: 50, image: '🍮', reason: 'Popular dessert pairing (78% order together)' },
    ],
    dosa: [
      { id: 'pair-3', name: 'Traditional Filter Coffee', price: 30, image: '☕', reason: 'Classic South Indian combo', discountPrice: 25 },
      { id: 'pair-4', name: 'Extra Ghee Podi Dip', price: 20, image: '🥣', reason: 'Adds extra crunch and flavor' },
    ],
    burger: [
      { id: 'pair-5', name: 'Peri Peri Seasoned Fries', price: 65, image: '🍟', reason: '92% students add fries with burgers', discountPrice: 55 },
      { id: 'pair-6', name: 'Oreo Thick Milkshake', price: 90, image: '🥤', reason: 'Top rated shake pairing' },
    ],
  };

  const matched: SmartPairing[] = [];
  const lowercaseNames = cartItemNames.map(n => n.toLowerCase());

  for (const [key, items] of Object.entries(pairings)) {
    if (lowercaseNames.some(name => name.includes(key))) {
      matched.push(...items);
    }
  }

  if (matched.length === 0) {
    return [
      { id: 'pair-def-1', name: 'Kulhad Masala Chai', price: 20, image: '☕', reason: 'Campus bestseller snack pairing' },
      { id: 'pair-def-2', name: 'Crispy Samosa (1 pc)', price: 15, image: '🥟', reason: 'Quick bite add-on' },
    ];
  }

  return matched.slice(0, 2);
}

// ============================================================
// 5. VENDOR OFFERS & BUSINESS DISCOUNTS
// ============================================================

export const VENDOR_OFFERS: VendorOffer[] = [
  {
    code: 'ELITE10',
    minSpend: 499,
    discountPercentage: 10,
    description: 'Get 10% OFF on orders above ₹499 + Free Dessert Cup',
    complimentaryItem: 'Free Chocolate Brownie Bite 🧁',
  },
  {
    code: 'CAMPUS20',
    minSpend: 299,
    discountPercentage: 15,
    description: 'Get 15% OFF on orders above ₹299 for canteen lunch',
  },
  {
    code: 'SMARTCARD',
    minSpend: 150,
    discountPercentage: 5,
    description: 'Instant 5% Cashback using Smart Tap Card',
  },
];

export function calculateOfferDiscount(total: number, couponCode?: string | null) {
  if (couponCode) {
    const offer = VENDOR_OFFERS.find(o => o.code === couponCode.toUpperCase());
    if (offer && total >= offer.minSpend) {
      const discount = Math.round((total * offer.discountPercentage) / 100);
      return {
        discountAmount: discount,
        appliedOffer: offer,
        complimentaryItem: offer.complimentaryItem,
      };
    }
  }

  if (total >= 499) {
    const offer = VENDOR_OFFERS[0];
    const discount = Math.round((total * offer.discountPercentage) / 100);
    return {
      discountAmount: discount,
      appliedOffer: offer,
      complimentaryItem: offer.complimentaryItem,
    };
  } else {
    const needed = 499 - total;
    return {
      discountAmount: 0,
      appliedOffer: null,
      nextOfferTier: {
        neededAmount: needed,
        description: `Add ₹${needed.toFixed(0)} more to get 10% OFF + Free Dessert 🧁`,
      },
    };
  }
}

// ============================================================
// 6. ML VENDOR FOOD DEMAND PREDICTION
// ============================================================

export function getVendorDemandPredictions(): DemandPrediction[] {
  return [
    {
      foodId: 'tt-001',
      foodName: 'Hyderabadi Chicken Biryani',
      predictedDemand: 65,
      currentStock: 50,
      confidenceScore: 96,
      peakHour: '12:40 PM - 1:20 PM',
      recommendation: '⚠️ Stock Deficit: Prepare +15 additional portions before 12:30 PM rush.',
      category: 'Biryani',
    },
    {
      foodId: 'tt-004',
      foodName: 'Ghee Podi Masala Dosa',
      predictedDemand: 40,
      currentStock: 60,
      confidenceScore: 92,
      peakHour: '8:20 AM - 8:40 AM',
      recommendation: '✅ Stock Optimal: Keep batter ready for morning surge.',
      category: 'Dosa',
    },
  ];
}

// ============================================================
// 7. VENDOR OVERALL SALES ANALYTICS
// ============================================================

export function getVendorOverallSalesAnalytics() {
  return {
    todayRevenue: 14850,
    revenueGrowthPct: 18.5,
    todayOrders: 124,
    avgOrderValue: 119.7,
    peakOrderHour: '12:40 PM (Lunch Surge)',
    fulfillmentRate: 98.4,
    revenueByDay: [
      { day: 'Mon', revenue: 11200 },
      { day: 'Tue', revenue: 12400 },
      { day: 'Wed', revenue: 13800 },
      { day: 'Thu', revenue: 14850 },
      { day: 'Fri', revenue: 16200 },
      { day: 'Sat', revenue: 9500 },
      { day: 'Sun', revenue: 7800 },
    ],
    salesByCategory: [
      { category: 'Biryani', percentage: 38, revenue: 5643 },
      { category: 'Dosa & Tiffin', percentage: 24, revenue: 3564 },
      { category: 'Burgers & Wraps', percentage: 20, revenue: 2970 },
      { category: 'Beverages', percentage: 18, revenue: 2673 },
    ],
    topSellingDishes: [
      { name: 'Hyderabadi Chicken Biryani', salesCount: 52, revenue: 9360 },
      { name: 'Ghee Podi Masala Dosa', salesCount: 48, revenue: 4560 },
    ],
  };
}

// ============================================================
// 8. EACH COLLEGE ANALYTICS FOR ADMIN DASHBOARD
// ============================================================

export const CAMPUS_COLLEGES_ANALYTICS: CollegeAnalytics[] = [
  {
    id: 'dtu',
    name: 'Delhi Technological University (DTU)',
    location: 'Rohini, Delhi',
    totalRevenue: 248500,
    totalOrders: 2150,
    activeStudents: 2450,
    vendorStallsCount: 5,
    growthPct: 24.5,
    peakWindow: '12:20 PM - 1:00 PM',
    avgOrderValue: 115.5,
    topDishes: [
      { name: 'Hyderabadi Chicken Biryani', salesCount: 420, revenue: 75600 },
      { name: 'Ghee Podi Masala Dosa', salesCount: 380, revenue: 36100 },
      { name: 'Double Cheese Chicken Burger', salesCount: 310, revenue: 49600 },
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 32000 },
      { month: 'Feb', revenue: 38000 },
      { month: 'Mar', revenue: 45000 },
      { month: 'Apr', revenue: 42000 },
      { month: 'May', revenue: 48500 },
      { month: 'Jun', revenue: 43000 },
    ]
  },
  {
    id: 'nsut',
    name: 'Netaji Subhas University of Technology (NSUT)',
    location: 'Dwarka, Delhi',
    totalRevenue: 184200,
    totalOrders: 1680,
    activeStudents: 1800,
    vendorStallsCount: 3,
    growthPct: 18.2,
    peakWindow: '1:00 PM - 1:40 PM',
    avgOrderValue: 109.6,
    topDishes: [
      { name: 'Shahi Paneer Thali', salesCount: 310, revenue: 51150 },
      { name: 'Kulhad Masala Chai', salesCount: 650, revenue: 13000 },
      { name: 'Chilli Chicken Noodles', salesCount: 240, revenue: 36000 },
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 24000 },
      { month: 'Feb', revenue: 28000 },
      { month: 'Mar', revenue: 32000 },
      { month: 'Apr', revenue: 34000 },
      { month: 'May', revenue: 36200 },
      { month: 'Jun', revenue: 30000 },
    ]
  },
  {
    id: 'iitd',
    name: 'Indian Institute of Technology Delhi (IITD)',
    location: 'Hauz Khas, Delhi',
    totalRevenue: 312000,
    totalOrders: 2840,
    activeStudents: 3200,
    vendorStallsCount: 6,
    growthPct: 29.8,
    peakWindow: '12:40 PM - 1:20 PM',
    avgOrderValue: 109.8,
    topDishes: [
      { name: 'Special Chicken Shawarma Roll', salesCount: 540, revenue: 70200 },
      { name: 'Filter Coffee & Medu Vada', salesCount: 490, revenue: 24500 },
      { name: 'Crispy Veg Momos', salesCount: 410, revenue: 41000 },
    ],
    monthlyRevenue: [
      { month: 'Jan', revenue: 42000 },
      { month: 'Feb', revenue: 48000 },
      { month: 'Mar', revenue: 54000 },
      { month: 'Apr', revenue: 52000 },
      { month: 'May', revenue: 61000 },
      { month: 'Jun', revenue: 55000 },
    ]
  },
];

export function getCollegeAnalytics(collegeIdOrName?: string): CollegeAnalytics {
  if (!collegeIdOrName || collegeIdOrName === 'all') {
    // Return aggregated overall platform college metrics
    return {
      id: 'all',
      name: 'All Partnered Colleges (Aggregated)',
      location: 'Across All Campuses',
      totalRevenue: CAMPUS_COLLEGES_ANALYTICS.reduce((acc, c) => acc + c.totalRevenue, 0),
      totalOrders: CAMPUS_COLLEGES_ANALYTICS.reduce((acc, c) => acc + c.totalOrders, 0),
      activeStudents: CAMPUS_COLLEGES_ANALYTICS.reduce((acc, c) => acc + c.activeStudents, 0),
      vendorStallsCount: CAMPUS_COLLEGES_ANALYTICS.reduce((acc, c) => acc + c.vendorStallsCount, 0),
      growthPct: 24.1,
      peakWindow: '12:20 PM - 1:20 PM',
      avgOrderValue: 112.3,
      topDishes: CAMPUS_COLLEGES_ANALYTICS[0].topDishes,
      monthlyRevenue: [
        { month: 'Jan', revenue: 98000 },
        { month: 'Feb', revenue: 114000 },
        { month: 'Mar', revenue: 131000 },
        { month: 'Apr', revenue: 128000 },
        { month: 'May', revenue: 145700 },
        { month: 'Jun', revenue: 128000 },
      ]
    };
  }

  const match = CAMPUS_COLLEGES_ANALYTICS.find(c => 
    c.id.toLowerCase() === collegeIdOrName.toLowerCase() ||
    c.name.toLowerCase().includes(collegeIdOrName.toLowerCase())
  );

  return match || CAMPUS_COLLEGES_ANALYTICS[0];
}
