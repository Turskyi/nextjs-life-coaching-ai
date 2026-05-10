import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(apiKey);

export default genAI;

export async function getGeminiChatStream(messages: any[]) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-lite' });

  // Convert standard messages to Gemini format
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  // Gemini expects system instruction separately if we use ChatSession,
  // or we can just send it as part of the messages if we use generateContentStream.
  // To keep it simple and consistent with fallback, we'll use generateContentStream.

  const systemInstruction = messages.find(m => m.role === 'system')?.content;
  const chatMessages = messages.filter(m => m.role !== 'system').map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const modelWithSystem = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash-lite',
    systemInstruction: systemInstruction,
  });

  return modelWithSystem.generateContentStream({
    contents: chatMessages,
  });
}

export async function getEmbedding(text: string) {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  const embedding = result.embedding.values;

  if (!embedding) throw Error('😞 Error generating embedding.');

  return embedding;
}
