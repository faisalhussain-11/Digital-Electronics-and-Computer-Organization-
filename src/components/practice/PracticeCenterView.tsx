import React, { useEffect, useMemo, useState } from 'react';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  RotateCcw,
  Shuffle,
  XCircle,
} from 'lucide-react';
import { QUIZ_QUESTIONS } from '../../data/quizzes';
import { FLASHCARDS } from '../../data/flashcards';
import { SYLLABUS_UNITS } from '../../data/syllabus';
import { useStudyProgress } from '../../context/StudyProgressContext';
import { PracticeTab, QuizQuestion, UnitId } from '../../types/deco';

interface PracticeCenterViewProps {
  initialTab: PracticeTab;
  initialUnitFilter: UnitId | 'all';
  autoStartMockCounter: number;
  onJumpToUnit: (unitId: UnitId) => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function buildBalancedMockQuestions(): QuizQuestion[] {
  const picked: QuizQuestion[] = [];
  for (const unit of SYLLABUS_UNITS) {
    const pool = shuffleArray(QUIZ_QUESTIONS.filter((q) => q.unitId === unit.id));
    picked.push(...pool.slice(0, 4));
  }
  return shuffleArray(picked);
}

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export const PracticeCenterView: React.FC<PracticeCenterViewProps> = ({
  initialTab,
  initialUnitFilter,
  autoStartMockCounter,
  onJumpToUnit,
}) => {
  const {
    masteredFlashcardIds,
    setFlashcardMastered,
    quizAttempts,
    recordQuizAttempt,
  } = useStudyProgress();

  const [activeTab, setActiveTab] = useState<PracticeTab>(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, autoStartMockCounter]);

  // =================== UNIT QUIZ STATE ===================
  const [unitFilter, setUnitFilter] = useState<UnitId | 'all'>(initialUnitFilter);
  const [unitQuestions, setUnitQuestions] = useState<QuizQuestion[]>(() =>
    shuffleArray(
      initialUnitFilter === 'all'
        ? QUIZ_QUESTIONS
        : QUIZ_QUESTIONS.filter((q) => q.unitId === initialUnitFilter)
    )
  );
  const [uqIndex, setUqIndex] = useState(0);
  const [uqSelected, setUqSelected] = useState<number | null>(null);
  const [uqScore, setUqScore] = useState(0);
  const [uqBreakdown, setUqBreakdown] = useState<
    Partial<Record<UnitId, { correct: number; total: number }>>
  >({});
  const [uqDone, setUqDone] = useState(false);

  const restartUnitQuiz = (filter: UnitId | 'all') => {
    setUnitFilter(filter);
    const pool =
      filter === 'all'
        ? QUIZ_QUESTIONS
        : QUIZ_QUESTIONS.filter((q) => q.unitId === filter);
    setUnitQuestions(shuffleArray(pool));
    setUqIndex(0);
    setUqSelected(null);
    setUqScore(0);
    setUqBreakdown({});
    setUqDone(false);
  };

  useEffect(() => {
    restartUnitQuiz(initialUnitFilter);
  }, [initialUnitFilter]);

  const handleUnitQuizSelect = (optIndex: number) => {
    if (uqSelected !== null) return;
    const q = unitQuestions[uqIndex];
    setUqSelected(optIndex);
    const isCorrect = optIndex === q.correctIndex;
    if (isCorrect) setUqScore((s) => s + 1);

    setUqBreakdown((prev) => {
      const cur = prev[q.unitId] || { correct: 0, total: 0 };
      return {
        ...prev,
        [q.unitId]: {
          correct: cur.correct + (isCorrect ? 1 : 0),
          total: cur.total + 1,
        },
      };
    });
  };

