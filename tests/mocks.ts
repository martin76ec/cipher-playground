const byteExample1 = [
  [
    false, true,
    true,  true,
    false, true,
    false, false
  ],
  [
    false, true,
    true,  false,
    true,  false,
    false, false
  ],
  [
    false, true,
    true,  false,
    true,  false,
    false, true
  ],
  [
    false, true,
    true,  true,
    false, false,
    true,  true
  ],
  [
    false, false,
    true,  false,
    false, false,
    false, false
  ],
  [
    false, true,
    true,  false,
    true,  false,
    false, true
  ],
  [
    false, true,
    true,  true,
    false, false,
    true,  true
  ],
  [
    false, false,
    true,  false,
    false, false,
    false, false
  ],
  [
    false, true,
    true,  false,
    false, false,
    false, true
  ],
  [
    false, false,
    true,  false,
    false, false,
    false, false
  ],
  [
    false, true,
    true,  true,
    false, true,
    false, false
  ],
  [
    false, true,
    true,  false,
    false, true,
    false, true
  ],
  [
    false, true,
    true,  true,
    false, false,
    true,  true
  ],
  [
    false, true,
    true,  true,
    false, true,
    false, false
  ],
  [
    false, false,
    true,  false,
    false, false,
    false, false
  ],
  [
    false, true,
    true,  true,
    false, false,
    true,  true
  ],
  [
    false, true,
    true,  true,
    false, true,
    false, false
  ],
  [
    false, true,
    true,  true,
    false, false,
    true,  false
  ],
  [
    false, true,
    true,  false,
    true,  false,
    false, true
  ],
  [
    false, true,
    true,  false,
    true,  true,
    true,  false
  ],
  [
    false, true,
    true,  false,
    false, true,
    true,  true
  ]
];

const getAsciiTable = (): string => {
  const table = Array(128).fill(1);
  return table.map((_val, index) => String.fromCharCode(index)).join('');
};

export { byteExample1, getAsciiTable };