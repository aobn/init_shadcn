import React, { useEffect, useRef, useCallback } from 'react';

interface LinearBlackHoleProps {
  children: React.ReactNode;
  className?: string;
  absorptionSpeed?: number; // 吸入速度 0-1
  fadeThreshold?: number; // 开始淡出的阈值 0-1
}

const LinearBlackHole: React.FC<LinearBlackHoleProps> = ({
  children,
  className = '',
  absorptionSpeed = 0.8,
  fadeThreshold = 0.7
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<HTMLElement[]>([]);

  // 线性黑洞吸入计算 - 完全统一的运动
  const calculateLinearAbsorption = useCallback((scrollProgress: number) => {
    // 1. 统一线性缩放 - 所有元素同步
    const scale = Math.max(1 - (scrollProgress * absorptionSpeed), 0.1);
    
    // 2. 统一透明度变化
    const opacity = scrollProgress > fadeThreshold 
      ? Math.max(1 - ((scrollProgress - fadeThreshold) / (1 - fadeThreshold)), 0)
      : 1;
    
    // 3. 统一旋转 - 轻微的顺时针旋转
    const rotation = scrollProgress * 30; // 最大30度旋转
    
    return { scale, opacity, rotation };
  }, [absorptionSpeed, fadeThreshold]);

  // 计算元素向心运动
  const calculateCenterPull = useCallback((element: HTMLElement, scrollProgress: number) => {
    const rect = element.getBoundingClientRect();
    const elementCenterX = rect.left + rect.width / 2;
    const elementCenterY = rect.top + rect.height / 2;
    
    // 屏幕中心作为黑洞位置
    const screenCenterX = window.innerWidth / 2;
    const screenCenterY = window.innerHeight / 2;
    
    // 计算到中心的距离和方向
    const deltaX = screenCenterX - elementCenterX;
    const deltaY = screenCenterY - elementCenterY;
    
    // 线性向心运动 - 强度与滚动进度成正比
    const pullIntensity = scrollProgress * 0.2; // 控制拉拽强度
    
    return {
      translateX: deltaX * pullIntensity,
      translateY: deltaY * pullIntensity
    };
  }, []);

  // 更新所有元素 - 统一变换
  const updateAllElements = useCallback(() => {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    
    // 计算滚动进度 (0-1)
    const scrollProgress = Math.min(scrollY / Math.max(documentHeight - windowHeight, 1), 1);
    
    // 获取统一的变换参数
    const { scale, opacity, rotation } = calculateLinearAbsorption(scrollProgress);
    
    // 应用到所有元素
    elementsRef.current.forEach(element => {
      if (!element) return;
      
      // 计算个别元素的向心运动
      const { translateX, translateY } = calculateCenterPull(element, scrollProgress);
      
      // 应用统一的变换
      element.style.transform = `
        translate3d(${translateX}px, ${translateY}px, 0)
        scale(${scale})
        rotate(${rotation}deg)
      `;
      element.style.opacity = opacity.toString();
      
      // 性能优化
      element.style.willChange = scrollProgress > 0 ? 'transform, opacity' : 'auto';
    });
  }, [calculateLinearAbsorption, calculateCenterPull]);

  // 收集页面元素
  const collectPageElements = useCallback(() => {
    if (!containerRef.current) return;
    
    // 选择所有主要页面元素
    const selectors = [
      'nav', 'header', 'section', 'footer',
      '.hero-section', '.data-panel', '.card',
      '.tech-timeline', '.interactive-3d',
      '[class*="section"]', '[class*="panel"]'
    ];
    
    const elements = containerRef.current.querySelectorAll(
      selectors.join(', ')
    ) as NodeListOf<HTMLElement>;
    
    elementsRef.current = Array.from(elements);
    
    // 设置初始样式
    elementsRef.current.forEach(element => {
      element.style.transformOrigin = 'center center';
      element.style.backfaceVisibility = 'hidden';
      element.style.perspective = '1000px';
    });
  }, []);

  useEffect(() => {
    collectPageElements();
    
    // 高性能滚动监听
    let rafId: number;
    let isScrolling = false;
    
    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        rafId = requestAnimationFrame(() => {
          updateAllElements();
          isScrolling = false;
        });
      }
    };

    // 事件监听
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', collectPageElements, { passive: true });
    
    // 初始更新
    updateAllElements();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', collectPageElements);
      
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      
      // 清理样式
      elementsRef.current.forEach(element => {
        if (element) {
          element.style.transform = '';
          element.style.opacity = '';
          element.style.willChange = '';
        }
      });
    };
  }, [updateAllElements, collectPageElements]);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {children}
      
      {/* 简化的视觉指示器 - 更清晰的中心点 */}
      <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
        {/* 黑洞中心指示器 */}
        <div className="relative">
          {/* 简洁的引力场圆环 */}
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="absolute border border-white/5 rounded-full"
              style={{
                width: `${i * 150}px`,
                height: `${i * 150}px`,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                animation: `pulse ${2 + i}s ease-in-out infinite`
              }}
            />
          ))}
          
          {/* 中心吸入点 */}
          <div className="w-3 h-3 bg-white/30 rounded-full animate-pulse" />
        </div>
      </div>

      {/* 优化的样式 */}
      <style>{`
        /* 线性黑洞效果样式 */
        .linear-absorption {
          transform-origin: center center;
          backface-visibility: hidden;
          perspective: 1000px;
        }
        
        /* 平滑过渡 */
        .smooth-transition {
          transition: transform 0.1s ease-out, opacity 0.1s ease-out;
        }
        
        /* 性能优化 */
        .will-change-transform {
          will-change: transform, opacity;
        }
        
        /* 移除默认的过渡效果，使用JS控制 */
        * {
          transition: none !important;
        }
        
        /* 确保滚动平滑 */
        html {
          scroll-behavior: smooth;
        }
        
        /* 隐藏滚动条但保持功能 */
        body::-webkit-scrollbar {
          width: 6px;
        }
        
        body::-webkit-scrollbar-track {
          background: transparent;
        }
        
        body::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        
        body::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
};

export { LinearBlackHole };