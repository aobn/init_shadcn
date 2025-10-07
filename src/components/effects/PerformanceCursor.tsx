import React, { useEffect, useRef, useState } from 'react';

const PerformanceCursor: React.FC = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorType, setCursorType] = useState<'default' | 'pointer' | 'text'>('default');

  useEffect(() => {
    const cursor = cursorRef.current;
    const trail = trailRef.current;
    if (!cursor || !trail) return;

    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;
    let animationId: number;

    // 高性能鼠标移动处理
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // 直接更新主光标位置，无延迟
      cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    };

    // 优化的跟随动画
    const animateTrail = () => {
      // 使用更快的插值速度
      const lerpFactor = 0.15;
      trailX += (mouseX - trailX) * lerpFactor;
      trailY += (mouseY - trailY) * lerpFactor;
      
      // 使用translate3d启用硬件加速
      trail.style.transform = `translate3d(${trailX}px, ${trailY}px, 0) translate(-50%, -50%)`;
      
      animationId = requestAnimationFrame(animateTrail);
    };

    // 检测悬浮元素 - 使用事件委托优化性能
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // 检查是否是可交互元素
      const isInteractive = target.closest('button, a, [role="button"], .cursor-pointer, input, textarea, select');
      
      if (isInteractive) {
        const tagName = target.tagName.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
          setCursorType('text');
          setIsHovering(false);
        } else {
          setCursorType('pointer');
          setIsHovering(true);
        }
      } else {
        setCursorType('default');
        setIsHovering(false);
      }
    };

    // 优化的点击效果
    const handleClick = (e: MouseEvent) => {
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple-optimized';
      ripple.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-50%, -50%)`;
      document.body.appendChild(ripple);
      
      // 使用Web Animations API替代CSS动画
      ripple.animate([
        { transform: 'translate3d(0, 0, 0) translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: 'translate3d(0, 0, 0) translate(-50%, -50%) scale(3)', opacity: 0 }
      ], {
        duration: 600,
        easing: 'ease-out'
      }).onfinish = () => {
        document.body.removeChild(ripple);
      };
    };

    // 使用passive事件监听器提高性能
    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseover', handleMouseOver, { passive: true });
    document.addEventListener('click', handleClick, { passive: true });
    
    // 开始动画
    animateTrail();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  return (
    <>
      {/* 主光标 - 零延迟跟随 */}
      <div
        ref={cursorRef}
        className={`fixed w-4 h-4 pointer-events-none z-[9999] will-change-transform transition-transform duration-200 ${
          isHovering ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transform: 'translate3d(0px, 0px, 0) translate(-50%, -50%)',
          mixBlendMode: 'difference'
        }}
      >
        <div 
          className={`w-full h-full rounded-full border-2 transition-colors duration-200 ${
            cursorType === 'pointer' 
              ? 'border-cyan-400 bg-cyan-400/20 shadow-cyan-glow' 
              : cursorType === 'text'
              ? 'border-purple-400 bg-purple-400/20 shadow-purple-glow'
              : 'border-white bg-white/20 shadow-white-glow'
          }`}
        />
        
        {/* 中心点 */}
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* 跟随轨迹 - 平滑跟随 */}
      <div
        ref={trailRef}
        className="fixed w-8 h-8 pointer-events-none z-[9998] opacity-60 will-change-transform"
        style={{
          transform: 'translate3d(0px, 0px, 0) translate(-50%, -50%)',
        }}
      >
        <div 
          className={`w-full h-full rounded-full border transition-all duration-300 ${
            isHovering 
              ? 'border-cyan-400/50 scale-125 shadow-cyan-trail' 
              : 'border-white/30 scale-100 shadow-white-trail'
          }`}
        />
      </div>

      {/* 优化的全局样式 */}
      <style>{`
        * {
          cursor: none !important;
        }
        
        .cursor-ripple-optimized {
          position: fixed;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 212, 255, 0.8);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9997;
        }
        
        .shadow-cyan-glow {
          box-shadow: 0 0 20px rgba(0, 212, 255, 0.6);
        }
        
        .shadow-purple-glow {
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
        }
        
        .shadow-white-glow {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.6);
        }
        
        .shadow-cyan-trail {
          box-shadow: 0 0 30px rgba(0, 212, 255, 0.4);
        }
        
        .shadow-white-trail {
          box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
        }
        
        /* 特殊元素光标样式 - 优化版本 */
        button, a, .cursor-pointer {
          position: relative;
        }
        
        button:hover::before, a:hover::before, .cursor-pointer:hover::before {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: inherit;
          background: linear-gradient(45deg, transparent, rgba(0, 212, 255, 0.2), transparent);
          z-index: -1;
          animation: borderGlow 2s linear infinite;
        }
        
        @keyframes borderGlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        /* 强制硬件加速 */
        .will-change-transform {
          will-change: transform;
          backface-visibility: hidden;
          perspective: 1000px;
        }
      `}</style>
    </>
  );
};

export { PerformanceCursor };