import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';

const AIAssistant: React.FC = () => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<string[]>([
    "欢迎来到AI未来世界！",
    "我是您的智能助手ARIA",
    "点击我开始对话吧！"
  ]);
  const [currentMessage, setCurrentMessage] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);

  // 初始化音频上下文
  useEffect(() => {
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };
    
    // 用户交互后初始化音频
    const handleUserInteraction = () => {
      initAudio();
      document.removeEventListener('click', handleUserInteraction);
    };
    
    document.addEventListener('click', handleUserInteraction);
    return () => document.removeEventListener('click', handleUserInteraction);
  }, []);

  // 播放科幻音效
  const playBeep = (frequency: number, duration: number) => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  // 消息轮播
  useEffect(() => {
    if (!isActive) {
      const interval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % messages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isActive, messages.length]);

  const handleActivate = () => {
    setIsActive(!isActive);
    playBeep(800, 0.2);
    
    if (!isActive) {
      setIsListening(true);
      setTimeout(() => setIsListening(false), 2000);
    }
  };

  const handleVoiceCommand = () => {
    playBeep(1000, 0.1);
    setIsListening(true);
    
    // 模拟语音识别
    setTimeout(() => {
      setIsListening(false);
      setMessages(prev => [...prev, "正在处理您的指令..."]);
      
      setTimeout(() => {
        setMessages(prev => [...prev, "已为您优化系统性能！"]);
        playBeep(600, 0.3);
      }, 1500);
    }, 2000);
  };

  return (
    <div className="fixed bottom-8 right-8 z-50">
      {/* 主助手球体 */}
      <div className="relative">
        <Button
          onClick={handleActivate}
          className={`w-20 h-20 rounded-full p-0 border-0 overflow-hidden transition-all duration-500 ${
            isActive 
              ? 'bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 scale-110' 
              : 'bg-gradient-to-br from-cyan-500/80 to-purple-600/80 hover:scale-105'
          }`}
          style={{
            boxShadow: isActive 
              ? '0 0 40px rgba(0, 212, 255, 0.8), 0 0 80px rgba(139, 92, 246, 0.6)' 
              : '0 0 20px rgba(0, 212, 255, 0.5)',
          }}
        >
          {/* 内部动画环 */}
          <div className="absolute inset-2 rounded-full border-2 border-white/30 animate-spin"></div>
          <div className="absolute inset-4 rounded-full border border-white/50 animate-ping"></div>
          
          {/* 中心AI图标 */}
          <div className="relative z-10 text-white font-bold text-lg">
            {isListening ? '🎤' : '🤖'}
          </div>
          
          {/* 脉冲效果 */}
          {isActive && (
            <div className="absolute inset-0 rounded-full bg-white/20 animate-pulse"></div>
          )}
        </Button>

        {/* 环绕粒子 */}
        {isActive && [...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-cyan-400 rounded-full animate-pulse"
            style={{
              top: '50%',
              left: '50%',
              transform: `
                translate(-50%, -50%) 
                rotate(${i * 60}deg) 
                translateY(-50px) 
                rotate(${-i * 60}deg)
              `,
              animationDelay: `${i * 0.2}s`,
              boxShadow: '0 0 10px rgba(0, 212, 255, 0.8)',
            }}
          />
        ))}
      </div>

      {/* 对话气泡 */}
      {isActive && (
        <div className="absolute bottom-24 right-0 w-80 bg-black/90 backdrop-blur-sm border border-cyan-500/50 rounded-lg p-4 transform transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></div>
              <span className="text-cyan-400 font-semibold">ARIA AI Assistant</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsActive(false)}
              className="text-gray-400 hover:text-white p-1"
            >
              ✕
            </Button>
          </div>
          
          {/* 消息列表 */}
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {messages.slice(-3).map((message, index) => (
              <div
                key={index}
                className="text-gray-300 text-sm p-2 bg-gray-800/50 rounded border-l-2 border-cyan-400/50"
              >
                {message}
              </div>
            ))}
          </div>
          
          {/* 控制按钮 */}
          <div className="flex space-x-2">
            <Button
              size="sm"
              onClick={handleVoiceCommand}
              disabled={isListening}
              className="flex-1 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-400 hover:to-pink-500 text-white"
            >
              {isListening ? '🎤 听取中...' : '🎤 语音指令'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/10"
              onClick={() => {
                playBeep(700, 0.15);
                setMessages(prev => [...prev, "系统状态：正常运行"]);
              }}
            >
              📊 状态
            </Button>
          </div>
          
          {/* 底部指示器 */}
          <div className="mt-3 flex items-center justify-center">
            <div className="flex space-x-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    isListening 
                      ? 'bg-red-400 animate-pulse' 
                      : 'bg-cyan-400/50'
                  }`}
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 未激活时的提示消息 */}
      {!isActive && (
        <div className="absolute bottom-24 right-0 bg-black/80 backdrop-blur-sm border border-cyan-500/30 rounded-lg px-4 py-2 transform transition-all duration-300">
          <div className="text-cyan-400 text-sm font-medium">
            {messages[currentMessage]}
          </div>
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-purple-600 animate-pulse"></div>
        </div>
      )}
    </div>
  );
};

export { AIAssistant };