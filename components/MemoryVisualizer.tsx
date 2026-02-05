import React from 'react';
import { ArrayData, HighlightState } from '../types';
import { getNDIndex } from '../utils/numpyEngine';

interface MemoryVisualizerProps {
  data: ArrayData;
  highlight: HighlightState;
  setHighlight: (h: HighlightState) => void;
  activeSliceIdx: number;
}

const MemoryVisualizer: React.FC<MemoryVisualizerProps> = ({ 
  data, 
  highlight, 
  setHighlight,
  activeSliceIdx
}) => {
  const { flatData, dtype, stats } = data;
  
  // Dynamic sizing
  const blockSize = flatData.length > 50 ? 24 : 36;
  
  const handleHover = (idx: number) => {
    const order = stats.flags.c_contiguous ? 'C' : 'F';
    const ndIndex = getNDIndex(idx, stats.shape, order);
    setHighlight({ flatIndex: idx, ndIndex, source: 'memory' });
  };

  return (
    <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-800 shadow-inner overflow-hidden flex flex-col gap-2 h-full">
      <div className="flex justify-between items-center shrink-0">
        <div className="flex items-center gap-2">
           <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <h3 className="text-xs uppercase tracking-widest text-emerald-400 font-bold">Physical Memory (RAM)</h3>
        </div>
        <div className="text-[10px] font-mono text-slate-500 border border-slate-800 px-2 py-1 rounded bg-slate-900">
          Base: {stats.base_address} | Block: {stats.itemsize}B
        </div>
      </div>

      <div className="relative w-full overflow-x-auto overflow-y-hidden custom-scrollbar flex-1 flex items-center">
        <div className="flex items-center px-4">
           {/* Start Indicator */}
           <div className="mr-4 text-[10px] font-mono text-slate-600 flex flex-col items-center gap-1">
             <div className="w-px h-8 bg-slate-700"></div>
             0x00
           </div>

           {/* Memory Blocks */}
           <div className="flex gap-1">
             {flatData.map((val, idx) => {
               const isHighlighted = highlight.flatIndex === idx;
               
               // Determine visibility based on current 3D slice
               const order = stats.flags.c_contiguous ? 'C' : 'F';
               const ndIdx = getNDIndex(idx, stats.shape, order);
               
               // If it is 3D, check if this block belongs to the active slice (Axis 0)
               // If ndim != 3, we show everything (active = true)
               const isActiveInSlice = stats.ndim === 3 ? ndIdx[0] === activeSliceIdx : true;

               return (
                 <div 
                   key={idx}
                   onMouseEnter={() => handleHover(idx)}
                   onMouseLeave={() => setHighlight({ flatIndex: null, ndIndex: null, source: null })}
                   className={`
                     relative flex flex-col items-center justify-center transition-all duration-200 cursor-crosshair group
                     ${isHighlighted ? 'z-10 -translate-y-2 scale-110' : ''}
                     ${isActiveInSlice ? 'opacity-100' : 'opacity-20 grayscale'}
                   `}
                   style={{ width: blockSize }}
                 >
                   {/* Byte Address Marker (only show some to avoid clutter) */}
                   {idx % 5 === 0 && isActiveInSlice && (
                      <div className="text-[8px] font-mono text-slate-700 absolute -top-4 whitespace-nowrap opacity-50">
                        +{idx * stats.itemsize}
                      </div>
                   )}

                   {/* The Data Block */}
                   <div 
                     className={`
                       w-full aspect-square border rounded flex items-center justify-center text-[10px] font-mono select-none
                       ${isHighlighted 
                         ? 'bg-emerald-500 border-emerald-300 text-black shadow-[0_0_15px_rgba(16,185,129,0.5)]' 
                         : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'}
                     `}
                   >
                     {val}
                   </div>
                   
                   {/* Index Marker */}
                   {isActiveInSlice && (
                     <div className={`mt-1 text-[8px] font-mono transition-colors ${isHighlighted ? 'text-emerald-400 font-bold' : 'text-slate-700 group-hover:text-slate-500'}`}>
                       {idx}
                     </div>
                   )}
                 </div>
               )
             })}
           </div>

           {/* End Indicator */}
            <div className="ml-4 text-[10px] font-mono text-slate-600 flex flex-col items-center gap-1">
             <div className="w-px h-8 bg-slate-700"></div>
             EOS
           </div>
        </div>
      </div>
      
       <div className="text-[10px] text-slate-500 font-mono text-center shrink-0 flex items-center justify-center gap-4">
          <span>Contiguity: <span className={stats.flags.c_contiguous ? "text-numpy-blue" : "text-slate-600"}>C (Rows)</span> | <span className={stats.flags.f_contiguous ? "text-numpy-blue" : "text-slate-600"}>F (Cols)</span></span>
          {stats.ndim === 3 && (
            <span className="text-slate-600 italic">(Dimmed items are in hidden slices)</span>
          )}
       </div>
    </div>
  );
};

export default MemoryVisualizer;