import { motion } from 'framer-motion';

interface ProgressRingProps {
  progress: number; // 0-1
  size: number;
  strokeWidth?: number;
  color?: string;
  bgColor?: string;
  showPercentage?: boolean;
  className?: string;
}

export function ProgressRing({
  progress,
  size,
  strokeWidth = 8,
  color = 'rgba(167, 139, 250, 0.8)',
  bgColor = 'rgba(255, 255, 255, 0.1)',
  showPercentage = false,
  className = '',
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="absolute transform -rotate-90"
      >
        <defs>
          <linearGradient id={`progress-gradient-${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(167, 139, 250, 1)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 1)" />
            <stop offset="100%" stopColor="rgba(251, 191, 36, 0.8)" />
          </linearGradient>
          <filter id={`progress-glow-${size}`}>
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background ring */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={bgColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />

        {/* Progress ring */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={`url(#progress-gradient-${size})`}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut' }}
          filter={`url(#progress-glow-${size})`}
        />

        {/* Glow effect */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth * 0.5}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ filter: `blur(${strokeWidth * 2}px)` }}
        />
      </svg>

      {showPercentage && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span
            className="font-light"
            style={{
              color: 'white',
              fontSize: size * 0.15,
              textShadow: '0 0 20px rgba(167, 139, 250, 0.5)',
            }}
          >
            {Math.round(progress * 100)}%
          </span>
        </motion.div>
      )}
    </div>
  );
}

export function CircularProgress({
  value,
  max,
  size = 60,
  strokeWidth = 4,
  color,
  label,
}: {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}) {
  const progress = max > 0 ? value / max : 0;

  return (
    <div className="inline-flex flex-col items-center gap-1">
      <ProgressRing
        progress={progress}
        size={size}
        strokeWidth={strokeWidth}
        color={color}
        showPercentage
      />
      {label && (
        <span className="text-xs text-white/60">{label}</span>
      )}
    </div>
  );
}
