import { API } from "../api"

import { ViewportSentinel } from "./ViewportSentinel"
import { Classes } from "./Classes"
import { ClassesList } from "./ClassesList"

export const App = ({ api }: { api: API }) => {
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h1>Demo</h1>
      <Classes
        api={api}
        renderViewportSentinel={({ onEnter, onLeave }) => (<ViewportSentinel onEnter={onEnter} onLeave={onLeave}/>)}
        renderClasses={(classes) => (<ClassesList classes={classes} />)}
      />
    </div>
  )
}
