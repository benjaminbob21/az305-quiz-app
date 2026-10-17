"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import rawQuestions from "@/data/questions.json";

// =========================================================================
// TypeScript Interfaces aligned with questions.json schema
// =========================================================================
export interface SubQuestion {
  prompt?: string;
  context?: string;
  question?: string;
  correctAnswer?: string;
  options?: string[];
  explanation?: string;
}

export interface StatementItem {
  statement: string;
  correctAnswer: "Yes" | "No" | string;
  explanation?: string;
}

export interface MappingItem {
  component?: string;
  field?: string;
  selectedOption: string;
  options: string[];
}

export interface PairItem {
  requirement: string;
  answer: string;
}

export interface SolutionItem {
  part: number;
  proposedSolution: string;
  question: string;
  options?: string[];
  correctAnswer: string;
  correctIndex?: number;
  explanation: string;
}

export interface CaseStudyQuestion {
  id?: number;
  questionNumber?: number;
  question: string;
  options?: string[];
  correctAnswer?: string;
  correctAnswers?: string[];
  explanation?: string;
  wrongOptionsExplanation?: Record<string, string>;
  questionType?: string;
  statements?: StatementItem[];
  mapping?: MappingItem[];
  pairs?: PairItem[];
  subQuestions?: SubQuestion[];
}

export interface CaseStudySection {
  id?: string;
  title: string;
  content: string;
}

export interface Question {
  id: number;
  domain: string;
  subdomain?: string;
  topic?: string;
  questionType: string;
  question?: string;
  scenario?: string;
  note?: string;
  options?: string[];
  correctAnswer?: string | string[];
  correctAnswers?: string[];
  explanation?: string;
  reference?: string;
  references?: string[];
  contextTable?: Record<string, string>[];
  statements?: StatementItem[];
  mapping?: MappingItem[];
  pairs?: PairItem[];
  availableOptions?: string[];
  distractors?: string[];
  subQuestions?: SubQuestion[];
  correctOrder?: string[];
  correctPipeline?: string[];
  pipeline?: { step: string; name: string }[];
  solutions?: SolutionItem[];
  sections?: CaseStudySection[];
  questions?: CaseStudyQuestion[];
  wrongOptionsExplanation?: Record<string, string>;
  caseStudyTitle?: string;
}

// 4 Official Microsoft AZ-305 Domains
const OBJECTIVES = [
  "Design identity, governance, and monitoring solutions",
  "Design data storage solutions",
  "Design business continuity solutions",
  "Design infrastructure solutions",
];

// Difficulty mapping for MeasureUp-aligned 163 questions:
// Expert (9): Case studies, complex multi-step ordering & deep evaluation series
const EXPERT_IDS = new Set([63, 103, 74, 79, 13, 21, 34, 50, 71]);
// Easy Beginner (25): Fundamental single-concept questions
const BEGINNER_IDS = new Set([
  1, 3, 6, 9, 10, 14, 15, 18, 20, 22, 23, 26, 27, 31, 33, 35, 38, 40, 44, 47, 49, 53, 55, 58, 64,
]);

function getQuestionDifficulty(id: number): "Easy" | "Moderate" | "Expert" {
  if (EXPERT_IDS.has(id)) return "Expert";
  if (BEGINNER_IDS.has(id)) return "Easy";
  return "Moderate";
}

// Normalize domain names for consistent filtering
function normalizeDomain(domain: string): string {
  const d = domain.trim().toLowerCase();
  if (d.includes("identity") || d.includes("governance") || d.includes("monitoring")) {
    return "Design identity, governance, and monitoring solutions";
  }
  if (d.includes("data storage") || d.includes("non-relational")) {
    return "Design data storage solutions";
  }
  if (d.includes("business continuity")) {
    return "Design business continuity solutions";
  }
  if (d.includes("infrastructure")) {
    return "Design infrastructure solutions";
  }
  return domain;
}

