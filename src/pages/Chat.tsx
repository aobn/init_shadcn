import { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import * as htmlToImage from 'html-to-image';

type Message = {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  time: string;
};

function formatTime(date = new Date()) {
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-welcome',
      sender: 'bot',
      content: '你好！这是示例聊天界面。输入消息并点击发送试试～',
      time: formatTime(),
    },
  ]);
  const [input, setInput] = useState('');

  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const bubbleRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastGeneratedUrlRef = useRef<string | null>(null);

  useEffect(() => {
    // 滚动到底部
    const el = chatAreaRef.current;
    if (el) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages]);

  function sendMessage() {
    const text = input.trim();
    if (!text) return;

    const userMsg: Message = {
      id: `m-${Date.now()}-u`,
      sender: 'user',
      content: text,
      time: formatTime(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // 模拟机器人回复
    setTimeout(() => {
      const botMsg: Message = {
        id: `m-${Date.now()}-b`,
        sender: 'bot',
        content: `收到：“${text}”`,
        time: formatTime(),
      };
      setMessages((prev) => [...prev, botMsg]);
    }, 500);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  async function exportMessagePng(id: string) {
    const el = bubbleRefs.current.get(id);
    if (!el) return;
    const dataUrl = await htmlToImage.toPng(el, {
      pixelRatio: 2,
      backgroundColor:
        getComputedStyle(document.documentElement).getPropertyValue('--background') || '#fff',
    });
    downloadDataUrl(dataUrl, `message-${id}.png`);
    lastGeneratedUrlRef.current = dataUrl;
  }

  async function copyMessageTempLink(id: string) {
    const el = bubbleRefs.current.get(id);
    if (!el) return;
    const blob = await htmlToImage.toBlob(el, {
      pixelRatio: 2,
      backgroundColor:
        getComputedStyle(document.documentElement).getPropertyValue('--background') || '#fff',
    });
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    await navigator.clipboard.writeText(url);
    lastGeneratedUrlRef.current = url;
    alert('临时链接已复制（仅当前会话有效）：\n' + url);
  }

  async function exportChatAreaPng() {
    const el = chatAreaRef.current;
    if (!el) return;
    const dataUrl = await htmlToImage.toPng(el, {
      pixelRatio: 2,
      backgroundColor:
        getComputedStyle(document.documentElement).getPropertyValue('--background') || '#fff',
    });
    downloadDataUrl(dataUrl, `chat-${Date.now()}.png`);
    lastGeneratedUrlRef.current = dataUrl;
  }

  function downloadDataUrl(dataUrl: string, filename: string) {
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = filename;
    a.click();
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Card className="mx-auto max-w-3xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Chat</CardTitle>
          <div className="text-sm text-muted-foreground">{messages.length} 条消息</div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[50vh]">
            <div ref={chatAreaRef} className="space-y-4 p-2">
              {messages.map((m) => (
                <MessageBubble
                  key={m.id}
                  message={m}
                  attachRef={(el) => {
                    if (el) bubbleRefs.current.set(m.id, el);
                  }}
                  onExport={() => exportMessagePng(m.id)}
                  onCopyLink={() => copyMessageTempLink(m.id)}
                />
              ))}
            </div>
          </ScrollArea>
        </CardContent>

        <CardFooter className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={exportChatAreaPng}>
            导出聊天区 PNG
          </Button>
          <Input
            placeholder="输入消息..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <Button onClick={sendMessage}>发送</Button>
        </CardFooter>
      </Card>
    </div>
  );
}

function MessageBubble({
  message,
  attachRef,
  onExport,
  onCopyLink,
}: {
  message: Message;
  attachRef?: (el: HTMLDivElement | null) => void;
  onExport?: () => void;
  onCopyLink?: () => void;
}) {
  const isUser = message.sender === 'user';
  return (
    <div className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>B</AvatarFallback>
        </Avatar>
      )}

      <div
        ref={attachRef}
        className={`max-w-[75%] rounded-lg border p-3 text-sm ${
          isUser ? 'bg-primary text-primary-foreground' : 'bg-muted'
        }`}
      >
        <div className="whitespace-pre-wrap break-words">{message.content}</div>
        <div
          className={`mt-1 flex items-center justify-between gap-2 text-[11px] ${
            isUser ? 'text-primary-foreground/80' : 'text-muted-foreground'
          }`}
        >
          <span>{message.time}</span>

          {isUser && (
            <div className="flex items-center gap-1">
              <Button size="sm" variant="secondary" onClick={onExport}>
                导出PNG
              </Button>
              <Button size="sm" variant="ghost" onClick={onCopyLink}>
                复制临时链接
              </Button>
            </div>
          )}
        </div>
      </div>

      {isUser && (
        <Avatar className="h-8 w-8">
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}