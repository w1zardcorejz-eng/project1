import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { AnimatedBackground } from './components/AnimatedBackground';
import { FloatingNavigation } from './components/FloatingNavigation';
import { HomeScreen } from './components/HomeScreen';
import { HabitsScreen } from './components/HabitsScreen';
import { CalendarScreen } from './components/CalendarScreen';
import { AnalyticsScreen } from './components/AnalyticsScreen';
import { AchievementsScreen } from './components/AchievementsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { FocusTimerScreen } from './components/FocusTimer';
import { NotesScreen } from './components/NotesScreen';
import { QuickAddModal } from './components/QuickAddModal';
import { InstallPrompt } from './components/InstallPrompt';
import { NavView } from './types';

function AppContent() {
  const { state } = useApp();
  const [currentView, setCurrentView] = useState<NavView>('home');
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem('install-prompt-dismissed');
    if (!dismissed) {
      setShowInstallPrompt(true);
    }
  }, []);

  const renderView = useCallback(() => {
    switch (currentView) {
      case 'home':
        return <HomeScreen />;
      case 'habits':
        return <HabitsScreen />;
      case 'calendar':
        return <CalendarScreen />;
      case 'analytics':
        return <AnalyticsScreen />;
      case 'achievements':
        return <AchievementsScreen />;
      case 'profile':
        return <ProfileScreen />;
      case 'focus':
        return <FocusTimerScreen />;
      case 'notes':
        return <NotesScreen />;
      default:
        return <HomeScreen />;
    }
  }, [currentView]);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: '#0a0a15' }}>
      <AnimatedBackground theme={state.theme.background} />

      <div className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderView()}
          </motion.div>
        </AnimatePresence>
      </div>

      <FloatingNavigation
        currentView={currentView}
        onViewChange={setCurrentView}
        onAddClick={() => setShowQuickAdd(true)}
      />

      <AnimatePresence>
        {showQuickAdd && (
          <QuickAddModal onClose={() => setShowQuickAdd(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInstallPrompt && (
          <InstallPrompt
            onDismiss={() => {
              setShowInstallPrompt(false);
              localStorage.setItem('install-prompt-dismissed', 'true');
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
