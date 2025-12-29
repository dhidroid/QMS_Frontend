import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Drawer = ({ open, onClose, children, title }) => {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 flex">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-black/40" />

          <motion.aside initial={{ x: 400 }} animate={{ x: 0 }} exit={{ x: 400 }} transition={{ type: 'tween', duration: 0.18 }} className="ml-auto w-full max-w-md bg-white h-full shadow-2xl">
            <div className="p-4 border-b flex items-center justify-between">
              <div>
                <div className="text-sm text-slate-500">{title}</div>
              </div>
              <button onClick={onClose} className="text-slate-500">Close</button>
            </div>
            <div className="p-4 overflow-auto">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
