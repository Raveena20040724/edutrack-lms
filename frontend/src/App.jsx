import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import CourseList from "./pages/Courses/CourseList";
import CourseDetails from "./pages/Courses/CourseDetails";
import VideoPlayer from "./pages/Video/VideoPlayer";
import AssignmentList from "./pages/Assignments/AssignmentList";
import Dashboard from "./pages/Dashboard/Dashboard";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: "flex" }}>
        <Sidebar />

        <div style={{ flex: 1, padding: "20px" }}>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/courses/:id" element={<CourseDetails />} />
            <Route path="/video/:id" element={<VideoPlayer />} />
            <Route path="/assignments" element={<AssignmentList />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;