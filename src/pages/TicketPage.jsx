import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../api/endpoints';
import styles from '../styles/TicketPage.module.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TicketPage = () => {
  const { guid } = useParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const ticketRef = useRef(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const res = await api.token.getByGuid(guid);
        if (res.token) {
          setToken(res.token);
        } else {
          setError('Ticket not found.');
        }
      } catch (err) {
        setError('Failed to load ticket.');
      } finally {
        setLoading(false);
      }
    };

    if (guid && guid !== 'null' && guid !== 'undefined') fetchToken();
    else setError('Invalid Ticket ID');
  }, [guid]);

  const handleDownload = async () => {
    if (!ticketRef.current) return;
    try {
      // Capture only the ticket card
      const canvas = await html2canvas(ticketRef.current, {
        backgroundColor: null, // Transparent background if possible
        scale: 3, // Higher quality
        useCORS: true
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pdfWidth - 20; // 10mm margin
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;
      
      const x = 10;
      const y = (pdfHeight - imgHeight) / 2; // Center vertically

      pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
      pdf.save(`Ticket-${token ? token.TokenNumber : 'QMS'}.pdf`);
    } catch (err) {
      console.error('PDF Generation Failed', err);
    }
  };

  // Auto-download once loaded
  useEffect(() => {
    if (token && !loading) {
      const timer = setTimeout(() => {
        handleDownload();
      }, 1500); // 1.5s delay to ensure rendering
      return () => clearTimeout(timer);
    }
  }, [token, loading]);

  if (loading) return <div className={styles.loading}>Loading Ticket...</div>;
  if (error) return <div className={styles.error}>{error}</div>;

  // Format Date
  const dateObj = new Date(token.TokenDate || Date.now());
  const dateStr = dateObj.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const timeStr = new Date(token.CreatedAt || Date.now()).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className={styles.container}>
      <div className={styles.actions}>
         {/* Hidden button, auto triggers, but visible if needed */}
         <button className={styles.downloadBtn} onClick={handleDownload} style={{ position: 'fixed', top: 20, right: 20 }}>
            Download PDF
         </button>
      </div>

      <div className={styles.ticketCard} ref={ticketRef}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.brandIcon}>
            <span>🎟️</span> {/* Replace with SVG if needed */}
          </div>
          <div className={styles.dateGroup}>
            <span className={styles.label}>Token Date</span>
            <div className={styles.value}>
              {dateStr} • {timeStr}
            </div>
          </div>
        </div>

        {/* Main Info */}
        <div className={styles.mainInfo}>
          <div className={styles.leftPort}>
            <div className={styles.bigCode}>QMS</div>
            <div className={styles.subText}>Queue System</div>
          </div>
          <div className={styles.midIcon}>➝</div>
          <div className={styles.rightPort}>
            <div className={styles.bigCode}>{String(token.TokenNumber).padStart(3, '0')}</div>
            <div className={styles.subText}>Your Number</div>
          </div>
        </div>

        <div className={styles.divider}></div>

        {/* Passenger / Details */}
        <div className={styles.detailsList}>
          <div className={styles.detailRow}>
            <div>
              <div className={styles.detailMain}>{token.FullName}</div>
              <div className={styles.detailSub}>Mobile: {token.Mobile}</div>
            </div>
            <div className={styles.detailRight}>
              <div className={styles.detailSub}>Status</div>
              <div className={styles.detailMain}>{token.Status}</div>
            </div>
          </div>

          <div className={styles.detailRow}>
            <div>
              <div className={styles.detailMain}>{token.Purpose}</div>
              <div className={styles.detailSub}>Purpose</div>
            </div>
             <div className={styles.detailRight}>
              <div className={styles.detailSub}>Counter</div>
              <div className={styles.detailMain} style={{ color: 'var(--color-primary)', fontWeight: '900' }}>
                 {token.CounterName || '1'}
              </div>
            </div>
          </div>
        </div>

        {/* QR Section */}
        <div className={styles.qrSection}>
          {token.QRCodeBase64 ? (
            <img 
              src={token.QRCodeBase64} 
              alt="QR Code" 
              className={styles.qrCode} 
            />
          ) : (
            <div>No QR Code</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketPage;
