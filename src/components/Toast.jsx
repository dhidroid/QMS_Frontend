import React, { useEffect } from 'react';
import styles from '../styles/Toast.module.css';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <div className={`${styles.toast} ${styles[type]}`}>
      <div className={styles.icon}>
        {type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
      </div>
      <div className={styles.content}>{message}</div>
      <button className={styles.closeBtn} onClick={onClose}><FaTimes /></button>
    </div>
  );
};

export default Toast;
