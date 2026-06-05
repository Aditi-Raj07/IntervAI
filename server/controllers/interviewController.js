import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

export const chatInterview = async (req, res) => {
  try {
    const { messages, mode, level } = req.body;

    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    // 🎯 Mode Control
    let modePrompt = "";

    if (mode === "technical")
      modePrompt = "Focus strictly on DSA, algorithms, coding implementation.";
    if (mode === "core")
      modePrompt = "Focus strictly on OS, DBMS, CN, OOPS concepts.";
    if (mode === "hr")
      modePrompt =
        "Act like HR interviewer. Ask behavioral and personality-based questions.";
    if (mode === "rapid")
      modePrompt =
        "Conduct rapid-fire round. Ask short, fast, mixed technical questions.";

    // 🎯 Difficulty Control
    let difficultyPrompt = "";

    if (level === "easy")
      difficultyPrompt = "Ask beginner level questions.";
    if (level === "medium")
      difficultyPrompt = "Ask intermediate level questions.";
    if (level === "hard")
      difficultyPrompt =
        "Ask advanced optimization and edge-case based questions.";

    const systemPrompt = `
You are a strict professional interviewer.

${modePrompt}
${difficultyPrompt}

Rules:
- Ask ONE question at a time.
- Evaluate answers critically.
- If correct → ask deeper follow-up.
- If partially correct → ask clarification.
- If wrong → give hint and re-ask.
- Never reveal full answer.
- Keep responses sharp and professional.

If user sends "END_INTERVIEW":

Respond EXACTLY in this format:

FINAL SCORE: X/10

STRENGTHS:
- Point 1
- Point 2

WEAKNESSES:
- Point 1
- Point 2

IMPROVEMENT ADVICE:
- Point 1
- Point 2

End conversation after this.
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
