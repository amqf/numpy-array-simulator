import React from 'react';
import { ArrayData } from '../types';
import { Info, Microscope } from 'lucide-react';

interface InspectorProps {
  data: ArrayData;
}

const Inspector: React.FC<InspectorProps> = ({ data }) => {
  const { stats, dtype } = data;

  return (
    <div className="bg-slate-900 border-l border-slate-800 p-4 flex flex-col h-full overflow-y-auto font-mono text-sm">
      <div className="flex items-center gap-2 text-purple-400 font-bold text-lg mb-4 font-sans">
        <Microscope size={20} />
        <h2>Inspector</h2>
      </div>

      <div className="space-y-6">
        {/* Basic Attributes */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800 pb-1">Attributes</h3>
          <div className="grid grid-cols-2 gap-y-2">
            <span className="text-slate-400">ndim</span>
            <span className="text-dracula-purple">{stats.ndim}</span>
            
            <span className="text-slate-400">shape</span>
            <span className="text-dracula-cyan">({stats.shape.join(', ')})</span>
            
            <span className="text-slate-400">size</span>
            <span className="text-dracula-orange">{stats.size}</span>
            
            <span className="text-slate-400">dtype</span>
            <span className="text-dracula-yellow">{dtype}</span>
            
            <span className="text-slate-400">itemsize</span>
            <span className="text-white">{stats.itemsize} bytes</span>
            
            <span className="text-slate-400">nbytes</span>
            <span className="text-dracula-pink font-bold">{stats.nbytes} bytes</span>
          </div>
        </div>

        {/* Strides - The critical educational part */}
        <div className="space-y-2">
           <div className="flex items-center justify-between border-b border-slate-800 pb-1">
             <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Strides</h3>
             <div className="group relative">
               <Info size={14} className="text-slate-600 cursor-help" />
               <div className="absolute right-0 w-48 p-2 bg-slate-800 border border-slate-700 text-xs text-slate-300 rounded shadow-xl hidden group-hover:block z-50">
                 Bytes to step in each dimension to reach the next element.
               </div>
             </div>
           </div>
           
           <div className="bg-slate-950 p-3 rounded border border-slate-800 text-slate-300">
             <span className="text-slate-500">strides: </span>
             <span className="text-dracula-green">({stats.strides.join(', ')})</span>
           </div>
           
           <div className="text-xs text-slate-500">
             To move 1 step in axis {stats.ndim - 1}, jump {stats.strides[stats.ndim-1]} bytes.
             {stats.ndim > 1 && (
               <> To move 1 step in axis 0, jump {stats.strides[0]} bytes.</>
             )}
           </div>
        </div>

        {/* Flags */}
        <div className="space-y-2">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800 pb-1">Flags</h3>
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-slate-400">C_CONTIGUOUS</span>
              <span className={stats.flags.c_contiguous ? "text-green-400" : "text-red-400"}>
                {stats.flags.c_contiguous.toString()}
              </span>
            </div>
             <div className="flex justify-between">
              <span className="text-slate-400">F_CONTIGUOUS</span>
              <span className={stats.flags.f_contiguous ? "text-green-400" : "text-red-400"}>
                {stats.flags.f_contiguous.toString()}
              </span>
            </div>
             <div className="flex justify-between">
              <span className="text-slate-400">OWNDATA</span>
              <span className={stats.flags.owndata ? "text-green-400" : "text-red-400"}>
                {stats.flags.owndata.toString()}
              </span>
            </div>
          </div>
        </div>
        
         {/* Internal Memory */}
        <div className="space-y-2">
           <h3 className="text-xs uppercase tracking-wider text-slate-500 font-semibold border-b border-slate-800 pb-1">Internals</h3>
           <div className="text-xs font-mono">
             <span className="text-slate-400">__array_interface__.data:</span>
             <br/>
             <span className="text-blue-400">({stats.base_address}, False)</span>
           </div>
        </div>

      </div>
    </div>
  );
};

export default Inspector;