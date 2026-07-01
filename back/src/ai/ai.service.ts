import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { GoogleGenAI } from '@google/genai';
import { Response } from 'express';
import { aiConfig } from './ai.config';

@Injectable()
export class AiService {
    private ai: GoogleGenAI;
    private readonly model = 'gemini-2.5-flash-lite';

    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) throw new InternalServerErrorException('Api key is missing');

        this.ai = new GoogleGenAI({ apiKey });
    }

    async streamText(prompt: string, res: Response) {
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders();

        let ended = false;
        const sendDone = (error?: string) => {
            if (ended) return;
            ended = true;
            const payload = JSON.stringify({ text: '', done: true, ...(error ? { error } : {}) });
            res.write(`data: ${payload}\n\n`);
            res.end();
        };

        try {
            const stream = await this.ai.models.generateContentStream({
                model: this.model,
                contents: prompt,
                config: {
                    systemInstruction: aiConfig,
                    temperature: 0.3,
                }
            });

            for await (const chunk of stream) {
                const chunkText = chunk.text ?? '';
                if (chunkText) {
                    const payload = JSON.stringify({ text: chunkText, done: false });
                    res.write(`data: ${payload}\n\n`);

                    if (typeof (res as any).flush === 'function') {
                        (res as any).flush();
                    }
                }

                if (res.writableEnded) break;
            }

            sendDone();
        } catch (error: any) {
            console.error('Erreur streaming Gemini:', error);

            if (!res.headersSent) {
                throw new InternalServerErrorException('An error occurred while streaming the response');
            }
            sendDone('stream_failed');
        }
    }
}