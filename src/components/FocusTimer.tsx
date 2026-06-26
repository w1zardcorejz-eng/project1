import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, Trees, Waves, Flame, CloudRain } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GlassCard, GlassButton } from './Glass';
import { ProgressRing } from './ProgressRing';

type TimerMode = 'pomodoro' | 'long' | 'custom';
type AmbientSound = 'rain' | 'forest' | 'fire' | 'ocean' | 'none';

interface TimerPreset {
  id: TimerMode;
  name: string;
  duration: number; // in seconds
  breakDuration: number;
}

const presets: TimerPreset[] = [
  { id: 'pomodoro', name: 'Pomodoro', duration: 25 * 60, breakDuration: 5 * 60 },
  { id: 'long', name: 'Deep Focus', duration: 50 * 60, breakDuration: 10 * 60 },
  { id: 'custom', name: 'Custom', duration: 30 * 60, breakDuration: 5 * 60 },
];

const ambientSounds: { id: AmbientSound; name: string; icon: React.ElementType }[] = [
  { id: 'rain', name: 'Rain', icon: CloudRain },
  { id: 'forest', name: 'Forest', icon: Trees },
  { id: 'fire', name: 'Fireplace', icon: Flame },
  { id: 'ocean', name: 'Ocean', icon: Waves },
  { id: 'none', name: 'None', icon: VolumeX },
];

