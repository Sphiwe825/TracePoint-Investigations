import { useEffect, useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router'
import { clearUserSession, getStoredUser } from '../services/authServiceApi'

function Navigation() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  const navItems = useMemo(
    () => [
      { to: '/', label: 'Home' },
      { to: '/case', label: 'Case' },
      { to: '/suspects', label: 'Suspects' },
      { to: '/evidence', label: 'Evidence' },
      { to: '/investigation', label: 'Investigation' },
    ],
    []
  )

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 700) {
        setMenuOpen(false)
      }
    }

    const syncUser = () => setCurrentUser(getStoredUser())
    syncUser()
    window.addEventListener('resize', handleResize)
    window.addEventListener('storage', syncUser)

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('storage', syncUser)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const handleLogout = () => {
    clearUserSession()
    setCurrentUser(null)
    closeMenu()
    window.location.href = '/'
  }

  return (
    <nav className="site-navigation" aria-label="Main application navigation">
      <button
        type="button"
        className={`nav-toggle ${menuOpen ? 'open' : ''}`}
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((previous) => !previous)}
      >
        <span />
        <span />
        <span />
      </button>

      <div id="primary-navigation" className={`nav-links ${menuOpen ? 'open' : ''}`}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={closeMenu}
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            {item.label}
          </NavLink>
        ))}

        {currentUser ? (
          <>
            <span className="nav-user">Hi, {currentUser.username}</span>
            <button type="button" className="nav-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" onClick={closeMenu} className="nav-link auth-link">Login</Link>
            <Link to="/signup" onClick={closeMenu} className="nav-link auth-link">Signup</Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navigation
