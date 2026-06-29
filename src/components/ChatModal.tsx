import { useState, useEffect, FormEvent, useRef } from 'react';
import { X, Send, MessageCircle, Calendar, User, Flame, Sparkles } from 'lucide-react';
import { Language, Message } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  initialTab?: 'ronaldo' | 'chinzo' | 'guestbook';
}

interface AIChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
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

export default function ChatModal({ isOpen, onClose, lang, initialTab = 'ronaldo' }: ChatModalProps) {
  // Tabs: 'ronaldo' | 'chinzo' | 'guestbook'
  const [activeTab, setActiveTab] = useState<'ronaldo' | 'chinzo' | 'guestbook'>(initialTab);

  // Sync state tab on open or prop change
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Guestbook States
  const [guestMessages, setGuestMessages] = useState<Message[]>([]);
  const [guestName, setGuestName] = useState('');
  const [guestText, setGuestText] = useState('');

  // Ronaldo AI Chat States
  const [ronaldoHistory, setRonaldoHistory] = useState<AIChatMessage[]>([
    {
      id: 'welcome-ronaldo',
      sender: 'bot',
      text: lang === 'mn' 
        ? 'Сайн уу, Чинзориг миний найз! Намайг Кристиано Роналду гэдэг. Чи 10 настай хэрнээ хөлбөмбөг, сагсан бөмбөгт маш дуртай, мундаг хүү байна! Надтай хүссэн зүйлээ ярилцаарай. SIUUU! ⚽🏀'
        : 'Hello, my friend Chinzorig! I am Cristiano Ronaldo. I heard you are 10 years old and love basketball and football. Let\'s chat! SIUUU! ⚽🏀',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  // Chinzo AI Chat States
  const [chinzoHistory, setChinzoHistory] = useState<AIChatMessage[]>([
    {
      id: 'welcome-chinzo',
      sender: 'bot',
      text: lang === 'mn' 
        ? 'Сайн байна уу! Намайг Чинзориг (Chinzo) гэдэг. 😊 Би 10 настай. Сагсан бөмбөг, хөлбөмбөг тоглох маш дуртай! Мөн One Piece үзэх дуртай шүү. Миний веб хуудсанд тавтай морил! Чатлахад бэлэн байна уу, зүгээр ээ, хайртай шүү! ❤️'
        : 'Hello! I am Chinzorig (Chinzo) AI. 😊 I am 10 years old. I love playing basketball and football, and watching One Piece anime. Welcome to my portfolio! Let\'s chat, thank you and love you! ❤️',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load guestbook messages on open
  useEffect(() => {
    const stored = localStorage.getItem('vex_messages');
    if (stored) {
      setGuestMessages(JSON.parse(stored));
    } else {
      setGuestMessages(PRESET_MESSAGES);
      localStorage.setItem('vex_messages', JSON.stringify(PRESET_MESSAGES));
    }
  }, [isOpen]);

  // Scroll to bottom on AI chat updates
  useEffect(() => {
    if ((activeTab === 'ronaldo' || activeTab === 'chinzo') && chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ronaldoHistory, chinzoHistory, isTyping, activeTab]);

  if (!isOpen) return null;

  // Handle Guestbook Submit
  const handleGuestSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!guestName.trim() || !guestText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      name: guestName.trim(),
      text: guestText.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    const updated = [newMessage, ...guestMessages];
    setGuestMessages(updated);
    localStorage.setItem('vex_messages', JSON.stringify(updated));
    setGuestName('');
    setGuestText('');
  };

  const handleGuestReset = () => {
    setGuestMessages(PRESET_MESSAGES);
    localStorage.setItem('vex_messages', JSON.stringify(PRESET_MESSAGES));
  };

  // Handle AI Chat Submit (Both Ronaldo and Chinzo)
  const handleAiSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim() || isTyping) return;

    const userMsgText = chatInput.trim();
    setChatInput('');

    // Append user message
    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userMsgText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const currentHistory = activeTab === 'ronaldo' ? ronaldoHistory : chinzoHistory;
    const historySetter = activeTab === 'ronaldo' ? setRonaldoHistory : setChinzoHistory;

    historySetter((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      // Send chat request to server proxy endpoint with targeted bot selection
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsgText,
          history: currentHistory.map(h => ({
            sender: h.sender,
            text: h.text
          })),
          bot: activeTab // 'ronaldo' or 'chinzo'
        }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const botReply: AIChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      historySetter((prev) => [...prev, botReply]);
    } catch (error) {
      console.error(error);
      const errorMsg: AIChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'bot',
        text: lang === 'mn'
          ? 'Миний найз аа, интернэт холболт бага зэрэг алдаатай байна уу даа? Бэлтгэлээ үргэлжлүүлэн хийж байгаад дахин оролдоорой! Зүгээр ээ, хайртай шүү!'
          : 'My friend, is there a small connection error? Keep training and try again! It is okay, love you!',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      historySetter((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const t = {
    guestTitle: lang === 'mn' ? 'Зурвас үлдээх' : 'Leave a Message',
    ronaldoTitle: lang === 'mn' ? 'Роналдутай Чатлах' : 'Chat with Ronaldo',
    chinzoTitle: lang === 'mn' ? 'Чинзо туслахтай чатлах' : 'Chat with Chinzo AI',
    subGuest: lang === 'mn' ? 'Чинзоригт урам зориг өгөх сэтгэгдэл үлдээгээрэй.' : 'Write an encouraging message to Chinzorig.',
    subRonaldo: lang === 'mn' ? 'Хөлбөмбөгийн домог Кристиано Роналдутай ярилцаарай.' : 'Talk directly with the football legend Cristiano Ronaldo.',
    subChinzo: lang === 'mn' ? 'Чинзогийн AI хувилбар — түүний portfolio сайтыг тайлбарлана.' : 'Chinzo\'s AI assistant — introducing his portfolio and hobbies.',
    namePlaceholder: lang === 'mn' ? 'Таны нэр' : 'Your Name',
    textPlaceholder: lang === 'mn' ? 'Зурвас бичих...' : 'Write a message...',
    chatPlaceholderRonaldo: lang === 'mn' ? 'Роналдугаас асуух зүйлээ бичнэ үү...' : 'Ask Ronaldo anything...',
    chatPlaceholderChinzo: lang === 'mn' ? 'Чинзогоос асуух зүйлээ бичнэ үү...' : 'Ask Chinzo anything...',
    sendBtn: lang === 'mn' ? 'Илгээх' : 'Send',
    resetBtn: lang === 'mn' ? 'Шинэчлэх' : 'Reset List',
    empty: lang === 'mn' ? 'Сэтгэгдэл байхгүй байна.' : 'No messages yet.',
  };

  const activeHistory = activeTab === 'ronaldo' ? ronaldoHistory : chinzoHistory;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md">
      <div 
        className="liquid-glass border border-white/20 w-full max-w-2xl rounded-2xl flex flex-col h-[85vh] shadow-2xl animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
              {activeTab === 'ronaldo' && <Flame className="w-5 h-5 text-amber-500 animate-pulse" />}
              {activeTab === 'chinzo' && <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />}
              {activeTab === 'guestbook' && <MessageCircle className="w-5 h-5 text-sky-400" />}
            </div>
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-white">
                {activeTab === 'ronaldo' && t.ronaldoTitle}
                {activeTab === 'chinzo' && t.chinzoTitle}
                {activeTab === 'guestbook' && t.guestTitle}
              </h2>
              <p className="text-xs text-gray-400">
                {activeTab === 'ronaldo' && t.subRonaldo}
                {activeTab === 'chinzo' && t.subChinzo}
                {activeTab === 'guestbook' && t.subGuest}
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Toggle Navigation (3 tabs) */}
        <div className="flex border-b border-white/10 bg-black/30 p-1.5 gap-2 overflow-x-auto custom-scrollbar shrink-0">
          <button
            onClick={() => setActiveTab('ronaldo')}
            className={`flex-1 py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ronaldo' 
                ? 'bg-white text-black font-semibold shadow' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            🤖 {lang === 'mn' ? 'Роналду AI' : 'Ronaldo AI'}
          </button>
          <button
            onClick={() => setActiveTab('chinzo')}
            className={`flex-1 py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'chinzo' 
                ? 'bg-white text-black font-semibold shadow' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            👦 {lang === 'mn' ? 'Чинзо AI' : 'Chinzo AI'}
          </button>
          <button
            onClick={() => setActiveTab('guestbook')}
            className={`flex-1 py-2 px-3 text-xs md:text-sm font-medium rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'guestbook' 
                ? 'bg-white text-black font-semibold shadow' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📝 {lang === 'mn' ? 'Дэмжигчид' : 'Guestbook'}
          </button>
        </div>

        {/* AI Chat (for both Ronaldo and Chinzo tabs) */}
        {(activeTab === 'ronaldo' || activeTab === 'chinzo') && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-black/10">
              {activeHistory.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] ${
                    msg.sender === 'user' ? 'ml-auto flex-row-reverse' : 'mr-auto'
                  }`}
                >
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    msg.sender === 'user' 
                      ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30' 
                      : activeTab === 'ronaldo'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {msg.sender === 'user' ? 'ЧЗ' : activeTab === 'ronaldo' ? 'CR' : 'CZ'}
                  </div>

                  {/* Message Bubble */}
                  <div className={`rounded-2xl px-4 py-2.5 text-sm space-y-1 ${
                    msg.sender === 'user'
                      ? 'bg-white text-black rounded-tr-none shadow'
                      : 'bg-white/5 border border-white/10 text-gray-100 rounded-tl-none'
                  }`}>
                    <div className="flex items-center justify-between gap-6">
                      <span className="font-semibold text-xs opacity-60">
                        {msg.sender === 'user' 
                          ? (lang === 'mn' ? 'Чинзориг' : 'Chinzorig') 
                          : activeTab === 'ronaldo' 
                            ? 'Cristiano Ronaldo' 
                            : 'Chinzo AI'}
                      </span>
                      <span className="text-[10px] opacity-40">{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-[80%] mr-auto items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    activeTab === 'ronaldo'
                      ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {activeTab === 'ronaldo' ? 'CR' : 'CZ'}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* AI Chat Input Form */}
            <form onSubmit={handleAiSubmit} className="p-4 border-t border-white/10 bg-black/40 flex gap-3 shrink-0">
              <input 
                type="text" 
                required
                disabled={isTyping}
                placeholder={activeTab === 'ronaldo' ? t.chatPlaceholderRonaldo : t.chatPlaceholderChinzo}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 bg-white/5 border border-white/15 focus:border-white/40 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors disabled:opacity-50"
              />
              <button 
                type="submit"
                disabled={isTyping}
                className="bg-white hover:bg-gray-100 disabled:opacity-50 text-black px-6 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <span>{t.sendBtn}</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </>
        )}

        {/* Tab 3: Guestbook Wall */}
        {activeTab === 'guestbook' && (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
              {guestMessages.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                  {t.empty}
                </div>
              ) : (
                guestMessages.map((msg) => (
                  <div 
                    key={msg.id} 
                    className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2 hover:border-white/20 transition-all duration-200 animate-in fade-in slide-in-from-bottom-2 duration-200"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-white font-medium text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{msg.name}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>{msg.timestamp}</span>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Guestbook Form */}
            <form onSubmit={handleGuestSubmit} className="p-6 border-t border-white/10 bg-black/40 space-y-3 shrink-0">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input 
                  type="text" 
                  required
                  placeholder={t.namePlaceholder}
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  className="sm:col-span-1 bg-white/5 border border-white/15 focus:border-white/40 focus:outline-none rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors"
                />
                <input 
                  type="text" 
                  required
                  placeholder={t.textPlaceholder}
                  value={guestText}
                  onChange={(e) => setGuestText(e.target.value)}
                  className="sm:col-span-3 bg-white/5 border border-white/15 focus:border-white/40 focus:outline-none rounded-lg px-3 py-2 text-sm text-white placeholder-gray-500 transition-colors"
                />
              </div>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={handleGuestReset}
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
          </>
        )}
      </div>
    </div>
  );
}
