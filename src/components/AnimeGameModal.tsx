import { useState, useEffect, useRef, FormEvent } from 'react';
import { X, Trophy, Gamepad2, Sparkles, HelpCircle, ArrowRight, RotateCcw, AlertCircle, RefreshCw, Volume2, VolumeX, CheckCircle, Flame, Star, Lightbulb } from 'lucide-react';
import { Language } from '../types';

interface AnimeGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

interface Question {
  id: number;
  answer: string;
  options: string[];
  emojis: string;
  riddleMn: string;
  riddleEn: string;
  imageUrl: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    answer: "One Piece",
    emojis: "👒 🏴‍☠️ 🍖 ⚓ 🌊",
    options: ["One Piece", "Naruto", "Bleach", "Hunter x Hunter"],
    riddleMn: "Сүрлэн малгайт хүү далайн дээрэмчдийн хаан болохын тулд дэлхийн хамгийн агуу эрдэнэсийн эрэлд гарна. Тэр сунамтгай биетэй бөгөөд Чинзогийн хамгийн дуртай аниме!",
    riddleEn: "A boy with a straw hat sets sail with his crew to find the ultimate treasure and become the Pirate King. He has stretchy rubber powers and is Chinzo's absolute favorite!",
    imageUrl: "https://cdn.myanimelist.net/images/anime/1244/138851.jpg"
  },
  {
    id: 2,
    answer: "Demon Slayer",
    emojis: "⚔️ 👺 ❄️ 🐗 ⚡",
    options: ["Demon Slayer", "Jujutsu Kaisen", "Attack on Titan", "InuYasha"],
    riddleMn: "Гэр бүлийг нь сүйтгэсэн чөтгөрүүдийн эсрэг тэмцэж, хайрт дүүгээ буцаад хүн болгохын тулд усан амьсгал эзэмшсэн хүүгийн тухай аниме.",
    riddleEn: "A kind-hearted boy trains to become a swordsman to avenge his family and turn his sister Nezuko back into a human.",
    imageUrl: "https://cdn.myanimelist.net/images/anime/1908/135431.jpg"
  },
  {
    id: 3,
    answer: "Naruto",
    emojis: "🦊 🍥 🥷 🐸 ⚡",
    options: ["Naruto", "Dragon Ball Z", "My Hero Academia", "Boruto"],
    riddleMn: "Өөрийн тосгоны хамгийн агуу удирдагч (Хокагэ) болохыг мөрөөддөг, биедээ есөн сүүлт үнэгний хүчийг тээсэн шуугиантай нинжа хүү.",
    riddleEn: "An energetic ninja boy who has a powerful nine-tailed fox sealed inside him and dreams of becoming the Hokage (village leader).",
    imageUrl: "https://cdn.myanimelist.net/images/anime/13/17405.jpg"
  },
  {
    id: 4,
    answer: "Attack on Titan",
    emojis: "🧱 🛡️ ⚔️ 🦖 🩸",
    options: ["Attack on Titan", "Tokyo Ghoul", "Fullmetal Alchemist", "Neon Genesis Evangelion"],
    riddleMn: "Хүн төрөлхтөн аварга биетнүүдээс хамгаалж өндөр хананы ард амьдарна. Гол дүр Эрен аварга биет болж хувирах ер бусын чадвартай.",
    riddleEn: "Humanity lives surrounded by enormous walls to protect themselves from man-eating giants known as Titans. The hero can transform into one.",
    imageUrl: "https://cdn.myanimelist.net/images/anime/10/47347.jpg"
  },
  {
    id: 5,
    answer: "Dragon Ball",
    emojis: "🐉 🟠 🦍 ☄️ 👊",
    options: ["Dragon Ball", "Naruto", "One Punch Man", "Yu-Gi-Oh!"],
    riddleMn: "Сүүлтэй хүү дэлхийг аврах хүчирхэг дайчин болж, хүссэн бүхнийг биелүүлэгч долоон шидтэй бөмбөлгийг олохоор аялна.",
    riddleEn: "A monkey-tailed boy trains hard in martial arts and searches for seven magical orbs that summon a wish-granting dragon.",
    imageUrl: "https://cdn.myanimelist.net/images/anime/14/48147.jpg"
  },
  {
    id: 6,
    answer: "My Hero Academia",
    emojis: "🦸‍♂️ 🥦 💥 🏫 🧪",
    options: ["My Hero Academia", "Jujutsu Kaisen", "One Punch Man", "Black Clover"],
    riddleMn: "Ямар ч ер бусын чадваргүй төрсөн хүү дэлхийн хамгийн агуу баатраас хүчийг нь өвлөн авч, баатруудын сургуульд суралцаж буй түүх.",
    riddleEn: "A boy born without powers in a world full of superheroes is chosen by the number one hero All Might to inherit his legendary quirk.",
    imageUrl: "https://cdn.myanimelist.net/images/anime/10/78745.jpg"
  },
  {
    id: 7,
    answer: "Jujutsu Kaisen",
    emojis: "👁️ 🤞 👹 🏫 🐼",
    options: ["Jujutsu Kaisen", "Demon Slayer", "Tokyo Ghoul", "Chainsaw Man"],
    riddleMn: "Найзуудыгаа аврахын тулд хараал идсэн хурууг залгиж, улмаар Хараалын Хааныг өөрийн биедээ тээх болсон ахлах сургуулийн сурагч.",
    riddleEn: "A high school boy swallows a high-grade cursed finger to save his friends and is forced to attend a magical Jujutsu sorcery academy.",
    imageUrl: "https://cdn.myanimelist.net/images/anime/1171/109222.jpg"
  },
  {
    id: 8,
    answer: "Pokémon",
    emojis: "⚡ 🔴 🎒 🦖 🏆",
    options: ["Pokémon", "Digimon", "Yu-Gi-Oh!", "Beyblade"],
    riddleMn: "10 настай хүү өөрийн шар өнгөтэй цахилгаан найзын хамт дэлхийгээр аялж, бүх амьтдыг барьж агуу Мастер болохоор тэмүүлнэ.",
    riddleEn: "A 10-year-old boy set off with his trusty yellow electric mouse to catch and train various elemental creatures and become a champion.",
    imageUrl: "https://cdn.myanimelist.net/images/anime/1517/104278.jpg"
  },
  {
    id: 9,
    answer: "Death Note",
    emojis: "🍎 📓 ✒️ 👁️ 👮‍♂️",
    options: ["Death Note", "Code Geass", "Monster", "Steins;Gate"],
    riddleMn: "Нэрээ бичсэн хүнийг үхэлд хүргэдэг нууц дэвтэр олсон гоц ухаантай залуу дэлхийг гэмт хэрэггүй болгохоор шийднэ.",
    riddleEn: "A brilliant high school student discovers a supernatural notebook that lets him kill anyone just by writing their name inside it.",
    imageUrl: "https://cdn.myanimelist.net/images/anime/9/9453.jpg"
  },
  {
    id: 10,
    answer: "Spirited Away",
    emojis: "🐉 🐷 🏮 🏯 🌊",
    options: ["Spirited Away", "My Neighbor Totoro", "Howl's Moving Castle", "Your Name"],
    riddleMn: "Шидтний манан дунд төөрч, гахай болон хувирсан аав ээжийгээ аврахаар халуун усны газарт ажиллаж буй Чихиро хэмээх бяцхан охин.",
    riddleEn: "A young girl is trapped in a mysterious spirit world where her parents are turned into pigs, and she must work in a magical bathhouse.",
    imageUrl: "https://cdn.myanimelist.net/images/anime/6/79597.jpg"
  }
];

