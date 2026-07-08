import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { X, Trophy, Sparkles, Timer, RotateCcw, ExternalLink, Gauge, CheckCircle, Keyboard, Play } from 'lucide-react';
import { Language } from '../types';

interface TyperacerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface Quote {
  id: number;
  text: string;
  source: string;
  category: 'Ronaldo' | 'Luffy' | 'Basketball' | 'General';
}

const ANIMAL_AVATARS = [
  { emoji: '🦁', name: { en: 'Lion', mn: 'Арслан' } },
  { emoji: '🐯', name: { en: 'Tiger', mn: 'Бар' } },
  { emoji: '🐼', name: { en: 'Panda', mn: 'Панда' } },
  { emoji: '🦊', name: { en: 'Fox', mn: 'Үнэг' } },
  { emoji: '🐰', name: { en: 'Rabbit', mn: 'Туулай' } },
  { emoji: '🐨', name: { en: 'Koala', mn: 'Коала' } },
  { emoji: '🐶', name: { en: 'Puppy', mn: 'Гөлөг' } },
  { emoji: '🐱', name: { en: 'Kitty', mn: 'Муур' } },
  { emoji: '🐸', name: { en: 'Frog', mn: 'Мэлхий' } },
  { emoji: '🦄', name: { en: 'Unicorn', mn: 'Ганц эвэрт' } },
];

const ENGLISH_QUOTES: Quote[] = [
  {
    id: 1,
    text: "Your love makes me strong, your hate makes me unstoppable. I am always ready to win.",
    source: "Cristiano Ronaldo",
    category: "Ronaldo"
  },
  {
    id: 2,
    text: "I do not mind people hating me, because it pushes me to work harder and play better.",
    source: "Cristiano Ronaldo",
    category: "Ronaldo"
  },
  {
    id: 3,
    text: "If you do not take risks, you can never create a future. I will be the King of the Pirates!",
    source: "Monkey D. Luffy",
    category: "Luffy"
  },
  {
    id: 4,
    text: "I have failed over and over again in my life. And that is exactly why I succeed.",
    source: "Michael Jordan",
    category: "Basketball"
  },
  {
    id: 5,
    text: "You can do anything if you work hard enough. Practice makes perfect, so never give up on your dreams.",
    source: "Chinzo AI",
    category: "General"
  },
  {
    id: 6,
    text: "I want to play football every single day. The roar of the stadium is the best feeling in the world.",
    source: "Chinzo's Dream",
    category: "General"
  },
  {
    id: 7,
    text: "One Piece is the greatest anime ever made. Every adventure starts with a single step into the grand line.",
    source: "Anime Fan",
    category: "Luffy"
  }
];

