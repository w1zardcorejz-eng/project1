// Habit Types
export type HabitCategory = 'morning' | 'day' | 'evening' | 'night' | 'custom';
export type HabitDifficulty = 'easy' | 'medium' | 'hard';
export type HabitRepeatType = 'daily' | 'weekly' | 'custom';

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  category: HabitCategory;
  reminder?: string;
  difficulty: HabitDifficulty;
  repeat: { type: HabitRepeatType; days?: number[] };
  createdAt: string;
  notes?: string;
  timerMinutes?: number;
}

export interface HabitCompletion {
  habitId: string;
  date: string;
  completed: boolean;
  completedAt?: string;
  notes?: string;
}

// Mood Types
export type MoodType = 'excellent' | 'good' | 'normal' | 'bad' | 'terrible';

export interface MoodEntry {
  date: string;
  mood: MoodType;
  notes?: string;
}

// Achievement Types
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: AchievementRarity;
  unlockedAt?: string;
  progress: number;
  target: number;
}

// Goal Types
export interface Goal {
  id: string;
  name: string;
  description?: string;
  habits: string[];
  deadline?: string;
  createdAt: string;
}

// Challenge Types
export interface Challenge {
  id: string;
  name: string;
  description: string;
  duration: number;
  habits: string[];
  startDate: string;
  completed: boolean;
}

// Focus Timer types
export interface FocusSession {
  id: string;
  duration: number;
  type: 'pomodoro' | 'custom' | 'long';
  completedAt: string;
  habitId?: string;
}

// Note Types
export interface Note {
  id: string;
  date: string;
  content: string;
  type: 'journal' | 'reflection' | 'gratitude' | 'idea';
  mood?: MoodType;
  createdAt?: string;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'custom';
export type BackgroundTheme = 'forest' | 'mountain' | 'japanese-garden' | 'magic-lake' | 'floating-islands' | 'moon-garden' | 'autumn-forest' | 'northern-lights' | 'mystic-temple';

export interface CustomTheme {
  primaryColor: string;
  accentColor: string;
  backgroundTint: string;
  glassColor: string;
  glowColor: string;
  buttonColor: string;
  textColor: string;
  shadowIntensity: number;
  blurIntensity: number;
  cornerRadius: number;
  animationSpeed: number;
}

export interface Theme {
  mode: ThemeMode;
  background: BackgroundTheme;
  custom?: CustomTheme;
}

// Gamification Types
export interface UserStats {
  xp: number;
  level: number;
  coins: number;
  rank: string;
  title: string;
  currentStreak: number;
  bestStreak: number;
  totalHabits: number;
  totalDays: number;
}

// Navigation
export type NavView = 'home' | 'habits' | 'calendar' | 'analytics' | 'achievements' | 'profile' | 'focus' | 'notes' | 'goals' | 'challenges';

// Widget order for home screen
export type WidgetType = 'progress' | 'streak' | 'mood' | 'quickActions' | 'todayHabits' | 'quote' | 'level' | 'xp';

export interface WidgetConfig {
  id: WidgetType;
  visible: boolean;
  order: number;
}

// App State
export interface AppState {
  habits: Habit[];
  completions: HabitCompletion[];
  moods: MoodEntry[];
  achievements: Achievement[];
  goals: Goal[];
  challenges: Challenge[];
  notes: Note[];
  focusSessions: FocusSession[];
  stats: UserStats;
  theme: Theme;
  widgets: WidgetConfig[];
  lastActiveDate: string;
  dailyRewardClaimed: string | null;
}
