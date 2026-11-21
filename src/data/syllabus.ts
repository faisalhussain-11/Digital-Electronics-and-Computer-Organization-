import { CourseMetadata, SyllabusUnit } from '../types/deco';

export const COURSE_META: CourseMetadata = {
  institution: 'LIET(A), B.E. (AIML)',
  curriculum: 'AICTE Model Curriculum with effect from Academic Year 2024–25',
  courseCode: 'U24EC304',
  courseTitle: 'Digital Electronics & Computer Organization',
  category: 'Core',
  credits: 3,
  cieMarks: 40,
  seeMarks: 60,
  contactHours: { L: 3, T: 0, D: 0, P: 0 },
  objectives: [
    'To understand the basic building blocks of digital hardware and various minimization techniques.',
    'To analyze and design the Combinational and Sequential circuits.',
    'To describe the basic structure and operation of a digital computer and understand various memory types.',
  ],
  outcomes: [
    'CO1: Demonstrate the number system conversions and simplify Boolean functions.',
    'CO2: Analyze and simplify Boolean expressions using Karnaugh-maps, tabulation method, and design combinational circuits.',
    'CO3: Analyze and design various Sequential circuits.',
    'CO4: Illustrate the operation of a digital computer and understand its organization.',
    'CO5: Understand the various memory types and memory management requirements.',
  ],
  textbooks: [
    {
      index: 1,
      category: 'Textbook',
      authors: 'M. Morris Mano & Michael D. Ciletti',
      title: 'Digital Design, With an Introduction to Verilog HDL',
      publication: 'Pearson, 5th Edition, 2013',
    },
    {
      index: 2,
      category: 'Textbook',
      authors: 'R. P. Jain',
      title: 'Modern Digital Electronics',
      publication: 'McGraw Hill Education (India) Pvt. Limited, 4th Edition, 2003',
    },
    {
      index: 3,
      category: 'Textbook',
      authors: 'Carl Hamacher, Zvonko Vranesic & Safwat Zaky',
      title: 'Computer Organization',
      publication: 'McGraw Hill, 5th Edition, 2002',
    },
    {
      index: 4,
      category: 'Suggested Reading',
      authors: 'Ronald J. Tocci, Neal Widmer & Greg Moss',
      title: 'Digital Systems: Principles and Applications',
      publication: 'Pearson, 11th Edition, 2011',
    },
    {
      index: 5,
      category: 'Suggested Reading',
      authors: 'John L. Hennessy & David A. Patterson',
      title: 'Computer Architecture: A Quantitative Approach',
      publication: 'Elsevier, 4th Edition',
    },
    {
      index: 6,
      category: 'Suggested Reading',
      authors: 'Joseph D. Dumas II',
      title: 'Computer Architecture: Fundamentals and Principles of Computer Design',
      publication: 'BS Publication',
    },
  ],
};

