import { useState, useEffect, useRef, FormEvent } from 'react';
import { X, Trophy, Gamepad2, Sparkles, HelpCircle, ArrowRight, RotateCcw, AlertCircle, RefreshCw, Volume2, VolumeX, CheckCircle, Flame, Star, Lightbulb } from 'lucide-react';
import { Language } from '../types';
import heroQuestions from '../data.json';

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
    answer: "Luffy",
    emojis: "👒 🏴‍☠️ 🍖 ⚓ 🌊",
    options: ["Luffy", "Zoro", "Sanji", "Shanks"],
    riddleMn: "Сүрлэн малгайт далайн дээрэмчдийн ахмад. Сунамтгай биетэй бөгөөд Чинзогийн хамгийн дуртай, Мах (мах!) идэх дуртай гол дүр!",
    riddleEn: "The captain of the Straw Hat Pirates with stretchy rubber body. He is Chinzo's absolute favorite who loves eating meat!",
    imageUrl: "https://cdn.myanimelist.net/images/characters/9/310307.jpg"
  },
  {
    id: 2,
    answer: "Tanjiro",
    emojis: "⚔️ 👺 🌊 👘 🎋",
    options: ["Tanjiro", "Zenitsu", "Inosuke", "Giyu"],
    riddleMn: "Нүүрс зардаг эгэл хүү байсан ч гэр бүлийнхээ өшөөг авч, чөтгөр болсон дүү Незүкогоо аврахын тулд Чөтгөр Түүнч болсон баатар.",
    riddleEn: "A kind charcoal seller who joined the Demon Slayer Corps to find a cure for his sister Nezuko and avenge his family.",
    imageUrl: "https://static.wikia.nocookie.net/kimetsu-no-yaiba/images/0/05/Tanjiro_anime_right_face.png/revision/latest?cb=20241228000706"
  },
  {
    id: 3,
    answer: "Naruto",
    emojis: "🦊 🍥 🥷 🐸 ⚡",
    options: ["Naruto", "Sasuke", "Kakashi", "Gaara"],
    riddleMn: "Навчин тосгоны Хокагэ болох мөрөөдөлтэй нинжа хүү. Дотор нь есөн сүүлт үнэг (Кюүби) түгжигдсэн байдаг.",
    riddleEn: "A noisy ninja boy from Konoha who wants to become the Hokage. He hosts the powerful Nine-Tailed Fox inside him.",
    imageUrl: "https://easydrawingguides.com/wp-content/uploads/2017/05/how-to-draw-naruto-featured-image-1200.png"
  },
  {
    id: 4,
    answer: "Levi",
    emojis: "⚔️ 🧼 🐎 ☕ 🧣",
    options: ["Levi", "Eren", "Armin", "Erwin"],
    riddleMn: "Хүн төрэлхтний хамгийн хүчирхэг цэрэг. Цэвэрч байдалд маш дуртай бөгөөд аваргуудыг эргэлдэн хэрчиж устгадаг!",
    riddleEn: "Humanity's strongest soldier who is obsessed with cleanliness and spins through the air to slice Titans.",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScXqe9Gwtg5nNi6WykJ7fbjYEDzC2HOBp6Gh838SB07UiJgUFRVWPPziAv2Ma0CWMv4re295QKuzuJn0remHAMrs9XV8ZJenop3p9Zoso&s=10"
  },
  {
    id: 5,
    answer: "Goku",
    emojis: "🥋 🟠 ☄️ 👊 🦍",
    options: ["Goku", "Vegeta", "Gohan", "Freesa"],
    riddleMn: "Дэлхийг олон удаа аварсан Саяан үндэстэн дайчин. Түүний алдартай дайралт бол Камехамеха!",
    riddleEn: "A powerful Saiyan warrior raised on Earth. His signature move is the Kamehameha and he loves training!",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEJ2-XKozSRr6hd_76x1IXuKVmawLYpDyf1KodmHUMoGOEXbhdMsPiF4CuNu9k46aC36UlFJeTUPazc1ht-1p5IKdZcUVpdLl0fNZwgqo&s=10"
  },
  {
    id: 6,
    answer: "Zoro",
    emojis: "⚔️ 🟢 🗺️ 🍺 ⚔️",
    options: ["Zoro", "Luffy", "Mihawk", "Sanji"],
    riddleMn: "Гурван сэлэмт баатар дайчин. Дэлхийн хамгийн шилдэг сэлэмчин болохыг зорьдог бөгөөд байнга замаа алдаж төөрчихдөг!",
    riddleEn: "A master swordsman who uses Three-Sword Style. He aims to be the strongest swordsman but has a terrible sense of direction!",
    imageUrl: "https://static.wikitide.net/deathbattlewiki/6/63/Portrait.roronoazoro.png"
  },
  {
    id: 7,
    answer: "Gojo",
    emojis: "👁️ 🕶️ 🤞 🔴 🔵",
    options: ["Gojo", "Itadori", "Megumi", "Sukuna"],
    riddleMn: "Үргэлж нүдээ боосон байдаг, хамгийн хүчирхэг шидтэн. Түүний цэнхэр нүд ба Хязгааргүй орон зайн хүч хэнийг ч дийлнэ!",
    riddleEn: "The strongest Jujutsu Sorcerer who usually wears a blindfold. His beautiful Six Eyes and Limitless technique are legendary.",
    imageUrl: "https://miro.medium.com/v2/1*rKl56ixsC55cMAsO2aQhGQ@2x.jpeg"
  },
  {
    id: 8,
    answer: "Pikachu",
    emojis: "⚡ 🔴 🎒 🦖 🏆",
    options: ["Pikachu", "Charizard", "Eevee", "Mewtwo"],
    riddleMn: "Шар өнгийн цахилгаан харх бөгөөд Сатоши (Ash)-гийн хамгийн итгэлт анд. Чинзогийн утасны дэлгэц дээр ч байдаг өхөөрдөм амьтан!",
    riddleEn: "The iconic yellow electric mouse and Ash's best friend. He is cute, powerful, and loves ketchup!",
    imageUrl: "https://img.pokemondb.net/sprites/scarlet-violet/normal/pikachu.png"
  },
  {
    id: 9,
    answer: "L",
    emojis: "📓 🧠 🍭 ☕ 💻",
    options: ["L", "Light", "Ryuk", "Near"],
    riddleMn: "Чихэрлэг зүйлд маш дуртай, сонин байрлалаар суудаг дэлхийн шилдэг нууц мөрдөгч. Тэр Кираг илрүүлэхээр тэмцдэг.",
    riddleEn: "A world-renowned detective who loves sweets, sits in a strange crouched posture, and investigates Kira.",
    imageUrl: "https://static.wikia.nocookie.net/inconsistently-admirable/images/5/5d/L_Lawliet.webp/revision/latest?cb=20220309174034"
  },
  {
    id: 10,
    answer: "Saitama",
    emojis: "🦲 🥊 🥋 ⚡ 👊",
    options: ["Saitama", "Genos", "Garou", "Sonic"],
    riddleMn: "Ямар ч хүчирхэг дайсныг ганцхан цохилтоор л унагадаг, халзан толгойтой баатар. Тэрээр хэт хүчтэй болсондоо уйддаг.",
    riddleEn: "A bald hero who can defeat any opponent with just a single punch. He is too strong and always bored!",
    imageUrl:"https://static.wikia.nocookie.net/inconsistently-admirable/images/5/5d/L_Lawliet.webp/revision/latest?cb=20220309174034"
  }
];

