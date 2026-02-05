import React, { useState, useEffect, useMemo } from 'react';
import ControlPanel from './components/ControlPanel';
import Inspector from './components/Inspector';
import Terminal from './components/Terminal';
import MemoryVisualizer from './components/MemoryVisualizer';
import ArrayVisualizer from './components/ArrayVisualizer';
import { generateArrayData } from './utils/numpyEngine';
import { DType, HighlightState } from './types';
import { BoxSelect } from 'lucide-react';

const App: React.FC = () => {
  // Application State
  const [shape, setShape] = useState<number[]>([2, 3, 4]); // Default 3D
  const [dtype, setDtype] = useState<DType>('int64');
  const [order, setOrder] = useState<'C' | 'F'>('C');
  const [highlight, setHighlight] = useState<HighlightState>({ flatIndex: null, ndIndex: null, source: null });
  
  // Shared state for slicing (primarily for 3D visualization)
  const [sliceIdx, setSliceIdx] = useState(0);

  // Reset slice index when shape changes to avoid out-of-bounds
  useEffect(() => {
    setSliceIdx(0);
  }, [shape[0]]); // Depend on the first dimension size

  // Generate Data based on state
  const data = useMemo(() => {
    return generateArrayData(shape, dtype, order);
  }, [shape, dtype, order]);

  return (
    <div className="h-screen w-screen bg-slate-950 text-slate-200 flex flex-col font-sans">
      {/* Header */}
      <header className="h-14 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-numpy-blue to-numpy-dark w-8 h-8 rounded-md flex items-center justify-center shadow-lg">
             <span className="font-bold text-white text-xs">N</span>
          </div>
          <h1 className="font-bold text-lg tracking-tight">Array Lab <span className="font-normal text-slate-500">| NumPy Simulator</span></h1>
        </div>
        <div className="flex items-center gap-4 text-sm text-slate-400">
           <a href="#" className="hover:text-white transition">Docs</a>
           <div className="h-4 w-px bg-slate-700"></div>
           <span className="flex items-center gap-1 text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
             <BoxSelect size={12}/> Interactive Mode
           </span>
        </div>
      </header>

      {/* Main Content Grid */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left: Controls */}
        <div className="w-64 shrink-0 z-20">
          <ControlPanel 
            shape={shape} 
            setShape={setShape}
            dtype={dtype}
            setDtype={setDtype}
            order={order}
            setOrder={setOrder}
          />
        </div>

        {/* Center: Visualization */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950 relative">
          
          {/* Top: Geometric View */}
          <div className="flex-[3] relative border-b border-slate-800 min-h-0 flex flex-col">
             <ArrayVisualizer 
               data={data}
               highlight={highlight}
               setHighlight={setHighlight}
               sliceIdx={sliceIdx}
               setSliceIdx={setSliceIdx}
             />
          </div>

          {/* Middle: Memory View */}
          <div className="flex-[1] min-h-[160px] bg-slate-900 border-b border-slate-800 p-4 overflow-hidden flex flex-col z-10">
             <MemoryVisualizer 
               data={data}
               highlight={highlight}
               setHighlight={setHighlight}
               activeSliceIdx={sliceIdx}
             />
          </div>

          {/* Bottom: Terminal */}
          <div className="h-48 shrink-0">
             <Terminal data={data} />
          </div>
        </div>

        {/* Right: Inspector */}
        <div className="w-72 shrink-0 border-l border-slate-800 z-20">
          <Inspector data={data} />
        </div>
      </div>
    </div>
  );
};

export default App;