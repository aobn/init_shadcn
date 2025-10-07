import React from 'react';
import { ParticleBackground } from '@/components/effects/ParticleBackground';
import { MatrixRain } from '@/components/effects/MatrixRain';
import { PerformanceCursor } from '@/components/effects/PerformanceCursor';
import { AIAssistant } from '@/components/effects/AIAssistant';
import { BlackHole } from '@/components/effects/BlackHole';
import { LinearBlackHole } from '@/components/effects/LinearBlackHole';
import { NeonNavbar } from '@/components/layout/NeonNavbar';
import { HolographicHero } from '@/components/sections/HolographicHero';
import { DataVisualization } from '@/components/sections/DataVisualization';
import { Interactive3D } from '@/components/sections/Interactive3D';
import { TechTimeline } from '@/components/sections/TechTimeline';
import { Footer } from '@/components/sections/Footer';

export const AIShowcase: React.FC = () => {
  return (
    <LinearBlackHole className="min-h-screen">
      <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 overflow-hidden">
        {/* 高性能智能光标 */}
        <PerformanceCursor />
        
        {/* Matrix代码雨背景 */}
        <MatrixRain />
        
        {/* 动态粒子背景 */}
        <ParticleBackground />
        
        {/* 黑洞动画元素 */}
        <BlackHole />
        
        {/* AI语音助手 */}
        <AIAssistant />
        
        {/* 主要内容区域 */}
        <div className="relative z-10">
          {/* 霓虹导航栏 */}
          <NeonNavbar />
          
          {/* 全息英雄区域 */}
          <HolographicHero />
          
          {/* 科幻数据可视化面板 */}
          <DataVisualization />
          
          {/* 3D悬浮交互元素 */}
          <Interactive3D />
          
          {/* 技术特性展示区和时间轴动画 */}
          <TechTimeline />
          
          {/* 底部信息区 */}
          <Footer />
        </div>
      </div>
    </LinearBlackHole>
  );
};

export default AIShowcase;