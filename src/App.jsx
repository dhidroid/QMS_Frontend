import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import DisplayPage from './pages/DisplayPage';
import BookingPage from './pages/BookingPage';
import TicketPage from './pages/TicketPage';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboard from './pages/AdminDashboard';
import FormBuilder from './pages/FormBuilder';
import DynamicBookingPage from './pages/DynamicBookingPage';
import CounterTerminal from './pages/CounterTerminal';

import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/error-pages/NotFoundPage';
import BadRequestPage from './pages/error-pages/BadRequestPage';
import MaintenancePage from './pages/error-pages/MaintenancePage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/book/form/:formId" element={<DynamicBookingPage />} />
        <Route path="/ticket/:guid" element={<TicketPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />

        {/* Protected Admin Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/forms" element={<FormBuilder />} />
          <Route path="/admin/forms/:formId" element={<FormBuilder />} />
          <Route path="/admin/terminal" element={<CounterTerminal />} />
        </Route>

        {/* Error Pages */}
        <Route path="/maintenance" element={<MaintenancePage />} />
        <Route path="/400" element={<BadRequestPage />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
