export type DType = 'int8' | 'int16' | 'int32' | 'int64' | 'float32' | 'float64';

export interface ArrayStats {
  ndim: number;
  shape: number[];
  strides: number[];
  size: number;
  itemsize: number;
  nbytes: number;
  flags: {
    c_contiguous: boolean;
    f_contiguous: boolean;
    owndata: boolean;
    writeable: boolean;
  };
  base_address: string; // Mock address
}

export interface ArrayData {
  flatData: number[]; // The linear memory representation
  stats: ArrayStats;
  dtype: DType;
}

export interface HighlightState {
  flatIndex: number | null;
  ndIndex: number[] | null;
  source: 'memory' | 'grid' | null;
}
