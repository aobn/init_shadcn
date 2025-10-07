import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';

const TechTimeline: React.FC = () => {
  const [visibleItems, setVisibleItems] = useState<number[]>([]);
  const timelineRef = useRef<HTMLDivElement>(null);

  const timelineData = [
    {
      year: '2024',
      title: 'AI神经网络突破',
      description: '实现了前所未有的深度学习算法，处理能力提升1000倍',
      icon: '🧠',
      color: 'from-cyan-400 to-blue-600',
      status: 'completed'
    },
    {
      year: '2025',
      title: '量子计算商用化',
      description: '量子处理器正式投入商业应用，解决复杂计算问题',
      icon: '⚛️',
      color: 'from-purple-400 to-pink-600',
      status: 'current'
    },
    {
      year: '2026',
      title: '全息投影技术',
      description: '3D全息显示技术成熟，改变人机交互方式',
      icon: '🔮',
      color: 'from-green-400 to-emerald-600',
      status: 'future'
    },
    {
      year: '2027',
      title: '脑机接口普及',
      description: '直接的思维控制技术，实现真正的人机融合',
      icon: '🔗',
      color: 'from-orange-400 to-red-600',
      status: 'future'
    },
    {
      year: '2028',
      title: '通用人工智能',
      description: '达到人类水平的通用AI，开启智能新纪元',
      icon: '🤖',
      color: 'from-indigo-400 to-purple-600',
      status: 'future'
    }
  ];

  // 滚动动画检测
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.getAttribute('data-index') || '0');
            setVisibleItems(prev => [...new Set([...prev, index])]);
          }
        });
      },
      { threshold: 0.3 }
    );

    const items = timelineRef.current?.querySelectorAll('.timeline-item');
    items?.forEach(item => observer.observe(item));

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              技术发展路线图
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            见证科技演进的每一个里程碑，探索未来无限可能
          </p>
        </div>

        {/* 时间轴 */}
        <div className="relative" ref={timelineRef}>
          {/* 中央连接线 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-400 via-purple-500 to-transparent opacity-30"></div>
          
          {/* 流动光效 */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full">
            <div className="w-full h-20 bg-gradient-to-b from-cyan-400 to-transparent animate-pulse opacity-60"
                 style={{ animation: 'flowDown 3s ease-in-out infinite' }}></div>
          </div>

          {timelineData.map((item, index) => (
            <div
              key={index}
              className={`timeline-item relative flex items-center mb-16 ${
                index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
              }`}
              data-index={index}
            >
              {/* 时间轴节点 */}
              <div className="absolute left-1/2 transform -translate-x-1/2 z-20">
                <div 
                  className={`w-16 h-16 rounded-full border-4 border-cyan-400 flex items-center justify-center text-2xl transition-all duration-1000 ${
                    visibleItems.includes(index) 
                      ? 'bg-gradient-to-br from-cyan-400 to-purple-600 scale-100 opacity-100' 
                      : 'bg-black scale-75 opacity-50'
                  }`}
                  style={{
                    boxShadow: visibleItems.includes(index) 
                      ? '0 0 30px rgba(0, 212, 255, 0.6)' 
                      : 'none',
                  }}
                >
                  {item.icon}
                </div>
                
                {/* 脉冲效果 */}
                {visibleItems.includes(index) && (
                  <div className="absolute inset-0 rounded-full border-2 border-cyan-400 animate-ping opacity-30"></div>
                )}
              </div>

              {/* 内容卡片 */}
              <div className={`w-5/12 ${index % 2 === 0 ? 'pr-8' : 'pl-8'}`}>
                <Card 
                  className={`p-6 bg-black/40 backdrop-blur-sm border border-gray-700/50 hover:border-cyan-400/50 transition-all duration-1000 transform ${
                    visibleItems.includes(index)
                      ? 'translate-y-0 opacity-100 scale-100'
                      : index % 2 === 0 
                        ? 'translate-x-8 opacity-0 scale-95'
                        : '-translate-x-8 opacity-0 scale-95'
                  }`}
                  style={{
                    transitionDelay: `${index * 0.2}s`,
                  }}
                >
                  {/* 年份标签 */}
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold mb-4 bg-gradient-to-r ${item.color} text-white`}>
                    {item.year}
                  </div>
                  
                  {/* 状态指示器 */}
                  <div className="flex items-center mb-3">
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      item.status === 'completed' ? 'bg-green-400 animate-pulse' :
                      item.status === 'current' ? 'bg-yellow-400 animate-pulse' :
                      'bg-gray-500'
                    }`}></div>
                    <span className="text-xs text-gray-400 uppercase tracking-wider">
                      {item.status === 'completed' ? '已完成' :
                       item.status === 'current' ? '进行中' : '未来规划'}
                    </span>
                  </div>

                  {/* 标题 */}
                  <h3 className="text-white font-bold text-xl mb-3 hover:text-cyan-400 transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  {/* 描述 */}
                  <p className="text-gray-400 leading-relaxed">
                    {item.description}
                  </p>

                  {/* 悬浮发光效果 */}
                  {visibleItems.includes(index) && (
                    <div 
                      className="absolute inset-0 rounded-lg opacity-20 pointer-events-none"
                      style={{ 
                        boxShadow: `0 0 20px rgba(0, 212, 255, 0.3)`,
                        background: `linear-gradient(135deg, rgba(0, 212, 255, 0.05), rgba(139, 92, 246, 0.05))`
                      }}
                    ></div>
                  )}
                </Card>
              </div>
            </div>
          ))}
        </div>

        {/* 底部统计 */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: '技术突破', value: '50+', icon: '🚀' },
            { label: '专利申请', value: '200+', icon: '📋' },
            { label: '研发投入', value: '10亿+', icon: '💰' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="text-center p-6 bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg hover:border-cyan-400/50 transition-all duration-300 group"
            >
              <div className="text-4xl mb-3 transform group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* CSS动画 */}
      <style>{`
        @keyframes flowDown {
          0% { transform: translateY(-100px); opacity: 0; }
          50% { opacity: 1; }
          100% { transform: translateY(100px); opacity: 0; }
        }
      `}</style>
    </section>
  );
};

export { TechTimeline };