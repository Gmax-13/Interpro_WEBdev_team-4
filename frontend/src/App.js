import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Dashboard from './pages/Dashboard';
import DoctorListPage from './pages/DoctorListPage';
import DoctorProfilePage from './pages/DoctorProfilePage';
import ClinicListPage from './pages/ClinicListPage';
import ClinicProfilePage from './pages/ClinicProfilePage';
import BookAppointmentPage from './pages/BookAppointmentPage';
import PatientDashboard from './pages/PatientDashboard';
import AdminDashboard from './pages/AdminDashboard';
import DoctorDashboard from './pages/DoctorDashboard';
import AppointmentsPage from './pages/AppointmentsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import './index.css';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/appointments" element={<AppointmentsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/doctors" element={<DoctorListPage />} />
        <Route path="/doctors/:id" element={<DoctorProfilePage />} />
        <Route path="/clinics" element={<ClinicListPage />} />
        <Route path="/clinics/:id" element={<ClinicProfilePage />} />
        <Route path="/book-appointment/:doctorId/:clinicId" element={<BookAppointmentPage />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
