import React from 'react';
import { DType } from '../types';
import { Layers, Box, Cpu } from 'lucide-react';

interface ControlPanelProps {
  shape: number[];
  setShape: (s: number[]) => void;
  dtype: DType;
  setDtype: (d: DType) => void;
  order: 'C' | 'F';
  setOrder: (o: 'C' | 'F') => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  shape,
  setShape,
  dtype,
  setDtype,
  order,
  setOrder
}) => {

  const handleDimensionChange = (idx: number, val: number) => {
    const newShape = [...shape];
    // Limit dimensions for visual sanity in browser
    newShape[idx] = Math.max(1, Math.min(val, 12)); 
    setShape(newShape);
  };

  const addDimension = () => {
    if (shape.length < 4) setShape([...shape, 2]);
  };

  const removeDimension = () => {
    if (shape.length > 1) setShape(shape.slice(0, -1));
  };

  return (
    <div className="bg-slate-900 border-r border-slate-800 p-4 flex flex-col gap-6 h-full overflow-y-auto">
      <div className="flex items-center gap-2 text-numpy-blue font-bold text-lg mb-2">
        <Layers size={20} />
        <h2>Structure</h2>
      </div>

      {/* Dimensions Control */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium text-slate-400">Shape / Dimensions</label>
          <div className="flex gap-1">
             <button 
              onClick={removeDimension}
              disabled={shape.length <= 1}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded transition"
            >
              - Dim
            </button>
            <button 
              onClick={addDimension}
              disabled={shape.length >= 4}
              className="px-2 py-1 text-xs bg-slate-800 hover:bg-slate-700 disabled:opacity-50 rounded transition"
            >
              + Dim
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {shape.map((dim, idx) => (
            <div key={idx} className="bg-slate-800/50 p-3 rounded-lg border border-slate-700/50">
              <div className="flex justify-between text-xs text-slate-400 mb-1">
                <span>Axis {idx}</span>
                <span className="font-mono text-white">{dim}</span>
              </div>
              <input
                type="range"
                min="1"
                max="12"
                value={dim}
                onChange={(e) => handleDimensionChange(idx, parseInt(e.target.value))}
                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-numpy-blue"
              />
            </div>
          ))}
        </div>
        
        <div className="text-center font-mono text-sm text-slate-300 bg-slate-950 py-2 rounded border border-slate-800">
           shape = ({shape.join(', ')})
        </div>
      </div>

      <hr className="border-slate-800" />

      {/* DType Control */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-numpy-yellow font-semibold text-md">
          <Cpu size={18} />
          <h3>Data Type</h3>
        </div>
        <select 
          value={dtype}
          onChange={(e) => setDtype(e.target.value as DType)}
          className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-md p-2 focus:ring-2 focus:ring-numpy-blue focus:outline-none"
        >
          <option value="int8">int8 (1 byte)</option>
          <option value="int16">int16 (2 bytes)</option>
          <option value="int32">int32 (4 bytes)</option>
          <option value="int64">int64 (8 bytes)</option>
          <option value="float32">float32 (4 bytes)</option>
          <option value="float64">float64 (8 bytes)</option>
        </select>
        <p className="text-xs text-slate-500">
          Changing dtype affects memory stride calculations and total allocation.
        </p>
      </div>

      <hr className="border-slate-800" />

       {/* Memory Layout Control */}
       <div className="space-y-3">
        <div className="flex items-center gap-2 text-emerald-400 font-semibold text-md">
          <Box size={18} />
          <h3>Memory Layout</h3>
        </div>
        <div className="flex bg-slate-800 rounded-md p-1">
          <button
            onClick={() => setOrder('C')}
            className={`flex-1 py-1.5 text-xs font-medium rounded ${order === 'C' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            C-Contiguous
          </button>
          <button
            onClick={() => setOrder('F')}
            className={`flex-1 py-1.5 text-xs font-medium rounded ${order === 'F' ? 'bg-slate-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}
          >
            F-Contiguous
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Row-major (C) vs Column-major (Fortran). Controls how N-dim indices map to linear memory.
        </p>
      </div>
    </div>
  );
};

export default ControlPanel;