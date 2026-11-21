import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';

type SubMode = 'cpu' | 'async-io' | 'memory';

interface CpuStep {
  phase: 'Fetch' | 'Decode' | 'Execute';
  stepLabel: string;
  rtl: string;
  explanation: string;
  activeBlocks: string[];
  activeBus: 'address' | 'data' | 'control' | 'internal';
  registers: {
    PC: string;
    MAR: string;
    MDR: string;
    IR: string;
    AC: string;
  };
}

const CPU_STEPS: CpuStep[] = [
  {
    phase: 'Fetch',
    stepLabel: 'T0 · Present Instruction Address',
    rtl: 'MAR ← PC',
    explanation:
      'Control Unit copies the Program Counter (0x100) into the Memory Address Register and places 0x100 on the unidirectional Address Bus.',
    activeBlocks: ['PC', 'MAR', 'CU'],
    activeBus: 'address',
    registers: { PC: '0x100', MAR: '0x100', MDR: '0x0000', IR: '—', AC: '0x000A' },
  },
  {
    phase: 'Fetch',
    stepLabel: 'T1 · Read Instruction & Advance PC',
    rtl: 'MDR ← M[MAR],   PC ← PC + 1',
    explanation:
      'Control Bus asserts MEM_READ. Main Memory places instruction "ADD 0x204" onto the bidirectional Data Bus into MDR while PC increments to 0x101.',
    activeBlocks: ['MEM', 'MDR', 'PC'],
    activeBus: 'data',
    registers: { PC: '0x101', MAR: '0x100', MDR: 'ADD 0x204', IR: '—', AC: '0x000A' },
  },
  {
    phase: 'Fetch',
    stepLabel: 'T2 · Load Instruction Register',
    rtl: 'IR ← MDR',
    explanation:
      'The fetched instruction word transfers internally from MDR into the Instruction Register (IR), completing the Fetch phase.',
    activeBlocks: ['MDR', 'IR'],
    activeBus: 'internal',
    registers: { PC: '0x101', MAR: '0x100', MDR: 'ADD 0x204', IR: 'ADD 0x204', AC: '0x000A' },
  },
  {
    phase: 'Decode',
    stepLabel: 'T3 · Decode Opcode & Extract Operand Address',
    rtl: 'CU decodes IR[opcode=ADD],   MAR ← IR[addr=0x204]',
    explanation:
      'Control Unit decodes the opcode (ADD) and routes the operand address (0x204) into MAR to prepare for operand retrieval.',
    activeBlocks: ['IR', 'CU', 'MAR'],
    activeBus: 'address',
    registers: { PC: '0x101', MAR: '0x204', MDR: 'ADD 0x204', IR: 'ADD 0x204', AC: '0x000A' },
  },
  {
    phase: 'Execute',
    stepLabel: 'T4 · Fetch Operand from Main Memory',
    rtl: 'MDR ← M[0x204]  (value = 0x0005)',
    explanation:
      'Memory reads the data word stored at 0x204 (decimal 5 = 0x0005) and transfers it over the Data Bus into MDR.',
    activeBlocks: ['MEM', 'MDR'],
    activeBus: 'data',
    registers: { PC: '0x101', MAR: '0x204', MDR: '0x0005', IR: 'ADD 0x204', AC: '0x000A' },
  },
  {
    phase: 'Execute',
    stepLabel: 'T5 · ALU Execution & Write-Back to Accumulator',
    rtl: 'AC ← AC + MDR   (0x000A + 0x0005 = 0x000F)',
    explanation:
      'ALU adds Accumulator (10) and MDR (5), storing the result (15 = 0x000F) back into AC. Processor is ready for the next Fetch at PC = 0x101.',
    activeBlocks: ['ALU', 'AC', 'MDR'],
    activeBus: 'internal',
    registers: { PC: '0x101', MAR: '0x204', MDR: '0x0005', IR: 'ADD 0x204', AC: '0x000F' },
  },
];

