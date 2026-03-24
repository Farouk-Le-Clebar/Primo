import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { stream } from 'undici';

@Injectable()
export class OllamaProxyMiddleware implements NestMiddleware {
    async use(req: Request, res: Response, next: NextFunction) {
        const targetUrl = process.env.OLLAMA_API_URL || 'http://api.primo-data.fr:7293';


        const bodyData = JSON.stringify(req.body);

        try {
            await stream(
                targetUrl + '/api/generate',
                {
                    method: 'POST',
                    headers: {
                        'content-type': 'application/json',
                    },
                    body: bodyData,
                    bodyTimeout: 0,
                    headersTimeout: 0,
                },
                ({ statusCode, headers }) => {
                    res.writeHead(statusCode, {
                        'Content-Type': 'application/x-ndjson',
                        'Transfer-Encoding': 'chunked',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive',
                    });

                    return res;
                }
            );
        } catch (err) {
            if (!res.headersSent) {
                res.status(500).send('Erreur de stream Ollama');
            }
        }
    }
}