export default function TyperacerModal({ isOpen, onClose, lang }: TyperacerModalProps) {
  const [quote, setQuote] = useState<Quote>(ENGLISH_QUOTES[0]);
  const [inputValue, setInputValue] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [typedChars, setTypedChars] = useState(0);
  const [errorCount, setErrorCount] = useState(0);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'completed'>('idle');
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [bestWpm, setBestWpm] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [selectedAvatar, setSelectedAvatar] = useState('🦁');
  const [timeLeft, setTimeLeft] = useState(60);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load high score WPM
  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('chinzo_typeracer_best_wpm');
      if (saved) {
        setBestWpm(parseInt(saved, 10));
      }
      resetGame();
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isOpen]);

  // Live WPM calculation while playing
  useEffect(() => {
    if (gameState === 'playing' && startTime && !endTime) {
      const interval = setInterval(() => {
        const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
        if (timeElapsed > 0) {
          // Calculate correct chars typed
          let correct = 0;
          for (let i = 0; i < inputValue.length; i++) {
            if (inputValue[i] === quote.text[i]) {
              correct++;
            }
          }
          const currentWpm = Math.round((correct / 5) / timeElapsed);
          setWpm(currentWpm || 0);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [gameState, startTime, endTime, inputValue, quote]);

  // 1-minute countdown timer while playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (gameState === 'playing' && startTime && !endTime) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time is up!
            const now = Date.now();
            setEndTime(now);
            setGameState('completed');
            if (interval) clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, startTime, endTime]);

  // Auto-sync best WPM
  useEffect(() => {
    if (gameState === 'completed' && wpm > bestWpm) {
      setBestWpm(wpm);
      localStorage.setItem('chinzo_typeracer_best_wpm', wpm.toString());
    }
  }, [gameState, wpm, bestWpm]);

  if (!isOpen) return null;

  const selectRandomQuote = () => {
    const currentIndex = ENGLISH_QUOTES.findIndex(q => q.id === quote.id);
    let nextIndex = Math.floor(Math.random() * ENGLISH_QUOTES.length);
    while (nextIndex === currentIndex && ENGLISH_QUOTES.length > 1) {
      nextIndex = Math.floor(Math.random() * ENGLISH_QUOTES.length);
    }
    setQuote(ENGLISH_QUOTES[nextIndex]);
    resetGame();
  };

  const resetGame = () => {
    setInputValue('');
    setStartTime(null);
    setEndTime(null);
    setTypedChars(0);
    setErrorCount(0);
    setGameState('idle');
    setWpm(0);
    setAccuracy(100);
    setCountdown(null);
    setTimeLeft(60);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const startCountdown = () => {
    resetGame();
    setCountdown(3);
    const id = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) {
          clearInterval(id);
          return null;
        }
        if (prev <= 1) {
          clearInterval(id);
          setGameState('playing');
          setStartTime(Date.now());
          setTimeLeft(60);
          setTimeout(() => {
            inputRef.current?.focus();
          }, 50);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    timerRef.current = id;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (gameState !== 'playing') return;
    const value = e.target.value;
    
    // Calculate typing errors
    let errors = 0;
    for (let i = 0; i < value.length; i++) {
      if (value[i] !== quote.text[i]) {
        errors++;
      }
    }
    setErrorCount(errors);
    setTypedChars((prev) => Math.max(prev, value.length));

    // Calculate accuracy
    if (value.length > 0) {
      const acc = Math.round(((value.length - errors) / value.length) * 100);
      setAccuracy(acc < 0 ? 0 : acc);
    } else {
      setAccuracy(100);
    }

    setInputValue(value);

    // Check if finished
    if (value === quote.text) {
      const now = Date.now();
      setEndTime(now);
      setGameState('completed');
      
      const timeElapsed = (now - (startTime || now)) / 1000 / 60; // in minutes
      const finalWpm = Math.round((quote.text.length / 5) / (timeElapsed || 0.01));
      setWpm(finalWpm);
    }
  };

  // Visual text rendering with highlighting
  const renderQuoteText = () => {
    return quote.text.split('').map((char, index) => {
      let colorClass = 'text-gray-400';
      let bgClass = '';
      
      if (index < inputValue.length) {
        if (inputValue[index] === char) {
          colorClass = 'text-emerald-400 font-medium';
        } else {
          colorClass = 'text-red-500 font-bold';
          bgClass = 'bg-red-500/10 rounded';
        }
      } else if (index === inputValue.length && gameState === 'playing') {
        colorClass = 'text-white border-b-2 border-indigo-400 animate-pulse';
      }
      
      return (
        <span key={index} className={`${colorClass} ${bgClass} transition-colors font-mono text-sm md:text-base tracking-wide`}>
          {char}
        </span>
      );
    });
  };

  // Completion percentage for the racing track
  const progressPercent = quote.text.length > 0 ? (inputValue.length / quote.text.length) * 100 : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md" onClick={onClose}>
      <div 
        className="liquid-glass border border-white/20 w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-white/10 shrink-0 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Keyboard className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base md:text-lg font-bold text-white flex items-center gap-2">
                <span>{lang === 'mn' ? 'Англи хэлний бичих хурд' : 'English Typeracer'}</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-[10px] text-indigo-300 border border-indigo-500/30 font-mono font-bold">
                  EN
                </span>
              </h3>
              <p className="text-[10px] text-gray-400 font-mono">
                {lang === 'mn' ? 'Англиар зөв бөгөөд хурдан бичиж сурах тоглоом' : 'Practice typing in English and race to the finish!'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-black/20">
          
          {/* Quick HUD Metrics */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center space-y-1">
              <div className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">
                {lang === 'mn' ? 'Хугацаа' : 'Time'}
              </div>
              <div className={`text-base md:text-lg font-black font-mono flex items-center justify-center gap-1 ${
                timeLeft <= 10 ? 'text-red-500 animate-pulse' : 'text-indigo-400'
              }`}>
                <Timer className="w-3.5 h-3.5" />
                <span>{timeLeft}s</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center space-y-1">
              <div className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">
                {lang === 'mn' ? 'Хурд (WPM)' : 'Speed (WPM)'}
              </div>
              <div className="text-base md:text-lg font-black text-indigo-400 font-mono flex items-center justify-center gap-0.5">
                <Gauge className="w-3.5 h-3.5 text-indigo-400/80" />
                <span>{wpm}</span>
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center space-y-1">
              <div className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">
                {lang === 'mn' ? 'Нарийвчлал' : 'Accuracy'}
              </div>
              <div className="text-base md:text-lg font-black text-emerald-400 font-mono">
                {accuracy}%
              </div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center space-y-1">
              <div className="text-[10px] text-gray-500 uppercase font-mono tracking-wider">
                {lang === 'mn' ? 'Дээд хурд' : 'PB'}
              </div>
              <div className="text-base md:text-lg font-black text-amber-400 font-mono flex items-center justify-center gap-0.5">
                <Trophy className="w-3.5 h-3.5 text-amber-400/80" />
                <span>{bestWpm}</span>
              </div>
            </div>
          </div>

          {/* RACING TRACK */}
          <div className="relative bg-white/5 border border-white/10 rounded-xl p-4 overflow-hidden">
            <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500/20" />
            <div className="absolute inset-y-0 right-0 w-1 bg-amber-500/20" />
            
            <div className="text-[9px] uppercase tracking-wider text-gray-500 font-mono font-bold flex justify-between mb-3">
              <span>🚩 START</span>
              <span>🐾 RACEWAY</span>
              <span>🏁 FINISH</span>
            </div>

            {/* Track road */}
            <div className="h-10 bg-black/40 rounded-lg relative flex items-center border border-white/5 px-2">
              {/* Lane dashes */}
              <div className="absolute inset-x-0 h-[1px] border-t border-dashed border-white/10" />
              
              {/* Player Racer */}
              <div 
                className="absolute transition-all duration-300 ease-out flex items-center gap-1.5"
                style={{ left: `calc(${progressPercent}% * 0.88 + 8px)` }}
              >
                <span className="text-2xl filter drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]">
                  {selectedAvatar}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-[8px] font-bold font-mono text-white tracking-tight uppercase">
                  {lang === 'mn' ? 'Та' : 'You'}
                </span>
              </div>
            </div>
          </div>

          {/* QUOTE TYPING AREA */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 md:p-6 space-y-4 relative">
            <div className="flex justify-between items-center">
              <span className="px-2 py-0.5 rounded bg-white/10 text-[9px] text-gray-300 font-mono font-bold uppercase tracking-wider">
                Category: {quote.category}
              </span>
              <span className="text-[10px] text-gray-500 italic font-mono">
                — {quote.source}
              </span>
            </div>

            {/* The Text to Type */}
            <div className="leading-relaxed select-none min-h-[80px] flex items-center justify-center text-center p-3 rounded-lg bg-black/20 border border-white/5">
              {countdown !== null ? (
                <div className="text-center space-y-1">
                  <div className="text-4xl font-black text-indigo-400 animate-ping font-mono">{countdown}</div>
                  <div className="text-xs text-gray-500 font-mono uppercase tracking-widest">
                    {lang === 'mn' ? 'Бэлдээрэй...' : 'Get Ready...'}
                  </div>
                </div>
              ) : (
                <p className="text-left w-full">
                  {renderQuoteText()}
                </p>
              )}
            </div>
          </div>

          {/* ACTION BUTTONS & TEXT INPUT */}
          <div className="space-y-4">
            {gameState === 'playing' ? (
              <div className="space-y-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder={lang === 'mn' ? 'Энд бичнэ үү...' : 'Type the exact text above here...'}
                  autoComplete="off"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck="false"
                  className="w-full bg-white/10 border-2 border-indigo-500/40 focus:border-indigo-500 focus:outline-none rounded-xl px-4 py-3 text-sm md:text-base text-white placeholder-gray-500 font-mono shadow-lg transition-all"
                />
                <p className="text-[10px] text-gray-500 font-mono text-center">
                  {lang === 'mn' ? 'Том жижиг үсэг болон цэг таслалыг анхаараарай!' : 'Pay attention to capitalization and punctuation!'}
                </p>
              </div>
            ) : gameState === 'completed' ? (
              <div className={`border rounded-xl p-5 text-center space-y-4 animate-in zoom-in-95 duration-200 ${
                timeLeft === 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-emerald-500/10 border-emerald-500/20'
              }`}>
                <div className="flex flex-col items-center justify-center space-y-2">
                  {timeLeft === 0 ? (
                    <Timer className="w-12 h-12 text-red-400 stroke-[1.5] animate-pulse" />
                  ) : (
                    <CheckCircle className="w-12 h-12 text-emerald-400 stroke-[1.5] animate-bounce" />
                  )}
                  <h4 className={`text-lg font-bold ${timeLeft === 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                    {timeLeft === 0 
                      ? (lang === 'mn' ? 'Хугацаа дууслаа! (1 минут)' : "Time's Up! (1 Minute Limit)") 
                      : (lang === 'mn' ? 'Баяр хүргэе! Амжилттай дууслаа!' : 'Congratulations! Race Completed!')}
                  </h4>
                  <p className="text-xs text-gray-300 font-mono">
                    {timeLeft === 0 
                      ? (lang === 'mn' ? `Уралдааны 1 минутын хугацаа дууслаа. Та ${wpm} WPM хурдтай бичиж байлаа.` : `The 1-minute time limit ran out. You typed at ${wpm} WPM.`)
                      : (lang === 'mn' ? `Та уг өгүүлбэрийг ${wpm} WPM хурдтайгаар бичиж дуусгалаа.` : `You completed the quote at a speed of ${wpm} WPM.`)}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 justify-center">
                  <button
                    onClick={startCountdown}
                    className={`px-5 py-2.5 rounded-lg font-bold text-xs md:text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg ${
                      timeLeft === 0 
                        ? 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/10' 
                        : 'bg-emerald-500 hover:bg-emerald-600 text-black shadow-emerald-500/10'
                    }`}
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>{lang === 'mn' ? 'Дахин уралдах' : 'Race Again'}</span>
                  </button>
                  <button
                    onClick={selectRandomQuote}
                    className="px-5 py-2.5 rounded-lg bg-white/5 hover:bg-white/10 text-white font-bold text-xs md:text-sm border border-white/10 flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'mn' ? 'Өөр өгүүлбэр' : 'Next Quote'}</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 space-y-5 bg-white/5 rounded-xl border border-white/5 px-4 animate-in fade-in duration-300">
                {/* Animal Avatar Selector */}
                <div className="w-full max-w-md space-y-3">
                  <p className="text-xs font-mono font-bold text-gray-400 text-center uppercase tracking-wider">
                    {lang === 'mn' ? '🏎️ Амьтны аватар сонгох' : '🏎️ Choose your Animal Avatar'}
                  </p>
                  <div className="grid grid-cols-5 gap-2 justify-items-center">
                    {ANIMAL_AVATARS.map((av) => (
                      <button
                        key={av.emoji}
                        onClick={() => setSelectedAvatar(av.emoji)}
                        className={`w-12 h-12 rounded-xl text-2xl flex flex-col items-center justify-center border-2 transition-all relative cursor-pointer ${
                          selectedAvatar === av.emoji
                            ? 'bg-indigo-500/20 border-indigo-500 scale-110 shadow-lg shadow-indigo-500/10'
                            : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/25 hover:scale-105'
                        }`}
                        title={lang === 'mn' ? av.name.mn : av.name.en}
                      >
                        <span>{av.emoji}</span>
                        {selectedAvatar === av.emoji && (
                          <span className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-white rounded-full" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="h-px w-full max-w-md bg-white/5" />

                <div className="text-center space-y-1 max-w-sm">
                  <h4 className="text-sm font-bold text-white">
                    {lang === 'mn' ? 'Уралдааныг эхлүүлэх үү?' : 'Ready to start typing?'}
                  </h4>
                  <p className="text-[11px] text-gray-400">
                    {lang === 'mn' ? 'Англи хэлний бичих хурдаа нэмэгдүүлж, 1 минутын дотор уралдаарай!' : 'Improve your English typing speed and race within the 1-minute limit!'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={startCountdown}
                    className="px-6 py-3 rounded-xl bg-white hover:bg-gray-100 text-black font-bold text-sm flex items-center gap-2 transition-all cursor-pointer shadow-lg hover:shadow-white/10"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>{lang === 'mn' ? 'Уралдаж эхлэх' : 'Start Race'}</span>
                  </button>
                  <button
                    onClick={selectRandomQuote}
                    className="px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white border border-white/10 font-medium text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>{lang === 'mn' ? 'Өөр өгүүлбэр' : 'Change Quote'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* EXTERNAL VERCEL APP LINK */}
          <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-xl p-4 flex items-center justify-between gap-4 text-xs">
            <div className="space-y-1">
              <p className="font-bold text-indigo-300">
                {lang === 'mn' ? 'Үндсэн Typeracer цахим хуудас руу очих' : 'Visit Full Typeracer App'}
              </p>
              <p className="text-[10px] text-gray-400">
                {lang === 'mn' ? 'Чинзоригийн Vercel дээрх бүрэн хэмжээний бичих тоглоом руу зочлох уу?' : 'Want to visit Chinzo\'s full-featured Typeracer game deployed on Vercel?'}
              </p>
            </div>
            <a
              href="https://my-app-lilac-xi.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 hover:text-indigo-200 border border-indigo-500/30 font-semibold transition-all shrink-0 flex items-center gap-1.5 text-[11px]"
            >
              <span>{lang === 'mn' ? 'Нээх' : 'Visit'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
