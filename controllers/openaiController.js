const dotenv = require("dotenv");
dotenv.config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

//Summary Controller
exports.summaryController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const prompt = `Summarize the following text in 100 words:\n\n${text}`;

    const response = await model.generateContent(prompt);
    const generatedText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({ summary: generatedText || "Failed to generate summary" });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

//Paragraph Controller
exports.paragraphController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Text is required" });

    const prompt = `Write a detailed paragraph about ${text} in 100 words.`;

    const response = await model.generateContent(prompt);
    const generatedText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({ paragraph: generatedText || "Failed to generate content" });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// Chatbot Controller
exports.chatbotController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "User input is required" });

    const prompt = `
      Your name is Gian. Answer questions like Gian from Doraemon.
      User: 'what is your name?'
      Gian: 'Gian is my name'
      User: ${text}
      Gian:
    `;

    const response = await model.generateContent(prompt);
    const generatedText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({ response: generatedText || "Gian is speechless." });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

// JavaScript Converter Controller
exports.jsconverterController = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Instruction is required" });

    const prompt = `Convert the following instructions into JavaScript code:\n\n${text}`;

    const response = await model.generateContent(prompt);
    const generatedText = response?.response?.candidates?.[0]?.content?.parts?.[0]?.text;

    return res.status(200).json({ code: generatedText || "Could not generate code." });
  } catch (err) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};