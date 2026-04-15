import { useState } from 'react'  
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Generation from './pages/Generation/Generation.jsx'
import Planet from './pages/Planet/Planet.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <BrowserRouter>
       
      <Routes>
        <Route path="/" element={<Generation />} />
        <Route path="/planet" element={<Planet />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
