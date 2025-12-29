import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../design-system/atoms/Card';
import Button from '../design-system/atoms/Button';
import { AlertTriangle, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="w-full max-w-md"
        >
          <Card className="border-none shadow-2xl">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="flex items-center gap-2 text-amber-600">
                <AlertTriangle size={24} />
                <CardTitle className="text-lg text-foreground">{title || 'Confirm Action'}</CardTitle>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </CardHeader>

            <CardContent className="py-4">
              <p className="text-muted-foreground">{message || 'Are you sure you want to proceed?'}</p>
            </CardContent>

            <CardFooter className="justify-end gap-3 pt-2">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button variant="destructive" onClick={onConfirm}>Confirm</Button>
            </CardFooter>
          </Card>
        </motion.div>
        </div>
    </AnimatePresence>
  );
};

export default ConfirmModal;
