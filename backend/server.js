import { GoogleGenerativeAI } from "@google/generative-ai";
import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GEMINI_API) {
  throw new Error("Google API Key (GEMINI_API) is missing");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API);

app.post("/gemini", async (req, res) => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const chat = model.startChat({
      history: req.body.history,
    });

    // Debug: Gönderilen veri yapısını kontrol etme
    console.log("Sending request with prompt:", req.body.prompt);
    console.log("Sending request with history:", req.body.history);

    const result = await chat.sendMessage(req.body.prompt);
    const response = await result.response;

    // Eğer response bir Promise ise, await kullanın
    const text = await response.text();
    console.log("Generated text:", text);

    res.json({ text });
  } catch (error) {
    console.error("Error occurred:", error);
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

app.listen(3030, () => console.log("Server started at port: 3030"));
