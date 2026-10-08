import { Navigate, useLocation } from 'react-router'
import { getStoredUser } from '../services/authServiceApi'

function ProtectedRoute({ children }) {
  const location = useLocation()
  const user = getStoredUser()

  if (!user?.userId || !user?.email) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}

export default ProtectedRoute
