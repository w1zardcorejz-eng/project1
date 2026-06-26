import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sun, Sunrise, Moon, CloudSun, Sparkles, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { HabitItem } from './HabitItem';
import { GlassCard, GlassButton, GlassInput, GlassTextarea } from './Glass';
import { Habit, HabitCategory, HabitDifficulty } from '../types';
import { getTodayString } from '../utils/storage';

const categoryIcons = {
  morning: { icon: Sunrise, label: 'Morning', color: '#fbbf24' },
  day: { icon: Sun, label: 'Day', color: '#f97316' },
  evening: { icon: CloudSun, label: 'Evening', color: '#a78bfa' },
  night: { icon: Moon, label: 'Night', color: '#6366f1' },
  custom: { icon: Sparkles, label: 'Custom', color: '#ec4899' },
};

const defaultIcons = ['🔥', '💪', '📚', '🧘', '💧', '🏃', '💤', '🥗', '✍️', '🎯', '🌱', '⭐'];
const defaultColors = ['#f43f5e', '#ec4899', '#a78bfa', '#6366f1', '#3b82f6', '#22c55e', '#f97316', '#fbbf24'];

export function HabitsScreen() {
  const { state, dispatch } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingHabit, setEditingHabit] = useState<Habit | null>(null);
  const [activeCategory, setActiveCategory] = useState<HabitCategory | 'all'>('all');

  const today = getTodayString();
  const todayCompletions = useMemo(() => {
    return state.completions.filter(c => c.date === today);
  }, [state.completions, today]);

  const filteredHabits = activeCategory === 'all'
    ? state.habits
    : state.habits.filter(h => h.category === activeCategory);

  const handleToggle = (habitId: string) => {
    dispatch({
      type: 'TOGGLE_COMPLETION',
      payload: { habitId, date: today },
    });
  };

  const handleDelete = (habitId: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: habitId });
  };

  const handleEdit = (habit: Habit) => {
    setEditingHabit(habit);
    setShowForm(true);
  };

  return (
    <div className="pb-28 px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-light text-white mb-2">Habits</h1>
        <p className="text-white/50 text-sm">
          {state.habits.length} habits • {todayCompletions.filter(c => c.completed).length} completed today
        </p>
      </motion.div>

      {/* Category Filters */}
      <motion.div
        className="flex gap-2 overflow-x-auto pb-4 mb-6 -mx-4 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <CategoryButton
          active={activeCategory === 'all'}
          onClick={() => setActiveCategory('all')}
          label="All"
        />
        {Object.entries(categoryIcons).map(([key, value]) => {
          const Icon = value.icon;
          return (
            <CategoryButton
              key={key}
              active={activeCategory === key}
              onClick={() => setActiveCategory(key as HabitCategory)}
              icon={<Icon size={16} />}
              label={value.label}
              color={value.color}
            />
          );
        })}
      </motion.div>

      {/* Habits List */}
      <motion.div
        className="space-y-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
      >
        <AnimatePresence mode="popLayout">
          {filteredHabits.length === 0 ? (
            <GlassCard className="text-center py-12">
              <p className="text-white/50 mb-4">No habits yet</p>
              <GlassButton onClick={() => setShowForm(true)}>
                <Plus size={18} className="mr-2" /> Create a habit
              </GlassButton>
            </GlassCard>
          ) : (
            filteredHabits.map((habit, index) => {
              const completion = todayCompletions.find(c => c.habitId === habit.id);
              const streak = state.completions.filter(
                c => c.habitId === habit.id && c.completed
              ).length;
              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <HabitItem
                    habit={habit}
                    completed={completion?.completed || false}
                    onToggle={() => handleToggle(habit.id)}
                    onDelete={() => handleDelete(habit.id)}
                    onEdit={() => handleEdit(habit)}
                    showStreak
                    streak={streak}
                  />
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <HabitForm
            habit={editingHabit}
            onClose={() => {
              setShowForm(false);
              setEditingHabit(null);
            }}
            onSave={(habit) => {
              if (editingHabit) {
                dispatch({ type: 'UPDATE_HABIT', payload: habit });
              } else {
                dispatch({ type: 'ADD_HABIT', payload: habit });
              }
              setShowForm(false);
              setEditingHabit(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function CategoryButton({
  active,
  onClick,
  icon,
  label,
  color,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  label: string;
  color?: string;
}) {
  return (
    <motion.button
      className="flex items-center gap-1.5 px-3 py-2 rounded-full whitespace-nowrap"
      style={{
        background: active
          ? color
            ? `${color}40`
            : 'rgba(167, 139, 250, 0.3)'
          : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${active
          ? color
            ? `${color}60`
            : 'rgba(167, 139, 250, 0.4)'
          : 'rgba(255, 255, 255, 0.1)'
        }`,
        color: active ? 'white' : 'rgba(255,255,255,0.6)',
      }}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </motion.button>
  );
}

function HabitForm({
  habit,
  onClose,
  onSave,
}: {
  habit: Habit | null;
  onClose: () => void;
  onSave: (habit: Habit) => void;
}) {
  const [name, setName] = useState(habit?.name || '');
  const [description, setDescription] = useState(habit?.description || '');
  const [category, setCategory] = useState<HabitCategory>(habit?.category || 'day');
  const [icon, setIcon] = useState(habit?.icon || defaultIcons[0]);
  const [color, setColor] = useState(habit?.color || defaultColors[0]);
  const [difficulty, setDifficulty] = useState<HabitDifficulty>(habit?.difficulty || 'medium');
  const [reminder, setReminder] = useState(habit?.reminder || '');

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({
      id: habit?.id || Date.now().toString(),
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      icon,
      color,
      difficulty,
      reminder: reminder || undefined,
      repeat: { type: 'daily' },
      createdAt: habit?.createdAt || new Date().toISOString(),
    });
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 35, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-light text-white">
            {habit ? 'Edit Habit' : 'New Habit'}
          </h2>
          <motion.button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} className="text-white/70" />
          </motion.button>
        </div>

        <div className="p-4 space-y-6">
          {/* Name */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Name</label>
            <GlassInput
              value={name}
              onChange={setName}
              placeholder="Habit name..."
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Description (optional)</label>
            <GlassTextarea
              value={description}
              onChange={setDescription}
              placeholder="Why is this habit important?"
              rows={2}
            />
          </div>

          {/* Icon Selection */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Icon</label>
            <div className="flex flex-wrap gap-2">
              {defaultIcons.map((i) => (
                <motion.button
                  key={i}
                  className="w-12 h-12 rounded-xl text-xl flex items-center justify-center"
                  style={{
                    background: icon === i ? `${color}40` : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${icon === i ? color : 'rgba(255, 255, 255, 0.1)'}`,
                  }}
                  onClick={() => setIcon(i)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  {i}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Color Selection */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Color</label>
            <div className="flex flex-wrap gap-2">
              {defaultColors.map((c) => (
                <motion.button
                  key={c}
                  className="w-10 h-10 rounded-xl"
                  style={{
                    background: c,
                    border: `2px solid ${color === c ? 'white' : 'transparent'}`,
                    boxShadow: color === c ? `0 0 15px ${c}60` : 'none',
                  }}
                  onClick={() => setColor(c)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Category</label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(categoryIcons).map(([key, value]) => {
                const Icon = value.icon;
                return (
                  <motion.button
                    key={key}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                    style={{
                      background: category === key as HabitCategory
                        ? `${value.color}30`
                        : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${category === key as HabitCategory
                        ? `${value.color}50`
                        : 'rgba(255, 255, 255, 0.1)'
                      }`,
                      color: 'white',
                    }}
                    onClick={() => setCategory(key as HabitCategory)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={16} />
                    {value.label}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Difficulty</label>
            <div className="flex gap-2">
              {(['easy', 'medium', 'hard'] as HabitDifficulty[]).map((d) => (
                <motion.button
                  key={d}
                  className="flex-1 px-3 py-2 rounded-xl text-sm capitalize"
                  style={{
                    background: difficulty === d ? 'rgba(167, 139, 250, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                    border: `1px solid ${difficulty === d ? 'rgba(167, 139, 250, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                    color: 'white',
                  }}
                  onClick={() => setDifficulty(d)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {d}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Reminder */}
          <div>
            <label className="text-white/60 text-sm mb-2 block">Reminder Time (optional)</label>
            <GlassInput
              value={reminder}
              onChange={setReminder}
              placeholder="e.g., 08:00"
              type="time"
            />
          </div>

          {/* Save Button */}
          <GlassButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSave}
            disabled={!name.trim()}
          >
            {habit ? 'Save Changes' : 'Create Habit'}
          </GlassButton>
        </div>
      </motion.div>
    </motion.div>
  );
}
