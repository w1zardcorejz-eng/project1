import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, RotateCcw } from 'lucide-react';
import { GlassCard, GlassButton } from './Glass';
import { Theme, CustomTheme } from '../types';

const defaultCustomTheme: CustomTheme = {
  primaryColor: '#a78bfa',
  accentColor: '#fbbf24',
  backgroundTint: 'rgba(15, 15, 30, 1)',
  glassColor: 'rgba(255, 255, 255, 0.08)',
  glowColor: 'rgba(167, 139, 250, 0.3)',
  buttonColor: 'rgba(167, 139, 250, 0.3)',
  textColor: 'white',
  shadowIntensity: 0.3,
  blurIntensity: 20,
  cornerRadius: 24,
  animationSpeed: 1,
};

interface ThemeBuilderProps {
  currentTheme: Theme;
  onClose: () => void;
  onSave: (theme: Theme) => void;
}

export function ThemeBuilder({ currentTheme, onClose, onSave }: ThemeBuilderProps) {
  const [custom, setCustom] = useState<CustomTheme>(currentTheme.custom || defaultCustomTheme);

  const updateColor = (key: keyof CustomTheme, value: string) => {
    setCustom(prev => ({ ...prev, [key]: value }));
  };

  const updateNumber = (key: keyof CustomTheme, value: number) => {
    setCustom(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    onSave({
      ...currentTheme,
      mode: 'custom',
      custom,
    });
  };

  const handleReset = () => {
    setCustom(defaultCustomTheme);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-end justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div
        className="relative w-full max-w-lg rounded-t-3xl max-h-[90vh] overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, rgba(30, 30, 50, 0.98) 0%, rgba(20, 20, 35, 0.98) 100%)',
          backdropFilter: 'blur(20px)',
        }}
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 25 }}
      >
        {/* Header */}
        <div className="sticky top-0 flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-xl font-light text-white">Custom Theme</h2>
          <div className="flex items-center gap-2">
            <motion.button
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
              onClick={handleReset}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <RotateCcw size={18} className="text-white/70" />
            </motion.button>
            <motion.button
              className="w-10 h-10 rounded-full flex items-center justify-center bg-white/10"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <X size={20} className="text-white/70" />
            </motion.button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Preview */}
          <GlassCard className="p-4">
            <p className="text-white/50 text-sm mb-3">Preview</p>
            <div
              className="h-24 rounded-2xl flex items-center justify-center"
              style={{
                background: custom.glassColor,
                backdropFilter: `blur(${custom.blurIntensity}px)`,
                border: `1px solid ${custom.primaryColor}40`,
                boxShadow: `0 0 ${20 * custom.shadowIntensity}px ${custom.glowColor}`,
              }}
            >
              <motion.div
                className="px-4 py-2 rounded-xl text-sm"
                style={{
                  background: custom.buttonColor,
                  color: custom.textColor,
                }}
                animate={{
                  boxShadow: [
                    `0 0 10px ${custom.primaryColor}40`,
                    `0 0 20px ${custom.primaryColor}60`,
                    `0 0 10px ${custom.primaryColor}40`,
                  ],
                }}
                transition={{ duration: 2 * custom.animationSpeed, repeat: Infinity }}
              >
                Themed Button
              </motion.div>
            </div>
          </GlassCard>

          {/* Color Settings */}
          <div className="space-y-4">
            <h3 className="text-white/70 text-sm">Colors</h3>

            <ColorOption
              label="Primary Color"
              value={custom.primaryColor}
              onChange={(v) => updateColor('primaryColor', v)}
            />
            <ColorOption
              label="Accent Color"
              value={custom.accentColor}
              onChange={(v) => updateColor('accentColor', v)}
            />
            <ColorOption
              label="Glow Color"
              value={custom.glowColor}
              onChange={(v) => updateColor('glowColor', v)}
            />
            <ColorOption
              label="Button Color"
              value={custom.buttonColor}
              onChange={(v) => updateColor('buttonColor', v)}
            />
          </div>

          {/* Intensity Sliders */}
          <div className="space-y-4">
            <h3 className="text-white/70 text-sm">Effects</h3>

            <SliderOption
              label="Shadow Intensity"
              value={custom.shadowIntensity}
              min={0}
              max={1}
              step={0.05}
              onChange={(v) => updateNumber('shadowIntensity', v)}
            />
            <SliderOption
              label="Blur Intensity"
              value={custom.blurIntensity}
              min={5}
              max={50}
              step={1}
              onChange={(v) => updateNumber('blurIntensity', v)}
            />
            <SliderOption
              label="Corner Radius"
              value={custom.cornerRadius}
              min={4}
              max={48}
              step={2}
              onChange={(v) => updateNumber('cornerRadius', v)}
            />
            <SliderOption
              label="Animation Speed"
              value={custom.animationSpeed}
              min={0.5}
              max={3}
              step={0.1}
              onChange={(v) => updateNumber('animationSpeed', v)}
            />
          </div>

          {/* Save Button */}
          <GlassButton
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSave}
          >
            Save Theme
          </GlassButton>
        </div>
      </motion.div>
    </motion.div>
  );
}

function ColorOption({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/60 text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <motion.input
          type="color"
          value={value.startsWith('rgb') ? '#a78bfa' : value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg cursor-pointer"
          style={{
            background: 'none',
            border: 'none',
            padding: 0,
          }}
          whileHover={{ scale: 1.1 }}
        />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-2 py-1 rounded-lg text-xs w-28 bg-white/10 text-white/80 border border-white/10"
        />
      </div>
    </div>
  );
}

function SliderOption({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-white/60 text-sm">{label}</span>
        <span className="text-white/40 text-xs">{value.toFixed(step < 1 ? 2 : 0)}</span>
      </div>
      <input
        type="range"
        value={value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, rgba(167, 139, 250, 0.3) 0%, rgba(167, 139, 250, 0.8) ${((value - min) / (max - min)) * 100}%, rgba(255,255,255,0.1) ${((value - min) / (max - min)) * 100}%)`,
        }}
      />
    </div>
  );
}
