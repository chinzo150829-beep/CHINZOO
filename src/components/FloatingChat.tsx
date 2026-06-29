import { useState, useEffect, useRef, FormEvent } from 'react';
import { MessageCircle, X, Send, Sparkles, User } from 'lucide-react';
import { Language } from '../types';

interface FloatingChatProps {
  lang: Language;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
}

export default function FloatingChat({ lang }: FloatingChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message based on language
  useEffect(() => {
    setMessages([
      {
        id: 'welcome',
        sender: 'bot',
        text: lang === 'mn'
          ? 'Сайн байна уу! Би бол Чинзогийн AI туслах байна. 😊 Би 10 настай. Сагсан бөмбөг, хөлбөмбөг болон One Piece үзэх дуртай! Надтай чатлахад бэлэн үү, зүгээр ээ, хайртай шүү! ❤️'
          : 'Hello! I am Chinzo\'s AI assistant. 😊 I am 10 years old. I love basketball, football, and One Piece! Let\'s chat, thank you and love you! ❤️',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  }, [lang]);

  // Scroll to bottom
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isTyping) return;

    const userText = input.trim();
    setInput('');

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userText,
          history: messages.map(m => ({
            sender: m.sender,
            text: m.text
          })),
          bot: 'chinzo'
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
      const errMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: lang === 'mn'
          ? 'Уучлаарай, интернэт холболт түр саатлаа. Дахин оролдоорой, зүгээр ээ! ❤️'
          : 'Sorry, there was a temporary connection error. Please try again, it is okay! ❤️',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const t = {
    title: lang === 'mn' ? 'Чинзо AI (Туслах)' : 'Chinzo AI (Assistant)',
    status: lang === 'mn' ? 'Идэвхтэй' : 'Online',
    placeholder: lang === 'mn' ? 'Зурвас бичих...' : 'Write a message...',
    send: lang === 'mn' ? 'Илгээх' : 'Send',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Expanded Messenger-style Chat Panel */}
      {isOpen && (
        <div 
          className="liquid-glass border border-white/20 w-[340px] md:w-[380px] h-[480px] rounded-2xl mb-4 flex flex-col shadow-2xl animate-in slide-in-from-bottom-5 duration-300"
          style={{ contentVisibility: 'auto' }}
        >
          {/* Panel Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-black/40">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                  CZ
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border border-black rounded-full animate-pulse" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white tracking-tight leading-tight">{t.title}</h3>
                <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  ● {t.status}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 custom-scrollbar bg-black/20">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-2 max-w-[85%] ${
                  msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                {/* Micro Avatar */}
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-[10px] font-bold ${
                  msg.sender === 'user' 
                    ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
                    : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                }`}>
                  {msg.sender === 'user' ? 'У' : 'CZ'}
                </div>

                {/* Bubble */}
                <div className={`rounded-xl px-3.5 py-2 text-xs space-y-1 ${
                  msg.sender === 'user'
                    ? 'bg-white text-black rounded-tr-none'
                    : 'bg-white/5 border border-white/10 text-gray-100 rounded-tl-none'
                }`}>
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 max-w-[80%] mr-auto items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 text-[10px] font-bold">
                  CZ
                </div>
                <div className="bg-white/5 border border-white/10 rounded-xl rounded-tl-none px-3 py-2 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Input */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-white/10 bg-black/40 flex gap-2 shrink-0">
            <input 
              type="text" 
              required
              disabled={isTyping}
              placeholder={t.placeholder}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-white/5 border border-white/15 focus:border-white/40 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 transition-colors"
            />
            <button 
              type="submit"
              disabled={isTyping}
              className="bg-white hover:bg-gray-100 disabled:opacity-50 text-black px-3.5 rounded-xl text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
            >
              <Send className="w-3 h-3" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Messenger-style circular glass button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="liquid-glass border border-white/30 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group relative"
        title={lang === 'mn' ? 'Чинзо AI туслахтай чатлах' : 'Chat with Chinzo AI Assistant'}
      >
        <span className="absolute -inset-0.5 rounded-full bg-emerald-500/10 blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse" />
        
        {isOpen ? (
          <X className="w-6 h-6 text-white relative z-10" />
        ) : (
          <div className="relative flex items-center justify-center z-10">
            <MessageCircle className="w-6 h-6 text-white group-hover:rotate-12 transition-transform duration-300" />
            <Sparkles className="w-3.5 h-3.5 text-emerald-400 absolute -top-1.5 -right-1.5 animate-bounce" />
          </div>
        )}
        
        {/* Unread dot indicator when closed */}
        {!isOpen && (
          <span className="absolute top-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-black rounded-full z-20" />
        )}
      </button>

    </div>
  );
}
