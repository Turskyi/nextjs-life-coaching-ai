import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(apiKey);

export default genAI;

export async function getGeminiChatStream(messages: any[]) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash-lite' });

  // Convert standard messages to Gemini format
  const systemInstruction = messages.find((m) => m.role === 'system')?.content;
  const chatMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

  const modelWithSystem = genAI.getGenerativeModel({
    model: 'gemini-3.5-flash-lite',
    systemInstruction: systemInstruction,
  });

  return modelWithSystem.generateContentStream({
    contents: chatMessages,
  });
}

export async function getEmbedding(text: string) {
  // Using gemini-embedding-001 as it is the stable model available in 2026.
  // Note: This model produces 3072 dimensions by default.
  // We truncate to 1536 dimensions to match the user's current Pinecone index.
  const model = genAI.getGenerativeModel({ model: 'gemini-embedding-001' });
  const result = await model.embedContent(text);
  const embedding = result.embedding.values;

  if (!embedding) throw Error('😞 Error generating embedding.');

  // Truncate to 1536 dimensions to match Pinecone index
  return embedding.slice(0, 1536);
}
