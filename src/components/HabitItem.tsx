import { motion, AnimatePresence } from 'framer-motion';
import { Check, Timer, Trash2, Edit3 } from 'lucide-react';
import { Habit } from '../types';
import { GlassCard } from './Glass';

interface HabitItemProps {
  habit: Habit;
  completed: boolean;
  onToggle: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
  compact?: boolean;
  showStreak?: boolean;
  streak?: number;
}

export function HabitItem({
  habit,
  completed,
  onToggle,
  onDelete,
  onEdit,
  compact = false,
  showStreak = false,
  streak = 0,
}: HabitItemProps) {
  if (compact) {
    return (
      <motion.div
        className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer"
        onClick={onToggle}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        style={{
          background: completed
            ? `linear-gradient(135deg, ${habit.color}30 0%, ${habit.color}15 100%)`
            : 'rgba(255, 255, 255, 0.05)',
          border: `1px solid ${completed ? habit.color + '40' : 'rgba(255, 255, 255, 0.1)'}`,
          boxShadow: completed ? `0 0 20px ${habit.color}30` : 'none',
        }}
      >
        <motion.div
          className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
          style={{
            background: completed ? `${habit.color}40` : 'rgba(255, 255, 255, 0.1)',
          }}
        >
          {habit.icon}
        </motion.div>

        <div className="flex-1 min-w-0">
          <p
            className="font-medium truncate"
            style={{
              color: completed ? 'rgba(255,255,255,0.5)' : 'white',
              textDecoration: completed ? 'line-through' : 'none',
              transition: 'all 0.3s',
            }}
          >
            {habit.name}
          </p>
        </div>

        <motion.div
          className="w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            background: completed ? habit.color : 'rgba(255, 255, 255, 0.1)',
            border: `2px solid ${completed ? habit.color : 'rgba(255, 255, 255, 0.3)'}`,
            boxShadow: completed ? `0 0 10px ${habit.color}60` : 'none',
          }}
          initial={false}
          animate={{
            scale: completed ? [1, 1.2, 1] : 1,
          }}
          transition={{ duration: 0.3 }}
        >
          <AnimatePresence mode="wait">
            {completed && (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              >
                <Check size={14} color="white" strokeWidth={3} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <GlassCard className="group">
      <div className="flex items-center gap-4">
        {/* Icon */}
        <motion.div
          className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
          style={{
            background: `linear-gradient(135deg, ${habit.color}30 0%, ${habit.color}15 100%)`,
            border: `1px solid ${habit.color}30`,
          }}
          whileHover={{ scale: 1.1, rotate: 5 }}
        >
          {habit.icon}
        </motion.div>

        {/* Details */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-white text-lg truncate">{habit.name}</h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-white/50 capitalize">{habit.category}</span>
            {showStreak && streak > 0 && (
              <span className="text-xs text-orange-400 flex items-center gap-1">
                🔥 {streak}
              </span>
            )}
            {habit.reminder && (
              <span className="text-xs text-white/40 flex items-center gap-1">
                <Timer size={10} /> {habit.reminder}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {onEdit && (
            <motion.button
              className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              <Edit3 size={14} className="text-white/70" />
            </motion.button>
          )}
          {onDelete && (
            <motion.button
              className="w-8 h-8 rounded-full flex items-center justify-center bg-red-500/20"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 size={14} className="text-red-400" />
            </motion.button>
          )}
        </div>

        {/* Toggle Button */}
        <motion.button
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{
            background: completed ? habit.color : 'rgba(255, 255, 255, 0.1)',
            border: `2px solid ${completed ? habit.color : 'rgba(255, 255, 255, 0.2)'}`,
            boxShadow: completed ? `0 0 20px ${habit.color}60` : 'none',
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggle}
        >
          <motion.div
            initial={false}
            animate={{
              scale: completed ? [0, 1.3, 1] : 1,
              opacity: completed ? 1 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            <Check size={20} color="white" strokeWidth={3} />
          </motion.div>
        </motion.button>
      </div>
    </GlassCard>
  );
}
