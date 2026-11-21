import React, { useState } from 'react';
import { StudyProgressProvider } from './context/StudyProgressContext';
import { ThemeProvider } from './context/ThemeContext';
import { ThemeBackdrop } from './components/ThemeBackdrop';
import { ThemeGalleryModal } from './components/ThemeGalleryModal';
import { TopBar } from './components/TopBar';
import { Sidebar } from './components/Sidebar';
import { UnitReaderView } from './components/UnitReaderView';
import { LabsHubView } from './components/labs/LabsHubView';
import { PracticeCenterView } from './components/practice/PracticeCenterView';
import { CheatSheetView } from './components/CheatSheetView';
import { SyllabusView } from './components/SyllabusView';
import { LabId, MainView, PracticeTab, UnitId } from './types/deco';

function DecoWorkspace() {
  const [activeView, setActiveView] = useState<MainView>('units');
  const [activeUnitId, setActiveUnitId] = useState<UnitId>('unit1');
  const [activeLabId, setActiveLabId] = useState<LabId>('number-systems');
  const [practiceTab, setPracticeTab] = useState<PracticeTab>('unit-quiz');
  const [practiceUnitFilter, setPracticeUnitFilter] = useState<UnitId | 'all'>('unit1');
  const [mockTriggerCount, setMockTriggerCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [themeModalOpen, setThemeModalOpen] = useState(false);

  const handleSelectView = (view: MainView) => {
    setActiveView(view);
    if (view !== 'units') setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectUnit = (unitId: UnitId) => {
    setActiveUnitId(unitId);
    setActiveView('units');
    setSearchQuery('');
  };

  const handleSelectLab = (labId: LabId) => {
    setActiveLabId(labId);
    setActiveView('labs');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartUnitQuiz = (unitId: UnitId) => {
    setPracticeUnitFilter(unitId);
    setPracticeTab('unit-quiz');
    setActiveView('practice');
    setSearchQuery('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartMockExam = () => {
    setPracticeTab('mock-exam');
    setActiveView('practice');
    setSearchQuery('');
    setMockTriggerCount((c) => c + 1);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearchChange = (q: string) => {
    setSearchQuery(q);
    if (q.trim() && activeView !== 'units') {
      setActiveView('units');
    }
  };

  const readerMode = searchQuery.trim()
    ? 'search'
    : activeView === 'bookmarks'
      ? 'bookmarks'
      : 'unit';

  return (
    <div className="min-h-screen text-slate-900 dark:text-slate-100 flex flex-col relative">
      <ThemeBackdrop />

      <div className="relative z-10 flex flex-col min-h-screen">
        <TopBar
          activeView={activeView}
          onSelectView={handleSelectView}
          onStartMockExam={handleStartMockExam}
          mobileMenuOpen={mobileMenuOpen}
          onToggleMobileMenu={() => setMobileMenuOpen((o) => !o)}
        />

        <div className="flex-1 max-w-[1440px] w-full mx-auto flex">
          <Sidebar
            activeView={activeView}
            activeUnitId={activeUnitId}
            activeLabId={activeLabId}
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onSelectUnit={handleSelectUnit}
            onSelectLab={handleSelectLab}
            onSelectView={handleSelectView}
            onOpenThemeStudio={() => setThemeModalOpen(true)}
            mobileOpen={mobileMenuOpen}
            onCloseMobile={() => setMobileMenuOpen(false)}
          />

          <main className="flex-1 min-w-0 px-4 sm:px-8 lg:px-10 py-8 pb-16">
            {(activeView === 'units' || activeView === 'bookmarks') && (
              <UnitReaderView
                mode={readerMode}
                activeUnitId={activeUnitId}
                searchQuery={searchQuery}
                onClearSearch={() => setSearchQuery('')}
                onSelectUnit={handleSelectUnit}
                onOpenLab={handleSelectLab}
                onStartUnitQuiz={handleStartUnitQuiz}
              />
            )}

            {activeView === 'labs' && (
              <LabsHubView activeLabId={activeLabId} onSelectLab={handleSelectLab} />
            )}

            {activeView === 'practice' && (
              <PracticeCenterView
                initialTab={practiceTab}
                initialUnitFilter={practiceUnitFilter}
                autoStartMockCounter={mockTriggerCount}
                onJumpToUnit={handleSelectUnit}
              />
            )}

            {activeView === 'cheatsheet' && <CheatSheetView />}

            {activeView === 'syllabus' && <SyllabusView onSelectUnit={handleSelectUnit} />}
          </main>
        </div>
      </div>

      <ThemeGalleryModal open={themeModalOpen} onClose={() => setThemeModalOpen(false)} />
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <StudyProgressProvider>
        <DecoWorkspace />
      </StudyProgressProvider>
    </ThemeProvider>
  );
}
