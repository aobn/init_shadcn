import React, { useState, useEffect } from 'react';

interface HolographicTextProps {
  text: string;
  className?: string;
  glitchEffect?: boolean;
  rgbSplit?: boolean;
}

const HolographicText: React.FC<HolographicTextProps> = ({ 
  text, 
  className = '', 
  glitchEffect = false,
  rgbSplit = true 
}) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const [displayText, setDisplayText] = useState(text);

  // 故障效果
  useEffect(() => {
    if (!glitchEffect) return;

    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsGlitching(true);
        
        // 随机替换一些字符
        const glitchedText = text.split('').map(char => {
          return Math.random() > 0.8 ? String.fromCharCode(Math.random() * 94 + 33) : char;
        }).join('');
        
        setDisplayText(glitchedText);
        
        setTimeout(() => {
          setIsGlitching(false);
          setDisplayText(text);
        }, 100);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, [text, glitchEffect]);

  return (
    <div className={`relative inline-block ${className}`}>
      {/* 主文字 */}
      <span 
        className={`relative z-10 ${
          rgbSplit ? 'text-white' : 'text-cyan-400'
        } ${isGlitching ? 'animate-pulse' : ''}`}
        style={{
          textShadow: rgbSplit 
            ? `
              0 0 5px rgba(0, 212, 255, 0.8),
              0 0 10px rgba(0, 212, 255, 0.6),
              0 0 15px rgba(0, 212, 255, 0.4),
              0 0 20px rgba(0, 212, 255, 0.2)
            `
            : 'none'
        }}
      >
        {displayText}
      </span>

      {/* RGB分离效果 */}
      {rgbSplit && (
        <>
          {/* 红色通道 */}
          <span 
            className="absolute top-0 left-0 text-red-500 opacity-70 -z-10"
            style={{
              transform: isGlitching ? 'translate(2px, 1px)' : 'translate(1px, 0)',
              transition: 'transform 0.1s ease-out'
            }}
          >
            {displayText}
          </span>
          
          {/* 蓝色通道 */}
          <span 
            className="absolute top-0 left-0 text-blue-500 opacity-70 -z-10"
            style={{
              transform: isGlitching ? 'translate(-2px, -1px)' : 'translate(-1px, 0)',
              transition: 'transform 0.1s ease-out'
            }}
          >
            {displayText}
          </span>
          
          {/* 绿色通道 */}
          <span 
            className="absolute top-0 left-0 text-green-500 opacity-50 -z-10"
            style={{
              transform: isGlitching ? 'translate(0px, 2px)' : 'translate(0px, 1px)',
              transition: 'transform 0.1s ease-out'
            }}
          >
            {displayText}
          </span>
        </>
      )}

      {/* 扫描线效果 */}
      <div 
        className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent -z-20"
        style={{
          animation: 'scanLine 3s linear infinite',
          height: '2px',
          top: '50%'
        }}
      />

      {/* 全息投影底座 */}
      <div 
        className="absolute -bottom-2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent opacity-60"
        style={{
          animation: 'pulse 2s ease-in-out infinite'
        }}
      />
      
      {/* 故障条纹 */}
      {isGlitching && (
        <div className="absolute inset-0 -z-10">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white/10 h-px"
              style={{
                top: `${Math.random() * 100}%`,
                left: 0,
                right: 0,
                animation: `glitchStripe 0.1s linear infinite`,
                animationDelay: `${i * 0.02}s`
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes scanLine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes glitchStripe {
          0%, 100% { opacity: 0; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export { HolographicText };