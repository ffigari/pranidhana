import React from 'react'
import { Teacher } from '@shared/teacher'

export default function App() {
  const teacher = new Teacher('Plato')
  return (
    <div style={{ fontFamily: 'sans-serif', padding: 20 }}>
      <h1>Teacherr Demo</h1>
      <p>{teacher.sayHello()}</p>
    </div>
  )
}
