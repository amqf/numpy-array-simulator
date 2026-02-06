import { DType, ArrayData, ArrayStats } from '../types';

/**
 * Tamanho em bytes de cada tipo de dado NumPy
 */
const DTYPE_SIZES: Record<DType, number> = {
  'int8': 1,
  'int16': 2,
  'int32': 4,
  'int64': 8,
  'float32': 4,
  'float64': 8
} as const;

/**
 * Calcula os strides (passos) para um array NumPy
 * 
 * Strides definem quantos BYTES devem ser pulados na memória para mover
 * para o próximo elemento em cada dimensão.
 * 
 * @param shape - Dimensões do array (ex: [2, 3] para matriz 2x3)
 * @param itemsize - Tamanho em bytes de cada elemento
 * @param order - 'C' para row-major (padrão), 'F' para column-major (Fortran)
 * @returns Array de strides em bytes
 * 
 * @example
 * // Para um array float32 (4 bytes) com shape [2, 3] em C-order:
 * calculateStrides([2, 3], 4, 'C') // retorna [12, 4]
 * // Para acessar [1, 0]: offset = 1*12 + 0*4 = 12 bytes
 */
export const calculateStrides = (
  shape: number[], 
  itemsize: number, 
  order: 'C' | 'F' = 'C'
): number[] => {
  // Validações
  if (shape.length === 0) return [];
  
  if (shape.some(dim => dim <= 0)) {
    throw new Error('All shape dimensions must be positive');
  }

  const ndim = shape.length;
  const strides = new Array(ndim);
  
  if (order === 'C') {
    // Row-major (C-order): última dimensão varia mais rápido
    // Stride da última dimensão = itemsize
    // Cada dimensão anterior multiplica pelo tamanho da dimensão seguinte
    let stride = itemsize;
    for (let i = ndim - 1; i >= 0; i--) {
      strides[i] = stride;
      stride *= shape[i];
    }
  } else {
    // Column-major (F-order/Fortran): primeira dimensão varia mais rápido
    // Stride da primeira dimensão = itemsize
    // Cada dimensão seguinte multiplica pelo tamanho da dimensão anterior
    let stride = itemsize;
    for (let i = 0; i < ndim; i++) {
      strides[i] = stride;
      stride *= shape[i];
    }
  }
  
  return strides;
};

/**
 * Verifica se um array está em C-contiguous layout (row-major contíguo)
 * Um array é C-contiguous se os elementos estão armazenados em ordem row-major
 * sem lacunas na memória.
 * 
 * @internal
 */
const checkCContiguous = (
  shape: number[], 
  strides: number[], 
  itemsize: number
): boolean => {
  if (shape.length === 0) return true;
  
  // Verifica de trás para frente
  let expectedStride = itemsize;
  for (let i = shape.length - 1; i >= 0; i--) {
    // Ignora dimensões de tamanho 1 (triviais)
    if (shape[i] > 1 && strides[i] !== expectedStride) {
      return false;
    }
    expectedStride *= shape[i];
  }
  
  return true;
};

/**
 * Verifica se um array está em F-contiguous layout (column-major contíguo)
 * Um array é F-contiguous se os elementos estão armazenados em ordem column-major
 * sem lacunas na memória.
 * 
 * @internal
 */
const checkFContiguous = (
  shape: number[], 
  strides: number[], 
  itemsize: number
): boolean => {
  if (shape.length === 0) return true;
  
  // Verifica da frente para trás
  let expectedStride = itemsize;
  for (let i = 0; i < shape.length; i++) {
    // Ignora dimensões de tamanho 1 (triviais)
    if (shape[i] > 1 && strides[i] !== expectedStride) {
      return false;
    }
    expectedStride *= shape[i];
  }
  
  return true;
};

/**
 * Gera dados de um array NumPy simulado
 * 
 * Cria um array com dados sequenciais (0, 1, 2, ...) e calcula todas as
 * propriedades NumPy associadas (strides, flags, etc.)
 * 
 * IMPORTANTE: A ordem (C vs F) afeta os STRIDES, não os dados em si.
 * Os dados são sempre [0, 1, 2, ...] para visualização consistente.
 * Os strides determinam como esses dados são interpretados como array N-dimensional.
 * 
 * @param shape - Dimensões do array
 * @param dtype - Tipo de dado
 * @param order - Layout de memória: 'C' (row-major) ou 'F' (column-major)
 * @returns Objeto ArrayData com dados e metadados
 * 
 * @example
 * // Array 2x3 em C-order
 * const arr = generateArrayData([2, 3], 'float32', 'C');
 * // arr.flatData = [0, 1, 2, 3, 4, 5]
 * // arr.stats.strides = [12, 4] (assumindo float32 = 4 bytes)
 * // Interpretação: [[0,1,2], [3,4,5]]
 */
