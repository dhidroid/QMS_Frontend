import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/HomePage.module.css';

const HomePage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Token Management System</h1>
      <div className={styles.grid}>
        <Link to="/book" className={styles.card}>
          <h2>Book Appointment</h2>
          <p>Get a ticket for service</p>
        </Link>
        <Link to="/display" className={styles.card}>
          <h2>Display Screen</h2>
          <p>View queue status (TV Mode)</p>
        </Link>
        <Link to="/admin" className={styles.card}>
          <h2>Admin Dashboard</h2>
          <p>Manage queue and calls</p>
        </Link>
      </div>
    </div>
  );
};

export default HomePage;
