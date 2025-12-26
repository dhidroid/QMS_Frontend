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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/display" element={<DisplayPage />} />
        <Route path="/book" element={<BookingPage />} />
        <Route path="/ticket/:guid" element={<TicketPage />} />
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/forms" element={<FormBuilder />} />
        <Route path="/admin/forms/:formId" element={<FormBuilder />} />
        <Route path="/book/form/:formId" element={<DynamicBookingPage />} />
      </Routes>
    </Router>
  );
}

export default App;
