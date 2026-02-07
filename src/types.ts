
export enum PhoneticPair {
  FV = 'F-V',
  MN = 'M-N',
  PB = 'P-B',
  TD = 'T-D',
  R_RR = 'R-RR',
  S_SS = 'S-SS'
}

export interface Exercise {
  id: string;
  word: string;
  options: string[];
  correctOption: string;
  fullWord: string;
  imageData?: string; // Base64 da imagem gerada
}

export interface LessonContent {
  title: string;
  pair: PhoneticPair;
  explanation: string;
  tips: string[];
  examples: { word: string; letter: string; image: string }[];
}
