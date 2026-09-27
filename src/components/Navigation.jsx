import { NavLink } from 'react-router'

function Navigation() {
  const navItems = [
    { to: '/', label: 'Home' },
    { to: '/case', label: 'Case' },
    { to: '/suspects', label: 'Suspects' },
    { to: '/evidence', label: 'Evidence' },
    { to: '/investigation', label: 'Investigation' },
  ]

  return (
    <nav className="site-navigation" aria-label="Main application navigation">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}

export default Navigation
