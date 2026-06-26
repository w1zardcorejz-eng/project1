import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard } from './Glass';
import { Achievement, AchievementRarity } from '../types';

const rarityColors: Record<AchievementRarity, { gradient: string; glow: string; border: string }> = {
  common: {
    gradient: 'linear-gradient(135deg, rgba(148, 163, 184, 0.3) 0%, rgba(71, 85, 105, 0.3) 100%)',
    glow: 'rgba(148, 163, 184, 0.4)',
    border: 'rgba(148, 163, 184, 0.5)',
  },
  rare: {
    gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.3) 100%)',
    glow: 'rgba(59, 130, 246, 0.5)',
    border: 'rgba(59, 130, 246, 0.6)',
  },
  epic: {
    gradient: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3) 0%, rgba(139, 69, 19, 0.3) 100%)',
    glow: 'rgba(168, 85, 247, 0.5)',
    border: 'rgba(168, 85, 247, 0.6)',
  },
  legendary: {
    gradient: 'linear-gradient(135deg, rgba(251, 191, 36, 0.3) 0%, rgba(245, 158, 11, 0.3) 100%)',
    glow: 'rgba(251, 191, 36, 0.6)',
    border: 'rgba(251, 191, 36, 0.7)',
  },
};

export function AchievementsScreen() {
  const { state } = useApp();

  const unlockedCount = state.achievements.filter(a => a.unlockedAt).length;
  const totalCount = state.achievements.length;

  const categories = useMemo(() => {
    return {
      streak: state.achievements.filter(a => a.id.includes('streak')),
      habit: state.achievements.filter(a => a.id.includes('habit')),
      time: state.achievements.filter(a => a.id.includes('bird') || a.id.includes('owl')),
      level: state.achievements.filter(a => a.id.includes('level') || a.id.includes('lotus')),
      other: state.achievements.filter(a =>
        !a.id.includes('streak') && !a.id.includes('habit') &&
        !a.id.includes('bird') && !a.id.includes('owl') &&
        !a.id.includes('level') && !a.id.includes('lotus')
      ),
    };
  }, [state.achievements]);

  return (
    <div className="pb-28 px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-light text-white">Achievements</h1>
        <p className="text-white/50 text-sm mt-1">
          {unlockedCount} of {totalCount} unlocked
        </p>
      </motion.div>

      {/* Progress Overview */}
      <GlassCard className="mb-6 p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-white/70">Progress</span>
          <span className="text-white">{Math.round((unlockedCount / totalCount) * 100)}%</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{
              background: 'linear-gradient(90deg, rgba(167, 139, 250, 1) 0%, rgba(251, 191, 36, 0.8) 100%)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${(unlockedCount / totalCount) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </GlassCard>

      {/* Streak Achievements */}
      <AchievementCategory title="Streak Mastery" achievements={categories.streak} />

      {/* Habit Achievements */}
      <AchievementCategory title="Habit Completion" achievements={categories.habit} />

      {/* Time Achievements */}
      <AchievementCategory title="Time Mastery" achievements={categories.time} />

      {/* Level Achievements */}
      <AchievementCategory title="Level Progress" achievements={categories.level} />

      {/* Other Achievements */}
      {categories.other.length > 0 && (
        <AchievementCategory title="Special" achievements={categories.other} />
      )}
    </div>
  );
}

function AchievementCategory({ title, achievements }: { title: string; achievements: Achievement[] }) {
  if (achievements.length === 0) return null;

  return (
    <motion.div
      className="mb-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-white/70 text-sm mb-3 px-1">{title}</h2>
      <div className="space-y-3">
        {achievements.map((achievement, index) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <AchievementCard achievement={achievement} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function AchievementCard({ achievement }: { achievement: Achievement }) {
  const isUnlocked = !!achievement.unlockedAt;
  const progress = Math.min((achievement.progress / achievement.target) * 100, 100);
  const rarityStyle = rarityColors[achievement.rarity];

  return (
    <motion.div
      className="relative rounded-2xl p-4 overflow-hidden"
      style={{
        background: isUnlocked ? rarityStyle.gradient : 'rgba(255, 255, 255, 0.05)',
        border: `1px solid ${isUnlocked ? rarityStyle.border : 'rgba(255, 255, 255, 0.1)'}`,
        boxShadow: isUnlocked ? `0 0 20px ${rarityStyle.glow}` : 'none',
      }}
      whileHover={isUnlocked ? { scale: 1.02 } : undefined}
    >
      {/* Rarity glow animation for unlocked */}
      {isUnlocked && (
        <motion.div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${rarityStyle.glow} 0%, transparent 50%)`,
          }}
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
      )}

      <div className="relative flex items-center gap-4">
        {/* Icon */}
        <motion.div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-2xl"
          style={{
            background: isUnlocked
              ? `${rarityStyle.border}`
              : 'rgba(255, 255, 255, 0.05)',
            opacity: isUnlocked ? 1 : 0.3,
          }}
          animate={isUnlocked ? {
            boxShadow: [
              `0 0 10px ${rarityStyle.glow}`,
              `0 0 25px ${rarityStyle.glow}`,
              `0 0 10px ${rarityStyle.glow}`,
            ],
          } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {isUnlocked ? (
            achievement.icon
          ) : (
            <Lock size={24} className="text-white/30" />
          )}
        </motion.div>

        {/* Details */}
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="font-medium"
              style={{
                color: isUnlocked ? 'white' : 'rgba(255,255,255,0.4)',
              }}
            >
              {achievement.name}
            </h3>
            {isUnlocked && (
              <span
                className="text-xs px-2 py-0.5 rounded-full"
                style={{
                  background: rarityStyle.border,
                  color: 'white',
                }}
              >
                {achievement.rarity}
              </span>
            )}
          </div>
          <p
            className="text-sm mt-0.5"
            style={{
              color: isUnlocked ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.3)',
            }}
          >
            {achievement.description}
          </p>

          {/* Progress bar */}
          {!isUnlocked && (
            <div className="mt-2">
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: rarityStyle.glow }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                />
              </div>
              <p className="text-xs text-white/30 mt-1">
                {achievement.progress} / {achievement.target}
              </p>
            </div>
          )}

          {isUnlocked && achievement.unlockedAt && (
            <p className="text-xs text-white/40 mt-1">
              Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Sparkle effect for unlocked */}
        {isUnlocked && (
          <motion.div
            animate={{
              rotate: [0, 360],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles size={20} style={{ color: rarityStyle.glow }} />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
