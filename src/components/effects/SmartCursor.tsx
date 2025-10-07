import React, { useEffect, useRef, useState } from 'react';

const SmartCursor: React.FC = () => {
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

    // 鼠标移动处理 - 使用transform提高性能
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // 使用transform代替left/top，避免重排重绘
      cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
    };

    // 平滑跟随动画 - 提高跟随速度
    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.2; // 提高跟随速度从0.1到0.2
      trailY += (mouseY - trailY) * 0.2;
      
      trail.style.transform = `translate(${trailX}px, ${trailY}px) translate(-50%, -50%)`;
      
      requestAnimationFrame(animateTrail);
    };

    // 检测悬浮元素
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.classList.contains('cursor-pointer')) {
        setIsHovering(true);
        setCursorType('pointer');
      } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        setCursorType('text');
      } else {
        setIsHovering(false);
        setCursorType('default');
      }
    };

    // 点击效果
    const handleClick = () => {
      const ripple = document.createElement('div');
      ripple.className = 'cursor-ripple';
      ripple.style.left = `${mouseX}px`;
      ripple.style.top = `${mouseY}px`;
      document.body.appendChild(ripple);
      
      setTimeout(() => {
        document.body.removeChild(ripple);
      }, 600);
    };

    // 添加事件监听
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('click', handleClick);
    
    // 开始动画
    animateTrail();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <>
      {/* 主光标 */}
      <div
        ref={cursorRef}
        className={`fixed w-4 h-4 pointer-events-none z-[9999] will-change-transform ${
          isHovering ? 'scale-150' : 'scale-100'
        }`}
        style={{
          transform: 'translate(0px, 0px) translate(-50%, -50%)',
          mixBlendMode: 'difference',
          transition: 'scale 0.2s ease-out'
        }}
      >
        <div 
          className={`w-full h-full rounded-full border-2 transition-all duration-200 ${
            cursorType === 'pointer' 
              ? 'border-cyan-400 bg-cyan-400/20' 
              : cursorType === 'text'
              ? 'border-purple-400 bg-purple-400/20'
              : 'border-white bg-white/20'
          }`}
          style={{
            boxShadow: `0 0 20px ${
              cursorType === 'pointer' 
                ? 'rgba(0, 212, 255, 0.6)' 
                : cursorType === 'text'
                ? 'rgba(139, 92, 246, 0.6)'
                : 'rgba(255, 255, 255, 0.6)'
            }`
          }}
        />
        
        {/* 中心点 */}
        <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* 跟随轨迹 */}
      <div
        ref={trailRef}
        className="fixed w-8 h-8 pointer-events-none z-[9998] opacity-60 will-change-transform"
        style={{
          transform: 'translate(0px, 0px) translate(-50%, -50%)',
        }}
      >
        <div 
          className={`w-full h-full rounded-full border transition-all duration-300 ${
            isHovering 
              ? 'border-cyan-400/50 scale-125' 
              : 'border-white/30 scale-100'
          }`}
          style={{
            boxShadow: isHovering 
              ? '0 0 30px rgba(0, 212, 255, 0.4)' 
              : '0 0 15px rgba(255, 255, 255, 0.2)'
          }}
        />
      </div>

      {/* 全局样式 */}
      <style>{`
        * {
          cursor: none !important;
        }
        
        .cursor-ripple {
          position: fixed;
          width: 20px;
          height: 20px;
          border: 2px solid rgba(0, 212, 255, 0.8);
          border-radius: 50%;
          transform: translate(-50%, -50%);
          pointer-events: none;
          z-index: 9997;
          animation: rippleEffect 0.6s ease-out forwards;
        }
        
        @keyframes rippleEffect {
          0% {
            transform: translate(-50%, -50%) scale(0);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(3);
            opacity: 0;
          }
        }
        
        /* 特殊元素光标样式 */
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
      `}</style>
    </>
  );
};

export { SmartCursor };