export default function AnimeGameModal({ isOpen, onClose, lang }: AnimeGameModalProps) {
  // Game Play States
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [inputGuess, setInputGuess] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState(false);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isUnblurred, setIsUnblurred] = useState(false); // Tracks if the image blur is lowered for a visual hint
  
  // AI Hint States
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  // Load high score
  useEffect(() => {
    const stored = localStorage.getItem('anime_game_highscore');
    if (stored) {
      setHighScore(parseInt(stored, 10));
    }
  }, []);

  const currentQuestion = QUESTIONS[currentLevelIdx];

  // Shuffle options when current question changes or modal opens
  useEffect(() => {
    if (currentQuestion) {
      const arr = [...currentQuestion.options];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      setShuffledOptions(arr);
    }
  }, [currentLevelIdx, isOpen, currentQuestion]);

  if (!isOpen) return null;

  // Sound Synthesizer via Web Audio API (Fully standalone!)
  const playSound = (type: 'correct' | 'incorrect' | 'win' | 'levelUp') => {
    if (isMuted) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      if (type === 'correct') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.start();
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.stop(ctx.currentTime + 0.25);
      } else if (type === 'incorrect') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(130.81, ctx.currentTime); // C3
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        osc.start();
        osc.frequency.setValueAtTime(110.00, ctx.currentTime + 0.15); // A2
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'win') {
        osc.type = 'sine';
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        osc.start();
        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50];
        notes.forEach((freq, idx) => {
          osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);
        });
        osc.stop(ctx.currentTime + 0.8);
      } else if (type === 'levelUp') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(392.00, ctx.currentTime); // G4
        gain.gain.setValueAtTime(0.1, ctx.currentTime);
        osc.start();
        osc.frequency.exponentialRampToValueAtTime(880.00, ctx.currentTime + 0.2);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch (err) {
      console.error("Audio synth error:", err);
    }
  };

  // Starts the game
  const handleStartGame = () => {
    setGameState('playing');
    setCurrentLevelIdx(0);
    setScore(0);
    setStreak(0);
    setAiHint(null);
    setInputGuess('');
    setSelectedOption(null);
    setIsAnswerRevealed(false);
    setIsUnblurred(false);
    playSound('levelUp');
  };

  // Trigger Gemini dynamic AI hint request
  const fetchAiHint = async () => {
    if (isLoadingHint) return;
    setIsLoadingHint(true);
    setAiHint(null);

    try {
      const response = await fetch('/api/anime-hint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          animeTitle: currentQuestion.answer,
          userLang: lang,
          level: currentLevelIdx + 1
        })
      });

      if (!response.ok) throw new Error("Hint fetch failed");
      const data = await response.json();
      setAiHint(data.hint);
    } catch (error) {
      console.error(error);
      setAiHint(lang === 'mn' 
        ? "Чинзо AI: Энэ анимегийн гол дүр бол Чинзогийн ухааныг уралдуулахуйц үнэхээр сэтгэл хөдөлгөм дүр шүү, зүгээр ээ, тунгаагаад үзээрэй! ❤️" 
        : "Chinzo AI: The hero of this anime is absolutely awesome and a great inspiration. You got this, love you! ❤️"
      );
    } finally {
      setIsLoadingHint(false);
    }
  };

  // Submit Answer
  const handleCheckAnswer = (answerText: string) => {
    if (isAnswerRevealed) return;

    const cleanedAnswer = answerText.trim().toLowerCase();
    const isCorrect = cleanedAnswer === currentQuestion.answer.trim().toLowerCase();

    setIsAnswerCorrect(isCorrect);
    setIsAnswerRevealed(true);

    if (isCorrect) {
      let addedPoints = 100;
      if (difficulty === 'easy') {
        addedPoints = 50;
      } else if (difficulty === 'hard') {
        addedPoints = 200;
      }
      const streakBonus = Math.min(streak * 15, 75);
      const levelPoints = addedPoints + streakBonus;

      setScore((prev) => prev + levelPoints);
      setStreak((prev) => prev + 1);
      playSound('correct');
    } else {
      setStreak(0);
      playSound('incorrect');
    }
  };

  // Proceed to next level or complete
  const handleNextLevel = () => {
    const nextIdx = currentLevelIdx + 1;
    if (nextIdx < QUESTIONS.length) {
      setCurrentLevelIdx(nextIdx);
      setAiHint(null);
      setInputGuess('');
      setSelectedOption(null);
      setIsAnswerRevealed(false);
      setIsUnblurred(false);
      playSound('levelUp');
    } else {
      // Game Over, complete
      setGameState('completed');
      playSound('win');
      if (score > highScore) {
        setHighScore(score);
        localStorage.setItem('anime_game_highscore', score.toString());
      }
    }
  };

  const handleResetHighScore = () => {
    setHighScore(0);
    localStorage.removeItem('anime_game_highscore');
  };

  // Multilingual labels
  const t = {
    title: lang === 'mn' ? '🎮 Аниме Таах Тоглоом' : '🎮 Anime Guessing Game',
    subtitle: lang === 'mn' ? 'Чинзогийн дуртай аниме ертөнцөөр хамтдаа аялцгаая!' : 'Let\'s explore Chinzo\'s favorite anime worlds together!',
    introDesc: lang === 'mn' 
      ? 'Чи аниме маш сайн мэддэг үү? Чинзогийн бэлдсэн 10 аниме сорилтыг даван туулж, өөрийнхөө аниме мэдлэгийг батлаарай. Сэжүүрүүдийг ашиглан нэрсийг таана уу!'
      : 'Do you know your anime? Solve 10 levels of riddles prepared by Chinzorig! Use visual hints, hints and help to achieve the ultimate high score.',
    startBtn: lang === 'mn' ? 'Тоглож Эхлэх' : 'Start Playing',
    legendLabel: lang === 'mn' ? 'Домог горим (Гарнаас бичих - Давхар оноо)' : 'Legend Mode (Type your guess - Double points!)',
    score: lang === 'mn' ? 'Оноо' : 'Score',
    highScore: lang === 'mn' ? 'Хамгийн өндөр' : 'High Score',
    streak: lang === 'mn' ? 'Стрейк (Дараалсан)' : 'Streak',
    level: lang === 'mn' ? 'Асуулт' : 'Question',
    typePlaceholder: lang === 'mn' ? 'Анимегийн нэрийг Англиар бичнэ үү...' : 'Type anime name in English...',
    submitBtn: lang === 'mn' ? 'Шалгах' : 'Verify Answer',
    skipBtn: lang === 'mn' ? 'Алгасах' : 'Skip Question',
    correctMsg: lang === 'mn' ? 'Маш зөв! Чи яг оллоо! 🎉' : 'Awesome! You nailed it! 🎉',
    wrongMsg: lang === 'mn' ? 'Уучлаарай, буруу байна! Гэхдээ зүгээр ээ! ❤️' : 'Oops, incorrect! But it\'s okay! ❤️',
    correctAnswerWas: lang === 'mn' ? 'Зөв хариулт:' : 'Correct Answer:',
    nextBtn: lang === 'mn' ? 'Дараах Асуулт' : 'Next Question',
    congrats: lang === 'mn' ? 'Баяр хүргэе! Чи амжилттай дуусгалаа! 🏆' : 'Congratulations! Game Complete! 🏆',
    congratsSub: lang === 'mn' ? 'Чи жинхэнэ анимегийн мэргэжилтэн юмаа. Чинзориг чамаар маш их бахархаж байна!' : 'You are a certified anime guru. Chinzorig is extremely proud of your skills!',
    playAgain: lang === 'mn' ? 'Дахин Тоглох' : 'Play Again',
    getHintBtn: lang === 'mn' ? 'Чинзо AI-аас тусламж авах 💡' : 'Ask Chinzo AI for Clue 💡',
    loadingHint: lang === 'mn' ? 'Ухаанаа уралдуулан бодож байна...' : 'Using 100% of my brain...',
    hintTitle: lang === 'mn' ? 'Чинзогийн AI сэжүүр:' : 'Chinzo\'s AI Hint:',
    emojisTitle: lang === 'mn' ? 'Холбоотой дүр, сэжүүрүүд:' : 'Themed Clues & Emojis:',
    viewImageClue: lang === 'mn' ? '🖼️ Зургийн сэжүүр харах' : '🖼️ Reveal Image Clue',
    hideImageClue: lang === 'mn' ? '🙈 Зургийг нуух' : '🙈 Hide Image Clue'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 bg-black/90 backdrop-blur-md">
      <div 
        className="liquid-glass border border-white/20 w-full max-w-2xl rounded-2xl flex flex-col h-[85vh] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
              <Gamepad2 className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-semibold tracking-tight text-white">{t.title}</h2>
              <p className="text-xs text-gray-400">{t.subtitle}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Mute toggle button */}
            <button 
              onClick={() => setIsMuted(!isMuted)} 
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
              title={isMuted ? "Unmute sounds" : "Mute sounds"}
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 flex flex-col justify-between custom-scrollbar bg-black/20">
          
          {/* INTRO SCREEN */}
          {gameState === 'intro' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 max-w-md mx-auto my-auto py-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border-2 border-indigo-500/30 flex items-center justify-center text-5xl animate-pulse shadow-lg">
                  👒
                </div>
                <div className="absolute -bottom-2 -right-2 bg-indigo-500 text-black w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-mono">
                  10
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  {lang === 'mn' ? 'Мэдлэгээ шалгах бэлэн үү?' : 'Ready to test your knowledge?'}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {t.introDesc}
                </p>
              </div>

              {/* Select Difficulty Level Grid */}
              <div className="w-full space-y-2">
                <div className="text-left text-xs uppercase tracking-wider text-gray-400 font-semibold font-mono px-1">
                  {lang === 'mn' ? 'Тоглоомын түвшин сонгох:' : 'Select Difficulty Level:'}
                </div>
                <div className="grid grid-cols-3 gap-2.5">
                  {/* Easy */}
                  <button
                    onClick={() => setDifficulty('easy')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      difficulty === 'easy'
                        ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 shadow-lg shadow-emerald-500/5 scale-[1.03]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg">🟢</span>
                    <span className="text-xs font-bold">{lang === 'mn' ? 'Амархан' : 'Easy'}</span>
                    <span className="text-[9px] opacity-75 font-mono">50 pts</span>
                  </button>

                  {/* Medium */}
                  <button
                    onClick={() => setDifficulty('medium')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      difficulty === 'medium'
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/5 scale-[1.03]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg">⚡</span>
                    <span className="text-xs font-bold">{lang === 'mn' ? 'Дундаж' : 'Medium'}</span>
                    <span className="text-[9px] opacity-75 font-mono">100 pts</span>
                  </button>

                  {/* Hard */}
                  <button
                    onClick={() => setDifficulty('hard')}
                    className={`p-3.5 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                      difficulty === 'hard'
                        ? 'bg-red-500/15 border-red-500/50 text-red-300 shadow-lg shadow-red-500/5 scale-[1.03]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg">🔥</span>
                    <span className="text-xs font-bold">{lang === 'mn' ? 'Хэцүү' : 'Hard'}</span>
                    <span className="text-[9px] opacity-75 font-mono">200 pts</span>
                  </button>
                </div>
              </div>

              <button 
                onClick={handleStartGame}
                className="w-full bg-white hover:bg-gray-100 text-black py-3.5 px-6 rounded-xl font-semibold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-white/10"
              >
                <span>{t.startBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex gap-6 pt-4 text-xs font-mono text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500" />
                  <span>{t.highScore}: {highScore}</span>
                </div>
                {highScore > 0 && (
                  <button 
                    onClick={handleResetHighScore}
                    className="text-red-500/70 hover:text-red-400 underline cursor-pointer"
                  >
                    {lang === 'mn' ? 'Оноо шинэчлэх' : 'Reset score'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* PLAYING SCREEN */}
          {gameState === 'playing' && currentQuestion && (
            <div className="flex-1 flex flex-col justify-between space-y-6">
              
              {/* Score HUD & Progress */}
              <div className="flex items-center justify-between gap-4 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs md:text-sm font-mono tracking-tight shrink-0">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{t.level}:</span>
                  <span className="text-indigo-400 font-bold">{currentLevelIdx + 1} / {QUESTIONS.length}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500/20" />
                    <span>{score}</span>
                  </div>
                  {streak > 0 && (
                    <div className="flex items-center gap-1 text-orange-400 font-black animate-pulse">
                      <Flame className="w-4 h-4 fill-orange-500/20" />
                      <span>{streak}x</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Level Progress Bar */}
              <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden shrink-0">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
                  style={{ width: `${((currentLevelIdx) / QUESTIONS.length) * 100}%` }}
                />
              </div>

              {/* Question Riddle Card */}
              <div className="flex-1 flex flex-col justify-center space-y-4 py-2">
                <div className="text-center space-y-2">
                  <div className="text-xs uppercase tracking-widest text-indigo-400 font-semibold">{lang === 'mn' ? 'ОНЬСОГО / РИДДЛ' : 'THE RIDDLE'}</div>
                  <h3 className="text-sm md:text-base leading-relaxed text-gray-100 font-normal max-w-xl mx-auto italic">
                    " {lang === 'mn' ? currentQuestion.riddleMn : currentQuestion.riddleEn} "
                  </h3>
                </div>

                {/* Anime Image Frame */}
                <div className="relative w-36 h-48 mx-auto rounded-xl overflow-hidden shadow-2xl border border-white/20 bg-black/40 group shrink-0">
                  <img
                    src={currentQuestion.imageUrl}
                    alt="Mystery Anime Poster"
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover select-none transition-all duration-700 ease-out ${
                      isAnswerRevealed || difficulty === 'easy'
                        ? 'blur-0 scale-100 brightness-110' 
                        : isUnblurred 
                          ? 'blur-[4px] scale-105 brightness-95' 
                          : difficulty === 'hard'
                            ? 'blur-[32px] scale-110 brightness-65 saturate-[1.1]'
                            : 'blur-[22px] scale-110 brightness-75 saturate-[1.2]'
                    }`}
                  />
                  
                  {/* Subtle Scanlines overlay for mystery effect */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />
                  
                  {/* Overlay text / lock when fully blurred */}
                  {!isAnswerRevealed && !isUnblurred && difficulty !== 'easy' && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center bg-black/10 backdrop-blur-sm group-hover:bg-black/20 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20 text-white/80 shadow-lg group-hover:scale-110 transition-transform">
                        <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '6s' }} />
                      </div>
                      <span className="text-[9px] text-gray-300 font-mono font-medium tracking-wider mt-2 bg-black/40 px-2 py-0.5 rounded border border-white/5 uppercase">
                        {lang === 'mn' ? 'Нууц' : 'Mystery'}
                      </span>
                    </div>
                  )}

                  {/* Fully Revealed label */}
                  {isAnswerRevealed && (
                    <div className="absolute bottom-1.5 left-1.5 right-1.5 bg-black/85 backdrop-blur-md px-1.5 py-0.5 rounded border border-emerald-500/30 text-center animate-in fade-in slide-in-from-bottom-2 duration-300">
                      <p className="text-[9px] text-emerald-400 font-bold tracking-wider font-mono truncate uppercase">
                        {currentQuestion.answer}
                      </p>
                    </div>
                  )}
                </div>

                {/* Image Clue Toggle Control */}
                {!isAnswerRevealed && difficulty === 'medium' && (
                  <div className="flex justify-center shrink-0">
                    <button
                      onClick={() => setIsUnblurred(!isUnblurred)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold font-mono transition-all border cursor-pointer ${
                        isUnblurred 
                          ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white'
                      }`}
                    >
                      {isUnblurred ? t.hideImageClue : t.viewImageClue}
                    </button>
                  </div>
                )}

                {/* Emojis Theme Frame */}
                <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center space-y-1 max-w-md mx-auto w-full">
                  <div className="text-[10px] text-gray-500 uppercase tracking-widest font-mono">{t.emojisTitle}</div>
                  <div className="text-2xl tracking-widest select-none animate-bounce" style={{ animationDuration: '3s' }}>
                    {currentQuestion.emojis}
                  </div>
                </div>

                {/* Dynamic AI Hint Section */}
                <div className="max-w-md mx-auto w-full space-y-2.5">
                  {aiHint ? (
                    <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                      <div className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 font-mono">
                        <Lightbulb className="w-3.5 h-3.5 fill-indigo-400/20" />
                        <span>{t.hintTitle}</span>
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed italic">{aiHint}</p>
                    </div>
                  ) : (
                    <button
                      onClick={fetchAiHint}
                      disabled={isLoadingHint || isAnswerRevealed}
                      className="w-full py-2 px-4 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-40 cursor-pointer"
                    >
                      {isLoadingHint ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>{t.loadingHint}</span>
                        </>
                      ) : (
                        <>
                          <HelpCircle className="w-3.5 h-3.5" />
                          <span>{t.getHintBtn}</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* ANSWER CONROLS / INPUTS */}
              <div className="space-y-4 shrink-0">
                {isAnswerRevealed ? (
                  /* Result / Reveal View */
                  <div className="space-y-4">
                    <div className={`p-4 rounded-xl border text-center space-y-1.5 animate-in zoom-in-95 duration-200 ${
                      isAnswerCorrect 
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                        : 'bg-red-500/10 border-red-500/30 text-red-300'
                    }`}>
                      <div className="font-semibold text-sm md:text-base flex items-center justify-center gap-2">
                        {isAnswerCorrect ? '✓' : '✗'} {isAnswerCorrect ? t.correctMsg : t.wrongMsg}
                      </div>
                      {!isAnswerCorrect && (
                        <div className="text-xs text-gray-400">
                          {t.correctAnswerWas} <span className="text-white font-bold font-mono">{currentQuestion.answer}</span>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={handleNextLevel}
                      className="w-full bg-white hover:bg-gray-100 text-black py-3.5 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg"
                    >
                      <span>{t.nextBtn}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Guess Input / Options View */
                  <div className="space-y-3">
                    {difficulty === 'hard' ? (
                      /* HARD MODE: Typing Guess */
                      <form 
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (inputGuess.trim()) handleCheckAnswer(inputGuess);
                        }}
                        className="flex gap-2"
                      >
                        <input
                          type="text"
                          required
                          value={inputGuess}
                          onChange={(e) => setInputGuess(e.target.value)}
                          placeholder={t.typePlaceholder}
                          className="flex-1 bg-white/5 border border-white/15 focus:border-white/40 focus:outline-none rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 transition-colors font-mono"
                        />
                        <button
                          type="submit"
                          className="bg-white hover:bg-gray-100 text-black px-6 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shrink-0"
                        >
                          <span>{t.submitBtn}</span>
                        </button>
                      </form>
                    ) : (
                      /* EASY & MEDIUM MODE: Multiple Choice */
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(shuffledOptions.length > 0 ? shuffledOptions : currentQuestion.options).map((opt, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleCheckAnswer(opt)}
                            className="bg-white/5 border border-white/10 hover:border-white/30 hover:bg-white/10 text-white font-mono text-xs md:text-sm py-3 px-4 rounded-xl text-left transition-all flex items-center justify-between cursor-pointer group"
                          >
                            <span>{idx + 1}. {opt}</span>
                            <span className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center text-[10px] text-gray-500 group-hover:border-white/50 group-hover:text-white transition-colors">
                              {idx + 1}
                            </span>
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between items-center text-xs text-gray-500 pt-1">
                      <span className="font-mono">
                        {difficulty === 'easy' && `🟢 ${lang === 'mn' ? 'Амархан' : 'Easy'} (+50 pts)`}
                        {difficulty === 'medium' && `⚡ ${lang === 'mn' ? 'Дундаж' : 'Medium'} (+100 pts)`}
                        {difficulty === 'hard' && `🔥 ${lang === 'mn' ? 'Хэцүү (Бичих)' : 'Hard (Type)'} (+200 pts)`}
                      </span>
                      <button 
                        onClick={() => handleCheckAnswer("")}
                        className="hover:text-gray-300 underline cursor-pointer"
                      >
                        {t.skipBtn}
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          )}

          {/* COMPLETED SCREEN */}
          {gameState === 'completed' && (
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-6 max-w-md mx-auto my-auto py-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-5xl animate-bounce shadow-lg">
                  🏆
                </div>
                <div className="absolute -top-1 -right-1 bg-indigo-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                  ★
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl md:text-2xl font-bold text-white tracking-tight">
                  {t.congrats}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {t.congratsSub}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 w-full space-y-4 font-mono">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{lang === 'mn' ? 'Чиний оноо:' : 'Your Score:'}</span>
                  <span className="text-amber-400 text-xl font-bold">{score} pts</span>
                </div>
                <div className="w-full h-[1px] bg-white/10" />
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">{lang === 'mn' ? 'Хамгийн дээд оноо:' : 'Best High Score:'}</span>
                  <span className="text-white text-base font-bold">{highScore} pts</span>
                </div>
              </div>

              <button 
                onClick={handleStartGame}
                className="w-full bg-white hover:bg-gray-100 text-black py-3.5 px-6 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-white/10"
              >
                <RotateCcw className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                <span>{t.playAgain}</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
