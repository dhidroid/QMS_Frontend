import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { Card, CardContent } from '../../design-system/atoms/Card'; // Assuming path relative to where this file will be

const NowServing = ({ token }) => {
  if (!token) {
    return (
      <Card className="h-full flex items-center justify-center bg-zinc-900 border-zinc-800 shadow-2xl">
        <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-zinc-700 tracking-wider uppercase">Waiting for next token</h1>
        </div>
      </Card>
    );
  }

  return (
    <Card className="h-full flex flex-col items-center justify-center bg-zinc-900 border-zinc-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden">
       {/* Background Pulse Effect */}
       <div className="absolute inset-0 bg-primary/10 animate-pulse pointer-events-none" />
       
       <AnimatePresence mode="wait">
         <motion.div
            key={token.TokenGuid}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.1, opacity: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="z-10 text-center space-y-4"
         >
            <div className="text-2xl md:text-4xl text-zinc-400 font-medium uppercase tracking-widest mb-4">Now Serving</div>
            
            <div className="text-[8rem] md:text-[12rem] font-bold text-white leading-none tracking-tighter tabular-nums drop-shadow-2xl">
               {token.TokenNumber}
            </div>
            
            <div className="w-full h-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent my-8 opacity-50" />

            <div className="space-y-2">
               <div className="text-xl md:text-2xl text-zinc-400 uppercase tracking-wider">Please proceed to</div>
               <div className="text-4xl md:text-6xl font-bold text-primary animate-pulse">
                  {token.CounterName || 'Counter'}
               </div>
            </div>
         </motion.div>
       </AnimatePresence>
    </Card>
  );
};

export default NowServing;
