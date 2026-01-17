import './Profile.css';

/**
 * Profile Page - User account mockup
 * 
 * This is a mockup showing what a user profile might look like.
 * In a real application, this data would come from:
 * - Authentication system (login/signup)
 * - Backend API
 * - Database
 * 
 * For now, we're using mock/dummy data to show the UI concept.
 */

function Profile() {
  
  // Mock user data - pretend this came from an API
  const userData = {
    name: "Alex Chen",
    email: "alex.chen@example.com",
    joinDate: "January 2026",
    totalLessons: 6,
    completedLessons: 0,
    learningStreak: 0,
    hardwareConnected: true
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            <span>◉</span>
          </div>
          <div className="profile-info">
            <h1 className="profile-name">{userData.name}</h1>
            <p className="profile-email">{userData.email}</p>
            <p className="profile-join-date">Member since {userData.joinDate}</p>
          </div>
          <button className="edit-profile-btn">Edit Profile</button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">▣</div>
            <div className="stat-content">
              <span className="stat-value">{userData.completedLessons}/{userData.totalLessons}</span>
              <span className="stat-label">Lessons Completed</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">▲</div>
            <div className="stat-content">
              <span className="stat-value">{userData.learningStreak} days</span>
              <span className="stat-label">Learning Streak</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">◆</div>
            <div className="stat-content">
              <span className="stat-value">{userData.hardwareConnected ? 'Connected' : 'Disconnected'}</span>
              <span className="stat-label">IF MAGIC Hardware</span>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="section">
          <h2 className="section-title">◆ Achievements</h2>
          <div className="achievements-grid">
            <div className="achievement-card locked">
              <div className="achievement-icon">★</div>
              <div className="achievement-name">First Steps</div>
              <div className="achievement-description">Complete your first lesson</div>
            </div>
            <div className="achievement-card locked">
              <div className="achievement-icon">◆</div>
              <div className="achievement-name">Hardware Hero</div>
              <div className="achievement-description">Connect your IF MAGIC hardware</div>
            </div>
            <div className="achievement-card locked">
              <div className="achievement-icon">◈</div>
              <div className="achievement-name">Note Taker</div>
              <div className="achievement-description">Write 100 notes</div>
            </div>
            <div className="achievement-card locked">
              <div className="achievement-icon">▲</div>
              <div className="achievement-name">On Fire!</div>
              <div className="achievement-description">Maintain a 7-day streak</div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="section">
          <h2 className="section-title">▸ Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">◉</div>
              <div className="activity-content">
                <p className="activity-text">You joined HardwareHub!</p>
                <p className="activity-time">Just now</p>
              </div>
            </div>
            <div className="activity-item empty">
              <div className="activity-icon">○</div>
              <div className="activity-content">
                <p className="activity-text">No recent activity. Start learning to see your progress here!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Settings Section */}
        <div className="section">
          <h2 className="section-title">▸ Settings</h2>
          <div className="settings-list">
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Email Notifications</span>
                <span className="setting-description">Receive updates about your progress</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Hardware Auto-Connect</span>
                <span className="setting-description">Automatically detect IF MAGIC hardware</span>
              </div>
              <label className="toggle">
                <input type="checkbox" defaultChecked />
                <span className="toggle-slider"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="setting-info">
                <span className="setting-name">Dark Mode</span>
                <span className="setting-description">Always enabled (hacker theme)</span>
              </div>
              <label className="toggle">
                <input 
                  type="checkbox" 
                  checked={true}
                  disabled
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
