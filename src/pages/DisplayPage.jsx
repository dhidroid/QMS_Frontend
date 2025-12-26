import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { api } from '../api/endpoints';
import styles from '../styles/DisplayPage.module.css';

const DisplayPage = () => {
  const [qrUrl, setQrUrl] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Real Data State
  const [nowServing, setNowServing] = useState(null);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    // Generate QR code
    const bookingUrl = `${window.location.origin}/book`;
    QRCode.toDataURL(bookingUrl, { width: 300, margin: 2, color: { dark: '#000', light: '#FFF' } })
      .then(url => setQrUrl(url))
      .catch(err => console.error(err));

    // Update time
    const timer = setInterval(() => setCurrentDate(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch Real Data Loop
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api.token.getDisplayStatus();
        
        if (data.success) {
           setNowServing(data.nowServing || null);
           setQueue(data.queue || []);
        }
      } catch (err) {
        console.error("Display Fetch Error", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // 3 seconds poll
    return () => clearInterval(interval);
  }, []);

  // Audio / TTS Logic
  useEffect(() => {
    if (nowServing && nowServing.TokenGuid) {
      // Check if it's a new token compared to the last one we announced
      const lastAnnounced = localStorage.getItem('last_announced_token');
      
      if (lastAnnounced !== nowServing.TokenGuid) {
        // Play Sound / TTS
        const text = `Token Number ${nowServing.TokenNumber}, please proceed to ${nowServing.CounterName || 'Counter'}`;
        
        // Simple chime (optional, using browser oscillator if we wanted, but let's stick to TTS for now)
        // Speak
          if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            // slower speaking rate for clearer announcements
           utterance.rate = 0.9;
           utterance.pitch = 1.1;
            window.speechSynthesis.cancel(); // Cancel current speaking
            window.speechSynthesis.speak(utterance);
          }

        // Save to avoid repeating loop
        localStorage.setItem('last_announced_token', nowServing.TokenGuid);
      }
    }
  }, [nowServing]);

  return (
    <div className={styles.container}>
      {/* ... header ... */}
      <header className={styles.header}>
        <div className={styles.logo}>Token System</div>
        <div className={styles.time}>
          {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </header>
      
      {/* Hidden button to enable audio context if needed by browser policy */}
      <button 
        style={{ position: 'fixed', opacity: 0, pointerEvents: 'none' }} 
        id="audio-enabler"
      >
        Enable Audio
      </button>

      <main className={styles.main}>
        {/* ... existing main content ... */}
        <div className={styles.leftPanel}>
          <div className={styles.qrCard}>
            <h2>Scan to Book</h2>
            <p>Use your mobile phone to get a ticket</p>
            {qrUrl && <img src={qrUrl} alt="Scan to Book" className={styles.qrImage} />}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.statusCard}>
            <h3>Now Serving</h3>
            {nowServing ? (
              <>
                <div className={styles.tokenNumber} style={{ color: 'var(--color-success)' }}>
                  {nowServing.TokenNumber}
                </div>
                <div className={styles.counter}>
                   {nowServing.CounterName || 'Counter 1'}
                </div>
                <div className={styles.animPulse}></div> {/* Visual cue */}
              </>
            ) : (
                <div className={styles.tokenNumber} style={{ fontSize: '3rem', color: '#ccc' }}>Waiting...</div>
            )}
          </div>
          
          <div className={styles.queueList}>
            <h3>Next in Queue</h3>
            {queue.length > 0 ? (
                queue.slice(0, 4).map(t => (
                    <div key={t.TokenGuid} className={styles.queueItem}>
                        <span>#{t.TokenNumber}</span>
                    </div>
                ))
            ) : (
                <div style={{ padding: 20, textAlign: 'center', color: '#666' }}>Queue Empty</div>
            )}
          </div>
        </div>
      </main>
      
      {/* ... footer ... */}
      <footer className={styles.footer}>
        <div className={styles.announcement}>
           {nowServing ? `Calling Token ${nowServing.TokenNumber} to ${nowServing.CounterName}` : 'Please wait for your number to be called.'}
        </div>
      </footer>
    </div>
  );
};

export default DisplayPage;
