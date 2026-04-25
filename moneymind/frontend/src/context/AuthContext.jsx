import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [token, setToken]     = useState(() => sessionStorage.getItem('mm_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`
      api.get('/auth/me')
        .then(r => setUser(r.data.user))
        .catch(() => {
          sessionStorage.removeItem('mm_token')
          setToken(null)
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [token])

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password })
    // sessionStorage clears automatically when browser tab is closed
    sessionStorage.setItem('mm_token', data.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const register = async (name, email, password, currency = 'PKR') => {
    const { data } = await api.post('/auth/register', { name, email, password, currency })
    sessionStorage.setItem('mm_token', data.token)
    api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    sessionStorage.removeItem('mm_token')
    delete api.defaults.headers.common['Authorization']
    setToken(null)
    setUser(null)
  }

  const updateCurrency = async (currency) => {
    const { data } = await api.patch('/auth/currency', { currency })
    setUser(data.user)
    return data.user
  }

  const currency = user?.currency || 'PKR'

  const formatAmount = (amount) => {
    const num = Number(amount) || 0
    const symbols = { PKR: 'Rs.', USD: '$', EUR: '€', GBP: '£', AED: 'AED', SAR: 'SAR', INR: '₹' }
    const sym = symbols[currency] || currency
    return `${sym} ${num.toLocaleString('en-PK', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateCurrency, currency, formatAmount }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}