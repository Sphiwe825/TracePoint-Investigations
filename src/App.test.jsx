import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import InvestigationForm from './components/InvestigationForm'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import CasePage from './pages/Case'
import EvidencePage from './pages/Evidence'
import Home from './pages/Home'
import InvestigationPage from './pages/Investigation'
import LoginPage from './pages/Login'
import SignupPage from './pages/Signup'
import SuspectsPage from './pages/Suspects'

const api = vi.hoisted(() => ({
  getCase: vi.fn(),
  saveCase: vi.fn(),
  updateCase: vi.fn(),
  deleteCase: vi.fn(),
  getSuspects: vi.fn(),
  saveSuspect: vi.fn(),
  updateSuspect: vi.fn(),
  deleteSuspect: vi.fn(),
  getEvidence: vi.fn(),
  saveEvidence: vi.fn(),
  updateEvidence: vi.fn(),
  deleteEvidence: vi.fn(),
  saveInvestigation: vi.fn(),
  loginUser: vi.fn(),
  signupUser: vi.fn(),
  storeUserSession: vi.fn(),
  getStoredUser: vi.fn()
}))

vi.mock('./services/caseServiceApi', () => ({
  getCase: api.getCase,
  saveCase: api.saveCase,
  updateCase: api.updateCase,
  deleteCase: api.deleteCase
}))

vi.mock('./services/suspectServiceApi', () => ({
  getSuspects: api.getSuspects,
  saveSuspect: api.saveSuspect,
  updateSuspect: api.updateSuspect,
  deleteSuspect: api.deleteSuspect
}))

vi.mock('./services/evidenceServiceApi', () => ({
  getEvidence: api.getEvidence,
  saveEvidence: api.saveEvidence,
  updateEvidence: api.updateEvidence,
  deleteEvidence: api.deleteEvidence
}))

vi.mock('./services/investigationServiceApi', () => ({
  saveInvestigation: api.saveInvestigation
}))

vi.mock('./services/authServiceApi', () => ({
  loginUser: api.loginUser,
  signupUser: api.signupUser,
  storeUserSession: api.storeUserSession,
  getStoredUser: api.getStoredUser,
  clearUserSession: vi.fn()
}))

const caseItem = {
  id: 10,
  name: 'The Missing Prototype',
  description: 'A prototype disappeared from the research laboratory.',
  status: 'OPEN'
}

const suspect = {
  id: 2,
  name: 'Jamie Smith',
  occupation: 'Security Officer',
  description: 'Responsible for building security.'
}

const evidence = {
  id: 3,
  title: 'Security Access Log',
  location: 'Security Office',
  description: 'Jamie Smith entered the laboratory at 23:41.'
}

function renderInRouter(element) {
  return render(<MemoryRouter>{element}</MemoryRouter>)
}

beforeEach(() => {
  window.localStorage.clear()
  vi.clearAllMocks()
  api.getStoredUser.mockReturnValue(null)

  api.getCase.mockResolvedValue(caseItem)
  api.saveCase.mockResolvedValue({})
  api.updateCase.mockResolvedValue({})
  api.deleteCase.mockResolvedValue({})

  api.getSuspects.mockResolvedValue([suspect])
  api.saveSuspect.mockResolvedValue({})
  api.updateSuspect.mockResolvedValue({})
  api.deleteSuspect.mockResolvedValue({})

  api.getEvidence.mockResolvedValue([evidence])
  api.saveEvidence.mockResolvedValue({})
  api.updateEvidence.mockResolvedValue({})
  api.deleteEvidence.mockResolvedValue({})

  api.saveInvestigation.mockResolvedValue({ success: true })
  api.loginUser.mockResolvedValue({
    userId: 5,
    username: 'investigator',
    email: 'investigator@example.com'
  })
  api.signupUser.mockResolvedValue({
    userId: 5,
    username: 'investigator',
    email: 'investigator@example.com'
  })
})

afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('Investigation form', () => {
  it('renders the selected suspect and conclusion field', () => {
    render(<InvestigationForm selectedSuspect={suspect} onSubmit={vi.fn()} />)

    expect(screen.getByText(/selected suspect:/i).parentElement).toHaveTextContent(suspect.name)
    expect(screen.getByLabelText(/investigation conclusion/i)).toBeInTheDocument()
  })

  it('blocks submission when no suspect is selected', () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const onSubmit = vi.fn()
    render(<InvestigationForm selectedSuspect={null} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/investigation conclusion/i), {
      target: { value: 'Evidence supports the suspect.' }
    })
    fireEvent.click(screen.getByRole('button', { name: /submit investigation/i }))

    expect(alert).toHaveBeenCalledWith('An investigation cannot be submitted if no suspect has been selected.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('blocks submission when the conclusion is empty', () => {
    const alert = vi.spyOn(window, 'alert').mockImplementation(() => {})
    const onSubmit = vi.fn()
    render(<InvestigationForm selectedSuspect={suspect} onSubmit={onSubmit} />)

    fireEvent.click(screen.getByRole('button', { name: /submit investigation/i }))

    expect(alert).toHaveBeenCalledWith('An investigation cannot be submitted if the conclusion is empty.')
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('submits a selected suspect and a non-empty conclusion', () => {
    const onSubmit = vi.fn()
    render(<InvestigationForm selectedSuspect={suspect} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/investigation conclusion/i), {
      target: { value: 'Jamie had access to the laboratory.' }
    })
    fireEvent.click(screen.getByRole('button', { name: /submit investigation/i }))

    expect(onSubmit).toHaveBeenCalledWith({
      suspect,
      conclusion: 'Jamie had access to the laboratory.'
    })
    expect(screen.getByLabelText(/investigation conclusion/i)).toHaveValue('')
  })
})

describe('Case page', () => {
  it('loads and displays the case information and management controls', async () => {
    renderInRouter(<CasePage />)

    expect(await screen.findByRole('heading', { level: 2, name: caseItem.name })).toBeInTheDocument()
    expect(screen.getByText(`Status: ${caseItem.status}`)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save case/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /update case/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete case/i })).toBeInTheDocument()
  })

  it('saves a populated case form', async () => {
    renderInRouter(<CasePage />)

    fireEvent.change(await screen.findByLabelText(/case name/i), {
      target: { value: 'Updated Prototype Case' }
    })
    fireEvent.click(screen.getByRole('button', { name: /save case/i }))

    await waitFor(() => expect(api.saveCase).toHaveBeenCalledWith({
      caseName: 'Updated Prototype Case',
      description: caseItem.description,
      status: caseItem.status
    }))
    expect(await screen.findByText(/case saved successfully/i)).toBeInTheDocument()
  })

  it('updates and deletes the loaded case', async () => {
    renderInRouter(<CasePage />)

    await screen.findByRole('heading', { level: 2, name: caseItem.name })
    fireEvent.click(screen.getByRole('button', { name: /update case/i }))
    await waitFor(() => expect(api.updateCase).toHaveBeenCalledWith(caseItem.id, {
      caseName: caseItem.name,
      description: caseItem.description,
      status: caseItem.status
    }))

    fireEvent.click(screen.getByRole('button', { name: /delete case/i }))
    await waitFor(() => expect(api.deleteCase).toHaveBeenCalledWith(caseItem.id))
    expect(await screen.findByRole('heading', { level: 1, name: /case management/i })).toBeInTheDocument()
  })

  it('does not save an incomplete case form', async () => {
    api.getCase.mockResolvedValueOnce(null)
    renderInRouter(<CasePage />)

    fireEvent.click(await screen.findByRole('button', { name: /save case/i }))

    expect(api.saveCase).not.toHaveBeenCalled()
  })
})

describe('Navigation', () => {
  it('toggles the mobile navigation menu open and closed', () => {
    renderInRouter(<Navigation />)

    const menuToggle = screen.getByRole('button', { name: /open navigation menu/i })
    expect(menuToggle).toHaveAttribute('aria-expanded', 'false')

    fireEvent.click(menuToggle)
    expect(screen.getByRole('button', { name: /close navigation menu/i })).toHaveAttribute('aria-expanded', 'true')

    fireEvent.click(screen.getByRole('button', { name: /close navigation menu/i }))
    expect(screen.getByRole('button', { name: /open navigation menu/i })).toHaveAttribute('aria-expanded', 'false')
  })
})