const HANDSHAKE_STEPS = [
  {
    step: 0,
    title: 'Idle State',
    dataActive: false,
    validHigh: false,
    acceptedHigh: false,
    desc: 'Bus is idle. Both Data Valid (Source → Dest) and Data Accepted (Dest → Source) are LOW (0).',
  },
  {
    step: 1,
    title: 'Phase 1 · Source Places Data & Asserts Data Valid',
    dataActive: true,
    validHigh: true,
    acceptedHigh: false,
    desc: 'Source places stable word on Data Bus and raises Data Valid = 1 to inform Destination.',
  },
  {
    step: 2,
    title: 'Phase 2 · Destination Latches Data & Asserts Data Accepted',
    dataActive: true,
    validHigh: true,
    acceptedHigh: true,
    desc: 'Destination reads the bus word into its buffer and raises Data Accepted = 1 to confirm receipt.',
  },
  {
    step: 3,
    title: 'Phase 3 · Source Drops Data Valid & Releases Bus',
    dataActive: false,
    validHigh: false,
    acceptedHigh: true,
    desc: 'Upon seeing Data Accepted = 1, Source de-asserts Data Valid = 0 and invalidates data lines.',
  },
  {
    step: 4,
    title: 'Phase 4 · Destination Drops Data Accepted',
    dataActive: false,
    validHigh: false,
    acceptedHigh: false,
    desc: 'Destination sees Data Valid = 0 and lowers Data Accepted = 0, completing one closed-loop cycle.',
  },
];

const MEMORY_TIERS = [
  {
    id: 'registers',
    name: 'CPU Registers',
    tech: 'CMOS Flip-Flops',
    capacity: '< 1 KB',
    latency: '0.3 – 1 ns',
    cost: 'Highest',
    widthPct: 36,
    note: 'Built directly inside the CPU core (PC, IR, AC, general registers). Accessed in a single clock cycle.',
  },
  {
    id: 'cache',
    name: 'Cache Memory (L1 / L2 / L3)',
    tech: 'Static RAM (SRAM)',
    capacity: '32 KB – 64 MB',
    latency: '1 – 15 ns',
    cost: 'High',
    widthPct: 54,
    note: '6-transistor SRAM cells requiring no refresh. Exploits temporal and spatial locality to shield CPU from DRAM latency.',
  },
  {
    id: 'ram',
    name: 'Primary Memory (Main RAM)',
    tech: 'Dynamic RAM (DRAM)',
    capacity: '8 GB – 128 GB',
    latency: '40 – 80 ns',
    cost: 'Moderate',
    widthPct: 74,
    note: '1T1C capacitor cells requiring periodic refreshing. Holds active OS kernel, executing programs, and page tables.',
  },
  {
    id: 'auxiliary',
    name: 'Auxiliary Storage (SSD / HDD)',
    tech: 'NAND Flash / Magnetic Disk',
    capacity: '512 GB – 16 TB',
    latency: '50 µs – 10 ms',
    cost: 'Lowest',
    widthPct: 96,
    note: 'Non-volatile bulk storage backing the Virtual Memory swap space and persistent file systems.',
  },
];

