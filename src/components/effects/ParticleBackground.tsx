import React, { useEffect, useRef, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  opacity: number;
  life: number;
}

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number | undefined>(undefined);
  const mouseRef = useRef({ x: 0, y: 0 });

  // 粒子颜色配置
  const colors = [
    'rgba(0, 212, 255, 0.8)', // 霓虹蓝
    'rgba(139, 92, 246, 0.8)', // 紫色
    'rgba(0, 255, 136, 0.8)', // 荧光绿
    'rgba(255, 20, 147, 0.6)', // 深粉色
  ];

  // 创建粒子
  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: Math.random() * 0.8 + 0.2,
      life: Math.random() * 100 + 50,
    };
  }, [colors]);

  // 初始化粒子系统
  const initParticles = useCallback((canvas: HTMLCanvasElement) => {
    const particleCount = Math.min(300, Math.floor((canvas.width * canvas.height) / 8000));
    particlesRef.current = [];
    
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(canvas));
    }
  }, [createParticle]);

  // 更新粒子
  const updateParticles = useCallback((canvas: HTMLCanvasElement) => {
    particlesRef.current.forEach((particle, index) => {
      // 更新位置
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // 鼠标交互效果
      const dx = mouseRef.current.x - particle.x;
      const dy = mouseRef.current.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 100) {
        const force = (100 - distance) / 100;
        particle.vx += dx * force * 0.001;
        particle.vy += dy * force * 0.001;
      }
      
      // 边界检测
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
      
      // 保持在画布内
      particle.x = Math.max(0, Math.min(canvas.width, particle.x));
      particle.y = Math.max(0, Math.min(canvas.height, particle.y));
      
      // 生命周期
      particle.life--;
      if (particle.life <= 0) {
        particlesRef.current[index] = createParticle(canvas);
      }
    });
  }, [createParticle]);

  // 绘制粒子
  const drawParticles = useCallback((ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    
    // 绘制粒子
    particlesRef.current.forEach(particle => {
      ctx.save();
      ctx.globalAlpha = particle.opacity;
      ctx.fillStyle = particle.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = particle.color;
      
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    
    // 绘制连接线
    ctx.save();
    particlesRef.current.forEach((particle, i) => {
      particlesRef.current.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          const opacity = (120 - distance) / 120 * 0.3;
          ctx.globalAlpha = opacity;
          ctx.strokeStyle = 'rgba(0, 212, 255, 0.5)';
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particle.x, particle.y);
          ctx.lineTo(otherParticle.x, otherParticle.y);
          ctx.stroke();
        }
      });
    });
    ctx.restore();
  }, []);

  // 动画循环
  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    updateParticles(canvas);
    drawParticles(ctx);
    
    animationRef.current = requestAnimationFrame(animate);
  }, [updateParticles, drawParticles]);

  // 处理窗口大小变化
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles(canvas);
  }, [initParticles]);

  // 处理鼠标移动
  const handleMouseMove = useCallback((event: MouseEvent) => {
    mouseRef.current.x = event.clientX;
    mouseRef.current.y = event.clientY;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    // 设置画布大小
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // 初始化粒子
    initParticles(canvas);
    
    // 开始动画
    animate();
    
    // 添加事件监听
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [initParticles, animate, handleResize, handleMouseMove]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ background: 'transparent' }}
    />
  );
};

export { ParticleBackground };