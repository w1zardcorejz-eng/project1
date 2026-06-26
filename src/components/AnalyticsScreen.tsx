import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Target, Flame, Calendar, BarChart2, PieChart } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './Glass';
import { Habit, HabitCompletion } from '../types';

export function AnalyticsScreen() {
  const { state } = useApp();

  const stats = useMemo(() => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const yearAgo = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const weekCompletions = state.completions.filter(
      c => c.date >= weekAgo && c.completed
    );
    const monthCompletions = state.completions.filter(
      c => c.date >= monthAgo && c.completed
    );
    const yearCompletions = state.completions.filter(
      c => c.date >= yearAgo && c.completed
    );

    const weekCompletionRate = state.habits.length > 0
      ? (weekCompletions.length / (state.habits.length * 7)) * 100
      : 0;
    const monthCompletionRate = state.habits.length > 0
      ? (monthCompletions.length / (state.habits.length * 30)) * 100
      : 0;

    // Best/worst habits
    const habitStats = state.habits.map(habit => {
      const completions = state.completions.filter(
        c => c.habitId === habit.id && c.completed
      ).length;
      const daysSinceCreation = Math.max(1,
        Math.floor((Date.now() - new Date(habit.createdAt).getTime()) / (24 * 60 * 60 * 1000))
      );
      const rate = completions / daysSinceCreation;
      return { habit, completions, rate };
    }).sort((a, b) => b.rate - a.rate);

    const bestHabits = habitStats.slice(0, 3);
    const worstHabits = [...habitStats].reverse().slice(0, 3).filter(h => h.habit);

    // XP this week/month
    const xpThisWeek = weekCompletions.length * 10;
    const xpThisMonth = monthCompletions.length * 10;

    return {
      weekCompletions: weekCompletions.length,
      monthCompletions: monthCompletions.length,
      yearCompletions: yearCompletions.length,
      weekCompletionRate: Math.min(100, weekCompletionRate),
      monthCompletionRate: Math.min(100, monthCompletionRate),
      bestHabits,
      worstHabits,
      xpThisWeek,
      xpThisMonth,
      totalDaysActive: new Set(state.completions.map(c => c.date)).size,
      perfectDays: countPerfectDays(state.completions, state.habits),
    };
  }, [state.completions, state.habits]);

  return (
    <div className="pb-28 px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-light text-white">Analytics</h1>
        <p className="text-white/50 text-sm mt-1">Your progress at a glance</p>
      </motion.div>

      {/* Time Period Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 size={18} className="text-purple-400" />
            <span className="text-white/50 text-sm">This Week</span>
          </div>
          <p className="text-2xl font-light text-white">{stats.weekCompletions}</p>
          <p className="text-xs text-white/40 mt-1">completions</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <PieChart size={18} className="text-pink-400" />
            <span className="text-white/50 text-sm">This Month</span>
          </div>
          <p className="text-2xl font-light text-white">{stats.monthCompletions}</p>
          <p className="text-xs text-white/40 mt-1">completions</p>
        </GlassCard>
      </div>

      {/* Completion Rate Chart */}
      <GlassCard className="mb-6 p-4">
        <h3 className="text-white/70 text-sm mb-4">Completion Rate</h3>
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/50 text-xs">Weekly</span>
              <span className="text-white text-sm">{Math.round(stats.weekCompletionRate)}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${stats.weekCompletionRate}%`,
                  background: 'linear-gradient(90deg, rgba(167, 139, 250, 1) 0%, rgba(248, 113, 113, 0.8) 100%)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${stats.weekCompletionRate}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-white/50 text-xs">Monthly</span>
              <span className="text-white text-sm">{Math.round(stats.monthCompletionRate)}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  width: `${stats.monthCompletionRate}%`,
                  background: 'linear-gradient(90deg, rgba(74, 222, 128, 0.9) 0%, rgba(34, 197, 94, 0.8) 100%)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${stats.monthCompletionRate}%` }}
                transition={{ duration: 1, delay: 0.1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <GlassCard className="p-4">
          <Flame size={20} className="text-orange-400 mb-1" />
          <p className="text-2xl font-light text-white">{state.stats.bestStreak}</p>
          <p className="text-xs text-white/40">Best streak</p>
        </GlassCard>

        <GlassCard className="p-4">
          <Target size={20} className="text-green-400 mb-1" />
          <p className="text-2xl font-light text-white">{stats.perfectDays}</p>
          <p className="text-xs text-white/40">Perfect days</p>
        </GlassCard>

        <GlassCard className="p-4">
          <TrendingUp size={20} className="text-purple-400 mb-1" />
          <p className="text-2xl font-light text-white">{stats.xpThisWeek}</p>
          <p className="text-xs text-white/40">XP this week</p>
        </GlassCard>

        <GlassCard className="p-4">
          <Calendar size={20} className="text-blue-400 mb-1" />
          <p className="text-2xl font-light text-white">{stats.totalDaysActive}</p>
          <p className="text-xs text-white/40">Days active</p>
        </GlassCard>
      </div>

      {/* Best Habits */}
      {stats.bestHabits.length > 0 && (
        <GlassCard className="mb-6 p-4">
          <h3 className="text-white/70 text-sm mb-3">Top Performing Habits</h3>
          <div className="space-y-3">
            {stats.bestHabits.map((item, i) => (
              <motion.div
                key={item.habit.id}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-2xl">{item.habit.icon}</span>
                <div className="flex-1">
                  <p className="text-white/80 text-sm">{item.habit.name}</p>
                  <div className="h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: item.habit.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(item.rate * 100, 100)}%` }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </div>
                <span className="text-white/50 text-sm">{item.completions}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Needs Improvement */}
      {stats.worstHabits.length > 0 && (
        <GlassCard className="mb-6 p-4">
          <h3 className="text-white/70 text-sm mb-3">Needs Attention</h3>
          <div className="space-y-3">
            {stats.worstHabits.map((item, i) => (
              <motion.div
                key={item.habit.id}
                className="flex items-center gap-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <span className="text-2xl">{item.habit.icon}</span>
                <div className="flex-1">
                  <p className="text-white/80 text-sm">{item.habit.name}</p>
                  <div className="h-1.5 rounded-full mt-1 overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{ background: 'rgba(248, 113, 113, 0.8)' }}
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(item.rate * 100, 100)}%` }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    />
                  </div>
                </div>
                <span className="text-white/50 text-sm">{item.completions}</span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      )}

      {/* Weekly Activity Chart */}
      <GlassCard className="mb-6 p-4">
        <h3 className="text-white/70 text-sm mb-3">Weekly Activity</h3>
        <WeeklyChart completions={state.completions} habits={state.habits} />
      </GlassCard>

      {/* Empty State */}
      {state.habits.length === 0 && (
        <GlassCard className="text-center py-12">
          <p className="text-white/50">Add some habits to see your analytics!</p>
        </GlassCard>
      )}
    </div>
  );
}

function countPerfectDays(completions: HabitCompletion[], habits: Habit[]): number {
  const daysWithCompletions = new Map<string, Set<string>>();

  completions.filter(c => c.completed).forEach(c => {
    if (!daysWithCompletions.has(c.date)) {
      daysWithCompletions.set(c.date, new Set());
    }
    daysWithCompletions.get(c.date)!.add(c.habitId);
  });

  let perfectDays = 0;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  daysWithCompletions.forEach((completedHabits, _date) => {
    if (completedHabits.size === habits.length && habits.length > 0) {
      perfectDays++;
    }
  });

  return perfectDays;
}

function WeeklyChart({ completions, habits }: { completions: HabitCompletion[]; habits: Habit[] }) {
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date(Date.now() - (6 - i) * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayCompletions = completions.filter(
        c => c.date === dateStr && c.completed
      ).length;
      const total = habits.length;
      return {
        date: dateStr,
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completions: dayCompletions,
        total,
        percentage: total > 0 ? (dayCompletions / total) * 100 : 0,
      };
    });
  }, [completions, habits]);

  const maxCompletions = Math.max(...last7Days.map(d => d.completions), 1);

  return (
    <div className="flex items-end justify-between gap-2 h-24">
      {last7Days.map((day, i) => {
        const height = (day.completions / maxCompletions) * 100;
        return (
          <motion.div
            key={day.date}
            className="flex-1 flex flex-col items-center gap-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div
              className="w-full rounded-t-lg"
              style={{
                background: 'linear-gradient(180deg, rgba(167, 139, 250, 0.8) 0%, rgba(167, 139, 250, 0.2) 100%)',
                boxShadow: day.completions > 0 ? '0 0 10px rgba(167, 139, 250, 0.3)' : 'none',
                minHeight: 4,
                height: `${Math.max(height, 10)}%`,
              }}
            />
            <span className="text-[10px] text-white/40">{day.day}</span>
          </motion.div>
        );
      })}
    </div>
  );
}
