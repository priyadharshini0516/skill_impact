export default function MissionCard({ mission, onApply }) {
  return (
    <div className="mission-card">
      <h3>{mission.title}</h3>
      <p>{mission.description}</p>
      <p><strong>Skills:</strong> {mission.skillsRequired?.join(', ') || 'N/A'}</p>
      <p><strong>Time:</strong> {mission.timeCommitment || 'N/A'}</p>
      <p><strong>Impact:</strong> {mission.impact || 'N/A'}</p>
      <p className="org-name"><strong>By:</strong> {mission.createdBy?.name || 'Organization'}</p>
      <button className="btn-apply" onClick={onApply}>Apply Now</button>
    </div>
  );
}
