import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const Interactive3D: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // 鼠标跟踪
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
          y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
        });
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', handleMouseMove);
      return () => container.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  const features = [
    {
      title: '量子计算',
      description: '突破传统计算极限，实现指数级性能提升',
      icon: '⚛️',
      color: 'from-cyan-400 to-blue-600',
      glowColor: 'cyan-400',
    },
    {
      title: '神经网络',
      description: '模拟人脑思维，实现智能决策与学习',
      icon: '🧠',
      color: 'from-purple-400 to-pink-600',
      glowColor: 'purple-400',
    },
    {
      title: '区块链',
      description: '去中心化架构，确保数据安全与透明',
      icon: '🔗',
      color: 'from-green-400 to-emerald-600',
      glowColor: 'green-400',
    },
    {
      title: '虚拟现实',
      description: '沉浸式体验，重新定义人机交互方式',
      icon: '🥽',
      color: 'from-orange-400 to-red-600',
      glowColor: 'orange-400',
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden" ref={containerRef}>
      <div className="container mx-auto px-6">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              3D交互体验
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            探索前沿技术的无限可能，感受未来科技的魅力
          </p>
        </div>

        {/* 中央3D悬浮球体 */}
        <div className="flex justify-center mb-20">
          <div className="relative w-64 h-64">
            {/* 主球体 */}
            <div 
              className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-600/20 backdrop-blur-sm border border-cyan-400/30 transition-transform duration-300 ease-out"
              style={{
                transform: `perspective(1000px) rotateX(${mousePosition.y * 10}deg) rotateY(${mousePosition.x * 10}deg) translateZ(20px)`,
                boxShadow: '0 0 60px rgba(0, 212, 255, 0.3), inset 0 0 60px rgba(139, 92, 246, 0.2)',
              }}
            >
              {/* 内部光环 */}
              <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/10 to-purple-500/10 animate-pulse"></div>
              <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cyan-400/20 to-purple-400/20 animate-pulse delay-75"></div>
              
              {/* 中心核心 */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-purple-600 animate-pulse shadow-lg shadow-cyan-400/50">
                <div className="absolute inset-2 rounded-full bg-white/20 animate-ping"></div>
              </div>
            </div>

            {/* 环绕粒子 */}
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full bg-cyan-400 animate-pulse"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `
                    translate(-50%, -50%) 
                    rotate(${i * 45}deg) 
                    translateY(-120px) 
                    rotate(${-i * 45}deg)
                    rotateX(${mousePosition.y * 5}deg)
                    rotateY(${mousePosition.x * 5}deg)
                  `,
                  animationDelay: `${i * 0.2}s`,
                  boxShadow: '0 0 10px rgba(0, 212, 255, 0.8)',
                }}
              />
            ))}
          </div>
        </div>

        {/* 特性卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="relative p-6 bg-black/40 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-500 group cursor-pointer overflow-hidden"
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                transform: hoveredCard === index 
                  ? `perspective(1000px) rotateX(${mousePosition.y * 5}deg) rotateY(${mousePosition.x * 5}deg) translateZ(20px) scale(1.05)`
                  : 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)',
                transition: 'transform 0.3s ease-out',
              }}
            >
              {/* 背景渐变 */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}></div>
              
              {/* 发光边框 */}
              <div 
                className={`absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                style={{ boxShadow: `0 0 30px rgba(0, 212, 255, 0.3)` }}
              ></div>

              <div className="relative z-10">
                {/* 图标 */}
                <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                
                {/* 标题 */}
                <h3 className="text-white font-bold text-xl mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                
                {/* 描述 */}
                <p className="text-gray-400 text-sm leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {feature.description}
                </p>

                {/* 悬浮时的额外效果 */}
                {hoveredCard === index && (
                  <div className="absolute top-2 right-2 w-2 h-2 bg-cyan-400 rounded-full animate-ping"></div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* 液态金属按钮组 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <Button 
            size="lg"
            className="relative overflow-hidden bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-600 hover:from-cyan-400 hover:via-blue-500 hover:to-purple-500 text-white px-8 py-4 text-lg font-semibold transition-all duration-500 group border-0"
            style={{
              background: 'linear-gradient(45deg, #00D4FF, #1E40AF, #8B5CF6)',
              backgroundSize: '200% 200%',
              animation: 'liquidFlow 3s ease-in-out infinite',
            }}
          >
            <span className="relative z-10">启动AI引擎</span>
            
            {/* 液态流动效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            
            {/* 边缘发光 */}
            <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                 style={{ boxShadow: '0 0 20px rgba(0, 212, 255, 0.5), inset 0 0 20px rgba(139, 92, 246, 0.3)' }}></div>
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="relative border-2 border-purple-500/50 text-purple-400 hover:text-white hover:bg-purple-500/20 px-8 py-4 text-lg font-semibold transition-all duration-500 group overflow-hidden"
          >
            <span className="relative z-10">深度学习</span>
            
            {/* 脉冲效果 */}
            <div className="absolute inset-0 bg-purple-500/10 scale-0 group-hover:scale-100 transition-transform duration-500 rounded"></div>
            
            {/* 边框动画 */}
            <div className="absolute inset-0 border-2 border-purple-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
          </Button>

          <Button 
            variant="outline"
            size="lg"
            className="relative border-2 border-green-500/50 text-green-400 hover:text-white hover:bg-green-500/20 px-8 py-4 text-lg font-semibold transition-all duration-500 group overflow-hidden"
          >
            <span className="relative z-10">量子计算</span>
            
            {/* 粒子效果 */}
            <div className="absolute inset-0">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute w-1 h-1 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                    animation: 'particleFloat 2s ease-in-out infinite',
                  }}
                />
              ))}
            </div>
          </Button>
        </div>
      </div>

      {/* CSS动画样式 */}
      <style>{`
        @keyframes liquidFlow {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes particleFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.7; }
          50% { transform: translateY(-10px) scale(1.2); opacity: 1; }
        }
      `}</style>
    </section>
  );
};

export { Interactive3D };