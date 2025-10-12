import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import TestPage from "./pages/Test";
import Login from "./pages/Login.jsx"
import Signup from "./pages/Signup";

import { ToastContainer} from "react-toastify";
// ممكن تستخدم lazy loading للصفحات الكبيرة
const Home = lazy(() => import("./pages/Home"));
const Clients = lazy(() => import("./pages/Clients"));
const Employees = lazy(() => import("./pages/Employees"));
const Finance = lazy(() => import("./pages/Finance"));

// index.js أو App.jsx


export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="p-6">جارٍ التحميل...</div>}>
        <Routes>
  {/* Dashboard routes */}
  <Route path="/dashboard" element={<Layout />}>
    <Route index element={<Home />} />
    <Route path="clients" element={<Clients />} />
    <Route path="employees" element={<Employees />} />
    <Route path="finance" element={<Finance />} />
    <Route path="emp" element={<TestPage />} />
  </Route>

  {/* Public routes */}
  <Route path="/" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
</Routes>

      </Suspense>
      <ToastContainer position="top-left" autoClose={3000} />

    </Router>
  );
}
