import { motion } from 'framer-motion';
import { X, CheckSquare, BookOpen, Target, Timer } from 'lucide-react';
import { NavView } from '../types';

interface QuickAddModalProps {
  onClose: () => void;
  onNavigate?: (view: NavView) => void;
}

export function QuickAddModal({ onClose, onNavigate }: QuickAddModalProps) {
  const actions = [
    {
      id: 'habit',
      icon: CheckSquare,
      label: 'New Habit',
      description: 'Create a new habit to track',
      color: '#a78bfa',
      view: 'habits' as NavView,
    },
    {
      id: 'note',
      icon: BookOpen,
      label: 'Quick Note',
      description: 'Write a journal entry',
      color: '#fbbf24',
      view: 'notes' as NavView,
    },
    {
      id: 'focus',
      icon: Timer,
      label: 'Focus Session',
      description: 'Start a focus timer',
      color: '#22c55e',
      view: 'focus' as NavView,
    },
    {
      id: 'goal',
      icon: Target,
      label: 'New Goal',
      description: 'Set a long-term goal',
      color: '#f87171',
      view: 'habits' as NavView,
    },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-sm mx-4 rounded-3xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 35, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
        }}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25 }}
      >
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-light text-white">Quick Add</h2>
          <motion.button
            className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={20} className="text-white/70" />
          </motion.button>
        </div>

        <div className="p-4 grid grid-cols-2 gap-3">
          {actions.map((action, index) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.id}
                className="p-4 rounded-2xl text-left"
                style={{
                  background: `${action.color}15`,
                  border: `1px solid ${action.color}30`,
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, background: `${action.color}25` }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onClose();
                  if (onNavigate) {
                    onNavigate(action.view);
                  }
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                  style={{ background: `${action.color}30` }}
                >
                  <Icon size={20} style={{ color: action.color }} />
                </div>
                <p className="text-white font-medium text-sm">{action.label}</p>
                <p className="text-white/40 text-xs mt-1">{action.description}</p>
              </motion.button>
            );
          })}
        </div>

        {/* Hint */}
        <div className="px-4 pb-4">
          <p className="text-center text-white/30 text-xs">
            Tap an option to continue
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}
