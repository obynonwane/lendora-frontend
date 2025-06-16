import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { encryptedStorage } from "@/app/utils/zustandEncryptedStorage";

export interface User {
  id: string;
  email: string;
  name: string;
}

interface UserState {
  user: User | null;
  isAuthenticated: boolean;
  authStateLoaded: boolean;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      authStateLoaded: false,

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => encryptedStorage),

      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),

      // ✅ CORRECT: Use Zustand global setState here
      onRehydrateStorage: () => {
        return () => {
          setTimeout(() => {
            useUserStore.setState({ authStateLoaded: true });
          }, 0);
        };
      },
    }
  )
);
