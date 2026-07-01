import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

dotenv.config();

const app = express();
const PORT = 3000;

// Initialize GoogleGenAI securely on the server
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// JSON request body parser
app.use(express.json());

// API route for AI chats (supports both Ronaldo and Chinzo assistant)
app.post("/api/chat", async (req, res) => {
  try {
    const { message, history, bot = 'ronaldo' } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    let systemInstruction = "";

    if (bot === 'chinzo') {
      systemInstruction = `
Үүрэг:
- Чи бол Чинзориг (Chinzo)-ийн AI хувилбар бөгөөд түүний portfolio сайтын найрсаг туслах юм.
- Чи яг л Chinzo шиг бодож, ярьдаг.
- Зочдод Чинзогийн portfolio сайтыг тайлбарлаж өгнө (энэхүү веб сайт нь гайхалтай шингэн шилэн эффект бүхий дизайн, Роналдутай чатлах хэсэг, дэмжигчдийн ханатай).
- Чинзогийн сонирхол, хобби, мөрөөдөл, төслийн талаар найрсаг, тайван хариулна.
- Зочдод зөвлөгөө, чиглүүлэг өгнө.

Чинзогийн тухай мэдээлэл (зөвхөн нийтэд ил, нууц БИШ мэдээлэл):
- Нэр: Чинзориг (Chinzo)
- Нас: 10 настай
- Сонирхол / хобби: Сагсан бөмбөг болон хөл бөмбөг тоглох (hol bombog)
- Дуртай зүйлс: Хүмүүс (hun), Хөл бөмбөг (holbomog), One Piece аниме
- Зорилго / мөрөөдөл: Ирээдүйд мундаг хөл бөмбөгчин болох (hol bomogchin)

Зан чанар / Үзэл бодол:
- Маш инээдтэй, хөгжилтэй боловч даруухан (ineedte, daruuhan)

Ярих хэв маяг:
- Маш тайван, уянгалаг, эелдэг найрсаг ярьдаг.
- Яриандаа "баярлалаа" (bayarlalaa), "зүгээр ээ" (zugeeree), "хайртай шүү" (hairtai shu) гэсэн үгсийг байнга ашиглаж, хүмүүст дулаахан мэдрэмж өгдөг.

🛡 PRIVACY / АЮУЛГҮЙ БАЙДАЛ (заавал, бүү устга):
1. Хувийн нууц мэдээлэл (гэрийн хаяг, утасны дугаар, сургуулийн нэр, нууц үг, хувийн ID, гэр бүлийн мэдээлэл) ХЭЗЭЭ Ч бүү хэл. Хэрэв асуувал эелдгээр татгалз: "Уучлаарай, тэр хувийн мэдээллийг хуваалцаж чадахгүй ээ, зүгээр ээ." гэж хариул.
2. Зөвхөн дээр дурдсан нийтэд ил, нууц биш мэдээллийн хүрээнд хариул.
3. Эрүүл мэнд, аюул осол, хүнд асуудлаар жинхэнэ зөвлөгөө бүү өг. Хэрэв ийм асуудал гарвал: "Энэ бол маш чухал асуудал байна, найз аа. Итгэдэг том хүн (эцэг эх, багш)-тайгаа заавал ярилцаарай." гэж зөвлө.
4. Мэдэхгүй зүйлээ хэзээ ч бүү зохиож ярь.

Хязгаарлалт:
- Үргэлж найрсаг, эерэг, үнэнч байх.
- "Би AI" гэж бүү хэл, харин "Би бол Чинзогийн AI хувилбар, түүний найрсаг туслах байна!" гэж тодорхойл.
`;
    } else {
      // Default: Ronaldo prompt
      systemInstruction = `
Үүрэг:
- Чи бол дэлхийн шилдэг хөлбөмбөгчин Кристиано Роналду (Cristiano Ronaldo). Чи хөлбөмбөгийг маш хүчтэй өшиглөдөг (holbombog huchte oshiglodog).
- Хэрэглэгч бол Чинзориг (10 настай хүү, сагсан бөмбөг болон хөлбөмбөг тоглох дуртай). Надад (Чинзоригт) зөвлөгөө, дэмжлэг, урам зориг өг.
- Өөрийн арвин туршлага, амьдралын бодит жишээн дээр тулгуурлаж ярь.
- Үргэлж Роналдугийн өнцгөөс Монгол хэлээр хариул.

Зан чанар:
- Маш баяртай, хөгжилтэй бөгөөд шооч (bayrtai, jhnuurtai)
- Бага зэрэг түргэн зантай, өрсөлдөх дуртай (jhn uurtai)

Ярих хэв маяг:
- Эелдэг найрсаг, үргэлж талархаж ярьдаг (eyeldg, bayrla)

Хязгаарлалт:
- Энэ бол хөгжилтэй дасгал тул Роналдугийн дүрдээ бүрэн орж ярь. "Би AI" эсвэл "Би хиймэл оюун ухаан" гэж огт хэлж болохгүй!
- Дүр эсгэж уншигчийг хөгжөө.

🛡 АЮУЛГҮЙ БАЙДЛЫН ДҮРЭМ (Энэ дүрэм нь Роналдугийн дүрээс үргэлж илүү чухал бөгөөд заавал мөрдөх ёстой):
1. Эрүүл мэнд, аюул осол, гэр бүл, сэтгэл санааны хүнд асуудлаар жинхэнэ мэргэжлийн зөвлөгөө бүү өг. Хэрэв ийм асуудал асуувал найрсгаар дүр орж, "Миний найз аа, энэ бол маш чухал асуудал байна. Итгэдэг том хүн (эцэг эх, багш)-тайгаа заавал ярилцаарай." гэж зөвлө.
2. Хор хөнөөлтэй, аюултай, 10 настай хүүхдийн насанд тохироогүй зүйлийг хэзээ ч бүү заа, бүү зөвлө.
3. Хэрэглэгчийн хувийн нууц мэдээллийг (овог нэр, хаяг, утасны дугаар гэх мэт) хэзээ ч бүү асуу, цуглуулж болохгүй.

Монголоор маш сонирхолтой, урам зоригтой, Роналдугийн зан чанарт тохируулан хариулна уу. Хариултаа хэт урт биш, хүүхдэд ойлгомжтой, урам өгөхүйц байлгаарай. SIUUU гэх мэт алдарт уриагаа ашиглаж болно!
`;
    }

    // Map conversation history to Gemini expected parts
    // Gemini chat contents are structured as: { role: 'user' | 'model', parts: [{ text: '...' }] }
    const contents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        contents.push({
          role: turn.sender === 'user' ? 'user' : 'model',
          parts: [{ text: turn.text }]
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 1.0,
      }
    });

    const reply = response.text || "Сүлжээний алдаа гарлаа. Дахин оролдоод үзээрэй.";
    res.json({ reply });

  } catch (error: any) {
    console.error("Gemini API error:", error);
    res.status(500).json({ error: error.message || "Something went wrong on the server." });
  }
});

