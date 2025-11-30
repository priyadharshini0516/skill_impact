import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get token from localStorage (after login)
        const token = localStorage.getItem('token');
        if (!token) {
          // Redirect to login if not authenticated
          window.location.href = '/login';
          return;
        }

        // Fetch user profile
        const userRes = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(userRes.data);

        // Fetch user applications
        const appRes = await axios.get('http://localhost:5000/api/applications/my-applications', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(appRes.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div className="dashboard"><h2>Loading...</h2></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        {/* Sidebar */}
        <div className="dashboard-sidebar">
          <div className="user-card">
            <h3>{user?.name}</h3>
            <p>{user?.email}</p>
            <p className="role-badge">{user?.role}</p>
            <button className="btn-logout">Logout</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="dashboard-main">
          <h2>My Dashboard</h2>

          {user?.role === 'volunteer' ? (
            <div className="volunteer-dashboard">
              <h3>Your Skills</h3>
              <div className="skills-list">
                {user?.skills?.map((skill, idx) => (
                  <span key={idx} className="skill-tag">
                    {skill}
                  </span>
                ))}
              </div>

              <h3>Your Applications</h3>
              {applications.length > 0 ? (
                <div className="applications-list">
                  {applications.map((app) => (
                    <div key={app._id} className="application-item">
                      <h4>{app.missionId?.title}</h4>
                      <p>{app.missionId?.description}</p>
                      <p>
                        <strong>Status:</strong>{' '}
                        <span className={`status-${app.status}`}>{app.status}</span>
                      </p>
                      <p>
                        <strong>Applied on:</strong>{' '}
                        {new Date(app.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No applications yet. Start exploring missions!</p>
              )}
            </div>
          ) : (
            <div className="org-dashboard">
              <h3>Your Missions</h3>
              <button className="btn-create-mission">+ Create New Mission</button>
              <p>Mission management coming soon!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