  const handleUnitQuizNext = () => {
    if (uqIndex + 1 < unitQuestions.length) {
      setUqIndex((i) => i + 1);
      setUqSelected(null);
    } else {
      setUqDone(true);
      const unitObj = SYLLABUS_UNITS.find((u) => u.id === unitFilter);
      recordQuizAttempt({
        mode: 'unit-quiz',
        label: unitObj ? `${unitObj.roman}: ${unitObj.shortTitle}` : 'All 5 Units Practice',
        unitId: unitFilter === 'all' ? undefined : unitFilter,
        score: uqScore,
        total: unitQuestions.length,
        unitBreakdown: uqBreakdown,
      });
    }
  };

  // =================== FULL MOCK EXAM STATE ===================
  const MOCK_DURATION_SEC = 20 * 60;
  const [mockPhase, setMockPhase] = useState<'ready' | 'running' | 'submitted'>('ready');
  const [mockQuestions, setMockQuestions] = useState<QuizQuestion[]>([]);
  const [mockIdx, setMockIdx] = useState(0);
  const [mockAnswers, setMockAnswers] = useState<Record<string, number>>({});
  const [mockFlags, setMockFlags] = useState<Record<string, boolean>>({});
  const [mockSecondsLeft, setMockSecondsLeft] = useState(MOCK_DURATION_SEC);
  const [mockResult, setMockResult] = useState<{
    score: number;
    total: number;
    durationSec: number;
    unitBreakdown: Partial<Record<UnitId, { correct: number; total: number }>>;
  } | null>(null);

  const startMockExam = () => {
    setMockQuestions(buildBalancedMockQuestions());
    setMockIdx(0);
    setMockAnswers({});
    setMockFlags({});
    setMockSecondsLeft(MOCK_DURATION_SEC);
    setMockResult(null);
    setMockPhase('running');
  };

  useEffect(() => {
    if (autoStartMockCounter > 0) {
      setActiveTab('mock-exam');
      startMockExam();
    }
  }, [autoStartMockCounter]);

  const submitMockExam = () => {
    if (mockPhase !== 'running') return;
    let score = 0;
    const breakdown: Partial<Record<UnitId, { correct: number; total: number }>> = {};

    mockQuestions.forEach((q) => {
      const chosen = mockAnswers[q.id];
      const correct = chosen === q.correctIndex;
      if (correct) score++;
      const cur = breakdown[q.unitId] || { correct: 0, total: 0 };
      breakdown[q.unitId] = {
        correct: cur.correct + (correct ? 1 : 0),
        total: cur.total + 1,
      };
    });

    const durationSec = Math.max(1, MOCK_DURATION_SEC - mockSecondsLeft);
    setMockResult({
      score,
      total: mockQuestions.length,
      durationSec,
      unitBreakdown: breakdown,
    });
    setMockPhase('submitted');
    recordQuizAttempt({
      mode: 'mock-exam',
      label: 'Full SEE Mock Exam (Units I–V)',
      score,
      total: mockQuestions.length,
      durationSec,
      unitBreakdown: breakdown,
    });
  };

