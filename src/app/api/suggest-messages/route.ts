import { openai } from '@ai-sdk/openai';
import { StreamingTextResponse, streamText, StreamData } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
    try {
        const prompt = `Create a list of three open-ended and engaging questions formatted as a single string.
        Each question should be separated by '||'. These questions are for an anonymous social messaging platform,
        like Qooh.me, and should be suitable for a diverse audiance. Avoid personal or sensitive topics, focussing 
        instead on universal themes that encourage friendly interaction. For example, your output should be structured 
        like this: "What's a hobby you've recently started ?||If you could have dinner with any historical figure, who 
        would it be?||What's a simple thing that makes you happy?". Ensure the questions are intriguing, foster curiosity, 
        and contribute to a positive and welcoming conversational environment.`

        const result = await streamText({
            model: openai('gpt-4-turbo'),
            prompt,
        });

        const data = new StreamData();

        data.append({ test: 'value' });

        const stream = result.toAIStream({
            onFinal(_) {
            data.close();
            },
        });

        return new StreamingTextResponse(stream, {}, data);
        
    } catch (error) {
        if(error){
            console.error("openai error", error)
            return NextResponse.json({
                error
            }, {status: 500})
        }else{
            console.error("An unexpected error occured", error)
            throw error
        }
    }
}