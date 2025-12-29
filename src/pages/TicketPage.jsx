import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import QRCode from 'qrcode';
import { api } from '../api/endpoints';
import { Card } from '../design-system/atoms/Card';
import Button from '../design-system/atoms/Button';
import { Download, Home } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from "jspdf";

const TicketPage = () => {
  const { guid } = useParams();
  const tokenGuid = guid; // Alias for consistency
  const navigate = useNavigate();
  const location = useLocation();

  // Initialize with passed state if available (Instant Render)
  const [token, setToken] = useState(location.state?.token || null);
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(!location.state?.token);
  const [error, setError] = useState('');
  const [downloaded, setDownloaded] = useState(false); 
  const ticketRef = useRef(null);

  useEffect(() => {
    // Generate QR immediately if we have token
    if (tokenGuid) {
      const url = `${window.location.origin}/ticket/${tokenGuid}`;
      QRCode.toDataURL(url, { margin: 1, width: 256, color: { dark: '#1e293b', light: '#ffffff00' } })
        .then(url => setQrUrl(url))
        .catch(e => console.error(e));
    }

    let interval;
    const fetchToken = async () => {
      try {
        const res = await api.token.getByGuid(tokenGuid);
        if (res.success && res.token) {
          setToken(res.token);
        } else if (!token) {
          // Only error if we don't have a token displayed already
          setError('Ticket not found');
        }
      } catch (err) {
        console.error(err);
        if (!token) setError('Error loading ticket');
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch if not pre-loaded, or poll for updates
    if (tokenGuid) {
      if (!token) fetchToken();
      interval = setInterval(fetchToken, 5000);
    } else {
      setLoading(false);
    }
    return () => clearInterval(interval);
  }, [tokenGuid]);

  const handleDownload = async () => {
    if (!ticketRef.current || !token) return;
    try {
      // Small delay to ensure render (fonts, icons)
      await new Promise(r => setTimeout(r, 500));

      const dataUrl = await toPng(ticketRef.current, {
        cacheBust: true,
        pixelRatio: 4, // HD Quality
        backgroundColor: '#F2F4F8' // Match background
      });

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: [80, 160]
      });

      const imgProps = pdf.getImageProperties(dataUrl);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(dataUrl, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ticket-${token.TokenNumber}.pdf`);
      setDownloaded(true);
    } catch (err) {
      console.error("PDF Gen Error", err);
    }
  };

  // Auto-download effect
  useEffect(() => {
    if (!loading && token && qrUrl && !downloaded) {
      // Trigger download once ready
      handleDownload();
    }
  }, [loading, token, qrUrl, downloaded]);

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><div className="w-8 h-8 border-4 border-slate-900 border-t-transparent rounded-full animate-spin"></div></div>;

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <Card className="max-w-md w-full p-8 text-center bg-white shadow-xl rounded-2xl">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Ticket Not Found</h2>
        <p className="text-slate-500 mb-6">Could not retrieve ticket details.</p>
        <Button onClick={() => navigate('/book')}>Return Home</Button>
      </Card>
    </div>
  );

  if (!token) return null;
  const dateObj = new Date(token.CreatedDate || Date.now());
  const dateStr = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });

  return (
    <div className="min-h-screen bg-[#F2F4F8] flex flex-col items-center justify-center p-6 font-sans">

      {/* Canvas Target */}
      <div ref={ticketRef} className="w-full max-w-[360px] relative drop-shadow-2xl">

        {/* Ticket Container */}
        <div className="bg-white w-full rounded-3xl overflow-hidden relative">

          {/* Top Section */}
          <div className="pt-12 pb-8 px-8 text-center relative z-10">
            <div className="mx-auto w-16 h-16 mb-4 flex items-center justify-center animate-bounce">
              <img
                src="https://cdn-icons-png.flaticon.com/512/1628/1628441.png"
                crossOrigin="anonymous"
                alt="Tada"
                className="w-12 h-12 object-contain"
              />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Thank you!</h1>
            <p className="text-slate-400 text-sm mt-1">Your ticket has been issued</p>
          </div>

          {/* Scalloped Divider */}
          <div className="relative h-6 w-full flex items-center overflow-hidden">
            <div className="absolute w-full border-t-[3px] border-dashed border-slate-100 top-1/2 -translate-y-1/2"></div>
            <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F2F4F8] rounded-full"></div>
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#F2F4F8] rounded-full"></div>
          </div>

          {/* Details Section */}
          <div className="px-8 pt-4 pb-8 space-y-6">

            <div className="flex justify-between items-baseline">
              <div>
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">TICKET ID</p>
                <p className="text-xl font-mono font-bold text-slate-900 tracking-tight">{token?.TokenGuid?.split('-').pop().toUpperCase() || '####'}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">QUEUE #</p>
                <p className="text-xl font-bold text-slate-900">{token?.TokenNumber || '#'}</p>
              </div>
            </div>

            <div>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase mb-1">DATE & TIME</p>
              <p className="text-base font-semibold text-slate-800">{dateStr} • {timeStr}</p>
            </div>

            {/* User Info Block */}
            <div className="bg-slate-50 p-4 rounded-xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">
                {token.FullName ? token.FullName.charAt(0).toUpperCase() : 'G'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{token.FullName || 'Guest User'}</p>
                <p className="text-xs text-slate-500 font-medium truncate">{token.Mobile || 'No Mobile'}</p>
              </div>
            </div>

          </div>

          {/* Barcode Section (Visual Fake + QR) */}
          <div className="pb-8 px-8 flex flex-col items-center gap-4 relative">
            <div className="w-full h-px bg-slate-100"></div>

            {/* Dynamic QR */}
            {qrUrl && <img src={qrUrl} alt="QR" className="w-32 h-32 mix-blend-multiply opacity-90" />}

            {/* Fake Barcode Lines for visual aesthetic if desired, or simpler QR label */}
            <div className="flex items-end justify-center gap-0.5 h-8 w-full opacity-30 mt-2 overflow-hidden">
              {[...Array(40)].map((_, i) => (
                <div key={i} className="bg-slate-900" style={{ width: Math.random() > 0.5 ? '2px' : '4px', height: '100%' }}></div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 font-mono tracking-[0.3em]">{token?.TokenGuid?.split('-').join('') || '000000'}</p>
          </div>

          {/* Bottom Scallops (Simulated) */}
          <div className="absolute bottom-0 left-0 w-full h-3 flex justify-between overflow-hidden px-1 z-10">
            {[...Array(24)].map((_, i) => (
              <div key={i} className="w-4 h-4 rounded-full bg-[#F2F4F8] -mb-2"></div>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 flex flex-col gap-3 w-full max-w-[360px]">
        <Button className="w-full h-12 rounded-xl text-md font-medium shadow-lg hover:shadow-xl hover:translate-y-[-2px] transition-all bg-slate-900 text-white" onClick={handleDownload}>
          <Download className="w-4 h-4 mr-2" /> Save to Photos
        </Button>
        <Button variant="ghost" className="w-full h-12 rounded-xl text-slate-500 hover:bg-white hover:text-slate-900" onClick={() => navigate('/')}>
          Go to Home
        </Button>
      </div>

    </div>
  );
};

export default TicketPage;
