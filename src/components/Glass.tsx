import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glow?: boolean;
  glowColor?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = '',
  onClick,
  glow = false,
  glowColor = 'rgba(167, 139, 250, 0.3)',
  hover = true,
}: GlassCardProps) {
  return (
    <motion.div
      className={`relative ${className}`}
      onClick={onClick}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      whileTap={onClick ? { scale: 0.98 } : undefined}
      transition={{ duration: 0.2 }}
    >
      {/* Glow effect */}
      {glow && (
        <div
          className="absolute -inset-1 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            filter: 'blur(10px)',
          }}
        />
      )}

      {/* Card content */}
      <div
        className="relative backdrop-blur-xl rounded-3xl p-4 overflow-hidden"
        style={{
          background: 'rgba(255, 255, 255, 0.08)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: `
            0 4px 30px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
        }}
      >
        {/* Top highlight */}
        <div
          className="absolute top-0 left-4 right-4 h-px rounded-full"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
          }}
        />

        {/* Subtle inner glow */}
        <div
          className="absolute inset-0 rounded-3xl"
          style={{
            background: 'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.05) 0%, transparent 50%)',
          }}
        />

        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
}

export function GlassButton({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}) {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const variantStyles = {
    primary: {
      background: 'rgba(167, 139, 250, 0.3)',
      border: 'rgba(167, 139, 250, 0.4)',
      glow: 'rgba(167, 139, 250, 0.5)',
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'rgba(255, 255, 255, 0.2)',
      glow: 'rgba(255, 255, 255, 0.2)',
    },
    accent: {
      background: 'rgba(251, 191, 36, 0.3)',
      border: 'rgba(251, 191, 36, 0.4)',
      glow: 'rgba(251, 191, 36, 0.5)',
    },
    ghost: {
      background: 'transparent',
      border: 'transparent',
      glow: 'transparent',
    },
  };

  const style = variantStyles[variant];

  return (
    <motion.button
      className={`relative ${sizeClasses[size]} ${className} rounded-2xl font-medium transition-colors`}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : { scale: 1.05, y: -2 }}
      whileTap={disabled ? undefined : { scale: 0.95 }}
      style={{
        background: style.background,
        border: `1px solid ${style.border}`,
        boxShadow: `0 4px 15px rgba(0, 0, 0, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)`,
        color: 'white',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {/* Hover glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0"
        style={{
          background: `radial-gradient(circle, ${style.glow} 0%, transparent 70%)`,
        }}
        whileHover={{ opacity: 0.3 }}
      />
      <span className="relative z-10">{children}</span>
    </motion.button>
  );
}

export function GlassInput({
  value,
  onChange,
  placeholder,
  type = 'text',
  className = '',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  className?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className={`px-4 py-3 rounded-2xl w-full ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        outline: 'none',
      }}
    />
  );
}

export function GlassTextarea({
  value,
  onChange,
  placeholder,
  className = '',
  rows = 3,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className={`px-4 py-3 rounded-2xl w-full resize-none ${className}`}
      style={{
        background: 'rgba(255, 255, 255, 0.08)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        color: 'white',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        outline: 'none',
      }}
    />
  );
}
