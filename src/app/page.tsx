"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import rawQuestions from "@/data/questions.json";

// Type definitions based on questions.json schema
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
  component: string;
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
  id: number;
  question: string;
  options?: string[];
  correctAnswer?: string | string[];
  explanation?: string;
  questionType?: string;
  statements?: StatementItem[];
  mapping?: MappingItem[];
  pairs?: PairItem[];
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
  solutions?: SolutionItem[];
  sections?: { title: string; content: string }[];
  questions?: CaseStudyQuestion[];
}

const DOMAINS = [
  "All Domains",
  "Design Business Continuity Solutions",
  "Design Infrastructure Solutions",
  "Design Data Storage Solutions",
  "Design Identity, Governance, and Monitoring Solutions",
];

// Helper to normalize domain names (e.g. merge Non-Relational Data Storage into Data Storage)
function normalizeDomain(domain: string): string {
  if (domain === "Design Non-Relational Data Storage Solutions") {
    return "Design Data Storage Solutions";
  }
  return domain;
}

export default function AZ305App() {
  const allQuestions = useMemo(() => {
    return (rawQuestions as unknown as Question[]).map((q) => ({
      ...q,
      domain: normalizeDomain(q.domain),
    }));
  }, []);

  // Navigation View: "dashboard" | "quiz" | "results"
  const [view, setView] = useState<"dashboard" | "quiz" | "results">("dashboard");

  // Dashboard Configuration Options
  const [selectedDomain, setSelectedDomain] = useState<string>("All Domains");
  const [mode, setMode] = useState<"study" | "exam">("study");
  const [isRandomized, setIsRandomized] = useState<boolean>(true);
  const [questionCount, setQuestionCount] = useState<number>(50); // Default real exam size
  const [isTimed, setIsTimed] = useState<boolean>(true);
  const [customTimeMinutes, setCustomTimeMinutes] = useState<number>(100); // 100 min real exam

  // Active Session State
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [showAnswer, setShowAnswer] = useState<boolean>(false);
  const [showPalette, setShowPalette] = useState<boolean>(false);
  const [flaggedIds, setFlaggedIds] = useState<number[]>([]);
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Timer State
  const [timeRemaining, setTimeRemaining] = useState<number>(100 * 60);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Bookmarks persistence (localStorage)
  useEffect(() => {
    try {
      const saved = localStorage.getItem("az305_flagged_ids");
      if (saved) {
        setFlaggedIds(JSON.parse(saved));
      }
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

  // Domain statistics
  const domainCounts = useMemo(() => {
    const counts: Record<string, number> = {
      "Design Business Continuity Solutions": 0,
      "Design Infrastructure Solutions": 0,
      "Design Data Storage Solutions": 0,
      "Design Identity, Governance, and Monitoring Solutions": 0,
    };
    allQuestions.forEach((q) => {
      if (counts[q.domain] !== undefined) {
        counts[q.domain]++;
      }
    });
    return counts;
  }, [allQuestions]);

  // Start Quiz Handler
  const startSession = (
    forcedMode?: "study" | "exam",
    forcedCount?: number,
    forcedDomain?: string,
    forcedTimed?: boolean,
    forcedRandom?: boolean
  ) => {
    const chosenMode = forcedMode ?? mode;
    const chosenDomain = forcedDomain ?? selectedDomain;
    const chosenRandom = forcedRandom ?? isRandomized;
    const chosenTimed = forcedTimed ?? isTimed;
    const chosenCount = forcedCount ?? questionCount;

    let pool = allQuestions.filter((q) => {
      if (chosenDomain === "All Domains") return true;
      if (chosenDomain === "Flagged Only") return flaggedIds.includes(q.id);
      return q.domain === chosenDomain;
    });

    if (pool.length === 0) {
      alert("No questions available for this selection! If using Flagged Only, flag some questions first.");
      return;
    }

    if (chosenRandom) {
      pool = [...pool].sort(() => Math.random() - 0.5);
    }

    const finalQuestions = pool.slice(0, Math.min(chosenCount, pool.length));

    setActiveQuestions(finalQuestions);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowAnswer(false);
    setShowPalette(false);
    setSearchQuery("");
    setMode(chosenMode);

    // Setup Timer
    const durationSeconds = customTimeMinutes * 60;
    setTimeRemaining(durationSeconds);
    setElapsedTime(0);

    setView("quiz");
  };

  // Timer Tick Hook
  useEffect(() => {
    if (view === "quiz") {
      timerRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
        if (isTimed) {
          setTimeRemaining((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current!);
              alert("Time has expired! Submitting your exam session now.");
              setView("results");
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [view, isTimed]);

  // Current Active Question
  const currentQ: Question | undefined = activeQuestions[currentIndex];

  const toggleFlag = (id: number) => {
    const updated = flaggedIds.includes(id)
      ? flaggedIds.filter((item) => item !== id)
      : [...flaggedIds, id];
    saveFlags(updated);
  };

  const handleSelectOption = (qid: number, option: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [qid]: option,
    }));
  };

  const handleToggleMultiOption = (qid: number, option: string) => {
    setUserAnswers((prev) => {
      const currentList: string[] = prev[qid] || [];
      if (currentList.includes(option)) {
        return { ...prev, [qid]: currentList.filter((o) => o !== option) };
      } else {
        return { ...prev, [qid]: [...currentList, option] };
      }
    });
  };

  const handleStatementAnswer = (qid: number, statementIdx: number, val: "Yes" | "No") => {
    setUserAnswers((prev) => {
      const currentMap = prev[qid] || {};
      return {
        ...prev,
        [qid]: {
          ...currentMap,
          [statementIdx]: val,
        },
      };
    });
  };

  const handleDropdownSelect = (qid: number, key: string, val: string) => {
    setUserAnswers((prev) => {
      const currentMap = prev[qid] || {};
      return {
        ...prev,
        [qid]: {
          ...currentMap,
          [key]: val,
        },
      };
    });
  };

  // Evaluation algorithm for calculating scores accurately
  const evaluateQuestion = (q: Question, ans: any): boolean => {
    if (!ans) return false;

    // Multiple Choice
    if (q.questionType === "Multiple Choice") {
      return ans === q.correctAnswer;
    }

    // Multiple Select / Select Two
    if (
      q.questionType === "Multiple Select" ||
      q.questionType === "Multiple Choice (Select Two)"
    ) {
      if (!Array.isArray(ans)) return false;
      const expected = Array.isArray(q.correctAnswer)
        ? q.correctAnswer
        : [q.correctAnswer || ""];
      if (ans.length !== expected.length) return false;
      return expected.every((val) => ans.includes(val));
    }

    // Yes/No Statements
    if (
      (q.questionType === "Yes/No Statements Table" ||
        q.questionType === "Yes/No Statements") &&
      q.statements
    ) {
      return q.statements.every((s, idx) => ans[idx] === s.correctAnswer);
    }

    // Dropdown Matching
    if (q.questionType === "Dropdown / Matching" && q.mapping) {
      return q.mapping.every((m) => ans[m.component] === m.selectedOption);
    }

    // Drag and drop pairs
    if (q.questionType === "Drag and Drop / Matching" && q.pairs) {
      return q.pairs.every((p) => ans[p.requirement] === p.answer);
    }

    // Solution Evaluation series
    if (
      q.questionType === "Case Study / Solution Evaluation Series" &&
      q.solutions
    ) {
      return q.solutions.every((sol) => ans[sol.part.toString()] === sol.correctAnswer);
    }

    return false;
  };

  // Results calculation
  const resultsData = useMemo(() => {
    let correctCount = 0;
    const domainBreakdown: Record<
      string,
      { total: number; correct: number; questions: Question[] }
    > = {};

    activeQuestions.forEach((q) => {
      const isCorrect = evaluateQuestion(q, userAnswers[q.id]);
      if (isCorrect) correctCount++;

      if (!domainBreakdown[q.domain]) {
        domainBreakdown[q.domain] = { total: 0, correct: 0, questions: [] };
      }
      domainBreakdown[q.domain].total++;
      if (isCorrect) domainBreakdown[q.domain].correct++;
      domainBreakdown[q.domain].questions.push(q);
    });

    const total = activeQuestions.length;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;
    const scaledScore = Math.round(percent * 10); // Real MS exam scale out of 1000, passing 700

    return {
      total,
      correctCount,
      incorrectCount: total - correctCount,
      percent,
      scaledScore,
      isPassed: scaledScore >= 700,
      domainBreakdown,
    };
  }, [activeQuestions, userAnswers]);

  // Format seconds into MM:SS
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, "0")}:${remainder.toString().padStart(2, "0")}`;
  };

  // ==========================================
  // VIEW 1: DASHBOARD / CONFIGURATION HUB
  // ==========================================
  if (view === "dashboard") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
        {/* Top Header */}
        <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 py-4 sticky top-0 z-20">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-black text-white text-xl shadow-lg shadow-blue-500/20">
                AZ
              </div>
              <div>
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
                  AZ-305 Exam Practice Hub
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold">
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

        {/* Dashboard Main Content */}
        <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
          {/* Hero Banner with Quick Start Presets */}
          <div className="rounded-3xl bg-gradient-to-br from-blue-900/40 via-slate-900 to-slate-900 border border-blue-500/20 p-6 sm:p-8 relative overflow-hidden shadow-2xl">
            <div className="relative z-10 max-w-2xl">
              <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 font-bold text-xs uppercase tracking-wider mb-3">
                Certification Simulation Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
                Configure Your AZ-305 Session
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                Choose between instant-feedback <strong>Study Mode</strong> with detailed architectural rationales, or realistic <strong>Certification Exam Mode</strong> with timed conditions and post-exam score reports.
              </p>

              {/* Quick Launch Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => startSession("exam", 50, "All Domains", true, true)}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center gap-2"
                >
                  <span>⚡ Quick Exam (50 Qs • 100m)</span>
                </button>
                <button
                  onClick={() => startSession("study", 20, "All Domains", false, true)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm transition-all flex items-center gap-2"
                >
                  <span>📖 Practice 20 Random Qs</span>
                </button>
                {flaggedIds.length > 0 && (
                  <button
                    onClick={() => startSession("study", flaggedIds.length, "Flagged Only", false, false)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-sm transition-all"
                  >
                    ★ Review Bookmarks ({flaggedIds.length})
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Custom Session Configuration Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Step 1: Mode & Domain Selection */}
            <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col gap-6 shadow-xl">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs">
                    1
                  </span>
                  Choose Practice Mode
                </h3>
                <p className="text-xs text-slate-400">
                  Select how feedback and answers should be presented.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                  <button
                    onClick={() => setMode("study")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      mode === "study"
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                        : "bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-200">Study / Practice Mode</span>
                      {mode === "study" && <span className="text-blue-400 text-xs font-bold">● Active</span>}
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      Includes the <strong>"Check Answer"</strong> button on every question with instant architectural explanations and Microsoft Learn references.
                    </p>
                  </button>

                  <button
                    onClick={() => setMode("exam")}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      mode === "exam"
                        ? "bg-blue-600/20 border-blue-500 text-white shadow-md shadow-blue-500/10"
                        : "bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-sm text-slate-200">Certification Exam Mode</span>
                      {mode === "exam" && <span className="text-blue-400 text-xs font-bold">● Active</span>}
                    </div>
                    <p className="text-xs text-slate-400 leading-normal">
                      <strong>Answers are hidden</strong> during the test. Full timed experience with scaled 1000-point score report upon completion.
                    </p>
                  </button>
                </div>
              </div>

              {/* Scope / Domain Filter */}
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2 mb-1">
                  <span className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs">
                    2
                  </span>
                  Select Exam Domain Focus
                </h3>
                <p className="text-xs text-slate-400">
                  Target a specific skill domain or practice across all four.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
                  {DOMAINS.map((dom) => {
                    const isSelected = selectedDomain === dom;
                    const count =
                      dom === "All Domains"
                        ? allQuestions.length
                        : domainCounts[dom] || 0;

                    return (
                      <button
                        key={dom}
                        onClick={() => setSelectedDomain(dom)}
                        className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                          isSelected
                            ? "bg-blue-600/20 border-blue-500 text-white font-semibold"
                            : "bg-slate-850 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300"
                        }`}
                      >
                        <span className="truncate pr-2">{dom}</span>
                        <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 font-mono text-[11px] shrink-0">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step 2: Session Parameters & Timer */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 shadow-xl">
              <div className="flex flex-col gap-5">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-600/30 text-blue-400 flex items-center justify-center text-xs">
                    3
                  </span>
                  Session Parameters
                </h3>

                {/* Question Count Selection */}
                <div>
                  <label className="text-xs font-semibold text-slate-300 flex items-center justify-between mb-2">
                    <span>Number of Questions</span>
                    <span className="text-blue-400 font-bold font-mono">{questionCount}</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 50, allQuestions.length].map((num) => (
                      <button
                        key={num}
                        onClick={() => setQuestionCount(num)}
                        className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                          questionCount === num
                            ? "bg-blue-600 border-blue-500 text-white"
                            : "bg-slate-850 border-slate-800 text-slate-400 hover:bg-slate-800"
                        }`}
                      >
                        {num === allQuestions.length ? "All 163" : num}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Randomize Toggle */}
                <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200 block">Randomize Question Order</span>
                    <span className="text-[11px] text-slate-500">Shuffles questions across domains</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={isRandomized}
                    onChange={(e) => setIsRandomized(e.target.checked)}
                    className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                  />
                </div>

                {/* Timed Mode Toggle */}
                <div className="p-3.5 rounded-2xl bg-slate-850 border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-bold text-slate-200 block">Timed Exam Mode</span>
                      <span className="text-[11px] text-slate-500">Enable countdown timer</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={isTimed}
                      onChange={(e) => setIsTimed(e.target.checked)}
                      className="w-5 h-5 accent-blue-600 rounded cursor-pointer"
                    />
                  </div>

                  {isTimed && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
                      <span>Suggested Time:</span>
                      <select
                        value={customTimeMinutes}
                        onChange={(e) => setCustomTimeMinutes(Number(e.target.value))}
                        className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-blue-500"
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

              {/* Start Session CTA */}
              <button
                onClick={() => startSession()}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Launch Session →</span>
              </button>
            </div>
          </div>

          {/* Domain Knowledge Cards */}
          <div>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
              Microsoft AZ-305 Exam Domains
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-blue-400 block mb-1">Domain 1 (25-30%)</span>
                <h4 className="text-sm font-bold text-slate-200 mb-2">Business Continuity Solutions</h4>
                <p className="text-xs text-slate-400 mb-3">Backup policies, disaster recovery (ASR), HA topologies, RPO/RTO.</p>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono text-xs">
                  {domainCounts["Design Business Continuity Solutions"]} Questions
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-blue-400 block mb-1">Domain 2 (25-30%)</span>
                <h4 className="text-sm font-bold text-slate-200 mb-2">Infrastructure Solutions</h4>
                <p className="text-xs text-slate-400 mb-3">Compute architectures, AKS, App Services, hybrid networking, VPN, ExpressRoute.</p>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono text-xs">
                  {domainCounts["Design Infrastructure Solutions"]} Questions
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-blue-400 block mb-1">Domain 3 (20-25%)</span>
                <h4 className="text-sm font-bold text-slate-200 mb-2">Data Storage Solutions</h4>
                <p className="text-xs text-slate-400 mb-3">Azure SQL, Cosmos DB, Blob tiers, Data Lake Gen2, Synapse, storage redundancy.</p>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono text-xs">
                  {domainCounts["Design Data Storage Solutions"]} Questions
                </span>
              </div>

              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-blue-400 block mb-1">Domain 4 (25-30%)</span>
                <h4 className="text-sm font-bold text-slate-200 mb-2">Identity & Monitoring</h4>
                <p className="text-xs text-slate-400 mb-3">Microsoft Entra ID, PIM, Conditional Access, Azure Policy, Log Analytics, Key Vault.</p>
                <span className="px-2.5 py-1 rounded-md bg-slate-800 text-slate-300 font-mono text-xs">
                  {domainCounts["Design Identity, Governance, and Monitoring Solutions"]} Questions
                </span>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: EXAM RESULTS & SCORE REPORT
  // ==========================================
  if (view === "results") {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full mx-auto flex flex-col gap-6">
          {/* Top Return bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setView("dashboard")}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-2"
            >
              ← Back to Dashboard
            </button>
            <span className="text-xs text-slate-400">
              Session completed in {formatTime(elapsedTime)}
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
                {resultsData.isPassed ? "PASSED - CERTIFICATION READY" : "NEEDS FURTHER REVIEW"}
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
                  setShowAnswer(true);
                  setCurrentIndex(0);
                  setView("quiz");
                }}
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all text-center"
              >
                Review All Questions & Rationales
              </button>
              <button
                onClick={() => startSession("exam")}
                className="px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-sm transition-all text-center"
              >
                Retake Exam
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

  // ==========================================
  // VIEW 3: ACTIVE QUIZ / EXAM SESSION
  // ==========================================
  if (!currentQ) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-center">
          <p className="mb-4">No questions found in this session.</p>
          <button
            onClick={() => setView("dashboard")}
            className="px-6 py-2 bg-blue-600 rounded-xl"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const currentAnswer = userAnswers[currentQ.id];
  const isFlagged = flaggedIds.includes(currentQ.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Session Navigation Header */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (mode === "exam" && !confirm("Exit exam session? Your current progress will be lost.")) {
                return;
              }
              setView("dashboard");
            }}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 flex items-center justify-center transition-colors text-sm"
            title="Return to Dashboard"
          >
            ←
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-white">AZ-305 Session</span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  mode === "exam"
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                    : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                }`}
              >
                {mode === "exam" ? "Certification Mode" : "Study Mode"}
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Question {currentIndex + 1} of {activeQuestions.length}
            </p>
          </div>
        </div>

        {/* Center Timer Display */}
        <div className="flex items-center gap-4">
          <div
            className={`px-3.5 py-1.5 rounded-xl border text-xs sm:text-sm font-mono font-bold flex items-center gap-2 ${
              isTimed && timeRemaining < 300
                ? "bg-rose-500/20 border-rose-500/40 text-rose-300 animate-pulse"
                : "bg-slate-800 border-slate-700 text-slate-200"
            }`}
          >
            <span>⏱️</span>
            <span>{isTimed ? formatTime(timeRemaining) : `Elapsed: ${formatTime(elapsedTime)}`}</span>
          </div>

          <button
            onClick={() => toggleFlag(currentQ.id)}
            className={`p-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-1.5 transition-colors ${
              isFlagged
                ? "bg-amber-500/20 border-amber-500/40 text-amber-300"
                : "bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700"
            }`}
            title="Flag question for review"
          >
            <span>{isFlagged ? "★ Flagged" : "☆ Flag"}</span>
          </button>

          <button
            onClick={() => setShowPalette(!showPalette)}
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 transition-colors"
          >
            Palette
          </button>

          {mode === "exam" && (
            <button
              onClick={() => {
                if (confirm("Are you sure you want to submit your exam now?")) {
                  setView("results");
                }
              }}
              className="px-4 py-1.5 rounded-xl text-xs sm:text-sm font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/20 transition-all"
            >
              Submit Exam
            </button>
          )}
        </div>
      </header>

      {/* Main Question Card View */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl">
          {/* Question Metadata Header */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-lg bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold text-xs tracking-wider uppercase">
                Question {currentQ.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 text-xs">
                {currentQ.questionType}
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

          {/* Context Table if present */}
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

          {/* Question Prompt */}
          {currentQ.question && (
            <div className="text-slate-100 text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line mb-6">
              {currentQ.question}
            </div>
          )}

          {/* Interactive Inputs */}
          <div className="mt-4">
            {/* Multiple Choice */}
            {currentQ.questionType === "Multiple Choice" && currentQ.options && (
              <div className="grid gap-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = currentAnswer === opt;
                  const isCorrect = currentQ.correctAnswer === opt;
                  let cardStyle =
                    "bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-200";

                  if (showAnswer && mode === "study") {
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
                          showAnswer && mode === "study" && isCorrect
                            ? "border-emerald-500 bg-emerald-500 text-slate-950"
                            : showAnswer && mode === "study" && isSelected && !isCorrect
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

            {/* Multiple Select */}
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
                      : [currentQ.correctAnswer];
                    const isCorrect = correctAnswers.includes(opt);

                    let cardStyle =
                      "bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-200";

                    if (showAnswer && mode === "study") {
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
                            showAnswer && mode === "study" && isCorrect
                              ? "border-emerald-500 bg-emerald-500 text-slate-950"
                              : showAnswer && mode === "study" && isSelected && !isCorrect
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

            {/* Yes/No Statements Table */}
            {(currentQ.questionType === "Yes/No Statements Table" ||
              currentQ.questionType === "Yes/No Statements") &&
              currentQ.statements && (
                <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/50">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-850/80 text-slate-400 text-xs">
                        <th className="p-3 sm:p-4 font-semibold">Statement</th>
                        <th className="p-3 sm:p-4 text-center w-28">Selection</th>
                        {showAnswer && mode === "study" && <th className="p-3 sm:p-4 text-center w-28">Correct</th>}
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
                            {showAnswer && mode === "study" && (
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

            {/* Dropdown / Matching */}
            {currentQ.questionType === "Dropdown / Matching" && currentQ.mapping && (
              <div className="grid gap-4">
                {currentQ.mapping.map((m, mIdx) => {
                  const currentSelections = currentAnswer || {};
                  const userVal = currentSelections[m.component] || "";
                  const isCorrect = userVal === m.selectedOption;

                  return (
                    <div
                      key={mIdx}
                      className="p-4 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <span className="text-sm font-medium text-slate-200">
                        {m.component}:
                      </span>
                      <div className="flex items-center gap-2">
                        <select
                          value={userVal}
                          onChange={(e) =>
                            handleDropdownSelect(currentQ.id, m.component, e.target.value)
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
                        {showAnswer && mode === "study" && (
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

            {/* Drag and Drop / Matching */}
            {currentQ.questionType === "Drag and Drop / Matching" &&
              (currentQ.pairs || currentQ.subQuestions) && (
                <div className="grid gap-3">
                  {(currentQ.pairs || []).map((p, pIdx) => {
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
                          {showAnswer && mode === "study" && (
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

            {/* Solution Evaluation Series */}
            {currentQ.questionType === "Case Study / Solution Evaluation Series" &&
              currentQ.solutions && (
                <div className="grid gap-6">
                  {currentQ.solutions.map((sol) => {
                    const ansMap = currentAnswer || {};
                    const userVal = ansMap[sol.part.toString()];
                    const isCorrect = userVal === sol.correctAnswer;

                    return (
                      <div
                        key={sol.part}
                        className="p-5 rounded-2xl bg-slate-850 border border-slate-700/80 flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            Part {sol.part} of {currentQ.solutions?.length}
                          </span>
                          {showAnswer && mode === "study" && (
                            <span
                              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                                isCorrect
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              }`}
                            >
                              Correct: {sol.correctAnswer}
                            </span>
                          )}
                        </div>
                        <div className="text-slate-200 text-sm font-medium">
                          <strong>Proposed Solution:</strong> {sol.proposedSolution}
                        </div>
                        <p className="text-xs text-slate-400">{sol.question}</p>

                        <div className="flex items-center gap-3 mt-1">
                          {["Yes", "No"].map((choice) => (
                            <button
                              key={choice}
                              onClick={() =>
                                handleDropdownSelect(currentQ.id, sol.part.toString(), choice)
                              }
                              className={`px-5 py-2 rounded-lg font-bold text-xs sm:text-sm border transition-colors ${
                                userVal === choice
                                  ? "bg-blue-600 border-blue-500 text-white"
                                  : "bg-slate-900 border-slate-700 text-slate-300 hover:bg-slate-800"
                              }`}
                            >
                              {choice}
                            </button>
                          ))}
                        </div>

                        {showAnswer && mode === "study" && sol.explanation && (
                          <div className="mt-2 p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                            💡 {sol.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
          </div>

          {/* Navigation & Action Bar */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              {mode === "study" && (
                <button
                  onClick={() => setShowAnswer(!showAnswer)}
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-md ${
                    showAnswer
                      ? "bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700"
                      : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/20"
                  }`}
                >
                  {showAnswer ? "Hide Explanation" : "Check Answer & Rationale"}
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => {
                  setCurrentIndex((prev) => Math.max(0, prev - 1));
                  setShowAnswer(false);
                }}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <button
                disabled={currentIndex === activeQuestions.length - 1}
                onClick={() => {
                  setCurrentIndex((prev) => Math.min(activeQuestions.length - 1, prev + 1));
                  setShowAnswer(false);
                }}
                className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Architectural Explanation (Study Mode Only) */}
        {showAnswer && mode === "study" && currentQ.explanation && (
          <div className="bg-slate-900/90 border border-blue-500/30 rounded-3xl p-6 sm:p-7 shadow-xl shadow-blue-950/20">
            <div className="flex items-center justify-between gap-3 mb-3">
              <h3 className="text-base font-bold text-blue-400 flex items-center gap-2">
                <span>💡 Architectural Explanation & Rationale</span>
              </h3>
              {currentQ.reference && (
                <a
                  href={currentQ.reference}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-400 hover:text-blue-300 underline font-medium flex items-center gap-1"
                >
                  Microsoft Learn Reference ↗
                </a>
              )}
            </div>
            <div className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
              {currentQ.explanation}
            </div>
          </div>
        )}
      </main>

      {/* Slide-in Question Palette */}
      {showPalette && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Question Palette</h2>
              <button
                onClick={() => setShowPalette(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="py-3 text-xs text-slate-400 flex items-center justify-between">
              <span>{activeQuestions.length} Questions in Session</span>
              <span className="font-semibold text-blue-400">
                {Object.keys(userAnswers).length} Answered
              </span>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-2 p-1">
              {activeQuestions.map((q, idx) => {
                const isCur = idx === currentIndex;
                const hasAnswer = userAnswers[q.id] !== undefined;
                const isFlag = flaggedIds.includes(q.id);

                let btnStyle = "bg-slate-850 text-slate-300 border-slate-700/80";
                if (isCur) {
                  btnStyle = "ring-2 ring-blue-400 bg-blue-600 text-white font-bold";
                } else if (isFlag) {
                  btnStyle = "bg-amber-500/20 text-amber-300 border-amber-500/40";
                } else if (hasAnswer) {
                  btnStyle = "bg-blue-950/40 text-blue-300 border-blue-500/50";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowPalette(false);
                      setShowAnswer(false);
                    }}
                    className={`h-11 rounded-xl text-xs font-medium border transition-all flex flex-col items-center justify-center relative ${btnStyle}`}
                  >
                    <span>{idx + 1}</span>
                    <span className="text-[9px] text-slate-500">Q{q.id}</span>
                    {isFlag && (
                      <span className="absolute top-1 right-1 text-[8px] text-amber-400">
                        ★
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
