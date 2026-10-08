import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './pages/Home'
import CasePage from './pages/Case'
import SuspectsPage from './pages/Suspects'
import EvidencePage from './pages/Evidence'
import InvestigationPage from './pages/Investigation'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/case' element={<ProtectedRoute><CasePage /></ProtectedRoute>} />
        <Route path='/suspects' element={<ProtectedRoute><SuspectsPage /></ProtectedRoute>} />
        <Route path='/evidence' element={<ProtectedRoute><EvidencePage /></ProtectedRoute>} />
        <Route path='/investigation' element={<ProtectedRoute><InvestigationPage /></ProtectedRoute>} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
