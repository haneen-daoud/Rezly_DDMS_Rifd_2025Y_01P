import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// الصفحات (lazy)
const Home = lazy(() => import("./pages/Home"));
const Clients = lazy(() => import("./pages/Clients"));
const Employees = lazy(() => import("./pages/Employees"));
const Finance = lazy(() => import("./pages/Finance"));
const Setting = lazy(() => import("./pages/Setting"));

const UserLayout = lazy(() => import("./components/UserLayout.jsx"));
const UserAttendance = lazy(() => import("./pages/UserAttendance.jsx"));
const ScanAttendance = lazy(() => import("./pages/ScanAttendance.jsx"));

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="p-6">جارٍ التحميل...</div>}>
        <Routes>
          {/* 🟣 داشبورد الإدارة (Layout واحد فقط) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            {/* هاي هي الصفحات الداخلية اللي بتبين جوّا <Outlet /> تبع Layout */}
            <Route index element={<Home />} />
            <Route path="clients/*" element={<Clients />} />      
            <Route path="employees/*" element={<Employees />} />
            <Route path="finance" element={<Finance />} />
            <Route path="setting" element={<Setting />} />
          </Route>

          {/* 🟢 واجهة المستخدم (المشترك) */}
          <Route
            path="/user"
            element={
              <ProtectedRoute>
                <UserLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserAttendance />} />
            <Route path="attendance" element={<UserAttendance />} />
            <Route path="scan" element={<ScanAttendance />} />
          </Route>

          {/* 🔵 صفحة مسح كود الحضور/الانصراف (لو حابة تبقيها مستقلة) */}
          <Route
            path="/scan"
            element={
              <ProtectedRoute>
                <ScanAttendance />
              </ProtectedRoute>
            }
          />

          {/* 🔓 Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Suspense>

      <ToastContainer position="top-left" autoClose={3000} />
    </Router>
  );
}
