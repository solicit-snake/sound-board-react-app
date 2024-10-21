import { useState } from 'react'
import FreesoundSearch from './components/FreesoundSearch'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <FreesoundSearch/>
      </div>
    </>
  )
}

export default App
