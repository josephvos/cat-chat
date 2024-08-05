import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const systemPrompt = 'You are Cat Chat, a knowledgeable and friendly assistant...';

export async function POST(req) {
  try {
    const data = await req.json();
    const userMessages = data.messages.filter(message => message.role === 'user');

    if (userMessages.length === 0) {
      return NextResponse.json({ message: 'Invalid request format. Expected user messages.' }, { status: 400 });
    }

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        ...userMessages,
      ],
      model: 'llama3-8b-8192',
      temperature: 0.5,
      stream: true,
    });

    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of chatCompletion) {
          const text = chunk.choices[0]?.delta?.content || '';
          controller.enqueue(text);
        }
        controller.close();
      },
    });

    return new Response(readableStream, {
      headers: {
        'Content-Type': 'text/plain',
        'Transfer-Encoding': 'chunked',
      },
    });
  } catch (error) {
    console.error('Error creating completion:', error);
    return NextResponse.json({ message: 'Error creating completion', error: error.message }, { status: 500 });
  }
}
