import React, { useMemo, useState } from 'react';
import { Play, RotateCcw } from 'lucide-react';
import { CellValue, solveKMap } from '../../utils/decoEngines';

type SubMode = 'kmap' | 'flipflops';
type FFType = 'SR' | 'JK' | 'JK-MS' | 'D' | 'T';

const GRAY_2 = ['00', '01', '11', '10'];
const GRAY_1 = ['0', '1'];

const KMAP_3_GRID: number[][] = [
  [0, 1, 3, 2],
  [4, 5, 7, 6],
];

const KMAP_4_GRID: number[][] = [
  [0, 1, 3, 2],
  [4, 5, 7, 6],
  [12, 13, 15, 14],
  [8, 9, 11, 10],
];

const GROUP_HIGHLIGHT_CLASSES = [
  'ring-2 ring-blue-500 bg-blue-50/90 dark:bg-blue-950/60',
  'ring-2 ring-emerald-500 bg-emerald-50/90 dark:bg-emerald-950/60',
  'ring-2 ring-amber-500 bg-amber-50/90 dark:bg-amber-950/60',
  'ring-2 ring-violet-500 bg-violet-50/90 dark:bg-violet-950/60',
  'ring-2 ring-rose-500 bg-rose-50/90 dark:bg-rose-950/60',
];

const CONVERSION_GUIDE = [
  { from: 'SR', to: 'JK', eq: "S = J · Q',   R = K · Q", note: 'Blocks S=R=1 using Q feedback.' },
  { from: 'SR', to: 'D', eq: "S = D,   R = D'", note: 'Single inverter ensures S and R are complements.' },
  { from: 'JK', to: 'D', eq: "J = D,   K = D'", note: 'Inverter ties K to complement of D.' },
  { from: 'JK', to: 'T', eq: 'J = T,   K = T', note: 'Tie J and K together; T=1 triggers Toggle.' },
  { from: 'D', to: 'JK', eq: "D = J · Q' + K' · Q", note: 'D equals the JK characteristic equation.' },
  { from: 'D', to: 'T', eq: 'D = T ⊕ Q', note: 'XOR gate feeds back Q to toggle when T=1.' },
  { from: 'T', to: 'D', eq: 'T = D ⊕ Q', note: 'Toggles whenever desired D differs from Q.' },
];

