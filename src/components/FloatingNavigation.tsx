import { motion } from 'framer-motion';
import { Home, CheckSquare, Calendar, BarChart3, Trophy, User, Plus } from 'lucide-react';
import { NavView } from '../types';

interface NavigationItem {
  id: NavView;
  icon: React.ElementType;
}

const navItems: NavigationItem[] = [
  { id: 'home', icon: Home },
  { id: 'habits', icon: CheckSquare },
  { id: 'calendar', icon: Calendar },
  { id: 'analytics', icon: BarChart3 },
  { id: 'achievements', icon: Trophy },
  { id: 'profile', icon: User },
];

interface FloatingNavigationProps {
  currentView: NavView;
  onViewChange: (view: NavView) => void;
  onAddClick: () => void;
}

export function FloatingNavigation({ currentView, onViewChange, onAddClick }: FloatingNavigationProps) {
  return (
    <div className="fixed bottom-6 left-4 right-4 z-50">
      <motion.nav
        className="mx-auto max-w-md px-4 py-3 rounded-full"
        style={{
          background: 'rgba(20, 20, 30, 0.7)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1)
          `,
        }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex items-center justify-between relative">
          {navItems.slice(0, 3).map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={currentView === item.id}
              onClick={() => onViewChange(item.id)}
            />
          ))}

          {/* Center Add Button */}
          <motion.button
            className="absolute left-1/2 -translate-x-1/2 -top-4 w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.8) 0%, rgba(139, 92, 246, 0.8) 100%)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              boxShadow: `
                0 8px 25px rgba(167, 139, 250, 0.5),
                0 0 40px rgba(167, 139, 250, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.2)
              `,
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onAddClick}
          >
            <motion.div
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              style={{ position: 'absolute', inset: -4 }}
            >
              {/* Rotating glow effect */}
              <div
                className="absolute top-0 left-1/2 w-2 h-2 rounded-full"
                style={{
                  background: 'rgba(251, 191, 36, 0.8)',
                  boxShadow: '0 0 10px rgba(251, 191, 36, 0.8)',
                }}
              />
            </motion.div>
            <Plus size={28} color="white" strokeWidth={2.5} />
          </motion.button>

          {navItems.slice(3).map((item) => (
            <NavItem
              key={item.id}
              item={item}
              isActive={currentView === item.id}
              onClick={() => onViewChange(item.id)}
            />
          ))}
        </div>
      </motion.nav>
    </div>
  );
}

function NavItem({
  item,
  isActive,
  onClick,
}: {
  item: NavigationItem;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <motion.button
      className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
      onClick={onClick}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: 'rgba(167, 139, 250, 0.2)',
            boxShadow: '0 0 15px rgba(167, 139, 250, 0.4)',
          }}
          layoutId="nav-highlight"
          transition={{ type: 'spring', duration: 0.5 }}
        />
      )}
      <Icon
        size={22}
        strokeWidth={isActive ? 2.5 : 2}
        style={{
          color: isActive ? 'rgba(167, 139, 250, 1)' : 'rgba(255, 255, 255, 0.5)',
          filter: isActive ? 'drop-shadow(0 0 8px rgba(167, 139, 250, 0.6))' : 'none',
          transition: 'all 0.2s',
        }}
      />
    </motion.button>
  );
}
