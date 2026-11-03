import React, { useState, useEffect } from 'react';
import { toggleSound, playPopSound } from '../utils/audio';
import { Volume2, VolumeX, Clock } from 'lucide-react';

export const TechnicalHUD: React.FC = () => {
  const [soundOn, setSoundOn] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toLocaleTimeString('en-IN', {
          timeZone: 'Asia/Kolkata',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' IST'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleToggleSound = () => {
    const newState = toggleSound();
    setSoundOn(newState);
    if (newState) {
      playPopSound();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 hidden lg:flex items-center gap-2 select-none">
      {/* Sound Controller Button */}
      <button
        onClick={handleToggleSound}
        className={`px-3 py-1.5 rounded-full backdrop-blur-xl border text-[11px] font-mono font-bold flex items-center gap-2 transition-all shadow-lg ${
          soundOn
            ? 'bg-brand-950 text-brand-gold border-brand-gold/40 shadow-[0_0_15px_rgba(221,167,79,0.2)]'
            : 'bg-white/85 text-brand-800 border-brand-800/15 hover:bg-white'
        }`}
        title="Toggle Experience Audio Feedback"
      >
        {soundOn ? (
          <>
            <Volume2 className="w-3.5 h-3.5 text-brand-gold" />
            <span>SOUND ON</span>
            <span className="flex items-center gap-0.5 ml-1">
              <span className="w-0.5 h-2.5 bg-brand-gold animate-pulse" />
              <span className="w-0.5 h-3.5 bg-brand-gold animate-pulse delay-75" />
              <span className="w-0.5 h-1.5 bg-brand-gold animate-pulse delay-150" />
            </span>
          </>
        ) : (
          <>
            <VolumeX className="w-3.5 h-3.5 text-brand-500" />
            <span className="text-brand-600">SOUND OFF</span>
          </>
        )}
      </button>

      {/* Live Precision Telemetry Badge */}
      <div className="px-3.5 py-1.5 rounded-full bg-brand-950/90 text-brand-cream border border-brand-800 text-[11px] font-mono flex items-center gap-3 backdrop-blur-xl shadow-lg">
        <span className="flex items-center gap-1.5 text-brand-gold font-bold">
          <Clock className="w-3 h-3 text-brand-gold" />
          <span>{timeStr || '16:30:00 IST'}</span>
        </span>
        <span className="text-brand-600">|</span>
        <span className="text-brand-300">
          BATCH <strong className="text-white">#0849-BOM</strong> (2.2°C HPP)
        </span>
      </div>
    </div>
  );
};