export function FocusTimerScreen() {
  const { state, dispatch } = useApp();
  const [preset, setPreset] = useState<TimerPreset>(presets[0]);
  const [secondsLeft, setSecondsLeft] = useState(preset.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [ambientSound, setAmbientSound] = useState<AmbientSound>('none');
  const [showSettings, setShowSettings] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(30);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const totalSeconds = isBreak ? preset.breakDuration : preset.duration;
  const progress = (totalSeconds - secondsLeft) / totalSeconds;

  useEffect(() => {
    setSecondsLeft(isBreak ? preset.breakDuration : preset.duration);
  }, [preset, isBreak]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(prev => {
          if (prev <= 1) {
            if (isBreak) {
              setIsBreak(false);
              setIsRunning(false);
              return preset.duration;
            } else {
              // Session complete - award XP
              const sessionDuration = Math.floor(preset.duration / 60);
              dispatch({
                type: 'ADD_FOCUS_SESSION',
                payload: {
                  id: Date.now().toString(),
                  duration: sessionDuration,
                  type: preset.id as 'pomodoro' | 'long' | 'custom',
                  completedAt: new Date().toISOString(),
                },
              });
              setIsBreak(true);
              return preset.breakDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isBreak, preset, dispatch]);

  const toggleTimer = () => {
    setIsRunning(prev => !prev);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setSecondsLeft(preset.duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCustomPreset = () => {
    const newPreset: TimerPreset = {
      ...preset,
      id: 'custom',
      duration: customMinutes * 60,
    };
    setPreset(newPreset);
    setSecondsLeft(newPreset.duration);
    setShowSettings(false);
  };

  return (
    <div className="pb-28 px-4 pt-6">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-light text-white">Focus Timer</h1>
        <p className="text-white/50 text-sm mt-1">Stay focused, stay calm</p>
      </motion.div>

      {/* Presets */}
      <motion.div
        className="flex gap-2 mb-8 overflow-x-auto pb-2 -mx-4 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ scrollbarWidth: 'none' }}
      >
        {presets.map((p) => (
          <motion.button
            key={p.id}
            className="px-4 py-2 rounded-full whitespace-nowrap"
            style={{
              background: preset.id === p.id
                ? 'rgba(167, 139, 250, 0.3)'
                : 'rgba(255, 255, 255, 0.05)',
              border: `1px solid ${preset.id === p.id
                ? 'rgba(167, 139, 250, 0.5)'
                : 'rgba(255, 255, 255, 0.1)'}`,
              color: preset.id === p.id ? 'white' : 'rgba(255,255,255,0.6)',
            }}
            onClick={() => {
              setPreset(p);
              setSecondsLeft(p.duration);
              setIsRunning(false);
              setIsBreak(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {p.name}
          </motion.button>
        ))}
        <motion.button
          className="px-4 py-2 rounded-full whitespace-nowrap"
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'rgba(255,255,255,0.6)',
          }}
          onClick={() => setShowSettings(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Custom...
        </motion.button>
      </motion.div>

      {/* Timer */}
      <motion.div
        className="flex flex-col items-center mb-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          <ProgressRing
            progress={progress}
            size={280}
            strokeWidth={8}
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.span
              className="text-5xl font-light"
              style={{
                color: 'white',
                textShadow: '0 0 30px rgba(167, 139, 250, 0.4)',
              }}
              animate={{
                textShadow: isRunning
                  ? ['0 0 30px rgba(167, 139, 250, 0.4)', '0 0 50px rgba(167, 139, 250, 0.6)', '0 0 30px rgba(167, 139, 250, 0.4)']
                  : '0 0 30px rgba(167, 139, 250, 0.4)',
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              {formatTime(secondsLeft)}
            </motion.span>
            <span className="text-white/50 text-sm mt-2">
              {isBreak ? 'Break Time' : preset.name}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-8">
          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10"
            onClick={resetTimer}
            whileHover={{ scale: 1.1, rotate: -90 }}
            whileTap={{ scale: 0.9 }}
          >
            <RotateCcw size={20} className="text-white/70" />
          </motion.button>

          <motion.button
            className="w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.4) 0%, rgba(139, 92, 246, 0.4) 100%)',
              boxShadow: isRunning
                ? '0 0 30px rgba(167, 139, 250, 0.5)'
                : '0 0 15px rgba(167, 139, 250, 0.3)',
            }}
            onClick={toggleTimer}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            animate={{
              boxShadow: isRunning
                ? ['0 0 30px rgba(167, 139, 250, 0.5)', '0 0 50px rgba(167, 139, 250, 0.7)', '0 0 30px rgba(167, 139, 250, 0.5)']
                : '0 0 15px rgba(167, 139, 250, 0.3)',
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            {isRunning ? (
              <Pause size={28} color="white" />
            ) : (
              <Play size={28} color="white" className="ml-1" />
            )}
          </motion.button>

          <motion.button
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/10"
            onClick={() => setShowSettings(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Volume2 size={20} className="text-white/70" />
          </motion.button>
        </div>
      </motion.div>

      {/* Ambient Sounds */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h3 className="text-white/70 text-sm mb-3 px-1">Ambient Sounds</h3>
        <div className="grid grid-cols-5 gap-2">
          {ambientSounds.map((sound) => {
            const Icon = sound.icon;
            const isSelected = ambientSound === sound.id;
            return (
              <motion.button
                key={sound.id}
                className="p-3 rounded-xl text-center"
                style={{
                  background: isSelected
                    ? 'rgba(167, 139, 250, 0.3)'
                    : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${isSelected
                    ? 'rgba(167, 139, 250, 0.5)'
                    : 'rgba(255, 255, 255, 0.1)'}`,
                }}
                onClick={() => setAmbientSound(sound.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={24} className={`mx-auto ${isSelected ? 'text-purple-400' : 'text-white/50'}`} />
                <p className="text-xs text-white/60 mt-1">{sound.name}</p>
              </motion.button>
            );
          })}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        className="mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <GlassCard className="p-4">
          <h3 className="text-white/70 text-sm mb-3">Session Statistics</h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <p className="text-2xl text-white font-light">
                {state.focusSessions.length}
              </p>
              <p className="text-xs text-white/40">Sessions</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-white font-light">
                {state.focusSessions.reduce((sum, s) => sum + s.duration, 0)}
              </p>
              <p className="text-xs text-white/40">Minutes</p>
            </div>
            <div className="text-center">
              <p className="text-2xl text-white font-light">
                {Math.round(state.focusSessions.reduce((sum, s) => sum + s.duration, 0) / 60)}
              </p>
              <p className="text-xs text-white/40">Hours</p>
            </div>
          </div>
        </GlassCard>
      </motion.div>

      {/* Custom Timer Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-0 z-50 flex items-end justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowSettings(false)}
            />

            <motion.div
              className="relative w-full max-w-lg rounded-t-3xl p-6"
              style={{
                background: 'linear-gradient(180deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 35, 0.98) 100%)',
              }}
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl text-white">Custom Timer</h2>
                <motion.button
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
                  onClick={() => setShowSettings(false)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X size={20} className="text-white/70" />
                </motion.button>
              </div>

              <div className="mb-6">
                <label className="text-white/60 text-sm mb-2 block">Duration (minutes)</label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min={1}
                    max={120}
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(parseInt(e.target.value))}
                    className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, rgba(167, 139, 250, 0.3) 0%, rgba(167, 139, 250, 0.8) ${(customMinutes / 120) * 100}%, rgba(255,255,255,0.1) ${(customMinutes / 120) * 100}%)`,
                    }}
                  />
                  <span className="text-white text-lg w-12">{customMinutes}</span>
                </div>
              </div>

              <GlassButton
                variant="primary"
                className="w-full"
                onClick={handleCustomPreset}
              >
                Set Custom Timer
              </GlassButton>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
