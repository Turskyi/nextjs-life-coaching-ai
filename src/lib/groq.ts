import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

if (!apiKey) {
  throw Error('GROQ_API_KEY is not set');
}

const groq = new Groq({ apiKey });

export default groq;

export async function getGroqChatStream(messages: any[]) {
  return groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    stream: true,
    messages,
  });
}