describe('Protected routes', () => {
  function LoginDestination() {
    const location = useLocation()
    return <h1>Login required for {location.state?.from?.pathname}</h1>
  }

  function renderProtectedRoute(path = '/case') {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route
            path="/case"
            element={<ProtectedRoute><h1>Protected case</h1></ProtectedRoute>}
          />
          <Route path="/login" element={<LoginDestination />} />
        </Routes>
      </MemoryRouter>
    )
  }

  it('redirects signed-out visitors to login and remembers the requested page', async () => {
    renderProtectedRoute()

    expect(await screen.findByRole('heading', { name: 'Login required for /case' })).toBeInTheDocument()
    expect(api.getStoredUser).toHaveBeenCalled()
  })

  it('allows a signed-in user to view a protected page', () => {
    api.getStoredUser.mockReturnValue({
      userId: 5,
      email: 'investigator@example.com'
    })

    renderProtectedRoute()

    expect(screen.getByRole('heading', { name: 'Protected case' })).toBeInTheDocument()
  })
})

describe('Suspects page', () => {
  it('loads suspect cards and shows a selected suspect', async () => {
    renderInRouter(<SuspectsPage />)

    expect(await screen.findByRole('heading', { name: suspect.name })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /select suspect/i }))

    expect(screen.getByText('Selected suspect')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /select suspect/i })).toHaveAttribute('href', '/investigation')
  })

  it('saves a valid suspect', async () => {
    renderInRouter(<SuspectsPage />)

    fireEvent.change(screen.getByLabelText(/^name$/i), { target: { value: 'Alex Morgan' } })
    fireEvent.change(screen.getByLabelText(/occupation/i), { target: { value: 'Developer' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Developed the prototype.' } })
    fireEvent.click(screen.getByRole('button', { name: /save suspect/i }))

    await waitFor(() => expect(api.saveSuspect).toHaveBeenCalledWith({
      name: 'Alex Morgan',
      occupation: 'Developer',
      description: 'Developed the prototype.'
    }))
  })

  it('does not save an incomplete suspect form', async () => {
    renderInRouter(<SuspectsPage />)

    fireEvent.click(await screen.findByRole('button', { name: /save suspect/i }))

    expect(api.saveSuspect).not.toHaveBeenCalled()
  })

  it('updates and deletes a selected suspect', async () => {
    renderInRouter(<SuspectsPage />)

    await screen.findByRole('heading', { name: suspect.name })
    fireEvent.click(screen.getByRole('button', { name: /select suspect/i }))
    fireEvent.change(screen.getByLabelText(/occupation/i), { target: { value: 'Senior Security Officer' } })
    fireEvent.click(screen.getByRole('button', { name: /update suspect/i }))

    await waitFor(() => expect(api.updateSuspect).toHaveBeenCalledWith(suspect.id, {
      name: suspect.name,
      occupation: 'Senior Security Officer',
      description: suspect.description
    }))

    fireEvent.click(screen.getByRole('button', { name: /select suspect/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete suspect/i }))
    await waitFor(() => expect(api.deleteSuspect).toHaveBeenCalledWith(suspect.id))
  })
})

describe('Evidence page', () => {
  it('loads evidence and displays the examined item details', async () => {
    renderInRouter(<EvidencePage />)

    expect(await screen.findByRole('heading', { name: evidence.title })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /examine evidence/i }))

    const examinedEvidence = document.querySelector('.selected-evidence-box')
    expect(within(examinedEvidence).getByText(`Location: ${evidence.location}`)).toBeInTheDocument()
    expect(within(examinedEvidence).getByText(evidence.description)).toBeInTheDocument()
  })

  it('saves a valid evidence item', async () => {
    renderInRouter(<EvidencePage />)

    fireEvent.change(screen.getByLabelText(/title/i), { target: { value: 'Fingerprint Report' } })
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Laboratory' } })
    fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'Partial print on cabinet.' } })
    fireEvent.click(screen.getByRole('button', { name: /save evidence/i }))

    await waitFor(() => expect(api.saveEvidence).toHaveBeenCalledWith({
      title: 'Fingerprint Report',
      location: 'Laboratory',
      description: 'Partial print on cabinet.'
    }))
  })

  it('does not save an incomplete evidence form', async () => {
    renderInRouter(<EvidencePage />)

    fireEvent.click(await screen.findByRole('button', { name: /save evidence/i }))

    expect(api.saveEvidence).not.toHaveBeenCalled()
  })

  it('updates and deletes selected evidence', async () => {
    renderInRouter(<EvidencePage />)

    await screen.findByRole('heading', { name: evidence.title })
    fireEvent.click(screen.getByRole('button', { name: /examine evidence/i }))
    fireEvent.change(screen.getByLabelText(/location/i), { target: { value: 'Archive Room' } })
    fireEvent.click(screen.getByRole('button', { name: /update evidence/i }))

    await waitFor(() => expect(api.updateEvidence).toHaveBeenCalledWith(evidence.id, {
      title: evidence.title,
      location: 'Archive Room',
      description: evidence.description
    }))

    fireEvent.click(screen.getByRole('button', { name: /examine evidence/i }))
    fireEvent.click(screen.getByRole('button', { name: /delete evidence/i }))
    await waitFor(() => expect(api.deleteEvidence).toHaveBeenCalledWith(evidence.id))
  })
})

