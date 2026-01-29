import AsyncStorage from '@react-native-async-storage/async-storage';
import { Question } from '@/data/questions';

export interface PastQuestionSet {
  id: string;
  name: string;
  year: number;
  season: 'spring' | 'autumn';
  questions: Question[];
  createdAt: string;
  isActive: boolean;
}

export interface PastQuestionsState {
  sets: PastQuestionSet[];
  activeSets: string[];
}

const STORAGE_KEY = 'past_questions_state';

export const pastQuestionsManager = {
  // 過去問題セットの保存
  async savePastQuestionSet(set: PastQuestionSet): Promise<void> {
    try {
      const state = await this.getState();
      const existingIndex = state.sets.findIndex(s => s.id === set.id);
      
      if (existingIndex >= 0) {
        state.sets[existingIndex] = set;
      } else {
        state.sets.push(set);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to save past question set:', error);
      throw error;
    }
  },

  // 過去問題セットの削除
  async deletePastQuestionSet(id: string): Promise<void> {
    try {
      const state = await this.getState();
      state.sets = state.sets.filter(s => s.id !== id);
      state.activeSets = state.activeSets.filter(setId => setId !== id);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to delete past question set:', error);
      throw error;
    }
  },

  // 過去問題セットの有効化
  async activatePastQuestionSet(id: string): Promise<void> {
    try {
      const state = await this.getState();
      if (!state.activeSets.includes(id)) {
        state.activeSets.push(id);
      }
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to activate past question set:', error);
      throw error;
    }
  },

  // 過去問題セットの無効化
  async deactivatePastQuestionSet(id: string): Promise<void> {
    try {
      const state = await this.getState();
      state.activeSets = state.activeSets.filter(setId => setId !== id);
      
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (error) {
      console.error('Failed to deactivate past question set:', error);
      throw error;
    }
  },

  // 全過去問題セットの取得
  async getPastQuestionSets(): Promise<PastQuestionSet[]> {
    try {
      const state = await this.getState();
      return state.sets;
    } catch (error) {
      console.error('Failed to get past question sets:', error);
      return [];
    }
  },

  // 有効な過去問題セットの取得
  async getActivePastQuestionSets(): Promise<PastQuestionSet[]> {
    try {
      const state = await this.getState();
      return state.sets.filter(s => state.activeSets.includes(s.id));
    } catch (error) {
      console.error('Failed to get active past question sets:', error);
      return [];
    }
  },

  // 有効な過去問題の全取得
  async getActiveQuestions(): Promise<Question[]> {
    try {
      const activeSets = await this.getActivePastQuestionSets();
      const questions: Question[] = [];
      
      activeSets.forEach(set => {
        questions.push(...set.questions);
      });
      
      return questions;
    } catch (error) {
      console.error('Failed to get active questions:', error);
      return [];
    }
  },

  // 状態の取得
  async getState(): Promise<PastQuestionsState> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return { sets: [], activeSets: [] };
    } catch (error) {
      console.error('Failed to get past questions state:', error);
      return { sets: [], activeSets: [] };
    }
  },

  // 状態のリセット
  async resetState(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to reset past questions state:', error);
      throw error;
    }
  },
};