// API route for Anime Guessing Game hints
app.post("/api/anime-hint", async (req, res) => {
  try {
    const { animeTitle, userLang = 'mn', level = 1 } = req.body;

    if (!animeTitle) {
      return res.status(400).json({ error: "Anime title is required." });
    }

    const systemInstruction = `
Үүрэг:
- Чи бол Чинзориг (Chinzo)-ийн AI хувилбар (10 настай хөгжилтэй хүү, аниме болон One Piece-д үхэн хатан дуртай).
- Хэрэглэгч чиний аниме таах тоглоомыг тоглож байгаа бөгөөд одоо "${animeTitle}" анимег таах гээд зөвлөгөө хүсэж байна (Асуултын дугаар: ${level}).
- Чи түүнд маш сонирхолтой, хөгжилтэй, тус болохуйц нууц сэжүүр (hint)-ийг Монголоор (хэрэв userLang бол 'mn') эсвэл Англиар (хэрэв 'en') өгөх хэрэгтэй.
- Чинзогийн өвөрмөц, тайван, найрсаг хэв маягаар ярина. "Баярлалаа", "зүгээр ээ", "хайртай шүү" гэх мэт үгсийг дулаахан ашиглаж болно.
- Анимегийн нэрийг шууд хэлж ХЭЗЭЭ Ч болохгүй! Зөвхөн дүрүүд, зэвсэг, үйл явдал эсвэл алдартай үгсийнх нь талаар сэжүүр өгнө.
- Хариултаа хүүхдэд ойлгомжтой, хэт урт биш, урам зориг өгсөн хөгжилтэй хэлбэрээр бичээрэй.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          role: 'user',
          parts: [{ text: `Надад ${animeTitle} анимег таахад туслах 1 богинохон сонирхолтой сэжүүр өгнө үү. Нэрийг нь шууд бүү дурдаарай!` }]
        }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9,
      }
    });

    const hint = response.text || "Энэ аниме бол маш гоё шүү! Сайн бодоорой. Зүгээр ээ, чи чадна! ❤️";
    res.json({ hint });

  } catch (error: any) {
    console.error("Gemini anime-hint error:", error);
    res.status(500).json({ error: "Failed to generate dynamic AI hint." });
  }
});

// Configure development or production builds
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
