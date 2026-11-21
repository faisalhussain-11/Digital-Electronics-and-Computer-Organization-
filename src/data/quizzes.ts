import { QuizQuestion } from '../types/deco';

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  // ================= UNIT I: NUMBER SYSTEMS & BOOLEAN ALGEBRA (9 Qs) =================
  {
    id: 'q-u1-1',
    unitId: 'unit1',
    topicRef: '1.1 Number Systems',
    difficulty: 'Foundational',
    question: 'What is the hexadecimal equivalent of the binary number (11010110.101)₂?',
    options: ['D6.5', 'D6.A', 'B6.A', 'D6.8'],
    correctIndex: 1,
    explanation:
      'Group integer bits in 4s from right to left: 1101 = D, 0110 = 6. For the fractional part, group left to right and pad trailing zero: .1010 = .A. Hence (D6.A)₁₆.',
  },
  {
    id: 'q-u1-2',
    unitId: 'unit1',
    topicRef: '1.2 Complements',
    difficulty: 'Applied',
    question: 'What is the 2\'s complement representation of the 8-bit binary number 01011000?',
    options: ['10100111', '10101000', '10101001', '01011001'],
    correctIndex: 1,
    explanation:
      'Shortcut: copy from the right up to and including the first 1 (1000), then invert all bits to the left (0101 → 1010). Result: 10101000.',
  },
  {
    id: 'q-u1-3',
    unitId: 'unit1',
    topicRef: '1.2 Complements',
    difficulty: 'Exam Level',
    question: 'When subtracting M − N using 2\'s complement addition (M + 2\'s comp of N), what does an end carry of 1 signify?',
    options: [
      'The result is negative and must be complemented',
      'Overflow has occurred and the answer is invalid',
      'The result is positive and the end carry is discarded',
      'The end carry must be added back to the LSB',
    ],
    correctIndex: 2,
    explanation:
      'In r\'s (2\'s) complement subtraction, an end carry of 1 indicates a positive result and is discarded. (Adding it back to the LSB is for 1\'s complement subtraction.)',
  },
  {
    id: 'q-u1-4',
    unitId: 'unit1',
    topicRef: '1.3 Binary Codes',
    difficulty: 'Foundational',
    question: 'Which pair of 4-bit binary codes are BOTH self-complementing codes?',
    options: ['8421 BCD and Gray Code', '2421 and Excess-3', '8421 BCD and Excess-3', 'Gray Code and 5211'],
    correctIndex: 1,
    explanation:
      'In both 2421 and Excess-3 codes, inverting every bit (1\'s complement) produces the valid code for the 9\'s complement of that decimal digit.',
  },
  {
    id: 'q-u1-5',
    unitId: 'unit1',
    topicRef: '1.3 Binary Codes',
    difficulty: 'Applied',
    question: 'Convert the binary number (1101)₂ to its Gray code equivalent.',
    options: ['1011', '1010', '1110', '1001'],
    correctIndex: 0,
    explanation:
      'G3 = B3 = 1; G2 = B3 ⊕ B2 = 1 ⊕ 1 = 0; G1 = B2 ⊕ B1 = 1 ⊕ 0 = 1; G0 = B1 ⊕ B0 = 0 ⊕ 1 = 1. Result: 1011.',
  },
  {
    id: 'q-u1-6',
    unitId: 'unit1',
    topicRef: '1.4 Hamming Code',
    difficulty: 'Exam Level',
    question: 'To transmit 8 data bits using a single-error-correcting Hamming code, what is the minimum number of parity bits k required?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    explanation:
      'Apply 2^k >= m + k + 1 with m = 8. For k = 3: 8 >= 12 (False). For k = 4: 16 >= 8 + 4 + 1 = 13 (True). Minimum k = 4.',
  },
  {
    id: 'q-u1-7',
    unitId: 'unit1',
    topicRef: '1.5 Boolean Algebra',
    difficulty: 'Applied',
    question: 'Using Boolean algebra theorems, what does the expression A + A\'B + AB\' simplify to?',
    options: ['A + B', 'A ⊕ B', 'A · B', '1'],
    correctIndex: 0,
    explanation:
      'By absorption, A + A\'B = A + B and A + AB\' = A. Combining both gives (A + B) + A = A + B.',
  },
  {
    id: 'q-u1-8',
    unitId: 'unit1',
    topicRef: '1.6 Switching Functions',
    difficulty: 'Foundational',
    question: 'If a 3-variable function is F(A, B, C) = Σm(0, 2, 5, 7), what is its Canonical POS form?',
    options: ['ΠM(0, 2, 5, 7)', 'ΠM(1, 3, 4, 6)', 'Σm(1, 3, 4, 6)', 'ΠM(1, 2, 4, 6)'],
    correctIndex: 1,
    explanation:
      'The Canonical POS lists all maxterm indices where F = 0—the exact complement of the minterm index set {0..7} \\ {0, 2, 5, 7} = {1, 3, 4, 6}.',
  },
  {
    id: 'q-u1-9',
    unitId: 'unit1',
    topicRef: '1.7 Logic Gates',
    difficulty: 'Exam Level',
    question: 'What is the minimum number of 2-input NAND gates required to implement an XOR gate (A ⊕ B)?',
    options: ['3', '4', '5', '6'],
    correctIndex: 1,
    explanation:
      'Using G1 = (AB)\', G2 = (A·G1)\', G3 = (B·G1)\', and Y = (G2·G3)\', an XOR gate requires exactly 4 two-input NAND gates.',
  },

  // ================= UNIT II: COMBINATIONAL CIRCUITS (9 Qs) =================
  {
    id: 'q-u2-1',
    unitId: 'unit2',
    topicRef: '2.1 K-Map',
    difficulty: 'Foundational',
    question: 'In a 4-variable Karnaugh Map, a valid group of 8 adjacent 1s (an octet) simplifies to a product term with how many literals?',
    options: ['1 literal', '2 literals', '3 literals', '4 literals'],
    correctIndex: 0,
    explanation:
      'A group of 2^k cells in an n-variable K-Map eliminates k variables, leaving n − k literals. For n = 4 and 8 = 2³, 4 − 3 = 1 literal.',
  },
  {
    id: 'q-u2-2',
    unitId: 'unit2',
    topicRef: '2.1 K-Map',
    difficulty: 'Exam Level',
    question: 'In a 4-variable K-Map F(A, B, C, D), grouping the four corner minterms m0, m2, m8, and m10 produces which simplified term?',
    options: ['A\'C\'', 'B\'D\'', 'B\'C\'', 'A\'D\''],
    correctIndex: 1,
    explanation:
      'm0(0000), m2(0010), m8(1000), m10(1010): A varies (0/1), C varies (0/1), while B = 0 and D = 0 across all four cells → B\'D\'.',
  },
  {
    id: 'q-u2-3',
    unitId: 'unit2',
    topicRef: '2.2 Quine-McCluskey',
    difficulty: 'Applied',
    question: 'In the Quine-McCluskey tabular method, how are Don\'t Care (X) minterms handled during the Prime Implicant Chart stage?',
    options: [
      'They must be covered by at least one Essential Prime Implicant',
      'They are excluded from the column headers of the PI chart',
      'They are never included in the initial grouping stage',
      'They are treated as mandatory 0s throughout the entire method',
    ],
    correctIndex: 1,
    explanation:
      'Don\'t cares ARE used during iterative pairing to form larger prime implicants, but they are omitted as columns in the PI chart because they do not need to be covered.',
  },
  {
    id: 'q-u2-4',
    unitId: 'unit2',
    topicRef: '2.3 Adders & Subtractors',
    difficulty: 'Foundational',
    question: 'A Full Adder can be constructed using:',
    options: [
      'Two Half Adders and one AND gate',
      'Two Half Adders and one OR gate',
      'Two Half Adders and one XOR gate',
      'One Half Adder and two OR gates',
    ],
    correctIndex: 1,
    explanation:
      'HA1 computes A ⊕ B and AB; HA2 adds Cin producing S = A ⊕ B ⊕ Cin and Cin(A ⊕ B). One OR gate combines the two carries into Cout.',
  },
  {
    id: 'q-u2-5',
    unitId: 'unit2',
    topicRef: '2.3 Adders & Subtractors',
    difficulty: 'Applied',
    question: 'Which Boolean expression gives the Borrow-Out (Bout) of a Half Subtractor computing A − B?',
    options: ['A · B', 'A\' · B', 'A · B\'', 'A ⊕ B'],
    correctIndex: 1,
    explanation:
      'A borrow is needed only when subtracting 1 from 0 (A = 0, B = 1), which corresponds to Bout = A\' · B.',
  },
  {
    id: 'q-u2-6',
    unitId: 'unit2',
    topicRef: '2.4 Comparators',
    difficulty: 'Applied',
    question: 'For a 1-bit magnitude comparator comparing A and B, which logic gate generates the equality output (A = B)?',
    options: ['XOR gate', 'XNOR gate', 'NAND gate', 'NOR gate'],
    correctIndex: 1,
    explanation:
      'A = B is true when (A=0, B=0) or (A=1, B=1), which is AB + A\'B\' = A ⊙ B (an XNOR gate).',
  },
  {
    id: 'q-u2-7',
    unitId: 'unit2',
    topicRef: '2.5 Multiplexers',
    difficulty: 'Exam Level',
    question: 'What is the smallest standard Multiplexer required to implement ANY 4-variable Boolean function (with one external NOT gate allowed)?',
    options: ['2:1 MUX', '4:1 MUX', '8:1 MUX', '16:1 MUX'],
    correctIndex: 2,
    explanation:
      'An n-variable function needs at most a 2^(n-1) : 1 MUX by feeding (n − 1) variables to select lines and 0, 1, D, or D\' to the data pins. For n = 4, 2³ = 8:1 MUX.',
  },
  {
    id: 'q-u2-8',
    unitId: 'unit2',
    topicRef: '2.5 DEMUX & Decoders',
    difficulty: 'Foundational',
    question: 'How many 2-to-4 Decoders (with Enable inputs) are needed to construct a 4-to-16 Decoder without extra logic gates?',
    options: ['4', '5', '6', '8'],
    correctIndex: 1,
    explanation:
      'Four 2-to-4 decoders generate the 16 outputs, while a 5th 2-to-4 decoder decodes the two MSBs to drive their Enable pins (total = 5).',
  },
  {
    id: 'q-u2-9',
    unitId: 'unit2',
    topicRef: '2.6 Priority Encoders',
    difficulty: 'Applied',
    question: 'In a 4-to-2 Priority Encoder (D3 highest priority, D0 lowest), if inputs D3 D2 D1 D0 = 0111, what is the binary output Y1 Y0?',
    options: ['00', '01', '10', '11'],
    correctIndex: 2,
    explanation:
      'Because D2 is the highest active input (D3 = 0, D2 = 1), lower-priority inputs D1 and D0 are ignored and the encoder outputs the index of D2: 10₂.',
  },

  // ================= UNIT III: SEQUENTIAL CIRCUITS (9 Qs) =================
  {
    id: 'q-u3-1',
    unitId: 'unit3',
    topicRef: '3.1 Comb vs Sequential',
    difficulty: 'Foundational',
    question: 'What fundamentally distinguishes a sequential circuit from a combinational circuit?',
    options: [
      'Sequential circuits use only universal NAND gates',
      'Sequential circuits contain memory elements and state feedback paths',
      'Sequential circuits never require combinational logic gates',
      'Combinational circuits require a master clock signal',
    ],
    correctIndex: 1,
    explanation:
      'Sequential circuits combine combinational logic with storage elements (latches/flip-flops) and feedback so outputs depend on both present inputs and prior state.',
  },
  {
    id: 'q-u3-2',
    unitId: 'unit3',
    topicRef: '3.2 SR Latch',
    difficulty: 'Foundational',
    question: 'In an active-HIGH NOR-based SR latch, what happens when S = 1 and R = 1 simultaneously?',
    options: [
      'The latch holds its previous value',
      'The output Q toggles continuously',
      'Both Q and Q\' are forced to 0 (invalid / forbidden state)',
      'Q becomes 1 and Q\' becomes 0',
    ],
    correctIndex: 2,
    explanation:
      'With NOR gates, any input of 1 forces output 0, making Q = Q\' = 0—violating complementarity and causing an indeterminate race if both drop to 0 together.',
  },
  {
    id: 'q-u3-3',
    unitId: 'unit3',
    topicRef: '3.3 JK Flip-Flop',
    difficulty: 'Applied',
    question: 'What is the characteristic equation Q(t+1) of a JK Flip-Flop?',
    options: ['J·Q + K\'·Q\'', 'J·Q\' + K\'·Q', 'J\'·Q + K·Q\'', 'J + K\'·Q'],
    correctIndex: 1,
    explanation:
      'When Q = 0, Q(t+1) = J; when Q = 1, Q(t+1) = K\'. Combining gives Q(t+1) = J·Q\' + K\'·Q.',
  },
  {
    id: 'q-u3-4',
    unitId: 'unit3',
    topicRef: '3.3 Race-Around & Master-Slave',
    difficulty: 'Exam Level',
    question: 'When does the Race-Around Condition occur in a level-triggered JK Flip-Flop?',
    options: [
      'When J = 0, K = 0 and clock frequency is very low',
      'When J = 1, K = 1 and clock pulse width exceeds propagation delay (t_p > t_pd)',
      'When J = 1, K = 0 and Q is already 1',
      'Only in negative edge-triggered D flip-flops',
    ],
    correctIndex: 1,
    explanation:
      'When J = K = 1 and CLK remains HIGH longer than the gate propagation delay t_pd, the toggled output feeds back and toggles the flip-flop repeatedly during one pulse.',
  },
  {
    id: 'q-u3-5',
    unitId: 'unit3',
    topicRef: '3.3 JK Master-Slave',
    difficulty: 'Applied',
    question: 'In a JK Master-Slave Flip-Flop driven by clock CLK, when does the Slave stage update the final external output Q?',
    options: [
      'While CLK is HIGH (1)',
      'When CLK transitions from HIGH to LOW (Slave receives inverted clock)',
      'Whenever J or K changes, regardless of CLK',
      'Simultaneously with the Master stage on the rising edge',
    ],
    correctIndex: 1,
    explanation:
      'Master is enabled when CLK = 1 while Slave is isolated (CLK\' = 0). When CLK drops to 0, Master latches and Slave enables (CLK\' = 1), transferring the state cleanly to Q.',
  },
  {
    id: 'q-u3-6',
    unitId: 'unit3',
    topicRef: '3.4 D & T Flip-Flops',
    difficulty: 'Applied',
    question: 'A 40 MHz clock drives a chain of 4 cascaded T Flip-Flops with all T inputs tied to logic 1. What is the frequency at the final output?',
    options: ['10 MHz', '5 MHz', '2.5 MHz', '1.25 MHz'],
    correctIndex: 2,
    explanation:
      'Each T flip-flop with T = 1 divides frequency by 2. Four stages divide by 2⁴ = 16, so 40 MHz / 16 = 2.5 MHz.',
  },
  {
    id: 'q-u3-7',
    unitId: 'unit3',
    topicRef: '3.5 Excitation Tables',
    difficulty: 'Exam Level',
    question: 'According to the JK Flip-Flop excitation table, what (J, K) inputs are required for the transition Q(t) = 1 → Q(t+1) = 1?',
    options: ['J = 0, K = X', 'J = 1, K = X', 'J = X, K = 0', 'J = X, K = 1'],
    correctIndex: 2,
    explanation:
      'To stay at Q = 1, either Hold (J=0, K=0) or Set (J=1, K=0) works—so J = X (Don\'t Care) and K = 0.',
  },
  {
    id: 'q-u3-8',
    unitId: 'unit3',
    topicRef: '3.5 Excitation Tables',
    difficulty: 'Foundational',
    question: 'For a T Flip-Flop, what input T produces the transition Q(t) = 1 → Q(t+1) = 0?',
    options: ['T = 0', 'T = 1', 'T = X', 'Not possible'],
    correctIndex: 1,
    explanation:
      'Since the state changes from 1 to 0, a toggle is required: T = Q(t) ⊕ Q(t+1) = 1 ⊕ 0 = 1.',
  },
  {
    id: 'q-u3-9',
    unitId: 'unit3',
    topicRef: '3.6 Flip-Flop Conversions',
    difficulty: 'Exam Level',
    question: 'To convert an available D Flip-Flop into a T Flip-Flop, what combinational expression must drive the D input?',
    options: ['D = T · Q', 'D = T + Q', 'D = T ⊕ Q', 'D = T\' · Q'],
    correctIndex: 2,
    explanation:
      'Since D = Q(t+1) and a T flip-flop has Q(t+1) = T ⊕ Q, connecting an XOR gate with inputs T and Q to pin D converts a D-FF into a T-FF.',
  },

  // ================= UNIT IV: BASIC STRUCTURE OF COMPUTERS (9 Qs) =================
  {
    id: 'q-u4-1',
    unitId: 'unit4',
    topicRef: '4.2 Bus Structures',
    difficulty: 'Foundational',
    question: 'Which system bus is strictly unidirectional from the active bus master (CPU/DMA) to memory and I/O modules?',
    options: ['Data Bus', 'Address Bus', 'Control Bus', 'External Peripheral Bus'],
    correctIndex: 1,
    explanation:
      'The Address Bus carries target memory or I/O port addresses unidirectionally from the bus master to slave modules.',
  },
  {
    id: 'q-u4-2',
    unitId: 'unit4',
    topicRef: '4.2 Bus Structures',
    difficulty: 'Applied',
    question: 'A byte-addressable computer has a 20-bit address bus. What is its maximum directly addressable memory capacity?',
    options: ['64 KB', '512 KB', '1 MB', '16 MB'],
    correctIndex: 2,
    explanation:
      'Maximum addressable locations = 2²⁰ bytes = 1,048,576 bytes = 1 MB.',
  },
  {
    id: 'q-u4-3',
    unitId: 'unit4',
    topicRef: '4.3 Computer Registers',
    difficulty: 'Foundational',
    question: 'Which CPU register holds the memory address of the NEXT instruction to be fetched?',
    options: ['Instruction Register (IR)', 'Memory Data Register (MDR)', 'Program Counter (PC)', 'Accumulator (AC)'],
    correctIndex: 2,
    explanation:
      'The Program Counter (PC) always tracks the address of the next instruction in sequence (while IR holds the instruction currently being decoded/executed).',
  },
  {
    id: 'q-u4-4',
    unitId: 'unit4',
    topicRef: '4.3 Stored Program Org.',
    difficulty: 'Applied',
    question: 'Which RTL transfer accurately represents loading an instruction word from main memory during the Fetch cycle?',
    options: ['PC ← IR', 'MAR ← MDR', 'MDR ← M[MAR], then IR ← MDR', 'AC ← M[PC]'],
    correctIndex: 2,
    explanation:
      'First MAR ← PC places the address on the bus; then MDR ← M[MAR] reads the instruction word from memory, and IR ← MDR loads it into the Instruction Register.',
  },
  {
    id: 'q-u4-5',
    unitId: 'unit4',
    topicRef: '4.4 Instruction Formats',
    difficulty: 'Foundational',
    question: 'Zero-address instructions (such as ADD, MUL without operand fields) are characteristic of which CPU organization?',
    options: ['Single-Accumulator organization', 'General Register organization', 'Stack-organized CPU', 'RISC Load-Store organization'],
    correctIndex: 2,
    explanation:
      'Stack-organized CPUs implicitly pop operands from the top of stack and push results back, requiring explicit addresses only on PUSH and POP instructions.',
  },
  {
    id: 'q-u4-6',
    unitId: 'unit4',
    topicRef: '4.5 I/O Organization',
    difficulty: 'Applied',
    question: 'What is a primary advantage of Memory-Mapped I/O over Isolated (I/O-Mapped) I/O?',
    options: [
      'It requires dedicated IN and OUT machine instructions',
      'All standard memory-reference instructions can directly manipulate I/O registers',
      'It leaves 100% of the memory address space available for RAM',
      'It eliminates the need for address decoding hardware',
    ],
    correctIndex: 1,
    explanation:
      'Because I/O ports occupy addresses within the main memory map, every memory-reference instruction (LOAD, STORE, ADD, bit tests) works directly on I/O registers.',
  },
  {
    id: 'q-u4-7',
    unitId: 'unit4',
    topicRef: '4.6 Interrupts',
    difficulty: 'Exam Level',
    question: 'Before jumping to an Interrupt Service Routine (ISR), what must the processor save so the interrupted program can resume cleanly?',
    options: [
      'Only the Instruction Register (IR)',
      'The Program Counter (PC) and processor status/flags (typically onto the stack)',
      'The entire contents of Main Memory',
      'Only the DMA Word Count Register',
    ],
    correctIndex: 1,
    explanation:
      'Saving the return address (PC) and Status Register (plus any clobbered registers) onto the stack ensures Return-from-Interrupt restores exact execution context.',
  },
  {
    id: 'q-u4-8',
    unitId: 'unit4',
    topicRef: '4.6 DMA',
    difficulty: 'Exam Level',
    question: 'In Direct Memory Access (DMA), what is "Cycle Stealing"?',
    options: [
      'CPU stealing instructions from another process',
      'DMA taking control of the system bus for one memory cycle at a time to transfer a word while CPU pauses briefly',
      'DMA locking the bus continuously until an entire 1 MB block finishes',
      'Overclocking the memory controller during I/O bursts',
    ],
    correctIndex: 1,
    explanation:
      'In Cycle Stealing mode, the DMA controller transfers one word per granted memory cycle and immediately returns bus control to the CPU, balancing I/O throughput with CPU responsiveness.',
  },
  {
    id: 'q-u4-9',
    unitId: 'unit4',
    topicRef: '4.7 Async Transfer',
    difficulty: 'Applied',
    question: 'How does Handshaking improve upon Strobe Control in asynchronous data transfer?',
    options: [
      'It adds a high-frequency shared system clock wire',
      'It uses a second return control signal (acknowledgment) so sender and receiver confirm each step',
      'It eliminates the Data Bus completely',
      'It transmits two data words simultaneously in one cycle',
    ],
    correctIndex: 1,
    explanation:
      'Strobe is open-loop (one control line). Handshaking adds a reply wire (e.g., Data Accepted / Ready for Data), providing closed-loop synchronization regardless of speed mismatch.',
  },

  // ================= UNIT V: THE MEMORY SYSTEM (9 Qs) =================
  {
    id: 'q-u5-1',
    unitId: 'unit5',
    topicRef: '5.1 Memory Hierarchy',
    difficulty: 'Foundational',
    question: 'As you move DOWN the memory hierarchy from CPU Registers toward Auxiliary Storage (SSD/HDD):',
    options: [
      'Speed increases, capacity decreases, cost per bit increases',
      'Access time increases (slower), capacity increases, cost per bit decreases',
      'Access time decreases (faster), capacity increases, cost per bit decreases',
      'Speed, capacity, and cost all decrease together',
    ],
    correctIndex: 1,
    explanation:
      'Lower hierarchy tiers hold vastly more data at much lower cost per bit, at the expense of longer access latency.',
  },
  {
    id: 'q-u5-2',
    unitId: 'unit5',
    topicRef: '5.2 Semiconductor RAM',
    difficulty: 'Foundational',
    question: 'Why does DRAM require periodic refreshing whereas SRAM does not?',
    options: [
      'DRAM stores bits as charge on tiny capacitors that gradually leak away',
      'DRAM uses magnetic platters that demagnetize over time',
      'SRAM is non-volatile and keeps data without power',
      'DRAM has 6 transistors per bit that overheat',
    ],
    correctIndex: 0,
    explanation:
      'Each 1T1C DRAM cell stores logic 1/0 as charge on a microscopic capacitor; leakage requires reading and rewriting rows every few milliseconds.',
  },
  {
    id: 'q-u5-3',
    unitId: 'unit5',
    topicRef: '5.2 RAM Expansion',
    difficulty: 'Applied',
    question: 'How many 2K × 8 RAM chips are required to build an 8K × 16 memory module?',
    options: ['4', '6', '8', '16'],
    correctIndex: 2,
    explanation:
      'Depth factor = 8K / 2K = 4 rows; width factor = 16 / 8 = 2 chips per row. Total = 4 × 2 = 8 chips.',
  },
  {
    id: 'q-u5-4',
    unitId: 'unit5',
    topicRef: '5.3 Read-Only Memories',
    difficulty: 'Foundational',
    question: 'Which non-volatile memory type is erased using ultraviolet (UV) light through a quartz window on the IC package?',
    options: ['PROM', 'EPROM', 'EEPROM', 'Mask ROM'],
    correctIndex: 1,
    explanation:
      'EPROM (Erasable Programmable ROM) uses UV exposure through a transparent quartz lid to discharge all floating-gate cells simultaneously.',
  },
  {
    id: 'q-u5-5',
    unitId: 'unit5',
    topicRef: '5.5 Associative Memory',
    difficulty: 'Exam Level',
    question: 'In an Associative Memory (CAM), what is the purpose of the Key Register (K)?',
    options: [
      'It stores the physical memory address of the matching word',
      'It masks which bit positions of the Argument Register participate in the parallel comparison',
      'It encrypts data before storing it into RAM',
      'It counts the total number of cache misses',
    ],
    correctIndex: 1,
    explanation:
      'Bits with K_j = 1 enable comparison against the Argument Register A_j; bits with K_j = 0 are masked (ignored), allowing partial-field content searches.',
  },
  {
    id: 'q-u5-6',
    unitId: 'unit5',
    topicRef: '5.6 Cache Mapping',
    difficulty: 'Exam Level',
    question: 'A 64 KB byte-addressable main memory (16-bit address) connects to a Direct-Mapped cache with 128 lines and a block size of 16 bytes. How many bits are in the Tag field?',
    options: ['5 bits', '6 bits', '7 bits', '9 bits'],
    correctIndex: 0,
    explanation:
      'Block Offset = log2(16) = 4 bits; Line Index = log2(128) = 7 bits. Tag = 16 − 7 − 4 = 5 bits.',
  },
  {
    id: 'q-u5-7',
    unitId: 'unit5',
    topicRef: '5.6 Cache Performance',
    difficulty: 'Applied',
    question: 'A system has cache access time T_c = 5 ns, main memory access time T_m = 95 ns, and cache hit ratio h = 0.90. Using hierarchical lookup T_avg = h·T_c + (1 − h)·(T_c + T_m), what is T_avg?',
    options: ['10 ns', '14.5 ns', '19.5 ns', '25 ns'],
    correctIndex: 1,
    explanation:
      'T_avg = 0.90 × 5 + 0.10 × (5 + 95) = 4.5 + 10.0 = 14.5 ns.',
  },
  {
    id: 'q-u5-8',
    unitId: 'unit5',
    topicRef: '5.6 Write Policies',
    difficulty: 'Applied',
    question: 'Which cache write policy writes modified data to Main Memory ONLY when a dirty cache block is replaced/evicted?',
    options: ['Write-Through', 'Write-Back', 'Direct Mapping', 'Write-Around'],
    correctIndex: 1,
    explanation:
      'Write-Back marks modified cache lines with a "dirty bit" and defers writing to RAM until eviction, cutting memory bus traffic significantly.',
  },
  {
    id: 'q-u5-9',
    unitId: 'unit5',
    topicRef: '5.7 Virtual Memory',
    difficulty: 'Exam Level',
    question: 'What hardware structure accelerates virtual-to-physical address translation by caching recent Page Table entries inside the MMU?',
    options: ['Memory Data Register (MDR)', 'Translation Lookaside Buffer (TLB)', 'DMA Word Counter', 'Program Status Word (PSW)'],
    correctIndex: 1,
    explanation:
      'The TLB is a fast associative cache of recent (VPN → PFN) translations, avoiding a costly extra RAM access to the Page Table on every instruction/operand reference.',
  },
];
