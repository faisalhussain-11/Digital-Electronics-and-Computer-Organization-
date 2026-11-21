// Deterministic algorithms for DECO Interactive Labs

export type BaseOption = 2 | 8 | 10 | 16;

export interface ConversionResult {
  valid: boolean;
  error?: string;
  decimal: number;
  binary: string;
  octal: string;
  hex: string;
  bitWidth: number;
  onesComplement: string;
  twosComplement: string;
  ninesComplement: string;
  tensComplement: string;
  bcd8421: string;
  excess3: string;
  grayCode: string;
  evenParityBit: 0 | 1;
  oddParityBit: 0 | 1;
  stepsToDecimal: string[];
  stepsToBinary: string[];
}

const BASE_REGEX: Record<BaseOption, RegExp> = {
  2: /^[01]+$/,
  8: /^[0-7]+$/,
  10: /^[0-9]+$/,
  16: /^[0-9A-Fa-f]+$/,
};

const BASE_LABELS: Record<BaseOption, string> = {
  2: 'Binary (0–1)',
  8: 'Octal (0–7)',
  10: 'Decimal (0–9)',
  16: 'Hexadecimal (0–9, A–F)',
};

export function convertNumberSystem(rawInput: string, base: BaseOption): ConversionResult {
  const cleaned = rawInput.trim().toUpperCase();
  if (!cleaned) {
    return makeErrorResult('Enter a non-negative integer value to compute conversions.');
  }
  if (!BASE_REGEX[base].test(cleaned)) {
    return makeErrorResult(`Invalid digits for ${BASE_LABELS[base]}.`);
  }

  const decimal = parseInt(cleaned, base);
  if (!Number.isSafeInteger(decimal) || decimal > 65535) {
    return makeErrorResult('Please keep values between 0 and 65,535 (16-bit unsigned range).');
  }

  const binaryRaw = decimal.toString(2);
  const bitWidth = Math.max(4, Math.ceil(binaryRaw.length / 4) * 4);
  const binary = binaryRaw.padStart(bitWidth, '0');
  const octal = decimal.toString(8);
  const hex = decimal.toString(16).toUpperCase();

  // 1's and 2's complement (at chosen bitWidth)
  const onesComplement = binary
    .split('')
    .map((b) => (b === '0' ? '1' : '0'))
    .join('');
  const twosVal = (parseInt(onesComplement, 2) + 1) & ((1 << bitWidth) - 1);
  const twosComplement = twosVal.toString(2).padStart(bitWidth, '0');

  // 9's and 10's complement (decimal)
  const decStr = decimal.toString(10);
  const ninesNum = Math.pow(10, decStr.length) - 1 - decimal;
  const ninesComplement = ninesNum.toString(10).padStart(decStr.length, '0');
  const tensNum = (ninesNum + 1) % Math.pow(10, decStr.length);
  const tensComplement =
    decimal === 0 ? '0'.repeat(decStr.length) : tensNum.toString(10).padStart(decStr.length, '0');

  // BCD 8421 and Excess-3 per decimal digit
  const digits = decStr.split('').map((d) => parseInt(d, 10));
  const bcd8421 = digits.map((d) => d.toString(2).padStart(4, '0')).join(' ');
  const excess3 = digits.map((d) => (d + 3).toString(2).padStart(4, '0')).join(' ');

  // Gray Code
  const grayVal = decimal ^ (decimal >> 1);
  const grayCode = grayVal.toString(2).padStart(bitWidth, '0');

  // Parity bits on binary representation
  const onesCount = binary.split('').filter((b) => b === '1').length;
  const evenParityBit: 0 | 1 = onesCount % 2 === 0 ? 0 : 1;
  const oddParityBit: 0 | 1 = onesCount % 2 === 0 ? 1 : 0;

  // Step-by-step expansion to decimal
  const chars = cleaned.split('');
  const terms = chars.map((ch, idx) => {
    const power = chars.length - 1 - idx;
    const digitVal = parseInt(ch, base);
    return `${digitVal}×${base}^${power}`;
  });
  const stepsToDecimal = [
    `Positional expansion (base ${base}): ${terms.join(' + ')}`,
    `Evaluated decimal value: (${decimal})₁₀`,
  ];

  // Repeated division by 2 steps
  const stepsToBinary: string[] = [];
  if (decimal === 0) {
    stepsToBinary.push('0 ÷ 2 = 0  remainder 0  →  (0000)₂');
  } else {
    let q = decimal;
    while (q > 0) {
      const rem = q % 2;
      const next = Math.floor(q / 2);
      stepsToBinary.push(`${q} ÷ 2 = ${next}  (Remainder: ${rem})`);
      q = next;
    }
    stepsToBinary.push(`Read remainders bottom-to-top → (${binaryRaw})₂`);
  }

  return {
    valid: true,
    decimal,
    binary,
    octal,
    hex,
    bitWidth,
    onesComplement,
    twosComplement,
    ninesComplement,
    tensComplement,
    bcd8421,
    excess3,
    grayCode,
    evenParityBit,
    oddParityBit,
    stepsToDecimal,
    stepsToBinary,
  };
}

