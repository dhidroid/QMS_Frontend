import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../design-system/atoms/Button';
import { AlertTriangle, Home, RefreshCw } from 'lucide-react';
import logo from '../../assets/logo.svg';
import Footer from '../../components/Footer';

const BadRequestPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
       <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
         <div className="w-24 h-24 bg-rose-50 rounded-2xl shadow-sm flex items-center justify-center mb-8 border border-rose-100">
             <AlertTriangle className="w-12 h-12 text-rose-500" />
         </div>
         
         <div className="space-y-4 max-w-md">
            <h1 className="text-6xl font-bold text-slate-900/10 select-none">400</h1>
            <h2 className="text-2xl font-bold text-slate-800">Bad Request</h2>
            <p className="text-slate-500">
               The server could not understand your request due to invalid syntax. Please try refreshing or contact support.
            </p>
         </div>

         <div className="flex items-center gap-4 mt-8">
            <Link to="/">
               <Button variant="outline" className="gap-2">
                 <Home size={18} />
                 Home
               </Button>
            </Link>
            <button onClick={() => window.location.reload()}>
                <Button className="gap-2">
                   <RefreshCw size={18} />
                   Refresh
                </Button>
            </button>
         </div>
       </div>

       <div className="py-6">
         <div className="flex items-center justify-center gap-2 text-slate-400 opacity-50 mb-2">
            <img src={logo} alt="Logo" className="w-6 h-6 grayscale" />
         </div>
         <Footer className="bg-transparent" />
       </div>
    </div>
  );
};

export default BadRequestPage;
