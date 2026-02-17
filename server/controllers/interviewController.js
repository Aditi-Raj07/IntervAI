import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const chatInterview = async (req, res) => {
  try {
   const { messages, type, level, mode } = req.body;

let difficultyPrompt = "";
if (level === "easy")
  difficultyPrompt = "Keep questions basic and conceptual.";
if (level === "medium")
  difficultyPrompt =
    "Ask implementation-based and reasoning questions.";
if (level === "hard")
  difficultyPrompt =
    "Ask advanced, optimization and edge-case questions.";

let modePrompt = "";

if (mode === "technical")
  modePrompt = "Focus only on coding, DSA and algorithms.";

if (mode === "core")
  modePrompt =
    "Focus on core subjects like OS, DBMS, CN, OOPS.";

if (mode === "hr")
  modePrompt =
    "Ask behavioral, personality and situational HR questions.";

if (mode === "rapid")
  modePrompt = `
Rapid Fire Mode:
- Ask short, fast-paced questions
- One line questions
- Mixed technical + core + hr
- No long explanation
`;

const systemPrompt = `
You are a strict professional interviewer.

Interview Mode: ${mode}
${modePrompt}
${difficultyPrompt}

Ask ONE question at a time.

After answer:
- If correct → ask deeper follow-up
- If wrong → give hint only
- Keep responses short.

If user says END_INTERVIEW:
Give evaluation in format:
Score: X/10
Feedback: short improvement suggestion.
`;


    const response = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
    });

    res.json({
      reply: response.choices[0].message.content,
    });

  } catch (error) {
    console.error("GROQ ERROR:", error);
    res.status(500).json({ error: error.message });
  }
};
