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

//   تحميل الصفحات
const Home = lazy(() => import("./pages/Home"));
const Clients = lazy(() => import("./pages/Clients"));
const Employees = lazy(() => import("./pages/Employees"));
const Finance = lazy(() => import("./pages/Finance"));
const Setting = lazy(() => import("./pages/Setting"));

const UserLayout = lazy(() => import("./components/UserLayout.jsx"));
const UserAttendance = lazy(() => import("./pages/UserAttendance.jsx"));
const ScanAttendance = lazy(() => import("./pages/ScanAttendance.jsx"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="p-6">جارٍ التحميل...</div>}>
        <Routes>
          {/*   Dashboard routes */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Home />} />

            {/*   إدارة العملاء */}
            <Route path="clients/*" element={<Clients />} />

            {/*   طاقم العمل */}
            <Route path="employees/*" element={<Employees />} />

            {/*   المالية */}
            <Route path="finance" element={<Finance />} />

            {/*   الإعدادات */}
            <Route path="setting" element={<Setting />} />
          </Route>

          {/*   User dashboard (للمشترك) */}
          <Route path="/user" element={<UserLayout />}>
            {/* صفحة الحضور (الـ QR) */}
            <Route index element={<UserAttendance />} />
          </Route>

          {/*   صفحة مسح كود الحضور/الانصراف */}
          <Route path="/scan" element={<ScanAttendance />} />

          {/*   Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

  
        </Routes>
      </Suspense>

      <ToastContainer position="top-left" autoClose={3000} />
    </Router>
  );
}
