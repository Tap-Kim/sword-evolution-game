import { create } from "zustand";
import { User } from "../types/schema";
import { supabase } from "../supabase/client";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;

  // 인증 관련 액션
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    nickname: string
  ) => Promise<void>;
  logout: () => Promise<void>;

  // 사용자 정보 관련 액션
  updateProfile: (updates: Partial<User>) => Promise<void>;

  // 상태 관련 액션
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,

  // 인증 관련 액션
  login: async (email, password) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // 사용자 정보 가져오기
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single();

        if (userError) throw userError;

        set({
          user: userData as User,
          isLoading: false,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "로그인 중 오류가 발생했습니다.";
      set({ error: errorMessage, isLoading: false });
    }
  },

  register: async (email, password, nickname) => {
    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // 사용자 프로필 생성
        const newUser: Omit<User, "id"> = {
          nickname,
          email,
          joinDate: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
          totalPlayTime: 0,
        };

        const { error: profileError } = await supabase
          .from("users")
          .insert([{ id: data.user.id, ...newUser }]);

        if (profileError) throw profileError;

        set({
          user: { id: data.user.id, ...newUser } as User,
          isLoading: false,
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "회원가입 중 오류가 발생했습니다.";
      set({ error: errorMessage, isLoading: false });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });

    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      set({ user: null, isLoading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "로그아웃 중 오류가 발생했습니다.";
      set({ error: errorMessage, isLoading: false });
    }
  },

  // 사용자 정보 관련 액션
  updateProfile: async (updates) => {
    set({ isLoading: true, error: null });

    try {
      const { user } = useAuthStore.getState();
      if (!user) throw new Error("로그인이 필요합니다.");

      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);

      if (error) throw error;

      set({
        user: { ...user, ...updates },
        isLoading: false,
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "프로필 업데이트 중 오류가 발생했습니다.";
      set({ error: errorMessage, isLoading: false });
    }
  },

  // 상태 관련 액션
  setUser: (user) => set({ user }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
