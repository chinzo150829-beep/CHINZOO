import { useState } from 'react';
import { Language } from './types';
import AnimatedHeading from './components/AnimatedHeading';
import FadeIn from './components/FadeIn';
import ChatModal from './components/ChatModal';
import FloatingChat from './components/FloatingChat';
import { Globe, ArrowRight, Trophy, Heart } from 'lucide-react';

const content = {
  en: {
    logo: "CHINZO",
    navLinks: ["My Story", "Hobbies", "🤖 My Idol"],
    heading: "Shaping tomorrow\nwith vision and action.",
    subheading: "Chinzorig. 10 years old. I love playing basketball and football. Building my own world with passion.",
    btnChat: "Chat",
    btnExplore: "More Details",
    tag: "Basketball. Football. Growth.",
    hobbyTitle: "Passionate Hobbyist",
    hobbySub: "Active on the court and the pitch"
  },
  mn: {
    logo: "CHINZO",
    navLinks: ["Миний түүх", "Хобби", "🤖 Миний Идол"],
    heading: "Мөрөөдлөө бүтээж,\nирээдүйгээ тодорхойлно.",
    subheading: "Чинзориг. 10 настай. Би сагсан бөмбөг болон хөл бөмбөг тоглох дуртай. Өөрийнхөө ертөнцийг өөрөө бүтээж байна.",
    btnChat: "Чатлах",
    btnExplore: "Дэлгэрэнгүй",
    tag: "Сагс. Хөл бөмбөг. Хөгжил.",
    hobbyTitle: "Спорт ба Хобби",
    hobbySub: "Сагсан бөмбөг болон хөл бөмбөгийн талбайд"
  }
};

