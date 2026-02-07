
import { PhoneticPair, LessonContent } from './types';

export const LESSONS: Record<PhoneticPair, LessonContent> = {
  [PhoneticPair.FV]: {
    title: "O Sopro da Fada e a Vibração da Vaca",
    pair: PhoneticPair.FV,
    explanation: "A letra F é um sopro suave (f-f-f), enquanto a letra V faz o nosso pescoço tremer um pouquinho (v-v-v)!",
    tips: [
      "Coloque a mão na garganta: no V ela vibra, no F não!",
      "F de Faca, V de Vaca."
    ],
    examples: [
      { word: "FACA", letter: "F", image: "https://picsum.photos/seed/knife/200" },
      { word: "VACA", letter: "V", image: "https://picsum.photos/seed/cow/200" },
      { word: "FOCA", letter: "F", image: "https://picsum.photos/seed/seal/200" },
      { word: "VELA", letter: "V", image: "https://picsum.photos/seed/candle/200" }
    ]
  },
  [PhoneticPair.MN]: {
    title: "A Boca Fechada do Macaco e Aberta do Navio",
    pair: PhoneticPair.MN,
    explanation: "Para falar M, fechamos os lábios bem apertadinhos. Para falar N, a ponta da língua encosta lá no céu da boca!",
    tips: [
      "M antes de P e B! (Mamãe traz Pão e Bolo)",
      "N antes das outras letras."
    ],
    examples: [
      { word: "MACACO", letter: "M", image: "https://picsum.photos/seed/monkey/200" },
      { word: "NAVIO", letter: "N", image: "https://picsum.photos/seed/ship/200" },
      { word: "TAMBOR", letter: "M", image: "https://picsum.photos/seed/drum/200" },
      { word: "PENTE", letter: "N", image: "https://picsum.photos/seed/comb/200" }
    ]
  },
  [PhoneticPair.PB]: {
    title: "A Explosão do Pato e do Balão",
    pair: PhoneticPair.PB,
    explanation: "Tanto P quanto B são como pequenas explosões na boca. O P é mais 'seco' e o B tem um som mais 'cheio'.",
    tips: [
      "O P sai apenas ar.",
      "O B faz um som que começa lá dentro."
    ],
    examples: [
      { word: "PATO", letter: "P", image: "https://picsum.photos/seed/duck/200" },
      { word: "BOLA", letter: "B", image: "https://picsum.photos/seed/ball/200" },
      { word: "PIPA", letter: "P", image: "https://picsum.photos/seed/kite/200" },
      { word: "BOTA", letter: "B", image: "https://picsum.photos/seed/boot/200" }
    ]
  },
  [PhoneticPair.TD]: {
    title: "O Toque da Tartaruga e o Som do Dado",
    pair: PhoneticPair.TD,
    explanation: "O T e o D são parecidos, mas o T é 'surdo' (sai só ar) e o D é 'sonoro' (as cordas vocais vibram).",
    tips: [
      "T de Tatu e Teto.",
      "D de Dado e Dedo."
    ],
    examples: [
      { word: "TATU", letter: "T", image: "https://picsum.photos/seed/armadillo/200" },
      { word: "DADO", letter: "D", image: "https://picsum.photos/seed/dice/200" },
      { word: "TETO", letter: "T", image: "https://picsum.photos/seed/roof/200" },
      { word: "DOCE", letter: "D", image: "https://picsum.photos/seed/candy/200" }
    ]
  },
  [PhoneticPair.R_RR]: {
    title: "O Rato que Rói e o Ronco do Carro",
    pair: PhoneticPair.R_RR,
    explanation: "Usamos um R no começo das palavras para o som forte. No meio da palavra, entre vogais, precisamos de dois RR para ser forte!",
    tips: [
      "R no começo: Rato (som forte).",
      "RR no meio: Carro (som forte).",
      "Um R no meio treme a língua: Arara."
    ],
    examples: [
      { word: "RATO", letter: "R", image: "https://picsum.photos/seed/mouse/200" },
      { word: "CARRO", letter: "RR", image: "https://picsum.photos/seed/car/200" },
      { word: "RODA", letter: "R", image: "https://picsum.photos/seed/wheel/200" },
      { word: "TERRA", letter: "RR", image: "https://picsum.photos/seed/earth/200" }
    ]
  },
  [PhoneticPair.S_SS]: {
    title: "A Serpente e o Pássaro",
    pair: PhoneticPair.S_SS,
    explanation: "O S no começo tem som de 'sssh'. No meio da palavra, para ter esse mesmo som forte entre vogais, usamos SS.",
    tips: [
      "S no começo: Sapo.",
      "SS no meio: Pássaro.",
      "Um S entre vogais tem som de Z: Casa."
    ],
    examples: [
      { word: "SAPO", letter: "S", image: "https://picsum.photos/seed/frog/200" },
      { word: "PÁSSARO", letter: "SS", image: "https://picsum.photos/seed/bird/200" },
      { word: "SOL", letter: "S", image: "https://picsum.photos/seed/sun/200" },
      { word: "OSSO", letter: "SS", image: "https://picsum.photos/seed/bone/200" }
    ]
  }
};
