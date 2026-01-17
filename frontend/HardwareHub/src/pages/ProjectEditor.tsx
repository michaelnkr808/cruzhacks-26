import { useParams, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import './ProjectEditor.css';
import { MODULE_ICONS } from '../components/ModuleIcons';

/**
 * Enhanced Project Editor with Module Connections
 * 
 * KEY CONCEPTS:
 * 1. Module Types: Input vs Output
 * 2. Connection System: Inputs can connect to Outputs
 * 3. Visual Feedback: Red = unconnected, Green = connected
 * 4. SVG Lines: Drawing connections between modules
 */

interface Module {
  id: string;
  type: string;
  name: string;
  x: number;
  y: number;
  moduleType: 'input' | 'output'; // NEW: Classify modules
}

interface Connection {
  id: string;
  from: string; // input module id
  to: string;   // output module id
}

// Available IF MAGIC modules with type classification
const AVAILABLE_MODULES = [
  // INPUT MODULES
  { type: 'button', name: 'Button', moduleType: 'input' as const },
  { type: 'slider', name: 'Slider', moduleType: 'input' as const },
  { type: 'dial', name: 'Dial', moduleType: 'input' as const },
  { type: 'joystick', name: 'Joystick', moduleType: 'input' as const },
  { type: 'distance', name: 'Distance', moduleType: 'input' as const },
  { type: 'light', name: 'Light', moduleType: 'input' as const },
  { type: 'color', name: 'Color', moduleType: 'input' as const },
  { type: 'sound', name: 'Sound', moduleType: 'input' as const },
  { type: 'motion', name: 'Motion', moduleType: 'input' as const },
  { type: 'flex', name: 'Flex', moduleType: 'input' as const },
  { type: 'force', name: 'Force', moduleType: 'input' as const },
  { type: 'proximity', name: 'Proximity', moduleType: 'input' as const },
  { type: 'digital', name: 'Digital', moduleType: 'input' as const },
  // OUTPUT MODULES
  { type: 'glow', name: 'Glow LED', moduleType: 'output' as const },
  { type: 'tone', name: 'Tone', moduleType: 'output' as const },
  { type: 'move', name: 'Move', moduleType: 'output' as const },
  { type: 'spin', name: 'Spin', moduleType: 'output' as const },
];

function ProjectEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLDivElement>(null);
  
  const [projectName, setProjectName] = useState('');
  const [modules, setModules] = useState<Module[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedModule, setSelectedModule] = useState<string | null>(null);
  const [draggingModule, setDraggingModule] = useState<string | null>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Load project
  useEffect(() => {
    const projects = JSON.parse(localStorage.getItem('hardwareHubProjects') || '[]');
    const project = projects.find((p: any) => p.id === id);
    if (project) {
      setProjectName(project.name);
      if (project.canvasData) {
        setModules(project.canvasData);
      }
      if (project.connections) {
        setConnections(project.connections);
      }
    } else {
      navigate('/projects');
    }
  }, [id, navigate]);
  
  // Save project
  const saveProject = () => {
    const projects = JSON.parse(localStorage.getItem('hardwareHubProjects') || '[]');
    const projectIndex = projects.findIndex((p: any) => p.id === id);
    if (projectIndex !== -1) {
      projects[projectIndex].canvasData = modules;
      projects[projectIndex].connections = connections;
      projects[projectIndex].modules = modules.map(m => m.type);
      projects[projectIndex].lastModified = new Date().toISOString();
      localStorage.setItem('hardwareHubProjects', JSON.stringify(projects));
      alert('✅ Project saved!');
    }
  };
  
  // Add module to canvas
  const addModuleToCanvas = (moduleType: typeof AVAILABLE_MODULES[0]) => {
    const newModule: Module = {
      id: `${moduleType.type}-${Date.now()}`,
      type: moduleType.type,
      name: moduleType.name,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      moduleType: moduleType.moduleType
    };
    setModules([...modules, newModule]);
  };
  
  // Delete module and its connections
  const deleteModule = (moduleId: string) => {
    setModules(modules.filter(m => m.id !== moduleId));
    setConnections(connections.filter(c => c.from !== moduleId && c.to !== moduleId));
    setSelectedModule(null);
  };
  
  // Handle drag with mouse events (more reliable than drag events)
  const handleMouseDown = (moduleId: string, e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    
    const module = modules.find(m => m.id === moduleId);
    if (!module) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scrollLeft = canvasRef.current.scrollLeft;
    const scrollTop = canvasRef.current.scrollTop;
    
    // Calculate offset from module center
    const moduleX = (module.x / 100) * 3000;
    const moduleY = (module.y / 100) * 2000;
    const clickX = e.clientX - rect.left + scrollLeft;
    const clickY = e.clientY - rect.top + scrollTop;
    
    setDragOffset({
      x: clickX - moduleX,
      y: clickY - moduleY
    });
    setDraggingModule(moduleId);
    e.preventDefault();
  };
  
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingModule || !canvasRef.current) return;
    
    const rect = canvasRef.current.getBoundingClientRect();
    const scrollLeft = canvasRef.current.scrollLeft;
    const scrollTop = canvasRef.current.scrollTop;
    
    // Calculate new position
    const x = ((e.clientX - rect.left + scrollLeft - dragOffset.x) / 3000) * 100;
    const y = ((e.clientY - rect.top + scrollTop - dragOffset.y) / 2000) * 100;
    
    setModules(modules.map(m => 
      m.id === draggingModule ? { 
        ...m, 
        x: Math.max(1, Math.min(99, x)), 
        y: Math.max(1, Math.min(99, y)) 
      } : m
    ));
  };
  
  const handleMouseUp = () => {
    setDraggingModule(null);
  };
  
  // Start connecting
  const startConnection = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module?.moduleType === 'input') {
      setConnectingFrom(moduleId);
    }
  };
  
  // Complete connection
  const completeConnection = (toModuleId: string) => {
    if (!connectingFrom) return;
    
    const toModule = modules.find(m => m.id === toModuleId);
    if (toModule?.moduleType === 'output' && connectingFrom !== toModuleId) {
      // Check if connection already exists
      const exists = connections.some(c => c.from === connectingFrom && c.to === toModuleId);
      if (!exists) {
        const newConnection: Connection = {
          id: `${connectingFrom}-${toModuleId}`,
          from: connectingFrom,
          to: toModuleId
        };
        console.log('Creating connection:', newConnection); // Debug
        setConnections([...connections, newConnection]);
      }
    }
    setConnectingFrom(null);
  };
  
  // Check if output module is connected
  const isConnected = (moduleId: string) => {
    return connections.some(c => c.to === moduleId);
  };
  
  // Get connection lines for SVG - use percentage coordinates
  const getConnectionLine = (connection: Connection) => {
    const fromModule = modules.find(m => m.id === connection.from);
    const toModule = modules.find(m => m.id === connection.to);
    if (!fromModule || !toModule) return null;
    
    // Return percentage-based coordinates (0-100)
    return {
      x1: fromModule.x,
      y1: fromModule.y,
      x2: toModule.x,
      y2: toModule.y
    };
  };
  
  // Delete connection
  const deleteConnection = (connectionId: string) => {
    setConnections(connections.filter(c => c.id !== connectionId));
  };

  return (
    <div className="editor-page">
      {/* Top Toolbar */}
      <div className="editor-toolbar">
        <button className="back-btn" onClick={() => navigate('/projects')}>
          ← Back
        </button>
        <h2 className="project-title-edit">{projectName}</h2>
        <div className="toolbar-actions">
          {connectingFrom && (
            <span className="connecting-indicator">
              ◆ Connecting... (click output module)
            </span>
          )}
          <button className="save-btn" onClick={saveProject}>
            ✓ Save Project
          </button>
        </div>
      </div>
      
      <div className="editor-container">
        {/* Left Sidebar */}
        <div className="module-palette">
          <h3 className="palette-title">Modules</h3>
          <p className="palette-subtitle">Click to add to canvas</p>
          
          <div className="module-category">
            <h4 className="category-title">▶ Inputs</h4>
            <div className="module-list">
              {AVAILABLE_MODULES.filter(m => m.moduleType === 'input').map(module => {
                const IconComponent = MODULE_ICONS[module.type];
                return (
                  <button
                    key={module.type}
                    className="module-item input-module"
                    onClick={() => addModuleToCanvas(module)}
                  >
                    <span className="module-icon">
                      {IconComponent ? <IconComponent size={28} color="#00ff87" /> : null}
                    </span>
                    <span className="module-name">{module.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="module-category">
            <h4 className="category-title">◀ Outputs</h4>
            <div className="module-list">
              {AVAILABLE_MODULES.filter(m => m.moduleType === 'output').map(module => {
                const IconComponent = MODULE_ICONS[module.type];
                return (
                  <button
                    key={module.type}
                    className="module-item output-module"
                    onClick={() => addModuleToCanvas(module)}
                  >
                    <span className="module-icon">
                      {IconComponent ? <IconComponent size={28} color="#ff6b6b" /> : null}
                    </span>
                    <span className="module-name">{module.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          <div className="palette-info">
            <h4>▸ How to Connect:</h4>
            <ul>
              <li>Add input & output modules</li>
              <li>Click input module on canvas</li>
              <li>Click "Connect to Output"</li>
              <li>Click output module</li>
              <li>Output turns green when connected!</li>
            </ul>
          </div>
        </div>
        
        {/* Center Canvas */}
        <div className="canvas-area">
          <div className="canvas-header">
            <h3>Design Canvas</h3>
            <span className="module-count">
              {modules.length} modules • {connections.length} connections
            </span>
          </div>
          
          <div 
            ref={canvasRef}
            className="canvas"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Connection lines */}
            <svg className="connections-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
              {connections.map(conn => {
                const line = getConnectionLine(conn);
                if (!line) return null;
                
                console.log('Drawing connection:', conn.id, line); // Debug
                
                return (
                  <g key={conn.id}>
                    <line
                      x1={`${line.x1}%`}
                      y1={`${line.y1}%`}
                      x2={`${line.x2}%`}
                      y2={`${line.y2}%`}
                      stroke="#00ff87"
                      strokeWidth="0.5"
                      vectorEffect="non-scaling-stroke"
                      strokeLinecap="round"
                      className="connection-line"
                    />
                    <circle
                      cx={`${(line.x1 + line.x2) / 2}%`}
                      cy={`${(line.y1 + line.y2) / 2}%`}
                      r="1"
                      fill="#ff6b6b"
                      vectorEffect="non-scaling-stroke"
                      className="connection-delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteConnection(conn.id);
                      }}
                      style={{ cursor: 'pointer', pointerEvents: 'all' }}
                    />
                  </g>
                );
              })}
            </svg>
            
            {/* Grid background */}
            <div className="canvas-grid"></div>
            
            {/* Modules */}
            {modules.map(module => {
              const connected = module.moduleType === 'output' && isConnected(module.id);
              const IconComponent = MODULE_ICONS[module.type];
              return (
                <div
                  key={module.id}
                  className={`canvas-module ${selectedModule === module.id ? 'selected' : ''} ${
                    module.moduleType === 'output' && !connected ? 'unconnected-output' : ''
                  } ${connected ? 'connected-output' : ''} ${draggingModule === module.id ? 'dragging' : ''}`}
                  style={{ left: `${module.x}%`, top: `${module.y}%` }}
                  onMouseDown={(e) => handleMouseDown(module.id, e)}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (connectingFrom && module.moduleType === 'output') {
                      completeConnection(module.id);
                    } else {
                      setSelectedModule(module.id);
                      setConnectingFrom(null);
                    }
                  }}
                >
                  <div className="module-visual">
                    <span className="module-type-badge">
                      {module.moduleType === 'input' ? '▶' : '◀'}
                    </span>
                    <span className="module-visual-icon">
                      {IconComponent && (
                        <IconComponent 
                          size={48} 
                          color={connected ? '#00ff87' : module.moduleType === 'output' ? '#ff6b6b' : '#00ff87'} 
                        />
                      )}
                    </span>
                    <span className="module-visual-name">{module.name}</span>
                  </div>
                  {selectedModule === module.id && (
                    <button 
                      className="delete-module-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteModule(module.id);
                      }}
                    >
                      ×
                    </button>
                  )}
                </div>
              );
            })}
            
            {modules.length === 0 && (
              <div className="canvas-empty">
                <p>← Click modules on the left to add them</p>
                <p>Drag to position • Connect inputs to outputs</p>
                <p>Scroll to expand the canvas area</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Panel */}
        <div className="properties-panel">
          <h3 className="panel-title">⚙ Properties</h3>
          
          {selectedModule ? (
            <div className="property-content">
              {(() => {
                const module = modules.find(m => m.id === selectedModule);
                const IconComponent = MODULE_ICONS[module?.type || ''];
                return module ? (
                  <>
                    <div className="property-header">
                      <span className="property-icon">
                        {IconComponent && (
                          <IconComponent 
                            size={40} 
                            color={module.moduleType === 'output' && isConnected(module.id) ? '#00ff87' : module.moduleType === 'output' ? '#ff6b6b' : '#00ff87'} 
                          />
                        )}
                      </span>
                      <div>
                        <div className="property-name">{module.name}</div>
                        <div className="property-type">
                          {module.moduleType === 'input' ? '▶ Input' : '◀ Output'}
                        </div>
                      </div>
                    </div>
                    
                    {module.moduleType === 'input' && (
                      <button 
                        className="connect-btn"
                        onClick={() => startConnection(module.id)}
                      >
                        ◆ Connect to Output
                      </button>
                    )}
                    
                    {module.moduleType === 'output' && (
                      <div className="connection-status">
                        <span className={`status-indicator ${isConnected(module.id) ? 'connected' : 'disconnected'}`}>
                          {isConnected(module.id) ? '✓ Connected' : '✗ Not Connected'}
                        </span>
                      </div>
                    )}
                    
                    <div className="property-divider"></div>
                    
                    <div className="property-group">
                      <label>Position</label>
                      <input type="text" value={`X: ${module.x.toFixed(1)}%, Y: ${module.y.toFixed(1)}%`} readOnly />
                    </div>
                    
                    <button 
                      className="delete-btn-full"
                      onClick={() => deleteModule(module.id)}
                    >
                      × Delete Module
                    </button>
                  </>
                ) : null;
              })()}
            </div>
          ) : (
            <div className="property-empty">
              <p>Select a module to view properties</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectEditor;
