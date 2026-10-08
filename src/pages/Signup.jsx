import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import Navigation from '../components/Navigation'
import { signupUser, storeUserSession } from '../services/authServiceApi'

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSuccess('')

    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Username, email, and password are required.')
      return
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await signupUser({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password
      })

      storeUserSession({
        userId: result.userId,
        username: result.username,
        email: result.email,
        token: result.token
      })

      setSuccess('Account created successfully. Redirecting to home...')
      setTimeout(() => {
        navigate('/')
      }, 500)
    } catch (submitError) {
      setError(submitError.message || 'Signup could not be completed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="page-shell">
      <Navigation />

      <section className="content-panel auth-panel">
        <div className="auth-header">
          <p className="eyebrow">New investigator</p>
          <h1>Signup</h1>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Username
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Choose a username"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter email address"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Create password"
            />
          </label>

          {error && <p className="auth-message error">{error}</p>}
          {success && <p className="auth-message success">{success}</p>}

          <button className="submit-button" type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
    </main>
  )
}

export default Signup
