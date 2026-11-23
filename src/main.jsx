// 진입점: index.html의 <div id="root">에 App을 붙이는 일만 한다
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './App'
import './style.css'

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>)
