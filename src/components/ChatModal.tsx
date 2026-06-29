import { useState, useEffect, FormEvent } from 'react';
import { X, Send, MessageCircle, Calendar, User } from 'lucide-react';
import { Language, Message } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

const PRESET_MESSAGES: Message[] = [
  {
    id: '1',
    name: 'Аав, Ээж нь (Parents)',
    text: 'Миний хүүгийн веб сайт маш гоё болжээ! Сагсан бөмбөг болон хөлбөмбөгтөө улам мундаг болоорой. Хайртай шүү! ❤️',
    timestamp: '2026-06-28 14:30',
  },
  {
    id: '2',
    name: 'Багш нь (Teacher)',
    text: 'Чинзориг маань хичээлдээ ч мундаг, спортод ч идэвхтэй маш хөдөлмөрч хүү. Шинэ веб сайтад нь амжилт хүсье!',
    timestamp: '2026-06-28 16:15',
  },
  {
    id: '3',
    name: 'Найз Тэмүүлэн (Friend Temuulen)',
    text: 'Хөгжөөнтэй тоглолттой, сайн хамтрагч! Сагсны бэлтгэл дээр уулзъя, гоё веб сайт байна!',
    timestamp: '2026-06-29 09:00',
  },
];

export default function ChatModal({ isOpen, onClose, lang }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  useEffect(() => {
    const stored = localStorage.getItem('vex_messages');
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      setMessages(PRESET_MESSAGES);
      localStorage.setItem('vex_messages', JSON.stringify(PRESET_MESSAGES));
    }
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      name: name.trim(),
      text: text.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    const updated = [newMessage, ...messages];
    setMessages(updated);
    localStorage.setItem('vex_messages', JSON.stringify(updated));
    setName('');
    setText('');
  };

  const handleReset = () => {
    setMessages(PRESET_MESSAGES);
    localStorage.setItem('vex_messages', JSON.stringify(PRESET_MESSAGES));
  };

  const t = {
    title: lang === 'mn' ? 'Зурвас үлдээх' : 'Leave a Message',
    sub: lang === 'mn' ? 'Чинзоригт урам зориг өгөх сэтгэгдэл үлдээгээрэй.' : 'Write an encouraging message to Chinzorig.',
    namePlaceholder: lang === 'mn' ? 'Таны нэр' : 'Your Name',
    textPlaceholder: lang === 'mn' ? 'Зурвас бичих...' : 'Write a message...',
    sendBtn: lang === 'mn' ? 'Илгээх' : 'Send',
    resetBtn: lang === 'mn' ? 'Шинэчлэх' : 'Reset List',
    empty: lang === 'mn' ? 'Сэтгэгдэл байхгүй байна.' : 'No messages yet.',
    noName: lang === 'mn' ? 'Нэрээ оруулна уу' : 'Name required',
    noText: lang === 'mn' ? 'Зурвас оруулна уу' : 'Message required',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-md">
      <div 
        className="liquid-glass border border-white/20 w-full max-w-2xl rounded-2xl flex flex-col max-h-[85vh] shadow-2xl animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
              <MessageCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">{t.title}</h2>
              <p className="text-xs text-gray-400">{t.sub}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content & Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500 text-sm">
              {t.empty}
            </div>
          ) : (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 hover:border-white/20 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-white font-medium text-sm">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{msg.name}</span>
                  </div>
                  <div className="flex items-center gap-1 text-gray-500 text-xs">
                    <Calendar className="w-3.4 h-3.4" />
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
            ))
          )}
        </div>

        {/* Form Footer */}
        <form onSubmit={handleSubmit} className="p-6 border-t border-white/10 bg-black/40 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input 
              type="text" 
              required
              placeholder={t.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="sm:col-span-1 bg-white/5 border border-white/15 focus:border-white/40 focus:outline-none rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors"
            />
            <input 
              type="text" 
              required
              placeholder={t.textPlaceholder}
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="sm:col-span-3 bg-white/5 border border-white/15 focus:border-white/40 focus:outline-none rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors"
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors"
            >
              {t.resetBtn}
            </button>
            <button 
              type="submit"
              className="bg-white hover:bg-gray-100 text-black px-5 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors cursor-pointer"
            >
              <span>{t.sendBtn}</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
