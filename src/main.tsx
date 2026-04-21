import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

// StrictMode를 제거: Disqus 등 서드파티 스크립트의 이중 초기화 방지
createRoot(document.getElementById('root')!).render(<App />)
