// src/App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import TestPage from "./pages/Test";
import Login from "./Login.jsx";
import Signup from "./pages/Signup.jsx";

const Home = lazy(() => import("./pages/Home"));
const Clients = lazy(() => import("./pages/Clients"));
const Employees = lazy(() => import("./pages/Employees"));
const Finance = lazy(() => import("./pages/Finance"));

export default function App() {
  return (
    <Router>
      <Suspense fallback={<div className="p-6">جارٍ التحميل...</div>}>
        <Routes>
          {/* 🟣 صفحات لوحة التحكم */}
          <Route path="/dashboard" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="clients" element={<Clients />} />
            <Route path="employees" element={<Employees />} />
            <Route path="finance" element={<Finance />} />
            <Route path="emp" element={<TestPage />} />
          </Route>

          {/* 🟢 صفحات مستقلة */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
