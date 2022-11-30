import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";

const strByteToBoolByte = (byte: string): boolean[] => {
  return byte
  .split('')
  .map((bit: string) => bit === '1' ? true : false);
};

const boolByteToStrByte = (byte: Array<boolean>): string => {
  return byte.map(bit => bit ? '1' : '0').join('');
};

const asciiToStrByte = (c: string): string => (0b100000000 + c.charCodeAt(0)).toString(2).substring(1);

/** Transforms string to matrix of booleans where each subarray is a byte represented as a boolean array */
const strToBytes = (text: string): boolean[][] => {
  const bytes: boolean[][] = text.split('').map((c: string) => strByteToBoolByte(asciiToStrByte(c)));
  return bytes;
};

/** Transforms a boolean byte matrix into an array of boolean bits */
const byteToBoolBits = (bytes: boolean[][]): boolean[] => bytes.flat();

const bytesAsStr = (bytes: boolean[][]): string => {
  return bytes.map(byte => boolByteToStrByte(byte)).join(' ');
};

const splitIntoNBlocks = (bytes: boolean[][], blocksize: number) => {
  const plainBlock: boolean[] = byteToBoolBits(bytes);
  const blocks: boolean[][] = [];
  let group: boolean[] = [];

  plainBlock.forEach((bit, index) => {
    if ((index + 1) % blocksize === 0 || (index + 1) === plainBlock.length)
      group.push(bit) && blocks.push(group) && (group = []);
    else group.push(bit);
  });

  return blocks.map(block => {
    if (block.length < blocksize) {
      const missing = Array(blocksize - block.length).fill(false);
      return [...missing, ...block];
    }

    return block;
  });
};

const splitBlock = (bytes: boolean[], blocksize: number) => {
  const plainBlock: boolean[] = bytes;
  const blocks: boolean[][] = [];
  let group: boolean[] = [];

  plainBlock.forEach((bit, index) => {
    if ((index + 1) % blocksize === 0 || (index + 1) === plainBlock.length)
      group.push(bit) && blocks.push(group) && (group = []);
    else group.push(bit);
  });

  return blocks.map(block => {
    if (block.length < blocksize) {
      const missing = Array(blocksize - block.length).fill(false);
      return [...missing, ...block];
    }

    return block;
  });
};

const joinBlock = (bytes: [][], blocksize: number) => {
  const originalBlocks = bytes.map(block => { 
  });
};

export {
  boolByteToStrByte,
  byteToBoolBits,
  bytesAsStr,
  splitIntoNBlocks,
  strByteToBoolByte,
  strToBytes,
  splitBlock,
};