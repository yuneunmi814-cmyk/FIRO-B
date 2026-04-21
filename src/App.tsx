import { useState } from 'react';
import type { Answers, FIROBScores } from './types';
import { calculateScores } from './utils/analysis';
import Welcome from './pages/Welcome';
import Test from './pages/Test';
import Results from './pages/Results';
import './App.css';

type Page = 'welcome' | 'test' | 'results';

function App() {
  const [page, setPage]         = useState<Page>('welcome');
  const [scores, setScores]     = useState<FIROBScores | null>(null);
  const [userName, setUserName] = useState('');
  const [testDate, setTestDate] = useState('');

  const handleStart = (name: string) => {
    setUserName(name);
    setPage('test');
  };

  const handleComplete = (answers: Answers) => {
    setScores(calculateScores(answers));
    setTestDate(new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }));
    setPage('results');
  };

  const handleRetake = () => {
    setScores(null);
    setPage('welcome');
  };

  if (page === 'welcome') return <Welcome onStart={handleStart} />;
  if (page === 'test')    return <Test onComplete={handleComplete} />;
  if (page === 'results' && scores)
    return <Results scores={scores} userName={userName} testDate={testDate} onRetake={handleRetake} />;
  return null;
}

export default App;
