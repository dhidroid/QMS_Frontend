import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/endpoints';
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  Check,
  LayoutDashboard,
  Users,
  Ticket,
  BarChart3,
  MessageSquare,
  ShieldCheck
} from 'lucide-react';
import Button from '../design-system/atoms/Button';
import logo from '../assets/logo.svg';

const FEATURE_DOTS = [
  { icon: LayoutDashboard, label: 'Dashboard', x: '50%', y: '15%' },
  { icon: Users, label: 'Visitors', x: '85%', y: '35%' },
  { icon: Ticket, label: 'Tokens', x: '85%', y: '65%' },
  { icon: BarChart3, label: 'Analytics', x: '50%', y: '85%' },
  { icon: MessageSquare, label: 'Feedback', x: '15%', y: '65%' },
  { icon: ShieldCheck, label: 'Security', x: '15%', y: '35%' },
];

const AdminLoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.auth.login({ username, password });
      if (res.token) {
        localStorage.setItem('authToken', res.token);
        if (rememberMe) {
          localStorage.setItem('rememberedUser', username);
        }
        navigate('/admin/dashboard');
      } else {
        setError(res.message || 'Invalid credentials');
      }
    } catch (err) {
      console.error(err);
      setError('Login failed. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white font-sans overflow-hidden">
      {/* Left Panel - Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-8 lg:p-16 xl:p-24 justify-center relative">
        {/* Logo Top Left */}
        <div className="absolute top-8 left-8 flex items-center gap-2">
          <img src={logo} alt="QMS" className="w-8 h-8 object-contain" />
          <span className="text-xl font-bold text-slate-800 tracking-tight">NATOBOTICS</span>
        </div>

        <div className="max-w-md w-full mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900">Log in to your Account</h1>
            <p className="text-slate-500">Welcome back! Please enter your details.</p>
          </div>

          {error && (
            <div className="p-4 rounded-lg bg-rose-50 text-rose-600 border border-rose-100 text-sm flex items-center gap-2 animate-in slide-in-from-top-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Username or Email</label>
              <div className="relative group">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-blue-600" />
                <input
                  type="text"
                  className="w-full h-11 pl-10 pr-4 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all font-medium"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Password</label>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors group-focus-within:text-blue-600" />
                <input 
                  type={showPassword ? "text" : "password"}
                  className="w-full h-11 pl-10 pr-10 rounded-lg border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all font-medium"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="flex items-center gap-2 cursor-pointer select-none group">
                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-blue-600 border-blue-600' : 'bg-white border-slate-300 group-hover:border-blue-400'}`}>
                  {rememberMe && <Check size={14} className="text-white" strokeWidth={3} />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="text-sm text-slate-600 font-medium">Remember me</span>
              </label>

              <button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline">
                Forgot Password?
              </button>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-blue-800 hover:bg-blue-900 text-white font-bold text-base rounded-lg shadow-lg shadow-blue-900/10 hover:shadow-blue-900/20 transition-all"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Login'}
            </Button>
          </form>

          <div className="relative py-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium">Trusted by industry leaders</span>
            </div>
          </div>

          <div className="flex justify-center gap-6 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            {/* Placeholders for client logos if we had them */}
          </div>
        </div>
      </div>

      {/* Right Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-[#1e3a8a] relative items-center justify-center p-12 overflow-hidden text-white">
        {/* Background Circles */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full border border-white/10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/10" />
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-lg w-full">
          <h2 className="text-4xl font-bold mb-12 tracking-tight leading-tight">
            Your Operating System for <br />
            <span className="text-blue-200">Customer Excellence</span>
          </h2>

          {/* Central Graphic */}
          <div className="relative w-80 h-80 mb-12">
            {/* Central Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 bg-white text-slate-900 rounded-2xl shadow-2xl p-4 w-48 flex flex-col items-center gap-2 animate-in zoom-in duration-500">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
              <div className="bg-slate-100 h-2 w-24 rounded-full" />
              <div className="bg-slate-100 h-2 w-16 rounded-full" />
              <div className="bg-blue-50 text-blue-700 text-xs font-bold px-2 py-1 rounded mt-1">Admin Portal</div>
            </div>

            {/* Satellite Nodes */}
            {FEATURE_DOTS.map((dot, i) => (
              <div
                key={i}
                className="absolute w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex flex-col items-center justify-center cursor-pointer hover:bg-white hover:text-blue-900 transition-all duration-300 group hover:scale-110 shadow-lg"
                style={{
                  top: dot.y,
                  left: dot.x,
                  transform: 'translate(-50%, -50%)',
                  animationDelay: `${i * 100}ms`
                }}
              >
                <dot.icon size={20} className="mb-1 text-white/80 group-hover:text-blue-600" />
                <span className="text-[10px] font-medium opacity-0 group-hover:opacity-100 absolute -bottom-5 transition-opacity whitespace-nowrap bg-black/50 px-2 py-0.5 rounded text-white">{dot.label}</span>
              </div>
            ))}

            {/* Connecting Lines (Decorational) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20 stroke-white" style={{ strokeDasharray: '4 4' }}>
              <line x1="50%" y1="50%" x2="50%" y2="15%" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="85%" y2="35%" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="85%" y2="65%" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="50%" y2="85%" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="15%" y2="65%" strokeWidth="1" />
              <line x1="50%" y1="50%" x2="15%" y2="35%" strokeWidth="1" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
