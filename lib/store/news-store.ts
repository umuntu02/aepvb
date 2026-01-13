import { create } from 'zustand';
import type { News } from '@/lib/db/schema';

interface NewsState {
  news: News[];
  setNews: (news: News[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

export const useNewsStore = create<NewsState>((set) => ({
  news: [],
  setNews: (news) => set({ news }),
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));
