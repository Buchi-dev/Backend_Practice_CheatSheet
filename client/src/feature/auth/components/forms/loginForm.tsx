import React, { useState } from 'react'
import userService from '../../../../core/services/user.Service'

const loginForm = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [currentUser, setCurrentUser] = useState<any>(null)


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await userService.login({ email, password })
      const profile = await userService.getProfile()
      setCurrentUser(profile.data)
    } catch (error: any) {
      setError(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  // Helper function to format full name
  const getFullName = () => {
    if (!currentUser) return '';
    const { firstName, lastName, middleInitial } = currentUser;
    return middleInitial 
      ? `${firstName} ${middleInitial}. ${lastName}`
      : `${firstName} ${lastName}`;
  }


  return (
    <div>
        <form onSubmit={handleSubmit}>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
            />
            <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
            </button>
            {error && <div style={{ color: 'red' }}>{error}</div>}
        </form>
        <div>
            <p>Don't have an account? <a href="/register">Register here</a></p>
        </div>
        
        {currentUser && (
          <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h2>Welcome, {getFullName()}!</h2>
            <div style={{ marginTop: '1rem' }}>
              <p><strong>Email:</strong> {currentUser.email}</p>
              <p><strong>Age:</strong> {currentUser.age}</p>
              <p><strong>Gender:</strong> {currentUser.gender}</p>
              <p><strong>Role:</strong> {currentUser.role}</p>
              <p><strong>Account Created:</strong> {new Date(currentUser.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        )}
    </div>
    
  )
}

export default loginForm