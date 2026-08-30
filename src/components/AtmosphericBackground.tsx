import React from 'react';

export const AtmosphericBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Deep Midnight Base */}
      <div className="absolute inset-0 bg-[#030611]" />

      {/* 2. Top-Center Radiant Royal Blue Fluid Blob */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#2563EB]/28 via-[#1D4ED8]/18 to-transparent rounded-full blur-[120px]" />

      {/* 3. Mid-Right Electric Cyan & Cobalt Fluid Aura */}
      <div className="absolute top-[20%] -right-[12%] w-[750px] h-[750px] bg-gradient-to-br from-[#38BDF8]/22 via-[#2563EB]/28 to-[#1E40AF]/25 rounded-full blur-[140px]" />

      {/* 4. Bottom-Left Deep Sapphire Horizon Glow */}
      <div className="absolute -bottom-[12%] -left-[10%] w-[700px] h-[700px] bg-gradient-to-tr from-[#1E3A8A]/35 via-[#2563EB]/22 to-transparent rounded-full blur-[130px]" />

      {/* 5. Center Ambient Diffusion */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#1D4ED8]/12 rounded-full blur-[150px]" />

      {/* 6. Subtle Cyber Flow Vectors */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id="blueFluidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#60A5FA" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#2563EB" stopOpacity="0.8" />
          </linearGradient>
          <filter id="fluidGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Waveform 1 */}
        <path
          d="M-50,220 C200,120 320,380 560,260 C800,140 1000,320 1200,180 C1350,80 1440,110 1500,90"
          fill="none"
          stroke="url(#blueFluidGradient)"
          strokeWidth="2"
          strokeDasharray="4 4"
          filter="url(#fluidGlow)"
        />

        {/* Ambient Waveform 2 */}
        <path
          d="M-50,450 C300,520 600,350 900,480 C1200,600 1350,420 1500,460"
          fill="none"
          stroke="#38BDF8"
          strokeWidth="1"
          strokeOpacity="0.2"
        />

        {/* Pulsing Light Dots */}
        <g transform="translate(320, 380)">
          <circle r="6" fill="#38BDF8" opacity="0.4" filter="url(#fluidGlow)" />
          <circle r="3" fill="#FFFFFF" />
        </g>
        <g transform="translate(560, 260)">
          <circle r="7" fill="#60A5FA" opacity="0.5" filter="url(#fluidGlow)" />
          <circle r="3.5" fill="#FFFFFF" />
        </g>
        <g transform="translate(1200, 180)">
          <circle r="8" fill="#2563EB" opacity="0.6" filter="url(#fluidGlow)" />
          <circle r="4" fill="#FFFFFF" />
        </g>
      </svg>
    </div>
  );
};
