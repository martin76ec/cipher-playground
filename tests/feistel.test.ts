import { assert } from "chai";
import { permutation, blocksFromString, strBlockPermutation, strBlockSustitution, cipherBlock, unCipherBlock } from "../src/utils/feistel";
import { cipher, decipher } from "../src/actions/cipher";

test('permutation of half-blocks', () => {
  const halfBlock = [true, false, false, true];
  const positions = [2, 0, 3, 1];
  const target = [false, true, true, false];
  const result = permutation({ halfBlock, positions });
  assert.deepEqual(result, target, 'should be the same array');

  const halfBlock2 = [true, false, false, true, false];
  const positions2 = [2, 0, 3, 1, 4];
  assert.throws(() => permutation({ halfBlock: halfBlock2, positions: positions2 }));

  const halfBlock3 = [true, false, false, true, false, false];
  const positions3 = [2, 0, 3, 1, 4, 6];
  assert.throws(() => permutation({ halfBlock: halfBlock3, positions: positions3 }));
});

test('split string into blocks', () => {
  const str = 'This is a test message made for testint purposes &2891 [ [] ] )) a';
  const blocks = blocksFromString(str, 8);
  assert.equal(blocks.length, 9);
});

test('string block permutation', () => {
  const str = 'test';
  const positions = [1, 0, 3, 2];
  const expected = ['e', 't', 't', 's'];
  const result = strBlockPermutation(str.split(''), positions);
  assert.deepEqual(result, expected);
});

test('string block sustitution', () => {
  const str = 'test}';
  const mod = 6;
  const result = strBlockSustitution(str.split(''), mod);
  assert.deepEqual(result, ['z', 'k', 'y', 'z', String.fromCharCode(3)]);
});

test('string block sustitution', () => {
  const str = '\x00\x02\n}';
  const mod = -8;
  const result = strBlockSustitution(str.split(''), mod);
  assert.deepEqual(result, ['w', 'y', '\x02', 'u']);
});

test('string cipher', () => {
  const str = '\n\nEste es un test en docx\nP pi11';
  const blocks = blocksFromString(str, 8);
  const mod = 5;
  const rounds = 8;
  const positions = [2, 3, 1, 0];

  const result = blocks.map(block => cipherBlock(block, {
    mod,
    positions,
    rounds
  }));

  const realResult = cipher(str, {
    blocksize: 8,
    mod,
    positions,
    rounds
  });

  const text = result.map(block => block[block.length - 1]).join('');
  const realText = realResult.map(block => block[block.length - 1]).join('');

  const realDeblocks = decipher(realText, {
    blocksize: 8,
    mod,
    positions,
    rounds
  });

  const deblocks = blocksFromString(text, 8);
  const detext = deblocks.map(block => unCipherBlock(block, {
    mod,
    positions,
    rounds
  }));

  const unresult = result.map(block => unCipherBlock(block[block.length - 1].split(''), {
    mod,
    positions,
    rounds
  }));

  debugger;

  assert.isNotNull(1);
});