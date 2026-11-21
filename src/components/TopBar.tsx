import React from 'react';
import { Menu, X } from 'lucide-react';
import { MainView } from '../types/deco';

interface TopBarProps {
  activeView: MainView;
  onSelectView: (view: MainView) => void;
  onStartMockExam: () => void;
  mobileMenuOpen: boolean;
  onToggleMobileMenu: () => void;
}

const NAV_ITEMS: { id: MainView; label: string }[] = [
  { id: 'units', label: 'Units' },
  { id: 'labs', label: 'Labs' },
  { id: 'practice', label: 'Practice' },
  { id: 'cheatsheet', label: 'Cheat Sheet' },
  { id: 'syllabus', label: 'Syllabus' },
];

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  onSelectView,
  onStartMockExam,
  mobileMenuOpen,
  onToggleMobileMenu,
}) => {
  return (
    <header className="sticky top-0 z-30 h-16 surface-header border-b border-slate-200/80 dark:border-slate-800/80 no-print transition-colors">
      <div className="max-w-[1440px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onToggleMobileMenu}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="lg:hidden inline-flex items-center justify-center w-10 h-10 -ml-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-accent"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => onSelectView('units')}
            className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap shrink-0 hover:text-accent-text transition-colors cursor-pointer"
          >
            DECO Reader
          </button>
        </div>

        {/* Zone 2: 5 Concise Single-Line Navigation Links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          {NAV_ITEMS.map((item) => {
            const isActive =
              activeView === item.id || (activeView === 'bookmarks' && item.id === 'units');
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectView(item.id)}
                className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  isActive
                    ? 'text-accent-text'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-[21px] h-0.5 bg-accent"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center shrink-0">
          <button
            type="button"
            onClick={onStartMockExam}
            className="px-4 py-2 text-sm font-semibold text-accent-fg bg-accent rounded-lg hover:bg-accent-hover transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            Start Mock Exam
          </button>
        </div>
      </div>
    </header>
  );
};
