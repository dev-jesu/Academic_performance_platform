import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Students from "../pages/Students";
import StudentDashboard from "../pages/StudentDashboard";
import MentorDashboard from "../pages/MentorDashboard";
import EnrollmentManagement from "../pages/EnrollmentManagement";
import MentorStudentDetails from "../pages/MentorStudentDetails";
import MentorshipMapping from "../pages/MentorshipMapping";
import GradeManagement from "../pages/GradeManagement";
import Mentors from "../pages/Mentors";
import Profile from "../pages/Profile";

import ProtectedRoutes from "./ProtectedRoutes";

function AppRoutes() {

  return (

    <BrowserRouter>

      <Routes>

        {/* Public Route */}
        <Route path="/" element={<Login />} />

        {/* Admin Routes */}

        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoutes allowedRoles={["admin"]}>
              <Dashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/students"
          element={
            <ProtectedRoutes allowedRoles={["admin"]}>
              <Students />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/mentors"
          element={
            <ProtectedRoutes allowedRoles={["admin"]}>
              <Mentors />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/admin/manage-enrollments"
          element={
            <ProtectedRoutes allowedRoles={["admin"]}>
              <EnrollmentManagement />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/admin/mentorship-mapping"
          element={
            <ProtectedRoutes allowedRoles={["admin"]}>
              <MentorshipMapping />
            </ProtectedRoutes>
          }
        />

        {/* Mentor Routes */}

        <Route
          path="/mentor-dashboard"
          element={
            <ProtectedRoutes allowedRoles={["mentor"]}>
              <MentorDashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/mentor/student/:studentId"
          element={
            <ProtectedRoutes allowedRoles={["mentor"]}>
              <MentorStudentDetails />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/mentor/manage-grades"
          element={
            <ProtectedRoutes allowedRoles={["mentor"]}>
              <GradeManagement />
            </ProtectedRoutes>
          }
        />

        {/* Student Routes */}

        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoutes allowedRoles={["student"]}>
              <StudentDashboard />
            </ProtectedRoutes>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoutes allowedRoles={["admin", "mentor", "student"]}>
              <Profile />
            </ProtectedRoutes>
          }
        />

      </Routes>

    </BrowserRouter>

  );

}

export default AppRoutes;