function makeErrorResult(error: string): ConversionResult {
  return {
    valid: false,
    error,
    decimal: 0,
    binary: '0000',
    octal: '0',
    hex: '0',
    bitWidth: 4,
    onesComplement: '1111',
    twosComplement: '0000',
    ninesComplement: '9',
    tensComplement: '0',
    bcd8421: '0000',
    excess3: '0011',
    grayCode: '0000',
    evenParityBit: 0,
    oddParityBit: 1,
    stepsToDecimal: [],
    stepsToBinary: [],
  };
}

// ================= HAMMING (7,4) ENGINE =================

export interface HammingResult {
  // Ordered by 1-based position: index 0 = pos 1 (P1), ..., index 6 = pos 7 (D7)
  encodedBits: (0 | 1)[];
  receivedBits: (0 | 1)[];
  correctedBits: (0 | 1)[];
  p1: 0 | 1;
  p2: 0 | 1;
  p4: 0 | 1;
  c1: 0 | 1;
  c2: 0 | 1;
  c4: 0 | 1;
  errorPosition: number; // 0 = no error, 1..7 = 1-based faulty bit index
}

export function computeHamming74(
  dataBits: [0 | 1, 0 | 1, 0 | 1, 0 | 1], // [D7, D6, D5, D3]
  errorPosToInject: number // 0 = none, 1..7 = flip position
): HammingResult {
  const [d7, d6, d5, d3] = dataBits;
  // Even parity
  const p1 = ((d3 ^ d5 ^ d7) & 1) as 0 | 1;
  const p2 = ((d3 ^ d6 ^ d7) & 1) as 0 | 1;
  const p4 = ((d5 ^ d6 ^ d7) & 1) as 0 | 1;

  // Positions 1..7 -> [P1, P2, D3, P4, D5, D6, D7]
  const encodedBits: (0 | 1)[] = [p1, p2, d3, p4, d5, d6, d7];
  const receivedBits: (0 | 1)[] = [...encodedBits];

  if (errorPosToInject >= 1 && errorPosToInject <= 7) {
    receivedBits[errorPosToInject - 1] = receivedBits[errorPosToInject - 1] === 1 ? 0 : 1;
  }

  // Syndrome calculation at receiver (even parity checks)
  const c1 = ((receivedBits[0] ^ receivedBits[2] ^ receivedBits[4] ^ receivedBits[6]) & 1) as 0 | 1;
  const c2 = ((receivedBits[1] ^ receivedBits[2] ^ receivedBits[5] ^ receivedBits[6]) & 1) as 0 | 1;
  const c4 = ((receivedBits[3] ^ receivedBits[4] ^ receivedBits[5] ^ receivedBits[6]) & 1) as 0 | 1;
  const errorPosition = c4 * 4 + c2 * 2 + c1;

  const correctedBits: (0 | 1)[] = [...receivedBits];
  if (errorPosition >= 1 && errorPosition <= 7) {
    correctedBits[errorPosition - 1] = correctedBits[errorPosition - 1] === 1 ? 0 : 1;
  }

  return {
    encodedBits,
    receivedBits,
    correctedBits,
    p1,
    p2,
    p4,
    c1,
    c2,
    c4,
    errorPosition,
  };
}

// ================= K-MAP EXACT MINIMIZER (3-VAR & 4-VAR) =================

export type CellValue = 0 | 1 | 'X';

export interface ImplicantGroup {
  pattern: string; // e.g., "0-1-"
  term: string; // e.g., "A'C"
  minterms: number[];
  isEssential: boolean;
}

export interface KMapSolution {
  expression: string;
  groups: ImplicantGroup[];
  ones: number[];
  dontCares: number[];
}

function countOnes(bin: string): number {
  let c = 0;
  for (const ch of bin) if (ch === '1') c++;
  return c;
}

function combinePatterns(a: string, b: string): string | null {
  let diffs = 0;
  let out = '';
  for (let i = 0; i < a.length; i++) {
    if (a[i] === b[i]) {
      out += a[i];
    } else if (a[i] !== '-' && b[i] !== '-') {
      diffs++;
      out += '-';
    } else {
      return null;
    }
  }
  return diffs === 1 ? out : null;
}

function patternToMinterms(pattern: string): number[] {
  const results: number[] = [];
  const expand = (idx: number, acc: number) => {
    if (idx === pattern.length) {
      results.push(acc);
      return;
    }
    const ch = pattern[idx];
    if (ch === '0') expand(idx + 1, acc << 1);
    else if (ch === '1') expand(idx + 1, (acc << 1) | 1);
    else {
      expand(idx + 1, acc << 1);
      expand(idx + 1, (acc << 1) | 1);
    }
  };
  expand(0, 0);
  return results;
}

function patternToTerm(pattern: string, vars: string[]): string {
  const parts: string[] = [];
  for (let i = 0; i < pattern.length; i++) {
    if (pattern[i] === '1') parts.push(vars[i]);
    else if (pattern[i] === '0') parts.push(`${vars[i]}'`);
  }
  return parts.length === 0 ? '1' : parts.join('');
}

