import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

const HolographicHero: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const fullText = 'AI FUTURE TECHNOLOGY';
  
  // 打字机效果
  useEffect(() => {
    if (currentIndex < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + fullText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [currentIndex, fullText]);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20">
      {/* 背景网格 */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      <div className="container mx-auto px-6 text-center relative z-10">
        {/* 主标题 */}
        <div className="mb-8">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 relative">
            <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              {displayText}
            </span>
            <span className="animate-pulse">|</span>
            
            {/* 全息扫描线效果 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/20 to-transparent animate-pulse"></div>
            
            {/* 文字阴影效果 */}
            <div className="absolute inset-0 text-6xl md:text-8xl font-bold text-cyan-400/20 blur-sm -z-10">
              {displayText}
            </div>
          </h1>
          
          {/* 副标题 */}
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            探索人工智能的无限可能，体验前所未有的
            <span className="text-cyan-400 font-semibold"> 未来科技 </span>
            与
            <span className="text-purple-400 font-semibold"> 视觉盛宴</span>
          </p>
        </div>

        {/* 液态金属按钮组 */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
          <Button 
            size="lg"
            className="relative overflow-hidden bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white px-8 py-4 text-lg font-semibold transition-all duration-300 group"
          >
            <span className="relative z-10">开始探索</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300 to-blue-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </Button>
          
          <Button 
            variant="outline"
            size="lg"
            className="relative border-2 border-purple-500/50 text-purple-400 hover:text-white hover:bg-purple-500/20 px-8 py-4 text-lg font-semibold transition-all duration-300 group"
          >
            <span className="relative z-10">了解更多</span>
            <div className="absolute inset-0 bg-purple-500/10 scale-0 group-hover:scale-100 transition-transform duration-300 rounded"></div>
          </Button>
        </div>

        {/* 数据统计展示 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {[
            { label: '处理速度', value: '99.9%', unit: '准确率' },
            { label: '响应时间', value: '<1ms', unit: '延迟' },
            { label: '用户满意度', value: '100%', unit: '好评' }
          ].map((stat, index) => (
            <div 
              key={index}
              className="relative p-6 bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-lg hover:border-cyan-400/50 transition-all duration-300 group"
            >
              <div className="text-3xl font-bold text-cyan-400 mb-2">{stat.value}</div>
              <div className="text-gray-300 text-sm">{stat.label}</div>
              <div className="text-purple-400 text-xs">{stat.unit}</div>
              
              {/* 悬停发光效果 */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部滚动提示 */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-cyan-400/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-cyan-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export { HolographicHero };