export const SYLLABUS_UNITS: SyllabusUnit[] = [
  {
    id: 'unit1',
    roman: 'Unit I',
    shortTitle: 'Number Systems',
    title: 'Number Systems, Codes & Boolean Algebra',
    courseOutcome: 'CO1: Demonstrate the number system conversions and simplify Boolean functions.',
    syllabusExcerpt:
      'Number systems, Complements of Numbers, Codes — Weighted and Non-weighted codes and their properties, Parity check code and Hamming code. Boolean algebra: Basic Theorems and Properties, Switching Functions — Canonical and Standard Form, Algebraic Simplification, Fundamentals of Digital Logic Gates.',
    topics: [
      {
        id: 'u1-number-systems',
        unitId: 'unit1',
        number: '1.1',
        title: 'Number Systems & Base Conversions',
        summary:
          'Digital systems represent quantities using positional number systems defined by a radix (base) r: Binary (r = 2), Octal (r = 8), Decimal (r = 10), and Hexadecimal (r = 16). Every digit position carries weight r^i.',
        keyPoints: [
          'Any radix-r number converts to decimal by summing d_i × r^i across integer (i >= 0) and fractional (i < 0) positions.',
          'Decimal to radix-r uses repeated division by r for the integer part (read remainders bottom-to-top) and repeated multiplication by r for the fractional part (read integer carries top-to-bottom).',
          'Binary ↔ Octal groups bits in 3s (since 8 = 2³); Binary ↔ Hexadecimal groups bits in 4s (since 16 = 2⁴), padding leading zeros on the left of the radix point and trailing zeros on the right.',
        ],
        formulas: [
          '(N)_r = Σ d_i · r^i  (from i = -m to n - 1)',
          'Octal grouping: 1 octal digit = 3 binary bits',
          'Hex grouping: 1 hex digit (0–9, A–F) = 4 binary bits',
        ],
        table: {
          caption: 'Quick Radix Reference (0 to 15)',
          headers: ['Decimal', 'Binary (4-bit)', 'Octal', 'Hex'],
          rows: [
            ['0', '0000', '0', '0'],
            ['5', '0101', '5', '5'],
            ['8', '1000', '10', '8'],
            ['10', '1010', '12', 'A'],
            ['12', '1100', '14', 'C'],
            ['15', '1111', '17', 'F'],
          ],
        },
        workedExample: {
          problem: 'Convert (45.625)₁₀ to Binary, Octal, and Hexadecimal.',
          solution: [
            'Integer part 45 ÷ 2 → 22 R1, 11 R0, 5 R1, 2 R1, 1 R0, 0 R1 → (101101)₂.',
            'Fractional part 0.625 × 2 = 1.25 (1), 0.25 × 2 = 0.50 (0), 0.50 × 2 = 1.00 (1) → (.101)₂.',
            'Binary result: (101101.101)₂.',
            'Octal (3-bit groups): 101 101 . 101 → (55.5)₈.',
            'Hex (4-bit groups): 0010 1101 . 1010 → (2D.A)₁₆.',
          ],
        },
        examTip:
          'When converting fractions to Hex or Octal via binary, always pad trailing zeros on the right side of the radix point (e.g., .101 becomes .1010 = .A₁₆, not .5₁₆).',
        relatedLab: {
          labId: 'number-systems',
          label: 'Open Number Systems Converter',
        },
      },
      {
        id: 'u1-complements',
        unitId: 'unit1',
        number: '1.2',
        title: 'Complements of Numbers',
        summary:
          'Complements simplify subtraction and signed-number arithmetic in digital computers by converting subtraction into addition using only adder hardware.',
        keyPoints: [
          'For radix r, there are two complements: Diminished Radix Complement ((r - 1)\'s complement) and Radix Complement (r\'s complement).',
          'In binary: 1\'s complement inverts every bit (0 ↔ 1); 2\'s complement adds 1 to the 1\'s complement (shortcut: keep bits from right up to and including the first 1, then invert all bits to the left).',
          'In decimal: 9\'s complement subtracts each digit from 9; 10\'s complement equals 9\'s complement + 1.',
          'Subtraction M - N via r\'s complement: compute M + (r\'s complement of N). If an end carry occurs, discard it (result is positive). If no end carry occurs, take the r\'s complement of the sum and place a minus sign.',
        ],
        formulas: [
          '(r - 1)\'s complement of N = (r^n - 1) - N',
          'r\'s complement of N = r^n - N = [(r - 1)\'s complement] + 1',
          '2\'s complement range (n-bit signed): -2^(n-1) to +(2^(n-1) - 1)',
        ],
        workedExample: {
          problem: 'Subtract (1010100)₂ - (1000011)₂ using 2\'s complement arithmetic.',
          solution: [
            'M = 1010100 (84), N = 1000011 (67), both 7 bits.',
            '1\'s complement of N = 0111100.',
            '2\'s complement of N = 0111100 + 1 = 0111101.',
            'Add M + 2\'s comp(N): 1010100 + 0111101 = 1 0010001.',
            'End carry = 1 → discard carry → positive result = +(0010001)₂ = +17.',
          ],
        },
        examTip:
          'In 1\'s complement subtraction, an end carry is NOT discarded — it must be added back to the LSB (End-Around Carry). In 2\'s complement subtraction, an end carry IS discarded.',
        relatedLab: {
          labId: 'number-systems',
          label: 'Practice Complements Calculator',
        },
      },
      {
        id: 'u1-codes',
        unitId: 'unit1',
        number: '1.3',
        title: 'Weighted & Non-Weighted Binary Codes',
        summary:
          'Binary codes map decimal digits, characters, or control states into bit strings tailored for arithmetic ease, error reduction, or self-complementation.',
        keyPoints: [
          'Weighted Codes assign fixed positional weights to each bit (e.g., 8421 BCD, 2421, 5211). Sum of (bit × weight) equals the decimal digit.',
          '8421 BCD encodes each decimal digit 0–9 with its 4-bit binary value; codes 1010–1111 are invalid.',
          '2421 and Excess-3 are self-complementing codes: the 1\'s complement of a digit\'s code equals the code of its 9\'s complement.',
          'Non-Weighted Codes have no fixed bit weights: Excess-3 (BCD + 0011) and Gray Code (unit-distance/reflected code where adjacent values differ by exactly 1 bit, preventing glitch errors in rotary encoders and K-Maps).',
        ],
        formulas: [
          'Excess-3 = 8421 BCD + 0011 (decimal + 3)',
          'Binary to Gray: G_n = B_n,  G_i = B_(i+1) ⊕ B_i',
          'Gray to Binary: B_n = G_n,  B_i = B_(i+1) ⊕ G_i',
        ],
        table: {
          caption: 'Comparison of Common 4-Bit Binary Codes',
          headers: ['Decimal', '8421 BCD', '2421 (Self-Comp)', 'Excess-3', 'Gray Code'],
          rows: [
            ['0', '0000', '0000', '0011', '0000'],
            ['1', '0001', '0001', '0100', '0001'],
            ['2', '0010', '0010', '0101', '0011'],
            ['3', '0011', '0011', '0110', '0010'],
            ['4', '0100', '0100', '0111', '0110'],
            ['5', '0101', '1011', '1000', '0111'],
            ['9', '1001', '1111', '1100', '1101'],
          ],
        },
        workedExample: {
          problem: 'Convert binary (1011)₂ to Gray code and convert decimal 47 to Excess-3.',
          solution: [
            'Binary 1011 → G₃ = 1, G₂ = 1⊕0 = 1, G₁ = 0⊕1 = 1, G₀ = 1⊕1 = 0 → Gray = 1110.',
            'Decimal 47: digit 4 + 3 = 7 (0111), digit 7 + 3 = 10 (1010) → Excess-3 = 0111 1010.',
          ],
        },
        examTip:
          'Memorize why Gray code is called a unit-distance code: only a single bit changes between consecutive numbers, eliminating ambiguous intermediate states during transitions.',
        relatedLab: {
          labId: 'number-systems',
          label: 'Explore Binary Codes Table',
        },
      },
      {
        id: 'u1-hamming',
        unitId: 'unit1',
        number: '1.4',
        title: 'Parity Check Code & Hamming Code',
        summary:
          'Noise during storage or transmission can flip bits. Parity bits detect odd numbers of bit errors, whereas Hamming code uses overlapping parity checks to detect AND correct single-bit errors automatically.',
        keyPoints: [
          'Even Parity appends a bit so the total count of 1s is even; Odd Parity makes the total count of 1s odd. Single parity detects 1-bit errors but cannot locate or correct them.',
          'In Hamming codes, k parity bits placed at power-of-two positions (1, 2, 4, 8, ...) satisfy 2^k >= m + k + 1, where m is the number of data bits.',
          'For standard Hamming (7,4): 4 data bits (D3, D5, D6, D7) + 3 parity bits (P1, P2, P4).',
          'At the receiver, recomputing parity checks yields a 3-bit syndrome C = (C4 C2 C1)₂. If C = 000, no error; otherwise C directly gives the 1-indexed bit position of the flipped bit.',
        ],
        formulas: [
          'Redundancy inequality: 2^k >= m + k + 1',
          'P1 covers positions {1, 3, 5, 7}: P1 = D3 ⊕ D5 ⊕ D7',
          'P2 covers positions {2, 3, 6, 7}: P2 = D3 ⊕ D6 ⊕ D7',
          'P4 covers positions {4, 5, 6, 7}: P4 = D5 ⊕ D6 ⊕ D7',
          'Syndrome (error index): E = C4·4 + C2·2 + C1·1',
        ],
        workedExample: {
          problem: 'Encode 4-bit data D7 D6 D5 D3 = 1011 into even-parity Hamming (7,4) code.',
          solution: [
            'Place data in bit positions (7..1): D7=1, D6=0, D5=1, P4=?, D3=1, P2=?, P1=?.',
            'P1 = D3 ⊕ D5 ⊕ D7 = 1 ⊕ 1 ⊕ 1 = 1.',
            'P2 = D3 ⊕ D6 ⊕ D7 = 1 ⊕ 0 ⊕ 1 = 0.',
            'P4 = D5 ⊕ D6 ⊕ D7 = 1 ⊕ 0 ⊕ 1 = 0.',
            'Transmitted 7-bit codeword (pos 7 down to 1): 1 0 1 0 1 0 1.',
          ],
        },
        examTip:
          'Double-check bit numbering convention in exam problems: position 1 is always P1, position 2 is P2, position 4 is P4, and every position whose binary index has bit j set is checked by P_(2^j).',
        relatedLab: {
          labId: 'number-systems',
          label: 'Run Hamming (7,4) Fault Simulator',
        },
      },
      {
        id: 'u1-boolean-algebra',
        unitId: 'unit1',
        number: '1.5',
        title: 'Boolean Algebra: Basic Theorems & Properties',
        summary:
          'Boolean algebra defines algebraic operations (AND ·, OR +, NOT \') over the binary set {0, 1}, forming the mathematical foundation for analyzing and simplifying digital logic circuits.',
        keyPoints: [
          'Principle of Duality: Any valid Boolean identity remains valid if you interchange (+ ↔ ·) and (0 ↔ 1) without complementing variables.',
          'De Morgan\'s Theorems convert complemented products into sums of complements and vice versa—essential for NAND/NOR gate conversion.',
          'Absorption and Consensus theorems rapidly eliminate redundant literals and terms during algebraic minimization.',
        ],
        formulas: [
          'Identity: A + 0 = A  |  A · 1 = A',
          'Null / Dominance: A + 1 = 1  |  A · 0 = 0',
          'Idempotent: A + A = A  |  A · A = A',
          'Complement: A + A\' = 1  |  A · A\' = 0',
          'Distributive: A(B + C) = AB + AC  |  A + BC = (A + B)(A + C)',
          'Absorption: A + AB = A  |  A(A + B) = A  |  A + A\'B = A + B',
          'De Morgan\'s: (A + B)\' = A\' · B\'  |  (A · B)\' = A\' + B\'',
          'Consensus: AB + A\'C + BC = AB + A\'C',
        ],
        workedExample: {
          problem: 'Simplify F = A\'B\'C + A\'BC + AB\' algebraically.',
          solution: [
            'Factor A\'C from the first two terms: F = A\'C(B\' + B) + AB\'.',
            'Apply complement law (B\' + B = 1): F = A\'C + AB\'.',
            'No further common literals or consensus reduction applies; minimal SOP is A\'C + AB\'.',
          ],
        },
        examTip:
          'The second distributive law A + BC = (A + B)(A + C) does NOT hold in regular algebra, so examiners test it frequently when simplifying POS expressions.',
      },
      {
        id: 'u1-switching-functions',
        unitId: 'unit1',
        number: '1.6',
        title: 'Switching Functions: Canonical, Standard Forms & Simplification',
        summary:
          'Every Boolean function can be expressed uniquely in Canonical Form (using minterms or maxterms containing every variable) or more compactly in Standard SOP/POS forms.',
        keyPoints: [
          'Minterm (m_i): a product term containing all n variables (1 → uncomplemented, 0 → complemented) that evaluates to 1 for exactly one input combination.',
          'Maxterm (M_i): a sum term containing all n variables (0 → uncomplemented, 1 → complemented) that evaluates to 0 for exactly one input combination.',
          'Canonical SOP = Σm(indices where F = 1); Canonical POS = ΠM(indices where F = 0). Complementing a function swaps the indices: F\' = Σm(missing indices).',
          'Standard Form (SOP or POS) allows terms with fewer than n literals after algebraic simplification, directly reducing gate count and fan-in.',
        ],
        formulas: [
          'Canonical SOP: F(A, B, C) = Σ m(1, 4, 5, 6, 7)',
          'Canonical POS: F(A, B, C) = Π M(0, 2, 3)',
          'Minterm-Maxterm Relation: m_i\' = M_i',
        ],
        workedExample: {
          problem: 'Express F(A, B, C) = A + B\'C in Canonical SOP form.',
          solution: [
            'Expand A by multiplying (B + B\')(C + C\'): A = ABC + ABC\' + AB\'C + AB\'C\' (m7, m6, m5, m4).',
            'Expand B\'C by multiplying (A + A\'): B\'C = AB\'C + A\'B\'C (m5, m1).',
            'Combine unique minterms: F = Σm(1, 4, 5, 6, 7).',
            'Equivalently in Canonical POS: F = ΠM(0, 2, 3).',
          ],
        },
        examTip:
          'Remember the polarity flip! In minterms, 1 = A and 0 = A\'. In maxterms, 0 = A and 1 = A\'. Mixing these up is the #1 mistake in canonical conversion problems.',
      },
      {
        id: 'u1-logic-gates',
        unitId: 'unit1',
        number: '1.7',
        title: 'Fundamentals of Digital Logic Gates',
        summary:
          'Digital logic gates are physical electronic circuits implementing elementary Boolean operators. NAND and NOR are Universal Gates because any Boolean function can be constructed using only NAND or only NOR gates.',
        keyPoints: [
          'Basic Gates: AND (all inputs 1 → 1), OR (any input 1 → 1), NOT (inverter).',
          'Universal Gates: NAND = (AB)\' and NOR = (A + B)\'. Tie inputs together to form NOT; apply De Morgan\'s law to build AND, OR, XOR.',
          'Exclusive Gates: XOR (A ⊕ B = A\'B + AB\') outputs 1 when inputs differ (odd-1s detector); XNOR (A ⊙ B = AB + A\'B\') outputs 1 when inputs match (equality detector).',
        ],
        table: {
          caption: '2-Input Logic Gate Output Summary',
          headers: ['A', 'B', 'AND', 'OR', 'NAND', 'NOR', 'XOR', 'XNOR'],
          rows: [
            ['0', '0', '0', '0', '1', '1', '0', '1'],
            ['0', '1', '0', '1', '1', '0', '1', '0'],
            ['1', '0', '0', '1', '1', '0', '1', '0'],
            ['1', '1', '1', '1', '0', '0', '0', '1'],
          ],
        },
        workedExample: {
          problem: 'How many 2-input NAND gates are needed to realize an XOR gate (A ⊕ B)?',
          solution: [
            'Gate 1: G1 = (A · B)\'.',
            'Gate 2: G2 = (A · G1)\'.',
            'Gate 3: G3 = (B · G1)\'.',
            'Gate 4: Y = (G2 · G3)\' = A\'B + AB\' = A ⊕ B.',
            'Minimum count = 4 two-input NAND gates (and 5 two-input NOR gates).',
          ],
        },
        examTip:
          'Memorize universal gate minimums for exams: NOT = 1, AND = 2 NAND / 3 NOR, OR = 3 NAND / 2 NOR, XOR = 4 NAND / 5 NOR, XNOR = 5 NAND / 4 NOR.',
        relatedLab: {
          labId: 'logic-gates',
          label: 'Launch Logic Gate Simulator',
        },
      },
    ],
  },
  {
    id: 'unit2',
    roman: 'Unit II',
    shortTitle: 'Combinational Circuits',
    title: 'Minimization & Combinational Logic Circuits',
    courseOutcome:
      'CO2: Analyze and simplify Boolean expressions using Karnaugh-maps, tabulation method, and design combinational circuits.',
    syllabusExcerpt:
      'Implementation of logic functions using K-Map, Quine-McCluskey Tabular method, Adders: half adder, full adder, Subtractors, Comparators, Multiplexers, De-multiplexers, Encoders and Decoders.',
    topics: [
      {
        id: 'u2-kmap',
        unitId: 'unit2',
        number: '2.1',
        title: 'Karnaugh Map (K-Map) Simplification',
        summary:
          'A Karnaugh Map is a graphical Gray-coded grid of minterms where adjacent cells differ by only one variable, allowing rapid visual grouping into minimal SOP or POS expressions.',
        keyPoints: [
          'Adjacent cells wrap around top-to-bottom and left-to-right (cylindrical/toroidal adjacency).',
          'Valid groups must contain 2^k cells (1, 2, 4, 8, or 16). Larger groups eliminate more literals (a group of 2^k eliminates k variables).',
          'Prime Implicant (PI): largest possible valid group of 1s (and optional X don\'t-cares). Essential Prime Implicant (EPI): a PI covering at least one 1 not covered by any other PI.',
          'Don\'t Care (X or d) cells may be treated as 1 to enlarge a group, or 0 if not helpful—never create a group containing only Xs.',
        ],
        formulas: [
          '3-Variable K-Map: 8 cells (columns ordered 00, 01, 11, 10)',
          '4-Variable K-Map: 16 cells (rows & columns ordered 00, 01, 11, 10)',
          'Group of 2^k cells in n-var map → term with (n - k) literals',
        ],
        workedExample: {
          problem: 'Minimize F(A, B, C, D) = Σm(0, 1, 2, 5, 8, 9, 10) using a 4-variable K-Map.',
          solution: [
            'Plot 1s at cells 0, 1, 2, 5, 8, 9, 10.',
            'Group 1 (four corners 0, 2, 8, 10): B\'D\'.',
            'Group 2 (wrap-around 0, 1, 8, 9): B\'C\'.',
            'Group 3 (pair 1, 5): A\'C\'D.',
            'Minimal SOP: F = B\'D\' + B\'C\' + A\'C\'D.',
          ],
        },
        examTip:
          'Always check the 4 corners of a 4-variable K-Map (m0, m2, m8, m10) — they form a valid quad yielding B\'D\' and are frequently missed under exam time pressure.',
        relatedLab: {
          labId: 'kmap-flipflops',
          label: 'Open Interactive K-Map Solver',
        },
      },
      {
        id: 'u2-quine-mccluskey',
        unitId: 'unit2',
        number: '2.2',
        title: 'Quine-McCluskey (Tabular) Method',
        summary:
          'The Quine-McCluskey tabular algorithm systematically minimizes Boolean functions of any number of variables (especially 5+ variables where K-Maps become unwieldy) and is directly implementable in software.',
        keyPoints: [
          'Step 1 (Group by Index): List all minterms (and don\'t cares) in binary, grouped by the number of 1s in each binary representation.',
          'Step 2 (Iterative Pairing): Compare terms in adjacent groups (differing by exactly 1 bit). Replace the differing bit with a dash (-) and check off combined terms. Repeat until no further combinations are possible.',
          'Step 3 (Identify Prime Implicants): All unchecked terms from every stage are Prime Implicants (PIs).',
          'Step 4 (Prime Implicant Chart): Columns are required minterms (exclude don\'t cares); rows are PIs. Any column with a single X identifies an Essential Prime Implicant (EPI). Select EPIs first, then pick minimal remaining PIs to cover leftover columns.',
        ],
        formulas: [
          'Combining condition: Two binary terms differ in exactly 1 bit position',
          'Number of dashes (-) in a PI = k → term eliminates k literals',
        ],
        workedExample: {
          problem: 'Find the Essential Prime Implicants for F(A, B, C) = Σm(0, 1, 2, 5, 6, 7).',
          solution: [
            'Group 0: m0(000) | Group 1: m1(001), m2(010) | Group 2: m5(101), m6(110) | Group 3: m7(111).',
            'Combine adjacent groups: (0,1)=00-, (0,2)=0-0, (1,5)=-01, (2,6)=-10, (5,7)=1-1, (6,7)=11-.',
            'No further combinations differ in 1 bit with aligned dashes → 6 PIs, each covering 2 minterms.',
            'PI chart forms a cyclic cover → two minimal solutions: F = A\'B\' + BC\' + AB or F = A\'C\' + B\'C + AC.',
          ],
        },
        examTip:
          'Never include Don\'t Care minterms as columns in the Prime Implicant Chart! Include them in Step 1–2 to build larger PIs, then drop them in Step 4.',
      },
      {
        id: 'u2-adders-subtractors',
        unitId: 'unit2',
        number: '2.3',
        title: 'Adders & Subtractors (Half & Full)',
        summary:
          'Binary adders and subtractors are core arithmetic combinational blocks inside every ALU. A Full Adder cascades into an n-bit Ripple Carry Adder, and with XOR gates can perform both addition and 2\'s-complement subtraction.',
        keyPoints: [
          'Half Adder adds two 1-bit operands (A, B) producing Sum (S = A ⊕ B) and Carry (C = AB). Cannot accept an incoming carry.',
          'Full Adder adds three bits (A, B, Cin) producing Sum = A ⊕ B ⊕ Cin and Cout = AB + Cin(A ⊕ B). Realizable using 2 Half Adders + 1 OR gate.',
          'Half Subtractor computes Difference (D = A ⊕ B) and Borrow (Bout = A\'B).',
          'Full Subtractor computes Difference (D = A ⊕ B ⊕ Bin) and Borrow (Bout = A\'B + Bin(A ⊕ B)\').',
          '4-Bit Adder/Subtractor uses a mode pin M: M = 0 adds A + B; M = 1 inverts B via XOR gates and injects Cin = 1 to compute A + B\' + 1 = A - B.',
        ],
        formulas: [
          'Half Adder: S = A ⊕ B,   C = A · B',
          'Full Adder: S = A ⊕ B ⊕ Cin,   Cout = AB + BCin + ACin = AB + Cin(A ⊕ B)',
          'Half Subtractor: D = A ⊕ B,   Bout = A\' · B',
          'Full Subtractor: D = A ⊕ B ⊕ Bin,   Bout = A\'B + Bin · (A ⊕ B)\'',
        ],
        workedExample: {
          problem: 'Evaluate a Full Adder for inputs A = 1, B = 1, Cin = 1.',
          solution: [
            'Sum S = 1 ⊕ 1 ⊕ 1 = 0 ⊕ 1 = 1.',
            'Carry Cout = (1·1) + (1·(1 ⊕ 1)) = 1 + 0 = 1.',
            'Binary output (Cout S) = (11)₂ = 3₁₀, matching 1 + 1 + 1 = 3.',
          ],
        },
        examTip:
          'Notice how Sum and Difference equations are identical (A ⊕ B ⊕ Cin/Bin), while Borrow simply complements A in the carry product terms.',
        relatedLab: {
          labId: 'logic-gates',
          label: 'Test Half & Full Adder in Lab',
        },
      },
      {
        id: 'u2-comparators',
        unitId: 'unit2',
        number: '2.4',
        title: 'Magnitude Comparators',
        summary:
          'A magnitude comparator compares two n-bit binary numbers A and B and activates one of three mutually exclusive outputs: A > B, A = B, or A < B.',
        keyPoints: [
          '1-Bit Comparator: (A > B) = AB\', (A < B) = A\'B, (A = B) = A ⊙ B = AB + A\'B\'.',
          'Multi-Bit Comparison proceeds from MSB to LSB: define equality bit x_i = A_i ⊙ B_i for each bit position i.',
          'For a 2-bit comparator comparing A1A0 and B1B0: A = B when x1·x0 = 1; A > B when A1B1\' + x1·A0B0\'; A < B when A1\'B1 + x1·A0\'B0.',
          'Standard IC 7485 is a 4-bit cascadable magnitude comparator with cascading inputs for expanding to 8, 12, or 16 bits.',
        ],
        formulas: [
          'Bit equality: x_i = A_i · B_i + A_i\' · B_i\' = (A_i ⊕ B_i)\'',
          '2-bit (A = B) = x1 · x0',
          '2-bit (A > B) = A1·B1\' + x1·A0·B0\'',
          '2-bit (A < B) = A1\'·B1 + x1·A0\'·B0',
        ],
        workedExample: {
          problem: 'Evaluate a 2-bit comparator for A = 10₂ (2) and B = 11₂ (3).',
          solution: [
            'MSB: A1 = 1, B1 = 1 → x1 = 1 (equal at MSB, so check LSB).',
            'LSB: A0 = 0, B0 = 1 → x0 = 0.',
            '(A = B) = 1·0 = 0;  (A > B) = 1·0 + 1·0·0 = 0;  (A < B) = 0·1 + 1·1·1 = 1.',
            'Output asserts A < B = 1.',
          ],
        },
        examTip:
          'Write x_i = (A_i ⊕ B_i)\' first in 4-bit comparator derivations—it keeps the A > B and A < B equations compact and prevents algebra errors.',
      },
      {
        id: 'u2-mux-demux',
        unitId: 'unit2',
        number: '2.5',
        title: 'Multiplexers (MUX) & De-multiplexers (DEMUX)',
        summary:
          'A Multiplexer (data selector) routes one of 2^n input lines to a single output line chosen by n select lines. A De-multiplexer performs the inverse: routing 1 input line to one of 2^n output lines.',
        keyPoints: [
          'A 2^n : 1 MUX has 2^n data inputs (I0..I_(2^n-1)), n select lines (S_(n-1)..S0), and 1 output Y.',
          'Universal Logic Implementation: Any n-variable Boolean function can be implemented with a 2^(n-1) : 1 MUX by connecting (n - 1) variables to select lines and expressing each data input as 0, 1, D, or D\' (the remaining variable).',
          'Higher-order MUXes are built from smaller ones (e.g., an 8:1 MUX uses two 4:1 MUXes + one 2:1 MUX, or an enable tree).',
          'A 1 : 2^n DEMUX with data input D wired to logic 1 behaves identically to an active-high n-to-2^n Decoder.',
        ],
        formulas: [
          '2:1 MUX: Y = S\'·I0 + S·I1',
          '4:1 MUX: Y = S1\'S0\'I0 + S1\'S0I1 + S1S0\'I2 + S1S0I3',
          '1:4 DEMUX: Y0 = S1\'S0\'D, Y1 = S1\'S0D, Y2 = S1S0\'D, Y3 = S1S0D',
        ],
        workedExample: {
          problem: 'Implement F(A, B, C) = Σm(1, 2, 6, 7) using a 4:1 MUX with select lines A, B.',
          solution: [
            'Partition minterms by (A, B) pairs → I0 (00): m0=0, m1=1 → I0 = C.',
            'I1 (01): m2=1, m3=0 → I1 = C\'.',
            'I2 (10): m4=0, m5=0 → I2 = 0.',
            'I3 (11): m6=1, m7=1 → I3 = 1.',
            'Connect S1=A, S0=B and data pins (I0, I1, I2, I3) = (C, C\', 0, 1).',
          ],
        },
        examTip:
          'MUX implementation tables (with two rows for C\' and C and columns I0..I3) are guaranteed full-credit exam problems—always circle the listed minterms and inspect each column.',
      },
      {
        id: 'u2-encoders-decoders',
        unitId: 'unit2',
        number: '2.6',
        title: 'Encoders & Decoders',
        summary:
          'Decoders convert an n-bit binary code into at most 2^n unique active output lines (minterms). Encoders perform the reverse, compressing 2^n input lines into an n-bit binary code.',
        keyPoints: [
          'An n-to-2^n Decoder generates all 2^n minterms; adding an external OR gate summing the required outputs implements any Boolean function.',
          'An Enable (E) pin allows cascading decoders (e.g., two 3-to-8 decoders form a 4-to-16 decoder using MSB as E and E\').',
          'Simple Encoders assume only one input is active at a time; Priority Encoders resolve simultaneous active inputs by encoding the highest-priority line and asserting a Valid (V) output bit.',
          'BCD-to-7-Segment Decoders drive numeric LED displays by mapping 4-bit BCD digits (0–9) to segments a–g.',
        ],
        formulas: [
          '2-to-4 Decoder: D0 = E·A\'B\', D1 = E·A\'B, D2 = E·AB\', D3 = E·AB',
          '4-to-2 Priority Encoder (D3 highest): Y1 = D3 + D2,  Y0 = D3 + D2\'D1,  V = D0 + D1 + D2 + D3',
        ],
        workedExample: {
          problem: 'Implement a Full Adder using a 3-to-8 Decoder and two OR gates.',
          solution: [
            'Full Adder minterms: Sum S(A, B, Cin) = Σm(1, 2, 4, 7), Carry Cout(A, B, Cin) = Σm(3, 5, 6, 7).',
            'Connect A, B, Cin to the 3 decoder inputs.',
            'OR decoder outputs D1, D2, D4, D7 to produce Sum S.',
            'OR decoder outputs D3, D5, D6, D7 to produce Cout.',
          ],
        },
        examTip:
          'If a decoder has active-LOW outputs (bubbles on D0..D7), use a NAND gate instead of an OR gate to sum minterms (by De Morgan\'s law, NAND of inverted minterms equals OR of minterms).',
      },
    ],
  },
  {
    id: 'unit3',
    roman: 'Unit III',
    shortTitle: 'Sequential Circuits',
    title: 'Latches, Flip-Flops & Sequential Circuit Design',
    courseOutcome: 'CO3: Analyze and design various Sequential circuits.',
    syllabusExcerpt:
      'Basic Architectural Distinctions between Combinational and Sequential circuits, SR Latch, Flip Flops: SR, JK, JK Master Slave, D and T Type Flip Flops. Excitation Table of all Flip Flops, Conversion from one type of Flip-Flop to another.',
    topics: [
      {
        id: 'u3-comb-vs-seq',
        unitId: 'unit3',
        number: '3.1',
        title: 'Combinational vs. Sequential Circuits',
        summary:
          'Unlike combinational circuits whose outputs depend purely on present inputs, sequential circuits incorporate memory elements and feedback paths so outputs depend on both present inputs and past history (present state).',
        keyPoints: [
          'Feedback & Storage: Sequential circuits feed the state outputs of storage elements (latches/flip-flops) back into the combinational next-state logic.',
          'Synchronous vs. Asynchronous: Synchronous sequential circuits change state only at discrete clock edges (predictable, glitch-resistant); asynchronous circuits respond immediately to input level changes.',
          'Level-Triggered vs. Edge-Triggered: Latches are transparent while enable/clock is at an active level; Flip-Flops sample inputs only at rising (positive) or falling (negative) clock edges.',
          'Finite State Machines: Moore outputs depend only on present state; Mealy outputs depend on both present state and current inputs.',
        ],
        table: {
          caption: 'Architectural Comparison: Combinational vs. Sequential',
          headers: ['Property', 'Combinational Circuit', 'Sequential Circuit'],
          rows: [
            ['Output dependency', 'Present inputs only', 'Present inputs + past state'],
            ['Memory elements', 'None', 'Latches / Flip-Flops required'],
            ['Feedback path', 'Absent', 'Present (state → next-state logic)'],
            ['Clock signal', 'Not required', 'Required (synchronous systems)'],
            ['Examples', 'Adders, MUX, Decoders', 'Registers, Counters, FSMs'],
          ],
        },
        workedExample: {
          problem: 'Classify an 8:1 Multiplexer, a 4-bit Ripple Counter, and a Priority Encoder.',
          solution: [
            '8:1 Multiplexer → Combinational (no memory/feedback; output follows select & data inputs immediately).',
            '4-bit Ripple Counter → Sequential (stores current count in flip-flops; next count depends on prior count).',
            'Priority Encoder → Combinational (output depends solely on active input lines right now).',
          ],
        },
        examTip:
          'When sketching the block diagram of a sequential circuit in exams, always include the Combinational Logic block, the Memory Elements (Flip-Flops) block, the Clock input, and the labeled Present State / Next State feedback loop.',
      },
      {
        id: 'u3-sr-latch',
        unitId: 'unit3',
        number: '3.2',
        title: 'SR Latch (NOR & NAND Implementations)',
        summary:
          'The SR (Set-Reset) latch is the fundamental 1-bit cross-coupled bistable storage element capable of holding logic 0 or logic 1 indefinitely while power is applied.',
        keyPoints: [
          'NOR-based SR Latch (Active-High): S=1, R=0 Sets Q=1; S=0, R=1 Resets Q=0; S=0, R=0 Holds previous state; S=1, R=1 is Forbidden/Invalid (forces Q = Q\' = 0, causing unpredictable race if released simultaneously).',
          'NAND-based S\'R\' Latch (Active-Low): S\'=0, R\'=1 Sets Q=1; S\'=1, R\'=0 Resets Q=0; S\'=1, R\'=1 Holds; S\'=0, R\'=0 is Forbidden (forces Q = Q\' = 1).',
          'Gated SR Latch adds two front-end control gates with an Enable (EN) pin so S and R only affect the latch when EN = 1.',
        ],
        table: {
          caption: 'NOR-Based Active-High SR Latch Function Table',
          headers: ['S', 'R', 'Q(next)', 'Q\'(next)', 'Operation'],
          rows: [
            ['0', '0', 'Q(prev)', 'Q\'(prev)', 'Hold (No Change)'],
            ['0', '1', '0', '1', 'Reset'],
            ['1', '0', '1', '0', 'Set'],
            ['1', '1', '0', '0', 'Invalid / Forbidden'],
          ],
        },
        workedExample: {
          problem: 'Trace a NOR SR latch starting at Q = 0 when (S, R) receives (1,0) → (0,0) → (0,1) → (0,0).',
          solution: [
            '(S=1, R=0): Latch Sets → Q = 1, Q\' = 0.',
            '(S=0, R=0): Latch Holds → Q remains 1.',
            '(S=0, R=1): Latch Resets → Q = 0, Q\' = 1.',
            '(S=0, R=0): Latch Holds → Q remains 0.',
          ],
        },
        examTip:
          'Check whether a diagram uses NOR or NAND gates! In a NOR latch, 00 is Hold and 11 is Forbidden; in a bare NAND latch, 11 is Hold and 00 is Forbidden.',
        relatedLab: {
          labId: 'kmap-flipflops',
          label: 'Simulate SR Latch & Flip-Flops',
        },
      },
      {
        id: 'u3-sr-jk-ms',
        unitId: 'unit3',
        number: '3.3',
        title: 'SR, JK & JK Master-Slave Flip-Flops',
        summary:
          'Clocked flip-flops synchronize state changes to a clock. The JK flip-flop eliminates the SR invalid state by turning J=1, K=1 into a deterministic Toggle, while Master-Slave architecture solves the Race-Around condition.',
        keyPoints: [
          'Clocked SR Flip-Flop: Characteristic equation Q(t+1) = S + R\'Q with constraint SR = 0 (S=1, R=1 remains invalid).',
          'JK Flip-Flop: Feeds Q\' back to the J-input gate and Q back to the K-input gate. J=1, K=1 toggles Q → Q\'. Characteristic equation: Q(t+1) = JQ\' + K\'Q.',
          'Race-Around Condition: In a level-triggered JK flip-flop with J = K = 1, if clock pulse width t_p > propagation delay t_pd, Q toggles repeatedly during a single clock pulse, leaving the final state indeterminate.',
          'JK Master-Slave Flip-Flop: Cascades two JK stages—Master responds while CLK = 1 (Slave isolated because CLK\' = 0), and Slave copies Master\'s output when CLK transitions to 0. Eliminates race-around because Q cannot feed back to Master within the same clock pulse.',
        ],
        formulas: [
          'SR Flip-Flop: Q(t+1) = S + R\'·Q   (constraint: S·R = 0)',
          'JK Flip-Flop: Q(t+1) = J·Q\' + K\'·Q',
          'Race-Around condition occurs when: J = K = 1 and t_pulse > t_pd',
        ],
        workedExample: {
          problem: 'If a JK Flip-Flop currently stores Q = 1, find Q(t+1) for (J=0, K=1) and (J=1, K=1).',
          solution: [
            'Using Q(t+1) = JQ\' + K\'Q:',
            'For J=0, K=1, Q=1: Q(t+1) = (0)(0) + (0)(1) = 0 (Reset).',
            'For J=1, K=1, Q=1: Q(t+1) = (1)(0) + (0)(1) = 0 (Toggle from 1 to 0).',
          ],
        },
        examTip:
          'When explaining Race-Around in exams, mention BOTH fixes: (1) Edge-triggered JK flip-flops and (2) Master-Slave JK flip-flops (note: Master-Slave is still susceptible to "ones-catching" if J/K glitch while CLK=1).',
        relatedLab: {
          labId: 'kmap-flipflops',
          label: 'Step Clock Pulses in Flip-Flop Lab',
        },
      },
      {
        id: 'u3-d-t-ff',
        unitId: 'unit3',
        number: '3.4',
        title: 'D and T Type Flip-Flops',
        summary:
          'D (Data/Delay) and T (Toggle) flip-flops are single-input specializations derived from SR and JK flip-flops—D flip-flops dominate registers and pipelines, while T flip-flops dominate binary counters and frequency dividers.',
        keyPoints: [
          'D Flip-Flop connects R = S\' (or K = J\') via an inverter, completely removing the invalid state. On the active clock edge, Q(t+1) = D (transparent data capture / 1-clock delay).',
          'T Flip-Flop ties J = K = T on a JK flip-flop. When T = 0, Q holds; when T = 1, Q toggles (Q(t+1) = T ⊕ Q).',
          'Frequency Division: A T flip-flop with T = 1 divides the input clock frequency by 2 (f_out = f_clk / 2); cascading n stages divides by 2^n.',
        ],
        formulas: [
          'D Flip-Flop Characteristic Equation: Q(t+1) = D',
          'T Flip-Flop Characteristic Equation: Q(t+1) = T ⊕ Q = T·Q\' + T\'·Q',
        ],
        table: {
          caption: 'D and T Flip-Flop Characteristic Behavior',
          headers: ['Input', 'D-FF Q(t+1)', 'T-FF Q(t+1)', 'T-FF Mode'],
          rows: [
            ['0', '0 (Reset)', 'Q(t)', 'Hold'],
            ['1', '1 (Set)', 'Q\'(t)', 'Toggle'],
          ],
        },
        workedExample: {
          problem: 'A 16 MHz clock feeds a cascade of 3 T flip-flops (all T = 1). What is the output frequency?',
          solution: [
            'Each T flip-flop with T = 1 divides frequency by 2.',
            'After 3 stages: f_out = 16 MHz / 2³ = 16 MHz / 8 = 2 MHz.',
          ],
        },
        examTip:
          'Remember: A D flip-flop can act as a T flip-flop simply by connecting Q\' back to D (or D = T ⊕ Q).',
        relatedLab: {
          labId: 'kmap-flipflops',
          label: 'Test D & T Flip-Flops',
        },
      },
      {
        id: 'u3-excitation-tables',
        unitId: 'unit3',
        number: '3.5',
        title: 'Excitation Table of All Flip-Flops',
        summary:
          'While a characteristic table asks "given inputs, what is the next state?", an excitation table asks the synthesis question: "given a desired transition Q(t) → Q(t+1), what inputs must we apply?"',
        keyPoints: [
          'Excitation tables are essential for designing synchronous counters, finite state machines, and converting one flip-flop type into another.',
          'Don\'t Care (X) entries in SR and JK excitation tables significantly simplify K-Map synthesis of next-state logic.',
          'JK flip-flop has the most don\'t-cares (one X in every row), typically producing the smallest combinational input hardware.',
        ],
        table: {
          caption: 'Unified Excitation Table for SR, JK, D, and T Flip-Flops',
          headers: ['Q(t)', 'Q(t+1)', 'S', 'R', 'J', 'K', 'D', 'T'],
          rows: [
            ['0', '0', '0', 'X', '0', 'X', '0', '0'],
            ['0', '1', '1', '0', '1', 'X', '1', '1'],
            ['1', '0', '0', '1', 'X', '1', '0', '1'],
            ['1', '1', 'X', '0', 'X', '0', '1', '0'],
          ],
        },
        workedExample: {
          problem: 'Using the unified table, determine the required inputs to transition Q from 1 → 0 for all four flip-flops.',
          solution: [
            'Row Q(t)=1, Q(t+1)=0:',
            'SR Flip-Flop: S = 0, R = 1.',
            'JK Flip-Flop: J = X, K = 1 (either Reset 01 or Toggle 11 works).',
            'D Flip-Flop: D = 0 (always equals Q(t+1)).',
            'T Flip-Flop: T = 1 (since state changed, T = Q(t) ⊕ Q(t+1) = 1).',
          ],
        },
        examTip:
          'Quick memory trick for the exam: D column always equals Q(t+1), T column always equals Q(t) ⊕ Q(t+1), J column is (0, 1, X, X), and K column is (X, X, 1, 0)!',
        relatedLab: {
          labId: 'kmap-flipflops',
          label: 'Open Excitation Table Trainer',
        },
      },
      {
        id: 'u3-ff-conversion',
        unitId: 'unit3',
        number: '3.6',
        title: 'Conversion from One Flip-Flop Type to Another',
        summary:
          'Any available flip-flop (say SR or D) can emulate any desired flip-flop (say JK or T) by placing a small combinational converter circuit ahead of the available flip-flop\'s inputs.',
        keyPoints: [
          '4-Step Conversion Algorithm: (1) Write the characteristic table of the REQUIRED flip-flop (inputs + Q(t) → Q(t+1)).',
          '(2) Append the excitation inputs of the AVAILABLE flip-flop corresponding to each Q(t) → Q(t+1) transition.',
          '(3) Simplify each available flip-flop input as a Boolean function of (required inputs, Q(t)) using K-Maps.',
          '(4) Draw the logic diagram connecting the simplified gate network to the available flip-flop.',
        ],
        formulas: [
          'SR → JK:   S = J·Q\',   R = K·Q',
          'SR → D:    S = D,      R = D\'',
          'JK → D:    J = D,      K = D\'',
          'JK → T:    J = T,      K = T',
          'D → JK:    D = J·Q\' + K\'·Q',
          'D → T:     D = T ⊕ Q',
          'T → D:     T = D ⊕ Q',
        ],
        workedExample: {
          problem: 'Convert a D Flip-Flop (available) into a JK Flip-Flop (required).',
          solution: [
            'Required characteristic equation of JK: Q(t+1) = J·Q\' + K\'·Q.',
            'Available D flip-flop excitation requires D = Q(t+1).',
            'Therefore directly set D = J·Q\' + K\'·Q.',
            'Hardware: two AND gates (J·Q\' and K\'·Q) feeding one OR gate into pin D.',
          ],
        },
        examTip:
          'Whenever the AVAILABLE flip-flop is a D flip-flop, D simply equals the characteristic equation of the REQUIRED flip-flop—zero K-Map work needed to verify your answer!',
        relatedLab: {
          labId: 'kmap-flipflops',
          label: 'Inspect Flip-Flop Conversion Guide',
        },
      },
    ],
  },
  {
    id: 'unit4',
    roman: 'Unit IV',
    shortTitle: 'Computer Structure',
    title: 'Basic Structure of Computers & I/O Organization',
    courseOutcome:
      'CO4: Illustrate the operation of a digital computer and understand its organization.',
    syllabusExcerpt:
      'Computer Types, Block diagram of Digital computer, Basic Operational Concepts, Bus Structures, Stored program organization and computer registers, Instruction formats, Input/output Organization: Block diagram of I/O organization, Interrupts, direct memory access. Asynchronous data transfer: strobe control and handshaking.',
    topics: [
      {
        id: 'u4-types-block',
        unitId: 'unit4',
        number: '4.1',
        title: 'Computer Types & Block Diagram of a Digital Computer',
        summary:
          'Modern digital computers span embedded microcontrollers to supercomputers, yet virtually all share five classic von Neumann functional units: Input, Memory, Arithmetic & Logic Unit (ALU), Control Unit, and Output.',
        keyPoints: [
          'Computer Types: Embedded Systems, Personal Computers / Workstations, Enterprise Servers, Mainframes, and Supercomputers (differing in throughput, parallelism, and I/O scale).',
          'Five Functional Units: Input Unit converts human/sensor data to binary; Memory Unit stores both programs and data; ALU executes arithmetic/logic operations; Control Unit coordinates timing and control signals; Output Unit delivers processed results.',
          'CPU (Processor) = ALU + Control Unit + Internal Registers.',
        ],
        table: {
          caption: 'Five Functional Units of a Digital Computer',
          headers: ['Unit', 'Primary Responsibility', 'Typical Examples'],
          rows: [
            ['Input', 'Accepts coded data & instructions', 'Keyboard, ADC, Sensors, NIC'],
            ['Memory', 'Stores active programs and operands', 'Cache, Main RAM, Disk'],
            ['ALU', 'Performs arithmetic & logical ops', 'Adders, Shifters, Comparators'],
            ['Control Unit', 'Generates timing & control signals', 'Hardwired / Microprogrammed CU'],
            ['Output', 'Sends processed results externally', 'Display, Printer, Actuators'],
          ],
        },
        workedExample: {
          problem: 'Trace which functional units collaborate when executing "ADD R1, R2".',
          solution: [
            'Memory supplies the binary ADD instruction word.',
            'Control Unit fetches and decodes the opcode, directing register reads.',
            'ALU adds the contents of R1 and R2 and writes the result back to the destination register.',
          ],
        },
        examTip:
          'In the Digital Computer block diagram, distinguish Data Paths (solid arrows) from Control Signals (dashed arrows originating from the Control Unit to all other units).',
        relatedLab: {
          labId: 'cpu-memory',
          label: 'Open CPU Architecture Visualizer',
        },
      },
      {
        id: 'u4-operational-bus',
        unitId: 'unit4',
        number: '4.2',
        title: 'Basic Operational Concepts & Bus Structures',
        summary:
          'Instructions stored in memory are fetched and executed sequentially under Control Unit supervision over shared communication pathways called buses.',
        keyPoints: [
          'Instruction Cycle: Fetch (read instruction at PC into IR, increment PC) → Decode (interpret opcode & addressing) → Execute (fetch operand, perform ALU op, store result).',
          'System Bus consists of three line groups: Address Bus (unidirectional CPU → Memory/I/O, width determines max addressable memory 2^k), Data Bus (bidirectional, determines word transfer size), and Control Bus (Read/Write, Clock, Interrupt, Bus Request/Grant).',
          'Single-Bus Structure: Low cost and flexible, but only two units can communicate at a time (bus contention bottleneck).',
          'Multi-Bus Structure: Separates high-speed processor-memory traffic from slower peripheral I/O buses, enabling concurrent transfers and higher throughput.',
        ],
        formulas: [
          'Max Addressable Locations = 2^(Address Bus Width)',
          'Bus Bandwidth = (Data Bus Width in bytes) × (Bus Clock Frequency)',
        ],
        workedExample: {
          problem: 'A byte-addressable CPU has a 24-bit address bus and a 32-bit data bus. Find its maximum addressable memory and word transfer size.',
          solution: [
            'Addressable memory = 2²⁴ bytes = 16 × 2²⁰ bytes = 16 MB.',
            'Data bus transfers 32 bits = 4 bytes per memory bus cycle.',
          ],
        },
        examTip:
          'Always specify the direction of each bus in exam questions: Address Bus is unidirectional (master to slave), Data Bus is bidirectional, and Control Bus lines are mixed directional.',
        relatedLab: {
          labId: 'cpu-memory',
          label: 'Step Through Fetch-Decode-Execute',
        },
      },
      {
        id: 'u4-stored-program-registers',
        unitId: 'unit4',
        number: '4.3',
        title: 'Stored Program Organization & Computer Registers',
        summary:
          'In von Neumann\'s Stored Program concept, program instructions and data reside together in the same main memory, moved through dedicated high-speed CPU registers during execution.',
        keyPoints: [
          'Program Counter (PC): Holds the memory address of the next instruction to be fetched.',
          'Instruction Register (IR): Holds the binary instruction currently being decoded and executed.',
          'Memory Address Register (MAR / AR): Holds the address for an active memory Read or Write.',
          'Memory Data Register (MDR / DR): Buffers data traveling between main memory and the CPU.',
          'Accumulator (AC): Primary working register holding ALU operands and results in single-accumulator architectures.',
          'Other Basic Computer Registers (Mano): Temporary Register (TR), Input Register (INPR, 8-bit), Output Register (OUTR, 8-bit), and Status/Flag Register (Carry, Zero, Sign, Overflow).',
        ],
        table: {
          caption: 'Essential CPU Registers (Stored-Program Basic Computer)',
          headers: ['Register', 'Full Name', 'Role in Execution'],
          rows: [
            ['PC', 'Program Counter', 'Address of next instruction'],
            ['IR', 'Instruction Register', 'Current instruction being executed'],
            ['MAR / AR', 'Memory Address Reg.', 'Target address on address bus'],
            ['MDR / DR', 'Memory Data Reg.', 'Operand/instruction read from or written to RAM'],
            ['AC', 'Accumulator', 'Primary ALU operand & result register'],
            ['INPR / OUTR', 'Input / Output Reg.', '8-bit character buffer for I/O devices'],
          ],
        },
        workedExample: {
          problem: 'Write the RTL micro-operations for the Instruction Fetch phase.',
          solution: [
            'T0: MAR ← PC  (place next instruction address on address bus).',
            'T1: MDR ← M[MAR],  PC ← PC + 1  (read instruction word & advance PC).',
            'T2: IR ← MDR  (load fetched instruction into IR for decoding).',
          ],
        },
        examTip:
          'Write Fetch micro-operations cleanly in RTL arrow notation (MAR ← PC; IR ← M[MAR], PC ← PC + 1)—examiners look for those exact three transfers.',
        relatedLab: {
          labId: 'cpu-memory',
          label: 'Watch Registers Update Live',
        },
      },
      {
        id: 'u4-instruction-formats',
        unitId: 'unit4',
        number: '4.4',
        title: 'Instruction Formats (0, 1, 2, and 3-Address)',
        summary:
          'An instruction format defines the bit layout of Opcode, Mode/Addressing bits, and Operand Address fields. CPU organization determines how many explicit address fields each instruction carries.',
        keyPoints: [
          'Three-Address (General Register Org): ADD R1, A, B → R1 ← M[A] + M[B]. Shortest programs, but longest instruction words.',
          'Two-Address (Common Commercial CPUs): ADD R1, B → R1 ← R1 + M[B]. First operand serves as both source and destination.',
          'One-Address (Accumulator Org): Implies AC as one operand and destination (LOAD A; ADD B; STORE X).',
          'Zero-Address (Stack Org): Operands are implicitly popped from Top-of-Stack (PUSH A; PUSH B; ADD; POP X).',
        ],
        table: {
          caption: 'Evaluating X = (A + B) × (C + D) Across Instruction Formats',
          headers: ['Format', 'Architecture', 'Sample Sequence'],
          rows: [
            ['3-Address', 'Register-Register', 'ADD R1,A,B; ADD R2,C,D; MUL X,R1,R2'],
            ['2-Address', 'General Register', 'MOV R1,A; ADD R1,B; MOV R2,C; ADD R2,D; MUL R1,R2; MOV X,R1'],
            ['1-Address', 'Accumulator (AC)', 'LOAD A; ADD B; STORE T; LOAD C; ADD D; MUL T; STORE X'],
            ['0-Address', 'Stack-Based', 'PUSH A; PUSH B; ADD; PUSH C; PUSH D; ADD; MUL; POP X'],
          ],
        },
        workedExample: {
          problem: 'Evaluate X = (A + B) × C using Zero-Address (Stack) instructions.',
          solution: [
            'PUSH A  → Stack: [A]',
            'PUSH B  → Stack: [A, B]',
            'ADD     → Pop A, B; Push (A+B) → Stack: [A+B]',
            'PUSH C  → Stack: [A+B, C]',
            'MUL     → Pop C, (A+B); Push (A+B)×C',
            'POP X   → M[X] ← TOS.',
          ],
        },
        examTip:
          'Practicing the X = (A + B) × (C + D) program in all 4 formats (3-, 2-, 1-, and 0-address) is one of the highest-yield Unit IV exam questions.',
      },
      {
        id: 'u4-io-organization',
        unitId: 'unit4',
        number: '4.5',
        title: 'Input/Output Organization & Interface Block Diagram',
        summary:
          'Peripherals operate asynchronously, use different signal levels, and run orders of magnitude slower than the CPU. An I/O Interface module bridges the system bus to peripheral devices.',
        keyPoints: [
          'I/O Interface Functions: Address decoding, Data buffering (Data Register), Status/Control reporting (Status & Control Registers), Timing/synchronization, and Signal/Format conversion (serial ↔ parallel).',
          'Memory-Mapped I/O: I/O ports share the same address space as main memory; standard LOAD/STORE instructions access I/O, using part of the memory address range.',
          'Isolated (I/O-Mapped) I/O: Separate I/O address space with dedicated IN / OUT instructions and distinct IOR / IOW control lines, preserving full memory space.',
        ],
        table: {
          caption: 'Memory-Mapped I/O vs. Isolated I/O',
          headers: ['Feature', 'Memory-Mapped I/O', 'Isolated (I/O-Mapped) I/O'],
          rows: [
            ['Address space', 'Shared with main memory', 'Dedicated separate I/O space'],
            ['Instructions', 'Any memory instruction (MOV, ADD)', 'Special IN and OUT instructions'],
            ['Control lines', 'Shared MEMR / MEMW', 'Separate IOR / IOW lines'],
            ['Decoder complexity', 'Full address width decoded', 'Fewer address bits needed'],
          ],
        },
        workedExample: {
          problem: 'Why can\'t a keyboard or printer connect directly to the CPU\'s internal data bus?',
          solution: [
            'Speed mismatch: CPU operates in nanoseconds while peripherals operate in milliseconds.',
            'Signal & format mismatch: electromechanical/serial peripheral signals differ from parallel TTL/CMOS bus logic.',
            'An I/O interface buffers words, decodes device select addresses, and provides Ready/Busy status flags.',
          ],
        },
        examTip:
          'Draw the I/O Interface block with 4 clear internal elements: Address Decoder, Control & Status Registers, Data Buffer Register, and Bus/Peripheral interface lines.',
      },
      {
        id: 'u4-interrupts-dma',
        unitId: 'unit4',
        number: '4.6',
        title: 'Interrupts & Direct Memory Access (DMA)',
        summary:
          'Three I/O transfer modes trade CPU overhead against hardware complexity: Programmed I/O (polling), Interrupt-Driven I/O, and Direct Memory Access (DMA) for bulk high-speed transfers.',
        keyPoints: [
          'Programmed I/O: CPU continuously polls device status flags (wastes CPU cycles).',
          'Interrupt-Driven I/O: Device raises an INTR line when ready. CPU finishes the current instruction, saves PC & status on stack, jumps to the Interrupt Service Routine (ISR) via vector address, services device, and executes Return from Interrupt (RTI).',
          'Priority Interrupts: Daisy-chaining (hardware serial priority) or Parallel Priority Encoder + Mask Register resolve simultaneous requests.',
          'Direct Memory Access (DMA): A dedicated DMA Controller (Address Reg, Word Count Reg, Control Reg) requests bus control via BR (Bus Request); CPU grants bus via BG (Bus Grant) and tri-states its lines. DMA transfers entire blocks directly between I/O and RAM, interrupting CPU only on completion.',
          'DMA Transfer Modes: Burst Mode (transfers entire block uninterrupted) vs. Cycle Stealing (DMA steals one memory cycle at a time so CPU stays responsive).',
        ],
        table: {
          caption: 'Comparison of I/O Transfer Modes',
          headers: ['Mode', 'CPU Involvement', 'Transfer Rate', 'Best Use Case'],
          rows: [
            ['Programmed I/O', '100% (busy polling)', 'Low', 'Simple microcontrollers'],
            ['Interrupt-Driven', 'Per byte/word (ISR)', 'Medium', 'Keyboards, serial ports'],
            ['DMA', 'Setup & completion only', 'Very High', 'Disks, GPUs, Network cards'],
          ],
        },
        workedExample: {
          problem: 'Outline the 4 handoff steps during a DMA block transfer from Disk to RAM.',
          solution: [
            '1. CPU initializes DMA Controller with starting RAM address, word count, and Read/Write direction.',
            '2. Disk signals DMA Request → DMA asserts Bus Request (BR) to CPU.',
            '3. CPU completes current bus cycle, tri-states buses, and asserts Bus Grant (BG).',
            '4. DMA transfers words directly to RAM, incrementing address & decrementing count until Count = 0, then sends a completion Interrupt to CPU.',
          ],
        },
        examTip:
          'Always name the three registers inside a DMA Controller (Address Register, Word Count Register, Control Register) and the two arbitration lines (BR and BG).',
      },
      {
        id: 'u4-async-transfer',
        unitId: 'unit4',
        number: '4.7',
        title: 'Asynchronous Data Transfer: Strobe Control & Handshaking',
        summary:
          'When two independent units do not share a common clock, Asynchronous Data Transfer coordinates word exchanges using either a single Strobe pulse or a two-wire closed-loop Handshaking protocol.',
        keyPoints: [
          'Strobe Control (Single Control Line): Either Source-Initiated (Source places data on bus → activates Strobe → removes Strobe & data) or Destination-Initiated (Destination activates Strobe → Source puts data on bus → Destination latches data & drops Strobe).',
          'Limitation of Strobe: Open-loop—Source never gets confirmation that Destination actually latched the data (or vice versa).',
          'Handshaking (Two Control Lines): Closed-loop reliability using Request/Data Valid (Source → Dest) and Data Accepted / Ready for Data (Dest → Source).',
          'Source-Initiated Handshaking sequence: (1) Source puts data + asserts Data Valid → (2) Dest reads data + asserts Data Accepted → (3) Source drops Data Valid + invalidates bus → (4) Dest drops Data Accepted.',
        ],
        workedExample: {
          problem: 'Why is Handshaking preferred over Strobe Control for variable-speed peripherals?',
          solution: [
            'Strobe assumes fixed timing delays; if the receiver is momentarily slow, data is silently lost.',
            'Handshaking explicitly waits for the receiver\'s Data Accepted acknowledgment before removing data, automatically adapting to any speed difference and supporting timeout fault detection.',
          ],
        },
        examTip:
          'Sketching the 4-phase timing diagram (Data Bus, Data Valid, Data Accepted with cause-and-effect arrows between edges) makes Handshaking answers crystal clear and earns full marks.',
        relatedLab: {
          labId: 'cpu-memory',
          label: 'Step Through Strobe vs. Handshaking',
        },
      },
    ],
  },
  {
    id: 'unit5',
    roman: 'Unit V',
    shortTitle: 'The Memory System',
    title: 'Memory Hierarchy, Cache & Virtual Memory',
    courseOutcome: 'CO5: Understand the various memory types and memory management requirements.',
    syllabusExcerpt:
      'Basic concepts, Semiconductor RAM memories, Read-Only memories, Speed, Size and Cost, Primary memory, Auxiliary memory, Associative memory, Cache memories, Virtual Memories, Memory management requirements.',
    topics: [
      {
        id: 'u5-concepts-hierarchy',
        unitId: 'unit5',
        number: '5.1',
        title: 'Basic Concepts: Speed, Size, Cost & Memory Hierarchy',
        summary:
          'Ideal memory would be infinitely fast, huge, and cheap—an impossible combination in a single technology. Computer systems achieve near-ideal behavior by layering memories in a hierarchy that exploits Locality of Reference.',
        keyPoints: [
          'Key Metrics: Access Time (latency from address presentation to valid data), Memory Cycle Time (minimum time between two consecutive accesses), Transfer Rate (bits/sec), Capacity, and Cost per Bit.',
          'Hierarchy Pyramid (Top → Bottom): CPU Registers → L1/L2/L3 Cache (SRAM) → Main Memory (DRAM) → Auxiliary Storage (SSD / Magnetic Disk).',
          'Moving down the pyramid: Capacity increases, Access time slows (increases), and Cost per bit decreases.',
          'Locality of Reference: Temporal locality (recently accessed items are likely reused soon, e.g., loops) and Spatial locality (nearby addresses are likely accessed soon, e.g., arrays).',
        ],
        table: {
          caption: 'Memory Hierarchy Trade-Offs (Speed, Size & Cost)',
          headers: ['Level', 'Technology', 'Typical Size', 'Access Time', 'Cost / Bit'],
          rows: [
            ['Registers', 'Flip-Flops (CMOS)', '< 1 KB', '< 1 ns', 'Highest'],
            ['Cache (L1–L3)', 'SRAM', '32 KB – 64 MB', '1 – 15 ns', 'High'],
            ['Primary RAM', 'DRAM', '8 GB – 128 GB', '40 – 80 ns', 'Moderate'],
            ['Auxiliary', 'NVMe SSD / HDD', '512 GB – 16 TB', '50 µs – 10 ms', 'Lowest'],
          ],
        },
        workedExample: {
          problem: 'A memory chip is labeled 4K × 8. How many address lines, data lines, and total bits does it have?',
          solution: [
            'Number of words = 4K = 4 × 1024 = 4096 = 2¹² → 12 address lines.',
            'Word width = 8 bits → 8 bidirectional data lines.',
            'Total storage = 4096 × 8 = 32,768 bits (4 KB).',
          ],
        },
        examTip:
          'Always distinguish Access Time from Cycle Time: in DRAM, Cycle Time > Access Time because the sense amplifiers must precharge/restore the destructive read.',
        relatedLab: {
          labId: 'cpu-memory',
          label: 'Explore Memory Hierarchy Visualizer',
        },
      },
      {
        id: 'u5-semiconductor-ram',
        unitId: 'unit5',
        number: '5.2',
        title: 'Semiconductor RAM Memories (SRAM & DRAM)',
        summary:
          'Random Access Memory (RAM) allows reading or writing any word in constant time independent of physical location. Volatile semiconductor RAM splits into Static RAM (SRAM) and Dynamic RAM (DRAM).',
        keyPoints: [
          'Static RAM (SRAM): Stores each bit in a 6-transistor (6T) cross-coupled latch. Fast, requires no refresh, lower density, higher cost/power → used for CPU Cache.',
          'Dynamic RAM (DRAM): Stores each bit as electric charge on a tiny 1-transistor + 1-capacitor (1T1C) cell. Very high density and low cost/bit, but charge leaks → requires periodic refreshing (every few ms) and destructive-read restoration → used for Main Memory.',
          'Internal Organization: Cells arranged in a 2D row × column matrix with Row Decoder, Sense/Write Circuits, and Column Mux (DRAM multiplexes Row and Column addresses via RAS/CAS pins to cut pin count).',
          'SDRAM & DDR SDRAM synchronize transfers to the system bus clock (DDR transfers on both rising and falling clock edges).',
        ],
        table: {
          caption: 'SRAM vs. DRAM Comparison',
          headers: ['Parameter', 'SRAM', 'DRAM'],
          rows: [
            ['Storage cell', '6-transistor flip-flop latch', '1 transistor + 1 capacitor'],
            ['Refresh needed?', 'No (holds while powered)', 'Yes (periodic refresh cycles)'],
            ['Speed', 'Very fast (1–10 ns)', 'Slower (40–80 ns)'],
            ['Density & Cost', 'Lower density, expensive', 'High density, economical'],
            ['Primary role', 'CPU L1/L2/L3 Cache', 'Main Primary Memory'],
          ],
        },
        workedExample: {
          problem: 'How many 1K × 4 RAM chips are required to build a 4K × 8 memory system?',
          solution: [
            'Row expansion (word depth): 4K / 1K = 4 rows (selected by a 2-to-4 decoder on top 2 address lines).',
            'Column expansion (word width): 8 bits / 4 bits = 2 chips per row.',
            'Total chips required = 4 × 2 = 8 chips.',
          ],
        },
        examTip:
          'Remember the memory expansion formula: Chips Needed = (Target Words / Chip Words) × (Target Width / Chip Width).',
      },
      {
        id: 'u5-rom',
        unitId: 'unit5',
        number: '5.3',
        title: 'Read-Only Memories (ROM, PROM, EPROM, EEPROM, Flash)',
        summary:
          'Read-Only Memories are non-volatile semiconductor memories that retain firmware, bootloaders (BIOS/UEFI), and lookup tables permanently without power.',
        keyPoints: [
          'Mask ROM: Bit pattern permanently fixed during IC fabrication; economical only in huge production runs.',
          'PROM (Programmable ROM): User programs once by blowing microscopic fuses/antifuses (OTP — One-Time Programmable).',
          'EPROM (Erasable PROM): Floating-gate MOS cells erased globally by exposing a quartz window to ultraviolet (UV) light for ~20 minutes, then reprogrammed.',
          'EEPROM (Electrically Erasable PROM): Erased and reprogrammed electrically at the byte level in-circuit without removing the chip.',
          'Flash Memory: High-density derivative of EEPROM erased in entire blocks/sectors rather than single bytes—fast, compact, used in BIOS chips, USB drives, and SSDs.',
        ],
        table: {
          caption: 'Evolution of Non-Volatile Read-Only Memories',
          headers: ['Type', 'Programmability', 'Erase Method', 'Granularity'],
          rows: [
            ['Mask ROM', 'Factory only', 'Not erasable', 'N/A'],
            ['PROM', 'Field-programmable once', 'Not erasable', 'N/A'],
            ['EPROM', 'Reprogrammable', 'UV light (quartz window)', 'Entire chip'],
            ['EEPROM', 'In-circuit electrical', 'Electrical pulse', 'Byte-level'],
            ['Flash', 'In-circuit electrical', 'Electrical pulse', 'Block / Sector'],
          ],
        },
        workedExample: {
          problem: 'Choose the best ROM technology for: (a) storing motherboard firmware that receives occasional updates, (b) high-volume fixed toy controller.',
          solution: [
            '(a) Flash Memory (fast in-circuit block updates, non-volatile, low cost).',
            '(b) Mask ROM (lowest per-unit manufacturing cost at massive volume when code never changes).',
          ],
        },
        examTip:
          'Distinguish EEPROM vs. Flash cleanly in one sentence: EEPROM erases byte-by-byte, whereas Flash erases block-by-block for much higher density and lower cost.',
      },
      {
        id: 'u5-primary-auxiliary',
        unitId: 'unit5',
        number: '5.4',
        title: 'Primary Memory & Auxiliary Memory',
        summary:
          'Primary memory directly communicates with the CPU over the memory bus for active execution, while Auxiliary (Secondary) memory provides massive, low-cost, non-volatile long-term storage.',
        keyPoints: [
          'Primary Memory: Semiconductor RAM + Boot ROM. Directly byte/word addressable by CPU, fast (nanoseconds), volatile (RAM), relatively limited capacity.',
          'Auxiliary Memory: Magnetic Hard Disk Drives (platters, tracks, sectors, seek time + rotational latency + transfer time), Solid-State Drives (NAND Flash, no moving parts), Optical Discs (CD/DVD/Blu-ray), and Magnetic Tapes (sequential archival).',
          'Disk Access Time = Seek Time (arm moves to track) + Rotational Delay (sector spins under head, avg ½ rotation) + Data Transfer Time.',
        ],
        formulas: [
          'Disk Access Time = Seek Time + Avg Rotational Latency + Transfer Time',
          'Avg Rotational Latency = 0.5 × (60 / RPM) seconds',
        ],
        workedExample: {
          problem: 'Calculate the average rotational latency of a 7200 RPM magnetic hard disk.',
          solution: [
            'Time for 1 full revolution = 60 s / 7200 = 8.33 ms.',
            'Average rotational latency = ½ revolution = 8.33 / 2 ≈ 4.17 ms.',
          ],
        },
        examTip:
          'Note that programs stored in Auxiliary Memory cannot be executed directly by the CPU—the OS must first load pages into Primary Memory (RAM).',
      },
      {
        id: 'u5-associative-memory',
        unitId: 'unit5',
        number: '5.5',
        title: 'Associative Memory (Content-Addressable Memory — CAM)',
        summary:
          'Associative Memory is accessed simultaneously by data content rather than by numeric address, returning all matching words in a single clock cycle—making it vital for Cache tag directories and TLBs.',
        keyPoints: [
          'Hardware Organization: An m-word × n-bit cell array paired with an Argument Register (A, holds search pattern), Key Register (K, mask bits where K_j = 1 enables comparison on bit j and K_j = 0 ignores bit j), and a Match Register (M, 1 bit per word).',
          'Match Logic: Bit cell C_ij matches A_j when x_ij = A_j·C_ij + A_j\'·C_ij\' (XNOR). Word i sets Match bit M_i = 1 iff every unmasked bit matches: M_i = Π (x_ij + K_j\').',
          'Trade-Off: Extremely fast parallel O(1) search, but expensive and power-hungry because every single memory cell requires built-in comparison transistors.',
        ],
        formulas: [
          'Bit match: x_ij = A_j ⊙ C_ij = A_j·C_ij + A_j\'·C_ij\'',
          'Word match (with Key mask K): M_i = Π_(j=1..n) (x_ij + K_j\')',
        ],
        workedExample: {
          problem: 'Given Argument A = 101 111100 and Key K = 111 000000, which words match: W1 = 100 111100, W2 = 101 000001?',
          solution: [
            'Key K = 111 000000 masks out the last 6 bits; only the leftmost 3 bits are compared against 101.',
            'W1 starts with 100 ≠ 101 → No Match (M1 = 0).',
            'W2 starts with 101 = 101 → Match! (M2 = 1, even though the last 6 masked bits differ).',
          ],
        },
        examTip:
          'Remember how the Key Register works: K_j = 1 means "must compare this bit"; K_j = 0 means "don\'t care / ignore this bit" (achieved by ORing K_j\' = 1 into the match term).',
      },
      {
        id: 'u5-cache-memory',
        unitId: 'unit5',
        number: '5.6',
        title: 'Cache Memories: Mapping, Replacement & Write Policies',
        summary:
          'Cache is a small, ultra-fast SRAM buffer situated between CPU and Main Memory that holds active blocks of instructions/data to hide DRAM latency.',
        keyPoints: [
          'Hit Ratio (h) = Hits / (Hits + Misses). Effective Access Time (EAT) = h·T_cache + (1 - h)·(T_cache + T_main) (or simultaneous: h·T_c + (1 - h)·T_m).',
          'Direct Mapping: Block j maps rigidly to line (j mod C). Address splits into [Tag | Line Index | Word Offset]. Simple & cheap, but suffers conflict misses.',
          'Fully Associative Mapping: Any memory block can reside in any cache line. Address splits into [Tag | Word Offset]. Zero conflict misses, but requires expensive parallel tag comparators.',
          'k-Way Set-Associative Mapping: Divides cache into sets of k lines; block j maps to set (j mod S) and can occupy any of the k ways inside that set. Best balance of hit rate and hardware cost.',
          'Replacement Policies: LRU (Least Recently Used), FIFO, Random. Write Policies: Write-Through (updates cache + RAM immediately) vs. Write-Back (updates RAM only when a dirty line is evicted).',
        ],
        formulas: [
          'Hit Ratio: h = Hits / Total Accesses',
          'EAT (hierarchical): T_avg = h · T_cache + (1 - h) · (T_cache + T_mem)',
          'Direct Mapping Line = (Main Memory Block #) mod (Number of Cache Lines)',
          'Set-Associative Set = (Main Memory Block #) mod (Number of Sets)',
        ],
        workedExample: {
          problem: 'A cache has T_cache = 10 ns, main memory T_mem = 100 ns, and hit ratio h = 0.90. Compute Effective Access Time (hierarchical lookup).',
          solution: [
            'On a hit (90%): access takes 10 ns.',
            'On a miss (10%): cache check + RAM fetch takes 10 + 100 = 110 ns.',
            'EAT = 0.90(10) + 0.10(110) = 9 + 11 = 20 ns (a 5× speedup over 100 ns RAM!).',
          ],
        },
        examTip:
          'When splitting a memory address for Direct Mapping: Offset bits = log2(Block Size), Line Index bits = log2(Number of Cache Lines), and Tag bits = Total Address Bits − Index − Offset.',
        relatedLab: {
          labId: 'cpu-memory',
          label: 'Calculate Cache EAT in Memory Lab',
        },
      },
      {
        id: 'u5-virtual-memory',
        unitId: 'unit5',
        number: '5.7',
        title: 'Virtual Memories & Memory Management Requirements',
        summary:
          'Virtual Memory decouples a program\'s logical (virtual) address space from physical RAM size, letting large programs run safely in limited physical memory by paging blocks on demand between disk and RAM.',
        keyPoints: [
          'Paging: Divides Virtual Address Space into fixed-size Pages and Physical RAM into equal-sized Page Frames. Virtual Address = [Virtual Page Number (VPN) | Page Offset].',
          'Address Translation (MMU): The Memory Management Unit translates VPN → Physical Frame Number (PFN) using a Page Table in RAM; Page Offset remains unchanged.',
          'TLB (Translation Lookaside Buffer): A small associative hardware cache storing recent VPN → PFN translations so address translation avoids an extra RAM lookup on every memory reference.',
          'Page Fault: Occurs when a requested page\'s Valid/Present bit is 0. The OS traps, loads the page from disk into a free frame (evicting a victim page if RAM is full), updates the Page Table, and restarts the instruction.',
          'Memory Management Requirements: Relocation (moving programs dynamically), Protection (isolating processes & kernel), Sharing (common libraries), Logical Organization (segments/modules), and Physical Organization (managing RAM/disk transfers while preventing Thrashing).',
        ],
        formulas: [
          'Number of Virtual Pages = Virtual Address Space / Page Size',
          'Page Offset Bits = log2(Page Size in bytes)',
          'Virtual Address = [VPN | Offset]  →  Physical Address = [PFN | Offset]',
        ],
        workedExample: {
          problem: 'A system has 32-bit virtual addresses, 4 KB page size, and 1 GB physical RAM. Find VPN bits, Offset bits, and PFN bits.',
          solution: [
            'Page Size = 4 KB = 2¹² bytes → Page Offset = 12 bits.',
            'Virtual Page Number (VPN) = 32 − 12 = 20 bits (2²⁰ virtual pages).',
            'Physical RAM = 1 GB = 2³⁰ bytes → Physical Address = 30 bits → PFN = 30 − 12 = 18 bits.',
          ],
        },
        examTip:
          'Never forget the 5 classic Memory Management Requirements (Stallings/Hamacher): Relocation, Protection, Sharing, Logical Organization, and Physical Organization—a favorite 5-mark exam question!',
      },
    ],
  },
];

export const ALL_TOPICS = SYLLABUS_UNITS.flatMap((unit) => unit.topics);
