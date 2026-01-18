import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Auth0Provider } from '@auth0/auth0-react'
import { AuthProvider } from './hooks/useAuth'
import './index.css'
import App from './App.tsx'

const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID
const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE

// Auth0 requires HTTPS (except localhost). For network access, we skip Auth0.
const isSecureOrigin = window.location.protocol === 'https:' || 
                       window.location.hostname === 'localhost' || 
                       window.location.hostname === '127.0.0.1'

// Wrapper that either uses Auth0 or provides a mock context
const AppWithAuth = () => {
  if (isSecureOrigin) {
    return (
      <Auth0Provider
        domain={auth0Domain}
        clientId={auth0ClientId}
        authorizationParams={{
          redirect_uri: window.location.origin,
          audience: auth0Audience,
        }}
        cacheLocation="localstorage"
      >
        <AuthProvider>
          <App />
        </AuthProvider>
      </Auth0Provider>
    )
  }
  
  // For non-secure origins (like network IP), skip Auth0
  // The app will work but login/signup won't be available
  return (
    <AuthProvider skipAuth0={true}>
      <App />
    </AuthProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppWithAuth />
  </StrictMode>,
)
