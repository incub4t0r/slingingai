import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

class OpenAIClient {
    constructor(apiKey) {
        this.openai = new OpenAI({
            apiKey,
        });
    }

    async chatCompletions(prompt, onDataCallback) {
        const stream = await this.openai.chat.completions.create({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            stream: true,
        });
        for await (const part of stream) {
            const content = part.choices[0]?.delta?.content || '';
            onDataCallback(content); 
        }
    }
}

const slingingai = new OpenAIClient(process.env.OPENAI_API_KEY);

export async function GET({url}) {
    const ac = new AbortController();
    const stream = new ReadableStream({
        start(controller) {
            const prompt = url.searchParams.get("prompt")?.trim() || '';
            console.log(prompt);
            slingingai.chatCompletions(prompt, (data) => {
                controller.enqueue(`data: ${data}\n\n`)
            }).then(() => {
                controller.close();
            });
        },
        cancel() {
            // cancel your resources here
            ac.abort();
        }
    });

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream', 
            // 'Cache-Control': 'no-cache', 
        }
    })
}


// export function GET({ request }) {
//     const ac = new AbortController();
  
//     console.log("GET api: yahoo-finance-ticker")
//     const stream = new ReadableStream({
//       start(controller) {
//         tickerListener.on("ticker", (ticker) => {
//           console.log(ticker.price);
//           controller.enqueue(String(ticker.price));
//         }, { signal: ac.signal });
//       },
//       cancel() {
//         console.log("cancel and abort");
//         ac.abort();
//       },
//     })
  
//     return new Response(stream, {
//       headers: {
//         'content-type': 'text/event-stream',
//       }
//     });
//   }