import { useState } from 'react'
import FreeSoundSearch from './components/FreesoundSearch'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <FreeSoundSearch/>
      </div>
    </>
  )
}

export default App
