import { blocksFromString, cipherBlock, unCipherBlock } from "../utils/feistel";

const cipher = (str: string, config: any) => {
  const blocks = blocksFromString(str, config.blocksize);
  return blocks.map(block => cipherBlock(block, config));
};

const decipher = (result: string[][], config: any) => {
  const unresult = result.map(block => unCipherBlock(block[block.length - 1].split(''), config));
  return unresult;
};

export { cipher, decipher };