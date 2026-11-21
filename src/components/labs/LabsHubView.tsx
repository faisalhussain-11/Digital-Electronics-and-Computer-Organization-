import React from 'react';
import { LabId } from '../../types/deco';
import { NumberSystemsLab } from './NumberSystemsLab';
import { LogicGatesLab } from './LogicGatesLab';
import { KMapFlipFlopLab } from './KMapFlipFlopLab';
import { ComputerOrgMemoryLab } from './ComputerOrgMemoryLab';

interface LabsHubViewProps {
  activeLabId: LabId;
  onSelectLab: (labId: LabId) => void;
}

const LAB_TABS: { id: LabId; title: string; unitLabel: string }[] = [
  { id: 'number-systems', title: 'Number Systems & Hamming', unitLabel: 'Unit I' },
  { id: 'logic-gates', title: 'Logic Gates & Adders', unitLabel: 'Unit I–II' },
  { id: 'kmap-flipflops', title: 'K-Map & Flip-Flops', unitLabel: 'Unit II–III' },
  { id: 'cpu-memory', title: 'CPU Cycle & Memory', unitLabel: 'Unit IV–V' },
];

export const LabsHubView: React.FC<LabsHubViewProps> = ({ activeLabId, onSelectLab }) => {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Header & Segmented Lab Selector */}
      <div className="p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-2xl">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Interactive Hardware Sandboxes · Units I–V
        </div>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          DECO Interactive Labs
        </h1>
        <p className="mt-2 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 max-w-3xl">
          Verify textbook problems, step through live binary conversions and Hamming error correction,
          test digital circuits, minimize K-Maps, and trace CPU instruction cycles.
        </p>

        {/* Segmented Control Tabs */}
        <div
          role="tablist"
          aria-label="Interactive DECO Labs"
          className="mt-5 flex flex-wrap items-center gap-1.5 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-xl w-fit max-w-full"
        >
          {LAB_TABS.map((tab) => {
            const active = activeLabId === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                type="button"
                onClick={() => onSelectLab(tab.id)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                  active
                    ? 'bg-white dark:bg-slate-900 text-accent-text shadow-xs font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>{tab.title}</span>
                <span className="ml-1.5 text-xs text-slate-400 dark:text-slate-500 font-normal hidden sm:inline">
                  {tab.unitLabel}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Lab Stage */}
      <div className="mt-6">
        {activeLabId === 'number-systems' && <NumberSystemsLab />}
        {activeLabId === 'logic-gates' && <LogicGatesLab />}
        {activeLabId === 'kmap-flipflops' && <KMapFlipFlopLab />}
        {activeLabId === 'cpu-memory' && <ComputerOrgMemoryLab />}
      </div>
    </div>
  );
};
