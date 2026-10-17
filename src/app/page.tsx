"use client";

import React, { useState, useMemo, useEffect } from "react";
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

export default function QuizApp() {
  const allQuestions = rawQuestions as unknown as Question[];

  // App State
  const [selectedDomain, setSelectedDomain] = useState("All Domains");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [flaggedIds, setFlaggedIds] = useState<number[]>([]);
  const [showPalette, setShowPalette] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);

  // User answers per question ID: can be string, string[], or object
  const [userAnswers, setUserAnswers] = useState<Record<number, any>>({});
  const [evaluatedQuestions, setEvaluatedQuestions] = useState<Record<number, boolean>>({});

  // Filter questions
  const filteredQuestions = useMemo(() => {
    return allQuestions.filter((q) => {
      const matchDomain =
        selectedDomain === "All Domains"
          ? true
          : selectedDomain === "Design Data Storage Solutions"
          ? q.domain === "Design Data Storage Solutions" ||
            q.domain === "Design Non-Relational Data Storage Solutions"
          : q.domain === selectedDomain;

      if (!matchDomain) return false;

      if (searchQuery.trim() === "") return true;

      const qText = (q.question || q.scenario || "").toLowerCase();
      const topicText = (q.topic || q.subdomain || "").toLowerCase();
      const idMatch = q.id.toString() === searchQuery.trim();
      const queryLower = searchQuery.toLowerCase();

      return idMatch || qText.includes(queryLower) || topicText.includes(queryLower);
    });
  }, [allQuestions, selectedDomain, searchQuery]);

  // Ensure currentIndex stays within bounds when filters change
  useEffect(() => {
    if (currentIndex >= filteredQuestions.length) {
      setCurrentIndex(0);
    }
    setShowAnswer(false);
  }, [filteredQuestions, currentIndex]);

  const currentQ: Question | undefined = filteredQuestions[currentIndex];

  const toggleFlag = (id: number) => {
    setFlaggedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
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

  const resetAll = () => {
    if (confirm("Are you sure you want to reset all answers and progress?")) {
      setUserAnswers({});
      setEvaluatedQuestions({});
      setFlaggedIds([]);
      setCurrentIndex(0);
      setShowAnswer(false);
    }
  };

  if (!currentQ) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-slate-800 p-8 rounded-2xl shadow-xl max-w-md w-full border border-slate-700">
          <p className="text-xl font-bold text-slate-200 mb-4">No questions match your filter.</p>
          <button
            onClick={() => {
              setSelectedDomain("All Domains");
              setSearchQuery("");
            }}
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>
    );
  }

  // Answer state for current question
  const currentAnswer = userAnswers[currentQ.id];
  const isFlagged = flaggedIds.includes(currentQ.id);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-3 sm:px-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 font-black text-white text-lg">
            AZ
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              AZ-305 Exam Simulator
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">
                163 Questions
              </span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">
              Microsoft Certified: Azure Solutions Architect Expert
            </p>
          </div>
        </div>

        {/* Global Stats & Navigation quick controls */}
        <div className="flex items-center gap-2 sm:gap-3">
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
            className="px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium bg-slate-800 border border-slate-700 hover:bg-slate-700 text-slate-200 transition-colors flex items-center gap-1.5"
          >
            <span>Question Palette</span>
            <span className="px-1.5 py-0.2 rounded bg-slate-700 text-[11px] font-mono">
              {currentIndex + 1}/{filteredQuestions.length}
            </span>
          </button>

          <button
            onClick={resetAll}
            className="p-2 text-xs text-slate-400 hover:text-rose-400 transition-colors"
            title="Reset progress"
          >
            Reset
          </button>
        </div>
      </header>

      {/* Filter and Control Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 sm:px-6 flex flex-wrap items-center justify-between gap-3 text-sm">
        <div className="flex flex-wrap items-center gap-2 flex-1 min-w-[280px]">
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-full truncate"
          >
            {DOMAINS.map((d) => (
              <option key={d} value={d}>
                {d === "All Domains" ? "All Domains (163)" : d}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Search keywords or Q#..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs sm:text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 w-44 sm:w-60"
          />
        </div>

        <div className="text-xs text-slate-400 flex items-center gap-3">
          <span>
            Domain count: <strong className="text-slate-200">{filteredQuestions.length}</strong>
          </span>
          <span>
            Answered:{" "}
            <strong className="text-blue-400">
              {Object.keys(userAnswers).length}/{allQuestions.length}
            </strong>
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
        {/* Question Header Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
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

          {/* Scenario / Case Study Header if applicable */}
          {currentQ.scenario && (
            <div className="mb-6 p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 text-sm leading-relaxed whitespace-pre-line">
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

          {/* Context Table if applicable */}
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

          {/* Main Question Text */}
          {currentQ.question && (
            <div className="text-slate-100 text-base sm:text-lg font-medium leading-relaxed whitespace-pre-line mb-6">
              {currentQ.question}
            </div>
          )}

          {/* Render Interactive Body based on question type */}
          <div className="mt-4">
            {/* Multiple Choice */}
            {currentQ.questionType === "Multiple Choice" && currentQ.options && (
              <div className="grid gap-3">
                {currentQ.options.map((opt, oIdx) => {
                  const isSelected = currentAnswer === opt;
                  const isCorrect = currentQ.correctAnswer === opt;
                  let cardStyle =
                    "bg-slate-850 hover:bg-slate-800 border-slate-700/80 text-slate-200";

                  if (showAnswer) {
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
                          showAnswer && isCorrect
                            ? "border-emerald-500 bg-emerald-500 text-slate-950"
                            : showAnswer && isSelected && !isCorrect
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

            {/* Multiple Select / Select Two */}
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

                    if (showAnswer) {
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
                            showAnswer && isCorrect
                              ? "border-emerald-500 bg-emerald-500 text-slate-950"
                              : showAnswer && isSelected && !isCorrect
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
                        {showAnswer && <th className="p-3 sm:p-4 text-center w-28">Correct</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {currentQ.statements.map((stmt, sIdx) => {
                        const answerMap = currentAnswer || {};
                        const userVal = answerMap[sIdx];
                        const isCorrect = userVal === stmt.correctAnswer;

                        return (
                          <tr key={sIdx} className="hover:bg-slate-850/40">
                            <td className="p-3 sm:p-4 text-slate-200 text-xs sm:text-sm">
                              {stmt.statement}
                            </td>
                            <td className="p-3 sm:p-4 text-center">
                              <div className="inline-flex rounded-lg border border-slate-700 p-0.5 bg-slate-900">
                                <button
                                  onClick={() =>
                                    handleStatementAnswer(currentQ.id, sIdx, "Yes")
                                  }
                                  className={`px-3 py-1 rounded-md text-xs font-bold transition-colors ${
                                    userVal === "Yes"
                                      ? "bg-blue-600 text-white"
                                      : "text-slate-400 hover:text-white"
                                  }`}
                                >
                                  Yes
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatementAnswer(currentQ.id, sIdx, "No")
                                  }
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
                            {showAnswer && (
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
                        {showAnswer && (
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
                          {showAnswer && (
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

            {/* Case Study / Solution Evaluation Series */}
            {currentQ.questionType === "Case Study / Solution Evaluation Series" &&
              currentQ.solutions && (
                <div className="grid gap-6">
                  {currentQ.solutions.map((sol) => {
                    const ansMap = currentAnswer || {};
                    const userVal = ansMap[sol.part];
                    const isCorrect = userVal === sol.correctAnswer;

                    return (
                      <div
                        key={sol.part}
                        className="p-5 rounded-xl bg-slate-850 border border-slate-700/80 flex flex-col gap-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-wider text-blue-400">
                            Part {sol.part} of {currentQ.solutions?.length}
                          </span>
                          {showAnswer && (
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

                        {showAnswer && sol.explanation && (
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

          {/* Action Buttons: Check Answer & Nav */}
          <div className="mt-8 pt-6 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
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
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                className="px-4 py-2 rounded-xl text-sm font-medium bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                ← Previous
              </button>
              <button
                disabled={currentIndex === filteredQuestions.length - 1}
                onClick={() =>
                  setCurrentIndex((prev) =>
                    Math.min(filteredQuestions.length - 1, prev + 1)
                  )
                }
                className="px-5 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next →
              </button>
            </div>
          </div>
        </div>

        {/* Rich Explanation Card */}
        {showAnswer && currentQ.explanation && (
          <div className="bg-slate-900/90 border border-blue-500/30 rounded-2xl p-6 sm:p-7 shadow-xl shadow-blue-950/20">
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

      {/* Slide-in Question Palette Drawer */}
      {showPalette && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-lg font-bold text-white">Question Navigator</h2>
              <button
                onClick={() => setShowPalette(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <div className="py-4 text-xs text-slate-400 flex items-center justify-between">
              <span>Jump directly to any question</span>
              <span className="font-semibold text-slate-200">
                Total: {filteredQuestions.length}
              </span>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-5 sm:grid-cols-6 gap-2 p-1">
              {filteredQuestions.map((q, idx) => {
                const isCur = idx === currentIndex;
                const hasAnswer = userAnswers[q.id] !== undefined;
                const isFlag = flaggedIds.includes(q.id);

                let btnStyle = "bg-slate-800 text-slate-300 border-slate-700";
                if (isCur) {
                  btnStyle = "ring-2 ring-blue-400 bg-blue-600 text-white font-bold";
                } else if (isFlag) {
                  btnStyle = "bg-amber-500/20 text-amber-300 border-amber-500/40";
                } else if (hasAnswer) {
                  btnStyle = "bg-emerald-950/40 text-emerald-300 border-emerald-500/50";
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowPalette(false);
                    }}
                    className={`h-11 rounded-xl text-xs font-medium border transition-all flex flex-col items-center justify-center relative ${btnStyle}`}
                  >
                    <span>{q.id}</span>
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
