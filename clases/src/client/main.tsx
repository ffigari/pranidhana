import ReactDOM from 'react-dom/client'
import { App } from './components/App'

import { API } from "./api"

const apiUrl = import.meta.env.VITE_API_URL || window.location.origin

const api = new API(apiUrl)

ReactDOM.createRoot(document.getElementById('root')!).render(<App api={api}/>)
