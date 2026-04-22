import { useState } from 'react'  
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Generation from './pages/Generation/Generation.jsx' 
import Composition from './pages/Planet/Composition.jsx'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
      <BrowserRouter>
       
      <Routes>
        <Route path="/" element={<Generation />} />
        <Route path="/planet" element={<Composition />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
