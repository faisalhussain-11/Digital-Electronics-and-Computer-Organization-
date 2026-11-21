import React, { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';

type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR';
type CircuitMode = 'gates' | 'half-adder' | 'full-adder';

interface GateSpec {
  id: GateType;
  name: string;
  formula: string;
  unary?: boolean;
  nandCount: number;
  norCount: number;
  note: string;
  eval: (a: number, b: number) => 0 | 1;
}

const GATES: GateSpec[] = [
  {
    id: 'AND',
    name: 'AND Gate',
    formula: 'Y = A · B',
    nandCount: 2,
    norCount: 3,
    note: 'Output is HIGH (1) only when all inputs are HIGH (1).',
    eval: (a, b) => (a & b ? 1 : 0),
  },
  {
    id: 'OR',
    name: 'OR Gate',
    formula: 'Y = A + B',
    nandCount: 3,
    norCount: 2,
    note: 'Output is HIGH (1) whenever at least one input is HIGH (1).',
    eval: (a, b) => (a | b ? 1 : 0),
  },
  {
    id: 'NOT',
    name: 'NOT Gate (Inverter)',
    formula: "Y = A'",
    unary: true,
    nandCount: 1,
    norCount: 1,
    note: 'Inverts the input logic state. Realized by tying inputs of a NAND or NOR gate together.',
    eval: (a) => (a ? 0 : 1),
  },
  {
    id: 'NAND',
    name: 'NAND Gate (Universal)',
    formula: "Y = (A · B)'",
    nandCount: 1,
    norCount: 4,
    note: 'Universal gate: outputs LOW (0) only when all inputs are HIGH (1).',
    eval: (a, b) => (a & b ? 0 : 1),
  },
  {
    id: 'NOR',
    name: 'NOR Gate (Universal)',
    formula: "Y = (A + B)'",
    nandCount: 4,
    norCount: 1,
    note: 'Universal gate: outputs HIGH (1) only when all inputs are LOW (0).',
    eval: (a, b) => (a | b ? 0 : 1),
  },
  {
    id: 'XOR',
    name: 'XOR Gate (Exclusive-OR)',
    formula: "Y = A ⊕ B = A'B + AB'",
    nandCount: 4,
    norCount: 5,
    note: 'Outputs HIGH (1) when inputs differ. Used in adders, parity generators, and Gray code converters.',
    eval: (a, b) => (a ^ b ? 1 : 0),
  },
  {
    id: 'XNOR',
    name: 'XNOR Gate (Equivalence)',
    formula: "Y = A ⊙ B = AB + A'B'",
    nandCount: 5,
    norCount: 4,
    note: 'Outputs HIGH (1) when inputs are equal. Core building block of Magnitude Comparators and CAM cells.',
    eval: (a, b) => (a ^ b ? 0 : 1),
  },
];

const GateSchematicSvg: React.FC<{
  gate: GateType;
  a: 0 | 1;
  b: 0 | 1;
  y: 0 | 1;
  accentColor: string;
  isDark: boolean;
}> = ({ gate, a, b, y, accentColor, isDark }) => {
  const inactiveWire = isDark ? '#475569' : '#94A3B8';
  const wireA = a === 1 ? accentColor : inactiveWire;
  const wireB = b === 1 ? accentColor : inactiveWire;
  const wireY = y === 1 ? (isDark ? '#34D399' : '#059669') : inactiveWire;
  const bodyFill = isDark ? '#0F172A' : '#FFFFFF';
  const bodyStroke = isDark ? '#E2E8F0' : '#0F172A';
  const isUnary = gate === 'NOT';

  return (
    <svg
      viewBox="0 0 380 180"
      className="w-full max-w-md h-auto mx-auto"
      role="img"
      aria-label={`${gate} gate diagram with output ${y}`}
    >
      {isUnary ? (
        <>
          <line x1="36" y1="90" x2="140" y2="90" stroke={wireA} strokeWidth="3.5" strokeLinecap="round" />
          <text x="16" y="95" className="fill-slate-800 dark:fill-slate-100 text-[13px] font-mono font-semibold">
            A={a}
          </text>
        </>
      ) : (
        <>
          <line x1="42" y1="64" x2="142" y2="64" stroke={wireA} strokeWidth="3.5" strokeLinecap="round" />
          <line x1="42" y1="116" x2="142" y2="116" stroke={wireB} strokeWidth="3.5" strokeLinecap="round" />
          <text x="8" y="69" className="fill-slate-800 dark:fill-slate-100 text-[13px] font-mono font-semibold">
            A={a}
          </text>
          <text x="8" y="121" className="fill-slate-800 dark:fill-slate-100 text-[13px] font-mono font-semibold">
            B={b}
          </text>
        </>
      )}

      <line x1="242" y1="90" x2="332" y2="90" stroke={wireY} strokeWidth="3.5" strokeLinecap="round" />
      <text x="338" y="95" className="fill-slate-900 dark:fill-slate-50 text-[13px] font-mono font-bold">
        Y={y}
      </text>

      {(gate === 'AND' || gate === 'NAND') && (
        <path
          d="M 140 46 L 188 46 A 44 44 0 0 1 188 134 L 140 134 Z"
          fill={bodyFill}
          stroke={bodyStroke}
          strokeWidth="2.5"
        />
      )}

      {(gate === 'OR' || gate === 'NOR') && (
        <path
          d="M 134 46 Q 158 90 134 134 L 178 134 Q 218 134 234 90 Q 218 46 178 46 Z"
          fill={bodyFill}
          stroke={bodyStroke}
          strokeWidth="2.5"
        />
      )}

      {(gate === 'XOR' || gate === 'XNOR') && (
        <>
          <path
            d="M 124 46 Q 148 90 124 134"
            fill="none"
            stroke={bodyStroke}
            strokeWidth="2.5"
          />
          <path
            d="M 136 46 Q 160 90 136 134 L 178 134 Q 218 134 234 90 Q 218 46 178 46 Z"
            fill={bodyFill}
            stroke={bodyStroke}
            strokeWidth="2.5"
          />
        </>
      )}

      {gate === 'NOT' && (
        <polygon
          points="140,48 140,132 224,90"
          fill={bodyFill}
          stroke={bodyStroke}
          strokeWidth="2.5"
        />
      )}

      {(gate === 'NOT' || gate === 'NAND' || gate === 'NOR' || gate === 'XNOR') && (
        <circle
          cx={gate === 'NOT' ? 232 : gate === 'NAND' ? 240 : 242}
          cy="90"
          r="7"
          fill={bodyFill}
          stroke={bodyStroke}
          strokeWidth="2.5"
        />
      )}

      <text
        x={gate === 'NOT' ? '174' : '184'}
        y="95"
        textAnchor="middle"
        className="fill-slate-700 dark:fill-slate-200 text-[12px] font-mono font-semibold"
      >
        {gate}
      </text>
    </svg>
  );
};

export const LogicGatesLab: React.FC = () => {
  const { theme } = useTheme();
  const [mode, setMode] = useState<CircuitMode>('gates');
  const [selectedGate, setSelectedGate] = useState<GateType>('XOR');
  const [a, setA] = useState<0 | 1>(1);
  const [b, setB] = useState<0 | 1>(0);
  const [cin, setCin] = useState<0 | 1>(0);

  const spec = GATES.find((g) => g.id === selectedGate) ?? GATES[0];
  const gateOutput = spec.eval(a, b);

  const haSum = (a ^ b) as 0 | 1;
  const haCarry = (a & b) as 0 | 1;
  const faSum = (a ^ b ^ cin) as 0 | 1;
  const faCout = ((a & b) | (cin & (a ^ b))) as 0 | 1;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-lg">
          {[
            { id: 'gates' as CircuitMode, label: 'All 7 Logic Gates' },
            { id: 'half-adder' as CircuitMode, label: 'Half Adder' },
            { id: 'full-adder' as CircuitMode, label: 'Full Adder' },
          ].map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => setMode(m.id)}
              className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
                mode === m.id
                  ? 'bg-white dark:bg-slate-900 text-accent-text shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
        <div className="text-xs text-slate-600 dark:text-slate-400">
          {mode === 'gates' ? 'Unit I · Section 1.7' : 'Unit II · Section 2.3 (Arithmetic Circuits)'}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-5">
          {mode === 'gates' && (
            <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-5">
              <div className="flex flex-wrap gap-1.5">
                {GATES.map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGate(g.id)}
                    className={`px-3 py-1.5 text-xs font-mono font-semibold rounded-lg border transition-colors cursor-pointer ${
                      selectedGate === g.id
                        ? 'bg-accent border-accent text-accent-fg'
                        : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {g.id}
                  </button>
                ))}
              </div>

              <div className="p-6 surface-subtle border border-slate-200/90 dark:border-slate-800 rounded-xl">
                <GateSchematicSvg
                  gate={selectedGate}
                  a={a}
                  b={b}
                  y={gateOutput}
                  accentColor={theme.swatchAccent}
                  isDark={theme.isDark}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setA((prev) => (prev === 1 ? 0 : 1))}
                    className={`px-4 py-2 text-sm font-mono font-semibold rounded-lg border transition-colors cursor-pointer ${
                      a === 1
                        ? 'bg-accent border-accent text-accent-fg'
                        : 'bg-white/90 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Input A: {a} ({a === 1 ? 'HIGH' : 'LOW'})
                  </button>

                  {!spec.unary && (
                    <button
                      type="button"
                      onClick={() => setB((prev) => (prev === 1 ? 0 : 1))}
                      className={`px-4 py-2 text-sm font-mono font-semibold rounded-lg border transition-colors cursor-pointer ${
                        b === 1
                          ? 'bg-accent border-accent text-accent-fg'
                          : 'bg-white/90 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      Input B: {b} ({b === 1 ? 'HIGH' : 'LOW'})
                    </button>
                  )}
                </div>

                <div
                  className={`px-4 py-2 rounded-lg border font-mono text-sm font-semibold tabular-nums ${
                    gateOutput === 1
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300'
                      : 'surface-subtle border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  Output Y = {gateOutput} ({gateOutput === 1 ? 'HIGH' : 'LOW'})
                </div>
              </div>
            </div>
          )}

          {(mode === 'half-adder' || mode === 'full-adder') && (
            <div className="p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-6">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {mode === 'half-adder' ? 'Half Adder (2-Input)' : 'Full Adder (3-Input with Carry-In)'}
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Toggle binary inputs below to trace intermediate XOR/AND signals and final Sum &amp; Carry outputs.
                </p>
              </div>

              <div className="p-6 surface-subtle border border-slate-200 dark:border-slate-800 rounded-xl">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center text-center font-mono">
                  <div className="space-y-2.5">
                    <button
                      type="button"
                      onClick={() => setA((p) => (p === 1 ? 0 : 1))}
                      className={`w-full py-2.5 px-3 rounded-lg border text-sm font-semibold cursor-pointer ${
                        a === 1
                          ? 'bg-accent border-accent text-accent-fg'
                          : 'bg-white/90 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      A = {a} ({a ? 'HIGH' : 'LOW'})
                    </button>
                    <button
                      type="button"
                      onClick={() => setB((p) => (p === 1 ? 0 : 1))}
                      className={`w-full py-2.5 px-3 rounded-lg border text-sm font-semibold cursor-pointer ${
                        b === 1
                          ? 'bg-accent border-accent text-accent-fg'
                          : 'bg-white/90 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      B = {b} ({b ? 'HIGH' : 'LOW'})
                    </button>
                    {mode === 'full-adder' && (
                      <button
                        type="button"
                        onClick={() => setCin((p) => (p === 1 ? 0 : 1))}
                        className={`w-full py-2.5 px-3 rounded-lg border text-sm font-semibold cursor-pointer ${
                          cin === 1
                            ? 'bg-accent border-accent text-accent-fg'
                            : 'bg-white/90 dark:bg-slate-900 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                        }`}
                      >
                        Cin = {cin} ({cin ? 'HIGH' : 'LOW'})
                      </button>
                    )}
                  </div>

                  <div className="p-4 bg-white dark:bg-slate-900 border-2 border-slate-800 dark:border-slate-300 rounded-xl">
                    <div className="text-xs font-sans font-semibold text-slate-500 dark:text-slate-400">
                      Combinational Block
                    </div>
                    <div className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                      {mode === 'half-adder' ? 'HALF ADDER' : 'FULL ADDER'}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                      {mode === 'half-adder'
                        ? `${a} + ${b} = ${a + b}₁₀`
                        : `${a} + ${b} + ${cin} = ${a + b + cin}₁₀`}
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div
                      className={`py-2.5 px-3 rounded-lg border text-sm font-semibold tabular-nums ${
                        (mode === 'half-adder' ? haSum : faSum) === 1
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                          : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      Sum (S) = {mode === 'half-adder' ? haSum : faSum}
                    </div>
                    <div
                      className={`py-2.5 px-3 rounded-lg border text-sm font-semibold tabular-nums ${
                        (mode === 'half-adder' ? haCarry : faCout) === 1
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                          : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {mode === 'half-adder' ? `Carry (C) = ${haCarry}` : `Cout = ${faCout}`}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1.5">
                {mode === 'half-adder' ? (
                  <>
                    <div>
                      Sum S = A ⊕ B = {a} ⊕ {b} = <strong>{haSum}</strong>
                    </div>
                    <div>
                      Carry C = A · B = {a} · {b} = <strong>{haCarry}</strong>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      Stage 1 (HA1): A ⊕ B = {a ^ b}, A · B = {a & b}
                    </div>
                    <div>
                      Sum S = (A ⊕ B) ⊕ Cin = {a ^ b} ⊕ {cin} = <strong>{faSum}</strong>
                    </div>
                    <div>
                      Cout = (A · B) + Cin·(A ⊕ B) = {a & b} + {cin & (a ^ b)} ={' '}
                      <strong>{faCout}</strong>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-5">
          {mode === 'gates' ? (
            <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-4">
              <div>
                <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  {spec.name}
                </h2>
                <div className="mt-1 font-mono text-sm font-semibold text-accent-text">
                  {spec.formula}
                </div>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{spec.note}</p>
              </div>

              <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-lg">
                <table className="w-full text-sm text-center border-collapse font-mono tabular-nums">
                  <thead>
                    <tr className="surface-subtle border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                      <th className="py-2 px-3">A</th>
                      {!spec.unary && <th className="py-2 px-3">B</th>}
                      <th className="py-2 px-3">Output Y</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(spec.unary
                      ? [
                          [0, 0],
                          [1, 0],
                        ]
                      : [
                          [0, 0],
                          [0, 1],
                          [1, 0],
                          [1, 1],
                        ]
                    ).map(([ra, rb], idx) => {
                      const activeRow = spec.unary ? ra === a : ra === a && rb === b;
                      const ry = spec.eval(ra, rb);
                      return (
                        <tr
                          key={idx}
                          onClick={() => {
                            setA(ra as 0 | 1);
                            if (!spec.unary) setB(rb as 0 | 1);
                          }}
                          className={`cursor-pointer transition-colors ${
                            activeRow
                              ? 'bg-accent-soft text-accent-text font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-2 px-3">{ra}</td>
                          {!spec.unary && <td className="py-2 px-3">{rb}</td>}
                          <td className="py-2 px-3">{ry}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-300 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span>Universal Gate Realization</span>
                <span className="font-mono font-medium text-slate-800 dark:text-slate-200">
                  {spec.nandCount} NAND · {spec.norCount} NOR
                </span>
              </div>
            </div>
          ) : (
            <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                {mode === 'half-adder' ? 'Half Adder Truth Table' : 'Full Adder Truth Table'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click any row to apply those exact binary inputs to the circuit.
              </p>

              <div className="overflow-hidden border border-slate-200 dark:border-slate-800 rounded-lg">
                <table className="w-full text-xs sm:text-sm text-center border-collapse font-mono tabular-nums">
                  <thead>
                    <tr className="surface-subtle border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                      <th className="py-2 px-2">A</th>
                      <th className="py-2 px-2">B</th>
                      {mode === 'full-adder' && <th className="py-2 px-2">Cin</th>}
                      <th className="py-2 px-2">Sum</th>
                      <th className="py-2 px-2">{mode === 'half-adder' ? 'Carry' : 'Cout'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {(mode === 'half-adder'
                      ? [
                          [0, 0, 0],
                          [0, 1, 0],
                          [1, 0, 0],
                          [1, 1, 0],
                        ]
                      : [
                          [0, 0, 0],
                          [0, 0, 1],
                          [0, 1, 0],
                          [0, 1, 1],
                          [1, 0, 0],
                          [1, 0, 1],
                          [1, 1, 0],
                          [1, 1, 1],
                        ]
                    ).map(([ra, rb, rc], idx) => {
                      const active =
                        mode === 'half-adder'
                          ? ra === a && rb === b
                          : ra === a && rb === b && rc === cin;
                      const sum = mode === 'half-adder' ? ra ^ rb : ra ^ rb ^ rc;
                      const carry =
                        mode === 'half-adder' ? ra & rb : (ra & rb) | (rc & (ra ^ rb));
                      return (
                        <tr
                          key={idx}
                          onClick={() => {
                            setA(ra as 0 | 1);
                            setB(rb as 0 | 1);
                            if (mode === 'full-adder') setCin(rc as 0 | 1);
                          }}
                          className={`cursor-pointer ${
                            active
                              ? 'bg-accent-soft text-accent-text font-bold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <td className="py-2 px-2">{ra}</td>
                          <td className="py-2 px-2">{rb}</td>
                          {mode === 'full-adder' && <td className="py-2 px-2">{rc}</td>}
                          <td className="py-2 px-2">{sum}</td>
                          <td className="py-2 px-2">{carry}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
