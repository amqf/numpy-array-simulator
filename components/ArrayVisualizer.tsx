import React from 'react';
import { ArrayData, HighlightState } from '../types';
import { getFlatIndex } from '../utils/numpyEngine';
import { Cuboid, ArrowRight } from 'lucide-react';

interface ArrayVisualizerProps {
  data: ArrayData;
  highlight: HighlightState;
  setHighlight: (h: HighlightState) => void;
  sliceIdx: number;
  setSliceIdx: (i: number) => void;
}

const ArrayVisualizer: React.FC<ArrayVisualizerProps> = ({ 
  data, 
  highlight, 
  setHighlight,
  sliceIdx,
  setSliceIdx
}) => {
  const { shape, ndim, strides, itemsize } = data.stats;

  // Helper to render a single cell
  const renderCell = (_: number, ndIndices: number[]) => {
    // We calculate the flat index dynamically based on strides to support C and F order
    const flatIdx = getFlatIndex(ndIndices, strides, itemsize);
    
    // Safety check for invalid strides/shapes
    if (flatIdx >= data.flatData.length || flatIdx < 0) return null;

    const displayVal = data.flatData[flatIdx];
    const isHighlighted = highlight.flatIndex === flatIdx;
    
    return (
      <div
        key={ndIndices.join('-')}
        onMouseEnter={() => setHighlight({ flatIndex: flatIdx, ndIndex: ndIndices, source: 'grid' })}
        onMouseLeave={() => setHighlight({ flatIndex: null, ndIndex: null, source: null })}
        className={`
          relative flex items-center justify-center border rounded transition-all duration-150 cursor-pointer
          ${isHighlighted 
            ? 'bg-numpy-blue text-white border-blue-300 shadow-lg scale-110 z-10' 
            : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'}
        `}
        style={{ width: '40px', height: '40px' }}
      >
        <span className="text-sm font-mono">{displayVal}</span>
        {isHighlighted && (
           <div className="absolute -top-10 bg-slate-900 border border-slate-700 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20 pointer-events-none shadow-xl">
             <div className="text-[10px] text-slate-400">Idx</div>
             ({ndIndices.join(', ')})
           </div>
        )}
      </div>
    );
  };

  // 1D Renderer - Strictly linear
  const render1D = () => {
    return (
      <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
        <div className="flex gap-1 px-8 min-w-max">
          <div className="flex flex-col justify-center mr-2">
            <span className="text-xs text-slate-500 font-mono">Axis 0 →</span>
          </div>
          {Array.from({length: shape[0]}).map((_, i) => renderCell(0, [i]))}
        </div>
      </div>
    );
  };

  // 2D Renderer
  const render2D = (baseIndices: number[] = []) => {
    const rows = shape[shape.length - 2];
    const cols = shape[shape.length - 1];
    
    const grid = [];
    for (let r = 0; r < rows; r++) {
      const rowCells = [];
      for (let c = 0; c < cols; c++) {
        // Construct full N-dim index. 
        // If 2D: [r, c]
        // If 3D sliced: [slice, r, c]
        const currentIndices = [...baseIndices, r, c];
        rowCells.push(renderCell(0, currentIndices));
      }
      grid.push(
        <div key={r} className="flex gap-1">
          <div className="w-6 flex items-center justify-end pr-2 text-xs text-slate-500 font-mono">{r}</div>
          {rowCells}
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1 inline-block border border-slate-700 p-2 rounded bg-slate-800/30 backdrop-blur-sm">
        <div className="flex gap-1 ml-6 mb-1">
          {Array.from({length: cols}).map((_, i) => (
            <div key={i} className="w-[40px] text-center text-xs text-slate-500 font-mono">{i}</div>
          ))}
        </div>
        {grid}
        <div className="text-center text-xs text-slate-500 mt-2 font-mono flex justify-center items-center gap-1">
           <ArrowRight size={12} /> Axis {ndim - 1}
        </div>
        <div className="absolute -left-8 top-1/2 -rotate-90 text-xs text-slate-500 font-mono flex items-center gap-1">
           <ArrowRight size={12} /> Axis {ndim - 2}
        </div>
      </div>
    );
  };

  // 3D Renderer (Sliced)
  const render3D = () => {
    const depth = shape[0];
    // Ensure slice is valid (handled by parent mostly, but safe guard here)
    const currentSlice = Math.min(sliceIdx, depth - 1);
    
    return (
      <div className="flex flex-col items-center gap-6 w-full max-w-2xl">
        <div className="w-full flex items-center gap-4 bg-slate-900/80 p-3 rounded-lg border border-slate-700 shadow-sm">
          <span className="text-sm text-slate-300 font-mono font-bold">Axis 0 (Depth)</span>
          <input 
            type="range" 
            min="0" 
            max={depth - 1} 
            value={currentSlice}
            onChange={(e) => setSliceIdx(parseInt(e.target.value))}
            className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-numpy-blue"
          />
          <span className="text-numpy-blue font-bold font-mono text-lg w-8 text-center">{currentSlice}</span>
        </div>

        <div className="relative p-8 border-2 border-dashed border-slate-700/50 rounded-xl bg-slate-900/30">
           <div className="absolute top-0 left-0 bg-slate-800 text-numpy-blue px-3 py-1 text-xs font-mono font-bold rounded-tl-xl rounded-br-xl border-r border-b border-slate-700">
             arr[{currentSlice}, :, :]
           </div>
           
           {/* Reuse 2D logic but pass the 3rd dimension index */}
           {render2D([currentSlice])}
        </div>
        
        <div className="text-center text-xs text-slate-500 max-w-md">
          <p>
            You are viewing a 2D slice of the 3D block. <br/>
            Moving the slider changes the <span className="text-numpy-blue font-bold">Axis 0</span> index.
          </p>
        </div>
      </div>
    );
  };

  const renderHigherDim = () => {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8 text-slate-400">
        <Cuboid size={64} className="mb-6 text-slate-700" />
        <h3 className="text-xl font-bold text-slate-200">4D+ Hypercube</h3>
        <p className="max-w-md mt-4 text-sm leading-relaxed text-slate-400">
          The human brain struggles to visualize spatial dimensions above 3. 
          However, NumPy treats 4D, 5D, or nD arrays exactly the same way using 
          <span className="text-emerald-400 font-mono mx-1">strides</span>.
        </p>
      </div>
    )
  }

  return (
    <div className="flex-1 bg-slate-950 flex flex-col relative overflow-hidden">
      {/* Viewport Header */}
      <div className="absolute top-4 left-4 z-10 flex gap-2 pointer-events-none">
        <div className="px-3 py-1 bg-slate-800/90 backdrop-blur border border-slate-700 rounded-full text-xs font-mono text-slate-300 shadow-lg">
           Mode: <span className="text-white font-bold">{ndim}D Visualization</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center overflow-auto custom-scrollbar p-8">
        {ndim === 1 && render1D()}
        {ndim === 2 && render2D()}
        {ndim === 3 && render3D()}
        {ndim > 3 && renderHigherDim()}
      </div>
    </div>
  );
};

export default ArrayVisualizer;