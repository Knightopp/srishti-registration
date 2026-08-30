import React from 'react';

export const AtmosphericBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-[#000000]">
      {/* 1. Proper Pitch Black Background (70%) */}
      <div className="absolute inset-0 bg-[#000000]" />

      {/* 2. Very Subtle Dark Slate Vignette for depth */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-gradient-to-b from-[#111625]/20 to-transparent rounded-full blur-[140px]" />

      {/* 3. Subtle Corner Cyan Glow */}
      <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] bg-[#1E3A8A]/15 rounded-full blur-[160px]" />
    </div>
  );
};