export default function App() {
  const [lang, setLang] = useState<Language>('mn'); // Default to Mongolian as requested, but easily toggled
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialTab, setChatInitialTab] = useState<'ronaldo' | 'chinzo' | 'guestbook'>('ronaldo');
  const [showHobbyModal, setShowHobbyModal] = useState(false);

  const t = content[lang];

  return (
    <main className="relative min-h-screen w-full text-white bg-black flex flex-col justify-between overflow-hidden animate-fade-in">
      
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4"
        />
      </div>

      {/* Navbar Container */}
      <div className="w-full px-6 md:px-12 lg:px-16 pt-6 z-20">
        <nav className="liquid-glass rounded-xl px-4 py-2 flex items-center justify-between border border-white/10">
          
          {/* Logo */}
          <div className="text-2xl font-semibold tracking-tight text-white select-none">
            {t.logo}
          </div>

          {/* Links (Hidden on mobile) */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            {t.navLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (idx === 0 || idx === 1) {
                    setShowHobbyModal(true);
                  } else if (idx === 2) {
                    setChatInitialTab('ronaldo');
                    setIsChatOpen(true);
                  }
                }}
                className={`text-white hover:text-gray-300 transition-all duration-200 cursor-pointer font-medium ${
                  idx === 2 ? 'bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1 rounded-full border border-amber-500/20 text-amber-300' : ''
                }`}
              >
                {link}
              </button>
            ))}
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={() => setLang(lang === 'en' ? 'mn' : 'en')}
              className="liquid-glass border border-white/20 text-white rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 hover:bg-white/10 transition-colors cursor-pointer"
              title={lang === 'en' ? 'Монгол хэл рүү шилжих' : 'Switch to English'}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'mn' ? 'EN' : 'MN'}</span>
            </button>

            {/* Start a Chat Button */}
            <button
              onClick={() => {
                setChatInitialTab('ronaldo');
                setIsChatOpen(true);
              }}
              className="bg-white text-black hover:bg-gray-100 px-6 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer"
            >
              {t.btnChat}
            </button>
          </div>
        </nav>
      </div>

      {/* Hero Content Container */}
      <div className="flex-1 w-full px-6 md:px-12 lg:px-16 flex flex-col justify-end pb-12 lg:pb-16 z-10">
        <div className="w-full lg:grid lg:grid-cols-2 lg:items-end gap-12">
          
          {/* Left Column: Heading, Subheading, Buttons */}
          <div className="flex flex-col items-start max-w-2xl">
            
            {/* Animated Character-by-Character Heading */}
            <AnimatedHeading
              text={t.heading}
              className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-normal mb-4 text-white leading-tight"
            />

            {/* Fade-In Subheading */}
            <FadeIn delay={800} duration={1000} className="w-full">
              <p className="text-base md:text-lg text-gray-300 mb-5 leading-relaxed max-w-xl">
                {t.subheading}
              </p>
            </FadeIn>

            {/* Fade-In Buttons Row */}
            <FadeIn delay={1200} duration={1000} className="w-full">
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setChatInitialTab('chinzo');
                    setIsChatOpen(true);
                  }}
                  className="bg-white hover:bg-gray-100 text-black px-8 py-3 rounded-lg font-medium transition-colors duration-200 cursor-pointer text-sm md:text-base"
                >
                  {t.btnChat}
                </button>
                <button
                  onClick={() => setShowHobbyModal(true)}
                  className="liquid-glass border border-white/20 hover:bg-white hover:text-black text-white px-8 py-3 rounded-lg font-medium transition-all duration-300 cursor-pointer text-sm md:text-base"
                >
                  {t.btnExplore}
                </button>
              </div>
            </FadeIn>
          </div>

          {/* Right Column: Dynamic Tag Card */}
          <div className="flex items-end justify-start lg:justify-end mt-8 lg:mt-0">
            <FadeIn delay={1400} duration={1000}>
              <button
                onClick={() => setShowHobbyModal(true)}
                className="liquid-glass border border-white/20 px-6 py-3 rounded-xl hover:border-white/40 transition-colors duration-300 text-left cursor-pointer select-none group"
              >
                <div className="flex items-center gap-2 mb-1 opacity-60 group-hover:opacity-100 transition-opacity">
                  <Heart className="w-3.5 h-3.5 text-red-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest">
                    {lang === 'mn' ? 'ХОББИ' : 'PASSION'}
                  </span>
                </div>
                <div className="text-lg md:text-xl lg:text-2xl font-light text-white flex items-center gap-3">
                  <span>{t.tag}</span>
                  <ArrowRight className="w-4 h-4 text-white/50 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            </FadeIn>
          </div>

        </div>
      </div>

      {/* Chat / Message Modal */}
      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        lang={lang}
        initialTab={chatInitialTab}
      />

      {/* Hobby Details Modal */}
      {showHobbyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md" onClick={() => setShowHobbyModal(false)}>
          <div 
            className="liquid-glass border border-white/20 w-full max-w-xl rounded-2xl p-6 md:p-8 space-y-6 shadow-2xl animate-in fade-in zoom-in duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-semibold tracking-widest text-white/50 uppercase block mb-1">
                  {lang === 'mn' ? 'ТАНИЛЦУУЛГА' : 'INTRODUCING'}
                </span>
                <h3 className="text-2xl md:text-3xl font-normal tracking-tight text-white">
                  {lang === 'mn' ? 'Чинзориг' : 'Chinzorig'}
                </h3>
              </div>
              <button
                onClick={() => setShowHobbyModal(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                <XIcon className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-sm md:text-base text-gray-300 leading-relaxed">
              <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0">
                  <span className="text-xl font-bold">10</span>
                </div>
                <div>
                  <h4 className="text-white font-medium text-sm md:text-base">
                    {lang === 'mn' ? 'Миний Нас' : 'My Age'}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-400">
                    {lang === 'mn' ? 'Одоогоор 10 настай бөгөөд эрч хүчээр дүүрэн!' : 'Currently 10 years old and filled with positive energy!'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Trophy className="w-4 h-4 text-amber-400" />
                    <span>{lang === 'mn' ? 'Сагсан бөмбөг' : 'Basketball'}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-400">
                    {lang === 'mn' ? 'Бөмбөг залалт, шидэлт хийх болон найзуудтайгаа багаараа тоглох дуртай.' : 'Loves practicing handles, shooting, and playing competitive team games with friends.'}
                  </p>
                </div>

                <div className="bg-white/5 rounded-xl p-4 border border-white/10 space-y-2">
                  <div className="flex items-center gap-2 text-white font-medium">
                    <Trophy className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'mn' ? 'Хөл бөмбөг' : 'Football / Soccer'}</span>
                  </div>
                  <p className="text-xs md:text-sm text-gray-400">
                    {lang === 'mn' ? 'Хурдтай гүйж, гоол оруулах дуртай. Дуртай спорт минь!' : 'Enjoys sprinting down the wings and scoring goals. A true passion!'}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={() => {
                  setShowHobbyModal(false);
                  setChatInitialTab('chinzo');
                  setIsChatOpen(true);
                }}
                className="text-xs md:text-sm text-white hover:text-gray-300 underline underline-offset-4 cursor-pointer transition-colors"
              >
                {lang === 'mn' ? 'Надтай чатлах уу?' : 'Want to send me a message?'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Messenger-style Quick Chat for Chinzo AI */}
      <FloatingChat lang={lang} />

    </main>
  );
}

// Simple internal helper component
function XIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
    </svg>
  );
}
