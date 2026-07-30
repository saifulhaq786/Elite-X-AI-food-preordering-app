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

  // Profile actions (backed by API)
  loadProfile: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  setCollege: (college: string) => Promise<void>;
  clearUser: () => void;

  // Smart Card actions (backed by API)
  topUpSmartCard: (amount: number) => Promise<void>;
  toggleCardFreeze: () => Promise<void>;
  setDailyLimit: (limit: number) => Promise<void>;
  deductSmartCardBalance: (amount: number) => Promise<boolean>;
}

function profileToUser(profile: UserProfile): User {
  return {
    id: profile.id,
    name: profile.name,
    email: profile.email,
    mobile: profile.phone,
    college: profile.college,
    avatar: profile.avatar,
    role: profile.role,
    orderCount: profile.orderCount,
    walletBalance: profile.walletBalance,
    smartCard: profile.smartCard,
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
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

        // Optimistic update
        set({ user: { ...state.user, ...data } });

        try {
          const apiData: Record<string, unknown> = {};
          if (data.name !== undefined) apiData.name = data.name;
          if (data.mobile !== undefined) apiData.phone = data.mobile;
          if (data.college !== undefined) apiData.college = data.college;
          if (data.avatar !== undefined) apiData.avatar = data.avatar;

          await updateUserProfile(apiData as Parameters<typeof updateUserProfile>[0]);
        } catch (error) {
          set({ user: state.user }); // Revert
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

        // Optimistic update
        const newBalance = state.user.smartCard.balance + amount;
        set({
          user: {
            ...state.user,
            smartCard: { ...state.user.smartCard, balance: newBalance },
          },
        });

        try {
          const result = await apiTopUp(amount);
          // Update with server-confirmed balance
          set({
            user: {
              ...get().user!,
              smartCard: { ...get().user!.smartCard, balance: result.newBalance },
            },
          });
        } catch (error) {
          set({ user: state.user }); // Revert
          console.error('Top-up failed:', error);
          throw error;
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
          set({ user: state.user }); // Revert
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
          set({ user: state.user }); // Revert
          console.error('Set daily limit failed:', error);
        }
      },

      deductSmartCardBalance: async (amount) => {
        const state = get();
        if (!state.user || state.user.smartCard.isFrozen || state.user.smartCard.balance < amount) {
          return false;
        }

        // Optimistic update
        set({
          user: {
            ...state.user,
            smartCard: {
              ...state.user.smartCard,
              balance: state.user.smartCard.balance - amount,
              lastTappedAt: new Date().toISOString(),
            },
          },
        });

        try {
          const result = await apiDeduct(amount);
          if (!result.success) {
            set({ user: state.user }); // Revert
            return false;
          }
          // Update with server balance
          set({
            user: {
              ...get().user!,
              smartCard: { ...get().user!.smartCard, balance: result.newBalance },
            },
          });
          return true;
        } catch (error) {
          set({ user: state.user }); // Revert
          console.error('Deduction failed:', error);
          return false;
        }
      },
    }),
    {
      name: 'auth-storage-v4',
      storage: createJSONStorage(() =>
        typeof window !== 'undefined'
          ? localStorage
          : {
              getItem: () => null,
              setItem: () => {},
              removeItem: () => {},
              length: 0,
              clear: () => {},
              key: () => null,
            }
      ),
    }
  )
);
