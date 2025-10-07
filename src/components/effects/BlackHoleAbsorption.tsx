import React, { useEffect, useRef, useCallback } from 'react';

interface BlackHoleAbsorptionProps {
  children: React.ReactNode;
  className?: string;
  absorptionIntensity?: number; // 吸入强度 0-1
  fadeDistance?: number; // 开始淡出的距离百分比
}

const BlackHoleAbsorption: React.FC<BlackHoleAbsorptionProps> = ({
  children,
  className = '',
  absorptionIntensity = 0.8,
  fadeDistance = 0.6
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLElement[]>([]);

  // 计算统一线性的黑洞吸入效果
  const calculateAbsorption = useCallback((element: HTMLElement, scrollProgress: number) => {
    // 统一的线性缩放 - 所有元素同步缩小
    const linearScale = Math.max(1 - (scrollProgress * absorptionIntensity), 0);
    
    // 统一的透明度变化
    const fadeStart = fadeDistance;
    const opacity = scrollProgress > fadeStart 
      ? Math.max(1 - ((scrollProgress - fadeStart) / (1 - fadeStart)), 0)
      : 1;
    
    // 获取元素位置（仅用于计算向心运动）
    const rect = element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;
    
    // 黑洞中心位置（屏幕中心）
    const blackHoleCenterX = window.innerWidth / 2;
    const blackHoleCenterY = window.innerHeight / 2;
    
    // 计算向黑洞中心的方向向量
    const directionX = blackHoleCenterX - elementCenterX;
    const directionY = blackHoleCenterY - elementCenterY;
    
    // 统一的向心运动强度 - 线性增长
    const pullStrength = scrollProgress * 0.15; // 降低拉拽强度，使运动更平滑
    
    // 线性向心位移 - 所有元素都朝同一方向移动
    const translateX = directionX * pullStrength;
    const translateY = directionY * pullStrength;
    
    // 移除随机旋转，使用统一的轻微旋转
    const uniformRotation = scrollProgress * 45; // 统一的45度旋转
    
    return {
      scale: linearScale,
      opacity,
      translateX,
      translateY,
      rotation: uniformRotation
    };
  }, [absorptionIntensity, fadeDistance]);

  // 更新所有元素的变换
  const updateElements = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // 计算滚动进度 (0-1)
    const scrollProgress = Math.min(scrollY / (documentHeight - windowHeight), 1);
    
    elementsRef.current.forEach(element => {
      if (!element) return;
      
      const absorption = calculateAbsorption(element, scrollProgress);
      
      // 应用变换
      element.style.transform = `
        translate3d(${absorption.translateX}px, ${absorption.translateY}px, 0)
        scale(${absorption.scale})
        rotate(${absorption.rotation}deg)
      `;
      element.style.opacity = absorption.opacity.toString();
      element.style.willChange = 'transform, opacity';
    });
  }, [calculateAbsorption]);

  // 收集所有可吸入的元素
  const collectElements = useCallback(() => {
    if (!containerRef.current) return;
    
    const elements = containerRef.current.querySelectorAll(
      'section, .absorption-target, nav, header, footer, .card, .data-panel, .hero-section'
    ) as NodeListOf<HTMLElement>;
    
    elementsRef.current = Array.from(elements);
    
    // 为每个元素添加初始样式
    elementsRef.current.forEach(element => {
      element.style.transformOrigin = 'center center';
      element.style.transition = 'none'; // 禁用CSS过渡，使用JS控制
    });
  }, []);

  useEffect(() => {
    collectElements();
    
    // 使用节流优化滚动性能
    let ticking = false;
    
    const throttledUpdate = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateElements();
          ticking = false;
        });
        ticking = true;
      }
    };

    // 添加滚动监听器
    window.addEventListener('scroll', throttledUpdate, { passive: true });
    window.addEventListener('resize', collectElements, { passive: true });
    
    // 初始更新
    updateElements();

    return () => {
      window.removeEventListener('scroll', throttledUpdate);
      window.removeEventListener('resize', collectElements);
      
      // 清理样式
      elementsRef.current.forEach(element => {
        if (element) {
          element.style.transform = '';
          element.style.opacity = '';
          element.style.willChange = '';
        }
      });
    };
  }, [updateElements, collectElements]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
      
      {/* 黑洞吸入视觉指示器 */}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        <div className="relative">
          {/* 引力场可视化 */}
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute border border-white/10 rounded-full animate-pulse"
              style={{
                width: `${(i + 1) * 100}px`,
                height: `${(i + 1) * 100}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animationDelay: `${i * 0.2}s`,
                animationDuration: '3s'
              }}
            />
          ))}
          
          {/* 中心吸入点 */}
          <div className="w-4 h-4 bg-white rounded-full opacity-50 animate-pulse" />
        </div>
      </div>

      {/* 全局样式 */}
      <style>{`
        /* 黑洞吸入效果优化 */
        .absorption-target {
          transform-origin: center center;
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* 性能优化 */
        * {
          will-change: auto;
        }
        
        /* 响应式调整 */
        @media (max-width: 768px) {
          .absorption-target {
            transform-origin: center center;
          }
        }
        
        /* 滚动条隐藏（可选） */
        body::-webkit-scrollbar {
          width: 8px;
        }
        
        body::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 4px;
        }
        
        body::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

export { BlackHoleAbsorption };