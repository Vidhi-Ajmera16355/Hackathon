import "dotenv/config";
import express, { Request, Response } from "express";
import Together from "together-ai";
import cors from "cors";
import { BASE_PROMPT, getSystemPrompt } from "./prompts";
import { basePrompt as nodeBasePrompt } from "./defaults/node";
import { basePrompt as reactBasePrompt } from "./defaults/react";

const together = new Together({
  apiKey: process.env.TOGETHER_API_KEY,
});

const app = express();
app.use(cors());
app.use(express.json());

app.post("/template", async (req: Request, res: Response) => {
  const prompt = req.body.prompt;

  try {
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "Return either 'node' or 'react' based on what you think this project should be. Do not return anything extra.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      max_tokens: 200,
    });

    const answer = response.choices[0]?.message?.content?.trim();
    if (answer === "react") {
      res.json({
        prompts: [
          BASE_PROMPT,
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${reactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [reactBasePrompt],
      });
      return;
    }

    if (answer === "node") {
      res.json({
        prompts: [
          `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${nodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
        ],
        uiPrompts: [nodeBasePrompt],
      });
      return;
    }

    res.status(403).json({ message: "You can't access this" });
  } catch (error) {
    console.error("Error calling Together AI:", (error as Error).message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.post("/chat", async (req: Request, res: Response) => {
  const messages = req.body.messages;

  try {
    const response = await together.chat.completions.create({
      messages: [
        {
          role: "system",
          content: getSystemPrompt(),
        },
        ...messages,
      ],
      model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
      max_tokens: 8000,
    });

    res.json({
      response: response.choices[0]?.message?.content || "No response received.",
    });
  } catch (error) {
    console.error("Error calling Together AI:", (error as Error).message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
