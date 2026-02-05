import { DType, ArrayData, ArrayStats } from '../types';

const DTYPE_SIZES: Record<DType, number> = {
  'int8': 1,
  'int16': 2,
  'int32': 4,
  'int64': 8,
  'float32': 4,
  'float64': 8
};

export const calculateStrides = (shape: number[], itemsize: number, order: 'C' | 'F' = 'C'): number[] => {
  const ndim = shape.length;
  const strides = new Array(ndim).fill(0);

  if (order === 'C') {
    // Row-major: Last dimension moves 1 item
    let stride = itemsize;
    for (let i = ndim - 1; i >= 0; i--) {
      strides[i] = stride;
      stride *= shape[i];
    }
  } else {
    // Column-major (Fortran): First dimension moves 1 item
    let stride = itemsize;
    for (let i = 0; i < ndim; i++) {
      strides[i] = stride;
      stride *= shape[i];
    }
  }

  return strides;
};

export const generateArrayData = (
  shape: number[], 
  dtype: DType, 
  order: 'C' | 'F' = 'C'
): ArrayData => {
  const size = shape.reduce((a, b) => a * b, 1);
  const itemsize = DTYPE_SIZES[dtype];
  const nbytes = size * itemsize;
  
  // Physical memory is always linear.
  // In a real scenario, changing order might change how we initialize, 
  // but for visualization, we assume the buffer is 0, 1, 2... and strides determine how we traverse it.
  const flatData = Array.from({ length: size }, (_, i) => i);
  
  const strides = calculateStrides(shape, itemsize, order);

  const stats: ArrayStats = {
    ndim: shape.length,
    shape: [...shape],
    strides: strides,
    size,
    itemsize,
    nbytes,
    flags: {
      c_contiguous: order === 'C',
      f_contiguous: order === 'F',
      owndata: true,
      writeable: true,
    },
    base_address: '0x100' // Simplified base address
  };

  return {
    flatData,
    stats,
    dtype
  };
};

// Generic converter: N-dim indices -> Flat Memory Index using Strides
// This is the "Heart" of NumPy
export const getFlatIndex = (indices: number[], strides: number[], itemsize: number): number => {
  let byteOffset = 0;
  for (let i = 0; i < indices.length; i++) {
    byteOffset += indices[i] * strides[i];
  }
  return byteOffset / itemsize;
};

// Reverse: Flat Index -> N-dim indices (Complex for F-order, keeping simple implementation for C-order visualization mostly)
// Note: This function is primarily used for the tooltip in memory view. 
// For F-order strictly, this reverse mapping is different, but for this sim we mostly map Grid -> Memory.
export const getNDIndex = (flatIndex: number, shape: number[], order: 'C' | 'F'): number[] => {
  const res = [];
  let current = flatIndex;
  
  if (order === 'C') {
    for (let i = shape.length - 1; i >= 0; i--) {
      res.unshift(current % shape[i]);
      current = Math.floor(current / shape[i]);
    }
  } else {
    // F-order reverse mapping
    for (let i = 0; i < shape.length; i++) {
      res.push(current % shape[i]);
      current = Math.floor(current / shape[i]);
    }
  }
  return res;
};