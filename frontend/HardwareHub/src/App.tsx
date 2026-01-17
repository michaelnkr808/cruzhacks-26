import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import LearningPaths from './pages/LearningPaths';
import Learning from './pages/Learning';
import Lesson from './pages/Lesson';
import Profile from './pages/Profile';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Projects from './pages/Projects';
import ProjectEditor from './pages/ProjectEditor';
import Notes from './pages/Notes';
import './App.css';

/**
 * Main App Component - The "brain" of the application
 * 
 * Key Concepts Here:
 * 
 * 1. BrowserRouter: Enables routing in React
 *    - Without this, clicking links would refresh the whole page
 *    - With it, navigation is instant and smooth (Single Page App!)
 * 
 * 2. Routes & Route: Define which component shows for each URL
 *    - "/" → Home page
 *    - "/learning" → Learning path selection
 *    - "/track/:pathId" → Learning track for a specific hardware platform
 *    - "/lesson/:id" → Individual lesson (":id" is a dynamic parameter)
 *    - "/profile" → User profile
 * 
 * 3. Layout: A wrapper component that shows on every page
 *    - Contains the header/navigation
 *    - Uses <Outlet /> to render child pages
 */

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Signup page - outside Layout (full screen) */}
        <Route path="/signup" element={<Signup />} />

        {/* Login page - outside Layout (full screen) */}
        <Route path="/login" element={<Login />} />

        {/* Project Editor - outside Layout (full screen editor) */}
        <Route path="/project-editor/:id" element={<ProjectEditor />} />

        {/* All other routes wrapped in Layout to get consistent header */}
        <Route path="/" element={<Layout />}>
          {/* Index route - shows when path is exactly "/" */}
          <Route index element={<Home />} />

          {/* Learning path selection page */}
          <Route path="learning" element={<LearningPaths />} />

          {/* Learning track for a specific platform */}
          <Route path="track/:pathId" element={<Learning />} />

          {/* Individual lesson - :id is a parameter (1, 2, 3, etc.) */}
          <Route path="lesson/:id" element={<Lesson />} />

          {/* Projects page */}
          <Route path="projects" element={<Projects />} />

          {/* Notes page */}
          <Route path="notes" element={<Notes />} />

          {/* Profile page */}
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