  useEffect(() => {
    if (mockPhase !== 'running') return;
    const timer = window.setInterval(() => {
      setMockSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [mockPhase]);

  useEffect(() => {
    if (mockPhase === 'running' && mockSecondsLeft === 0) {
      submitMockExam();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mockSecondsLeft, mockPhase]);

  // =================== FLASHCARDS STATE ===================
  const [fcFilter, setFcFilter] = useState<UnitId | 'all' | 'review'>('all');
  const [fcIdx, setFcIdx] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);

  const filteredCards = useMemo(() => {
    if (fcFilter === 'all') return FLASHCARDS;
    if (fcFilter === 'review') {
      return FLASHCARDS.filter((c) => !masteredFlashcardIds.includes(c.id));
    }
    return FLASHCARDS.filter((c) => c.unitId === fcFilter);
  }, [fcFilter, masteredFlashcardIds]);

  const safeFcIdx = filteredCards.length > 0 ? Math.min(fcIdx, filteredCards.length - 1) : 0;
  const currentCard = filteredCards[safeFcIdx];

  useEffect(() => {
    if (activeTab !== 'flashcards' || filteredCards.length === 0) return;
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT')
      ) {
        return;
      }
      if (e.code === 'Space') {
        e.preventDefault();
        setFcFlipped((f) => !f);
      } else if (e.code === 'ArrowRight') {
        setFcIdx((i) => (i + 1) % filteredCards.length);
        setFcFlipped(false);
      } else if (e.code === 'ArrowLeft') {
        setFcIdx((i) => (i - 1 + filteredCards.length) % filteredCards.length);
        setFcFlipped(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeTab, filteredCards.length]);

  const currentUnitQ = unitQuestions[uqIndex];
  const currentMockQ = mockQuestions[mockIdx];

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header & Practice Suite Tabs */}
      <div className="p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-2xl">
        <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Assessment &amp; Revision Suite · 45 MCQs · 30 Flashcards
        </div>
        <h1 className="mt-1.5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          Practice &amp; Exam Preparation
        </h1>
        <p className="mt-2 text-sm sm:text-[15px] text-slate-600 dark:text-slate-300 max-w-3xl">
          Test your command of each DECO unit with instant explanations, simulate a timed 5-unit
          SEE mock exam, or drill key formulas and excitation tables with flashcards.
        </p>

        <div
          role="tablist"
          aria-label="Practice modes"
          className="mt-5 inline-flex flex-wrap items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/80 rounded-xl"
        >
          {[
            { id: 'unit-quiz' as PracticeTab, label: 'Unit Quizzes' },
            { id: 'mock-exam' as PracticeTab, label: 'Full Mock Exam' },
            { id: 'flashcards' as PracticeTab, label: 'Flashcards' },
            {
              id: 'history' as PracticeTab,
              label: `History (${quizAttempts.length})`,
            },
          ].map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={activeTab === t.id}
              type="button"
              onClick={() => setActiveTab(t.id)}
              className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                activeTab === t.id
                  ? 'bg-white dark:bg-slate-900 text-accent-text shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ================= TAB 1: UNIT QUIZZES ================= */}
      {activeTab === 'unit-quiz' && (
        <div className="mt-6 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="unit-quiz-select"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Scope:
              </label>
              <select
                id="unit-quiz-select"
                value={unitFilter}
                onChange={(e) => restartUnitQuiz(e.target.value as UnitId | 'all')}
                className="px-3 py-2 text-sm bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-accent"
              >
                <option value="all">All 5 Units (45 Questions)</option>
                {SYLLABUS_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.roman}: {u.shortTitle} (9 Questions)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => restartUnitQuiz(unitFilter)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 surface-card border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Restart &amp; Shuffle</span>
            </button>
          </div>

          {uqDone ? (
            <div className="p-8 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl text-center space-y-4">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                Quiz Completed
              </div>
              <div className="text-4xl font-mono font-bold text-accent-text tabular-nums">
                {uqScore} / {unitQuestions.length} (
                {Math.round((uqScore / Math.max(1, unitQuestions.length)) * 100)}%)
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                {uqScore / Math.max(1, unitQuestions.length) >= 0.8
                  ? 'Strong mastery of this unit. You are ready to challenge the timed full SEE mock exam.'
                  : 'Good practice run. Review the missed concepts in the unit reader and flashcards, then try again.'}
              </p>
              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <button
                  type="button"
                  onClick={() => restartUnitQuiz(unitFilter)}
                  className="px-4 py-2 text-sm font-semibold text-accent-fg bg-accent rounded-lg hover:bg-accent-hover cursor-pointer"
                >
                  Retry Quiz
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('mock-exam');
                    startMockExam();
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  Take Full Mock Exam
                </button>
              </div>
            </div>
          ) : (
            currentUnitQ && (
              <div className="p-6 sm:p-8 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-800 dark:text-slate-200 tabular-nums">
                      Question {uqIndex + 1} of {unitQuestions.length}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{currentUnitQ.topicRef}</span>
                    <span aria-hidden="true">·</span>
                    <span>{currentUnitQ.difficulty}</span>
                  </div>
                  <div className="font-mono font-semibold text-slate-700 dark:text-slate-200 tabular-nums">
                    Score: {uqScore}
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                  {currentUnitQ.question}
                </h2>

                <div className="space-y-2.5">
                  {currentUnitQ.options.map((opt, idx) => {
                    const isPicked = uqSelected === idx;
                    const isRight = idx === currentUnitQ.correctIndex;
                    const answered = uqSelected !== null;

                    let style =
                      'bg-white/90 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:border-accent hover:bg-accent-soft/40';
                    if (answered) {
                      if (isRight) {
                        style =
                          'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-950 dark:text-emerald-200 font-semibold';
                      } else if (isPicked && !isRight) {
                        style =
                          'bg-red-50 dark:bg-red-950/60 border-red-300 dark:border-red-700 text-red-950 dark:text-red-200';
                      } else {
                        style =
                          'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        disabled={answered}
                        onClick={() => handleUnitQuizSelect(idx)}
                        className={`w-full p-4 rounded-xl border text-left text-sm transition-colors flex items-center justify-between gap-3 cursor-pointer disabled:cursor-default ${style}`}
                      >
                        <span className="flex items-baseline gap-3">
                          <span className="font-mono font-semibold text-xs text-slate-500 dark:text-slate-400">
                            {String.fromCharCode(65 + idx)}.
                          </span>
                          <span>{opt}</span>
                        </span>
                        {answered && isRight && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400 shrink-0">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Correct</span>
                          </span>
                        )}
                        {answered && isPicked && !isRight && (
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-700 dark:text-red-400 shrink-0">
                            <XCircle className="w-4 h-4" />
                            <span>Incorrect</span>
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {uqSelected !== null && (
                  <div className="pt-2 space-y-4">
                    <div className="p-4 rounded-xl surface-subtle border border-slate-200 dark:border-slate-800 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <span className="font-semibold text-slate-900 dark:text-slate-100">
                        Explanation:{' '}
                      </span>
                      {currentUnitQ.explanation}
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={handleUnitQuizNext}
                        className="px-5 py-2.5 text-sm font-semibold text-accent-fg bg-accent rounded-lg hover:bg-accent-hover cursor-pointer"
                      >
                        {uqIndex + 1 < unitQuestions.length ? 'Next Question' : 'View Final Score'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )
          )}
        </div>
      )}

      {/* ================= TAB 2: FULL TIMED SEE MOCK EXAM ================= */}
      {activeTab === 'mock-exam' && (
        <div className="mt-6">
          {mockPhase === 'ready' && (
            <div className="p-8 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-5 max-w-2xl">
              <div className="text-xs font-semibold text-accent-text">
                U24EC304 Full Syllabus Simulation
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                20-Question Timed SEE Mock Exam
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Draws 4 balanced questions from each of Units I through V (20 questions total) with
                a 20-minute countdown timer. You can navigate freely between questions, flag tough
                ones for review, and receive a per-unit diagnostic breakdown on submission.
              </p>
              <div className="grid grid-cols-3 gap-3 text-xs font-mono tabular-nums pt-1">
                <div className="p-3 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div className="font-sans text-slate-500 dark:text-slate-400">Questions</div>
                  <div className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                    20 MCQs
                  </div>
                </div>
                <div className="p-3 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div className="font-sans text-slate-500 dark:text-slate-400">Duration</div>
                  <div className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                    20 min
                  </div>
                </div>
                <div className="p-3 surface-subtle border border-slate-200 dark:border-slate-800 rounded-lg">
                  <div className="font-sans text-slate-500 dark:text-slate-400">Coverage</div>
                  <div className="mt-1 text-base font-bold text-slate-900 dark:text-slate-100">
                    Units I–V
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={startMockExam}
                  className="px-5 py-2.5 text-sm font-semibold text-accent-fg bg-accent rounded-lg hover:bg-accent-hover cursor-pointer"
                >
                  Begin Timed Mock Exam
                </button>
              </div>
            </div>
          )}

          {mockPhase === 'running' && currentMockQ && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
                    <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                      Question {mockIdx + 1} / {mockQuestions.length}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span>{currentMockQ.topicRef}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setMockFlags((prev) => ({
                          ...prev,
                          [currentMockQ.id]: !prev[currentMockQ.id],
                        }))
                      }
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border cursor-pointer ${
                        mockFlags[currentMockQ.id]
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-800 dark:text-amber-300'
                          : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{mockFlags[currentMockQ.id] ? 'Flagged' : 'Flag for Review'}</span>
                    </button>

                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border font-mono text-xs font-semibold tabular-nums ${
                        mockSecondsLeft < 180
                          ? 'bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-800 text-red-800 dark:text-red-300'
                          : 'surface-subtle border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{formatTimer(mockSecondsLeft)}</span>
                    </div>
                  </div>
                </div>

                <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                  {currentMockQ.question}
                </h2>

                <div className="space-y-2.5">
                  {currentMockQ.options.map((opt, idx) => {
                    const selected = mockAnswers[currentMockQ.id] === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() =>
                          setMockAnswers((prev) => ({ ...prev, [currentMockQ.id]: idx }))
                        }
                        className={`w-full p-4 rounded-xl border text-left text-sm transition-colors flex items-baseline gap-3 cursor-pointer ${
                          selected
                            ? 'bg-accent-soft border-accent text-accent-text font-semibold'
                            : 'bg-white/90 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}
                      >
                        <span className="font-mono text-xs font-semibold text-slate-500 dark:text-slate-400">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    disabled={mockIdx === 0}
                    onClick={() => setMockIdx((i) => Math.max(0, i - 1))}
                    className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white/90 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>

                  {mockIdx + 1 < mockQuestions.length ? (
                    <button
                      type="button"
                      onClick={() => setMockIdx((i) => i + 1)}
                      className="inline-flex items-center gap-1 px-4 py-2 text-sm font-semibold text-accent-fg bg-accent rounded-lg hover:bg-accent-hover cursor-pointer"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={submitMockExam}
                      className="px-5 py-2 text-sm font-semibold text-white bg-emerald-700 rounded-lg hover:bg-emerald-800 cursor-pointer"
                    >
                      Submit Mock Exam
                    </button>
                  )}
                </div>
              </div>

              <div className="lg:col-span-4 p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    Question Palette
                  </span>
                  <span className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                    {Object.keys(mockAnswers).length}/{mockQuestions.length} answered
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-2 font-mono text-xs tabular-nums">
                  {mockQuestions.map((q, idx) => {
                    const answered = mockAnswers[q.id] !== undefined;
                    const flagged = Boolean(mockFlags[q.id]);
                    const isCur = idx === mockIdx;
                    return (
                      <button
                        key={q.id}
                        type="button"
                        onClick={() => setMockIdx(idx)}
                        className={`h-10 rounded-lg border font-semibold transition-colors cursor-pointer ${
                          isCur
                            ? 'bg-accent border-accent text-accent-fg'
                            : flagged
                              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                              : answered
                                ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                                : 'bg-white/90 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                  Accent: Current · Green: Answered · Amber: Flagged
                </div>

                <button
                  type="button"
                  onClick={submitMockExam}
                  className="w-full py-2.5 text-sm font-semibold text-white bg-slate-900 dark:bg-slate-100 dark:text-slate-900 rounded-lg hover:bg-slate-800 dark:hover:bg-white cursor-pointer"
                >
                  Submit &amp; Grade Exam
                </button>
              </div>
            </div>
          )}

          {mockPhase === 'submitted' && mockResult && (
            <div className="space-y-6">
              <div className="p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      Full Mock Exam Report
                    </div>
                    <h2 className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                      Score: {mockResult.score} / {mockResult.total} (
                      {Math.round((mockResult.score / mockResult.total) * 100)}%)
                    </h2>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                      Time taken: {formatTimer(mockResult.durationSec)}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={startMockExam}
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-accent-fg bg-accent rounded-lg hover:bg-accent-hover cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>New Mock Exam</span>
                  </button>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">
                    Unit-Wise Performance Breakdown
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                    {SYLLABUS_UNITS.map((unit) => {
                      const stats = mockResult.unitBreakdown[unit.id] || { correct: 0, total: 0 };
                      const pct =
                        stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                      const needsWork = pct < 75;
                      return (
                        <div
                          key={unit.id}
                          className={`p-3.5 rounded-xl border ${
                            needsWork
                              ? 'bg-amber-50/70 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800'
                              : 'bg-emerald-50/60 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800'
                          }`}
                        >
                          <div className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                            {unit.roman}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {unit.shortTitle}
                          </div>
                          <div className="mt-2 font-mono text-lg font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                            {stats.correct}/{stats.total}
                          </div>
                          <button
                            type="button"
                            onClick={() => onJumpToUnit(unit.id)}
                            className="mt-1.5 text-xs font-semibold text-accent-text hover:underline cursor-pointer"
                          >
                            {needsWork ? 'Review weak unit' : 'Open unit notes'}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                  Complete Solution Review
                </h3>
                {mockQuestions.map((q, idx) => {
                  const picked = mockAnswers[q.id];
                  const isCorrect = picked === q.correctIndex;
                  return (
                    <div
                      key={q.id}
                      className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-2.5"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <span className="font-mono text-slate-500 dark:text-slate-400">
                          Q{idx + 1} · {q.topicRef}
                        </span>
                        <span
                          className={`font-semibold ${
                            isCorrect
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-red-700 dark:text-red-400'
                          }`}
                        >
                          {isCorrect
                            ? 'Correct'
                            : picked === undefined
                              ? 'Unanswered'
                              : 'Incorrect'}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {q.question}
                      </p>
                      <div className="text-xs space-y-1">
                        {picked !== undefined && !isCorrect && (
                          <div className="text-red-700 dark:text-red-400">
                            Your answer: {q.options[picked]}
                          </div>
                        )}
                        <div className="text-emerald-800 dark:text-emerald-300 font-medium">
                          Correct answer: {q.options[q.correctIndex]}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300 pt-1.5 border-t border-slate-100 dark:border-slate-800 leading-relaxed">
                        {q.explanation}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: REVISION FLASHCARDS ================= */}
      {activeTab === 'flashcards' && (
        <div className="mt-6 space-y-6 max-w-3xl">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <label
                htmlFor="fc-filter"
                className="text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Deck Filter:
              </label>
              <select
                id="fc-filter"
                value={fcFilter}
                onChange={(e) => {
                  setFcFilter(e.target.value as UnitId | 'all' | 'review');
                  setFcIdx(0);
                  setFcFlipped(false);
                }}
                className="px-3 py-2 text-sm bg-white/95 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:border-accent"
              >
                <option value="all">All 5 Units ({FLASHCARDS.length} Cards)</option>
                <option value="review">
                  Needs Review Only ({FLASHCARDS.length - masteredFlashcardIds.length} Left)
                </option>
                {SYLLABUS_UNITS.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.roman}: {u.shortTitle}
                  </option>
                ))}
              </select>
            </div>

            <div className="text-xs font-mono text-slate-600 dark:text-slate-300 tabular-nums">
              Mastered: {masteredFlashcardIds.length}/{FLASHCARDS.length}
            </div>
          </div>

          {!currentCard ? (
            <div className="p-10 surface-card border border-slate-200 dark:border-slate-800 rounded-xl text-center space-y-3">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                All flashcards in this filter are mastered
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Switch back to &ldquo;All 5 Units&rdquo; to continue reviewing the complete deck.
              </p>
              <button
                type="button"
                onClick={() => setFcFilter('all')}
                className="px-4 py-2 text-sm font-semibold text-accent-fg bg-accent rounded-lg cursor-pointer"
              >
                Show All Cards
              </button>
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setFcFlipped((f) => !f)}
                className="w-full min-h-[260px] p-8 surface-card border border-slate-200/90 dark:border-slate-800 rounded-2xl text-left flex flex-col justify-between hover:border-accent-border transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 w-full">
                  <span>
                    {currentCard.topicRef} · Card {safeFcIdx + 1} of {filteredCards.length}
                  </span>
                  <span className="font-semibold text-accent-text">
                    {fcFlipped ? 'Answer Side' : 'Prompt Side (Click or Space to Flip)'}
                  </span>
                </div>

                <div className="my-6">
                  {fcFlipped ? (
                    <div className="font-mono text-sm sm:text-base text-slate-900 dark:text-slate-100 whitespace-pre-wrap leading-relaxed">
                      {currentCard.back}
                    </div>
                  ) : (
                    <div className="text-lg sm:text-xl font-semibold text-slate-900 dark:text-slate-100 leading-snug">
                      {currentCard.front}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 dark:text-slate-500 w-full">
                  <span>
                    {!fcFlipped && currentCard.hint
                      ? `Hint: ${currentCard.hint}`
                      : 'Keyboard: Space = flip, ← / → = navigate'}
                  </span>
                  <span className="font-medium text-slate-600 dark:text-slate-300">
                    {masteredFlashcardIds.includes(currentCard.id) ? 'Mastered' : 'Needs Review'}
                  </span>
                </div>
              </button>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFcIdx((i) => (i - 1 + filteredCards.length) % filteredCards.length);
                      setFcFlipped(false);
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium surface-card border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFcIdx((i) => (i + 1) % filteredCards.length);
                      setFcFlipped(false);
                    }}
                    className="inline-flex items-center gap-1 px-3.5 py-2 text-sm font-medium surface-card border border-slate-200 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setFlashcardMastered(currentCard.id, false)}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                      !masteredFlashcardIds.includes(currentCard.id)
                        ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200'
                        : 'surface-card border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    Needs Review
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setFlashcardMastered(currentCard.id, true);
                      if (safeFcIdx + 1 < filteredCards.length) {
                        setFcIdx((i) => i + 1);
                        setFcFlipped(false);
                      }
                    }}
                    className={`px-3.5 py-2 text-xs font-semibold rounded-lg border cursor-pointer ${
                      masteredFlashcardIds.includes(currentCard.id)
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200'
                        : 'bg-accent border-accent text-accent-fg hover:bg-accent-hover'
                    }`}
                  >
                    Mark Mastered
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ================= TAB 4: ATTEMPT HISTORY ================= */}
      {activeTab === 'history' && (
        <div className="mt-6">
          {quizAttempts.length === 0 ? (
            <div className="p-10 surface-card border border-slate-200 dark:border-slate-800 rounded-xl text-center">
              <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                No quiz attempts recorded yet
              </h2>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-300">
                Complete a Unit Quiz or Full Mock Exam to track your accuracy over time.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl">
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className="surface-subtle border-b border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    <th className="px-4 py-3">Assessment</th>
                    <th className="px-4 py-3">Mode</th>
                    <th className="px-4 py-3">Score</th>
                    <th className="px-4 py-3">Accuracy</th>
                    <th className="px-4 py-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {quizAttempts.map((att) => {
                    const pct = Math.round((att.score / Math.max(1, att.total)) * 100);
                    return (
                      <tr
                        key={att.id}
                        className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                      >
                        <td className="px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                          {att.label}
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-600 dark:text-slate-400">
                          {att.mode === 'mock-exam' ? 'Timed Mock' : 'Unit Quiz'}
                        </td>
                        <td className="px-4 py-3 font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                          {att.score}/{att.total}
                        </td>
                        <td
                          className={`px-4 py-3 font-mono font-semibold tabular-nums ${
                            pct >= 80
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : pct >= 50
                                ? 'text-accent-text'
                                : 'text-red-700 dark:text-red-400'
                          }`}
                        >
                          {pct}%
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums">
                          {new Date(att.dateISO).toLocaleDateString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
