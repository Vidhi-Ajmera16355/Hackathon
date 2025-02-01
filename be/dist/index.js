"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const together_ai_1 = __importDefault(require("together-ai"));
const cors_1 = __importDefault(require("cors"));
const prompts_1 = require("./prompts");
const node_1 = require("./defaults/node");
const react_1 = require("./defaults/react");
const together = new together_ai_1.default({
    apiKey: process.env.TOGETHER_API_KEY,
});
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/template", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const prompt = req.body.prompt;
    try {
        const response = yield together.chat.completions.create({
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
        const answer = (_c = (_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) === null || _c === void 0 ? void 0 : _c.trim();
        if (answer === "react") {
            res.json({
                prompts: [
                    prompts_1.BASE_PROMPT,
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${react_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [react_1.basePrompt],
            });
            return;
        }
        if (answer === "node") {
            res.json({
                prompts: [
                    `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${node_1.basePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`,
                ],
                uiPrompts: [node_1.basePrompt],
            });
            return;
        }
        res.status(403).json({ message: "You can't access this" });
    }
    catch (error) {
        console.error("Error calling Together AI:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.post("/chat", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const messages = req.body.messages;
    try {
        const response = yield together.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: (0, prompts_1.getSystemPrompt)(),
                },
                ...messages,
            ],
            model: "meta-llama/Llama-3.3-70B-Instruct-Turbo",
            max_tokens: 8000,
        });
        res.json({
            response: ((_b = (_a = response.choices[0]) === null || _a === void 0 ? void 0 : _a.message) === null || _b === void 0 ? void 0 : _b.content) || "No response received.",
        });
    }
    catch (error) {
        console.error("Error calling Together AI:", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}));
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
