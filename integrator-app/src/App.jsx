import { Routes, Route } from 'react-router-dom'
import Home from './Layout/Home.jsx'
import NavBar from './Navigation/NavBar.jsx'
import Calculadora from './Layout/Calculadora.jsx'

function App() {
  return (
    <div>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="calculadora" element={<Calculadora />} />
      </Routes>
    </div>
  )
}

export default App