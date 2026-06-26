import { motion } from 'framer-motion';

interface LotusProps {
  progress?: number; // 0-1, how "bright/awakened" the lotus is
  size?: number;
  className?: string;
}

export function Lotus({ progress = 0.5, size = 200, className = '' }: LotusProps) {
  const brightness = 0.3 + progress * 0.7;
  const glowIntensity = 10 + progress * 30;

  return (
    <div className={`relative ${className}`} style={{ width: size, height: size }}>
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(167, 139, 250, ${brightness * 0.3}) 0%, transparent 70%)`,
          filter: `blur(${glowIntensity}px)`,
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [brightness * 0.6, brightness * 0.9, brightness * 0.6],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Inner glow */}
      <motion.div
        className="absolute inset-8 rounded-full"
        style={{
          background: `radial-gradient(circle, rgba(251, 191, 36, ${brightness * 0.2}) 0%, transparent 60%)`,
          filter: `blur(${glowIntensity * 0.6}px)`,
        }}
        animate={{
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* Lotus SVG */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        style={{ filter: `drop-shadow(0 0 ${glowIntensity * 0.3}px rgba(167, 139, 250, ${brightness}))` }}
      >
        <defs>
          <linearGradient id="lotus-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={`rgba(167, 139, 250, ${brightness})`} />
            <stop offset="50%" stopColor={`rgba(139, 92, 246, ${brightness * 0.8})`} />
            <stop offset="100%" stopColor={`rgba(124, 58, 237, ${brightness * 0.6})`} />
          </linearGradient>
          <linearGradient id="lotus-gradient-2" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`rgba(251, 191, 36, ${brightness * 0.3})`} />
            <stop offset="100%" stopColor={`rgba(167, 139, 250, ${brightness * 0.3})`} />
          </linearGradient>
          <filter id="lotus-glow">
            <feGaussianBlur stdDeviation="1" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Outer petals */}
        <g filter="url(#lotus-glow)">
          {[...Array(8)].map((_, i) => (
            <motion.ellipse
              key={`outer-${i}`}
              cx="50"
              cy="55"
              rx="8"
              ry="28"
              fill="url(#lotus-gradient-1)"
              opacity={0.7 * brightness}
              transform={`rotate(${i * 45} 50 55)`}
              animate={{
                opacity: [0.6 * brightness, 0.8 * brightness, 0.6 * brightness],
              }}
              transition={{
                duration: 3,
                delay: i * 0.1,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </g>

        {/* Middle petals */}
        <g filter="url(#lotus-glow)">
          {[...Array(6)].map((_, i) => (
            <motion.ellipse
              key={`middle-${i}`}
              cx="50"
              cy="52"
              rx="6"
              ry="22"
              fill="url(#lotus-gradient-1)"
              opacity={0.85 * brightness}
              transform={`rotate(${i * 60 + 30} 50 52)`}
              animate={{
                opacity: [0.75 * brightness, 0.95 * brightness, 0.75 * brightness],
              }}
              transition={{
                duration: 2.5,
                delay: i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </g>

        {/* Inner petals */}
        <g filter="url(#lotus-glow)">
          {[...Array(5)].map((_, i) => (
            <motion.ellipse
              key={`inner-${i}`}
              cx="50"
              cy="48"
              rx="5"
              ry="18"
              fill="url(#lotus-gradient-1)"
              opacity={brightness}
              transform={`rotate(${i * 72 + 36} 50 48)`}
              animate={{
                opacity: [0.85 * brightness, brightness, 0.85 * brightness],
              }}
              transition={{
                duration: 2,
                delay: i * 0.2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          ))}
        </g>

        {/* Center core */}
        <motion.ellipse
          cx="50"
          cy="45"
          rx="7"
          ry="10"
          fill="url(#lotus-gradient-2)"
          opacity={brightness}
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          style={{ transformOrigin: '50px 45px' }}
        />

        {/* Sparkles */}
        {[...Array(6)].map((_, i) => {
          const angle = (i * 60) * (Math.PI / 180);
          const x = 50 + Math.cos(angle) * 25;
          const y = 50 + Math.sin(angle) * 25;
          return (
            <motion.circle
              key={`sparkle-${i}`}
              cx={x}
              cy={y}
              r={1.5}
              fill={`rgba(251, 191, 36, ${brightness})`}
              animate={{
                opacity: [brightness * 0.3, brightness, brightness * 0.3],
                scale: [1, 1.5, 1],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
          );
        })}
      </svg>

      {/* Floating particles around lotus */}
      {[...Array(12)].map((_, i) => {
        const angle = (i * 30) * (Math.PI / 180);
        const distance = size * 0.45 + Math.random() * size * 0.15;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              width: 3 + Math.random() * 3,
              height: 3 + Math.random() * 3,
              left: '50%',
              top: '50%',
              background: `rgba(167, 139, 250, ${brightness * 0.7})`,
              boxShadow: `0 0 ${6 + brightness * 6}px rgba(167, 139, 250, ${brightness * 0.5})`,
            }}
            initial={{ x: x - 3, y: y - 3 }}
            animate={{
              x: [x - 3, x - 3 + Math.random() * 10 - 5, x - 3],
              y: [y - 3, y - 3 - 10, y - 3],
              opacity: [brightness * 0.3, brightness * 0.8, brightness * 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              delay: i * 0.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        );
      })}
    </div>
  );
}
