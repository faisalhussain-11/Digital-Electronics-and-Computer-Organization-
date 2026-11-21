import React, { useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import {
  BaseOption,
  computeHamming74,
  convertNumberSystem,
} from '../../utils/decoEngines';

type SubMode = 'converter' | 'hamming';

const BIT_LABELS = [
  { pos: 7, name: 'D7', type: 'Data' },
  { pos: 6, name: 'D6', type: 'Data' },
  { pos: 5, name: 'D5', type: 'Data' },
  { pos: 4, name: 'P4', type: 'Parity' },
  { pos: 3, name: 'D3', type: 'Data' },
  { pos: 2, name: 'P2', type: 'Parity' },
  { pos: 1, name: 'P1', type: 'Parity' },
] as const;

export const NumberSystemsLab: React.FC = () => {
  const [subMode, setSubMode] = useState<SubMode>('converter');
  const [inputValue, setInputValue] = useState('45');
  const [inputBase, setInputBase] = useState<BaseOption>(10);
  const [dataBits, setDataBits] = useState<[0 | 1, 0 | 1, 0 | 1, 0 | 1]>([1, 0, 1, 1]);
  const [injectedErrorPos, setInjectedErrorPos] = useState<number>(0);

  const conv = useMemo(
    () => convertNumberSystem(inputValue, inputBase),
    [inputValue, inputBase]
  );

  const hamming = useMemo(
    () => computeHamming74(dataBits, injectedErrorPos),
    [dataBits, injectedErrorPos]
  );

  const toggleDataBit = (index: 0 | 1 | 2 | 3) => {
    setDataBits((prev) => {
      const next = [...prev] as [0 | 1, 0 | 1, 0 | 1, 0 | 1];
      next[index] = next[index] === 1 ? 0 : 1;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="inline-flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-lg">
          <button
            type="button"
            onClick={() => setSubMode('converter')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
              subMode === 'converter'
                ? 'bg-white dark:bg-slate-900 text-accent-text shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Bases, Complements &amp; Codes
          </button>
          <button
            type="button"
            onClick={() => setSubMode('hamming')}
            className={`px-3.5 py-1.5 text-xs sm:text-sm font-medium rounded-md transition-colors cursor-pointer ${
              subMode === 'hamming'
                ? 'bg-white dark:bg-slate-900 text-accent-text shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Hamming (7,4) Error Corrector
          </button>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-400">
          {subMode === 'converter'
            ? 'Unit I · Sections 1.1 – 1.3'
            : 'Unit I · Section 1.4 (Even Parity)'}
        </div>
      </div>

      {/* MODE 1: BASE CONVERTER, COMPLEMENTS & CODES */}
      {subMode === 'converter' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl">
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-5">
                  <label
                    htmlFor="base-select"
                    className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5"
                  >
                    Input Radix (Base)
                  </label>
                  <select
                    id="base-select"
                    value={inputBase}
                    onChange={(e) => setInputBase(Number(e.target.value) as BaseOption)}
                    className="w-full px-3 py-2 text-sm bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-accent"
                  >
                    <option value={10}>Decimal (Base 10)</option>
                    <option value={2}>Binary (Base 2)</option>
                    <option value={8}>Octal (Base 8)</option>
                    <option value={16}>Hexadecimal (Base 16)</option>
                  </select>
                </div>

                <div className="sm:col-span-7">
                  <label
                    htmlFor="number-input"
                    className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5"
                  >
                    Value to Convert (0 to 65,535)
                  </label>
                  <input
                    id="number-input"
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="e.g., 45 or 101101 or 2D"
                    className="w-full px-3.5 py-2 text-sm font-mono bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>Try examples:</span>
                {[
                  { label: '45₁₀', val: '45', base: 10 as BaseOption },
                  { label: '101101₂', val: '101101', base: 2 as BaseOption },
                  { label: '73₈', val: '73', base: 8 as BaseOption },
                  { label: '2F₁₆', val: '2F', base: 16 as BaseOption },
                ].map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => {
                      setInputBase(ex.base);
                      setInputValue(ex.val);
                    }}
                    className="px-2.5 py-1 font-mono surface-subtle hover:bg-accent-soft border border-slate-200 dark:border-slate-700 rounded text-slate-700 dark:text-slate-200 cursor-pointer"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>

              {!conv.valid && (
                <div className="mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-800 text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{conv.error}</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Decimal (Base 10)', value: conv.valid ? String(conv.decimal) : '—' },
                { label: `Binary (${conv.bitWidth}-bit)`, value: conv.valid ? conv.binary : '—' },
                { label: 'Octal (Base 8)', value: conv.valid ? conv.octal : '—' },
                { label: 'Hexadecimal (Base 16)', value: conv.valid ? conv.hex : '—' },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-4 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl"
                >
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {item.label}
                  </div>
                  <div className="mt-1.5 text-lg font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums break-all">
                    {item.value}
                  </div>
                </div>
              ))}
            </div>

            <div className="surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden">
              <div className="px-5 py-3.5 surface-subtle border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Complements, Weighted/Non-Weighted Codes &amp; Parity
                </h2>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 tabular-nums">
                  {conv.bitWidth}-bit register
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
                {[
                  {
                    name: "1's Complement (Binary)",
                    desc: 'Bitwise inversion of every bit',
                    val: conv.valid ? conv.onesComplement : '—',
                  },
                  {
                    name: "2's Complement (Binary)",
                    desc: "1's complement + 1 (signed negation)",
                    val: conv.valid ? conv.twosComplement : '—',
                  },
                  {
                    name: "9's & 10's Complement (Decimal)",
                    desc: 'Diminished & radix decimal complements',
                    val: conv.valid
                      ? `9's: ${conv.ninesComplement}  |  10's: ${conv.tensComplement}`
                      : '—',
                  },
                  {
                    name: '8421 BCD (Weighted)',
                    desc: 'Each decimal digit encoded in 4 bits',
                    val: conv.valid ? conv.bcd8421 : '—',
                  },
                  {
                    name: 'Excess-3 (Self-Complementing)',
                    desc: 'BCD + 0011 per decimal digit',
                    val: conv.valid ? conv.excess3 : '—',
                  },
                  {
                    name: 'Gray Code (Unit-Distance)',
                    desc: 'Adjacent values differ by exactly 1 bit',
                    val: conv.valid ? conv.grayCode : '—',
                  },
                  {
                    name: 'Parity Check Bits',
                    desc: 'Appended bit for single-bit error detection',
                    val: conv.valid
                      ? `Even Parity Bit = ${conv.evenParityBit}  |  Odd Parity Bit = ${conv.oddParityBit}`
                      : '—',
                  },
                ].map((row) => (
                  <div
                    key={row.name}
                    className="px-5 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="font-medium text-slate-900 dark:text-slate-100">{row.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">{row.desc}</div>
                    </div>
                    <div className="font-mono text-sm font-semibold text-accent-text tabular-nums break-all">
                      {row.val}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-5">
            <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Step-by-Step Conversion Derivation
              </h2>

              {conv.valid ? (
                <div className="mt-4 space-y-4 text-xs sm:text-sm">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                      1. Positional Expansion to Decimal
                    </div>
                    <div className="p-3 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1.5 break-words">
                      {conv.stepsToDecimal.map((s, i) => (
                        <div key={i}>{s}</div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                      2. Repeated Division by 2 (Decimal → Binary)
                    </div>
                    <div className="p-3 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1 max-h-60 overflow-y-auto tabular-nums">
                      {conv.stepsToBinary.map((s, i) => (
                        <div key={i}>{s}</div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                  Enter a valid number on the left to inspect its step-by-step radix breakdown.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODE 2: HAMMING (7,4) ENCODER & FAULT SIMULATOR */}
      {subMode === 'hamming' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    1. Set 4-Bit Data Word (Click bits to toggle 0 / 1)
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Parity bits P1, P2, and P4 are computed automatically using even parity.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setDataBits([1, 0, 1, 1]);
                    setInjectedErrorPos(0);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 surface-subtle border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="mt-4 grid grid-cols-4 gap-3 max-w-md">
                {(['D7', 'D6', 'D5', 'D3'] as const).map((label, idx) => {
                  const val = dataBits[idx as 0 | 1 | 2 | 3];
                  return (
                    <button
                      key={label}
                      type="button"
                      onClick={() => toggleDataBit(idx as 0 | 1 | 2 | 3)}
                      className={`p-3 rounded-lg border text-center transition-colors cursor-pointer ${
                        val === 1
                          ? 'bg-accent-soft border-accent text-accent-text'
                          : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                        {label}
                      </div>
                      <div className="mt-1 text-xl font-mono font-bold tabular-nums">{val}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    2. Transmitted 7-Bit Codeword — Click Any Bit to Inject a Single-Bit Noise Fault
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Positions 1, 2, 4 hold parity bits; positions 3, 5, 6, 7 hold data bits.
                  </p>
                </div>
                {injectedErrorPos > 0 && (
                  <button
                    type="button"
                    onClick={() => setInjectedErrorPos(0)}
                    className="text-xs font-semibold text-accent-text hover:underline cursor-pointer"
                  >
                    Clear Injected Fault
                  </button>
                )}
              </div>

              <div className="mt-4 grid grid-cols-7 gap-2">
                {BIT_LABELS.map((meta) => {
                  const arrIdx = meta.pos - 1;
                  const sentBit = hamming.encodedBits[arrIdx];
                  const recvBit = hamming.receivedBits[arrIdx];
                  const isFaulty = injectedErrorPos === meta.pos;
                  return (
                    <button
                      key={meta.pos}
                      type="button"
                      onClick={() =>
                        setInjectedErrorPos((prev) => (prev === meta.pos ? 0 : meta.pos))
                      }
                      className={`p-2.5 sm:p-3 rounded-lg border text-center transition-colors cursor-pointer ${
                        isFaulty
                          ? 'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-700 text-red-900 dark:text-red-200'
                          : meta.type === 'Parity'
                            ? 'surface-subtle border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-accent'
                            : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 hover:border-accent'
                      }`}
                    >
                      <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                        Pos {meta.pos}
                      </div>
                      <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                        {meta.name}
                      </div>
                      <div className="mt-1.5 text-xl font-mono font-bold tabular-nums">
                        {recvBit}
                      </div>
                      <div className="mt-1 text-[10px] font-medium">
                        {isFaulty ? (
                          <span className="text-red-700 dark:text-red-300">
                            FLIPPED (was {sentBit})
                          </span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500">{meta.type}</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div
                className={`mt-5 p-4 rounded-lg border flex items-start gap-3 ${
                  hamming.errorPosition === 0
                    ? 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800 text-red-900 dark:text-red-200'
                }`}
              >
                {hamming.errorPosition === 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-red-700 dark:text-red-400 shrink-0 mt-0.5" />
                )}
                <div className="text-sm">
                  {hamming.errorPosition === 0 ? (
                    <>
                      <div className="font-semibold">
                        NO ERROR DETECTED · Syndrome (C4 C2 C1) = 000₂ (0)
                      </div>
                      <p className="text-xs mt-1 opacity-90">
                        All three parity checks pass. Received data word D7 D6 D5 D3 ={' '}
                        <span className="font-mono font-semibold">{dataBits.join('')}</span>.
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="font-semibold">
                        FAULT DETECTED &amp; CORRECTED AT POSITION {hamming.errorPosition} · Syndrome
                        (C4 C2 C1) = {hamming.c4}
                        {hamming.c2}
                        {hamming.c1}₂ ({hamming.errorPosition})
                      </div>
                      <p className="text-xs mt-1 opacity-90">
                        Flipping bit at position {hamming.errorPosition} restores exact codeword{' '}
                        <span className="font-mono font-semibold">
                          {[...hamming.correctedBits].reverse().join('')}
                        </span>{' '}
                        and original data{' '}
                        <span className="font-mono font-semibold">{dataBits.join('')}</span>.
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-4">
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                Encoder Parity Equations (Even)
              </h2>
              <div className="space-y-2 font-mono text-xs text-slate-800 dark:text-slate-200 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 tabular-nums">
                <div>
                  P1 = D3 ⊕ D5 ⊕ D7 = {dataBits[3]} ⊕ {dataBits[2]} ⊕ {dataBits[0]} ={' '}
                  <strong>{hamming.p1}</strong>
                </div>
                <div>
                  P2 = D3 ⊕ D6 ⊕ D7 = {dataBits[3]} ⊕ {dataBits[1]} ⊕ {dataBits[0]} ={' '}
                  <strong>{hamming.p2}</strong>
                </div>
                <div>
                  P4 = D5 ⊕ D6 ⊕ D7 = {dataBits[2]} ⊕ {dataBits[1]} ⊕ {dataBits[0]} ={' '}
                  <strong>{hamming.p4}</strong>
                </div>
              </div>

              <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 pt-2">
                Receiver Syndrome Check
              </h3>
              <div className="space-y-2 font-mono text-xs text-slate-800 dark:text-slate-200 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 tabular-nums">
                <div>
                  C1 (pos 1,3,5,7) = <strong>{hamming.c1}</strong>{' '}
                  <span className="text-slate-500 dark:text-slate-400">
                    {hamming.c1 === 0 ? '(OK)' : '(Mismatch)'}
                  </span>
                </div>
                <div>
                  C2 (pos 2,3,6,7) = <strong>{hamming.c2}</strong>{' '}
                  <span className="text-slate-500 dark:text-slate-400">
                    {hamming.c2 === 0 ? '(OK)' : '(Mismatch)'}
                  </span>
                </div>
                <div>
                  C4 (pos 4,5,6,7) = <strong>{hamming.c4}</strong>{' '}
                  <span className="text-slate-500 dark:text-slate-400">
                    {hamming.c4 === 0 ? '(OK)' : '(Mismatch)'}
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-200 dark:border-slate-700 font-semibold text-accent-text">
                  Syndrome = ({hamming.c4}
                  {hamming.c2}
                  {hamming.c1})₂ = Position {hamming.errorPosition}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
