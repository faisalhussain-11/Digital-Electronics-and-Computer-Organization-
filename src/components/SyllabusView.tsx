import React, { useState } from 'react';
import { BookOpen, RotateCcw } from 'lucide-react';
import { COURSE_META, SYLLABUS_UNITS } from '../data/syllabus';
import { useStudyProgress } from '../context/StudyProgressContext';
import { UnitId } from '../types/deco';

interface SyllabusViewProps {
  onSelectUnit: (unitId: UnitId) => void;
}

export const SyllabusView: React.FC<SyllabusViewProps> = ({ onSelectUnit }) => {
  const { resetAllProgress } = useStudyProgress();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Official Course Header */}
      <section className="p-6 surface-card border border-slate-200/90 dark:border-slate-800 rounded-2xl">
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
          <span>{COURSE_META.institution}</span>
          <span aria-hidden="true">·</span>
          <span>{COURSE_META.curriculum}</span>
        </div>
        <h1 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
          {COURSE_META.courseCode} — {COURSE_META.courseTitle}
        </h1>

        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono tabular-nums">
          <div className="p-3.5 surface-subtle border border-slate-200/90 dark:border-slate-800 rounded-lg">
            <div className="font-sans text-slate-500 dark:text-slate-400">Category / Credits</div>
            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
              {COURSE_META.category} · {COURSE_META.credits} Credits
            </div>
          </div>
          <div className="p-3.5 surface-subtle border border-slate-200/90 dark:border-slate-800 rounded-lg">
            <div className="font-sans text-slate-500 dark:text-slate-400">Contact Hours (L-T-D-P)</div>
            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">
              {COURSE_META.contactHours.L}-{COURSE_META.contactHours.T}-{COURSE_META.contactHours.D}-
              {COURSE_META.contactHours.P}
            </div>
          </div>
          <div className="p-3.5 surface-subtle border border-slate-200/90 dark:border-slate-800 rounded-lg">
            <div className="font-sans text-slate-500 dark:text-slate-400">CIE Marks</div>
            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{COURSE_META.cieMarks}</div>
          </div>
          <div className="p-3.5 surface-subtle border border-slate-200/90 dark:border-slate-800 rounded-lg">
            <div className="font-sans text-slate-500 dark:text-slate-400">SEE Marks</div>
            <div className="mt-1 text-sm font-bold text-slate-900 dark:text-slate-100">{COURSE_META.seeMarks}</div>
          </div>
        </div>
      </section>

      {/* Course Objectives & Outcomes */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Course Objectives</h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {COURSE_META.objectives.map((obj, idx) => (
              <li key={idx}>{obj}</li>
            ))}
          </ol>
        </div>

        <div className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl space-y-3">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Course Outcomes</h2>
          <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            {COURSE_META.outcomes.map((co, idx) => (
              <li key={idx}>{co}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 5-Unit Official Breakdown */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">5-Unit Syllabus Overview</h2>
        <div className="divide-y divide-slate-200 dark:divide-slate-800 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl overflow-hidden">
          {SYLLABUS_UNITS.map((unit) => (
            <div
              key={unit.id}
              className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="text-xs font-semibold text-accent-text">
                  {unit.roman} · {unit.topics.length} study modules
                </div>
                <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{unit.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {unit.syllabusExcerpt}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onSelectUnit(unit.id)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-accent-text bg-white/90 dark:bg-slate-900/90 border border-accent-border rounded-lg hover:bg-accent-soft whitespace-nowrap shrink-0 cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Study {unit.roman}</span>
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Textbooks & Suggested Reading */}
      <section className="space-y-3">
        <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          Prescribed Textbooks &amp; Suggested Reading
        </h2>
        <div className="surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl divide-y divide-slate-100 dark:divide-slate-800">
          {COURSE_META.textbooks.map((book) => (
            <div key={book.index} className="p-4 sm:px-5 flex items-start gap-4 text-sm">
              <span className="font-mono text-xs font-semibold text-slate-400 dark:text-slate-500 mt-0.5 tabular-nums">
                0{book.index}
              </span>
              <div>
                <div className="font-semibold text-slate-900 dark:text-slate-100">{book.title}</div>
                <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                  {book.authors} · {book.publication} ·{' '}
                  <span className="text-slate-500 dark:text-slate-400">{book.category}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Local Progress Management */}
      <section className="p-5 surface-card border border-slate-200/90 dark:border-slate-800 rounded-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            Study Data &amp; Progress
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
            Your completed topics, bookmarks, flashcard progress, and quiz scores are stored locally
            on this device.
          </p>
        </div>

        {!confirmReset ? (
          <button
            type="button"
            onClick={() => setConfirmReset(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-red-700 dark:text-red-300 bg-white/90 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/70 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Study Progress</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-red-800 dark:text-red-300">
              Clear all local progress?
            </span>
            <button
              type="button"
              onClick={() => {
                resetAllProgress();
                setConfirmReset(false);
              }}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-red-700 rounded-lg hover:bg-red-800 cursor-pointer"
            >
              Confirm Reset
            </button>
            <button
              type="button"
              onClick={() => setConfirmReset(false)}
              className="px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            >
              Cancel
            </button>
          </div>
        )}
      </section>
    </div>
  );
};
