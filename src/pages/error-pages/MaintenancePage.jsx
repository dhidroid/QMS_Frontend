import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../design-system/atoms/Button';
import { Construction } from 'lucide-react';
import logo from '../../assets/logo.svg';
import Footer from '../../components/Footer';

const MaintenancePage = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col font-sans text-white relative overflow-hidden">
       {/* Striped Background */}
       <div className="absolute inset-0 opacity-10" style={{
           backgroundImage: 'repeating-linear-gradient(45deg, #000 0, #000 20px, #1f2937 20px, #1f2937 40px)'
       }} />

       <div className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
         <div className="w-32 h-32 bg-amber-500 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.3)] flex items-center justify-center mb-10 animate-pulse">
             <Construction className="w-16 h-16 text-black" />
         </div>
         
         <div className="space-y-4 max-w-lg">
            <h2 className="text-4xl font-bold tracking-tight">Under Maintenance</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
               We're improving our system to serve you better. We'll be back online shortly.
            </p>
         </div>

         <div className="mt-12 p-4 bg-white/5 rounded-lg border border-white/10 max-w-sm w-full">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                  <img src={logo} alt="Logo" className="w-6 h-6 brightness-200 grayscale" />
               </div>
               <div className="text-left">
                  <div className="text-sm font-semibold text-white">QMS Status</div>
                  <div className="text-xs text-amber-400 font-medium">System Update in Progress</div>
               </div>
            </div>
         </div>
       </div>

       <div className="py-8 z-10 border-t border-white/5 bg-black/20">
         <Footer className="bg-transparent text-white/40" />
       </div>
    </div>
  );
};

export default MaintenancePage;
