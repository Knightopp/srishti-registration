import React from 'react';

export const AtmosphericBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Base Pitch Obsidian Layer */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* 2. Top-Center Blue Ambient Glow */}
      <div className="absolute -top-[10%] left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-[#2563EB]/25 via-[#1D4ED8]/15 to-transparent rounded-full blur-[110px]" />

      {/* 3. Mid-Right Radiant Electric Cobalt Aurora Bloom (Matching Screen 1 & 3) */}
      <div className="absolute top-[25%] -right-[10%] w-[650px] h-[650px] bg-gradient-to-br from-[#38BDF8]/20 via-[#2563EB]/30 to-[#4F46E5]/20 rounded-full blur-[130px] animate-pulse duration-[8000ms]" />

      {/* 4. Bottom-Left Horizon Glow (Matching Screen 2) */}
      <div className="absolute -bottom-[10%] -left-[10%] w-[600px] h-[600px] bg-gradient-to-tr from-[#1E40AF]/30 via-[#2563EB]/20 to-transparent rounded-full blur-[120px]" />

      {/* 5. Center Diffused Glow Field */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#2563EB]/10 rounded-full blur-[140px]" />

      {/* 6. Curved Trajectory Vector & Glowing Nodes (Directly from Reference Screen 1 & 3) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-35"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id="curveGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.9" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Dynamic Curved Trajectory Path */}
        <path
          d="M-50,220 C200,120 320,380 560,260 C800,140 1000,320 1200,180 C1350,80 1440,110 1500,90"
          fill="none"
          stroke="url(#curveGradient)"
          strokeWidth="2"
          strokeDasharray="4 4"
          filter="url(#glow)"
        />

        {/* Secondary Delicate Flow Line */}
        <path
          d="M-50,450 C300,520 600,350 900,480 C1200,600 1350,420 1500,460"
          fill="none"
          stroke="#2563EB"
          strokeWidth="1.5"
          strokeOpacity="0.25"
        />

        {/* Glowing Data Nodes (Matching Screen 1 Nodes) */}
        <g transform="translate(320, 380)">
          <circle r="7" fill="#FFFFFF" opacity="0.3" filter="url(#glow)" />
          <circle r="3.5" fill="#FFFFFF" />
        </g>
        <g transform="translate(560, 260)">
          <circle r="8" fill="#38BDF8" opacity="0.4" filter="url(#glow)" />
          <circle r="4" fill="#FFFFFF" />
        </g>
        <g transform="translate(1200, 180)">
          <circle r="9" fill="#60A5FA" opacity="0.5" filter="url(#glow)" />
          <circle r="4.5" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
