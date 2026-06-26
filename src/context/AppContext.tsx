import { createContext, useContext, useReducer, ReactNode } from 'react';
import { AppState, Habit, HabitCompletion, MoodEntry, Note, Goal, Challenge, FocusSession, Theme, WidgetConfig } from '../types';
import { loadState, saveState, getTodayString, addXp, getRankForLevel } from '../utils/storage';

type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'UPDATE_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'TOGGLE_COMPLETION'; payload: { habitId: string; date: string; notes?: string } }
  | { type: 'SET_MOOD'; payload: MoodEntry }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: Goal }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'ADD_CHALLENGE'; payload: Challenge }
  | { type: 'UPDATE_CHALLENGE'; payload: Challenge }
  | { type: 'DELETE_CHALLENGE'; payload: string }
  | { type: 'ADD_FOCUS_SESSION'; payload: FocusSession }
  | { type: 'UNLOCK_ACHIEVEMENT'; payload: string }
  | { type: 'UPDATE_THEME'; payload: Theme }
  | { type: 'UPDATE_WIDGETS'; payload: WidgetConfig[] }
  | { type: 'CLAIM_DAILY_REWARD' }
  | { type: 'RESET_STATE' };

const initialState = loadState();

function updateAchievements(state: AppState, updates: Partial<AppState>): AppState {
  const newAchievements = [...state.achievements];
  const newStats = { ...state.stats, ...updates.stats };

  // Update streak achievements
  const streak100 = newAchievements.find(a => a.id === 'streak-100');
  const streak30 = newAchievements.find(a => a.id === 'streak-30');
  const streak7 = newAchievements.find(a => a.id === 'streak-7');
  const habit100 = newAchievements.find(a => a.id === 'habit-100');
  const habit500 = newAchievements.find(a => a.id === 'habit-500');
  const habit1000 = newAchievements.find(a => a.id === 'habit-1000');
  const lotusAwakened = newAchievements.find(a => a.id === 'lotus-awakened');

  if (streak7) streak7.progress = newStats.currentStreak;
  if (streak30) streak30.progress = newStats.currentStreak;
  if (streak100) streak100.progress = newStats.currentStreak;
  if (habit100) habit100.progress = newStats.totalHabits;
  if (habit500) habit500.progress = newStats.totalHabits;
  if (habit1000) habit1000.progress = newStats.totalHabits;
  if (lotusAwakened) lotusAwakened.progress = newStats.level;

  // Unlock achievements
  newAchievements.forEach(achievement => {
    if (!achievement.unlockedAt && achievement.progress >= achievement.target) {
      achievement.unlockedAt = new Date().toISOString();
    }
  });

  return { ...state, achievements: newAchievements, stats: newStats };
}

