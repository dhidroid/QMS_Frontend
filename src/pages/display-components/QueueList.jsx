import React from 'react';
import { Card } from '../../design-system/atoms/Card';
import { motion } from 'framer-motion';

const QueueList = ({ queue = [] }) => {
  return (
    <div className="h-full flex flex-col bg-zinc-900 border-r border-zinc-800">
       <div className="p-6 border-b border-zinc-800 bg-zinc-900 sticky top-0 z-10">
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
             <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
             Up Next
          </h2>
       </div>
       
       <div className="flex-1 overflow-auto p-4">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-zinc-500 text-sm uppercase tracking-wider border-b border-zinc-800">
                <th className="pb-4 font-medium pl-4">Token</th>
                <th className="pb-4 font-medium text-right pr-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {queue.length === 0 ? (
                 <tr>
                   <td colSpan="2" className="py-8 text-center text-zinc-600 text-lg">No pending tokens</td>
                 </tr>
              ) : (
                 queue.slice(0, 8).map((token, index) => (
                    <motion.tr
                       key={token.TokenGuid}
                       initial={{ opacity: 0, x: -10 }}
                       animate={{ opacity: 1, x: 0 }}
                       transition={{ delay: index * 0.05 }}
                       className="group hover:bg-zinc-800/30 transition-colors"
                    >
                       <td className="py-5 pl-4 text-3xl font-bold text-zinc-300 font-mono">
                         #{token.TokenNumber}
                       </td>
                       <td className="py-5 pr-4 text-right">
                         <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-400 text-xs font-bold uppercase tracking-wide group-hover:bg-zinc-700 transition-colors">
                           Waiting
                         </span>
                       </td>
                    </motion.tr>
                 ))
              )}
            </tbody>
          </table>
       </div>
    </div>
  );
};

export default QueueList;
