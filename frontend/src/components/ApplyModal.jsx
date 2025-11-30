import { useState } from 'react';
import axios from 'axios';
import './ApplyModal.css';

export default function ApplyModal({ mission, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    portfolio: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Please login to apply');
        setLoading(false);
        return;
      }

      const response = await axios.post(
        'http://localhost:5000/api/applications',
        {
          missionId: mission._id,
          portfolio: formData.portfolio,
          message: formData.message,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Success
      alert('Application submitted successfully! 🎉');
      onSuccess();
      onClose();
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to submit application';
      setError(errorMsg);
      console.error('Apply error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Apply for Mission</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="mission-info">
            <h3>{mission.title}</h3>
            <p><strong>Skills Required:</strong> {mission.skillsRequired?.join(', ')}</p>
            <p><strong>Time Commitment:</strong> {mission.timeCommitment}</p>
          </div>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="portfolio">Portfolio/GitHub Link</label>
              <input
                type="url"
                id="portfolio"
                name="portfolio"
                placeholder="https://github.com/yourprofile or portfolio link"
                value={formData.portfolio}
                onChange={handleChange}
                required
                className="form-input"
              />
              <small>Share your GitHub profile, portfolio, or relevant work link</small>
            </div>

            <div className="form-group">
              <label htmlFor="message">Why do you want to help?</label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell the organization why you're interested in this mission and what you can contribute..."
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
                className="form-textarea"
              />
            </div>

            <div className="modal-footer">
              <button 
                type="button" 
                className="btn-cancel" 
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="btn-submit"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Application'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
