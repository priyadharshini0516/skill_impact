import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  const handleExplore = () => {
    navigate('/missions');
  };

  return (
    <div className="hero">
      <h1>Match Your Skills with Social Impact</h1>
      <p>Help local organizations with digital tasks. Volunteer. Grow. Make a difference.</p>
      <button className="btn-primary" onClick={handleExplore}>
        Explore Missions
      </button>
    </div>
  );
}
