import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { QuizAttempt } from '../types/deco';

interface PersistedProgress {
  completedTopicIds: string[];
  bookmarkedTopicIds: string[];
  masteredFlashcardIds: string[];
  quizAttempts: QuizAttempt[];
}

interface StudyProgressContextValue extends PersistedProgress {
  toggleTopicComplete: (topicId: string) => void;
  toggleTopicBookmark: (topicId: string) => void;
  setFlashcardMastered: (cardId: string, mastered: boolean) => void;
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id' | 'dateISO'>) => void;
  resetAllProgress: () => void;
}

const STORAGE_KEY = 'deco_u24ec304_progress_v1';

const EMPTY_PROGRESS: PersistedProgress = {
  completedTopicIds: [],
  bookmarkedTopicIds: [],
  masteredFlashcardIds: [],
  quizAttempts: [],
};

function loadInitialProgress(): PersistedProgress {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<PersistedProgress>;
    return {
      completedTopicIds: Array.isArray(parsed.completedTopicIds) ? parsed.completedTopicIds : [],
      bookmarkedTopicIds: Array.isArray(parsed.bookmarkedTopicIds) ? parsed.bookmarkedTopicIds : [],
      masteredFlashcardIds: Array.isArray(parsed.masteredFlashcardIds)
        ? parsed.masteredFlashcardIds
        : [],
      quizAttempts: Array.isArray(parsed.quizAttempts) ? parsed.quizAttempts : [],
    };
  } catch {
    return EMPTY_PROGRESS;
  }
}

const StudyProgressContext = createContext<StudyProgressContextValue | null>(null);

export const StudyProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [progress, setProgress] = useState<PersistedProgress>(loadInitialProgress);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      // Ignore storage quota or private-mode write errors
    }
  }, [progress]);

  const value = useMemo<StudyProgressContextValue>(
    () => ({
      ...progress,
      toggleTopicComplete: (topicId: string) => {
        setProgress((prev) => {
          const exists = prev.completedTopicIds.includes(topicId);
          return {
            ...prev,
            completedTopicIds: exists
              ? prev.completedTopicIds.filter((id) => id !== topicId)
              : [...prev.completedTopicIds, topicId],
          };
        });
      },
      toggleTopicBookmark: (topicId: string) => {
        setProgress((prev) => {
          const exists = prev.bookmarkedTopicIds.includes(topicId);
          return {
            ...prev,
            bookmarkedTopicIds: exists
              ? prev.bookmarkedTopicIds.filter((id) => id !== topicId)
              : [...prev.bookmarkedTopicIds, topicId],
          };
        });
      },
      setFlashcardMastered: (cardId: string, mastered: boolean) => {
        setProgress((prev) => {
          const exists = prev.masteredFlashcardIds.includes(cardId);
          if (mastered && !exists) {
            return { ...prev, masteredFlashcardIds: [...prev.masteredFlashcardIds, cardId] };
          }
          if (!mastered && exists) {
            return {
              ...prev,
              masteredFlashcardIds: prev.masteredFlashcardIds.filter((id) => id !== cardId),
            };
          }
          return prev;
        });
      },
      recordQuizAttempt: (attempt) => {
        const entry: QuizAttempt = {
          ...attempt,
          id: `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          dateISO: new Date().toISOString(),
        };
        setProgress((prev) => ({
          ...prev,
          quizAttempts: [entry, ...prev.quizAttempts].slice(0, 40),
        }));
      },
      resetAllProgress: () => {
        setProgress(EMPTY_PROGRESS);
      },
    }),
    [progress]
  );

  return <StudyProgressContext.Provider value={value}>{children}</StudyProgressContext.Provider>;
};

export function useStudyProgress(): StudyProgressContextValue {
  const ctx = useContext(StudyProgressContext);
  if (!ctx) {
    throw new Error('useStudyProgress must be used within StudyProgressProvider');
  }
  return ctx;
}
