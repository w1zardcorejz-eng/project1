import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Download, X, Share, PlusSquare } from 'lucide-react';
import { GlassCard } from './Glass';
import { GlassButton } from './Glass';

interface InstallPromptProps {
  onDismiss: () => void;
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt({ onDismiss }: InstallPromptProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA
    const standalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true;
    setIsStandalone(standalone);

    // Check if iOS
    const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(isIOSDevice);

    // Listen for the beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  // Don't show if already installed
  if (isStandalone) {
    return null;
  }

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        onDismiss();
      }
      setDeferredPrompt(null);
    }
  };

  return (
    <motion.div
      className="fixed inset-x-4 bottom-28 z-50"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
    >
      <GlassCard className="p-4" glow glowColor="rgba(167, 139, 250, 0.2)">
        <div className="flex items-start gap-4">
          <motion.div
            className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 text-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(167, 139, 250, 0.3) 0%, rgba(139, 92, 246, 0.3) 100%)',
              boxShadow: '0 0 20px rgba(167, 139, 250, 0.3)',
            }}
            animate={{
              rotate: [0, 5, -5, 0],
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            🪷
          </motion.div>

          <div className="flex-1">
            <h3 className="text-white font-medium">Install Lotus</h3>
            <p className="text-white/50 text-sm mt-1">
              Add to your home screen for the best experience
            </p>

            {isIOS ? (
              <div className="mt-3 space-y-2">
                <p className="text-white/60 text-xs flex items-center gap-2">
                  <span>Tap</span>
                  <Share size={14} className="text-purple-400" />
                  <span>then</span>
                  <span>"Add to Home Screen"</span>
                  <PlusSquare size={14} className="text-purple-400" />
                </p>
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={onDismiss}
                  className="w-full"
                >
                  Got it!
                </GlassButton>
              </div>
            ) : deferredPrompt ? (
              <div className="mt-3 flex gap-2">
                <GlassButton
                  variant="primary"
                  size="sm"
                  onClick={handleInstall}
                  className="flex-1"
                >
                  <Download size={16} className="mr-2" />
                  Install
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  size="sm"
                  onClick={onDismiss}
                >
                  Later
                </GlassButton>
              </div>
            ) : (
              <div className="mt-3">
                <GlassButton
                  variant="secondary"
                  size="sm"
                  onClick={onDismiss}
                  className="w-full"
                >
                  Maybe later
                </GlassButton>
              </div>
            )}
          </div>

          <motion.button
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'rgba(255,255,255,0.1)' }}
            onClick={onDismiss}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <X size={16} className="text-white/50" />
          </motion.button>
        </div>
      </GlassCard>
    </motion.div>
  );
}
