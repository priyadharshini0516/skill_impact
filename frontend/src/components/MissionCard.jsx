import { useState } from 'react';
import ApplyModal from './ApplyModal';

export default function MissionCard({ mission, onApply }) {
  const [showModal, setShowModal] = useState(false);

  const handleApplyClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSuccess = () => {
    // Optionally refresh missions list here
    if (onApply) onApply();
  };

  return (
    <>
      <div className="mission-card">
        <h3>{mission.title}</h3>
        <p>{mission.description}</p>
        <p><strong>Skills:</strong> {mission.skillsRequired?.join(', ') || 'N/A'}</p>
        <p><strong>Time:</strong> {mission.timeCommitment || 'N/A'}</p>
        <p><strong>Impact:</strong> {mission.impact || 'N/A'}</p>
        <p className="org-name"><strong>By:</strong> {mission.createdBy?.name || 'Organization'}</p>
        <button className="btn-apply" onClick={handleApplyClick}>Apply Now</button>
      </div>

      {showModal && (
        <ApplyModal 
          mission={mission}
          onClose={handleCloseModal}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
