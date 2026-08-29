import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import srishtiLogo from '../assets/images/srishti-logo.png';

interface CustomSrishtiQRProps {
  value: string;
  size?: number;
  className?: string;
}

export const CustomSrishtiQR: React.FC<CustomSrishtiQRProps> = ({ value, size = 160, className = '' }) => {
  const [qrSrc, setQrSrc] = useState<string>('');

  useEffect(() => {
    let isMounted = true;
    const generateCustomQR = async () => {
      try {
        const canvas = document.createElement('canvas');
        const dpr = 3;
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Level 'H' Error Correction (30% redundancy capacity)
        const qrDataUrl = await QRCode.toDataURL(value, {
          errorCorrectionLevel: 'H',
          width: size * dpr,
          margin: 1,
          color: {
            dark: '#0F172A',
            light: '#FFFFFF',
          },
        });

        const qrImg = new Image();
        qrImg.src = qrDataUrl;
        await new Promise((resolve) => {
          qrImg.onload = resolve;
          qrImg.onerror = resolve;
        });

        ctx.drawImage(qrImg, 0, 0, canvas.width, canvas.height);

        // Center Srishti Logo emblem
        const logoImg = new Image();
        logoImg.src = srishtiLogo;
        await new Promise((resolve) => {
          logoImg.onload = resolve;
          logoImg.onerror = resolve;
        });

        const logoSize = canvas.width * 0.26;
        const logoX = (canvas.width - logoSize) / 2;
        const logoY = (canvas.height - logoSize) / 2;

        // Circular background behind logo
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, canvas.height / 2, (logoSize / 2) + 8, 0, Math.PI * 2);
        ctx.fillStyle = '#FFFFFF';
        ctx.fill();
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#2563EB';
        ctx.stroke();
        ctx.clip();

        ctx.drawImage(logoImg, logoX, logoY, logoSize, logoSize);
        ctx.restore();

        if (isMounted) {
          setQrSrc(canvas.toDataURL('image/png'));
        }
      } catch (err) {
        console.error('Failed to generate custom Srishti QR:', err);
        const fallbackUrl = await QRCode.toDataURL(value, {
          errorCorrectionLevel: 'H',
          width: size,
          margin: 1,
        });
        if (isMounted) setQrSrc(fallbackUrl);
      }
    };

    if (value) {
      generateCustomQR();
    }

    return () => {
      isMounted = false;
    };
  }, [value, size]);

  if (!qrSrc) {
    return (
      <div 
        style={{ width: size, height: size }} 
        className={`bg-white/10 rounded-xl animate-pulse flex items-center justify-center ${className}`}
      >
        <span className="text-[10px] text-gray-400">Rendering QR...</span>
      </div>
    );
  }

  return (
    <img 
      src={qrSrc} 
      alt="Srishti Verified QR Code" 
      style={{ width: size, height: size }}
      className={`rounded-xl shadow-md ${className}`} 
    />
  );
};
