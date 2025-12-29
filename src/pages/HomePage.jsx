import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../design-system/atoms/Button';
import { Search } from 'lucide-react';
import { api } from '../api/endpoints';
import { ArrowRight, LayoutDashboard, Ticket } from 'lucide-react';
import Footer from '../components/Footer';
import logo from '../assets/logo.svg';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      {/* Navbar */}
      <nav className="h-16 border-b border-border flex items-center justify-between px-6 lg:px-12 backdrop-blur-sm bg-white/80 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={logo} alt="QMS" className="w-8 h-8 rounded-lg object-contain" />
          <span className="font-bold text-xl tracking-tight text-slate-900">QMS</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="sm">Admin Login</Button>
          </Link>
          <Link to="/book">
            <Button size="sm">Get Ticket</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 lg:py-32 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50/50 rounded-full blur-3xl -z-10" />

        <div className="max-w-3xl space-y-8 animate-in fade-in zoom-in duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-sm font-medium border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            System Operational
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-slate-900 text-balance">
            Queue Management <br />
            <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">
              Redefined
            </span>
          </h1>

          <p className="text-xl text-slate-500 max-w-2xl mx-auto text-balance leading-relaxed">
            Experience seamless waiting with our advanced digital token system. Book from anywhere, track in real-time.
          </p>


          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 mb-12">
            <Link to="/book">
              <Button size="lg" className="px-8 h-14 text-lg rounded-full shadow-xl shadow-blue-500/20 hover:shadow-blue-500/30 transition-all hover:scale-105">
                Book Appointment
                <Ticket className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            <Link to="/admin/dashboard">
              <Button variant="outline" size="lg" className="px-8 h-14 text-lg rounded-full border-slate-300 hover:bg-slate-50">
                Dashboard
                <LayoutDashboard className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-8 relative z-20 w-full max-w-md mx-auto animate-in slide-in-from-bottom duration-1000">
            <div className="bg-white/80 backdrop-blur-xl p-2 rounded-2xl border border-white/50 shadow-2xl flex items-center gap-2 ring-1 ring-slate-900/5">
              <Search className="ml-3 text-slate-400 w-5 h-5" />
              <input
                className="flex-1 bg-transparent border-none text-slate-900 placeholder:text-slate-400 focus:outline-none h-10 font-medium"
                placeholder="Find ticket (e.g. 101 or phone)"
                onKeyDown={async (e) => {
                  if (e.key === 'Enter') {
                    const val = e.target.value.trim();
                    if (!val) return;
                    try {
                      const res = await api.token.search(val);
                      if (res.success && res.tokenGuid) {
                        window.location.href = `/ticket/${res.tokenGuid}`;
                      } else {
                        alert('Ticket not found');
                      }
                    } catch (e) {
                      console.error(e);
                    }
                  }
                }}
              />
            </div>
            <p className="text-xs text-slate-400 mt-2 font-medium">Press Enter to search</p>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl w-full px-6">
          {[
            { title: 'Smart Booking', desc: 'Secure your spot instantly via mobile or web.', icon: '📱' },
            { title: 'Real-time Tracking', desc: 'Watch your position in queue live.', icon: '⏱️' },
            { title: 'Digital Analytics', desc: 'Insightful data for service improvement.', icon: '📊' },
            { title: 'Feedback Loop', desc: 'Rate your experience instantly.', icon: '⭐' }
          ].map((f, i) => (
            <div key={i} className="p-8 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow text-left">
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer className="border-t border-slate-100 bg-white" />
    </div>
  );
};

export default HomePage;
