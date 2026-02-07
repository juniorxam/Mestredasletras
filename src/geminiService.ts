
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { PhoneticPair, Exercise } from "./types";

// Função utilitária para decodificação de áudio PCM
function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export async function playAudio(text: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Leia de forma clara e carinhosa para uma criança: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Kore' }, // Voz amigável
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
      const source = audioContext.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.destination);
      source.start();
    }
  } catch (error) {
    console.error("Erro ao gerar áudio:", error);
  }
}

async function generateImage(word: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `Uma ilustração infantil colorida, fofa e didática de: ${word}. Fundo branco, estilo desenho animado alegre, sem textos.` }],
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (e) {
    console.error("Erro na imagem:", e);
  }
  return `https://picsum.photos/seed/${word}/400/300`; // Fallback
}

export async function generateExercises(pair: PhoneticPair): Promise<Exercise[]> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Gere 8 exercícios de completar palavras em PORTUGUÊS DO BRASIL para crianças de 7 a 8 anos, focando na distinção entre as letras ${pair.split('-').join(' e ')}. 
  IMPORTANTE: Todas as palavras devem ser substantivos concretos fáceis de desenhar (animais, objetos).
  Retorne um array JSON com: word (ex: 'JA_ELA'), options (ex: ['N', 'M']), correctOption, fullWord.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            word: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctOption: { type: Type.STRING },
            fullWord: { type: Type.STRING }
          },
          required: ["word", "options", "correctOption", "fullWord"]
        }
      }
    }
  });

  const baseExercises = JSON.parse(response.text);
  
  // Gerar imagens em paralelo para cada exercício
  const exercisesWithImages = await Promise.all(baseExercises.map(async (ex: any, index: number) => {
    const imageData = await generateImage(ex.fullWord);
    return {
      ...ex,
      id: `ex-${pair}-${index}`,
      imageData
    };
  }));

  return exercisesWithImages;
}

export async function generateFunStory(pair: PhoneticPair): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const prompt = `Escreva uma história curtíssima (máximo 4 frases) em PORTUGUÊS DO BRASIL para crianças. Use muitas palavras com ${pair.split('-').join(' e ')}.`;
  const response = await ai.models.generateContent({ model: "gemini-3-flash-preview", contents: prompt });
  return response.text || "Vamos brincar com as letras!";
}