export function solveKMap(numVars: 3 | 4, cells: CellValue[]): KMapSolution {
  const vars = numVars === 3 ? ['A', 'B', 'C'] : ['A', 'B', 'C', 'D'];
  const ones: number[] = [];
  const dontCares: number[] = [];

  cells.forEach((v, idx) => {
    if (v === 1) ones.push(idx);
    else if (v === 'X') dontCares.push(idx);
  });

  if (ones.length === 0) {
    return { expression: '0', groups: [], ones, dontCares };
  }

  const allActive = [...ones, ...dontCares];
  if (allActive.length === 1 << numVars) {
    return {
      expression: '1',
      groups: [
        {
          pattern: '-'.repeat(numVars),
          term: '1',
          minterms: allActive,
          isEssential: true,
        },
      ],
      ones,
      dontCares,
    };
  }

  // Quine-McCluskey prime implicant generation
  let current = new Set<string>(allActive.map((m) => m.toString(2).padStart(numVars, '0')));
  const primePatterns = new Set<string>();

  while (current.size > 0) {
    const arr = Array.from(current);
    const used = new Set<string>();
    const next = new Set<string>();

    // Group by number of 1s
    const buckets: Record<number, string[]> = {};
    for (const p of arr) {
      const k = countOnes(p);
      if (!buckets[k]) buckets[k] = [];
      buckets[k].push(p);
    }

    const keys = Object.keys(buckets)
      .map(Number)
      .sort((a, b) => a - b);

    for (const k of keys) {
      const g1 = buckets[k] || [];
      const g2 = buckets[k + 1] || [];
      for (const a of g1) {
        for (const b of g2) {
          const merged = combinePatterns(a, b);
          if (merged) {
            used.add(a);
            used.add(b);
            next.add(merged);
          }
        }
      }
    }

    for (const p of arr) {
      if (!used.has(p)) primePatterns.add(p);
    }
    current = next;
  }

  // Filter out prime implicants that cover zero required 1s (only don't cares)
  const primeList = Array.from(primePatterns)
    .map((pattern) => {
      const minterms = patternToMinterms(pattern);
      const coveredOnes = minterms.filter((m) => ones.includes(m));
      const literalCount = pattern.split('').filter((ch) => ch !== '-').length;
      return {
        pattern,
        term: patternToTerm(pattern, vars),
        minterms,
        coveredOnes,
        literalCount,
      };
    })
    .filter((pi) => pi.coveredOnes.length > 0);

  // Identify Essential Prime Implicants
  const essentialIndices = new Set<number>();
  for (const m of ones) {
    const covering = primeList
      .map((pi, idx) => (pi.coveredOnes.includes(m) ? idx : -1))
      .filter((idx) => idx !== -1);
    if (covering.length === 1) {
      essentialIndices.add(covering[0]);
    }
  }

  const coveredSet = new Set<number>();
  essentialIndices.forEach((idx) => {
    primeList[idx].coveredOnes.forEach((m) => coveredSet.add(m));
  });

  const remainingOnes = ones.filter((m) => !coveredSet.has(m));
  const candidateIndices = primeList
    .map((_, idx) => idx)
    .filter(
      (idx) =>
        !essentialIndices.has(idx) &&
        primeList[idx].coveredOnes.some((m) => remainingOnes.includes(m))
    );

  // Exact branch-and-bound minimal cover for remaining minterms
  let bestExtra: number[] | null = null;
  let bestScore = Infinity;

  const search = (uncovered: number[], chosen: number[], startIdx: number) => {
    if (uncovered.length === 0) {
      const literalSum = chosen.reduce((acc, idx) => acc + primeList[idx].literalCount, 0);
      const score = chosen.length * 100 + literalSum;
      if (score < bestScore) {
        bestScore = score;
        bestExtra = [...chosen];
      }
      return;
    }
    if (bestExtra !== null && chosen.length >= bestExtra.length) return;

    const target = uncovered[0];
    for (let i = startIdx; i < candidateIndices.length; i++) {
      const piIdx = candidateIndices[i];
      if (!primeList[piIdx].coveredOnes.includes(target)) continue;
      const nextUncovered = uncovered.filter((m) => !primeList[piIdx].coveredOnes.includes(m));
      chosen.push(piIdx);
      search(nextUncovered, chosen, 0);
      chosen.pop();
    }
  };

  if (remainingOnes.length > 0) {
    search(remainingOnes, [], 0);
  } else {
    bestExtra = [];
  }

  const finalIndices = [...Array.from(essentialIndices), ...(bestExtra || [])];
  const groups: ImplicantGroup[] = finalIndices.map((idx) => ({
    pattern: primeList[idx].pattern,
    term: primeList[idx].term,
    minterms: primeList[idx].minterms,
    isEssential: essentialIndices.has(idx),
  }));

  const expression = groups.map((g) => g.term).join(' + ');
  return { expression, groups, ones, dontCares };
}
