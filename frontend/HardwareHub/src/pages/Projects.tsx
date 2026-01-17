import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Projects.css';

/**
 * Projects Page - List and Create Projects
 * 
 * LEARNING CONCEPT: CRUD Operations
 * Create, Read, Update, Delete - the foundation of most apps!
 * 
 * We're storing projects in localStorage for now.
 * In production, this would be a database with API calls.
 */

interface Project {
  id: string;
  name: string;
  description: string;
  modules: string[];
  createdAt: string;
  lastModified: string;
}

function Projects() {
  // Load projects from localStorage
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('hardwareHubProjects');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');
  
  const handleCreateProject = () => {
    if (!newProjectName.trim()) return;
    
    const newProject: Project = {
      id: Date.now().toString(),
      name: newProjectName,
      description: newProjectDesc,
      modules: [],
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };
    
    const updatedProjects = [...projects, newProject];
    setProjects(updatedProjects);
    localStorage.setItem('hardwareHubProjects', JSON.stringify(updatedProjects));
    
    // Reset form
    setNewProjectName('');
    setNewProjectDesc('');
    setShowCreateModal(false);
  };
  
  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    setProjects(updatedProjects);
    localStorage.setItem('hardwareHubProjects', JSON.stringify(updatedProjects));
  };

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div className="header-content">
          <h1 className="page-title">
            <span className="title-icon">▣</span>
            Your Projects
          </h1>
          <p className="page-subtitle">
            Design and wireframe your IF MAGIC hardware projects
          </p>
        </div>
        <button 
          className="create-project-btn"
          onClick={() => setShowCreateModal(true)}
        >
          <span className="btn-icon">+</span>
          New Project
        </button>
      </div>

      {projects.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">◇</div>
          <h2>No Projects Yet</h2>
          <p>Create your first project to start designing with IF MAGIC modules!</p>
          <button 
            className="cta-button"
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Project
          </button>
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card">
              <div className="project-card-header">
                <h3 className="project-name">{project.name}</h3>
                <button 
                  className="delete-btn"
                  onClick={() => handleDeleteProject(project.id)}
                  title="Delete project"
                >
                  ×
                </button>
              </div>
              <p className="project-description">
                {project.description || 'No description'}
              </p>
              <div className="project-meta">
                <span className="module-count">
                  ▣ {project.modules.length} modules
                </span>
                <span className="last-modified">
                  ◷ {new Date(project.lastModified).toLocaleDateString()}
                </span>
              </div>
              <Link 
                to={`/project-editor/${project.id}`}
                className="open-project-btn"
              >
                Open Editor →
              </Link>
            </div>
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="modal-overlay" onClick={() => setShowCreateModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Create New Project</h2>
            
            <div className="form-group">
              <label>Project Name</label>
              <input
                type="text"
                placeholder="My Awesome Project"
                value={newProjectName}
                onChange={e => setNewProjectName(e.target.value)}
                autoFocus
              />
            </div>
            
            <div className="form-group">
              <label>Description (Optional)</label>
              <textarea
                placeholder="Describe what your project will do..."
                value={newProjectDesc}
                onChange={e => setNewProjectDesc(e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowCreateModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleCreateProject}
                disabled={!newProjectName.trim()}
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Projects;
