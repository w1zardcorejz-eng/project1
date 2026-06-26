import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, TrendingUp, Gift, Sparkles, Star } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Lotus } from './TogglableLotus';
import { GlassCard } from './Glass';
import { ProgressRing } from './ProgressRing';
import { MoodTracker } from './MoodTracker';
import { HabitItem } from './HabitItem';
import { getTodayString } from '../utils/storage';
import { MoodType } from '../types';

const motivationalQuotes = [
  { text: 'Small steps lead to big transformations.', author: 'Unknown' },
  { text: 'The journey of a thousand miles begins with one step.', author: 'Lao Tzu' },
  { text: 'Every day is a new opportunity to grow.', author: 'Unknown' },
  { text: 'Consistency is the key to mastery.', author: 'Unknown' },
  { text: 'Your habits shape your destiny.', author: 'Unknown' },
  { text: 'Progress, not perfection.', author: 'Unknown' },
  { text: 'Each habit completed is a petal unfurling.', author: 'Unknown' },
  { text: 'Be patient with yourself. Growth takes time.', author: 'Unknown' },
  { text: 'The lotus blooms from within.', author: 'Unknown' },
  { text: 'Your daily practice is your meditation.', author: 'Unknown' },
];

export function HomeScreen() {
  const { state, dispatch } = useApp();
  const today = getTodayString();

  const todayCompletions = useMemo(() => {
    return state.completions.filter(c => c.date === today);
  }, [state.completions, today]);

  const completedCount = todayCompletions.filter(c => c.completed).length;
  const totalCount = state.habits.length;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  const lotusProgress = Math.min(1, state.stats.level / 50);
  const lotusBrightness = 0.4 + progress * 0.4 + lotusProgress * 0.2;

  const todayMood = state.moods.find(m => m.date === today);
  const canClaimDailyReward = state.dailyRewardClaimed !== today;

  const quote = useMemo(() => {
    return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
  }, []);

  const handleClaimReward = () => {
    if (canClaimDailyReward) {
      dispatch({ type: 'CLAIM_DAILY_REWARD' });
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 6) return 'Good night';
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <div className="pb-28 px-4 pt-6">
      {/* Greeting */}
      <motion.div
        className="text-center mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white/60 text-lg">{getGreeting()}</p>
        <h1
          className="text-3xl font-light mt-1"
          style={{
            color: 'white',
            textShadow: '0 0 30px rgba(167, 139, 250, 0.3)',
          }}
        >
          {state.stats.title}
        </h1>
      </motion.div>

      {/* Lotus with Progress Ring */}
      <motion.div
        className="relative flex justify-center items-center mb-8"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <ProgressRing
          progress={progress}
          size={280}
          strokeWidth={6}
          showPercentage={false}
        />
        <div className="absolute">
          <Lotus progress={lotusBrightness} size={180} />
        </div>

        {/* Level badge */}
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 px-4 py-2 rounded-full"
          style={{
            background: 'rgba(167, 139, 250, 0.3)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(167, 139, 250, 0.4)',
            boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)',
          }}
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="text-white font-medium">Level {state.stats.level}</span>
        </motion.div>
      </motion.div>

      {/* Stats Row */}
      <motion.div
        className="grid grid-cols-3 gap-3 mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <GlassCard className="text-center p-3">
          <TrendingUp size={20} className="mx-auto mb-1 text-purple-400" />
          <p className="text-2xl font-light text-white">{state.stats.currentStreak}</p>
          <p className="text-xs text-white/50">Streak</p>
        </GlassCard>

        <GlassCard className="text-center p-3">
          <Zap size={20} className="mx-auto mb-1 text-yellow-400" />
          <p className="text-2xl font-light text-white">{state.stats.xp}</p>
          <p className="text-xs text-white/50">XP</p>
        </GlassCard>

        <GlassCard className="text-center p-3">
          <Star size={20} className="mx-auto mb-1 text-amber-400" />
          <p className="text-2xl font-light text-white">{state.stats.coins}</p>
          <p className="text-xs text-white/50">Coins</p>
        </GlassCard>
      </motion.div>

      {/* Daily Reward */}
      <AnimatePresence>
        {canClaimDailyReward && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="mb-6"
          >
            <GlassCard
              glow
              glowColor="rgba(251, 191, 36, 0.3)"
              className="cursor-pointer group"
              onClick={handleClaimReward}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.4) 0%, rgba(245, 158, 11, 0.4) 100%)',
                    boxShadow: '0 0 20px rgba(251, 191, 36, 0.4)',
                  }}
                  animate={{
                    boxShadow: [
                      '0 0 20px rgba(251, 191, 36, 0.4)',
                      '0 0 30px rgba(251, 191, 36, 0.6)',
                      '0 0 20px rgba(251, 191, 36, 0.4)',
                    ],
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Gift size={24} className="text-yellow-400" />
                </motion.div>
                <div className="flex-1">
                  <p className="font-medium text-white">Daily Reward Ready!</p>
                  <p className="text-sm text-white/50">Tap to claim +10 coins</p>
                </div>
                <Sparkles size={20} className="text-yellow-400" />
              </div>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood Tracker */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <GlassCard>
          <MoodTracker
            currentMood={todayMood?.mood}
            onMoodSelect={(mood: MoodType) => {
              dispatch({
                type: 'SET_MOOD',
                payload: { date: today, mood },
              });
            }}
          />
        </GlassCard>
      </motion.div>

      {/* Today's Habits */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <h2 className="text-lg font-medium text-white/80 mb-3 px-1">Today's Habits</h2>
        {state.habits.length === 0 ? (
          <GlassCard className="text-center py-8">
            <p className="text-white/50">No habits yet. Tap + to create your first habit!</p>
          </GlassCard>
        ) : (
          <div className="space-y-2">
            {state.habits.map((habit, index) => {
              const completion = todayCompletions.find(c => c.habitId === habit.id);
              return (
                <motion.div
                  key={habit.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <HabitItem
                    habit={habit}
                    completed={completion?.completed || false}
                    onToggle={() => {
                      dispatch({
                        type: 'TOGGLE_COMPLETION',
                        payload: { habitId: habit.id, date: today },
                      });
                    }}
                    compact
                  />
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Progress Summary */}
      {totalCount > 0 && (
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <GlassCard>
            <div className="flex items-center justify-between mb-3">
              <span className="text-white/70">Today's Progress</span>
              <span className="text-white font-medium">{completedCount}/{totalCount}</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <motion.div
                className="h-full rounded-full"
                style={{
                  background: 'linear-gradient(90deg, rgba(167, 139, 250, 1) 0%, rgba(251, 191, 36, 0.8) 100%)',
                  boxShadow: '0 0 15px rgba(167, 139, 250, 0.5)',
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress * 100}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </GlassCard>
        </motion.div>
      )}

      {/* Motivational Quote */}
      <motion.div
        className="mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <GlassCard className="text-center py-6">
          <p className="text-white/80 italic font-light text-lg mb-2">"{quote.text}"</p>
          <p className="text-white/40 text-sm">— {quote.author}</p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
