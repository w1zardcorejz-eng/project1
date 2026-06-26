import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './Glass';
import { Habit, MoodType } from '../types';

const moodEmojis: Record<MoodType, string> = {
  excellent: '😄',
  good: '🙂',
  normal: '😐',
  bad: '🙁',
  terrible: '😢',
};

export function CalendarScreen() {
  const { state } = useApp();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const monthName = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getDateString = (day: number) => {
    return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  };

  const getDayData = (dateStr: string) => {
    const completions = state.completions.filter(
      c => c.date === dateStr && c.completed
    );
    const totalHabitsOnDay = state.habits.length;
    const progress = totalHabitsOnDay > 0
      ? completions.length / totalHabitsOnDay
      : 0;
    const mood = state.moods.find(m => m.date === dateStr);

    return { completions: completions.length, progress, mood };
  };

  const today = new Date().toISOString().split('T')[0];
  const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="pb-28 px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-light text-white">Calendar</h1>
        <p className="text-white/50 text-sm mt-1">Track your journey</p>
      </motion.div>

      {/* Month Navigation */}
      <GlassCard className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <motion.button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
            onClick={goToPreviousMonth}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft size={20} className="text-white/70" />
          </motion.button>

          <motion.h2
            key={monthName}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-light text-white"
          >
            {monthName}
          </motion.h2>

          <motion.button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
            onClick={goToNextMonth}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <ChevronRight size={20} className="text-white/70" />
          </motion.button>
        </div>

        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayLabels.map((day) => (
            <div key={day} className="text-center text-xs text-white/40 py-1">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for days before the first day of month */}
          {Array.from({ length: firstDayOfMonth }).map((_, i) => (
            <div key={`empty-${i}`} className="aspect-square" />
          ))}

          {/* Actual days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = getDateString(day);
            const dayData = getDayData(dateStr);
            const isToday = dateStr === today;
            const isSelected = selectedDate === dateStr;

            return (
              <motion.button
                key={day}
                className="aspect-square rounded-xl flex flex-col items-center justify-center relative"
                style={{
                  background: isSelected
                    ? 'rgba(167, 139, 250, 0.3)'
                    : isToday
                      ? 'rgba(167, 139, 250, 0.15)'
                      : dayData.progress > 0
                        ? `rgba(167, 139, 250, ${Math.min(dayData.progress * 0.4, 0.4)})`
                        : 'transparent',
                  border: isToday
                    ? '1px solid rgba(167, 139, 250, 0.5)'
                    : '1px solid transparent',
                }}
                onClick={() => setSelectedDate(isSelected ? null : dateStr)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span
                  className="text-sm"
                  style={{
                    color: isToday || isSelected ? 'white' : 'rgba(255,255,255,0.7)',
                    fontWeight: isToday ? 'bold' : 'normal',
                  }}
                >
                  {day}
                </span>
                {dayData.mood && (
                  <span className="text-[10px] mt-0.5">
                    {moodEmojis[dayData.mood.mood]}
                  </span>
                )}
                {dayData.progress > 0 && !dayData.mood && (
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400 mt-1 opacity-60" />
                )}
              </motion.button>
            );
          })}
        </div>
      </GlassCard>

      {/* Heatmap Legend */}
      <GlassCard className="mb-6">
        <h3 className="text-white/70 text-sm mb-3">Activity Intensity</h3>
        <div className="flex items-center gap-1">
          <span className="text-xs text-white/40">Less</span>
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((opacity, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-md"
              style={{
                background: `rgba(167, 139, 250, ${opacity * 0.5})`,
              }}
            />
          ))}
          <span className="text-xs text-white/40">More</span>
        </div>
      </GlassCard>

      {/* Year Heatmap */}
      <GlassCard className="mb-6">
        <h3 className="text-white/70 text-sm mb-3">Year Overview</h3>
        <YearHeatmap year={year} completions={state.completions} habits={state.habits} />
      </GlassCard>

      {/* Selected Day Details */}
      <AnimatePresence>
        {selectedDate && (
          <DayDetailsModal
            date={selectedDate}
            onClose={() => setSelectedDate(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function YearHeatmap({
  year,
  completions,
  habits,
}: {
  year: number;
  completions: { date: string; completed: boolean }[];
  habits: Habit[];
}) {
  const weeks = [];
  const startOfYear = new Date(year, 0, 1);
  const endOfYear = new Date(year, 11, 31);

  // Adjust for Sunday start
  // eslint-disable-next-line prefer-const
  let currentDate = new Date(startOfYear);
  currentDate.setDate(currentDate.getDate() - currentDate.getDay());

  while (currentDate <= endOfYear) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const dateCompletions = completions.filter(
        c => c.date === dateStr && c.completed
      ).length;
      const totalHabits = habits.length;

      week.push({
        date: dateStr,
        intensity: totalHabits > 0 ? dateCompletions / totalHabits : 0,
        inYear: currentDate.getFullYear() === year,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }
    weeks.push(week);
  }

  return (
    <div className="flex gap-0.5 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
      {weeks.map((week, weekIndex) => (
        <div key={weekIndex} className="flex flex-col gap-0.5">
          {week.map((day, dayIndex) => (
            <motion.div
              key={`${weekIndex}-${dayIndex}`}
              className="w-2.5 h-2.5 rounded-sm"
              style={{
                background: day.inYear
                  ? `rgba(167, 139, 250, ${Math.min(day.intensity * 0.8, 0.8)})`
                  : 'transparent',
                boxShadow: day.intensity > 0.8 && day.inYear
                  ? '0 0 4px rgba(167, 139, 250, 0.5)'
                  : 'none',
              }}
              whileHover={{ scale: 1.5 }}
              title={`${day.date}: ${Math.round(day.intensity * 100)}%`}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function DayDetailsModal({
  date,
  onClose,
}: {
  date: string;
  onClose: () => void;
}) {
  const { state } = useApp();

  const dayCompletions = state.completions.filter(
    c => c.date === date
  );
  const completedHabits = dayCompletions
    .filter(c => c.completed)
    .map(c => ({
      habit: state.habits.find(h => h.id === c.habitId),
      completed: true,
    }))
    .filter(h => h.habit);

  const dayMood = state.moods.find(m => m.date === date);
  const dayNote = state.notes.find(n => n.date === date);

  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

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
        className="relative w-full max-w-lg rounded-t-3xl max-h-[80vh] overflow-y-auto"
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
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <div>
            <h2 className="text-lg font-light text-white">{displayDate}</h2>
            <p className="text-sm text-white/50">
              {completedHabits.length} habit{completedHabits.length !== 1 ? 's' : ''} completed
            </p>
          </div>
          <motion.button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} className="text-white/70" />
          </motion.button>
        </div>

        <div className="p-4 space-y-4">
          {/* Mood */}
          {dayMood && (
            <GlassCard>
              <p className="text-white/50 text-sm mb-2">Mood</p>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{moodEmojis[dayMood.mood]}</span>
                <span className="text-white capitalize">{dayMood.mood}</span>
              </div>
              {dayMood.notes && (
                <p className="mt-2 text-white/60 text-sm">{dayMood.notes}</p>
              )}
            </GlassCard>
          )}

          {/* Completed Habits */}
          {completedHabits.length > 0 && (
            <GlassCard>
              <p className="text-white/50 text-sm mb-3">Completed Habits</p>
              <div className="space-y-2">
                {completedHabits.map((h, i) => (
                  <motion.div
                    key={i}
                    className="flex items-center gap-3 p-2 rounded-lg bg-white/5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <span className="text-xl">{h.habit?.icon}</span>
                    <span className="text-white/80">{h.habit?.name}</span>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          )}

          {/* Note */}
          {dayNote && (
            <GlassCard>
              <p className="text-white/50 text-sm mb-2">Journal Entry</p>
              <p className="text-white/80">{dayNote.content}</p>
            </GlassCard>
          )}

          {/* Empty state */}
          {completedHabits.length === 0 && !dayMood && !dayNote && (
            <GlassCard className="text-center py-8">
              <p className="text-white/50">No activity recorded for this day</p>
            </GlassCard>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
