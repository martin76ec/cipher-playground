import { strToBytes, bytesAsStr, splitBlock } from './bitvec';

interface Permutation {
  halfBlock: boolean[],
  positions: number[]
};

const validatePermutation = (positions: number[], halfSize: number = 4) => {
  const notNumbers = positions.filter(pos => isNaN(pos));
  if (notNumbers.length > 0) throw(`just numbers allowed: ${notNumbers}`);
  const wrongRepeated = Array(halfSize)
  .fill(0)
  .map((_val, i: number) => {
    return positions.filter(val => val == i).length > 1;
  })
  .filter(i => i === true);

  const higher = positions.filter(pos => pos >= halfSize);
  const lower = positions.filter(pos => pos < 0);

  const wrongMissing = Array(halfSize)
  .fill(0)
  .map((_val, i: number) => {
    return positions.indexOf(i) === -1 && i < halfSize;
  })
  .filter(i => i === true);


  if (positions.length !== halfSize) throw(`permutation positions (${positions.length}) are different than the needed (${halfSize})`);
  if (wrongRepeated.length > 0) throw(`repeated permutation position: ${positions.filter((e, i) => positions.indexOf(e) !== i)}`);
  if (higher.length > 0) throw(`permutation position is too high: ${higher}`);
  if (lower.length > 0) throw(`permutation position is too low: ${lower}`);
  if (wrongMissing.length > 0) throw('');
};

const permutation = ({ halfBlock, positions }: Permutation) => {
  validatePermutation(positions, halfBlock.length);
  const blocksize = halfBlock.length * 2;
  return positions.map(pos => halfBlock[pos]);
};

const validateSustitution = (steps: number) => {
  if (steps < -10 || steps > 10) throw('steps should be from -10 to 10');
};

const sustitution = (halfBlock: boolean[], steps: number) => {
  const pseudobytes:boolean[][] = splitBlock(halfBlock, 8);
  validateSustitution(steps);
};

const blocksFromString = (str: string, blocksize: number) => {
  const blocks: string [][] = [];
  let group: string[] = [];

  Array.from(str).forEach((c, i) => {
    if ((i + 1) % blocksize === 0 || (i + 1) === str.length) {
      group.push(c) && blocks.push(group) && (group = [])
    }
    else group.push(c)
  });

  return blocks.map(block => {
    if (block.length < blocksize) {
      const missing = blocksize - block.length;
      return [...block, ...Array(missing).fill('1')];
    }

    return block;
  });
};

const strBlockPermutation = (half: string[], positions: number[]) => {
  validatePermutation(positions, half.length);
  return positions.map(pos => half[pos]);
};

const strBlockUnPermutation = (half: string[], positions: number[]) => {
  validatePermutation(positions, half.length);
  return Array(positions.length).fill(0).map((_v, index) => {
    const realIndex = positions.findIndex(val => val == index);
    return half[realIndex];
  });
};

const handleBoundaries = (charcode: number, mod: number) => {
  // if(charcode === 3 && mod == -5) debugger;
  const newCharcode = charcode + mod;
  if (newCharcode < 0) return 127 + newCharcode + 1;
  if (newCharcode > 127) return Math.abs(newCharcode - 127) - 1;

  return newCharcode;
};

const strBlockSustitution = (half: string[], mod: number) => {
  const charCodes = half.map(c => handleBoundaries(c.charCodeAt(0), mod));
  return charCodes.map(code => String.fromCharCode(code));
};

const strBlockUnSustitution = (half: string[], mod: number) => {
  const newMod = mod * -1;
  const charCodes = half.map(c => handleBoundaries(c.charCodeAt(0), newMod));
  return charCodes.map(code => String.fromCharCode(code));
};

interface SplitBlock {
  left: string[],
  right: string[]
};

const splitStrBlock = (block: string[]): SplitBlock => {
  const left: string[] = block.filter((str, i) => (i + 1) <= (block.length / 2));
  const right: string[] = block.filter((str, i) => (i + 1) > (block.length / 2));

  return { left, right };
};

const round = (block: string[], config: any): string[] => {
  const { left, right } = splitStrBlock(block);
  const permutation_1 = strBlockPermutation(left, config.positions);
  const sustitution_1 = strBlockSustitution(permutation_1, config.mod);
  const permutation_2 = strBlockPermutation(right, config.positions);
  const sustitution_2 = strBlockSustitution(permutation_2, config.mod);

  return [ ...sustitution_1, ...sustitution_2 ];
};

const unround = (block: string[], config: any): string[] => {
  const { left, right } = splitStrBlock(block);
  const permutation_1 = strBlockUnPermutation(left, config.positions);
  const sustitution_1 = strBlockUnSustitution(permutation_1, config.mod);
  const permutation_2 = strBlockUnPermutation(right, config.positions);
  const sustitution_2 = strBlockUnSustitution(permutation_2, config.mod);

  return [ ...sustitution_1, ...sustitution_2 ];
};

const cipherBlock = (block: string[], config: any) => {
  const rounds: string[][] = [];
  let currentBlock: string[] = block;

  for (let i = 0; i < config.rounds; i ++) {
    const result = round(currentBlock, config);
    (currentBlock = result) && (rounds.push(result));
  }

  return rounds.map(round => round.join(''));
};

const unCipherBlock = (block: string[], config: any) => {
  const rounds: string[][] = [];
  let currentBlock: string[] = block;

  for (let i = 0; i < config.rounds; i ++) {
    const result = unround(currentBlock, config);
    (currentBlock = result) && (rounds.push(result));
  }

  return rounds.map(round => round.join(''));
};

export { permutation, blocksFromString, strBlockPermutation, strBlockSustitution, cipherBlock, strBlockUnSustitution, strBlockUnPermutation, unCipherBlock };