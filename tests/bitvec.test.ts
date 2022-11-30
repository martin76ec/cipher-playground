import { assert } from "chai";
import { byteExample1, getAsciiTable } from "./mocks";
import { byteToBoolBits, strToBytes, splitIntoNBlocks } from "../src/utils/bitvec";

test('transforms string into bytes', () => {
  const source = 'this is a test string';
  const transform = strToBytes(source); 
  const result = byteExample1;
  assert.deepEqual(transform, result, 'both matrix should be the same');
});

test('transforms all ascii table to bytes', () => {
  const table = getAsciiTable();
  const transform = strToBytes(table); 
  assert.strictEqual(transform.length, table.length, 'length should be the same');
});

test('transforms from byte to bit', () => {
  const source = 'this is a test string';
  const transform = byteToBoolBits(strToBytes(source)); 
  const result = byteExample1.flat();
  assert.deepEqual(transform, result, 'should be the same array');
});

test('split in blocks', () => {
  const bytes: boolean[][] = [
    [true, true, false, false, true, true, true, false],
    [false, true, false, true, true, false, true, false],
  ];
  const splitted: boolean[][] = splitIntoNBlocks(bytes, 10);
  assert.equal(splitted.length, 2, 'length should be 2');
  assert.equal(splitted[0].length, 10);
  assert.equal(splitted[1].length, 10);
});