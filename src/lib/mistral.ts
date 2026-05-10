import { Mistral } from '@mistralai/mistralai';

const apiKey = process.env.MISTRAL_API_KEY;

if (!apiKey) {
  throw Error('MISTRAL_API_KEY is not set');
}

const mistral = new Mistral({ apiKey });

export default mistral;

export async function getMistralChatStream(messages: any[]) {
  return mistral.chat.stream({
    model: 'mistral-small-latest',
    messages,
  });
}
