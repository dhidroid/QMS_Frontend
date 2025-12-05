import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/endpoints';
import styles from '../styles/BookingPage.module.css';

const BookingPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    purpose: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.token.create(formData);
      if (res.success && res.token) {
        navigate(`/ticket/${res.token.tokenGuid}`);
      } else {
        setError('Failed to create ticket. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Book Appointment</h1>
        <p className={styles.subtitle}>Join the queue from your device</p>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="fullName">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              placeholder="John Doe"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="mobile">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              placeholder="+1 234 567 890"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="purpose">Purpose</label>
            <select
              id="purpose"
              name="purpose"
              value={formData.purpose}
              onChange={handleChange}
              required
            >
              <option value="">Select Purpose</option>
              <option value="General Inquiry">General Inquiry</option>
              <option value="Consultation">Consultation</option>
              <option value="Payment">Payment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Booking...' : 'Get Ticket'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default BookingPage;
