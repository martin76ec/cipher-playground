import { blocksFromString, cipherBlock, unCipherBlock } from "../utils/feistel";

const cipher = (str: string, config: any) => {
  const blocks = blocksFromString(str, config.blocksize);
  const result = blocks.map(block => cipherBlock(block, config));
  return result;
};

const decipher = (result: string, config: any) => {
  const blocks = blocksFromString(result, config.blocksize);
  console.log(result);
  const res = blocks.map(block => unCipherBlock(block, config));
  return res;
};

export { cipher, decipher };