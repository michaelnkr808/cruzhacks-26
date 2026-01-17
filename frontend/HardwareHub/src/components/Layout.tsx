import { Link, Outlet, useLocation } from 'react-router-dom';
import './Layout.css';

/**
 * Layout Component - This is a "wrapper" component that appears on every page.
 * Think of it as the frame of a house - it stays the same while the rooms (pages) change.
 * 
 * Key Concepts:
 * - <Link>: React Router's way to navigate without page reload (faster!)
 * - <Outlet>: A "slot" where child pages will render
 * - useLocation(): Hook to know which page we're on (for styling active tab)
 */
function Layout() {
  const location = useLocation();
  
  // Helper function to check if a link is active
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="layout">
      {/* Header with navigation */}
      <header className="header">
        <div className="header-content">
          {/* Left side - Logo/Title */}
          <div className="header-left">
            <Link to="/" className="logo">
              <span className="logo-icon">◆</span>
              <span className="logo-text">HardwareHub</span>
            </Link>
          </div>

          {/* Center - Main Navigation */}
          <nav className="nav-center">
            <Link 
              to="/" 
              className={`nav-link ${isActive('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/learning" 
              className={`nav-link ${isActive('/learning') || location.pathname.startsWith('/lesson') ? 'active' : ''}`}
            >
              Learning
            </Link>
            <Link 
              to="/projects" 
              className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
            >
              Projects
            </Link>
            <Link 
              to="/notes" 
              className={`nav-link ${isActive('/notes') ? 'active' : ''}`}
            >
              Notes
            </Link>
            <Link 
              to="/about" 
              className={`nav-link ${isActive('/about') ? 'active' : ''}`}
            >
              About
            </Link>
          </nav>

          {/* Right side - Profile */}
          <div className="header-right">
            <Link to="/profile" className="profile-button">
              <div className="avatar">
                <span>👤</span>
              </div>
              <span className="profile-text">Profile</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content area - this is where pages render */}
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
