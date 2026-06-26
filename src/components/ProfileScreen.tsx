import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Palette, Moon, Sun, Database, ChevronRight, Timer, BookOpen, Target } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard, GlassButton } from './Glass';
import { ThemeBuilder } from './ThemeBuilder';
import { BackgroundTheme } from '../types';
import { resetState } from '../utils/storage';

const backgroundThemes: { id: BackgroundTheme; name: string; emoji: string }[] = [
  { id: 'forest', name: 'Forest', emoji: '🌲' },
  { id: 'mountain', name: 'Mountain', emoji: '🏔️' },
  { id: 'japanese-garden', name: 'Japanese Garden', emoji: '🌸' },
  { id: 'magic-lake', name: 'Magic Lake', emoji: '✨' },
  { id: 'floating-islands', name: 'Floating Islands', emoji: '🏝️' },
  { id: 'moon-garden', name: 'Moon Garden', emoji: '🌙' },
  { id: 'autumn-forest', name: 'Autumn Forest', emoji: '🍂' },
  { id: 'northern-lights', name: 'Northern Lights', emoji: '🌌' },
  { id: 'mystic-temple', name: 'Mystic Temple', emoji: '⛩️' },
];

export function ProfileScreen() {
  const { state, dispatch } = useApp();
  const [showThemeBuilder, setShowThemeBuilder] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    const newState = resetState();
    dispatch({ type: 'LOAD_STATE', payload: newState });
    setShowResetConfirm(false);
  };

  return (
    <div className="pb-28 px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-light text-white">Profile</h1>
        <p className="text-white/50 text-sm mt-1">Customize your experience</p>
      </motion.div>

      {/* User Stats Card */}
      <GlassCard className="mb-6 p-4">
        <div className="flex items-center gap-4 mb-4">
          <motion.div
            className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
            style={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
              border: '1px solid rgba(167, 139, 250, 0.4)',
              boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)',
            }}
            animate={{
              boxShadow: [
                '0 0 20px rgba(167, 139, 250, 0.3)',
                '0 0 30px rgba(167, 139, 250, 0.5)',
                '0 0 20px rgba(167, 139, 250, 0.3)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            🪷
          </motion.div>
          <div>
            <h2 className="text-xl text-white font-light">{state.stats.title}</h2>
            <p className="text-white/50 text-sm">{state.stats.rank} • Level {state.stats.level}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="p-2 rounded-xl bg-white/5">
            <p className="text-lg text-white">{state.stats.totalHabits}</p>
            <p className="text-xs text-white/40">Habits Done</p>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <p className="text-lg text-white">{state.stats.currentStreak}</p>
            <p className="text-xs text-white/40">Day Streak</p>
          </div>
          <div className="p-2 rounded-xl bg-white/5">
            <p className="text-lg text-white">{state.stats.bestStreak}</p>
            <p className="text-xs text-white/40">Best Streak</p>
          </div>
        </div>
      </GlassCard>

      {/* Theme Selection */}
      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h3 className="text-white/70 text-sm mb-3 px-1 flex items-center gap-2">
          <Palette size={16} />
          Background Theme
        </h3>
        <GlassCard className="p-3">
          <div className="grid grid-cols-3 gap-2">
            {backgroundThemes.map((theme) => {
              const isSelected = state.theme.background === theme.id;
              return (
                <motion.button
                  key={theme.id}
                  className="p-3 rounded-xl text-center"
                  style={{
                    background: isSelected
                      ? 'rgba(167, 139, 250, 0.3)'
                      : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${isSelected
                      ? 'rgba(167, 139, 250, 0.5)'
                      : 'rgba(255, 255, 255, 0.1)'
                    }`,
                  }}
                  onClick={() => {
                    dispatch({
                      type: 'UPDATE_THEME',
                      payload: { ...state.theme, background: theme.id },
                    });
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-2xl">{theme.emoji}</span>
                  <p className="text-xs text-white/60 mt-1">{theme.name}</p>
                </motion.button>
              );
            })}
          </div>
        </GlassCard>
      </motion.section>

      {/* Theme Mode Toggle */}
      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {state.theme.mode === 'dark' ? (
                <Moon size={20} className="text-purple-400" />
              ) : (
                <Sun size={20} className="text-yellow-400" />
              )}
              <span className="text-white/80">Dark Mode</span>
            </div>
            <motion.button
              className="w-12 h-7 rounded-full p-1"
              style={{
                background: state.theme.mode === 'dark'
                  ? 'rgba(167, 139, 250, 0.4)'
                  : 'rgba(255, 255, 255, 0.2)',
              }}
              onClick={() => {
                dispatch({
                  type: 'UPDATE_THEME',
                  payload: {
                    ...state.theme,
                    mode: state.theme.mode === 'dark' ? 'light' : 'dark',
                  },
                });
              }}
            >
              <motion.div
                className="w-5 h-5 rounded-full bg-white"
                animate={{
                  x: state.theme.mode === 'dark' ? 20 : 0,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </div>
        </GlassCard>
      </motion.section>

      {/* Custom Theme Builder */}
      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard
          className="p-4 cursor-pointer group"
          onClick={() => setShowThemeBuilder(true)}
          hover
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings size={20} className="text-purple-400" />
              <span className="text-white/80">Custom Theme Builder</span>
            </div>
            <ChevronRight size={20} className="text-white/30 group-hover:text-white/60 transition-colors" />
          </div>
        </GlassCard>
      </motion.section>

      {/* Additional Settings */}
      <motion.section
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-white/70 text-sm mb-3 px-1">More Features</h3>
        <div className="space-y-3">
          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <Timer size={20} className="text-blue-400" />
              <span className="text-white/80">Focus Timer</span>
              <span className="text-white/40 text-sm ml-auto">{state.focusSessions.length} sessions</span>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-green-400" />
              <span className="text-white/80">Notes & Journal</span>
              <span className="text-white/40 text-sm ml-auto">{state.notes.length} entries</span>
            </div>
          </GlassCard>

          <GlassCard className="p-4">
            <div className="flex items-center gap-3">
              <Target size={20} className="text-orange-400" />
              <span className="text-white/80">Goals</span>
              <span className="text-white/40 text-sm ml-auto">{state.goals.length} active</span>
            </div>
          </GlassCard>
        </div>
      </motion.section>

      {/* Danger Zone */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-white/70 text-sm mb-3 px-1">Data</h3>
        <GlassCard className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database size={20} className="text-white/50" />
              <div>
                <p className="text-white/80 text-sm">Reset All Data</p>
                <p className="text-white/40 text-xs">Clear all habits, completions, and progress</p>
              </div>
            </div>
            <GlassButton
              variant="ghost"
              size="sm"
              onClick={() => setShowResetConfirm(true)}
              className="bg-red-500/20 text-red-400 px-3 py-2 rounded-lg"
            >
              Reset
            </GlassButton>
          </div>
        </GlassCard>
      </motion.section>

      {/* Theme Builder Modal */}
      <AnimatePresence>
        {showThemeBuilder && (
          <ThemeBuilder
            currentTheme={state.theme}
            onClose={() => setShowThemeBuilder(false)}
            onSave={(theme) => {
              dispatch({ type: 'UPDATE_THEME', payload: theme });
              setShowThemeBuilder(false);
            }}
          />
        )}
      </AnimatePresence>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowResetConfirm(false)}
            />

            <motion.div
              className="relative rounded-3xl p-6 mx-4 max-w-sm w-full"
              style={{
                background: 'linear-gradient(180deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 35, 0.98) 100%)',
              }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h2 className="text-xl text-white mb-2">Reset All Data?</h2>
              <p className="text-white/60 text-sm mb-6">
                This will permanently delete all your habits, progress, achievements, and settings. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <GlassButton
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setShowResetConfirm(false)}
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  variant="accent"
                  className="flex-1 bg-red-500/30"
                  onClick={handleReset}
                >
                  Reset
                </GlassButton>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Credits */}
      <motion.div
        className="mt-8 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-white/30 text-xs">Lotus Habit Tracker</p>
        <p className="text-white/20 text-xs mt-1">Version 1.0.0</p>
      </motion.div>
    </div>
  );
}
