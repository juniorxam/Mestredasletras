
import React, { useState, useEffect, useCallback } from 'react';
import { PhoneticPair, Exercise, LessonContent } from './types';
import { LESSONS } from './constants';
import { generateExercises, generateFunStory, playAudio } from './geminiService';

const AudioButton: React.FC<{ text: string; label?: string }> = ({ text, label }) => (
  <button 
    onClick={() => playAudio(text)}
    className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-full transition-colors group"
    title="Ouvir"
  >
    <span className="text-xl group-hover:scale-110 transition-transform">🔊</span>
    {label && <span className="font-bold">{label}</span>}
  </button>
);

const Header: React.FC = () => (
  <header className="bg-yellow-400 p-6 shadow-lg rounded-b-3xl mb-8 flex items-center justify-between">
    <div className="flex items-center gap-4">
      <span className="text-4xl">✏️</span>
      <h1 className="text-2xl md:text-4xl font-kids text-blue-800">Mestre das Letras</h1>
    </div>
    <div className="hidden md:block text-blue-700 font-bold">
      Aprender é uma aventura!
    </div>
  </header>
);

const LandingPage: React.FC<{ onSelect: (pair: PhoneticPair) => void }> = ({ onSelect }) => {
  const getEmojiForPair = (pair: PhoneticPair) => {
    switch (pair) {
      case PhoneticPair.FV: return '🧚🐮';
      case PhoneticPair.MN: return '🐒⛵';
      case PhoneticPair.PB: return '🦆🎈';
      case PhoneticPair.TD: return '🐢🎲';
      case PhoneticPair.R_RR: return '🐭🚗';
      case PhoneticPair.S_SS: return '🐸🐦';
      default: return '📚';
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-3xl font-kids text-green-700 mb-8">Escolha sua missão de hoje:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Object.values(LESSONS).map((lesson) => (
          <button
            key={lesson.pair}
            onClick={() => onSelect(lesson.pair)}
            className="bg-white border-4 border-dashed border-blue-400 p-8 rounded-3xl shadow-xl hover:scale-105 transition-transform group"
          >
            <div className="text-6xl mb-4 group-hover:animate-bounce">
              {getEmojiForPair(lesson.pair)}
            </div>
            <h3 className="text-2xl font-kids text-blue-600 mb-2">{lesson.pair}</h3>
            <p className="text-gray-600 font-medium">Sons de {lesson.pair}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

const LessonView: React.FC<{ lesson: LessonContent; onNext: () => void; onBack: () => void }> = ({ lesson, onNext, onBack }) => (
  <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-2xl border-4 border-green-400">
    <div className="flex justify-between items-start mb-6">
      <button onClick={onBack} className="text-blue-500 font-bold hover:underline">← Voltar</button>
      <AudioButton text={`${lesson.title}. ${lesson.explanation}`} label="Ouvir Lição" />
    </div>
    <h2 className="text-3xl font-kids text-green-700 mb-6">{lesson.title}</h2>
    
    <div className="bg-green-50 p-6 rounded-2xl mb-8 border-l-8 border-green-400">
      <p className="text-xl text-gray-800 leading-relaxed mb-4">{lesson.explanation}</p>
      <ul className="space-y-3">
        {lesson.tips.map((tip, i) => (
          <li key={i} className="flex items-center gap-3">
            <span className="text-green-500 text-xl">✨</span>
            <span className="font-bold text-green-800">{tip}</span>
            <button onClick={() => playAudio(tip)} className="text-sm opacity-60 hover:opacity-100">🔊</button>
          </li>
        ))}
      </ul>
    </div>

    <button
      onClick={onNext}
      className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white font-kids text-2xl rounded-2xl shadow-lg transition-colors"
    >
      Vamos jogar! 🚀
    </button>
  </div>
);

const ExerciseView: React.FC<{ pair: PhoneticPair; onComplete: () => void; onBack: () => void }> = ({ pair, onComplete, onBack }) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [story, setStory] = useState("");
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; show: boolean } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [exs, str] = await Promise.all([generateExercises(pair), generateFunStory(pair)]);
      setExercises(exs);
      setStory(str);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [pair]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleOptionClick = (option: string) => {
    if (feedback?.show) return;
    const correct = option === exercises[currentIndex].correctOption;
    if (correct) playAudio("Muito bem! " + exercises[currentIndex].fullWord);
    else playAudio("Quase lá! Tente de novo.");
    
    setFeedback({ isCorrect: correct, show: true });
    setTimeout(() => {
      setFeedback(null);
      if (currentIndex < exercises.length - 1) setCurrentIndex(i => i + 1);
      else onComplete();
    }, 2500);
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="animate-bounce text-6xl mb-4">🎨</div>
      <p className="text-2xl font-kids text-blue-600">O artista mágico está pintando os desenhos e preparando os áudios...</p>
    </div>
  );

  const currentEx = exercises[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-blue-500 font-bold hover:underline">← Sair</button>
        <AudioButton text="Complete a palavra clicando na letra certa!" label="Instrução" />
      </div>
      
      <div className="bg-white p-8 rounded-3xl shadow-2xl border-4 border-orange-400 relative overflow-hidden">
        {feedback?.show && (
          <div className={`absolute inset-0 flex items-center justify-center z-20 ${feedback.isCorrect ? 'bg-green-500/95' : 'bg-red-500/95'}`}>
            <div className="text-white text-center animate-bounce">
              <span className="text-9xl mb-4 block">{feedback.isCorrect ? '🌟' : '💡'}</span>
              <h3 className="text-4xl font-kids">{feedback.isCorrect ? 'CORRETO!' : 'OPS!'}</h3>
              <p className="text-2xl font-bold mt-2">{currentEx.fullWord}</p>
            </div>
          </div>
        )}

        <div className="mb-6">
          {currentEx.imageData && (
            <img src={currentEx.imageData} alt="Dica" className="w-full h-56 object-contain rounded-2xl mb-6 bg-gray-50 p-2 shadow-inner" />
          )}
          <div className="flex items-center justify-center gap-4 mb-4">
            <p className="text-6xl font-kids text-blue-800 tracking-widest">{currentEx.word}</p>
            <button onClick={() => playAudio(currentEx.fullWord)} className="text-3xl p-3 bg-gray-100 rounded-full hover:bg-gray-200">🔊</button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {currentEx.options.map((opt) => (
            <button
              key={opt}
              onClick={() => handleOptionClick(opt)}
              className="py-8 bg-blue-500 hover:bg-blue-600 text-white text-4xl sm:text-6xl font-kids rounded-3xl shadow-xl transition-all active:scale-95"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-8 p-6 bg-yellow-50 rounded-2xl border-2 border-yellow-200 flex flex-col items-center">
        <h4 className="text-lg font-kids text-yellow-800 mb-3">História Mágica 📖</h4>
        <p className="text-xl text-yellow-900 italic text-center mb-4">"{story}"</p>
        <AudioButton text={story} label="Ouvir a História" />
      </div>
    </div>
  );
};

const FinalScreen: React.FC<{ onReset: () => void }> = ({ onReset }) => (
  <div className="max-w-2xl mx-auto text-center py-10">
    <div className="bg-white p-10 rounded-3xl shadow-2xl border-8 border-yellow-400">
      <div className="text-9xl mb-6">🥇</div>
      <h2 className="text-5xl font-kids text-blue-800 mb-4">Uau! Você conseguiu!</h2>
      <AudioButton text="Parabéns! Você completou todos os desafios e agora é um Mestre das Letras!" label="Ouvir Vitória" />
      <button
        onClick={onReset}
        className="mt-8 px-10 py-5 bg-green-500 hover:bg-green-600 text-white font-kids text-2xl rounded-2xl shadow-lg transition-transform hover:scale-105"
      >
        Jogar de novo! 🎮
      </button>
    </div>
  </div>
);

const App: React.FC = () => {
  const [selectedPair, setSelectedPair] = useState<PhoneticPair | null>(null);
  const [step, setStep] = useState<'landing' | 'lesson' | 'exercise' | 'final'>('landing');

  return (
    <div className="min-h-screen pb-20 bg-emerald-50">
      <Header />
      <main className="container mx-auto px-4">
        {step === 'landing' && <LandingPage onSelect={(p) => { setSelectedPair(p); setStep('lesson'); }} />}
        {step === 'lesson' && selectedPair && <LessonView lesson={LESSONS[selectedPair]} onNext={() => setStep('exercise')} onBack={() => setStep('landing')} />}
        {step === 'exercise' && selectedPair && <ExerciseView pair={selectedPair} onComplete={() => setStep('final')} onBack={() => setStep('landing')} />}
        {step === 'final' && <FinalScreen onReset={() => setStep('landing')} />}
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur p-4 text-center text-gray-500 text-sm border-t font-medium">
        Desenvolvido para transformar a alfabetização em uma jornada de diversão e sons! 🎵
      </footer>
    </div>
  );
};

export default App;