describe('Investigation workflow', () => {
  it('loads dashboard status, evidence count, and suspect count', async () => {
    renderInRouter(<Home />)

    expect(await screen.findByText(caseItem.status)).toBeInTheDocument()
    expect(screen.getByText('1 Items')).toBeInTheDocument()
    expect(screen.getByText('1 Profiles')).toBeInTheDocument()
  })

  it('submits a valid investigation and displays success confirmation', async () => {
    renderInRouter(<InvestigationPage />)

    fireEvent.change(await screen.findByLabelText(/investigation conclusion/i), {
      target: { value: 'Jamie had access at the time of the incident.' }
    })
    fireEvent.click(screen.getByRole('button', { name: /submit investigation/i }))

    await waitFor(() => expect(api.saveInvestigation).toHaveBeenCalledWith({
      caseId: caseItem.id,
      suspectId: suspect.id,
      conclusion: 'Jamie had access at the time of the incident.'
    }))
    expect(await screen.findByRole('heading', { name: /investigation submitted successfully/i })).toBeInTheDocument()
  })

  it('displays an error when the investigation API request fails', async () => {
    api.saveInvestigation.mockRejectedValueOnce(new Error('The API is unavailable.'))
    renderInRouter(<InvestigationPage />)

    fireEvent.change(await screen.findByLabelText(/investigation conclusion/i), {
      target: { value: 'Evidence supports this conclusion.' }
    })
    fireEvent.click(screen.getByRole('button', { name: /submit investigation/i }))

    expect(await screen.findByText('The API is unavailable.')).toBeInTheDocument()
  })
})

describe('Authentication pages', () => {
  it('submits email and password for login and stores the returned user', async () => {
    renderInRouter(<LoginPage />)

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'investigator@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'secret123' }
    })
    fireEvent.click(screen.getByRole('button', { name: /^login$/i }))

    await waitFor(() => expect(api.loginUser).toHaveBeenCalledWith({
      email: 'investigator@example.com',
      password: 'secret123'
    }))
    expect(api.storeUserSession).toHaveBeenCalledWith({
      userId: 5,
      username: 'investigator',
      email: 'investigator@example.com',
      token: undefined
    })
  })

  it('requires login credentials', async () => {
    renderInRouter(<LoginPage />)

    fireEvent.click(screen.getByRole('button', { name: /^login$/i }))

    expect(await screen.findByText('Email and password are both required.')).toBeInTheDocument()
    expect(api.loginUser).not.toHaveBeenCalled()
  })

  it('requires signup fields and a minimum password length', async () => {
    renderInRouter(<SignupPage />)

    fireEvent.click(screen.getByRole('button', { name: /create account/i }))
    expect(await screen.findByText('Username, email, and password are required.')).toBeInTheDocument()

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'investigator' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'investigator@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'short' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    expect(await screen.findByText('Password must be at least 6 characters long.')).toBeInTheDocument()
    expect(api.signupUser).not.toHaveBeenCalled()
  })

  it('submits signup details and stores the created account', async () => {
    renderInRouter(<SignupPage />)

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'investigator' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'investigator@example.com' } })
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'secret123' } })
    fireEvent.click(screen.getByRole('button', { name: /create account/i }))

    await waitFor(() => expect(api.signupUser).toHaveBeenCalledWith({
      username: 'investigator',
      email: 'investigator@example.com',
      password: 'secret123'
    }))
    expect(api.storeUserSession).toHaveBeenCalledWith({
      userId: 5,
      username: 'investigator',
      email: 'investigator@example.com',
      token: undefined
    })
    expect(await screen.findByText(/account created successfully/i)).toBeInTheDocument()
  })
})
