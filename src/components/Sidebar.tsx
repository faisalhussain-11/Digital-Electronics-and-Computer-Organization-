import React from 'react';
import {
  Bookmark,
  BookOpen,
  Cpu,
  FlaskConical,
  Palette,
  Search,
  X,
} from 'lucide-react';
import { ALL_TOPICS, SYLLABUS_UNITS } from '../data/syllabus';
import { APP_THEMES } from '../data/themes';
import { useStudyProgress } from '../context/StudyProgressContext';
import { useTheme } from '../context/ThemeContext';
import { LabId, MainView, UnitId } from '../types/deco';

interface SidebarProps {
  activeView: MainView;
  activeUnitId: UnitId;
  activeLabId: LabId;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectUnit: (unitId: UnitId) => void;
  onSelectLab: (labId: LabId) => void;
  onSelectView: (view: MainView) => void;
  onOpenThemeStudio: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

const LAB_LINKS: { id: LabId; label: string; unitHint: string }[] = [
  { id: 'number-systems', label: 'Number Systems & Hamming', unitHint: 'Unit I' },
  { id: 'logic-gates', label: 'Logic Gates & Adders', unitHint: 'Unit I–II' },
  { id: 'kmap-flipflops', label: 'K-Map & Flip-Flops', unitHint: 'Unit II–III' },
  { id: 'cpu-memory', label: 'CPU Cycle & Memory', unitHint: 'Unit IV–V' },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  activeUnitId,
  activeLabId,
  searchQuery,
  onSearchChange,
  onSelectUnit,
  onSelectLab,
  onSelectView,
  onOpenThemeStudio,
  mobileOpen,
  onCloseMobile,
}) => {
  const { completedTopicIds, bookmarkedTopicIds } = useStudyProgress();
  const { theme: activeTheme, setThemeId } = useTheme();
  const totalTopics = ALL_TOPICS.length;
  const completedCount = completedTopicIds.length;
  const pct = totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;

  const sidebarContent = (
    <div className="flex flex-col h-full surface-sidebar border-r border-slate-200/80 dark:border-slate-800/80 px-4 py-5 overflow-y-auto transition-colors">
      {/* Course context & Mastery */}
      <div className="px-2 pb-4 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          U24EC304 · B.E. AIML · 3 Credits
        </div>
        <div className="mt-2 flex items-baseline justify-between text-xs text-slate-600 dark:text-slate-300">
          <span className="font-medium text-slate-800 dark:text-slate-200">Syllabus Mastery</span>
          <span className="font-mono tabular-nums text-slate-600 dark:text-slate-400">
            {completedCount}/{totalTopics} ({pct}%)
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
          <div
            className="h-full bg-accent transition-transform duration-300 origin-left"
            style={{ transform: `scaleX(${pct / 100})` }}
          />
        </div>
      </div>

      {/* Quick Theme Switcher & Theme Studio Trigger */}
      <div className="mt-4 p-3 rounded-xl surface-card border border-slate-200/90 dark:border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
            <Palette className="w-3.5 h-3.5 text-accent-text" />
            <span>Theme</span>
          </span>
          <button
            type="button"
            onClick={() => {
              onOpenThemeStudio();
              onCloseMobile();
            }}
            className="text-xs font-semibold text-accent-text hover:underline cursor-pointer"
          >
            Browse All
          </button>
        </div>

        <div className="text-xs text-slate-600 dark:text-slate-300 truncate">
          {activeTheme.name} · {activeTheme.category}
        </div>

        {/* 6 quick theme preview buttons */}
        <div className="grid grid-cols-6 gap-1.5 pt-0.5">
          {APP_THEMES.map((t) => {
            const isSel = t.id === activeTheme.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setThemeId(t.id)}
                title={`${t.name} (${t.category})`}
                aria-label={`Switch to ${t.name} theme`}
                className={`h-7 rounded-md overflow-hidden border transition-all cursor-pointer ${
                  isSel
                    ? 'border-accent ring-2 ring-accent/35 scale-105'
                    : 'border-slate-300/80 dark:border-slate-700 hover:scale-105'
                }`}
                style={{ background: t.fallbackGradient }}
              >
                {t.imageUrl ? (
                  <img
                    src={t.imageUrl}
                    alt=""
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className="block w-full h-full"
                    style={{
                      background: `linear-gradient(135deg, #ffffff 55%, ${t.swatchAccent} 100%)`,
                    }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Global Search Input */}
      <div className="mt-4 relative">
        <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search topics, laws, gates..."
          aria-label="Search syllabus topics"
          className="w-full pl-9 pr-8 py-2 text-sm bg-white/95 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-accent transition-colors"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            aria-label="Clear search"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Mobile Primary Views */}
      <div className="mt-5 md:hidden">
        <div className="px-2 mb-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400">
          Workspace
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          {(['units', 'labs', 'practice', 'cheatsheet', 'syllabus'] as MainView[]).map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => {
                onSelectView(v);
                onCloseMobile();
              }}
              className={`px-3 py-2 text-xs font-medium rounded-lg text-left capitalize cursor-pointer ${
                activeView === v
                  ? 'bg-accent-soft text-accent-text border border-accent-border font-semibold'
                  : 'surface-card text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {v === 'cheatsheet' ? 'Cheat Sheet' : v}
            </button>
          ))}
        </div>
      </div>

      {/* 5 Syllabus Units */}
      <div className="mt-6">
        <div className="px-2 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Syllabus Units</span>
        </div>
        <div className="space-y-1">
          {SYLLABUS_UNITS.map((unit) => {
            const unitDone = unit.topics.filter((t) => completedTopicIds.includes(t.id)).length;
            const isSelected = activeView === 'units' && activeUnitId === unit.id && !searchQuery;
            return (
              <button
                key={unit.id}
                type="button"
                onClick={() => {
                  onSelectUnit(unit.id);
                  onCloseMobile();
                }}
                className={`w-full px-3 py-2.5 rounded-lg text-left transition-colors cursor-pointer flex items-center justify-between gap-2 ${
                  isSelected
                    ? 'surface-card text-accent-text border border-accent-border shadow-xs font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <div className="min-w-0">
                  <div className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    {unit.roman}
                  </div>
                  <div className="text-sm truncate">{unit.shortTitle}</div>
                </div>
                <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400 shrink-0">
                  {unitDone}/{unit.topics.length}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Saved Bookmarks */}
      <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <button
          type="button"
          onClick={() => {
            onSelectView('bookmarks');
            onCloseMobile();
          }}
          className={`w-full px-3 py-2.5 rounded-lg text-left text-sm transition-colors cursor-pointer flex items-center justify-between ${
            activeView === 'bookmarks'
              ? 'surface-card text-accent-text border border-accent-border font-semibold'
              : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/70 border border-transparent'
          }`}
        >
          <span className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>Saved Bookmarks</span>
          </span>
          <span className="text-xs font-mono tabular-nums text-slate-500 dark:text-slate-400">
            {bookmarkedTopicIds.length}
          </span>
        </button>
      </div>

      {/* Interactive Labs Quick Access */}
      <div className="mt-5 pt-4 border-t border-slate-200/80 dark:border-slate-800/80">
        <div className="px-2 mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Interactive Labs</span>
        </div>
        <div className="space-y-1">
          {LAB_LINKS.map((lab) => {
            const isSelected = activeView === 'labs' && activeLabId === lab.id;
            return (
              <button
                key={lab.id}
                type="button"
                onClick={() => {
                  onSelectLab(lab.id);
                  onCloseMobile();
                }}
                className={`w-full px-3 py-2 rounded-lg text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'surface-card text-accent-text border border-accent-border font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/70 border border-transparent'
                }`}
              >
                <div className="text-sm truncate">{lab.label}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{lab.unitHint}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Footer note */}
      <div className="mt-auto pt-6 px-2 text-xs text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
        <Cpu className="w-3.5 h-3.5 shrink-0" />
        <span>Progress &amp; theme saved locally</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sticky Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 sticky top-16 h-[calc(100vh-4rem)] no-print">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div
            className="fixed inset-0 bg-slate-950/45 backdrop-blur-[1px]"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <aside className="relative z-10 w-72 max-w-[85vw] h-full bg-white dark:bg-slate-950 shadow-xl">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
};
