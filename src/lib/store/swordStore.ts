import { create } from "zustand";
import { Part, Sword } from "../types/schema";

interface SwordState {
  currentSword: Sword | null;
  availableParts: Part[];
  isLoading: boolean;
  error: string | null;

  // 검 관련 액션
  setCurrentSword: (sword: Sword) => void;
  evolveSword: () => Promise<void>;
  changePart: (partType: string, partId: string) => Promise<void>;

  // 파츠 관련 액션
  setAvailableParts: (parts: Part[]) => void;
  addPart: (part: Part) => void;

  // 상태 관련 액션
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useSwordStore = create<SwordState>((set, get) => ({
  currentSword: null,
  availableParts: [],
  isLoading: false,
  error: null,

  // 검 관련 액션
  setCurrentSword: (sword) => set({ currentSword: sword }),

  evolveSword: async () => {
    const { currentSword } = get();
    if (!currentSword) return;

    set({ isLoading: true, error: null });

    try {
      // 여기서 실제로는 API 호출을 통해 검 진화 처리를 해야 함
      // 프로토타입에서는 로컬 상태만 업데이트
      const evolvedSword: Sword = {
        ...currentSword,
        stage: currentSword.stage + 1,
        stats: {
          attack: currentSword.stats.attack + 10,
          defense: currentSword.stats.defense + 5,
          magic: currentSword.stats.magic + 3,
        },
        updatedAt: new Date().toISOString(),
      };

      set({ currentSword: evolvedSword, isLoading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "검 진화 중 오류가 발생했습니다.";
      set({ error: errorMessage, isLoading: false });
    }
  },

  changePart: async (partType, partId) => {
    const { currentSword } = get();
    if (!currentSword) return;

    set({ isLoading: true, error: null });

    try {
      // 여기서 실제로는 API 호출을 통해 파츠 변경 처리를 해야 함
      // 프로토타입에서는 로컬 상태만 업데이트
      const updatedSword: Sword = {
        ...currentSword,
        parts: {
          ...currentSword.parts,
          [partType]: partId,
        },
        updatedAt: new Date().toISOString(),
      };

      set({ currentSword: updatedSword, isLoading: false });
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "파츠 변경 중 오류가 발생했습니다.";
      set({ error: errorMessage, isLoading: false });
    }
  },

  // 파츠 관련 액션
  setAvailableParts: (parts) => set({ availableParts: parts }),
  addPart: (part) =>
    set((state) => ({
      availableParts: [...state.availableParts, part],
    })),

  // 상태 관련 액션
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),
}));