export const ComputerOrgMemoryLab: React.FC = () => {
  const [subMode, setSubMode] = useState<SubMode>('cpu');
  const [cpuStepIdx, setCpuStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hsStep, setHsStep] = useState(1);

  const [selectedTierId, setSelectedTierId] = useState('cache');
  const [hitRatioPct, setHitRatioPct] = useState(92);
  const [tCache, setTCache] = useState(8);
  const [tMain, setTMain] = useState(100);
  const [lookupMode, setLookupMode] = useState<'hierarchical' | 'simultaneous'>('hierarchical');

  useEffect(() => {
    if (!isPlaying) return;
    const timer = window.setInterval(() => {
      setCpuStepIdx((prev) => {
        if (prev >= CPU_STEPS.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 1800);
    return () => window.clearInterval(timer);
  }, [isPlaying]);

  const curCpu = CPU_STEPS[cpuStepIdx];
  const isActive = (block: string) => curCpu.activeBlocks.includes(block);

  const h = hitRatioPct / 100;
  const eat =
    lookupMode === 'hierarchical'
      ? h * tCache + (1 - h) * (tCache + tMain)
      : h * tCache + (1 - h) * tMain;
  const speedup = tMain / eat;

  const selectedTier = MEMORY_TIERS.find((t) => t.id === selectedTierId) ?? MEMORY_TIERS[1];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-lg">
          {[
            { id: 'cpu' as SubMode, label: 'CPU Instruction Cycle' },
            { id: 'async-io' as SubMode, label: 'Async Handshaking' },
            { id: 'memory' as SubMode, label: 'Memory Hierarchy & Cache EAT' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setSubMode(m.id);
                setIsPlaying(false);
              }}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                subMode === m.id
                  ? 'bg-white dark:bg-slate-900 text-accent-text shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400">
          {subMode === 'memory'
            ? 'Unit V · Sections 5.1 & 5.6'
            : 'Unit IV · Sections 4.2, 4.3 & 4.7'}
        </div>
      </div>

      {/* MODE 1: CPU FETCH-DECODE-EXECUTE VISUALIZER */}
      {subMode === 'cpu' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 p-5 sm:p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  Instruction Trace ·{' '}
                  <span className="font-mono text-slate-700 dark:text-slate-200">ADD 0x204</span>
                </div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Stored-Program Digital Computer Block Diagram
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setCpuStepIdx((p) => Math.max(0, p - 1));
                  }}
                  disabled={cpuStepIdx === 0}
                  aria-label="Previous step"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (cpuStepIdx >= CPU_STEPS.length - 1) setCpuStepIdx(0);
                    setIsPlaying((p) => !p);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg bg-accent text-accent-fg hover:bg-accent-hover cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlaying ? 'Pause' : 'Play Cycle'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setCpuStepIdx((p) => Math.min(CPU_STEPS.length - 1, p + 1));
                  }}
                  disabled={cpuStepIdx === CPU_STEPS.length - 1}
                  aria-label="Next step"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setCpuStepIdx(0);
                  }}
                  aria-label="Reset simulation"
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-5 surface-subtle border border-slate-200 dark:border-slate-800 rounded-xl space-y-4">
              <div className="p-4 bg-white/95 dark:bg-slate-900/90 border border-slate-300 dark:border-slate-700 rounded-xl">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
                  Central Processing Unit (CPU)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 font-mono text-xs">
                  {[
                    { id: 'PC', label: 'PC (Next Addr)', val: curCpu.registers.PC },
                    { id: 'IR', label: 'IR (Instruction)', val: curCpu.registers.IR },
                    { id: 'MAR', label: 'MAR (Mem Addr)', val: curCpu.registers.MAR },
                    { id: 'MDR', label: 'MDR (Mem Data)', val: curCpu.registers.MDR },
                    { id: 'AC', label: 'AC (Accumulator)', val: curCpu.registers.AC },
                    {
                      id: 'ALU',
                      label: 'ALU & Control',
                      val: isActive('ALU')
                        ? 'ACTIVE: ADD'
                        : isActive('CU')
                          ? 'DECODE / CTRL'
                          : 'STANDBY',
                    },
                  ].map((reg) => {
                    const active = isActive(reg.id) || (reg.id === 'ALU' && isActive('CU'));
                    return (
                      <div
                        key={reg.id}
                        className={`p-3 rounded-lg border transition-colors ${
                          active
                            ? 'bg-accent-soft border-accent text-accent-text'
                            : 'surface-subtle border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        <div className="font-sans text-[11px] font-medium text-slate-500 dark:text-slate-400">
                          {reg.label}
                        </div>
                        <div className="mt-1 text-sm font-bold tabular-nums">{reg.val}</div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                <div
                  className={`py-2 px-2 rounded-lg border font-semibold transition-colors ${
                    curCpu.activeBus === 'address'
                      ? 'bg-accent border-accent text-accent-fg'
                      : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Address Bus →
                </div>
                <div
                  className={`py-2 px-2 rounded-lg border font-semibold transition-colors ${
                    curCpu.activeBus === 'data'
                      ? 'bg-emerald-700 border-emerald-700 text-white'
                      : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  ↔ Data Bus
                </div>
                <div
                  className={`py-2 px-2 rounded-lg border font-semibold transition-colors ${
                    curCpu.activeBus === 'control' ||
                    curCpu.activeBus === 'address' ||
                    curCpu.activeBus === 'data'
                      ? 'bg-slate-800 dark:bg-slate-200 border-slate-800 dark:border-slate-200 text-white dark:text-slate-900'
                      : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  Control Bus (R/W)
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  className={`p-4 rounded-xl border transition-colors ${
                    isActive('MEM')
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-300 dark:border-emerald-700'
                      : 'bg-white/95 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Main Memory (RAM)
                  </div>
                  <div className="mt-2 space-y-1 font-mono text-xs tabular-nums">
                    <div
                      className={`px-2 py-1 rounded ${
                        curCpu.registers.MAR === '0x100' && isActive('MEM')
                          ? 'bg-emerald-200/70 dark:bg-emerald-900 font-bold text-emerald-950 dark:text-emerald-100'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      [0x100] : ADD 0x204 (Instruction)
                    </div>
                    <div
                      className={`px-2 py-1 rounded ${
                        curCpu.registers.MAR === '0x204' && isActive('MEM')
                          ? 'bg-emerald-200/70 dark:bg-emerald-900 font-bold text-emerald-950 dark:text-emerald-100'
                          : 'text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      [0x204] : 0x0005 (Operand = 5)
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border bg-white/95 dark:bg-slate-900/90 border-slate-200 dark:border-slate-800">
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    I/O Interface &amp; DMA Controller
                  </div>
                  <p className="mt-1.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Connected to the shared System Bus via Address Decoder, Data/Status Registers,
                    Interrupt (INTR), and DMA Bus Request/Grant (BR/BG) lines.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-4">
              <div>
                <div className="text-xs font-semibold text-accent-text">
                  Phase: {curCpu.phase} · Step {cpuStepIdx + 1} of {CPU_STEPS.length}
                </div>
                <h3 className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
                  {curCpu.stepLabel}
                </h3>
                <div className="mt-2.5 p-3 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-xs font-semibold text-slate-900 dark:text-slate-100">
                  {curCpu.rtl}
                </div>
                <p className="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {curCpu.explanation}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Jump to Micro-Step
                </div>
                <div className="space-y-1">
                  {CPU_STEPS.map((st, idx) => (
                    <button
                      key={st.stepLabel}
                      type="button"
                      onClick={() => {
                        setIsPlaying(false);
                        setCpuStepIdx(idx);
                      }}
                      className={`w-full px-3 py-2 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                        idx === cpuStepIdx
                          ? 'bg-accent-soft border border-accent-border text-accent-text font-semibold'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100/70 dark:hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      {st.stepLabel}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: ASYNCHRONOUS HANDSHAKING VISUALIZER */}
      {subMode === 'async-io' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Source-Initiated Asynchronous Handshaking Protocol
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Step through all 4 closed-loop signal transitions between Source and Destination units.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setHsStep((p) => Math.max(0, p - 1))}
                  disabled={hsStep === 0}
                  className="px-3 py-1.5 text-xs font-medium border border-slate-200 dark:border-slate-700 rounded-lg bg-white/90 dark:bg-slate-900 text-slate-700 dark:text-slate-200 disabled:opacity-40 cursor-pointer"
                >
                  Prev
                </button>
                <button
                  type="button"
                  onClick={() => setHsStep((p) => (p + 1) % HANDSHAKE_STEPS.length)}
                  className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-accent text-accent-fg hover:bg-accent-hover cursor-pointer"
                >
                  Next Phase
                </button>
              </div>
            </div>

            <div className="p-5 surface-subtle border border-slate-200 dark:border-slate-800 rounded-xl space-y-4 font-mono text-xs">
              {[
                {
                  name: 'Data Bus (Valid Word)',
                  active: HANDSHAKE_STEPS[hsStep].dataActive,
                  stateText: HANDSHAKE_STEPS[hsStep].dataActive ? 'VALID DATA ON BUS' : 'HIGH-Z / IDLE',
                },
                {
                  name: 'Data Valid (Source → Dest)',
                  active: HANDSHAKE_STEPS[hsStep].validHigh,
                  stateText: HANDSHAKE_STEPS[hsStep].validHigh ? 'HIGH (1)' : 'LOW (0)',
                },
                {
                  name: 'Data Accepted (Dest → Source)',
                  active: HANDSHAKE_STEPS[hsStep].acceptedHigh,
                  stateText: HANDSHAKE_STEPS[hsStep].acceptedHigh ? 'HIGH (1)' : 'LOW (0)',
                },
              ].map((line) => (
                <div
                  key={line.name}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-lg"
                >
                  <span className="font-sans font-semibold text-slate-800 dark:text-slate-100">
                    {line.name}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-32 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-200 ${
                          line.active ? 'w-full bg-accent' : 'w-0'
                        }`}
                      />
                    </div>
                    <span
                      className={`font-semibold tabular-nums min-w-[125px] text-right ${
                        line.active ? 'text-accent-text' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {line.stateText}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 bg-accent-soft border border-accent-border rounded-lg">
              <div className="text-sm font-semibold text-accent-text">
                {HANDSHAKE_STEPS[hsStep].title}
              </div>
              <p className="mt-1 text-sm text-slate-700 dark:text-slate-200">
                {HANDSHAKE_STEPS[hsStep].desc}
              </p>
            </div>
          </div>

          <div className="lg:col-span-4 p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Strobe Control vs. Handshaking
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Strobe Control</strong> uses only <em>one</em> control wire (open-loop). The
              sender assumes the receiver latched the data within a fixed pulse window.
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <strong>Handshaking</strong> adds a second reply wire (closed-loop). Every edge waits
              for confirmation, guaranteeing reliability even when sender and receiver operate at
              wildly different speeds.
            </p>
          </div>
        </div>
      )}

      {/* MODE 3: MEMORY HIERARCHY & CACHE EAT CALCULATOR */}
      {subMode === 'memory' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 p-5 sm:p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-5">
            <div>
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                Memory Hierarchy: Speed, Size &amp; Cost Trade-Offs
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Click any tier in the pyramid to inspect its technology, access latency, and role.
              </p>
            </div>

            <div className="space-y-2.5 flex flex-col items-center py-2">
              {MEMORY_TIERS.map((tier) => {
                const active = tier.id === selectedTierId;
                return (
                  <button
                    key={tier.id}
                    type="button"
                    onClick={() => setSelectedTierId(tier.id)}
                    style={{ width: `${tier.widthPct}%` }}
                    className={`py-3 px-4 rounded-lg border text-center transition-colors cursor-pointer ${
                      active
                        ? 'bg-accent border-accent text-accent-fg'
                        : 'surface-subtle border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-accent'
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-semibold">{tier.name}</div>
                    <div
                      className={`text-[11px] font-mono tabular-nums mt-0.5 ${
                        active ? 'opacity-85' : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {tier.latency} · {tier.capacity}
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
              <span>Top: Fastest, Smallest, Highest Cost/Bit</span>
              <span>Bottom: Slowest, Largest, Lowest Cost/Bit</span>
            </div>

            <div className="p-4 surface-subtle border border-slate-200 dark:border-slate-800 rounded-xl space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {selectedTier.name}
                </h3>
                <span className="text-xs font-mono text-accent-text font-semibold">
                  {selectedTier.tech}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {selectedTier.note}
              </p>
              <div className="pt-2 grid grid-cols-3 gap-2 text-xs font-mono tabular-nums">
                <div className="p-2 bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
                  <div className="font-sans text-slate-500 dark:text-slate-400">Access Time</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {selectedTier.latency}
                  </div>
                </div>
                <div className="p-2 bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
                  <div className="font-sans text-slate-500 dark:text-slate-400">Typical Size</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {selectedTier.capacity}
                  </div>
                </div>
                <div className="p-2 bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded">
                  <div className="font-sans text-slate-500 dark:text-slate-400">Cost / Bit</div>
                  <div className="font-semibold text-slate-900 dark:text-slate-100">
                    {selectedTier.cost}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Cache Effective Access Time (EAT) Calculator
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Adjust cache hit ratio and access latencies to verify Unit V numerical problems.
              </p>
            </div>

            <div className="inline-flex items-center gap-1 p-1 surface-subtle border border-slate-200 dark:border-slate-700 rounded-lg w-full">
              <button
                type="button"
                onClick={() => setLookupMode('hierarchical')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  lookupMode === 'hierarchical'
                    ? 'bg-accent text-accent-fg font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Hierarchical
              </button>
              <button
                type="button"
                onClick={() => setLookupMode('simultaneous')}
                className={`flex-1 py-1.5 text-xs font-medium rounded-md cursor-pointer ${
                  lookupMode === 'simultaneous'
                    ? 'bg-accent text-accent-fg font-semibold'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                Simultaneous
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                  <label htmlFor="hit-ratio">Cache Hit Ratio (h)</label>
                  <span className="font-mono font-semibold tabular-nums">
                    {hitRatioPct}% ({h.toFixed(2)})
                  </span>
                </div>
                <input
                  id="hit-ratio"
                  type="range"
                  min={50}
                  max={99}
                  step={1}
                  value={hitRatioPct}
                  onChange={(e) => setHitRatioPct(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                  <label htmlFor="t-cache">Cache Access Time (T_cache)</label>
                  <span className="font-mono font-semibold tabular-nums">{tCache} ns</span>
                </div>
                <input
                  id="t-cache"
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={tCache}
                  onChange={(e) => setTCache(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-200 mb-1">
                  <label htmlFor="t-main">Main Memory Time (T_main)</label>
                  <span className="font-mono font-semibold tabular-nums">{tMain} ns</span>
                </div>
                <input
                  id="t-main"
                  type="range"
                  min={40}
                  max={250}
                  step={5}
                  value={tMain}
                  onChange={(e) => setTMain(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
            </div>

            <div className="p-4 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
              <div className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {lookupMode === 'hierarchical'
                  ? 'EAT = h·Tc + (1 − h)·(Tc + Tm)'
                  : 'EAT = h·Tc + (1 − h)·Tm'}
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  Effective Access Time
                </span>
                <span className="text-2xl font-mono font-bold text-accent-text tabular-nums">
                  {eat.toFixed(2)} ns
                </span>
              </div>
              <div className="flex items-baseline justify-between text-xs text-emerald-700 dark:text-emerald-400 font-medium pt-1 border-t border-slate-200 dark:border-slate-700">
                <span>Speedup vs. RAM Alone ({tMain} ns)</span>
                <span className="font-mono font-semibold tabular-nums">
                  {speedup.toFixed(2)}× faster
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
