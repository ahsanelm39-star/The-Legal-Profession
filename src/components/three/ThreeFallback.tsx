import React from 'react';
import './ThreeFallback.css';

export const ThreeFallback: React.FC = () => {
  return (
    <div className="three-fallback-container" aria-label="رسم هندسي ثلاثي الأبعاد لصرح مِيثاق المعماري">
      <div className="fallback-glow" />
      <svg
        className="fallback-svg"
        viewBox="0 0 600 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="fallbackGold" x1="100" y1="100" x2="500" y2="500" gradientUnits="userSpaceOnUse">
            <stop stopColor="#F2F0E9" />
            <stop offset="0.5" stopColor="#D0B783" />
            <stop offset="1" stopColor="#8C6F38" />
          </linearGradient>
          <linearGradient id="fallbackStone" x1="0" y1="0" x2="0" y2="600" gradientUnits="userSpaceOnUse">
            <stop stopColor="#1E2A3C" />
            <stop offset="1" stopColor="#0D1420" />
          </linearGradient>
        </defs>

        {/* Ambient Orbit Rings */}
        <ellipse cx="300" cy="300" rx="220" ry="110" stroke="url(#fallbackGold)" strokeWidth="1.5" strokeDasharray="4 8" opacity="0.4" />
        <ellipse cx="300" cy="300" rx="190" ry="190" stroke="url(#fallbackGold)" strokeWidth="1" opacity="0.2" />

        {/* Base Steps */}
        <rect x="150" y="460" width="300" height="24" rx="2" fill="url(#fallbackStone)" stroke="url(#fallbackGold)" strokeWidth="1.5" />
        <rect x="180" y="440" width="240" height="20" rx="2" fill="url(#fallbackStone)" stroke="url(#fallbackGold)" strokeWidth="1.5" />
        
        {/* Left Column */}
        <rect x="200" y="160" width="45" height="280" fill="url(#fallbackStone)" stroke="url(#fallbackGold)" strokeWidth="1.5" />
        <line x1="222" y1="160" x2="222" y2="440" stroke="#D0B783" strokeWidth="1" opacity="0.3" />

        {/* Right Column */}
        <rect x="355" y="160" width="45" height="280" fill="url(#fallbackStone)" stroke="url(#fallbackGold)" strokeWidth="1.5" />
        <line x1="377" y1="160" x2="377" y2="440" stroke="#D0B783" strokeWidth="1" opacity="0.3" />

        {/* Top Architrave */}
        <rect x="170" y="125" width="260" height="35" rx="2" fill="url(#fallbackStone)" stroke="url(#fallbackGold)" strokeWidth="2" />
        <rect x="150" y="105" width="300" height="20" rx="2" fill="url(#fallbackStone)" stroke="url(#fallbackGold)" strokeWidth="1.5" />

        {/* Central Floating Core */}
        <polygon points="300,230 335,300 300,370 265,300" fill="url(#fallbackStone)" stroke="url(#fallbackGold)" strokeWidth="2" />
        <circle cx="300" cy="300" r="10" fill="url(#fallbackGold)" />
      </svg>
    </div>
  );
};
