import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import InvestigationForm from './components/InvestigationForm'
import CasePage from './pages/Case'

beforeEach(() => {
  window.localStorage.clear()
})

describe('application flow', () => {
  it('renders the form title and inputs', () => {
    render(<InvestigationForm selectedSuspect={null} onSubmit={vi.fn()} />)

    expect(screen.getByText(/selected suspect:/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/investigation conclusion/i)).toBeInTheDocument()
  })

  it('blocks submission when no suspect is selected', () => {
    window.alert = vi.fn()

    render(<InvestigationForm selectedSuspect={null} onSubmit={vi.fn()} />)

    fireEvent.change(screen.getByLabelText(/investigation conclusion/i), {
      target: { value: 'This is a valid conclusion.' }
    })

    fireEvent.click(screen.getByRole('button', { name: /submit investigation/i }))

    expect(window.alert).toHaveBeenCalledWith('An investigation cannot be submitted if no suspect has been selected.')
  })

  it('shows the case management tools for CRUD operations', async () => {
    render(<MemoryRouter><CasePage /></MemoryRouter>)

    expect(await screen.findByText(/case management/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save case/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /delete case/i })).toBeInTheDocument()
  })
})