function reducer(state: AppState, action: Action): AppState {
  let newState: AppState;

  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_HABIT':
      newState = { ...state, habits: [...state.habits, action.payload] };
      break;

    case 'UPDATE_HABIT':
      newState = {
        ...state,
        habits: state.habits.map(h => h.id === action.payload.id ? action.payload : h),
      };
      break;

    case 'DELETE_HABIT':
      newState = {
        ...state,
        habits: state.habits.filter(h => h.id !== action.payload),
        completions: state.completions.filter(c => c.habitId !== action.payload),
      };
      break;

    case 'TOGGLE_COMPLETION': {
      const { habitId, date, notes } = action.payload;
      const existingIndex = state.completions.findIndex(
        c => c.habitId === habitId && c.date === date
      );

      let newCompletions: HabitCompletion[];
      let xpChange = 0;
      let totalHabitsChange = 0;
      const now = new Date();
      const hour = now.getHours();

      if (existingIndex >= 0) {
        const existing = state.completions[existingIndex];
        if (existing.completed) {
          // Uncompleting
          newCompletions = state.completions.map((c, i) =>
            i === existingIndex ? { ...c, completed: false, completedAt: undefined, notes: undefined } : c
          );
          xpChange = -10;
          totalHabitsChange = -1;
        } else {
          newCompletions = state.completions.map((c, i) =>
            i === existingIndex ? { ...c, completed: true, completedAt: now.toISOString(), notes } : c
          );
          xpChange = 10;
          totalHabitsChange = 1;
        }
      } else {
        newCompletions = [...state.completions, {
          habitId,
          date,
          completed: true,
          completedAt: now.toISOString(),
          notes,
        }];
        xpChange = 10;
        totalHabitsChange = 1;
      }

      const newTotalHabits = Math.max(0, state.stats.totalHabits + totalHabitsChange);
      const { xp, level } = addXp(state.stats.xp, state.stats.level, xpChange);
      const { rank, title } = getRankForLevel(level);

      // Check for time-based achievements
      let newAchievements = [...state.achievements];
      if (hour < 6 && totalHabitsChange > 0) {
        newAchievements = newAchievements.map(a =>
          a.id === 'early-bird' && !a.unlockedAt
            ? { ...a, progress: 1, unlockedAt: now.toISOString() }
            : a
        );
      }
      if (hour >= 22 && totalHabitsChange > 0) {
        newAchievements = newAchievements.map(a =>
          a.id === 'night-owl' && !a.unlockedAt
            ? { ...a, progress: 1, unlockedAt: now.toISOString() }
            : a
        );
      }

      newState = {
        ...state,
        completions: newCompletions,
        achievements: newAchievements,
        stats: {
          ...state.stats,
          xp,
          level,
          rank,
          title,
          totalHabits: newTotalHabits,
          coins: state.stats.coins + (xpChange > 0 ? 5 : -5),
        },
      };
      break;
    }

    case 'SET_MOOD': {
      const existingIndex = state.moods.findIndex(m => m.date === action.payload.date);
      let newMoods: MoodEntry[];
      if (existingIndex >= 0) {
        newMoods = state.moods.map((m, i) =>
          i === existingIndex ? action.payload : m
        );
      } else {
        newMoods = [...state.moods, action.payload];
      }
      newState = { ...state, moods: newMoods };
      break;
    }

    case 'ADD_NOTE':
      newState = { ...state, notes: [...state.notes, action.payload] };
      break;

    case 'UPDATE_NOTE':
      newState = {
        ...state,
        notes: state.notes.map(n => n.id === action.payload.id ? action.payload : n),
      };
      break;

    case 'DELETE_NOTE':
      newState = { ...state, notes: state.notes.filter(n => n.id !== action.payload) };
      break;

    case 'ADD_GOAL':
      newState = { ...state, goals: [...state.goals, action.payload] };
      break;

    case 'UPDATE_GOAL':
      newState = {
        ...state,
        goals: state.goals.map(g => g.id === action.payload.id ? action.payload : g),
      };
      break;

    case 'DELETE_GOAL':
      newState = { ...state, goals: state.goals.filter(g => g.id !== action.payload) };
      break;

    case 'ADD_CHALLENGE':
      newState = { ...state, challenges: [...state.challenges, action.payload] };
      break;

    case 'UPDATE_CHALLENGE':
      newState = {
        ...state,
        challenges: state.challenges.map(c => c.id === action.payload.id ? action.payload : c),
      };
      break;

    case 'DELETE_CHALLENGE':
      newState = { ...state, challenges: state.challenges.filter(c => c.id !== action.payload) };
      break;

    case 'ADD_FOCUS_SESSION': {
      const { xp, level } = addXp(state.stats.xp, state.stats.level, action.payload.duration);
      const { rank, title } = getRankForLevel(level);
      newState = {
        ...state,
        focusSessions: [...state.focusSessions, action.payload],
        stats: { ...state.stats, xp, level, rank, title },
      };
      break;
    }

    case 'UNLOCK_ACHIEVEMENT': {
      const achievement = state.achievements.find(a => a.id === action.payload);
      if (achievement && !achievement.unlockedAt) {
        const { xp, level } = addXp(state.stats.xp, state.stats.level, 50);
        const { rank, title } = getRankForLevel(level);
        newState = {
          ...state,
          achievements: state.achievements.map(a =>
            a.id === action.payload ? { ...a, unlockedAt: new Date().toISOString() } : a
          ),
          stats: { ...state.stats, xp, level, rank, title, coins: state.stats.coins + 20 },
        };
      } else {
        newState = state;
      }
      break;
    }

    case 'UPDATE_THEME':
      newState = { ...state, theme: action.payload };
      break;

    case 'UPDATE_WIDGETS':
      newState = { ...state, widgets: action.payload };
      break;

    case 'CLAIM_DAILY_REWARD': {
      const today = getTodayString();
      if (state.dailyRewardClaimed !== today) {
        const { xp, level } = addXp(state.stats.xp, state.stats.level, 25);
        const { rank, title } = getRankForLevel(level);
        newState = {
          ...state,
          dailyRewardClaimed: today,
          stats: { ...state.stats, xp, level, rank, title, coins: state.stats.coins + 10 },
        };
      } else {
        newState = state;
      }
      break;
    }

    case 'RESET_STATE':
      newState = loadState();
      break;

    default:
      return state;
  }

  // Update streak
  const today = getTodayString();
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  const todayCompletions = newState.completions.filter(c => c.date === today);

  const allHabits = newState.habits;
  const todayCompletedAll = allHabits.length > 0 && todayCompletions.filter(c => c.completed).length === allHabits.length;

  let newStreak = newState.stats.currentStreak;
  if (todayCompletedAll) {
    if (newState.lastActiveDate !== today) {
      newStreak++;
    }
  } else if (newState.lastActiveDate !== today && newState.lastActiveDate !== yesterday) {
    newStreak = 0;
  }

  newState = updateAchievements(newState, {
    stats: {
      ...newState.stats,
      currentStreak: Math.max(newStreak, newState.stats.currentStreak),
      bestStreak: Math.max(newStreak, newState.stats.bestStreak),
      totalDays: newState.stats.totalDays + (newState.lastActiveDate !== today ? 1 : 0),
    },
  });

  newState = { ...newState, lastActiveDate: today };
  saveState(newState);
  return newState;
}

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
