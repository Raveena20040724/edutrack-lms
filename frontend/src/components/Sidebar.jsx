import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div style={{ width: "200px", background: "#111", color: "#fff", padding: "20px" }}>
      <h3>EduTrack</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/courses">Courses</Link></li>
        <li><Link to="/assignments">Assignments</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;