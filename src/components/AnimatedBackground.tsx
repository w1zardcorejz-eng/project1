import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BackgroundTheme } from '../types';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}

interface ThemeConfig {
  gradient: string[];
  particles: { colors: string[]; count: number };
  accent: string;
  fog: string;
}

const themeConfigs: Record<BackgroundTheme, ThemeConfig> = {
  forest: {
    gradient: ['#0a2e1c', '#1a4d2e', '#0d3d1f', '#052015'],
    particles: { colors: ['#a8e6cf', '#88d8b0', '#c8f7c5'], count: 30 },
    accent: '#50fa7b',
    fog: 'rgba(16, 185, 129, 0.15)',
  },
  mountain: {
    gradient: ['#1a1a2e', '#16213e', '#0f3460', '#1a1a2e'],
    particles: { colors: ['#e0e7ff', '#c7d2fe', '#a5b4fc'], count: 40 },
    accent: '#818cf8',
    fog: 'rgba(129, 140, 248, 0.12)',
  },
  'japanese-garden': {
    gradient: ['#d4a574', '#f5d6ba', '#e8b4b8', '#f5c6aa'],
    particles: { colors: ['#fda4af', '#fdba74', '#fcd34d'], count: 25 },
    accent: '#f472b6',
    fog: 'rgba(244, 114, 182, 0.1)',
  },
  'magic-lake': {
    gradient: ['#0c1445', '#1a237e', '#283593', '#1a237e'],
    particles: { colors: ['#a78bfa', '#818cf8', '#c4b5fd', '#f0abfc'], count: 50 },
    accent: '#a78bfa',
    fog: 'rgba(167, 139, 250, 0.18)',
  },
  'floating-islands': {
    gradient: ['#1e3a5f', '#2563eb', '#1e40af', '#1e3a5f'],
    particles: { colors: ['#93c5fd', '#7dd3fc', '#a5f3fc'], count: 35 },
    accent: '#fbbf24',
    fog: 'rgba(147, 197, 253, 0.12)',
  },
  'moon-garden': {
    gradient: ['#1a1a2e', '#16213e', '#0f0f1a', '#0a0a15'],
    particles: { colors: ['#fef3c7', '#fde68a', '#fcd34d', '#fbbf24'], count: 45 },
    accent: '#fbbf24',
    fog: 'rgba(251, 191, 36, 0.1)',
  },
  'autumn-forest': {
    gradient: ['#7c2d12', '#c2410c', '#ea580c', '#9a3412'],
    particles: { colors: ['#fdba74', '#fbbf24', '#fb923c', '#f87171'], count: 35 },
    accent: '#fbbf24',
    fog: 'rgba(251, 191, 36, 0.12)',
  },
  'northern-lights': {
    gradient: ['#0c1445', '#1e3a5f', '#164e63', '#0c1445'],
    particles: { colors: ['#5eead4', '#a7f3d0', '#86efac', '#c4b5fd'], count: 60 },
    accent: '#5eead4',
    fog: 'rgba(94, 234, 212, 0.12)',
  },
  'mystic-temple': {
    gradient: ['#1f1c1a', '#2d2520', '#1a1510', '#0d0a08'],
    particles: { colors: ['#fcd34d', '#fbbf24', '#f59e0b', '#fb923c'], count: 30 },
    accent: '#fbbf24',
    fog: 'rgba(251, 191, 36, 0.08)',
  },
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function generateParticles(count: number, _colors: string[]): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 4 + 1,
    opacity: Math.random() * 0.6 + 0.2,
    duration: Math.random() * 20 + 10,
    delay: Math.random() * 5,
  }));
}

interface AnimatedBackgroundProps {
  theme: BackgroundTheme;
  intensity?: number;
}

export function AnimatedBackground({ theme, intensity = 1 }: AnimatedBackgroundProps) {
  const config = themeConfigs[theme];
  const particles = useMemo(() => generateParticles(config.particles.count, config.particles.colors), [config]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient layers */}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(135deg, ${config.gradient.join(', ')})`,
        }}
      />

      {/* Animated gradient overlay */}
      <motion.div
        className="absolute inset-0 opacity-60"
        animate={{
          background: config.gradient.map((_, i) =>
            `radial-gradient(ellipse at ${(i * 25) % 100}% ${(i * 37) % 100}%, ${config.gradient[i]} 0%, transparent 50%)`
          ).join(', ')
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          repeatType: 'reverse',
        }}
        style={{
          background: `radial-gradient(ellipse at 50% 50%, ${config.gradient[1]} 0%, transparent 70%)`,
        }}
      />

      {/* Fog layers */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 30% 80%, ${config.fog} 0%, transparent 60%)`,
        }}
        animate={{
          x: [0, 30, 0],
          opacity: [0.4, 0.6, 0.4],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(ellipse at 70% 60%, ${config.fog} 0%, transparent 50%)`,
        }}
        animate={{
          x: [0, -40, 0],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Light rays */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `conic-gradient(from 180deg at 50% 0%, transparent 40%, ${config.fog} 50%, transparent 60%)`,
          opacity: 0.3,
        }}
        animate={{
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Particles */}
      {particles.map((particle, i) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size * intensity,
            height: particle.size * intensity,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            background: config.particles.colors[i % config.particles.colors.length],
            boxShadow: `0 0 ${particle.size * 2}px ${config.particles.colors[i % config.particles.colors.length]}`,
            opacity: particle.opacity * intensity,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() > 0.5 ? 10 : -10, 0],
            scale: [1, 1.2, 1],
            opacity: [particle.opacity * intensity, particle.opacity * intensity * 1.5, particle.opacity * intensity],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Glow orb */}
      <motion.div
        className="absolute"
        style={{
          width: '60vw',
          height: '60vw',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, ${config.accent}15 0%, transparent 70%)`,
          filter: 'blur(60px)',
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}
