import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import CasePage from './pages/Case'
import SuspectsPage from './pages/Suspects'
import EvidencePage from './pages/Evidence'
import InvestigationPage from './pages/Investigation'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/case' element={<CasePage />} />
        <Route path='/suspects' element={<SuspectsPage />} />
        <Route path='/evidence' element={<EvidencePage />} />
        <Route path='/investigation' element={<InvestigationPage />} />
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