export const generateArrayData = (
  shape: number[], 
  dtype: DType, 
  order: 'C' | 'F' = 'C'
): ArrayData => {
  // Calcula tamanho total (número de elementos)
  let size = 1;
  for (const dim of shape) {
    size *= dim;
  }
  
  const itemsize = DTYPE_SIZES[dtype];
  const nbytes = size * itemsize;
  
  // Gera dados sequenciais para visualização
  // Nota: Em um simulador real, você poderia gerar dados diferentes
  // baseado na ordem, mas para propósitos de visualização de layout
  // de memória, manter a sequência 0,1,2... é mais didático
  const flatData = Array.from({ length: size }, (_, i) => i);
  
  // Calcula strides baseado na ordem
  const strides = calculateStrides(shape, itemsize, order);
  
  // Verifica contiguidade
  // IMPORTANTE: Um array pode ser simultaneamente C e F contiguous
  // (ex: arrays 1D, arrays com todas dimensões = 1, etc.)
  const isCContiguous = checkCContiguous(shape, strides, itemsize);
  const isFContiguous = checkFContiguous(shape, strides, itemsize);
  
  const stats: ArrayStats = {
    ndim: shape.length,
    shape: [...shape], // Copia para evitar mutação externa
    strides,
    size,
    itemsize,
    nbytes,
    flags: {
      c_contiguous: isCContiguous,
      f_contiguous: isFContiguous,
      owndata: true,
      writeable: true,
    },
    base_address: '0x100' // Endereço base simulado
  };
  
  return {
    flatData,
    stats,
    dtype
  };
};

/**
 * Converte índices N-dimensionais para índice flat usando strides
 * 
 * Esta é a função CENTRAL do NumPy - ela implementa a fórmula:
 * flat_index = (i₀ * stride₀ + i₁ * stride₁ + ... + iₙ * strideₙ) / itemsize
 * 
 * Os strides estão em BYTES, então dividimos por itemsize para obter
 * o índice em número de elementos.
 * 
 * @param indices - Índices N-dimensionais (ex: [1, 2] para elemento na linha 1, coluna 2)
 * @param strides - Strides em bytes para cada dimensão
 * @param itemsize - Tamanho em bytes de cada elemento
 * @returns Índice flat (posição no array linear)
 * 
 * @example
 * // Array 2x3 com strides [12, 4] e itemsize 4 (float32)
 * getFlatIndex([1, 2], [12, 4], 4) // retorna 5
 * // Cálculo: (1*12 + 2*4) / 4 = 20 / 4 = 5
 * 
 * @example
 * // Array 3D [2, 3, 4] com strides [48, 16, 4] e itemsize 4
 * getFlatIndex([1, 2, 3], [48, 16, 4], 4) // retorna 23
 * // Cálculo: (1*48 + 2*16 + 3*4) / 4 = 92 / 4 = 23
 */
export const getFlatIndex = (
  indices: number[], 
  strides: number[], 
  itemsize: number
): number => {
  // Calcula offset em bytes
  let byteOffset = 0;
  for (let i = 0; i < indices.length; i++) {
    byteOffset += indices[i] * strides[i];
  }
  
  // Converte bytes para índice de elemento
  // Strides são em bytes, então dividimos por itemsize
  return byteOffset / itemsize;
};

/**
 * Converte índice flat para índices N-dimensionais
 * 
 * Operação inversa de getFlatIndex. Útil para tooltips e visualizações
 * que precisam mostrar a posição N-dimensional de um elemento na memória linear.
 * 
 * A lógica difere entre C-order e F-order:
 * - C-order: última dimensão varia mais rápido (row-major)
 * - F-order: primeira dimensão varia mais rápido (column-major)
 * 
 * @param flatIndex - Índice no array linear (0 a size-1)
 * @param shape - Dimensões do array
 * @param order - Layout: 'C' ou 'F'
 * @returns Array de índices N-dimensionais
 * 
 * @example
 * // Array 2x3 em C-order: [[0,1,2], [3,4,5]]
 * getNDIndex(5, [2, 3], 'C') // retorna [1, 2] (última posição)
 * 
 * @example
 * // Array 2x3 em F-order: [[0,2,4], [1,3,5]]
 * getNDIndex(5, [2, 3], 'F') // retorna [1, 2]
 */
