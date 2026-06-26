import { AppState, UserStats, Achievement, WidgetConfig } from '../types';

const STORAGE_KEY = 'habit-tracker-pro';

const defaultStats: UserStats = {
  xp: 0,
  level: 1,
  coins: 0,
  rank: 'Beginner',
  title: 'Seedling',
  currentStreak: 0,
  bestStreak: 0,
  totalHabits: 0,
  totalDays: 0,
};

const defaultAchievements: Achievement[] = [
  { id: 'streak-7', name: 'Week Warrior', description: 'Maintain a 7-day streak', icon: '🔥', rarity: 'common', progress: 0, target: 7 },
  { id: 'streak-30', name: 'Monthly Master', description: 'Maintain a 30-day streak', icon: '💎', rarity: 'rare', progress: 0, target: 30 },
  { id: 'streak-100', name: 'Century Champion', description: 'Maintain a 100-day streak', icon: '👑', rarity: 'epic', progress: 0, target: 100 },
  { id: 'habit-100', name: 'Habit Hero', description: 'Complete 100 habits', icon: '⭐', rarity: 'common', progress: 0, target: 100 },
  { id: 'habit-500', name: 'Dedication Divinity', description: 'Complete 500 habits', icon: '🌟', rarity: 'rare', progress: 0, target: 500 },
  { id: 'habit-1000', name: 'Millennium Monk', description: 'Complete 1000 habits', icon: '✨', rarity: 'legendary', progress: 0, target: 1000 },
  { id: 'perfect-day', name: 'Perfect Day', description: 'Complete all habits in a day', icon: '🎯', rarity: 'rare', progress: 0, target: 1 },
  { id: 'early-bird', name: 'Early Bird', description: 'Complete a habit before 6 AM', icon: '🌅', rarity: 'common', progress: 0, target: 1 },
  { id: 'night-owl', name: 'Night Owl', description: 'Complete a habit after 10 PM', icon: '🦉', rarity: 'common', progress: 0, target: 1 },
  { id: 'lotus-awakened', name: 'Lotus Awakened', description: 'Reach level 10', icon: '🪷', rarity: 'epic', progress: 0, target: 10 },
];

const defaultWidgets: WidgetConfig[] = [
  { id: 'progress', visible: true, order: 1 },
  { id: 'level', visible: true, order: 2 },
  { id: 'streak', visible: true, order: 3 },
  { id: 'mood', visible: true, order: 4 },
  { id: 'quickActions', visible: true, order: 5 },
  { id: 'todayHabits', visible: true, order: 6 },
  { id: 'quote', visible: true, order: 7 },
  { id: 'xp', visible: true, order: 8 },
];

const defaultState: AppState = {
  habits: [],
  completions: [],
  moods: [],
  achievements: defaultAchievements,
  goals: [],
  challenges: [],
  notes: [],
  focusSessions: [],
  stats: defaultStats,
  theme: { mode: 'dark', background: 'magic-lake' },
  widgets: defaultWidgets,
  lastActiveDate: new Date().toISOString().split('T')[0],
  dailyRewardClaimed: null,
};

export function loadState(): AppState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultState, ...parsed };
    }
  } catch (e) {
    console.error('Failed to load state:', e);
  }
  return defaultState;
}

export function saveState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state:', e);
  }
}

export function resetState(): AppState {
  localStorage.removeItem(STORAGE_KEY);
  return defaultState;
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function isToday(dateString: string): boolean {
  return dateString === getTodayString();
}

export function getDateFromISOString(isoString: string): string {
  return isoString.split('T')[0];
}

export function calculateXpForLevel(level: number): number {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function addXp(currentXp: number, currentLevel: number, xpToAdd: number): { xp: number; level: number; leveledUp: boolean } {
  let xp = currentXp + xpToAdd;
  let level = currentLevel;
  let leveledUp = false;

  while (xp >= calculateXpForLevel(level)) {
    xp -= calculateXpForLevel(level);
    level++;
    leveledUp = true;
  }

  return { xp, level, leveledUp };
}

export function getRankForLevel(level: number): { rank: string; title: string } {
  if (level >= 50) return { rank: 'Transcendent', title: 'Lotus Master' };
  if (level >= 40) return { rank: 'Enlightened', title: 'Zen Guardian' };
  if (level >= 30) return { rank: 'Master', title: 'Spirit Sage' };
  if (level >= 20) return { rank: 'Expert', title: 'Mind Weaver' };
  if (level >= 15) return { rank: 'Advanced', title: 'Dream Walker' };
  if (level >= 10) return { rank: 'Skilled', title: 'Lotus Keeper' };
  if (level >= 5) return { rank: 'Apprentice', title: 'Dawn Seeker' };
  return { rank: 'Beginner', title: 'Seedling' };
}
