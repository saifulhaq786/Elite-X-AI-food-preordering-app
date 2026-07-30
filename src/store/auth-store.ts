import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import {
  fetchUserProfile,
  updateUserProfile,
  topUpSmartCard as apiTopUp,
  deductSmartCard as apiDeduct,
  toggleSmartCardFreeze as apiToggleFreeze,
  setSmartCardDailyLimit as apiSetLimit,
  type UserProfile,
} from '@/lib/api-client';

export interface SmartCardDetails {
  cardId: string;
  balance: number;
  isFrozen: boolean;
  dailyLimit: number;
  nfcToken: string;
  lastTappedAt: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  mobile: string;
  college: string;
  avatar?: string;
  role?: string;
  orderCount: number;
  walletBalance: number;
  smartCard: SmartCardDetails;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setCollege: (college: string) => Promise<void>;
  clearUser: () => void;

  topUpSmartCard: (amount: number) => Promise<void>;
  toggleCardFreeze: () => Promise<void>;
  setDailyLimit: (limit: number) => Promise<void>;
  deductSmartCardBalance: (amount: number) => Promise<boolean>;
}

function profileToUser(profile: UserProfile): User {
  const unifiedBalance = profile.smartCard?.balance ?? profile.walletBalance ?? 500;
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    mobile: profile.phone,
    college: profile.college,
    avatar: profile.avatar,
    role: profile.role,
    orderCount: profile.orderCount,
    walletBalance: unifiedBalance,
    smartCard: {
      ...profile.smartCard,
      balance: unifiedBalance,
    },
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: {
        id: 'u_101',
        name: 'Saiful Haq',
        email: 'saifulhaqff@gmail.com',
        mobile: '+91 98765 43210',
        college: 'Elite Tech Campus',
        avatar: '',
        role: 'student',
        orderCount: 12,
        walletBalance: 500,
        smartCard: {
          cardId: 'EX-8942-9901',
          balance: 500,
          isFrozen: false,
          dailyLimit: 1000,
          nfcToken: 'NFC-994102-EX',
          lastTappedAt: new Date().toISOString(),
        },
      },
      isAuthenticated: true,
      isLoading: false,

      loadProfile: async () => {
        set({ isLoading: true });
        try {
          const profile = await fetchUserProfile();
          set({
            user: profileToUser(profile),
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          console.error('Failed to load profile:', error);
          set({ isLoading: false });
        }
      },

      updateProfile: async (data) => {
        const state = get();
        if (!state.user) return;

        set({ user: { ...state.user, ...data } });

        try {
          const apiData: Record<string, unknown> = {};
          if (data.name !== undefined) apiData.name = data.name;
          if (data.mobile !== undefined) apiData.phone = data.mobile;
          if (data.college !== undefined) apiData.college = data.college;
          if (data.avatar !== undefined) apiData.avatar = data.avatar;

          await updateUserProfile(apiData as Parameters<typeof updateUserProfile>[0]);
        } catch (error) {
          set({ user: state.user });
          console.error('Profile update failed:', error);
        }
      },

      setCollege: async (college) => {
        const state = get();
        if (!state.user) return;

        set({ user: { ...state.user, college } });

        try {
          await updateUserProfile({ college });
        } catch (error) {
          set({ user: state.user });
          console.error('College update failed:', error);
        }
      },

      clearUser: () => {
        set({ user: null, isAuthenticated: false });
      },

      topUpSmartCard: async (amount) => {
        const state = get();
        if (!state.user) return;

        const currentBal = state.user.smartCard?.balance ?? state.user.walletBalance ?? 500;
        const newBalance = currentBal + amount;

        set({
          user: {
            ...state.user,
            walletBalance: newBalance,
            smartCard: { ...state.user.smartCard, balance: newBalance },
          },
        });

        try {
          const result = await apiTopUp(amount);
          const confirmedBal = result.newBalance ?? newBalance;
          set({
            user: {
              ...get().user!,
              walletBalance: confirmedBal,
              smartCard: { ...get().user!.smartCard, balance: confirmedBal },
            },
          });
        } catch (error) {
          console.error('Top-up API failed, using optimistic balance:', error);
        }
      },

      toggleCardFreeze: async () => {
        const state = get();
        if (!state.user) return;

        const newFrozen = !state.user.smartCard.isFrozen;
        set({
          user: {
            ...state.user,
            smartCard: { ...state.user.smartCard, isFrozen: newFrozen },
          },
        });

        try {
          const result = await apiToggleFreeze();
          set({
            user: {
              ...get().user!,
              smartCard: { ...get().user!.smartCard, isFrozen: result.isFrozen },
            },
          });
        } catch (error) {
          console.error('Toggle freeze failed:', error);
        }
      },

      setDailyLimit: async (limit) => {
        const state = get();
        if (!state.user) return;

        set({
          user: {
            ...state.user,
            smartCard: { ...state.user.smartCard, dailyLimit: limit },
          },
        });

        try {
          await apiSetLimit(limit);
        } catch (error) {
          console.error('Set daily limit failed:', error);
        }
      },

      deductSmartCardBalance: async (amount) => {
        const state = get();
        if (!state.user || state.user.smartCard.isFrozen || state.user.smartCard.balance < amount) {
          return false;
        }

        const newBalance = Math.max(0, state.user.smartCard.balance - amount);

        set({
          user: {
            ...state.user,
            walletBalance: newBalance,
            smartCard: {
              ...state.user.smartCard,
              balance: newBalance,
              lastTappedAt: new Date().toISOString(),
            },
          },
        });

        try {
          await apiDeduct(amount);
        } catch (error) {
          console.error('Deduct API failed, using optimistic balance:', error);
        }

        return true;
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => (typeof window !== 'undefined' ? localStorage : {
        getItem: () => null,
        setItem: () => {},
        removeItem: () => {},
      })),
    }
  )
);
