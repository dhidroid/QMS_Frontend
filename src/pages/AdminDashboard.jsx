import React, { useEffect, useState } from 'react';
import { api } from '../api/endpoints';
import styles from '../styles/AdminDashboard.module.css';

const AdminDashboard = () => {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [counterName, setCounterName] = useState(localStorage.getItem('qms_counter') || 'Counter 1');

  const fetchTokens = async () => {
    // ... same as before
    try {
      const res = await api.admin.getTokens();
      if (res.tokens) {
        setTokens(res.tokens);
      }
    } catch (err) {
      console.error('Failed to fetch tokens', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTokens();
    const interval = setInterval(fetchTokens, 5000);
    return () => clearInterval(interval);
  }, []);

  // Save counter preference
  useEffect(() => {
    localStorage.setItem('qms_counter', counterName);
  }, [counterName]);

  const handleStatusUpdate = async (tokenGuid, status) => {
    try {
      await api.admin.updateStatus({ tokenGuid, status });
      fetchTokens();
    } catch (err) {
      alert('Failed to update status');
    }
  };

  const handleCallNext = async () => {
    try {
      const res = await api.admin.callNext({ counterName });
      if (res.success) {
        fetchTokens();
        // optionally play a sound here
      } else {
        alert(res.message || 'Failed to call next token');
      }
    } catch (err) {
      alert('Error calling next token');
    }
  };

  return (
    <div className={styles.container}>
      {/* ... header ... */}
      <header className={styles.header}>
        <div className={styles.logoGroup}>
             <h1>Queue Management</h1>
             <div className={styles.counterConfig}>
                <label>My Counter:</label>
                <select value={counterName} onChange={(e) => setCounterName(e.target.value)} className={styles.counterSelect}>
                    <option value="Counter 1">Counter 1</option>
                    <option value="Counter 2">Counter 2</option>
                    <option value="Counter 3">Counter 3</option>
                    <option value="Counter 4">Counter 4</option>
                    <option value="Reception">Reception</option>
                </select>
             </div>
        </div>
        
        <button onClick={() => {
          localStorage.removeItem('authToken');
          window.location.href = '/admin';
        }}>Logout</button>
      </header>

      <main className={styles.main}>
        {loading ? (
          <div className={styles.loader}>Loading Data...</div>
        ) : (
          <>
            <div className={styles.controls}>
               <button onClick={handleCallNext} className={styles.nextBtn}>
                 📢 Call Next Token
               </button>
            </div>

            <div className={styles.grid}>
              {tokens.map(token => {
                const status = token.Status ? token.Status.toLowerCase() : 'pending';
                return (
                  <div key={token.TokenGuid} className={`${styles.card} ${styles[status]}`}>
                    <div className={styles.cardHeader}>
                      <span className={styles.number}>{token.TokenNumber}</span>
                      <span className={styles.status}>{token.Status}</span>
                    </div>
                    <div className={styles.details}>
                      <p><strong>{token.FullName}</strong></p>
                      <p>{token.Purpose}</p>
                      {token.CounterName && <p className={styles.assignedCounter}>📍 {token.CounterName}</p>}
                    </div>
                    <div className={styles.actions}>
                      {status === 'pending' && (
                        <button onClick={() => handleStatusUpdate(token.TokenGuid, 'called')} className={styles.callBtn}>
                          Call
                        </button>
                      )}
                      {status === 'called' && (
                        <>
                          <button onClick={() => handleStatusUpdate(token.TokenGuid, 'served')} className={styles.completeBtn}>
                            Complete
                          </button>
                          <button onClick={() => handleStatusUpdate(token.TokenGuid, 'noshow')} className={styles.noshowBtn}>
                            No Show
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
              {tokens.length === 0 && <div className={styles.empty}>No tokens in queue</div>}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
