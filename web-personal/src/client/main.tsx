import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './components/App'
import { Teacher } from '@shared/teacher'

const t = new Teacher('Socrates')
console.log(t.sayHello())

ReactDOM.createRoot(document.getElementById('root')!).render(<App />)