export const KMapFlipFlopLab: React.FC = () => {
  const [subMode, setSubMode] = useState<SubMode>('kmap');
  const [numVars, setNumVars] = useState<3 | 4>(4);
  const [cells, setCells] = useState<CellValue[]>(() => {
    const arr: CellValue[] = Array(16).fill(0);
    [0, 1, 2, 5, 8, 9, 10].forEach((m) => (arr[m] = 1));
    return arr;
  });
  const [hoveredGroupIdx, setHoveredGroupIdx] = useState<number | null>(null);

  const solution = useMemo(
    () => solveKMap(numVars, cells.slice(0, 1 << numVars)),
    [numVars, cells]
  );

  const switchVars = (v: 3 | 4) => {
    setNumVars(v);
    setHoveredGroupIdx(null);
    if (v === 3) {
      const arr: CellValue[] = Array(8).fill(0);
      [3, 5, 6, 7].forEach((m) => (arr[m] = 1));
      setCells(arr);
    } else {
      const arr: CellValue[] = Array(16).fill(0);
      [0, 1, 2, 5, 8, 9, 10].forEach((m) => (arr[m] = 1));
      setCells(arr);
    }
  };

  const cycleCell = (minterm: number) => {
    setCells((prev) => {
      const next = [...prev];
      const cur = next[minterm];
      next[minterm] = cur === 0 ? 1 : cur === 1 ? 'X' : 0;
      return next;
    });
  };

  const applyPreset = (ones: number[], dcs: number[] = []) => {
    const size = 1 << numVars;
    const arr: CellValue[] = Array(size).fill(0);
    ones.forEach((m) => {
      if (m < size) arr[m] = 1;
    });
    dcs.forEach((m) => {
      if (m < size) arr[m] = 'X';
    });
    setCells(arr);
    setHoveredGroupIdx(null);
  };

  const [ffType, setFfType] = useState<FFType>('JK');
  const [in1, setIn1] = useState<0 | 1>(1);
  const [in2, setIn2] = useState<0 | 1>(1);
  const [qState, setQState] = useState<0 | 1>(0);
  const [ffStatus, setFfStatus] = useState<string>('Ready — press Apply Clock Pulse to step state.');
  const [history, setHistory] = useState<
    { cycle: number; inputs: string; qPrev: 0 | 1; qNext: string; action: string }[]
  >([]);
  const [selectedTransition, setSelectedTransition] = useState<number>(1);

  const applyClockPulse = () => {
    let qNextNum: 0 | 1 = qState;
    let qNextStr = String(qState);
    let action = 'Hold';
    let inputsLabel = '';

    if (ffType === 'SR') {
      inputsLabel = `S=${in1}, R=${in2}`;
      if (in1 === 0 && in2 === 0) {
        qNextNum = qState;
        action = 'Hold (No Change)';
      } else if (in1 === 0 && in2 === 1) {
        qNextNum = 0;
        action = 'Reset (Q ← 0)';
      } else if (in1 === 1 && in2 === 0) {
        qNextNum = 1;
        action = 'Set (Q ← 1)';
      } else {
        qNextStr = 'INVALID';
        action = 'Forbidden State (SR = 11)';
      }
    } else if (ffType === 'JK' || ffType === 'JK-MS') {
      inputsLabel = `J=${in1}, K=${in2}`;
      if (in1 === 0 && in2 === 0) {
        qNextNum = qState;
        action = 'Hold';
      } else if (in1 === 0 && in2 === 1) {
        qNextNum = 0;
        action = 'Reset (Q ← 0)';
      } else if (in1 === 1 && in2 === 0) {
        qNextNum = 1;
        action = 'Set (Q ← 1)';
      } else {
        qNextNum = qState === 1 ? 0 : 1;
        action =
          ffType === 'JK-MS'
            ? 'Toggle safely via Master→Slave (no race-around)'
            : "Toggle (Q ← Q')";
      }
    } else if (ffType === 'D') {
      inputsLabel = `D=${in1}`;
      qNextNum = in1;
      action = in1 === 1 ? 'Load 1 (Set)' : 'Load 0 (Reset)';
    } else if (ffType === 'T') {
      inputsLabel = `T=${in1}`;
      if (in1 === 0) {
        qNextNum = qState;
        action = 'Hold';
      } else {
        qNextNum = qState === 1 ? 0 : 1;
        action = "Toggle (Q ← Q')";
      }
    }

    if (qNextStr !== 'INVALID') {
      qNextStr = String(qNextNum);
      setQState(qNextNum);
    }
    setFfStatus(`${ffType} Flip-Flop [${inputsLabel}]: ${action}`);
    setHistory((prev) => [
      {
        cycle: prev.length + 1,
        inputs: inputsLabel,
        qPrev: qState,
        qNext: qNextStr,
        action,
      },
      ...prev.slice(0, 7),
    ]);
  };

  const grid = numVars === 3 ? KMAP_3_GRID : KMAP_4_GRID;
  const rowLabels = numVars === 3 ? GRAY_1 : GRAY_2;
  const colLabels = GRAY_2;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-lg">
          <button
            type="button"
            onClick={() => setSubMode('kmap')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
              subMode === 'kmap'
                ? 'bg-white dark:bg-slate-900 text-accent-text shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            K-Map Solver (3 &amp; 4 Variables)
          </button>
          <button
            type="button"
            onClick={() => setSubMode('flipflops')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
              subMode === 'flipflops'
                ? 'bg-white dark:bg-slate-900 text-accent-text shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Flip-Flop &amp; Excitation Trainer
          </button>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400">
          {subMode === 'kmap'
            ? 'Unit II · Sections 2.1 – 2.2 (Prime Implicant Minimization)'
            : 'Unit III · Sections 3.2 – 3.6 (Sequential Logic)'}
        </div>
      </div>

      {/* MODE 1: K-MAP SOLVER */}
      {subMode === 'kmap' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7 p-5 sm:p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="inline-flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
                {([3, 4] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => switchVars(v)}
                    className={`px-3 py-1 text-xs font-semibold rounded-md cursor-pointer ${
                      numVars === v
                        ? 'bg-white dark:bg-slate-900 text-accent-text shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {v}-Variable Map
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {numVars === 4 ? (
                  <>
                    <button
                      type="button"
                      onClick={() => applyPreset([0, 1, 2, 5, 8, 9, 10])}
                      className="px-2.5 py-1 text-xs surface-subtle hover:bg-accent-soft border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      4-Corner Example
                    </button>
                    <button
                      type="button"
                      onClick={() => applyPreset([0, 2, 5, 7, 8, 10], [13, 15])}
                      className="px-2.5 py-1 text-xs surface-subtle hover:bg-accent-soft border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
                    >
                      Don&apos;t-Care Test
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => applyPreset([3, 5, 6, 7])}
                    className="px-2.5 py-1 text-xs surface-subtle hover:bg-accent-soft border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    Full Adder Cout
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => applyPreset([])}
                  className="inline-flex items-center gap-1 px-2.5 py-1 text-xs surface-subtle hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              Click any cell to cycle{' '}
              <span className="font-mono font-semibold text-slate-700 dark:text-slate-200">
                0 → 1 → X (Don&apos;t Care)
              </span>
              . Hover a prime implicant group on the right to highlight its covered cells.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full max-w-lg mx-auto border-collapse font-mono text-center select-none">
                <thead>
                  <tr>
                    <th className="p-2 text-xs text-slate-500 dark:text-slate-400 font-semibold border-b border-r border-slate-200 dark:border-slate-700">
                      {numVars === 3 ? 'A \\ BC' : 'AB \\ CD'}
                    </th>
                    {colLabels.map((c) => (
                      <th
                        key={c}
                        className="p-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 surface-subtle border-b border-slate-200 dark:border-slate-700"
                      >
                        {c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grid.map((row, rIdx) => (
                    <tr key={rIdx}>
                      <th className="p-2.5 text-xs font-semibold text-slate-700 dark:text-slate-200 surface-subtle border-r border-slate-200 dark:border-slate-700">
                        {rowLabels[rIdx]}
                      </th>
                      {row.map((minterm) => {
                        const val = cells[minterm] ?? 0;
                        const activeHighlight =
                          hoveredGroupIdx !== null &&
                          solution.groups[hoveredGroupIdx]?.minterms.includes(minterm);

                        const firstGroupIdx = solution.groups.findIndex((g) =>
                          g.minterms.includes(minterm)
                        );

                        const cellHighlightClass = activeHighlight
                          ? GROUP_HIGHLIGHT_CLASSES[hoveredGroupIdx % GROUP_HIGHLIGHT_CLASSES.length]
                          : hoveredGroupIdx === null && firstGroupIdx !== -1 && val !== 0
                            ? 'bg-accent-soft/80 border-accent-border'
                            : 'bg-white/90 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800';

                        return (
                          <td key={minterm} className="p-1.5">
                            <button
                              type="button"
                              onClick={() => cycleCell(minterm)}
                              className={`w-full h-16 sm:h-[70px] rounded-lg border flex flex-col items-center justify-center transition-all cursor-pointer relative ${cellHighlightClass}`}
                            >
                              <span className="absolute top-1 left-1.5 text-[10px] text-slate-400 dark:text-slate-500 tabular-nums">
                                m{minterm}
                              </span>
                              <span
                                className={`text-xl font-bold tabular-nums ${
                                  val === 1
                                    ? 'text-accent-text'
                                    : val === 'X'
                                      ? 'text-amber-700 dark:text-amber-400'
                                      : 'text-slate-300 dark:text-slate-600'
                                }`}
                              >
                                {val}
                              </span>
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-5">
            <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-4">
              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                  Minimized SOP Expression
                </div>
                <div className="mt-2 p-4 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-lg font-bold text-accent-text break-words">
                  F = {solution.expression}
                </div>
              </div>

              <div className="text-xs font-mono text-slate-700 dark:text-slate-300 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 space-y-1">
                <div>
                  <span className="text-slate-500 dark:text-slate-400">Minterms: </span>
                  Σm({solution.ones.length > 0 ? solution.ones.join(', ') : 'none'})
                </div>
                {solution.dontCares.length > 0 && (
                  <div>
                    <span className="text-slate-500 dark:text-slate-400">Don&apos;t Cares: </span>
                    Σd({solution.dontCares.join(', ')})
                  </div>
                )}
              </div>

              <div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                  Selected Prime Implicant Groups ({solution.groups.length})
                </div>
                {solution.groups.length === 0 ? (
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Click cells to place 1s on the K-Map to compute prime implicants.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {solution.groups.map((g, idx) => (
                      <div
                        key={g.pattern + idx}
                        onMouseEnter={() => setHoveredGroupIdx(idx)}
                        onMouseLeave={() => setHoveredGroupIdx(null)}
                        className={`p-3 rounded-lg border transition-colors cursor-pointer flex items-center justify-between gap-3 ${
                          hoveredGroupIdx === idx
                            ? 'border-accent bg-accent-soft'
                            : 'bg-white/90 dark:bg-slate-900/80 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                        }`}
                      >
                        <div>
                          <div className="font-mono text-sm font-bold text-slate-900 dark:text-slate-100">
                            {g.term}
                          </div>
                          <div className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                            Cells: {g.minterms.map((m) => `m${m}`).join(', ')}
                          </div>
                        </div>
                        <div className="text-right text-xs text-slate-500 dark:text-slate-400">
                          <div className="font-mono">{g.pattern}</div>
                          <div>{g.isEssential ? 'Essential PI' : 'Covering PI'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: FLIP-FLOP WORKBENCH & EXCITATION TRAINER */}
      {subMode === 'flipflops' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 p-5 sm:p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap gap-1.5">
                  {(['SR', 'JK', 'JK-MS', 'D', 'T'] as FFType[]).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setFfType(t);
                        setHistory([]);
                        setFfStatus(
                          `Switched to ${t} Flip-Flop. Toggle inputs and press Apply Clock Pulse.`
                        );
                      }}
                      className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border cursor-pointer ${
                        ffType === t
                          ? 'bg-accent border-accent text-accent-fg'
                          : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {t === 'JK-MS' ? 'JK Master-Slave' : `${t} Flip-Flop`}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setQState(0);
                    setHistory([]);
                    setFfStatus('Reset Q = 0 and cleared transition log.');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs surface-subtle border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="p-6 surface-subtle border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center font-mono">
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setIn1((p) => (p === 1 ? 0 : 1))}
                      className={`w-full py-2.5 px-3 rounded-lg border text-sm font-semibold cursor-pointer ${
                        in1 === 1
                          ? 'bg-accent border-accent text-accent-fg'
                          : 'bg-white/90 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {ffType === 'SR'
                        ? `S = ${in1}`
                        : ffType === 'D'
                          ? `D = ${in1}`
                          : ffType === 'T'
                            ? `T = ${in1}`
                            : `J = ${in1}`}
                    </button>

                    {(ffType === 'SR' || ffType === 'JK' || ffType === 'JK-MS') && (
                      <button
                        type="button"
                        onClick={() => setIn2((p) => (p === 1 ? 0 : 1))}
                        className={`w-full py-2.5 px-3 rounded-lg border text-sm font-semibold cursor-pointer ${
                          in2 === 1
                            ? 'bg-accent border-accent text-accent-fg'
                            : 'bg-white/90 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        {ffType === 'SR' ? `R = ${in2}` : `K = ${in2}`}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={applyClockPulse}
                      className="w-full py-2.5 px-3 rounded-lg bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-sm font-sans font-semibold inline-flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Apply Clock Pulse</span>
                    </button>
                  </div>

                  <div className="p-5 bg-white dark:bg-slate-900 border-2 border-slate-800 dark:border-slate-300 rounded-xl text-center">
                    <div className="text-xs font-sans text-slate-500 dark:text-slate-400">
                      Sequential Storage
                    </div>
                    <div className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                      {ffType === 'JK-MS' ? 'JK M-S FF' : `${ffType} FF`}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                      {ffType === 'SR' && "Q(t+1) = S + R'Q"}
                      {(ffType === 'JK' || ffType === 'JK-MS') && "Q(t+1) = JQ' + K'Q"}
                      {ffType === 'D' && 'Q(t+1) = D'}
                      {ffType === 'T' && 'Q(t+1) = T ⊕ Q'}
                    </div>
                  </div>

                  <div className="space-y-2.5 text-center">
                    <div
                      className={`py-2.5 px-3 rounded-lg border text-sm font-bold tabular-nums ${
                        qState === 1
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                          : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      Q = {qState} ({qState === 1 ? 'HIGH' : 'LOW'})
                    </div>
                    <div className="py-2.5 px-3 rounded-lg border bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 tabular-nums">
                      Q&apos; = {qState === 1 ? 0 : 1}
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`p-3.5 rounded-lg border text-sm ${
                  ffStatus.includes('Forbidden')
                    ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200 font-medium'
                    : 'surface-subtle border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                {ffStatus}
              </div>

              {history.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    Recent Clock Transitions
                  </h3>
                  <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                    <table className="w-full text-xs text-left border-collapse font-mono tabular-nums">
                      <thead>
                        <tr className="surface-subtle border-b border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300">
                          <th className="px-3 py-2">Pulse</th>
                          <th className="px-3 py-2">Inputs</th>
                          <th className="px-3 py-2">Q(t) → Q(t+1)</th>
                          <th className="px-3 py-2 font-sans">Behavior</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                        {history.map((h) => (
                          <tr key={h.cycle}>
                            <td className="px-3 py-1.5 text-slate-500 dark:text-slate-400">
                              #{h.cycle}
                            </td>
                            <td className="px-3 py-1.5 text-slate-900 dark:text-slate-100">
                              {h.inputs}
                            </td>
                            <td className="px-3 py-1.5 font-semibold text-accent-text">
                              {h.qPrev} → {h.qNext}
                            </td>
                            <td className="px-3 py-1.5 font-sans text-slate-600 dark:text-slate-300">
                              {h.action}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="lg:col-span-5 space-y-5">
              <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Interactive Unified Excitation Table
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Click any state transition row to inspect required inputs across SR, JK, D, and T flip-flops.
                </p>

                <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                  <table className="w-full text-xs sm:text-sm text-center border-collapse font-mono tabular-nums">
                    <thead>
                      <tr className="surface-subtle border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                        <th className="py-2 px-1.5">Q(t)</th>
                        <th className="py-2 px-1.5">Q(t+1)</th>
                        <th className="py-2 px-1.5">S</th>
                        <th className="py-2 px-1.5">R</th>
                        <th className="py-2 px-1.5">J</th>
                        <th className="py-2 px-1.5">K</th>
                        <th className="py-2 px-1.5">D</th>
                        <th className="py-2 px-1.5">T</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                      {[
                        ['0', '0', '0', 'X', '0', 'X', '0', '0'],
                        ['0', '1', '1', '0', '1', 'X', '1', '1'],
                        ['1', '0', '0', '1', 'X', '1', '0', '1'],
                        ['1', '1', 'X', '0', 'X', '0', '1', '0'],
                      ].map((row, idx) => (
                        <tr
                          key={idx}
                          onClick={() => setSelectedTransition(idx)}
                          className={`cursor-pointer ${
                            selectedTransition === idx
                              ? 'bg-accent-soft text-accent-text font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="py-2 px-1.5">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="p-3 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg text-xs text-slate-700 dark:text-slate-300">
                  {selectedTransition === 0 &&
                    '0 → 0 (Stay Reset): SR needs S=0 (R can be 0 or 1); JK needs J=0 (K=X); D=0; T=0 (Hold).'}
                  {selectedTransition === 1 &&
                    '0 → 1 (Set / Toggle): SR needs S=1, R=0; JK needs J=1 (K=X since Set 10 or Toggle 11 both work); D=1; T=1.'}
                  {selectedTransition === 2 &&
                    '1 → 0 (Reset / Toggle): SR needs S=0, R=1; JK needs K=1 (J=X since Reset 01 or Toggle 11 both work); D=0; T=1.'}
                  {selectedTransition === 3 &&
                    '1 → 1 (Stay Set): SR needs R=0 (S=X); JK needs K=0 (J=X); D=1; T=0 (Hold).'}
                </div>
              </div>

              <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Flip-Flop Conversion Equations (Available → Required)
                </h2>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {CONVERSION_GUIDE.map((item) => (
                    <div
                      key={`${item.from}-${item.to}`}
                      className="py-2.5 flex items-start justify-between gap-3"
                    >
                      <div>
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.from} → {item.to}
                        </span>
                        <div className="text-slate-500 dark:text-slate-400 mt-0.5">{item.note}</div>
                      </div>
                      <span className="font-mono font-semibold text-accent-text whitespace-nowrap">
                        {item.eq}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
