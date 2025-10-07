import React, { useEffect, useRef, useState, useCallback } from 'react';

interface BlackHoleProps {
  className?: string;
  initialScale?: number;
  maxScale?: number;
  scrollSensitivity?: number;
}

const BlackHole: React.FC<BlackHoleProps> = ({
  className = '',
  initialScale = 0.3,
  maxScale = 1.5,
  scrollSensitivity = 0.001
}) => {
  const blackHoleRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(initialScale);
  const [rotation, setRotation] = useState(0);
  const animationRef = useRef<number>();

  // 滚动处理函数 - 使用useCallback优化性能
  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // 计算滚动进度 (0-1)
    const scrollProgress = Math.min(scrollY / (documentHeight - windowHeight), 1);
    
    // 计算新的缩放值
    const newScale = initialScale + (maxScale - initialScale) * scrollProgress;
    
    setScale(newScale);
  }, [initialScale, maxScale]);

  // 连续旋转动画
  const animate = useCallback(() => {
    setRotation(prev => (prev + 0.5) % 360);
    animationRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // 使用节流优化滚动性能
    let ticking = false;
    
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    // 添加滚动监听器
    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    // 开始旋转动画
    animate();
    
    // 初始化位置
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScroll);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [handleScroll, animate]);

  return (
    <div className={`fixed inset-0 pointer-events-none z-10 flex items-center justify-center ${className}`}>
      <div
        ref={blackHoleRef}
        className="relative will-change-transform"
        style={{
          transform: `scale(${scale}) rotate(${rotation}deg)`,
          transition: 'transform 0.1s ease-out'
        }}
      >
        {/* 外层吸积盘 */}
        <div className="absolute inset-0 w-96 h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
          <div className="absolute inset-0 rounded-full border-4 border-orange-500/30 animate-spin-slow">
            <div className="absolute inset-2 rounded-full border-2 border-red-500/40 animate-spin-reverse">
              <div className="absolute inset-4 rounded-full border border-yellow-500/50 animate-spin-slow">
                {/* 吸积盘粒子 */}
                {[...Array(12)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-orange-400 rounded-full animate-pulse"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `rotate(${i * 30}deg) translateX(${80 + i * 10}px) translateY(-50%)`,
                      animationDelay: `${i * 0.1}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 中层引力透镜效果 */}
        <div className="absolute inset-8 md:inset-12 lg:inset-16 rounded-full bg-gradient-radial from-transparent via-purple-500/20 to-transparent animate-pulse-slow">
          <div className="absolute inset-4 rounded-full bg-gradient-radial from-transparent via-blue-500/30 to-transparent">
            {/* 引力波纹 */}
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="absolute inset-0 rounded-full border border-cyan-400/20 animate-ping"
                style={{
                  animationDelay: `${i * 0.5}s`,
                  animationDuration: '3s'
                }}
              />
            ))}
          </div>
        </div>

        {/* 事件视界 - 黑洞核心 */}
        <div className="absolute inset-16 md:inset-20 lg:inset-24 rounded-full bg-black shadow-2xl">
          <div className="absolute inset-2 rounded-full bg-gradient-radial from-gray-900 to-black">
            <div className="absolute inset-4 rounded-full bg-black shadow-inner">
              {/* 霍金辐射效果 */}
              <div className="absolute inset-0 rounded-full bg-gradient-radial from-transparent via-white/5 to-transparent animate-pulse">
                {/* 量子涨落粒子 */}
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-twinkle"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      animationDelay: `${Math.random() * 2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 喷流效果 */}
        <div className="absolute top-0 left-1/2 w-1 h-32 bg-gradient-to-t from-blue-400/50 to-transparent transform -translate-x-1/2 -translate-y-full animate-pulse" />
        <div className="absolute bottom-0 left-1/2 w-1 h-32 bg-gradient-to-b from-blue-400/50 to-transparent transform -translate-x-1/2 translate-y-full animate-pulse" />
      </div>

      {/* 全局样式 */}
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.8; }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
        
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        
        .bg-gradient-radial {
          background: radial-gradient(circle, var(--tw-gradient-stops));
        }
        
        /* 响应式优化 */
        @media (max-width: 768px) {
          .animate-spin-slow {
            animation-duration: 30s;
          }
          .animate-spin-reverse {
            animation-duration: 25s;
          }
        }
        
        /* 性能优化 */
        .will-change-transform {
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </div>
  );
};

export { BlackHole };