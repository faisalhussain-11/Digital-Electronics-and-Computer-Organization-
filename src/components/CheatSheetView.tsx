import React from 'react';
import { Printer } from 'lucide-react';

export const CheatSheetView: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-2xl flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            U24EC304 Quick Revision · Units I–V Consolidated
          </div>
          <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            DECO Exam-Eve Cheat Sheet
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300 max-w-2xl">
            High-frequency Boolean identities, universal gate minimums, combinational formulas,
            flip-flop excitation tables, CPU registers, and cache equations on one printable sheet.
          </p>
        </div>

        <button
          type="button"
          onClick={() => window.print()}
          className="no-print inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-800 dark:text-slate-100 bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>Print Cheat Sheet</span>
        </button>
      </div>

      {/* Grid of Reference Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Unit I */}
        <section className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-accent-text">Unit I · Boolean Algebra &amp; Codes</div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Essential Laws &amp; Gate Counts</h2>
          <div className="font-mono text-xs surface-subtle border border-slate-200/90 dark:border-slate-800 rounded-lg p-3.5 space-y-1.5 text-slate-800 dark:text-slate-200">
            <div>De Morgan&apos;s: (A+B)&apos; = A&apos;B&apos; | (AB)&apos; = A&apos; + B&apos;</div>
            <div>Distributive: A + BC = (A + B)(A + C)</div>
            <div>Absorption: A + AB = A | A + A&apos;B = A + B</div>
            <div>Consensus: AB + A&apos;C + BC = AB + A&apos;C</div>
            <div>Binary → Gray: G_i = B_(i+1) ⊕ B_i</div>
            <div>Hamming Redundancy: 2^k &gt;= m + k + 1</div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
            <strong>2-Input NAND Minimums:</strong> NOT(1) · AND(2) · OR(3) · XOR(4) · XNOR(5)
          </div>
        </section>

        {/* Unit II */}
        <section className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-accent-text">Unit II · Combinational Circuits</div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Adders, Subtractors &amp; MUX</h2>
          <div className="font-mono text-xs surface-subtle border border-slate-200/90 dark:border-slate-800 rounded-lg p-3.5 space-y-1.5 text-slate-800 dark:text-slate-200">
            <div>Half Adder: S = A ⊕ B,  C = AB</div>
            <div>Full Adder: S = A ⊕ B ⊕ Cin,  Cout = AB + Cin(A ⊕ B)</div>
            <div>Half Sub: D = A ⊕ B,  Bout = A&apos;B</div>
            <div>Full Sub: D = A ⊕ B ⊕ Bin,  Bout = A&apos;B + Bin(A ⊕ B)&apos;</div>
            <div>4:1 MUX: Y = S1&apos;S0&apos;I0 + S1&apos;S0I1 + S1S0&apos;I2 + S1S0I3</div>
            <div>n-var function needs at most 2^(n-1):1 MUX</div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
            <strong>K-Map Rule:</strong> A group of 2^k cells in an n-var map leaves (n − k) literals.
          </div>
        </section>

        {/* Unit III */}
        <section className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3 md:col-span-2">
          <div className="text-xs font-semibold text-accent-text">Unit III · Sequential Circuits</div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Unified Excitation Table &amp; Characteristic Equations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            <div className="lg:col-span-7 overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
              <table className="w-full text-xs text-center border-collapse font-mono tabular-nums">
                <thead>
                  <tr className="surface-subtle border-b border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200">
                    <th className="py-2 px-2">Q(t)</th>
                    <th className="py-2 px-2">Q(t+1)</th>
                    <th className="py-2 px-2">S</th>
                    <th className="py-2 px-2">R</th>
                    <th className="py-2 px-2">J</th>
                    <th className="py-2 px-2">K</th>
                    <th className="py-2 px-2">D</th>
                    <th className="py-2 px-2">T</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {[
                    ['0', '0', '0', 'X', '0', 'X', '0', '0'],
                    ['0', '1', '1', '0', '1', 'X', '1', '1'],
                    ['1', '0', '0', '1', 'X', '1', '0', '1'],
                    ['1', '1', 'X', '0', 'X', '0', '1', '0'],
                  ].map((r, i) => (
                    <tr key={i}>
                      {r.map((c, j) => (
                        <td key={j} className="py-2 px-2 text-slate-800 dark:text-slate-200">
                          {c}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:col-span-5 font-mono text-xs surface-subtle border border-slate-200/90 dark:border-slate-800 rounded-lg p-3.5 space-y-1.5 text-slate-800 dark:text-slate-200">
              <div>SR FF: Q(t+1) = S + R&apos;Q (SR = 0)</div>
              <div>JK FF: Q(t+1) = JQ&apos; + K&apos;Q</div>
              <div>D FF:  Q(t+1) = D</div>
              <div>T FF:  Q(t+1) = T ⊕ Q</div>
              <div className="pt-1.5 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-sans">
                Conversions: SR→JK (S=JQ&apos;, R=KQ) · D→T (D=T⊕Q) · T→D (T=D⊕Q)
              </div>
            </div>
          </div>
        </section>

        {/* Unit IV */}
        <section className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-accent-text">Unit IV · Computer Organization &amp; I/O</div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Fetch RTL, Instruction Formats &amp; DMA</h2>
          <div className="font-mono text-xs surface-subtle border border-slate-200/90 dark:border-slate-800 rounded-lg p-3.5 space-y-1.5 text-slate-800 dark:text-slate-200">
            <div>Fetch: MAR ← PC; MDR ← M[MAR], PC ← PC+1; IR ← MDR</div>
            <div>3-Addr: General Reg | 1-Addr: AC | 0-Addr: Stack</div>
            <div>DMA Regs: Address, Word Count, Control (BR/BG pins)</div>
            <div>Handshaking: Data Valid ↔ Data Accepted (4-phase)</div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
            <strong>Bus Directions:</strong> Address (Unidirectional) · Data (Bidirectional) · Control (Mixed)
          </div>
        </section>

        {/* Unit V */}
        <section className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3">
          <div className="text-xs font-semibold text-accent-text">Unit V · The Memory System</div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Cache, CAM &amp; Virtual Memory</h2>
          <div className="font-mono text-xs surface-subtle border border-slate-200/90 dark:border-slate-800 rounded-lg p-3.5 space-y-1.5 text-slate-800 dark:text-slate-200">
            <div>EAT (Hier): T_avg = h·Tc + (1 − h)·(Tc + Tm)</div>
            <div>Direct Cache: [Tag | Line Index | Block Offset]</div>
            <div>CAM Match: M_i = Π (A_j ⊙ C_ij + K_j&apos;)</div>
            <div>Virtual Addr: [VPN | Page Offset] → [PFN | Offset]</div>
            <div>Chip Expansion = (Words_req / Words_chip) × (W_req / W_chip)</div>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 pt-1">
            <strong>5 Memory Mgmt Requirements:</strong> Relocation, Protection, Sharing, Logical &amp; Physical Org.
          </div>
        </section>
      </div>
    </div>
  );
};
