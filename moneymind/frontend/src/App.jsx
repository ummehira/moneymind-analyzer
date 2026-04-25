import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LandingPage  from './pages/LandingPage'
import LoginPage    from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard    from './pages/Dashboard'
import Transactions from './pages/Transactions'
import Analytics    from './pages/Analytics'
import BehaviorAI   from './pages/BehaviorAI'
import Predictions  from './pages/Predictions'
import Alerts       from './pages/Alerts'
import Reports      from './pages/Reports'
import Settings     from './pages/Settings'
import Savings from './pages/Savings'

const Spinner = () => (
  <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',background:'var(--navy-900)'}}>
    <div style={{width:40,height:40,border:'3px solid var(--navy-600)',borderTop:'3px solid var(--teal-500)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
  </div>
)

const ProtectedRoute = ({ children }) => {
  const { token, loading } = useAuth()
  if (loading) return <Spinner />
  return token ? children : <Navigate to="/login" replace />
}

const PublicRoute = ({ children }) => {
  const { token, loading } = useAuth()
  if (loading) return <Spinner />
  return token ? <Navigate to="/dashboard" replace /> : children
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login"    element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="dashboard"    element={<Dashboard />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="analytics"    element={<Analytics />} />
        <Route path="behavior"     element={<BehaviorAI />} />
        <Route path="predictions"  element={<Predictions />} />
        <Route path="alerts"       element={<Alerts />} />
        <Route path="reports"      element={<Reports />} />
        <Route path="settings"     element={<Settings />} />
        <Route path="savings" element={<Savings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
