const AUTH_STORAGE_KEY = 'tracepoint-user'

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function storeUserSession(user) {
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user))
}

export function clearUserSession() {
  localStorage.removeItem(AUTH_STORAGE_KEY)
}

export async function loginUser(payload) {
  const response = await fetch('/api/user/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: payload.email ?? payload.username,
      password: payload.password
    })
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Login failed.')
  }

  return data
}

export async function signupUser(payload) {
  const response = await fetch('/api/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Signup failed.')
  }

  return data
}
