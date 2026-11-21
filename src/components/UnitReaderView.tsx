import React, { useState } from 'react';
import {
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  HelpCircle,
  Search,
} from 'lucide-react';
import { ALL_TOPICS, SYLLABUS_UNITS } from '../data/syllabus';
import { useStudyProgress } from '../context/StudyProgressContext';
import { LabId, Topic, UnitId } from '../types/deco';

interface UnitReaderViewProps {
  mode: 'unit' | 'search' | 'bookmarks';
  activeUnitId: UnitId;
  searchQuery: string;
  onClearSearch: () => void;
  onSelectUnit: (unitId: UnitId) => void;
  onOpenLab: (labId: LabId) => void;
  onStartUnitQuiz: (unitId: UnitId) => void;
}

export const UnitReaderView: React.FC<UnitReaderViewProps> = ({
  mode,
  activeUnitId,
  searchQuery,
  onClearSearch,
  onSelectUnit,
  onOpenLab,
  onStartUnitQuiz,
}) => {
  const {
    completedTopicIds,
    bookmarkedTopicIds,
    toggleTopicComplete,
    toggleTopicBookmark,
  } = useStudyProgress();

  const unit = SYLLABUS_UNITS.find((u) => u.id === activeUnitId) ?? SYLLABUS_UNITS[0];

  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    [SYLLABUS_UNITS[0].topics[0].id]: true,
  });

  const toggleExpand = (topicId: string) => {
    setExpandedIds((prev) => ({ ...prev, [topicId]: !prev[topicId] }));
  };

  const expandAll = (topics: Topic[], open: boolean) => {
    const next: Record<string, boolean> = {};
    topics.forEach((t) => {
      next[t.id] = open;
    });
    setExpandedIds((prev) => ({ ...prev, ...next }));
  };

  let displayedTopics: Topic[] = unit.topics;
  if (mode === 'search') {
    const q = searchQuery.trim().toLowerCase();
    displayedTopics = ALL_TOPICS.filter((t) => {
      const hay = [
        t.number,
        t.title,
        t.summary,
        t.keyPoints.join(' '),
        (t.formulas || []).join(' '),
        t.examTip,
        t.workedExample.problem,
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(q);
    });
  } else if (mode === 'bookmarks') {
    displayedTopics = ALL_TOPICS.filter((t) => bookmarkedTopicIds.includes(t.id));
  }

  const unitDoneCount = unit.topics.filter((t) => completedTopicIds.includes(t.id)).length;
  const unitIndex = SYLLABUS_UNITS.findIndex((u) => u.id === unit.id);
  const prevUnit = unitIndex > 0 ? SYLLABUS_UNITS[unitIndex - 1] : null;
  const nextUnit = unitIndex < SYLLABUS_UNITS.length - 1 ? SYLLABUS_UNITS[unitIndex + 1] : null;

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header Region */}
      {mode === 'unit' && (
        <section className="p-6 sm:p-7 surface-card border border-slate-200/90 dark:border-slate-800 rounded-2xl">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <span className="text-accent-text font-semibold">{unit.roman}</span>
            <span aria-hidden="true">·</span>
            <span className="tabular-nums">
              {unitDoneCount} of {unit.topics.length} completed
            </span>
            <span aria-hidden="true">·</span>
            <span>U24EC304</span>
          </div>

          <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            {unit.title}
          </h1>

          <p className="mt-3 text-[15px] leading-relaxed text-slate-600 dark:text-slate-300 max-w-3xl">
            {unit.syllabusExcerpt}
          </p>

          <p className="mt-3 text-sm text-slate-800 dark:text-slate-200 font-medium">
            {unit.courseOutcome}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => onStartUnitQuiz(unit.id)}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-accent-fg bg-accent rounded-lg hover:bg-accent-hover transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Practice {unit.roman} Quiz</span>
            </button>
            <button
              type="button"
              onClick={() => expandAll(unit.topics, true)}
              className="px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Expand All
            </button>
            <button
              type="button"
              onClick={() => expandAll(unit.topics, false)}
              className="px-3.5 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Collapse All
            </button>
          </div>
        </section>
      )}

      {mode === 'search' && (
        <section className="p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-2xl">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Global Syllabus Search
          </div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Results for &ldquo;{searchQuery}&rdquo;
          </h1>
          <div className="mt-2 flex items-center justify-between gap-4">
            <p className="text-sm text-slate-600 dark:text-slate-300 tabular-nums">
              {displayedTopics.length} matching topic{displayedTopics.length === 1 ? '' : 's'} across
              all 5 units
            </p>
            <button
              type="button"
              onClick={onClearSearch}
              className="text-sm font-medium text-accent-text hover:underline cursor-pointer"
            >
              Clear search
            </button>
          </div>
        </section>
      )}

      {mode === 'bookmarks' && (
        <section className="p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-2xl">
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400">Revision List</div>
          <h1 className="mt-1.5 text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
            Saved Bookmarks
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Topics you flagged for focused review before CIE or SEE exams.
          </p>
        </section>
      )}

      {/* Empty States */}
      {displayedTopics.length === 0 ? (
        <div className="mt-8 py-14 px-6 border border-slate-200 dark:border-slate-800 rounded-xl surface-card text-center">
          <div className="inline-flex items-center justify-center w-11 h-11 rounded-full surface-subtle border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 mb-3">
            {mode === 'bookmarks' ? <Bookmark className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            {mode === 'bookmarks' ? 'No bookmarked topics yet' : 'No topics matched your search'}
          </h2>
          <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
            {mode === 'bookmarks'
              ? 'Click "Save" on any unit topic while studying to keep a personalized revision list here.'
              : 'Try searching for terms like Hamming, K-Map, Flip-Flop, DMA, Cache, or Virtual Memory.'}
          </p>
          {mode === 'search' && (
            <button
              type="button"
              onClick={onClearSearch}
              className="mt-4 px-4 py-2 text-sm font-semibold text-accent-fg bg-accent rounded-lg hover:bg-accent-hover cursor-pointer"
            >
              Return to {unit.roman}
            </button>
          )}
        </div>
      ) : (
        <div className="mt-6 space-y-5">
          {displayedTopics.map((topic, idx) => {
            const isOpen =
              mode !== 'unit'
                ? expandedIds[topic.id] !== false
                : expandedIds[topic.id] ?? idx === 0;
            const isCompleted = completedTopicIds.includes(topic.id);
            const isBookmarked = bookmarkedTopicIds.includes(topic.id);
            const parentUnit = SYLLABUS_UNITS.find((u) => u.id === topic.unitId);

            return (
              <article
                key={topic.id}
                className="surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl transition-colors"
              >
                {/* Topic Header */}
                <div className="p-5 sm:px-6 flex items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => toggleExpand(topic.id)}
                    className="flex-1 text-left cursor-pointer group focus-visible:outline-2 focus-visible:outline-accent rounded"
                  >
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                        {topic.number}
                      </span>
                      {mode !== 'unit' && parentUnit && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{parentUnit.roman}</span>
                        </>
                      )}
                      {isCompleted && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-medium">
                            Completed
                          </span>
                        </>
                      )}
                      {isBookmarked && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="text-amber-700 dark:text-amber-400 font-medium">
                            Saved
                          </span>
                        </>
                      )}
                    </div>
                    <h2 className="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100 group-hover:text-accent-text transition-colors">
                      {topic.title}
                    </h2>
                  </button>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => toggleTopicBookmark(topic.id)}
                      aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark topic'}
                      title={isBookmarked ? 'Remove bookmark' : 'Save for revision'}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300'
                          : 'bg-white/80 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-3.5 h-3.5" />
                      ) : (
                        <Bookmark className="w-3.5 h-3.5" />
                      )}
                      <span className="hidden sm:inline">{isBookmarked ? 'Saved' : 'Save'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleTopicComplete(topic.id)}
                      aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                        isCompleted
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                          : 'bg-white/80 dark:bg-slate-900/70 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isCompleted ? 'Done' : 'Mark Done'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => toggleExpand(topic.id)}
                      aria-label={isOpen ? 'Collapse topic' : 'Expand topic'}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
                    >
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Topic Body */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-4 border-t border-slate-100 dark:border-slate-800/80 space-y-6">
                    <div>
                      <p className="text-[15px] leading-relaxed text-slate-700 dark:text-slate-300">
                        {topic.summary}
                      </p>
                      <ul className="mt-4 space-y-2.5">
                        {topic.keyPoints.map((pt, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-[15px] leading-relaxed text-slate-700 dark:text-slate-300"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/60 shrink-0"
                            />
                            <span>{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {topic.formulas && topic.formulas.length > 0 && (
                      <div>
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                          Key Formulas &amp; Equations
                        </h3>
                        <div className="surface-subtle border border-slate-200/90 dark:border-slate-800 rounded-lg p-4 space-y-1.5 font-mono text-sm text-slate-800 dark:text-slate-100 overflow-x-auto">
                          {topic.formulas.map((f, i) => (
                            <div key={i} className="whitespace-pre">
                              {f}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {topic.table && (
                      <div>
                        <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                          {topic.table.caption}
                        </h3>
                        <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-lg">
                          <table className="w-full text-sm text-left border-collapse">
                            <thead>
                              <tr className="surface-subtle border-b border-slate-200 dark:border-slate-800">
                                {topic.table.headers.map((h, i) => (
                                  <th
                                    key={i}
                                    className="px-3.5 py-2.5 font-semibold text-slate-700 dark:text-slate-200 whitespace-nowrap"
                                  >
                                    {h}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 font-mono text-xs sm:text-sm tabular-nums">
                              {topic.table.rows.map((row, rIdx) => (
                                <tr
                                  key={rIdx}
                                  className="hover:bg-slate-50/70 dark:hover:bg-slate-800/50"
                                >
                                  {row.map((cell, cIdx) => (
                                    <td
                                      key={cIdx}
                                      className={`px-3.5 py-2 text-slate-700 dark:text-slate-300 ${
                                        cIdx === 0
                                          ? 'font-medium text-slate-900 dark:text-slate-100'
                                          : ''
                                      }`}
                                    >
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
                      <h3 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1.5">
                        Worked Example
                      </h3>
                      <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                        {topic.workedExample.problem}
                      </p>
                      <ol className="mt-2.5 space-y-1.5 list-decimal list-inside text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {topic.workedExample.solution.map((step, i) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-lg surface-subtle border border-slate-200/90 dark:border-slate-800">
                      <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          Exam Tip:{' '}
                        </span>
                        {topic.examTip}
                      </div>
                      {topic.relatedLab && (
                        <button
                          type="button"
                          onClick={() => onOpenLab(topic.relatedLab!.labId)}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-accent-text bg-white/90 dark:bg-slate-900/90 border border-accent-border rounded-lg hover:bg-accent-soft transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                        >
                          <FlaskConical className="w-3.5 h-3.5" />
                          <span>{topic.relatedLab.label}</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Next / Previous Unit Footer Navigation */}
      {mode === 'unit' && (
        <div className="mt-10 pt-6 border-t border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4">
          {prevUnit ? (
            <button
              type="button"
              onClick={() => {
                onSelectUnit(prevUnit.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 surface-card border border-slate-200 dark:border-slate-800 rounded-lg hover:border-accent-border transition-colors cursor-pointer"
            >
              Previous: {prevUnit.roman} ({prevUnit.shortTitle})
            </button>
          ) : (
            <div />
          )}

          {nextUnit && (
            <button
              type="button"
              onClick={() => {
                onSelectUnit(nextUnit.id);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-accent-text surface-card border border-accent-border rounded-lg hover:bg-accent-soft transition-colors cursor-pointer"
            >
              <span>
                Next: {nextUnit.roman} ({nextUnit.shortTitle})
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
