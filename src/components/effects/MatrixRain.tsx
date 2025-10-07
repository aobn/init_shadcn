import React, { useEffect, useRef, useCallback } from 'react';

interface MatrixChar {
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
  isHead: boolean;
}

const MatrixRain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const charactersRef = useRef<MatrixChar[]>([]);
  const animationRef = useRef<number>();

  // Matrix字符集
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  // 创建字符
  const createCharacter = useCallback((canvas: HTMLCanvasElement): MatrixChar => {
    return {
      x: Math.floor(Math.random() * (canvas.width / 20)) * 20,
      y: Math.random() * canvas.height,
      char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
      speed: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2,
      isHead: Math.random() > 0.95,
    };
  }, [matrixChars]);

  // 初始化字符
  const initCharacters = useCallback((canvas: HTMLCanvasElement) => {
    const charCount = Math.floor((canvas.width * canvas.height) / 8000);
    charactersRef.current = [];
    
    for (let i = 0; i < charCount; i++) {
      charactersRef.current.push(createCharacter(canvas));
    }
  }, [createCharacter]);

  // 更新字符
  const updateCharacters = useCallback((canvas: HTMLCanvasElement) => {
    charactersRef.current.forEach((char, index) => {
      char.y += char.speed;
      
      // 随机改变字符
      if (Math.random() > 0.98) {
        char.char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      }
      
      // 重置超出边界的字符
      if (char.y > canvas.height + 20) {
        charactersRef.current[index] = createCharacter(canvas);
        charactersRef.current[index].y = -20;
      }
    });
  }, [createCharacter, matrixChars]);

  // 绘制字符
  const drawCharacters = useCallback((ctx: CanvasRenderingContext2D) => {
    // 清除画布，保留轨迹效果
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    ctx.font = '16px monospace';
    ctx.textAlign = 'center';
    
    charactersRef.current.forEach(char => {
      if (char.isHead) {
        // 头部字符 - 白色发光
        ctx.fillStyle = `rgba(255, 255, 255, ${char.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#FFFFFF';
      } else {
        // 普通字符 - 绿色
        ctx.fillStyle = `rgba(0, 255, 136, ${char.opacity * 0.8})`;
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00FF88';
      }
      
      ctx.fillText(char.char, char.x, char.y);
      ctx.shadowBlur = 0;
    });
  }, []);

  // 动画循环
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    updateCharacters(canvas);
    drawCharacters(ctx);
    
    animationRef.current = requestAnimationFrame(animate);
  }, [updateCharacters, drawCharacters]);

  // 处理窗口大小变化
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initCharacters(canvas);
  }, [initCharacters]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 设置画布大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 初始化字符
    initCharacters(canvas);
    
    // 开始动画
    animate();
    
    // 添加事件监听
    window.addEventListener('resize', handleResize);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
    };
  }, [initCharacters, animate, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 opacity-30"
      style={{ 
        background: 'transparent',
        mixBlendMode: 'screen'
      }}
    />
  );
};

export { MatrixRain };