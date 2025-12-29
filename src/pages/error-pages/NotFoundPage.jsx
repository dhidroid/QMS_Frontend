import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../design-system/atoms/Button';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import logo from '../../assets/logo.svg';
import Footer from '../../components/Footer';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
       <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
         <div className="w-24 h-24 bg-white rounded-2xl shadow-xl flex items-center justify-center mb-8 border border-slate-100">
             <img src={logo} alt="Nato" className="w-16 h-16 object-contain" />
         </div>
         
         <div className="space-y-4 max-w-md">
            <h1 className="text-9xl font-bold text-slate-200 select-none">404</h1>
            <h2 className="text-3xl font-bold text-slate-800">Page Not Found</h2>
            <p className="text-slate-500">
               Sorry, the page you are looking for doesn't exist or has been moved.
            </p>
         </div>

         <div className="flex items-center gap-4 mt-8">
            <Link to="/">
               <Button variant="outline" className="gap-2">
                 <Home size={18} />
                 Home
               </Button>
            </Link>
            <button onClick={() => window.history.back()}>
                <Button className="gap-2">
                   <ArrowLeft size={18} />
                   Go Back
                </Button>
            </button>
         </div>
       </div>

       <div className="py-6">
         <Footer className="bg-transparent" />
       </div>
    </div>
  );
};

export default NotFoundPage;