export default function AnimeGameModal({ isOpen, onClose, lang }: AnimeGameModalProps) {
  // Game Play States
  const [gameState, setGameState] = useState<'intro' | 'playing' | 'completed'>('intro');
  const [gameMode, setGameMode] = useState<'classic' | 'hero'>('classic');
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
  
  // Leaderboard and Answers Tracking States
  const [playerName, setPlayerName] = useState(() => {
    return localStorage.getItem('anime_game_last_player_name') || '';
  });
  const [gameAnswers, setGameAnswers] = useState<Array<{
    questionNum: number;
    answer: string;
    guess: string;
    correct: boolean;
  }>>([]);
  const [scoresList, setScoresList] = useState<Array<{
    id: string;
    playerName: string;
    score: number;
    mode: string;
    difficulty: string;
    answers: Array<{
      questionNum: number;
      answer: string;
      guess: string;
      correct: boolean;
    }>;
    timestamp: string;
  }>>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [selectedLeaderboardRecord, setSelectedLeaderboardRecord] = useState<any | null>(null);

  // AI Hint States
  const [aiHint, setAiHint] = useState<string | null>(null);
  const [isLoadingHint, setIsLoadingHint] = useState(false);
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);

  const activeQuestions = gameMode === 'classic' ? QUESTIONS : heroQuestions;

  // Load leaderboard function
  const loadLeaderboard = () => {
    try {
      const stored = localStorage.getItem('anime_game_scores_collection');
      if (stored) {
        const parsed = JSON.parse(stored);
        parsed.sort((a: any, b: any) => b.score - a.score);
        setScoresList(parsed);
      } else {
        setScoresList([]);
      }
    } catch (e) {
      console.error("Leaderboard load error:", e);
    }
  };

  // Load high score & leaderboard on mount / open
  useEffect(() => {
    const key = gameMode === 'classic' ? 'anime_game_highscore' : 'anime_game_hero_highscore';
    const stored = localStorage.getItem(key);
    if (stored) {
      setHighScore(parseInt(stored, 10));
    } else {
      setHighScore(0);
    }
    if (isOpen) {
      loadLeaderboard();
    }
  }, [gameMode, isOpen]);

  const currentQuestion = activeQuestions[currentLevelIdx];

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
    setGameAnswers([]);
    setScoreSaved(false);
    setShowLeaderboard(false);
    setSelectedLeaderboardRecord(null);
    playSound('levelUp');
  };

  // Submit Score to local Firestore-mock collection
  const handleSaveScore = (e: FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    const newRecord = {
      id: Math.random().toString(36).substring(2, 11),
      playerName: playerName.trim(),
      score: score,
      mode: gameMode,
      difficulty: difficulty,
      answers: gameAnswers,
      timestamp: new Date().toISOString()
    };

    try {
      const stored = localStorage.getItem('anime_game_scores_collection');
      const parsed = stored ? JSON.parse(stored) : [];
      parsed.push(newRecord);
      localStorage.setItem('anime_game_scores_collection', JSON.stringify(parsed));
      localStorage.setItem('anime_game_last_player_name', playerName.trim());
      
      setScoreSaved(true);
      loadLeaderboard();
      setShowLeaderboard(true);
    } catch (err) {
      console.error("Failed to save score:", err);
    }
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

    // Save answer record
    setGameAnswers((prev) => [
      ...prev,
      {
        questionNum: currentLevelIdx + 1,
        answer: currentQuestion.answer,
        guess: answerText || (lang === 'mn' ? 'Алгассан' : 'Skipped'),
        correct: isCorrect
      }
    ]);

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
    if (nextIdx < activeQuestions.length) {
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
        const key = gameMode === 'classic' ? 'anime_game_highscore' : 'anime_game_hero_highscore';
        localStorage.setItem(key, score.toString());
      }
    }
  };

  const handleResetHighScore = () => {
    setHighScore(0);
    const key = gameMode === 'classic' ? 'anime_game_highscore' : 'anime_game_hero_highscore';
    localStorage.removeItem(key);
  };

  // Multilingual labels
  const t = {
    title: lang === 'mn' ? '🎮 Аниме Дүр Таах Тоглоом' : '🎮 Anime Character Guessing Game',
    subtitle: lang === 'mn' ? 'Чинзогийн дуртай аниме дүрүүдийг хамтдаа таацгаая!' : 'Let\'s guess Chinzo\'s favorite anime characters together!',
    introDesc: lang === 'mn' 
      ? 'Чи аниме дүрүүдийг маш сайн мэддэг үү? Чинзогийн бэлдсэн 10 аниме дүрийн сорилтыг даван туулж, өөрийнхөө мэдлэгийг батлаарай. Сэжүүрүүдийг ашиглан дүрийг таана уу!'
      : 'Do you know your anime characters? Solve 10 levels of riddles prepared by Chinzorig! Use visual hints, hints and help to achieve the ultimate high score.',
    startBtn: lang === 'mn' ? 'Тоглож Эхлэх' : 'Start Playing',
    legendLabel: lang === 'mn' ? 'Домог горим (Гарнаас бичих - Давхар оноо)' : 'Legend Mode (Type your guess - Double points!)',
    score: lang === 'mn' ? 'Оноо' : 'Score',
    highScore: lang === 'mn' ? 'Хамгийн өндөр' : 'High Score',
    streak: lang === 'mn' ? 'Стрейк (Дараалсан)' : 'Streak',
    level: lang === 'mn' ? 'Асуулт' : 'Question',
    typePlaceholder: lang === 'mn' ? 'Дүрийн нэрийг Англиар бичнэ үү...' : 'Type character name in English...',
    submitBtn: lang === 'mn' ? 'Шалгах' : 'Verify Answer',
    skipBtn: lang === 'mn' ? 'Алгасах' : 'Skip Question',
    correctMsg: lang === 'mn' ? 'Маш зөв! Чи яг оллоо! 🎉' : 'Awesome! You nailed it! 🎉',
    wrongMsg: lang === 'mn' ? 'Уучлаарай, буруу байна! Гэхдээ зүгээр ээ! ❤️' : 'Oops, incorrect! But it\'s okay! ❤️',
    correctAnswerWas: lang === 'mn' ? 'Зөв хариулт:' : 'Correct Answer:',
    nextBtn: lang === 'mn' ? 'Дараах Асуулт' : 'Next Question',
    congrats: lang === 'mn' ? 'Баяр хүргэе! Чи амжилттай дуусгалаа! 🏆' : 'Congratulations! Game Complete! 🏆',
    congratsSub: lang === 'mn' ? 'Чи жинхэнэ аниме дүрүүдийн мэргэжилтэн юмаа. Чинзориг чамаар маш их бахархаж байна!' : 'You are a certified anime character guru. Chinzorig is extremely proud of your skills!',
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
          
          {showLeaderboard ? (
            /* LEADERBOARD / ОНООНЫ САМБАР */
            <div className="flex-1 flex flex-col space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between shrink-0">
                <h3 className="text-base md:text-lg font-bold text-amber-400 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500 fill-amber-500/15" />
                  <span>{lang === 'mn' ? 'Шилдэг тоглогчид (Firestore)' : 'Top Scores (Firestore Database)'}</span>
                </h3>
                <button
                  onClick={() => {
                    setShowLeaderboard(false);
                    setSelectedLeaderboardRecord(null);
                  }}
                  className="px-3 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-mono font-bold text-gray-300 hover:text-white transition-all cursor-pointer border border-white/10"
                >
                  {lang === 'mn' ? '← Буцах' : '← Back'}
                </button>
              </div>

              {selectedLeaderboardRecord ? (
                /* DETAILED QUESTION-BY-QUESTION ANSWERS DIALOG */
                <div className="space-y-4 bg-white/5 border border-white/15 rounded-2xl p-5 animate-in zoom-in-95 duration-200">
                  <div className="flex justify-between items-center pb-3 border-b border-white/10">
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        👤 {selectedLeaderboardRecord.playerName}
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono">
                        {lang === 'mn' ? 'Асуултуудын дэлгэрэнгүй хариулт' : 'Detailed Question History'}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedLeaderboardRecord(null)}
                      className="text-xs text-indigo-400 hover:text-indigo-300 underline font-mono font-bold"
                    >
                      {lang === 'mn' ? '← Жагсаалт руу буцах' : '← Back to List'}
                    </button>
                  </div>

                  <div className="space-y-2.5 max-h-[45vh] overflow-y-auto pr-1 custom-scrollbar">
                    {selectedLeaderboardRecord.answers && selectedLeaderboardRecord.answers.length > 0 ? (
                      selectedLeaderboardRecord.answers.map((ans: any, i: number) => (
                        <div key={i} className={`p-3 rounded-xl border text-xs space-y-1 ${
                          ans.correct 
                            ? 'bg-emerald-500/5 border-emerald-500/20' 
                            : 'bg-red-500/5 border-red-500/20'
                        }`}>
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-gray-300">#{ans.questionNum} {lang === 'mn' ? 'Асуулт' : 'Question'}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                              ans.correct ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
                            }`}>
                              {ans.correct ? (lang === 'mn' ? 'Зөв' : 'Correct') : (lang === 'mn' ? 'Буруу' : 'Incorrect')}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div>
                              <span className="text-gray-500">{lang === 'mn' ? 'Зөв дүр:' : 'Correct Hero:'}</span>{' '}
                              <span className="text-white font-bold">{ans.answer}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">{lang === 'mn' ? 'Таасан:' : 'Your Guess:'}</span>{' '}
                              <span className={ans.correct ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
                                {ans.guess}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-xs text-gray-500 py-4 font-mono">
                        {lang === 'mn' ? 'Дэлгэрэнгүй хариултын түүх алга байна.' : 'No answer history recorded for this score.'}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* HIGH SCORES LIST TABLE */
                <div className="flex-1 flex flex-col min-h-0 bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                  <div className="overflow-y-auto flex-1 custom-scrollbar max-h-[50vh]">
                    {scoresList.length > 0 ? (
                      <table className="w-full text-left border-collapse font-mono text-xs md:text-sm">
                        <thead>
                          <tr className="bg-white/5 border-b border-white/10 text-gray-400 text-[10px] md:text-xs uppercase tracking-wider">
                            <th className="py-3 px-4 text-center w-12">#</th>
                            <th className="py-3 px-3">{lang === 'mn' ? 'Тоглогч' : 'Player'}</th>
                            <th className="py-3 px-3 text-center">{lang === 'mn' ? 'Горим' : 'Mode'}</th>
                            <th className="py-3 px-3 text-right">{lang === 'mn' ? 'Оноо' : 'Score'}</th>
                            <th className="py-3 px-4 text-center w-24">{lang === 'mn' ? 'Хариултууд' : 'Answers'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-gray-300">
                          {scoresList.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-white/5 transition-colors">
                              <td className="py-3 px-2 text-center font-bold">
                                {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : idx + 1}
                              </td>
                              <td className="py-3 px-3 font-semibold text-white truncate max-w-[120px]" title={item.playerName}>
                                {item.playerName}
                              </td>
                              <td className="py-3 px-3 text-center text-[10px]">
                                <span className={`px-2 py-0.5 rounded-full font-bold ${
                                  item.mode === 'hero' 
                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                                }`}>
                                  {item.mode === 'hero' ? (lang === 'mn' ? 'Баатрууд' : 'Heroes') : (lang === 'mn' ? 'Сонгодог' : 'Classic')}
                                </span>
                              </td>
                              <td className="py-3 px-3 text-right text-amber-400 font-bold">
                                {item.score} pts
                              </td>
                              <td className="py-3 px-4 text-center">
                                <button
                                  onClick={() => setSelectedLeaderboardRecord(item)}
                                  className="text-[10px] md:text-xs px-2 py-1 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 hover:border-indigo-500/40 cursor-pointer font-sans transition-all"
                                >
                                  {lang === 'mn' ? 'Харах' : 'View'}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center text-gray-500 space-y-3">
                        <Trophy className="w-12 h-12 stroke-[1.5] text-white/10 animate-pulse" />
                        <div>
                          <p className="text-sm font-bold text-gray-400">{lang === 'mn' ? 'Одоогоор онооны түүх алга' : 'No recorded high scores yet'}</p>
                          <p className="text-xs text-gray-600 mt-1">{lang === 'mn' ? 'Эхний тоглоомоо дуусгаад оноогоо хадгалаарай!' : 'Finish a game and save your score to start!'}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* GAMEPLAY & OTHER SCREENS */
            <div className="flex-1 flex flex-col justify-between">
              
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

              {/* Select Game Mode Grid */}
              <div className="w-full space-y-2">
                <div className="text-left text-xs uppercase tracking-wider text-gray-400 font-semibold font-mono px-1">
                  {lang === 'mn' ? 'Тоглоомын горим сонгох:' : 'Select Game Mode:'}
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  {/* Classic Mode */}
                  <button
                    onClick={() => setGameMode('classic')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center ${
                      gameMode === 'classic'
                        ? 'bg-indigo-500/15 border-indigo-500/50 text-indigo-300 shadow-lg shadow-indigo-500/5 scale-[1.03]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg">🔮</span>
                    <div>
                      <span className="text-xs font-bold block">{lang === 'mn' ? 'Аниме дүр таах' : 'Anime Characters'}</span>
                      <span className="text-[9px] opacity-75 block mt-0.5">{lang === 'mn' ? 'Сонгодог горим' : 'Classic Mode'}</span>
                    </div>
                  </button>

                  {/* Hero Mode */}
                  <button
                    onClick={() => setGameMode('hero')}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer text-center ${
                      gameMode === 'hero'
                        ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 shadow-lg shadow-amber-500/5 scale-[1.03]'
                        : 'bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <span className="text-lg">👑</span>
                    <div>
                      <span className="text-xs font-bold block">{lang === 'mn' ? 'Баатрын дүр таах' : 'Hero Characters'}</span>
                      <span className="text-[9px] opacity-75 block mt-0.5">{lang === 'mn' ? 'Luffy, Naruto, Goku...' : 'Main Protagonists'}</span>
                    </div>
                  </button>
                </div>
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

              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 pt-4 text-xs font-mono text-gray-500">
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
                <button
                  onClick={() => {
                    loadLeaderboard();
                    setShowLeaderboard(true);
                  }}
                  className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer flex items-center gap-1 font-bold"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>{lang === 'mn' ? '🏆 Шилдэг оноонууд' : '🏆 Leaderboard'}</span>
                </button>
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
                  <span className="text-indigo-400 font-bold">{currentLevelIdx + 1} / {activeQuestions.length}</span>
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
                  style={{ width: `${((currentLevelIdx) / activeQuestions.length) * 100}%` }}
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
            <div className="flex-1 flex flex-col justify-center items-center text-center space-y-5 max-w-md mx-auto my-auto py-4">
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center text-4xl animate-bounce shadow-lg">
                  🏆
                </div>
                <div className="absolute -top-1 -right-1 bg-indigo-500 text-black w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
                  ★
                </div>
              </div>

              <div className="space-y-1 shrink-0">
                <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                  {t.congrats}
                </h3>
                <p className="text-xs text-gray-400 leading-relaxed font-mono">
                  {t.congratsSub}
                </p>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-4 w-full space-y-3 font-mono shrink-0">
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-gray-400">{lang === 'mn' ? 'Чиний оноо:' : 'Your Score:'}</span>
                  <span className="text-amber-400 text-base md:text-lg font-bold">{score} pts</span>
                </div>
                <div className="w-full h-[1px] bg-white/10" />
                <div className="flex justify-between items-center text-xs md:text-sm">
                  <span className="text-gray-400">{lang === 'mn' ? 'Хамгийн дээд оноо:' : 'Best High Score:'}</span>
                  <span className="text-white text-sm md:text-base font-bold">{highScore} pts</span>
                </div>
              </div>

              {/* SCORE SAVING FORM */}
              <div className="w-full shrink-0">
                {scoreSaved ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center text-xs text-emerald-300 font-mono flex items-center justify-center gap-2 animate-in zoom-in-95">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>{lang === 'mn' ? 'Оноо Firestore "scores" collection-д хадгалагдлаа! ✓' : 'Score saved in Firestore "scores" collection! ✓'}</span>
                  </div>
                ) : (
                  <form onSubmit={handleSaveScore} className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3 w-full text-left">
                    <div className="text-xs font-bold font-mono text-gray-300">
                      {lang === 'mn' ? '👤 Онооны самбарт нэрээ бүртгүүлэх:' : '👤 Register Name to Leaderboard:'}
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        required
                        maxLength={20}
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder={lang === 'mn' ? 'Таны нэр...' : 'Your name...'}
                        className="flex-1 bg-white/10 border border-white/15 focus:border-white/40 focus:outline-none rounded-xl px-3.5 py-2 text-xs md:text-sm text-white placeholder-gray-500 transition-colors font-mono"
                      />
                      <button
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-black px-4 rounded-xl text-xs md:text-sm font-bold flex items-center justify-center transition-all cursor-pointer shadow-lg shrink-0"
                      >
                        <span>{lang === 'mn' ? 'Хадгалах' : 'Save'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="flex gap-3 w-full shrink-0">
                {scoreSaved && (
                  <button 
                    onClick={() => {
                      loadLeaderboard();
                      setShowLeaderboard(true);
                    }}
                    className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-4 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg"
                  >
                    <Trophy className="w-4 h-4" />
                    <span>{lang === 'mn' ? 'Онооны самбар' : 'Leaderboard'}</span>
                  </button>
                )}
                <button 
                  onClick={handleStartGame}
                  className="flex-1 bg-white hover:bg-gray-100 text-black py-3.5 px-6 rounded-xl font-bold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-white/10"
                >
                  <RotateCcw className="w-4 h-4 animate-spin" style={{ animationDuration: '8s' }} />
                  <span>{t.playAgain}</span>
                </button>
              </div>
            </div>
          )}

            </div>
          )}

        </div>
      </div>
    </div>
  );
}
