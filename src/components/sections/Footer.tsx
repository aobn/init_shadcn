import React from 'react';
import { Button } from '@/components/ui/button';

const Footer: React.FC = () => {
  const socialLinks = [
    { name: 'GitHub', icon: '🐙', href: '#', color: 'hover:text-cyan-400' },
    { name: 'Twitter', icon: '🐦', href: '#', color: 'hover:text-blue-400' },
    { name: 'LinkedIn', icon: '💼', href: '#', color: 'hover:text-blue-600' },
    { name: 'Discord', icon: '🎮', href: '#', color: 'hover:text-purple-400' },
  ];

  const quickLinks = [
    { name: '产品介绍', href: '#' },
    { name: '技术文档', href: '#' },
    { name: '开发者API', href: '#' },
    { name: '社区论坛', href: '#' },
  ];

  return (
    <footer className="relative py-20 bg-black/50 backdrop-blur-sm border-t border-cyan-500/30 overflow-hidden">
      {/* 背景网格 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 212, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '30px 30px'
        }}></div>
      </div>

      {/* 扫描线动画 */}
      <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* 品牌信息 */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-2xl tracking-wider">FUTURE TECH</h3>
                <p className="text-cyan-400 text-sm">Powered by AI Innovation</p>
              </div>
            </div>
            
            <p className="text-gray-400 leading-relaxed mb-6 max-w-md">
              探索人工智能的无限可能，打造面向未来的智能解决方案。
              我们致力于推动科技边界，创造更美好的数字世界。
            </p>

            {/* 社交链接 */}
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className={`w-12 h-12 bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-lg flex items-center justify-center text-gray-400 ${link.color} transition-all duration-300 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:scale-110`}
                >
                  <span className="text-xl">{link.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* 快速链接 */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3 animate-pulse"></div>
              快速链接
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-cyan-400 transition-colors duration-300 flex items-center group"
                  >
                    <span className="w-1 h-1 bg-gray-600 rounded-full mr-3 group-hover:bg-cyan-400 transition-colors duration-300"></span>
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* 联系信息 */}
          <div>
            <h4 className="text-white font-semibold text-lg mb-6 flex items-center">
              <div className="w-2 h-2 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
              联系我们
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center text-gray-400">
                <span className="text-cyan-400 mr-3">📧</span>
                <span className="hover:text-cyan-400 transition-colors duration-300">
                  allnotice@qq.com
                </span>
              </div>
              
              <div className="flex items-center text-gray-400">
                <span className="text-purple-400 mr-3">📱</span>
                <span className="hover:text-purple-400 transition-colors duration-300">
                  +86 400-888-0000
                </span>
              </div>
              
              <div className="flex items-center text-gray-400">
                <span className="text-green-400 mr-3">📍</span>
                <span className="hover:text-green-400 transition-colors duration-300">
                  北京市朝阳区未来科技园
                </span>
              </div>
            </div>

            {/* 订阅按钮 */}
            <Button 
              className="mt-6 w-full bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white transition-all duration-300"
            >
              订阅更新
            </Button>
          </div>
        </div>

        {/* 分割线 */}
        <div className="my-12 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>

        {/* 底部信息 */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-400 text-sm mb-4 md:mb-0">
            <span className="inline-block animate-pulse">©</span> 2024 Future Tech AI. 
            <span className="text-cyan-400 ml-2">All rights reserved.</span>
          </div>
          
          <div className="flex items-center space-x-6 text-sm text-gray-400">
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">隐私政策</a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">服务条款</a>
            <a href="#" className="hover:text-cyan-400 transition-colors duration-300">Cookie政策</a>
          </div>
        </div>

        {/* 版本信息 */}
        <div className="mt-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-black/30 backdrop-blur-sm border border-cyan-500/30 rounded-full">
            <div className="w-2 h-2 bg-green-400 rounded-full mr-3 animate-pulse"></div>
            <span className="text-gray-400 text-xs">
              System Status: <span className="text-green-400">Online</span> | 
              Version: <span className="text-cyan-400">v2.0.1</span> | 
              Uptime: <span className="text-purple-400">99.9%</span>
            </span>
          </div>
        </div>
      </div>

      {/* 底部发光效果 */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
    </footer>
  );
};

export { Footer };