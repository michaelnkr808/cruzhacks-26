import { Link } from 'react-router-dom';
import './LearningPaths.css';

/**
 * Learning Paths Page - Select your hardware platform
 * 
 * Shows different learning tracks for various hardware platforms:
 * - ESP32
 * - Arduino
 * - Raspberry Pi Pico
 * - STM32
 * - IF MAGIC (default)
 */

interface LearningPath {
  id: string;
  name: string;
  description: string;
  icon: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  lessonCount: number;
  comingSoon?: boolean;
}

const learningPaths: LearningPath[] = [
  {
    id: 'ifmagic',
    name: 'IF MAGIC',
    description: 'Modular hardware platform perfect for beginners. Plug-and-play modules with no soldering required.',
    icon: '◆',
    difficulty: 'Beginner',
    lessonCount: 27,
    comingSoon: false,
  },
  {
    id: 'esp32',
    name: 'ESP32',
    description: 'Powerful WiFi & Bluetooth microcontroller. Perfect for IoT projects and wireless communication.',
    icon: '▣',
    difficulty: 'Intermediate',
    lessonCount: 24,
    comingSoon: true,
  },
  {
    id: 'arduino',
    name: 'Arduino',
    description: 'The classic microcontroller platform. Great for learning electronics fundamentals and prototyping.',
    icon: '◈',
    difficulty: 'Beginner',
    lessonCount: 30,
    comingSoon: true,
  },
  {
    id: 'raspberrypi',
    name: 'Raspberry Pi Pico',
    description: 'Affordable and versatile RP2040 microcontroller. Dual-core ARM Cortex-M0+ with PIO support.',
    icon: '◉',
    difficulty: 'Intermediate',
    lessonCount: 22,
    comingSoon: true,
  },
  {
    id: 'stm32',
    name: 'STM32',
    description: 'Professional ARM Cortex-M microcontrollers. Industry-standard platform for advanced projects.',
    icon: '▲',
    difficulty: 'Advanced',
    lessonCount: 28,
    comingSoon: true,
  },
];

function LearningPaths() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return '#48bb78';
      case 'Intermediate': return '#ed8936';
      case 'Advanced': return '#667eea';
      default: return '#718096';
    }
  };

  return (
    <div className="learning-paths">
      <div className="paths-header">
        <h1 className="page-title">Choose Your Learning Path</h1>
        <p className="page-subtitle">
          Select a hardware platform to start your embedded programming journey. 
          Each path is tailored to the specific hardware and its capabilities.
        </p>
      </div>

      <div className="paths-grid">
        {learningPaths.map((path) => (
          <div key={path.id} className={`path-card ${path.comingSoon ? 'coming-soon' : ''}`}>
            {path.comingSoon && (
              <div className="coming-soon-badge">Coming Soon</div>
            )}
            
            <div className="path-icon">{path.icon}</div>
            
            <h2 className="path-name">{path.name}</h2>
            
            <p className="path-description">{path.description}</p>
            
            <div className="path-meta">
              <div className="path-difficulty" style={{ borderColor: getDifficultyColor(path.difficulty) }}>
                <span style={{ color: getDifficultyColor(path.difficulty) }}>
                  {path.difficulty}
                </span>
              </div>
              <div className="path-lessons">
                {path.lessonCount} Lessons
              </div>
            </div>
            
            {!path.comingSoon ? (
              <Link to={`/track/${path.id}`} className="path-button">
                Start Learning
                <span className="arrow">→</span>
              </Link>
            ) : (
              <button className="path-button disabled" disabled>
                Coming Soon
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="paths-footer">
        <div className="footer-card">
          <h3>▸ Not Sure Where to Start?</h3>
          <p>
            We recommend starting with <strong>IF MAGIC</strong> if you're new to embedded programming. 
            It's designed specifically for beginners with no prior experience required.
          </p>
        </div>
        <div className="footer-card">
          <h3>▸ Already Have Hardware?</h3>
          <p>
            If you already own an <strong>ESP32</strong>, <strong>Arduino</strong>, or other microcontroller, 
            stay tuned! We're actively developing content for these platforms.
          </p>
        </div>
      </div>
    </div>
  );
}

export default LearningPaths;