export const getNDIndex = (
  flatIndex: number, 
  shape: number[], 
  order: 'C' | 'F'
): number[] => {
  // Validação opcional (pode ser removida para performance em produção)
  if (process.env.NODE_ENV !== 'production') {
    const totalSize = shape.reduce((a, b) => a * b, 1);
    if (flatIndex < 0 || flatIndex >= totalSize) {
      console.warn(
        `Flat index ${flatIndex} out of bounds for shape [${shape.join(', ')}] (size ${totalSize})`
      );
    }
  }
  
  const res: number[] = [];
  let current = flatIndex;
  
  if (order === 'C') {
    // C-order (row-major): divide da última para primeira dimensão
    // Exemplo: índice 5 em [2,3] → 5÷3=1 resto 2 → [1, 2]
    for (let i = shape.length - 1; i >= 0; i--) {
      res.unshift(current % shape[i]);
      current = Math.floor(current / shape[i]);
    }
  } else {
    // F-order (column-major): divide da primeira para última dimensão
    // Exemplo: índice 5 em [2,3] → 5÷2=2 resto 1 → [1, 2]
    for (let i = 0; i < shape.length; i++) {
      res.push(current % shape[i]);
      current = Math.floor(current / shape[i]);
    }
  }
  
  return res;
};

/**
 * FUNÇÕES AUXILIARES PARA RETROCOMPATIBILIDADE
 * Se o código cliente usa essas funções, mantenha-as
 */

/**
 * Obtém o tamanho em bytes de um dtype
 * @param dtype - Tipo de dado NumPy
 * @returns Tamanho em bytes
 */
export const getDTypeSize = (dtype: DType): number => {
  return DTYPE_SIZES[dtype];
};

/**
 * Calcula o tamanho total (número de elementos) de um shape
 * @param shape - Dimensões do array
 * @returns Número total de elementos
 */
export const calculateSize = (shape: number[]): number => {
  let size = 1;
  for (const dim of shape) {
    size *= dim;
  }
  return size;
};

/**
 * Verifica se índices N-dimensionais são válidos para um shape
 * @param indices - Índices a verificar
 * @param shape - Dimensões do array
 * @returns true se válidos, false caso contrário
 */
export const validateIndices = (indices: number[], shape: number[]): boolean => {
  if (indices.length !== shape.length) return false;
  
  for (let i = 0; i < indices.length; i++) {
    if (indices[i] < 0 || indices[i] >= shape[i]) {
      return false;
    }
  }
  
  return true;
};

/**
 * Formata strides para exibição legível
 * @param strides - Array de strides em bytes
 * @param itemsize - Tamanho do item em bytes
 * @returns String formatada (ex: "(12, 4)" ou "(3, 1) items")
 */
export const formatStrides = (strides: number[], itemsize: number): string => {
  const stridesInItems = strides.map(s => s / itemsize);
  return `(${stridesInItems.join(', ')})`;
};

/**
 * Calcula o endereço de memória de um elemento
 * Útil para visualizações que mostram endereços de memória
 * 
 * @param indices - Índices N-dimensionais
 * @param strides - Strides em bytes
 * @param baseAddress - Endereço base (como número ou string hex)
 * @returns Endereço em formato hexadecimal
 */
export const calculateMemoryAddress = (
  indices: number[],
  strides: number[],
  baseAddress: string | number = '0x100'
): string => {
  let byteOffset = 0;
  for (let i = 0; i < indices.length; i++) {
    byteOffset += indices[i] * strides[i];
  }
  
  const base = typeof baseAddress === 'string' 
    ? parseInt(baseAddress, 16) 
    : baseAddress;
  
  const address = base + byteOffset;
  return '0x' + address.toString(16).toUpperCase();
};

// Exporta constantes para uso externo se necessário
export { DTYPE_SIZES };

/**
 * NOTAS DE IMPLEMENTAÇÃO PARA O DESENVOLVEDOR:
 * 
 * 1. STRIDES vs ELEMENTOS:
 *    - Strides são SEMPRE em bytes no NumPy
 *    - Para obter "strides em elementos": stride_bytes / itemsize
 *    - getFlatIndex divide por itemsize para converter bytes → elementos
 * 
 * 2. C-ORDER vs F-ORDER:
 *    - C-order (row-major): última dimensão varia mais rápido
 *      Array[2,3]: [[0,1,2], [3,4,5]] → memória: [0,1,2,3,4,5]
 *    - F-order (column-major): primeira dimensão varia mais rápido
 *      Array[2,3]: [[0,2,4], [1,3,5]] → memória: [0,1,2,3,4,5]
 *      (mesma memória, interpretação diferente via strides!)
 * 
 * 3. CONTIGUIDADE:
 *    - Um array pode ser C e F contiguous simultaneamente (arrays 1D)
 *    - Dimensões de tamanho 1 são ignoradas na verificação
 *    - Views/slices geralmente NÃO são contiguous
 * 
 * 4. PERFORMANCE:
 *    - Para loops críticos, considere inlining getFlatIndex
 *    - Cache strides se acessar múltiplos elementos do mesmo array
 *    - Use TypedArrays (Float32Array, etc.) em produção para dados reais
 * 
 * 5. EXTENSÕES FUTURAS:
 *    - Suporte a views (offset, base array)
 *    - Suporte a slicing
 *    - Broadcasting
 *    - Negative strides (arrays invertidos)
 */