// =========================================================================
// Formatted Content Component: Identifies CLI Commands, JSON & Code
// =========================================================================
function FormattedQuestionText({ text }: { text?: string }) {
  if (!text) return null;

  // Split on double newlines to separate paragraphs
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  return (
    <div className="space-y-4 mb-6">
      {paragraphs.map((p, idx) => {
        // Detect CLI Command: starts with az, Get-, Set-, New-, kubectl, docker, curl
        const isCli = /^(az\s+[a-z]+|Get-[A-Za-z]+|Set-[A-Za-z]+|New-[A-Za-z]+|kubectl|docker|curl)/i.test(p);

        // Detect JSON block: starts with [ or { and contains property quotes or braces
        const isJson = /^[\[\{]/.test(p) && (p.includes('"') || p.includes(':'));

        // Detect SQL query
        const isSql = /^(SELECT|CREATE|ALTER|INSERT)\s+/i.test(p);

        if (isCli) {
          return (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-lg my-3"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="ml-2 font-semibold text-slate-300">Azure CLI Terminal</span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-semibold">
                  Bash / Shell
                </span>
              </div>
              <div className="p-4 overflow-x-auto text-xs font-mono text-emerald-300 flex items-start gap-2.5 bg-slate-950">
                <span className="text-slate-500 select-none font-bold">$</span>
                <span className="whitespace-pre-wrap">{p}</span>
              </div>
            </div>
          );
        }

        if (isJson || isSql) {
          return (
            <div
              key={idx}
              className="rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950 shadow-lg my-3"
            >
              <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-[11px] text-slate-400 font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  <span className="ml-2 font-semibold text-slate-300">
                    {isJson ? "output.json" : "query.sql"}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 uppercase tracking-wider font-sans font-semibold">
                  {isJson ? "JSON Payload" : "SQL / KQL"}
                </span>
              </div>
              <pre className="p-4 overflow-x-auto text-xs font-mono text-sky-300 leading-relaxed bg-slate-950 max-h-80 overflow-y-auto">
                {p}
              </pre>
            </div>
          );
        }

        // Standard prose
        return (
          <p
            key={idx}
            className="text-slate-200 text-sm sm:text-base leading-relaxed font-normal"
          >
            {p}
          </p>
        );
      })}
    </div>
  );
}

// =========================================================================
// Main Application Component
// =========================================================================
export default function AZ305App() {
  // Master Questions List
  const allQuestions = useMemo(() => {
    return (rawQuestions as unknown as Question[]).map((q) => ({
      ...q,
      domain: normalizeDomain(q.domain),
    }));
  }, []);

  // Navigation View: "dashboard" | "quiz" | "results"
  const [view, setView] = useState<"dashboard" | "quiz" | "results">("dashboard");

  // =======================================================================
  // MeasureUp-Aligned Dashboard Configuration State
  // =======================================================================
  const [generalOptionsOpen, setGeneralOptionsOpen] = useState<boolean>(true);
  const [advancedSettingsOpen, setAdvancedSettingsOpen] = useState<boolean>(true);

  // General Options
  const [mode, setMode] = useState<"study" | "exam">("study"); // "study" = Practice, "exam" = Certification
  const [questionCount, setQuestionCount] = useState<number>(163);
  const [timeLimitMode, setTimeLimitMode] = useState<"none" | "timed">("none");
  const [customTimeMinutes, setCustomTimeMinutes] = useState<number>(100);

  // Advanced Settings - Question Filters
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(["Easy", "Moderate", "Expert"]);
  const [includeFailedOnly, setIncludeFailedOnly] = useState<boolean>(false);
  const [includeUnseenOnly, setIncludeUnseenOnly] = useState<boolean>(false);
  const [filterByObjectives, setFilterByObjectives] = useState<boolean>(true);
  const [selectedObjectives, setSelectedObjectives] = useState<string[]>([...OBJECTIVES]);

  // Advanced Settings - Test Behavior
  const [showAnswersAndExplanations, setShowAnswersAndExplanations] = useState<boolean>(true);
  const [answerDisplayMode, setAnswerDisplayMode] = useState<"ask" | "immediate" | "end">("ask");
  const [isRandomized, setIsRandomized] = useState<boolean>(true);

  // Active Quiz State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [flaggedIds, setFlaggedIds] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [activeCaseSection, setActiveCaseSection] = useState<number>(0);
  const [activeSeriesPart, setActiveSeriesPart] = useState<number>(1);
  const [activeCaseChildIndex, setActiveCaseChildIndex] = useState<number>(0);
  const [partShowAnswer, setPartShowAnswer] = useState<Record<string, boolean>>({});

  // Reset sub-question / series pagination when switching questions
  useEffect(() => {
    setActiveSeriesPart(1);
    setActiveCaseChildIndex(0);
    setActiveCaseSection(0);
    setShowAnswer(false);
    setPartShowAnswer({});
  }, [currentIndex]);

  // Past Attempts Tracking (localStorage)
  const [failedQuestionIds, setFailedQuestionIds] = useState<number[]>([]);
  const [seenQuestionIds, setSeenQuestionIds] = useState<number[]>([]);

  // Timer State
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Load persistence from localStorage
  useEffect(() => {
    try {
      const savedFlags = localStorage.getItem("az305_flagged_ids");
      if (savedFlags) setFlaggedIds(JSON.parse(savedFlags));

      const savedFailed = localStorage.getItem("az305_failed_ids");
      if (savedFailed) setFailedQuestionIds(JSON.parse(savedFailed));

      const savedSeen = localStorage.getItem("az305_seen_ids");
      if (savedSeen) setSeenQuestionIds(JSON.parse(savedSeen));
    } catch {
      // ignore
    }
  }, []);

  const saveFlags = (newFlags: number[]) => {
    setFlaggedIds(newFlags);
    try {
      localStorage.setItem("az305_flagged_ids", JSON.stringify(newFlags));
    } catch {
      // ignore
    }
  };

  const toggleBookmark = (id: number) => {
    const updated = flaggedIds.includes(id)
      ? flaggedIds.filter((x) => x !== id)
      : [...flaggedIds, id];
    saveFlags(updated);
  };

  // Timer Effect
  useEffect(() => {
    if (view !== "quiz") {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1);

      if (timeLimitMode === "timed") {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setView("results");
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, timeLimitMode]);

  // Current Question
  const currentQ = activeQuestions[currentIndex];
  const currentAnswer = currentQ ? userAnswers[currentQ.id] : undefined;

  // Record question as seen
  useEffect(() => {
    if (currentQ && !seenQuestionIds.includes(currentQ.id)) {
      const updated = [...seenQuestionIds, currentQ.id];
      setSeenQuestionIds(updated);
      try {
        localStorage.setItem("az305_seen_ids", JSON.stringify(updated));
      } catch {
        // ignore
      }
    }
  }, [currentQ, seenQuestionIds]);

  // Objective Question Counts
  const objectiveCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "Design identity, governance, and monitoring solutions": 0,
      "Design data storage solutions": 0,
      "Design business continuity solutions": 0,
      "Design infrastructure solutions": 0,
    };
    allQuestions.forEach((q) => {
      if (counts[q.domain] !== undefined) counts[q.domain]++;
    });
    return counts;
  }, [allQuestions]);

  // Difficulty Counts
  const difficultyCounts = useMemo(() => {
    let easy = 0,
      moderate = 0,
      expert = 0;
    allQuestions.forEach((q) => {
      const diff = getQuestionDifficulty(q.id);
      if (diff === "Easy") easy++;
      else if (diff === "Moderate") moderate++;
      else expert++;
    });
    return { easy, moderate, expert };
  }, [allQuestions]);

  // Dynamically calculate questions available based on active domain & filter selections
  const availablePoolCount = useMemo(() => {
    let pool = [...allQuestions];
    if (selectedDifficulties.length > 0 && selectedDifficulties.length < 3) {
      pool = pool.filter((q) => selectedDifficulties.includes(getQuestionDifficulty(q.id)));
    }
    if (filterByObjectives && selectedObjectives.length > 0) {
      pool = pool.filter((q) => selectedObjectives.includes(q.domain));
    }
    if (includeFailedOnly && failedQuestionIds.length > 0) {
      pool = pool.filter((q) => failedQuestionIds.includes(q.id));
    }
    if (includeUnseenOnly) {
      const unseen = pool.filter((q) => !seenQuestionIds.includes(q.id));
      if (unseen.length > 0) pool = unseen;
    }
    return pool.length;
  }, [
    allQuestions,
    selectedDifficulties,
    filterByObjectives,
    selectedObjectives,
    includeFailedOnly,
    failedQuestionIds,
    includeUnseenOnly,
    seenQuestionIds,
  ]);

  // Dynamic question count presets based on filtered pool size
  const countPresets = useMemo(() => {
    if (availablePoolCount <= 15) return [availablePoolCount];
    if (availablePoolCount <= 30) return [15, availablePoolCount];
    if (availablePoolCount <= 50) return [15, 30, availablePoolCount];
    return [15, 30, 50, availablePoolCount];
  }, [availablePoolCount]);

  // Ensure questionCount never exceeds availablePoolCount
  useEffect(() => {
    if (questionCount > availablePoolCount) {
      setQuestionCount(Math.max(1, availablePoolCount));
    }
  }, [availablePoolCount, questionCount]);

  // Handle Objective Toggle
  const toggleObjective = (obj: string) => {
    if (selectedObjectives.includes(obj)) {
      if (selectedObjectives.length > 1) {
        setSelectedObjectives(selectedObjectives.filter((o) => o !== obj));
      }
    } else {
      setSelectedObjectives([...selectedObjectives, obj]);
    }
  };

  // Handle Difficulty Toggle
  const toggleDifficulty = (diff: "Easy" | "Moderate" | "Expert") => {
    if (selectedDifficulties.includes(diff)) {
      if (selectedDifficulties.length > 1) {
        setSelectedDifficulties(selectedDifficulties.filter((d) => d !== diff));
      }
    } else {
      setSelectedDifficulties([...selectedDifficulties, diff]);
    }
  };

  // Launch Session
  const startSession = () => {
    let pool = [...allQuestions];

    // Filter by difficulty
    if (selectedDifficulties.length > 0 && selectedDifficulties.length < 3) {
      pool = pool.filter((q) => selectedDifficulties.includes(getQuestionDifficulty(q.id)));
    }

    // Filter by objectives
    if (filterByObjectives && selectedObjectives.length > 0) {
      pool = pool.filter((q) => selectedObjectives.includes(q.domain));
    }

    // Filter by failed
    if (includeFailedOnly && failedQuestionIds.length > 0) {
      pool = pool.filter((q) => failedQuestionIds.includes(q.id));
    }

    // Filter by unseen
    if (includeUnseenOnly) {
      const unseen = pool.filter((q) => !seenQuestionIds.includes(q.id));
      if (unseen.length > 0) pool = unseen;
    }

    // Fallback if empty
    if (pool.length === 0) pool = [...allQuestions];

    // Randomize
    if (isRandomized) {
      pool.sort(() => Math.random() - 0.5);
    }

    // Slice count
    const count = Math.min(Math.max(1, questionCount), pool.length);
    const selected = pool.slice(0, count);

    setActiveQuestions(selected);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowAnswer(false);
    setElapsedTime(0);

    if (timeLimitMode === "timed") {
      setTimeRemaining(customTimeMinutes * 60);
    } else {
      setTimeRemaining(0);
    }

    setView("quiz");
  };

  // Check Answer & Rationale Trigger
  const handleCheckAnswer = () => {
    setShowAnswer(true);
  };

  // Handle Answer Selection
  const handleSelectOption = (qId: number, option: string) => {
    setUserAnswers((prev) => ({ ...prev, [qId]: option }));
    if (mode === "study" && showAnswersAndExplanations && answerDisplayMode === "immediate") {
      setShowAnswer(true);
    }
  };

  const handleToggleMultiOption = (qId: number, option: string) => {
    setUserAnswers((prev) => {
      const currentList: string[] = prev[qId] || [];
      const updated = currentList.includes(option)
        ? currentList.filter((item) => item !== option)
        : [...currentList, option];
      return { ...prev, [qId]: updated };
    });
    if (mode === "study" && showAnswersAndExplanations && answerDisplayMode === "immediate") {
      setShowAnswer(true);
    }
  };

  const handleStatementAnswer = (qId: number, statementIdx: number, val: "Yes" | "No") => {
    setUserAnswers((prev) => {
      const currentMap = prev[qId] || {};
      return { ...prev, [qId]: { ...currentMap, [statementIdx]: val } };
    });
  };

  const handleDropdownSelect = (qId: number, key: string, val: string) => {
    setUserAnswers((prev) => {
      const currentMap = prev[qId] || {};
      return { ...prev, [qId]: { ...currentMap, [key]: val } };
    });
  };

  const handleCaseChildAnswer = (qId: number, childIdx: number, val: any) => {
    setUserAnswers((prev) => {
      const currentMap = prev[qId] || {};
      return { ...prev, [qId]: { ...currentMap, [childIdx]: val } };
    });
  };

  // Comprehensive Question Evaluation Logic
  const evaluateQuestion = (q: Question, ans: any): boolean => {
    if (!ans) return false;

    // 1. Multiple Choice
    if (q.questionType === "Multiple Choice") {
      return ans === q.correctAnswer;
    }

    // 2. Multiple Select / Multiple Choice (Select Two)
    if (
      q.questionType === "Multiple Select" ||
      q.questionType === "Multiple Choice (Select Two)"
    ) {
      const correctList: string[] = Array.isArray(q.correctAnswer)
        ? q.correctAnswer
        : q.correctAnswers || [q.correctAnswer || ""];
      if (!Array.isArray(ans)) return false;
      return (
        ans.length === correctList.length &&
        ans.every((item) => correctList.includes(item))
      );
    }

    // 3. Statements Table
    if (
      (q.questionType === "Yes/No Statements Table" ||
        q.questionType === "Yes/No Statements") &&
      q.statements
    ) {
      return q.statements.every((s, idx) => ans[idx] === s.correctAnswer);
    }

    // 4. Dropdown Hotspot with subQuestions
    if (q.subQuestions && q.subQuestions.length > 0) {
      return q.subQuestions.every((sq, idx) => {
        const userChoice = ans[idx.toString()] || ans[sq.prompt || ""];
        return userChoice === sq.correctAnswer;
      });
    }

    // 5. Dropdown Matching (handles both component and field keys)
    if (q.questionType === "Dropdown / Matching" && q.mapping) {
      return q.mapping.every((m) => {
        const key = m.component || m.field || "";
        return ans[key] === m.selectedOption;
      });
    }

    // 6. Drag and Drop Matching pairs
    if (q.questionType === "Drag and Drop / Matching" && q.pairs) {
      return q.pairs.every((p) => ans[p.requirement] === p.answer);
    }

    // 7. Drag and Drop Ordering
    if (q.questionType === "Drag and Drop / Ordering") {
      const order = q.correctOrder || q.correctPipeline || [];
      return order.every((val, idx) => ans[idx.toString()] === val);
    }

    // 8. Solution Evaluation Series
    if (
      q.questionType === "Case Study / Solution Evaluation Series" &&
      q.solutions
    ) {
      return q.solutions.every((sol) => ans[sol.part.toString()] === sol.correctAnswer);
    }

    // 9. Case Study with child questions
    if (q.questionType === "Case Study" && q.questions) {
      return q.questions.every((cq, idx) => {
        const cAns = ans[idx];
        if (!cAns) return false;
        if (cq.correctAnswers && Array.isArray(cAns)) {
          return (
            cq.correctAnswers.length === cAns.length &&
            cq.correctAnswers.every((a) => cAns.includes(a))
          );
        }
        if (cq.subQuestions && typeof cAns === "object") {
          return cq.subQuestions.every(
            (sq, sqIdx) => cAns[sqIdx.toString()] === sq.correctAnswer
          );
        }
        return cAns === cq.correctAnswer;
      });
    }

    return false;
  };

  // Results Calculation
  const resultsData = useMemo(() => {
    let correctCount = 0;
    const domainBreakdown: Record<
      string,
      { total: number; correct: number; questions: Question[] }
    > = {};
    const failedIds: number[] = [];

    activeQuestions.forEach((q) => {
      const isCorrect = evaluateQuestion(q, userAnswers[q.id]);
      if (isCorrect) {
        correctCount++;
      } else {
        failedIds.push(q.id);
      }

      if (!domainBreakdown[q.domain]) {
        domainBreakdown[q.domain] = { total: 0, correct: 0, questions: [] };
      }
      domainBreakdown[q.domain].total++;
      if (isCorrect) domainBreakdown[q.domain].correct++;
      domainBreakdown[q.domain].questions.push(q);
    });

    const total = activeQuestions.length;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const scaledScore = Math.round(percent * 10);

    return {
      total,
      correctCount,
      incorrectCount: total - correctCount,
      percent,
      scaledScore,
      isPassed: scaledScore >= 700,
      domainBreakdown,
      failedIds,
    };
  }, [activeQuestions, userAnswers]);

  // Persist failed question IDs when viewing results
  useEffect(() => {
    if (view === "results" && resultsData.failedIds.length > 0) {
      const merged = Array.from(new Set([...failedQuestionIds, ...resultsData.failedIds]));
      setFailedQuestionIds(merged);
      try {
        localStorage.setItem("az305_failed_ids", JSON.stringify(merged));
      } catch {
        // ignore
      }
    }
  }, [view, resultsData.failedIds]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // =======================================================================
  // VIEW 1: DASHBOARD / MEASUREUP SETUP HUB
  // =======================================================================
  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Top Header */}
        <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-6 py-4 sticky top-0 z-20 shadow-md">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center font-black text-white text-base shadow-md shadow-blue-500/20">
                AZ
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  AZ-305 Exam Practice Hub
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/30 font-semibold">
                    163 Questions Synced
                  </span>
                </h1>
                <p className="text-xs text-slate-400">
                  Microsoft Certified: Azure Solutions Architect Expert
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl font-medium flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">★ {flaggedIds.length}</span> Bookmarked
              </span>
            </div>
          </div>
        </header>

        {/* Setup Container matching MeasureUp Interface */}
        <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
          {/* Card Container */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-800">
            {/* ========================================================= */}
            {/* SECTION 1: GENERAL OPTIONS                                */}
            {/* ========================================================= */}
            <div className="p-6">
              {/* Accordion Header */}
              <button
                onClick={() => setGeneralOptionsOpen(!generalOptionsOpen)}
                className="w-full flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5 text-blue-400 font-bold text-lg">
                  <span className="text-xl">⚙️</span>
                  <span>General Options</span>
                </div>
                <span className="text-slate-400 text-lg group-hover:text-white transition-colors">
                  {generalOptionsOpen ? "▲" : "▼"}
                </span>
              </button>

              {generalOptionsOpen && (
                <div className="mt-6 flex flex-col gap-6">
                  {/* Test Mode */}
                  <div>
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3">
                      <span>🎚️ Test Mode</span>
                      <span className="text-slate-500 cursor-pointer" title="Select between flexible study mode or strict exam conditions">
                        ⓘ
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Practice Card */}
                      <button
                        onClick={() => setMode("study")}
                        className={`p-5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                          mode === "study"
                            ? "bg-blue-600/15 border-blue-500 text-white shadow-md shadow-blue-500/10 ring-1 ring-blue-500"
                            : "bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <span className="text-2xl">🎓</span>
                        <span className="font-bold text-sm text-blue-400">Practice</span>
                        <span className="text-xs text-slate-400">
                          Study mode, with feedback, flexible
                        </span>
                      </button>

                      {/* Certification Card */}
                      <button
                        onClick={() => setMode("exam")}
                        className={`p-5 rounded-xl border text-center transition-all flex flex-col items-center justify-center gap-2 ${
                          mode === "exam"
                            ? "bg-emerald-600/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500"
                            : "bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <span className="text-2xl">🛡️</span>
                        <span className="font-bold text-sm text-emerald-400">Certification</span>
                        <span className="text-xs text-slate-400">
                          Strict, no feedback, real conditions
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Number of Questions & Time Limit */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Number of Questions */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                        <span>📄 Number of Questions</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min={1}
                          max={availablePoolCount}
                          value={Math.min(questionCount, availablePoolCount)}
                          onChange={(e) =>
                            setQuestionCount(
                              Math.min(
                                availablePoolCount,
                                Math.max(1, parseInt(e.target.value) || 1)
                              )
                            )
                          }
                          className="w-24 bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-center text-sm font-bold text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <span className="text-xs text-slate-400">
                          of {availablePoolCount} available in selection
                        </span>
                      </div>

                      {/* Quick Presets */}
                      <div className="flex flex-wrap items-center gap-2 mt-2.5">
                        {countPresets.map((n) => (
                          <button
                            key={n}
                            onClick={() => setQuestionCount(n)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-colors ${
                              questionCount === n
                                ? "bg-blue-600 border-blue-500 text-white"
                                : "bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800"
                            }`}
                          >
                            {n === availablePoolCount ? `All ${n}` : n}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time Limit */}
                    <div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-2">
                        <span>🕒 Time Limit</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setTimeLimitMode("none")}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                            timeLimitMode === "none"
                              ? "bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500"
                              : "bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800"
                          }`}
                        >
                          No time limit
                        </button>
                        <button
                          onClick={() => setTimeLimitMode("timed")}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                            timeLimitMode === "timed"
                              ? "bg-blue-600/20 border-blue-500 text-blue-300 ring-1 ring-blue-500"
                              : "bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800"
                          }`}
                        >
                          Set time limit
                        </button>
                      </div>

                      {timeLimitMode === "timed" && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-slate-300">
                          <span>Duration:</span>
                          <select
                            value={customTimeMinutes}
                            onChange={(e) => setCustomTimeMinutes(Number(e.target.value))}
                            className="bg-slate-850 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white focus:outline-none focus:ring-1 focus:ring-blue-500 font-mono"
                          >
                            <option value={30}>30 Minutes</option>
                            <option value={60}>60 Minutes</option>
                            <option value={100}>100 Minutes (Real Exam)</option>
                            <option value={120}>120 Minutes</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ========================================================= */}
            {/* SECTION 2: ADVANCED SETTINGS                              */}
            {/* ========================================================= */}
            <div className="p-6">
              {/* Accordion Header */}
              <button
                onClick={() => setAdvancedSettingsOpen(!advancedSettingsOpen)}
                className="w-full flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-2.5 text-blue-400 font-bold text-lg">
                  <span className="text-xl">🧪</span>
                  <span>Advanced Settings</span>
                </div>
                <span className="text-slate-400 text-lg group-hover:text-white transition-colors">
                  {advancedSettingsOpen ? "▲" : "▼"}
                </span>
              </button>

              {advancedSettingsOpen && (
                <div className="mt-6 flex flex-col gap-6">
                  {/* Subsection: Question Filters */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                        <span>🎛️ Question Filters</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedDifficulties(["Easy", "Moderate", "Expert"]);
                          setIncludeFailedOnly(false);
                          setIncludeUnseenOnly(false);
                          setFilterByObjectives(true);
                          setSelectedObjectives([...OBJECTIVES]);
                        }}
                        className="text-xs text-slate-400 hover:text-blue-400 flex items-center gap-1 transition-colors"
                        title="Reset filters to default"
                      >
                        <span>↺</span> Reset Filters
                      </button>
                    </div>

                    {/* Difficulty Selection */}
                    <div className="mb-4">
                      <div className="text-xs text-slate-400 flex items-center gap-1.5 mb-2">
                        <span>📶 Difficulty</span>
                        <span className="text-slate-500 cursor-pointer" title="Filter by question difficulty level">
                          ⓘ
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <button
                          onClick={() => toggleDifficulty("Easy")}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                            selectedDifficulties.includes("Easy")
                              ? "bg-blue-600/20 border-blue-500 text-white font-semibold"
                              : "bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="text-emerald-400">↓</span> Easy Beginner
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 font-mono text-[11px] text-slate-300">
                            {difficultyCounts.easy}
                          </span>
                        </button>

                        <button
                          onClick={() => toggleDifficulty("Moderate")}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                            selectedDifficulties.includes("Moderate")
                              ? "bg-blue-600/20 border-blue-500 text-white font-semibold"
                              : "bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="text-amber-400">→</span> Moderate
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 font-mono text-[11px] text-slate-300">
                            {difficultyCounts.moderate}
                          </span>
                        </button>

                        <button
                          onClick={() => toggleDifficulty("Expert")}
                          className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                            selectedDifficulties.includes("Expert")
                              ? "bg-blue-600/20 border-blue-500 text-white font-semibold"
                              : "bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="text-rose-400">↗</span> Expert
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-slate-800 font-mono text-[11px] text-slate-300">
                            {difficultyCounts.expert}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Checkboxes: Past Attempts */}
                    <div className="flex flex-col gap-2.5 mb-4">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={includeFailedOnly}
                          onChange={(e) => setIncludeFailedOnly(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                        <span>Include failed questions from last attempts</span>
                        <span className="text-slate-500" title="Focus exclusively on questions answered incorrectly in previous sessions">
                          ⓘ ({failedQuestionIds.length} recorded)
                        </span>
                      </label>

                      <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={includeUnseenOnly}
                          onChange={(e) => setIncludeUnseenOnly(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                        <span>Include unseen/not displayed questions from last attempts</span>
                        <span className="text-slate-500" title="Prioritize fresh questions you have not yet encountered">
                          ⓘ ({allQuestions.length - seenQuestionIds.length} unseen)
                        </span>
                      </label>
                    </div>

                    {/* Objectives Selection */}
                    <div>
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-300 mb-3">
                        <input
                          type="checkbox"
                          checked={filterByObjectives}
                          onChange={(e) => setFilterByObjectives(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                        <span>Select questions from specific objectives</span>
                        <span className="text-slate-500" title="Target specific exam syllabus domains">
                          ⓘ
                        </span>
                      </label>

                      {filterByObjectives && (
                        <div className="grid grid-cols-1 gap-2 pl-6">
                          {OBJECTIVES.map((obj) => {
                            const isSelected = selectedObjectives.includes(obj);
                            const count = objectiveCounts[obj] || 0;

                            return (
                              <button
                                key={obj}
                                onClick={() => toggleObjective(obj)}
                                className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                                  isSelected
                                    ? "bg-blue-600/15 border-blue-500 text-white font-medium"
                                    : "bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span>🏷️</span>
                                  <span className="capitalize">{obj}</span>
                                </span>
                                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px]">
                                  {count}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Subsection: Test Behavior */}
                  <div className="pt-4 border-t border-slate-800">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-300 mb-3">
                      <span>⚙️ Test Behavior</span>
                    </div>

                    {/* Show correct answers and explanations */}
                    <div className="flex flex-col gap-3">
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300">
                        <input
                          type="checkbox"
                          checked={showAnswersAndExplanations}
                          onChange={(e) => setShowAnswersAndExplanations(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                        <span className="font-semibold">Show correct answers and explanations</span>
                        <span className="text-slate-500" title="Toggle visibility of answer feedback during test">
                          ⓘ
                        </span>
                      </label>

                      {showAnswersAndExplanations && (
                        <div className="pl-6 flex flex-col gap-1.5">
                          <span className="text-xs text-slate-400">Answer display mode</span>
                          <select
                            value={answerDisplayMode}
                            onChange={(e) =>
                              setAnswerDisplayMode(
                                e.target.value as "ask" | "immediate" | "end"
                              )
                            }
                            className="bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white max-w-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                          >
                            <option value="ask">Let me ask for each answer (Check Answer Button)</option>
                            <option value="immediate">Show immediately after selection</option>
                            <option value="end">Display at the end of the test</option>
                          </select>
                        </div>
                      )}

                      {/* Randomize question order */}
                      <label className="flex items-center gap-2.5 cursor-pointer text-xs text-slate-300 mt-2">
                        <input
                          type="checkbox"
                          checked={isRandomized}
                          onChange={(e) => setIsRandomized(e.target.checked)}
                          className="w-4 h-4 accent-blue-600 rounded cursor-pointer"
                        />
                        <span>Randomize the question order of your test</span>
                        <span className="text-slate-500" title="Shuffles question sequence">
                          ⓘ
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Launch Button Footer */}
            <div className="p-6 bg-slate-900/60 flex items-center justify-between">
              <span className="text-xs text-slate-400">
                Ready to practice with {Math.min(questionCount, allQuestions.length)} questions in {mode === "study" ? "Practice" : "Certification"} Mode
              </span>

              <button
                onClick={() => startSession()}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all flex items-center gap-2"
              >
                <span>Start Test →</span>
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // =======================================================================
  // VIEW 2: EXAM RESULTS & SCORE REPORT
  // =======================================================================
  if (view === "results") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full mx-auto flex flex-col gap-6">
          {/* Top Return bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView("dashboard")}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-850 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
            >
              ← Back to Setup Hub
            </button>
            <span className="text-xs text-slate-400">
              Completed in {formatTime(elapsedTime)}
            </span>
          </div>

          {/* Pass / Fail Banner */}
          <div
            className={`rounded-3xl p-6 sm:p-8 border shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6 ${
              resultsData.isPassed
                ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-100"
                : "bg-rose-950/30 border-rose-500/40 text-rose-100"
            }`}
          >
            <div>
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                  resultsData.isPassed
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                }`}
              >
                {resultsData.isPassed ? "PASSED - CERTIFICATION READY" : "NEEDS FURTHER PRACTICE"}
              </span>
              <h2 className="text-3xl font-extrabold text-white">
                Score: {resultsData.scaledScore} / 1000
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Passing standard is 700 / 1000 (70%). You answered {resultsData.correctCount} out of {resultsData.total} questions correctly ({resultsData.percent}%).
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full sm:w-auto">
              <button
                onClick={() => {
                  setMode("study");
                  setShowAnswersAndExplanations(true);
                  setShowAnswer(true);
                  setCurrentIndex(0);
                  setView("quiz");
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-blue-500/20 transition-all text-center"
              >
                Review All Questions & Rationales
              </button>

              {resultsData.failedIds.length > 0 && (
                <button
                  onClick={() => {
                    const failedPool = allQuestions.filter((q) =>
                      resultsData.failedIds.includes(q.id)
                    );
                    setActiveQuestions(failedPool);
                    setCurrentIndex(0);
                    setUserAnswers({});
                    setShowAnswer(false);
                    setMode("study");
                    setView("quiz");
                  }}
                  className="px-6 py-3 rounded-xl bg-rose-600/30 hover:bg-rose-600/50 border border-rose-500/40 text-rose-200 font-bold text-xs sm:text-sm transition-all text-center"
                >
                  Retake {resultsData.failedIds.length} Missed Questions
                </button>
              )}

              <button
                onClick={() => setView("dashboard")}
                className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 font-semibold text-xs sm:text-sm transition-all text-center"
              >
                Configure New Session
              </button>
            </div>
          </div>

          {/* Domain Breakdown Performance */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4">
              Domain Performance Breakdown
            </h3>
            <div className="flex flex-col gap-4">
              {Object.entries(resultsData.domainBreakdown).map(([domain, data]) => {
                const domPercent =
                  data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                return (
                  <div key={domain} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-200">{domain}</span>
                      <span className="font-mono text-slate-400">
                        {data.correct} / {data.total} ({domPercent}%)
                      </span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          domPercent >= 70 ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${domPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // =======================================================================
  // VIEW 3: INTERACTIVE QUIZ & EXAM VIEW
  // =======================================================================
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3 sticky top-0 z-20 shadow-md">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (confirm("Return to Setup Hub? Current session answers will be cleared.")) {
                  setView("dashboard");
                }
              }}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-700 bg-slate-800 transition-colors"
            >
              ← Hub
            </button>
            <div>
              <span className="text-xs font-bold text-slate-200">
                Question {currentIndex + 1} of {activeQuestions.length}
              </span>
              <div className="w-32 sm:w-48 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all"
                  style={{
                    width: `${((currentIndex + 1) / activeQuestions.length) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Timer */}
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 border border-slate-700 text-xs font-mono">
              <span className="text-slate-400">⏱</span>
              <span className={timeLimitMode === "timed" && timeRemaining < 300 ? "text-rose-400 font-bold" : "text-slate-200"}>
                {timeLimitMode === "timed" ? formatTime(timeRemaining) : formatTime(elapsedTime)}
              </span>
            </div>

            {/* Bookmark Button */}
            <button
              onClick={() => currentQ && toggleBookmark(currentQ.id)}
              className={`p-2 rounded-lg border transition-colors ${
                currentQ && flaggedIds.includes(currentQ.id)
                  ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                  : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"
              }`}
              title="Bookmark Question"
            >
              ★
            </button>

            {/* Palette Toggle */}
            <button
              onClick={() => setShowPalette(!showPalette)}
              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-200 hover:text-white transition-colors"
            >
              Palette ⊞
            </button>

            {/* Submit Exam Button */}
            <button
              onClick={() => {
                if (confirm("Are you ready to submit your test and review your score report?")) {
                  setView("results");
                }
              }}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md shadow-emerald-600/20"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </header>

      {/* Main Question Card View */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
          {/* Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs tracking-wider uppercase">
                Question {currentQ.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs">
                {currentQ.questionType}
              </span>
              <span className="px-2 py-0.5 rounded-lg bg-slate-850 border border-slate-800 text-slate-400 text-[11px]">
                {getQuestionDifficulty(currentQ.id)}
              </span>
            </div>

            <div className="text-right">
              <span className="text-xs font-medium text-slate-400">
                {currentQ.domain}
              </span>
              {currentQ.subdomain && (
                <p className="text-[11px] text-slate-500">{currentQ.subdomain}</p>
              )}
            </div>
          </div>

          {/* Scenario Context if Case Study */}
          {currentQ.scenario && (
            <div className="mb-6 p-4 rounded-2xl bg-slate-850 border border-slate-700/60 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
              <div className="font-semibold text-blue-300 text-xs tracking-wider uppercase mb-2">
                Scenario Context
              </div>
              {currentQ.scenario}
              {currentQ.note && (
                <div className="mt-2 text-xs italic text-amber-300/80">
                  {currentQ.note}
                </div>
              )}
            </div>
          )}

          {/* Case Study Header if present */}
          {currentQ.questionType === "Case Study" && (
            <div className="mb-6 p-4 rounded-2xl bg-blue-950/40 border border-blue-500/30 text-blue-200">
              <div className="text-xs uppercase font-bold tracking-wider text-blue-400 mb-1">
                {currentQ.caseStudyTitle || `Case Study: ${currentQ.topic || "Enterprise Architecture"}`}
              </div>
              <p className="text-xs text-slate-300">
                Review the background tabs below, then answer each question in this case study series.
              </p>
            </div>
          )}

          {/* Case Study Sections Tabs if present (e.g. Q63, Q103) */}
          {currentQ.sections && currentQ.sections.length > 0 && (
            <div className="mb-6 rounded-2xl border border-slate-700 bg-slate-950/60 overflow-hidden">
              <div className="flex flex-wrap border-b border-slate-800 bg-slate-850/60">
                {currentQ.sections.map((sec, secIdx) => (
                  <button
                    key={secIdx}
                    onClick={() => setActiveCaseSection(secIdx)}
                    className={`px-4 py-2.5 text-xs font-bold transition-colors border-b-2 ${
                      activeCaseSection === secIdx
                        ? "border-blue-500 text-white bg-slate-800"
                        : "border-transparent text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {sec.title}
                  </button>
                ))}
              </div>
              <div className="p-4 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line max-h-64 overflow-y-auto">
                {currentQ.sections[activeCaseSection]?.content}
              </div>
            </div>
          )}

          {/* Context Table if present (e.g. Q2) */}
          {currentQ.contextTable && currentQ.contextTable.length > 0 && (
            <div className="overflow-x-auto my-4 rounded-xl border border-slate-700 bg-slate-950/60 p-2">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-slate-400 bg-slate-800/40">
                    {Object.keys(currentQ.contextTable[0]).map((header) => (
                      <th key={header} className="p-2.5 font-semibold">
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {currentQ.contextTable.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-800/30">
                      {Object.values(row).map((val, cIdx) => (
                        <td key={cIdx} className="p-2.5 text-slate-300 font-mono">
                          {val}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Formatted Question Text: Splits prose vs CLI commands vs JSON blocks */}
          <FormattedQuestionText text={currentQ.question} />

          {/* ========================================================= */}
          {/* INTERACTIVE INPUTS: ALL QUESTION TYPES SUPPORTED          */}
          {/* ========================================================= */}
          <div className="mt-4">
            {/* 1. Multiple Choice */}
            {currentQ.questionType === "Multiple Choice" && currentQ.options && (
              <div className="grid gap-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = currentAnswer === opt;
                  const isCorrect = currentQ.correctAnswer === opt;
                  let cardStyle =
                    "bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-200";

                  if (showAnswer && mode === "study" && showAnswersAndExplanations) {
                    if (isCorrect) {
                      cardStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200";
                    } else if (isSelected && !isCorrect) {
                      cardStyle = "bg-rose-950/40 border-rose-500 text-rose-200";
                    }
                  } else if (isSelected) {
                    cardStyle = "bg-blue-600/20 border-blue-500 text-blue-200";
                  }

                  return (
                    <button
                      key={oIdx}
                      onClick={() => handleSelectOption(currentQ.id, opt)}
                      className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base transition-all flex items-start gap-3 ${cardStyle}`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                          showAnswer && mode === "study" && showAnswersAndExplanations && isCorrect
                            ? "border-emerald-500 bg-emerald-500 text-slate-950"
                            : showAnswer && mode === "study" && showAnswersAndExplanations && isSelected && !isCorrect
                            ? "border-rose-500 bg-rose-500 text-white"
                            : isSelected
                            ? "border-blue-500 bg-blue-500 text-white"
                            : "border-slate-600 text-slate-400"
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}
                      </div>
                      <span className="flex-1">{opt}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. Multiple Select / Multiple Choice (Select Two) */}
            {(currentQ.questionType === "Multiple Select" ||
              currentQ.questionType === "Multiple Choice (Select Two)") &&
              currentQ.options && (
                <div className="grid gap-3">
                  <p className="text-xs text-blue-400 font-semibold mb-1">
                    Select all correct answers that apply.
                  </p>
                  {currentQ.options.map((opt, oIdx) => {
                    const selectedList: string[] = currentAnswer || [];
                    const isSelected = selectedList.includes(opt);
                    const correctAnswers = Array.isArray(currentQ.correctAnswer)
                      ? currentQ.correctAnswer
                      : currentQ.correctAnswers || [currentQ.correctAnswer || ""];
                    const isCorrect = correctAnswers.includes(opt);

                    let cardStyle =
                      "bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-200";

                    if (showAnswer && mode === "study" && showAnswersAndExplanations) {
                      if (isCorrect) {
                        cardStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200";
                      } else if (isSelected && !isCorrect) {
                        cardStyle = "bg-rose-950/40 border-rose-500 text-rose-200";
                      }
                    } else if (isSelected) {
                      cardStyle = "bg-blue-600/20 border-blue-500 text-blue-200";
                    }

                    return (
                      <button
                        key={oIdx}
                        onClick={() => handleToggleMultiOption(currentQ.id, opt)}
                        className={`w-full text-left p-4 rounded-xl border text-sm sm:text-base transition-all flex items-start gap-3 ${cardStyle}`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                            showAnswer && mode === "study" && showAnswersAndExplanations && isCorrect
                              ? "border-emerald-500 bg-emerald-500 text-slate-950"
                              : showAnswer && mode === "study" && showAnswersAndExplanations && isSelected && !isCorrect
                              ? "border-rose-500 bg-rose-500 text-white"
                              : isSelected
                              ? "border-blue-500 bg-blue-500 text-white"
                              : "border-slate-600"
                          }`}
                        >
                          {isSelected ? "✓" : ""}
                        </div>
                        <span className="flex-1">{opt}</span>
                      </button>
                    );
                  })}
                </div>
              )}

            {/* 3. Yes/No Statements Table */}
            {(currentQ.questionType === "Yes/No Statements Table" ||
              currentQ.questionType === "Yes/No Statements") &&
              currentQ.statements && (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-850/80 text-slate-400 text-xs">
                        <th className="p-3 sm:p-4 font-semibold">Statement</th>
                        <th className="p-3 sm:p-4 text-center w-28">Selection</th>
                        {showAnswer && mode === "study" && showAnswersAndExplanations && (
                          <th className="p-3 sm:p-4 text-center w-28">Correct</th>
                        )}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {currentQ.statements.map((stmt, sIdx) => {
                        const answerMap = currentAnswer || {};
                        const userVal = answerMap[sIdx];

                        return (
                          <tr key={sIdx} className="hover:bg-slate-850/40">
                            <td className="p-3 sm:p-4 text-slate-200 text-xs sm:text-sm">
                              {stmt.statement}
                            </td>
                            <td className="p-3 sm:p-4 text-center">
                              <div className="inline-flex rounded-lg border border-slate-700 p-0.5 bg-slate-900">
                                <button
                                  onClick={() => handleStatementAnswer(currentQ.id, sIdx, "Yes")}
                                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                                    userVal === "Yes"
                                      ? "bg-blue-600 text-white"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() => handleStatementAnswer(currentQ.id, sIdx, "No")}
                                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                                    userVal === "No"
                                      ? "bg-blue-600 text-white"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                >
                                  No
                                </button>
                              </div>
                            </td>
                            {showAnswer && mode === "study" && showAnswersAndExplanations && (
                              <td className="p-3 sm:p-4 text-center">
                                <span
                                  className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                    stmt.correctAnswer === "Yes"
                                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                      : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                                  }`}
                                >
                                  {stmt.correctAnswer}
                                </span>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}

            {/* 4. Dropdown / Hotspot & SubQuestions (e.g. Q2, Q4, Q12, Q30, Q36) */}
            {currentQ.subQuestions && currentQ.subQuestions.length > 0 && (
              <div className="grid gap-4">
                {currentQ.subQuestions.map((sq, sqIdx) => {
                  const currentSelections = currentAnswer || {};
                  const userVal =
                    currentSelections[sqIdx.toString()] ||
                    currentSelections[sq.prompt || ""] ||
                    "";
                  const isCorrect = userVal === sq.correctAnswer;
                  const availableOptions = sq.options || currentQ.availableOptions || [];

                  return (
                    <div
                      key={sqIdx}
                      className="p-4 sm:p-5 rounded-2xl bg-slate-850 border border-slate-700/80 flex flex-col gap-3"
                    >
                      <div className="text-sm font-semibold text-slate-200">
                        {sq.prompt || `Item ${sqIdx + 1}`}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                        <select
                          value={userVal}
                          onChange={(e) =>
                            handleDropdownSelect(currentQ.id, sqIdx.toString(), e.target.value)
                          }
                          className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
                        >
                          <option value="">-- Select from dropdown --</option>
                          {availableOptions.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>

                        {showAnswer && mode === "study" && showAnswersAndExplanations && (
                          <div className="shrink-0">
                            <span
                              className={`px-3 py-1.5 text-xs rounded-xl font-bold border inline-block ${
                                isCorrect
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              }`}
                            >
                              {isCorrect ? "✓ Correct" : `Target: ${sq.correctAnswer}`}
                            </span>
                          </div>
                        )}
                      </div>

                      {showAnswer && mode === "study" && showAnswersAndExplanations && sq.explanation && (
                        <div className="text-xs text-slate-400 bg-slate-900/60 p-3 rounded-lg border border-slate-800 leading-relaxed">
                          💡 {sq.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* 5. Dropdown / Matching (handles component and field keys) */}
            {currentQ.questionType === "Dropdown / Matching" && currentQ.mapping && (
              <div className="grid gap-4">
                {currentQ.mapping.map((m, mIdx) => {
                  const label = m.component || m.field || `Option ${mIdx + 1}`;
                  const currentSelections = currentAnswer || {};
                  const userVal = currentSelections[label] || "";
                  const isCorrect = userVal === m.selectedOption;

                  return (
                    <div
                      key={mIdx}
                      className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <span className="text-sm font-medium text-slate-200">
                        {label}:
                      </span>
                      <div className="flex items-center gap-2">
                        <select
                          value={userVal}
                          onChange={(e) =>
                            handleDropdownSelect(currentQ.id, label, e.target.value)
                          }
                          className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">-- Select option --</option>
                          {m.options.map((opt, oIdx) => (
                            <option key={oIdx} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {showAnswer && mode === "study" && showAnswersAndExplanations && (
                          <span
                            className={`px-2 py-1 text-xs rounded-md font-semibold ${
                              isCorrect
                                ? "bg-emerald-500/20 text-emerald-400"
                                : "bg-rose-500/20 text-rose-400"
                            }`}
                          >
                            Correct: {m.selectedOption}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* 6. Drag and Drop / Matching with pairs */}
            {currentQ.questionType === "Drag and Drop / Matching" &&
              currentQ.pairs &&
              !currentQ.subQuestions && (
                <div className="grid gap-3">
                  {currentQ.pairs.map((p, pIdx) => {
                    const currentSelections = currentAnswer || {};
                    const userVal = currentSelections[p.requirement] || "";
                    const isCorrect = userVal === p.answer;
                    const options = currentQ.availableOptions || [];

                    return (
                      <div
                        key={pIdx}
                        className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <span className="text-sm font-medium text-slate-200">
                          {p.requirement}:
                        </span>
                        <div className="flex items-center gap-2">
                          <select
                            value={userVal}
                            onChange={(e) =>
                              handleDropdownSelect(currentQ.id, p.requirement, e.target.value)
                            }
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="">-- Match item --</option>
                            {options.map((opt, oIdx) => (
                              <option key={oIdx} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {showAnswer && mode === "study" && showAnswersAndExplanations && (
                            <span
                              className={`px-2 py-1 text-xs rounded-md font-semibold ${
                                isCorrect
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-rose-500/20 text-rose-400"
                              }`}
                            >
                              Target: {p.answer}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

            {/* 7. Drag and Drop / Ordering (e.g. Q74, Q79) */}
            {currentQ.questionType === "Drag and Drop / Ordering" && (
              <div className="grid gap-3">
                <p className="text-xs text-blue-400 font-semibold mb-1">
                  Place the following steps in the correct architectural sequence.
                </p>

                {/* Pipeline visual if present (e.g. Q79) */}
                {currentQ.pipeline ? (
                  <div className="grid gap-3">
                    {currentQ.pipeline.map((pStep, pIdx) => {
                      const isFixed = !(currentQ.availableOptions || []).includes(pStep.name);
                      const currentSelections = currentAnswer || {};
                      const userVal = currentSelections[pIdx.toString()] || "";
                      const isCorrect = userVal === pStep.name;

                      return (
                        <div
                          key={pIdx}
                          className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-blue-600/30 text-blue-400 text-xs font-bold flex items-center justify-center shrink-0">
                              {pIdx + 1}
                            </span>
                            <span className="text-sm font-bold text-slate-200">
                              {pStep.step}:
                            </span>
                          </div>

                          {isFixed ? (
                            <div className="px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs sm:text-sm text-slate-400 font-mono">
                              🔒 {pStep.name} (Fixed System Component)
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 flex-1 max-w-md">
                              <select
                                value={userVal}
                                onChange={(e) =>
                                  handleDropdownSelect(currentQ.id, pIdx.toString(), e.target.value)
                                }
                                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                              >
                                <option value="">-- Select service --</option>
                                {(currentQ.availableOptions || []).map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                              {showAnswer && mode === "study" && showAnswersAndExplanations && (
                                <span
                                  className={`px-2 py-1 text-xs rounded-md font-semibold shrink-0 ${
                                    isCorrect
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : "bg-rose-500/20 text-rose-400"
                                  }`}
                                >
                                  Target: {pStep.name}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  /* Standard Step sequence (e.g. Q74) */
                  (currentQ.correctOrder || currentQ.availableOptions || []).map((_, oIdx) => {
                    const currentSelections = currentAnswer || {};
                    const userVal = currentSelections[oIdx.toString()] || "";
                    const targetVal = currentQ.correctOrder?.[oIdx];
                    const isCorrect = userVal === targetVal;
                    const options = currentQ.availableOptions || [];

                    return (
                      <div
                        key={oIdx}
                        className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                      >
                        <span className="text-sm font-bold text-slate-200">
                          Step {oIdx + 1}:
                        </span>
                        <div className="flex items-center gap-2 flex-1 max-w-md">
                          <select
                            value={userVal}
                            onChange={(e) =>
                              handleDropdownSelect(currentQ.id, oIdx.toString(), e.target.value)
                            }
                            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                          >
                            <option value="">-- Select step --</option>
                            {options.map((opt, optIdx) => (
                              <option key={optIdx} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                          {showAnswer && mode === "study" && showAnswersAndExplanations && targetVal && (
                            <span
                              className={`px-2 py-1 text-xs rounded-md font-semibold shrink-0 ${
                                isCorrect
                                  ? "bg-emerald-500/20 text-emerald-400"
                                  : "bg-rose-500/20 text-rose-400"
                              }`}
                            >
                              Correct: {targetVal}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* 8. Solution Evaluation Series - Clean Paginated Part-by-Part (No long scrolling) */}
            {currentQ.questionType === "Case Study / Solution Evaluation Series" &&
              currentQ.solutions && (
                <div className="flex flex-col gap-4">
                  {/* Part Navigation Pills */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-slate-400 mr-1">Parts:</span>
                      {currentQ.solutions.map((sol) => {
                        const ansMap = currentAnswer || {};
                        const isAnswered = ansMap[sol.part.toString()] !== undefined;
                        const isActive = activeSeriesPart === sol.part;

                        return (
                          <button
                            key={sol.part}
                            onClick={() => setActiveSeriesPart(sol.part)}
                            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                              isActive
                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400"
                                : isAnswered
                                ? "bg-blue-950/60 border border-blue-500/30 text-blue-300 hover:bg-slate-800"
                                : "bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                            }`}
                          >
                            <span>Part {sol.part}</span>
                            {isAnswered && <span className="text-[10px] text-emerald-400">✓</span>}
                          </button>
                        );
                      })}
                    </div>

                    <span className="text-xs text-slate-400 font-mono">
                      Part {activeSeriesPart} of {currentQ.solutions.length}
                    </span>
                  </div>

                  {/* Active Part Card */}
                  {(() => {
                    const activeSol =
                      currentQ.solutions.find((s) => s.part === activeSeriesPart) ||
                      currentQ.solutions[0];
                    const ansMap = currentAnswer || {};
                    const userVal = ansMap[activeSol.part.toString()];
                    const isCorrect = userVal === activeSol.correctAnswer;
                    const isRevealed =
                      (showAnswer || partShowAnswer[`part_${activeSol.part}`]) &&
                      mode === "study" &&
                      showAnswersAndExplanations;

                    return (
                      <div className="p-6 rounded-2xl bg-slate-850 border border-slate-700/80 flex flex-col gap-4 shadow-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1.5">
                            <span>Part {activeSol.part} of {currentQ.solutions.length}</span>
                            <span className="text-slate-500">•</span>
                            <span className="text-slate-400 normal-case">Independent Evaluation</span>
                          </span>

                          {isRevealed && (
                            <span
                              className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                isCorrect
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                  : "bg-rose-500/20 text-rose-300 border-rose-500/30"
                              }`}
                            >
                              {isCorrect ? "✓ Correct" : `Target Answer: ${activeSol.correctAnswer}`}
                            </span>
                          )}
                        </div>

                        <div className="text-slate-100 text-sm sm:text-base leading-relaxed bg-slate-900/80 p-4 rounded-xl border border-slate-800">
                          <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-1">
                            Proposed Solution:
                          </div>
                          {activeSol.proposedSolution}
                        </div>

                        <p className="text-sm font-medium text-slate-200">{activeSol.question}</p>

                        {/* Yes / No Selection */}
                        <div className="flex items-center gap-3 pt-1">
                          {["Yes", "No"].map((choice) => {
                            const isSelected = userVal === choice;
                            let btnStyle = "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800";

                            if (isRevealed) {
                              if (choice === activeSol.correctAnswer) {
                                btnStyle = "bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500";
                              } else if (isSelected && choice !== activeSol.correctAnswer) {
                                btnStyle = "bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500";
                              }
                            } else if (isSelected) {
                              btnStyle = "bg-blue-600 border-blue-500 text-white shadow-md shadow-blue-500/20";
                            }

                            return (
                              <button
                                key={choice}
                                onClick={() =>
                                  handleDropdownSelect(currentQ.id, activeSol.part.toString(), choice)
                                }
                                className={`px-6 py-2.5 rounded-xl font-bold text-sm border transition-all ${btnStyle}`}
                              >
                                {choice}
                              </button>
                            );
                          })}
                        </div>

                        {/* Part Navigation & Check Answer */}
                        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800">
                          <div className="flex items-center gap-2">
                            <button
                              disabled={activeSeriesPart <= 1}
                              onClick={() => setActiveSeriesPart((prev) => Math.max(1, prev - 1))}
                              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              ← Previous Part
                            </button>

                            <button
                              disabled={activeSeriesPart >= currentQ.solutions.length}
                              onClick={() =>
                                setActiveSeriesPart((prev) =>
                                  Math.min(currentQ.solutions!.length, prev + 1)
                                )
                              }
                              className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                            >
                              Next Part →
                            </button>
                          </div>

                          {mode === "study" && showAnswersAndExplanations && !isRevealed && (
                            <button
                              onClick={() =>
                                setPartShowAnswer((prev) => ({
                                  ...prev,
                                  [`part_${activeSol.part}`]: true,
                                }))
                              }
                              className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                            >
                              Check Part {activeSol.part}
                            </button>
                          )}
                        </div>

                        {/* Part Explanation */}
                        {isRevealed && activeSol.explanation && (
                          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in duration-200">
                            <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                              <span>💡</span> Part {activeSol.part} Architectural Rationale:
                            </div>
                            {activeSol.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })()}
                </div>
              )}

            {/* 9. Case Study with Child Questions - Clean Paginated Question-by-Question */}
            {currentQ.questionType === "Case Study" && currentQ.questions && (
              <div className="flex flex-col gap-4">
                {/* Child Question Navigation Pills */}
                <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-xs font-semibold text-slate-400 mr-1">Case Questions:</span>
                    {currentQ.questions.map((cq, cqIdx) => {
                      const ansMap = currentAnswer || {};
                      const isAnswered = ansMap[cqIdx] !== undefined;
                      const isActive = activeCaseChildIndex === cqIdx;

                      return (
                        <button
                          key={cqIdx}
                          onClick={() => setActiveCaseChildIndex(cqIdx)}
                          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isActive
                              ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-1 ring-blue-400"
                              : isAnswered
                              ? "bg-blue-950/60 border border-blue-500/30 text-blue-300 hover:bg-slate-800"
                              : "bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                          }`}
                        >
                          <span>Q{cq.questionNumber || cqIdx + 1}</span>
                          {isAnswered && <span className="text-[10px] text-emerald-400">✓</span>}
                        </button>
                      );
                    })}
                  </div>

                  <span className="text-xs text-slate-400 font-mono">
                    Question {activeCaseChildIndex + 1} of {currentQ.questions.length}
                  </span>
                </div>

                {/* Active Child Question Card */}
                {(() => {
                  const activeCQ = currentQ.questions[activeCaseChildIndex] || currentQ.questions[0];
                  const ansMap = currentAnswer || {};
                  const childAns = ansMap[activeCaseChildIndex];
                  const isRevealed =
                    (showAnswer || partShowAnswer[`cq_${activeCaseChildIndex}`]) &&
                    mode === "study" &&
                    showAnswersAndExplanations;

                  return (
                    <div className="p-6 rounded-2xl bg-slate-850 border border-slate-700/80 flex flex-col gap-4 shadow-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                          Question {activeCQ.questionNumber || activeCaseChildIndex + 1} of {currentQ.questions.length}
                        </span>
                        <span className="text-[11px] px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium">
                          {activeCQ.questionType}
                        </span>
                      </div>

                      <div className="text-slate-100 text-sm sm:text-base font-medium leading-relaxed">
                        {activeCQ.question}
                      </div>

                      {/* Child Options (Multiple Choice or Multiple Select) */}
                      {activeCQ.options && (
                        <div className="grid gap-2.5">
                          {activeCQ.options.map((opt, oIdx) => {
                            const isMulti =
                              activeCQ.questionType === "Multiple Select" ||
                              activeCQ.questionType === "Multiple Choice (Select Two)";
                            const isSelected = isMulti
                              ? Array.isArray(childAns) && childAns.includes(opt)
                              : childAns === opt;
                            const isCorrect = isMulti
                              ? (activeCQ.correctAnswers || []).includes(opt)
                              : activeCQ.correctAnswer === opt;

                            let btnStyle =
                              "bg-slate-900 border-slate-700/80 text-slate-300 hover:bg-slate-800";
                            if (isRevealed) {
                              if (isCorrect) {
                                btnStyle =
                                  "bg-emerald-950/40 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500";
                              } else if (isSelected && !isCorrect) {
                                btnStyle =
                                  "bg-rose-950/40 border-rose-500 text-rose-200 ring-1 ring-rose-500";
                              }
                            } else if (isSelected) {
                              btnStyle = "bg-blue-600/20 border-blue-500 text-blue-200";
                            }

                            return (
                              <button
                                key={oIdx}
                                onClick={() => {
                                  if (isMulti) {
                                    const currentList: string[] = Array.isArray(childAns)
                                      ? childAns
                                      : [];
                                    const nextList = currentList.includes(opt)
                                      ? currentList.filter((x) => x !== opt)
                                      : [...currentList, opt];
                                    handleCaseChildAnswer(currentQ.id, activeCaseChildIndex, nextList);
                                  } else {
                                    handleCaseChildAnswer(currentQ.id, activeCaseChildIndex, opt);
                                  }
                                }}
                                className={`p-3.5 rounded-xl border text-xs sm:text-sm text-left transition-all flex items-start gap-3 ${btnStyle}`}
                              >
                                <div
                                  className={`w-5 h-5 rounded-${
                                    isMulti ? "md" : "full"
                                  } border flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                                    isRevealed && isCorrect
                                      ? "border-emerald-500 bg-emerald-500 text-slate-950"
                                      : isRevealed && isSelected && !isCorrect
                                      ? "border-rose-500 bg-rose-500 text-white"
                                      : isSelected
                                      ? "border-blue-500 bg-blue-500 text-white"
                                      : "border-slate-600 text-slate-400"
                                  }`}
                                >
                                  {isMulti
                                    ? isSelected
                                      ? "✓"
                                      : ""
                                    : String.fromCharCode(65 + oIdx)}
                                </div>
                                <span className="flex-1 leading-normal">{opt}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {/* Child Hotspot / Subquestions (e.g. Q63 CQ5) */}
                      {activeCQ.subQuestions && (
                        <div className="grid gap-3">
                          {activeCQ.subQuestions.map((sq, sqIdx) => {
                            const sqVal = (childAns || {})[sqIdx.toString()] || "";
                            const isCorrect = sqVal === sq.correctAnswer;
                            return (
                              <div
                                key={sqIdx}
                                className="p-4 rounded-xl bg-slate-900 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <span className="text-xs sm:text-sm font-semibold text-slate-200">
                                  {sq.prompt}:
                                </span>
                                <div className="flex items-center gap-2">
                                  <select
                                    value={sqVal}
                                    onChange={(e) => {
                                      const nextMap = {
                                        ...(childAns || {}),
                                        [sqIdx.toString()]: e.target.value,
                                      };
                                      handleCaseChildAnswer(currentQ.id, activeCaseChildIndex, nextMap);
                                    }}
                                    className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                  >
                                    <option value="">-- Select option --</option>
                                    {(sq.options || []).map((opt) => (
                                      <option key={opt} value={opt}>
                                        {opt}
                                      </option>
                                    ))}
                                  </select>
                                  {isRevealed && (
                                    <span
                                      className={`text-xs px-2.5 py-1 rounded-md font-bold ${
                                        isCorrect
                                          ? "text-emerald-400 bg-emerald-500/20"
                                          : "text-rose-400 bg-rose-500/20"
                                      }`}
                                    >
                                      Target: {sq.correctAnswer}
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Child Question Navigation & Check Answer */}
                      <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-800">
                        <div className="flex items-center gap-2">
                          <button
                            disabled={activeCaseChildIndex <= 0}
                            onClick={() =>
                              setActiveCaseChildIndex((prev) => Math.max(0, prev - 1))
                            }
                            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            ← Previous Question
                          </button>

                          <button
                            disabled={activeCaseChildIndex >= currentQ.questions.length - 1}
                            onClick={() =>
                              setActiveCaseChildIndex((prev) =>
                                Math.min(currentQ.questions!.length - 1, prev + 1)
                              )
                            }
                            className="px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900 text-xs text-slate-300 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            Next Question →
                          </button>
                        </div>

                        {mode === "study" && showAnswersAndExplanations && !isRevealed && (
                          <button
                            onClick={() =>
                              setPartShowAnswer((prev) => ({
                                ...prev,
                                [`cq_${activeCaseChildIndex}`]: true,
                              }))
                            }
                            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                          >
                            Check Question {activeCQ.questionNumber || activeCaseChildIndex + 1}
                          </button>
                        )}
                      </div>

                      {/* Child Explanation */}
                      {isRevealed && activeCQ.explanation && (
                        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line animate-in fade-in duration-200">
                          <div className="font-bold text-emerald-400 mb-1 flex items-center gap-1.5">
                            <span>💡</span> Architectural Rationale:
                          </div>
                          {activeCQ.explanation}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}
          </div>

          {/* Action Bar: Check Answer & Rationale */}
          <div className="mt-8 pt-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => {
                  setCurrentIndex((prev) => prev - 1);
                  setShowAnswer(false);
                }}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <button
                disabled={currentIndex === activeQuestions.length - 1}
                onClick={() => {
                  setCurrentIndex((prev) => prev + 1);
                  setShowAnswer(false);
                }}
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold border border-slate-700 bg-slate-850 hover:bg-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>

            {/* Check Answer Button (Practice Mode with answer display active) */}
            {mode === "study" && showAnswersAndExplanations && !showAnswer && (
              <button
                onClick={handleCheckAnswer}
                className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2"
              >
                <span>Check Answer & Rationale</span>
              </button>
            )}

            {showAnswer && mode === "study" && (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                Answer & Explanation Revealed
              </span>
            )}
          </div>

          {/* Explanation Section */}
          {showAnswer &&
            mode === "study" &&
            showAnswersAndExplanations &&
            (currentQ.explanation ||
              (currentQ.statements && currentQ.statements.some((s) => s.explanation)) ||
              (currentQ.references && currentQ.references.length > 0) ||
              currentQ.reference) && (
              <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-4 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <span>💡</span>
                  <span>Explanation & Architectural Rationale</span>
                </div>

                {currentQ.explanation && (
                  <div className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {currentQ.explanation}
                  </div>
                )}

                {/* Statement Rationale Breakdown if present */}
                {currentQ.statements &&
                  currentQ.statements.some((s) => s.explanation) && (
                    <div className="pt-3 border-t border-slate-850 space-y-2">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Statement Rationale Breakdown:
                      </div>
                      {currentQ.statements.map(
                        (s, sIdx) =>
                          s.explanation && (
                            <div
                              key={sIdx}
                              className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-xl border border-slate-800 leading-relaxed"
                            >
                              <div className="font-semibold text-slate-200 mb-1 flex items-center justify-between">
                                <span>Statement {sIdx + 1}: {s.statement}</span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    s.correctAnswer === "Yes"
                                      ? "bg-emerald-500/20 text-emerald-400"
                                      : "bg-rose-500/20 text-rose-400"
                                  }`}
                                >
                                  Correct: {s.correctAnswer}
                                </span>
                              </div>
                              <p className="text-slate-400">{s.explanation}</p>
                            </div>
                          )
                      )}
                    </div>
                  )}

              {/* Wrong Options Explanation if present */}
              {currentQ.wrongOptionsExplanation &&
                Object.keys(currentQ.wrongOptionsExplanation).length > 0 && (
                  <div className="pt-3 border-t border-slate-850">
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Why Other Options Are Incorrect:
                    </div>
                    <div className="space-y-2">
                      {Object.entries(currentQ.wrongOptionsExplanation).map(
                        ([optKey, exp], idx) => (
                          <div
                            key={idx}
                            className="text-xs text-slate-400 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800"
                          >
                            <strong className="text-rose-400">{optKey}:</strong> {String(exp)}
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}

              {/* References */}
              {(currentQ.reference || currentQ.references) && (
                <div className="pt-3 border-t border-slate-850 text-xs text-slate-400">
                  <span className="font-semibold text-slate-300">
                    Official Microsoft References:
                  </span>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {currentQ.references ? (
                      currentQ.references.map((ref, rIdx) => (
                        <span
                          key={rIdx}
                          className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-[11px] text-blue-400"
                        >
                          {ref}
                        </span>
                      ))
                    ) : (
                      <a
                        href={currentQ.reference}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline hover:text-blue-300"
                      >
                        {currentQ.reference}
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Slide-over Question Palette */}
      {showPalette && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h3 className="font-bold text-base text-white">Question Palette</h3>
              <button
                onClick={() => setShowPalette(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="flex items-center gap-3 my-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" /> Answered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700" /> Unanswered
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-amber-400 font-bold">★</span> Bookmarked
              </span>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-2 pr-1">
              {activeQuestions.map((q, idx) => {
                const isCurrent = idx === currentIndex;
                const isAnswered = userAnswers[q.id] !== undefined;
                const isBookmarked = flaggedIds.includes(q.id);

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowAnswer(false);
                      setShowPalette(false);
                    }}
                    className={`h-11 rounded-xl text-xs font-bold border transition-all relative flex flex-col items-center justify-center ${
                      isCurrent
                        ? "border-blue-400 ring-2 ring-blue-500 bg-blue-600/30 text-white"
                        : isAnswered
                        ? "border-blue-500/40 bg-blue-900/30 text-blue-200"
                        : "border-slate-800 bg-slate-850 text-slate-400 hover:border-slate-700 hover:text-slate-200"
                    }`}
                  >
                    <span>{idx + 1}</span>
                    {isBookmarked && (
                      <span className="absolute top-1 right-1 text-[9px] text-amber-400">
                        ★
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={() => {
                  setShowPalette(false);
                  setView("results");
                }}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
              >
                Finish & View Score Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
