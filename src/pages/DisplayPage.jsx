import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { api } from '../api/endpoints';
import NowServing from './display-components/NowServing';
import QueueList from './display-components/QueueList';
import { Scan } from 'lucide-react';
import clsx from 'clsx';
import Footer from '../components/Footer';
import logo from '../assets/logo.svg';

const DisplayPage = () => {
  const [qrUrl, setQrUrl] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Real Data State
  const [nowServing, setNowServing] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Generate QR code for mobile booking
    const bookingUrl = `${window.location.origin}/book`;
    QRCode.toDataURL(bookingUrl, { width: 150, margin: 1, color: { dark: '#000', light: '#FFF' } })
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
          setIsConnected(true);
        }
      } catch (err) {
        console.error("Display Fetch Error", err);
        setIsConnected(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000); // 2 seconds poll
    return () => clearInterval(interval);
  }, []);

  // Audio / TTS Logic
  useEffect(() => {
    if (nowServing && nowServing.TokenGuid) {
      const lastAnnounced = localStorage.getItem('last_announced_token');
      
      if (lastAnnounced !== nowServing.TokenGuid) {
        const text = `Token Number ${nowServing.TokenNumber}, please proceed to ${nowServing.CounterName || 'Counter'}`;

        if ('speechSynthesis' in window) {
          // Basic browser speech synthesis
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          window.speechSynthesis.cancel();
          window.speechSynthesis.speak(utterance);
        }
        localStorage.setItem('last_announced_token', nowServing.TokenGuid);
      }
    }
  }, [nowServing]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden flex flex-col font-sans">
      {/* Header */}
      <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-8 bg-zinc-900/50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img src={logo} alt="QMS" className="w-8 h-8 rounded-full object-contain" />
          <h1 className="text-lg font-semibold tracking-wide text-zinc-300">QMS Display</h1>
        </div>
        <div className="flex items-center gap-4">
          {!isConnected && <span className="text-red-500 text-xs uppercase font-bold animate-pulse">Offline</span>}
          <div className="text-2xl font-mono font-medium tracking-widest text-zinc-400">
            {currentDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="flex-1 p-0 grid grid-cols-2 h-[calc(100vh-8rem)]">
        {/* Left Panel: Now Serving (Big) */}
        <div className="col-span-1 h-full border-r border-zinc-800 bg-black relative">
          <NowServing token={nowServing} />
        </div>

        {/* Right Panel: Queue List */}
        <div className="col-span-1 h-full bg-zinc-900 relative">
          <QueueList queue={queue} />

          {/* QR Code Fixed Bottom Right */}
          <div className="absolute bottom-4 right-4 bg-white p-3 rounded-xl shadow-2xl flex items-center gap-4 z-20">
            {qrUrl && <img src={qrUrl} alt="QR" className="w-20 h-20 mix-blend-multiply" />}
            <div className="hidden xl:block pr-2">
              <p className="text-zinc-900 font-bold text-sm">Scan to Join</p>
              <p className="text-zinc-500 text-xs mt-0.5">Skip the line</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer / Scrolling Ticker */}
      <div className="bg-zinc-900 border-t border-zinc-800 flex flex-col">
        <div className="h-10 bg-primary/20 text-primary-foreground flex items-center overflow-hidden whitespace-nowrap px-4 border-b border-white/5 relative">
          <div className="text-sm font-medium animate-marquee inline-block w-full text-center text-white">
            {nowServing
              ? `Calling Token ${nowServing.TokenNumber} to ${nowServing.CounterName}... Please proceed immediately.`
              : 'Welcome to QMS. Please wait for your number to be called.'}
          </div>
        </div>
        <Footer className="bg-black text-white/50 py-2 border-t border-white/5" />
      </div>
    </div>
  );
};

export default DisplayPage;
