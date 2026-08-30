import React from 'react';

export const AtmosphericBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* 1. Deep Matte Obsidian Canvas Base */}
      <div className="absolute inset-0 bg-[#090B0F]" />

      {/* 2. Soft Upper Ambient Lighting */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-[#1E2536]/30 via-[#141824]/15 to-transparent rounded-full blur-[120px]" />

      {/* 3. Subtle Bottom Corner Ambient Slate Reflection */}
      <div className="absolute -bottom-[10%] right-[-5%] w-[600px] h-[600px] bg-[#171C28]/25 rounded-full blur-[130px]" />

      {/* 4. Precision Monochromatic Node Track (Matching the timeline graph in reference image) */}
      <svg
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          <linearGradient id="monoLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#334155" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#475569" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#1E293B" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {/* Ambient Subtle Wave */}
        <path
          d="M-50,300 C250,180 400,420 700,280 C1000,140 1200,340 1500,220"
          fill="none"
          stroke="url(#monoLineGrad)"
          strokeWidth="1.5"
          strokeDasharray="4 4"
        />

        {/* Timeline Metric Nodes */}
        <circle cx="400" cy="420" r="4" fill="#64748B" />
        <circle cx="700" cy="280" r="4" fill="#94A3B8" />
        <circle cx="1000" cy="140" r="4" fill="#64748B" />
      </svg>
    </div>
  );
};
