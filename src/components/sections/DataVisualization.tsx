import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid } from 'recharts';

// 模拟数据
const performanceData = [
  { name: '00:00', cpu: 65, memory: 45, network: 80 },
  { name: '04:00', cpu: 72, memory: 52, network: 75 },
  { name: '08:00', cpu: 85, memory: 68, network: 90 },
  { name: '12:00', cpu: 78, memory: 61, network: 85 },
  { name: '16:00', cpu: 92, memory: 75, network: 95 },
  { name: '20:00', cpu: 88, memory: 70, network: 88 },
];

const systemStats = [
  { name: 'AI处理', value: 85, color: '#00D4FF' },
  { name: '数据分析', value: 92, color: '#8B5CF6' },
  { name: '网络优化', value: 78, color: '#00FF88' },
  { name: '安全防护', value: 96, color: '#FF1493' },
];

const pieData = [
  { name: 'CPU', value: 35, color: '#00D4FF' },
  { name: 'GPU', value: 25, color: '#8B5CF6' },
  { name: 'Memory', value: 20, color: '#00FF88' },
  { name: 'Storage', value: 20, color: '#FF1493' },
];

const DataVisualization: React.FC = () => {
  const [animatedValues, setAnimatedValues] = useState(systemStats.map(() => 0));

  // 动画效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedValues(systemStats.map(stat => stat.value));
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-6">
        {/* 标题 */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent">
              实时数据监控
            </span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            AI驱动的智能分析系统，实时监控系统性能与数据流动
          </p>
        </div>

        {/* 数据卡片网格 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {/* 系统性能卡片 */}
          {systemStats.map((stat, index) => (
            <Card 
              key={index}
              className="relative p-6 bg-black/40 backdrop-blur-sm border border-cyan-500/30 hover:border-cyan-400/50 transition-all duration-500 group overflow-hidden"
            >
              {/* 背景动画 */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* 扫描线效果 */}
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold text-lg">{stat.name}</h3>
                  <div className="text-2xl font-bold" style={{ color: stat.color }}>
                    {animatedValues[index]}%
                  </div>
                </div>
                
                <Progress 
                  value={animatedValues[index]} 
                  className="h-2 bg-gray-800"
                  style={{
                    '--progress-background': stat.color,
                  } as React.CSSProperties}
                />
                
                <div className="mt-4 text-sm text-gray-400">
                  性能指标: <span className="text-green-400">优秀</span>
                </div>
              </div>
              
              {/* 悬浮发光效果 */}
              <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                   style={{ boxShadow: `0 0 30px ${stat.color}` }}></div>
            </Card>
          ))}
        </div>

        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 性能趋势图 */}
          <Card className="p-6 bg-black/40 backdrop-blur-sm border border-purple-500/30 hover:border-purple-400/50 transition-all duration-500">
            <h3 className="text-white font-semibold text-xl mb-6 flex items-center">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-3 animate-pulse"></div>
              系统性能趋势
            </h3>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={performanceData}>
                  <defs>
                    <linearGradient id="cpuGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D4FF" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#00D4FF" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="memoryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Area 
                    type="monotone" 
                    dataKey="cpu" 
                    stroke="#00D4FF" 
                    strokeWidth={2}
                    fill="url(#cpuGradient)" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="memory" 
                    stroke="#8B5CF6" 
                    strokeWidth={2}
                    fill="url(#memoryGradient)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          {/* 资源分布图 */}
          <Card className="p-6 bg-black/40 backdrop-blur-sm border border-green-500/30 hover:border-green-400/50 transition-all duration-500">
            <h3 className="text-white font-semibold text-xl mb-6 flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              资源使用分布
            </h3>
            
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            {/* 图例 */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-gray-300 text-sm">{item.name}: {item.value}%</span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* 实时数据流 */}
        <div className="mt-16">
          <Card className="p-6 bg-black/40 backdrop-blur-sm border border-cyan-500/30 relative overflow-hidden">
            <h3 className="text-white font-semibold text-xl mb-6 flex items-center">
              <div className="w-3 h-3 bg-cyan-500 rounded-full mr-3 animate-pulse"></div>
              实时数据流
            </h3>
            
            {/* 数据流动画 */}
            <div className="relative h-32 bg-gray-900/50 rounded-lg overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="grid grid-cols-4 gap-8 w-full px-8">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="text-center">
                      <div className="text-2xl font-bold text-cyan-400 mb-2">
                        {Math.floor(Math.random() * 1000)}
                      </div>
                      <div className="text-sm text-gray-400">数据包/秒</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* 流动光线 */}
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export { DataVisualization };