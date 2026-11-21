export type UnitId = 'unit1' | 'unit2' | 'unit3' | 'unit4' | 'unit5';

export type LabId = 'number-systems' | 'logic-gates' | 'kmap-flipflops' | 'cpu-memory';

export type MainView =
  | 'units'
  | 'labs'
  | 'practice'
  | 'cheatsheet'
  | 'syllabus'
  | 'bookmarks';

export type PracticeTab = 'unit-quiz' | 'mock-exam' | 'flashcards' | 'history';

export interface TopicTable {
  caption: string;
  headers: string[];
  rows: string[][];
}

export interface Topic {
  id: string;
  unitId: UnitId;
  number: string;
  title: string;
  summary: string;
  keyPoints: string[];
  formulas?: string[];
  table?: TopicTable;
  workedExample: {
    problem: string;
    solution: string[];
  };
  examTip: string;
  relatedLab?: {
    labId: LabId;
    label: string;
  };
}

export interface SyllabusUnit {
  id: UnitId;
  roman: string;
  shortTitle: string;
  title: string;
  courseOutcome: string;
  syllabusExcerpt: string;
  topics: Topic[];
}

export interface QuizQuestion {
  id: string;
  unitId: UnitId;
  topicRef: string;
  difficulty: 'Foundational' | 'Applied' | 'Exam Level';
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
  explanation: string;
}

export interface Flashcard {
  id: string;
  unitId: UnitId;
  topicRef: string;
  front: string;
  back: string;
  hint?: string;
}

export interface QuizAttempt {
  id: string;
  mode: 'unit-quiz' | 'mock-exam';
  label: string;
  unitId?: UnitId;
  score: number;
  total: number;
  dateISO: string;
  durationSec?: number;
  unitBreakdown: Partial<Record<UnitId, { correct: number; total: number }>>;
}

export interface Textbook {
  index: number;
  category: 'Textbook' | 'Suggested Reading';
  authors: string;
  title: string;
  publication: string;
}

export interface CourseMetadata {
  institution: string;
  curriculum: string;
  courseCode: string;
  courseTitle: string;
  category: string;
  credits: number;
  cieMarks: number;
  seeMarks: number;
  contactHours: { L: number; T: number; D: number; P: number };
  objectives: string[];
  outcomes: string[];
  textbooks: Textbook[];
}
