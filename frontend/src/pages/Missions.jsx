import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MissionCard from '../components/MissionCard';

export default function Missions() {
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/missions');
        setMissions(res.data);
      } catch (error) {
        console.error('Error fetching missions:', error);
        alert('Failed to load missions');
      } finally {
        setLoading(false);
      }
    };
    fetchMissions();
  }, []);

  const handleApply = (missionId) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to apply');
      navigate('/login');
      return;
    }
    // Open a simple apply modal or redirect
    alert('Apply functionality - implement modal for portfolio and message');
  };

  if (loading) {
    return <div className="missions-page"><h2>Loading missions...</h2></div>;
  }

  return (
    <div className="missions-page">
      <h2>Available Missions</h2>
      {missions.length > 0 ? (
        <div className="missions-grid">
          {missions.map((mission) => (
            <MissionCard 
              key={mission._id} 
              mission={mission}
              onApply={() => handleApply(mission._id)}
            />
          ))}
        </div>
      ) : (
        <p>No missions available yet. Check back soon!</p>
      )}
    </div>
  );
}
