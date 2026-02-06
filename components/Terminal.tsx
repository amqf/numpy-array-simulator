import React from 'react';
import { ArrayData } from '../types';
import { Terminal as TerminalIcon, Calculator } from 'lucide-react';

interface TerminalProps {
  data: ArrayData;
}

const Terminal: React.FC<TerminalProps> = ({ data }) => {
  const { stats } = data;

  const renderMathBreakdown = () => {
    if (stats.ndim > 3) return <div className="text-slate-500 text-xs italic">Address calculation valid for all dimensions.</div>;
    
    return (
      <div className="mt-4 border-t border-[#333] pt-4">
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold mb-3">
          <Calculator size={14} />
          <span>MEMORY ADDRESS CALCULATOR</span>
        </div>
        
        <div className="font-mono text-xs text-slate-400 mb-2">
          address = base_ptr + <span className="text-white">∑ (index[i] × stride[i])</span>
        </div>

        <div className="bg-[#111] p-3 rounded border border-slate-800 font-mono text-xs overflow-x-auto">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-slate-500">Offset = </span>
            {stats.strides.map((stride, i) => (
              <React.Fragment key={i}>
                {i > 0 && <span className="text-slate-600"> + </span>}
                <span className="group relative cursor-help">
                  <span className="text-numpy-blue">(i<sub>{i}</sub></span>
                  <span className="text-slate-400"> × </span>
                  <span className="text-dracula-green">{stride})</span>
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block bg-slate-800 text-white p-2 rounded z-50 shadow-xl border border-slate-700">
                    Axis {i} stride: {stride} bytes
                  </div>
                </span>
              </React.Fragment>
            ))}
          </div>
        </div>
        
        <div className="mt-2 text-[10px] text-slate-500">
          * Where <span className="text-numpy-blue">i<sub>n</sub></span> is the index at axis n. Result is in <span className="text-dracula-green">bytes</span>.
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#1e1e1e] border-t border-slate-800 font-mono text-sm">
      <div className="flex items-center justify-between px-4 py-1 bg-[#252526] border-b border-[#333]">
        <div className="flex items-center gap-2 text-slate-300">
           <TerminalIcon size={14} />
           <span className="text-xs">SIMULATION TERMINAL</span>
        </div>
        <div className="text-[10px] text-slate-500">Python 3.11 (Simulated)</div>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Editor Side */}
        <div className="w-1/2 border-r border-[#333] p-4 text-slate-300 overflow-auto custom-scrollbar">
          <pre className="whitespace-pre-wrap font-mono leading-relaxed text-xs sm:text-sm">
            <span className="text-dracula-pink">import</span> <span className="text-white">numpy</span> <span className="text-dracula-pink">as</span> <span className="text-white">np</span>
            {'\n\n'}
            <span className="text-slate-500"># 1. Create Linear Data</span>
            {'\n'}
            <span className="text-white">raw</span> <span className="text-dracula-pink">=</span> <span className="text-white">np.arange</span>(<span className="text-dracula-purple">{data.stats.size}</span>)
            {'\n\n'}
            <span className="text-slate-500"># 2. Define Structure (View)</span>
            {'\n'}
            <span className="text-white">arr</span> <span className="text-dracula-pink">=</span> <span className="text-white">raw.reshape</span>(
              <span className="text-dracula-purple">({data.stats.shape.join(', ')})</span>, 
              <span className="text-dracula-orange">order='{data.stats.flags.c_contiguous ? 'C' : 'F'}'</span>
            )
             {'\n'}
            <span className="text-white">arr</span> <span className="text-dracula-pink">=</span> <span className="text-white">arr.astype</span>(<span className="text-dracula-yellow">'{data.dtype}'</span>)
          </pre>
        </div>

        {/* Output Side & Math */}
         <div className="w-1/2 p-4 bg-[#1e1e1e] text-slate-300 overflow-auto custom-scrollbar relative">
           <div className="text-slate-500 mb-2 text-xs">$ inspect(arr)</div>
           <div className="text-white whitespace-pre-wrap break-all text-xs">
             {data.stats.ndim === 1 ? (
               `array([${data.flatData.join(', ')}], dtype=${data.dtype})`
             ) : (
                `array(..., shape=(${data.stats.shape.join(',')}), dtype=${data.dtype})`
             )}
           </div>

           {renderMathBreakdown()}
         </div>
      </div>
    </div>
  );
};

export default Terminal;