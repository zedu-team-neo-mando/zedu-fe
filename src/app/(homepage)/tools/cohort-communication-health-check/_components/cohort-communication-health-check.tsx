"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

const questions = [
  {
    area: "Clarity",
    prompt: "How do learners know where to post an update or ask for help?",
    context: "Think about the channels and tools your cohort uses day to day.",
    answers: [
      [
        "There is one clear place for each kind of conversation.",
        "Keep your channel guide visible as new learners join.",
      ],
      [
        "We have some guidance, though people still ask where to post.",
        "Add examples of what belongs in each channel.",
      ],
      [
        "It depends on the person or the tool they happen to check.",
        "Choose one home for cohort updates and direct questions there.",
      ],
      [
        "There is no shared approach yet.",
        "Start with spaces for announcements, questions, and resources.",
      ],
    ],
  },
  {
    area: "Clarity",
    prompt: "How reliably do learners see important announcements?",
    context: "Consider schedule changes, deadlines, and urgent cohort updates.",
    answers: [
      [
        "Updates go to a dedicated, easy-to-find announcement space.",
        "Keep announcements in one space and make ownership clear.",
      ],
      [
        "Most updates are easy to find, but a few get buried.",
        "Pin key updates and use a consistent format for urgent posts.",
      ],
      [
        "Learners miss updates across several chats or tools.",
        "Reduce the number of places where official updates appear.",
      ],
      [
        "We repeat updates individually when someone misses them.",
        "Create a shared announcement channel for the whole cohort.",
      ],
    ],
  },
  {
    area: "Responsiveness",
    prompt: "What usually happens when a learner asks a question?",
    context:
      "Think about the speed and consistency of the first useful response.",
    answers: [
      [
        "A mentor or peer responds promptly where others can learn too.",
        "Keep useful answers in shared threads for the whole cohort.",
      ],
      [
        "Most questions get answered, though timing varies.",
        "Set a response expectation and identify a backup mentor.",
      ],
      [
        "Questions can sit unanswered until someone follows up privately.",
        "Assign a regular check-in owner for learner questions.",
      ],
      [
        "We do not have a reliable way to notice unanswered questions.",
        "Use a shared questions space and daily unanswered-question check.",
      ],
    ],
  },
  {
    area: "Findability",
    prompt: "How easy is it to find a resource or answer shared earlier?",
    context:
      "For example, lesson links, assignment instructions, or common answers.",
    answers: [
      [
        "Resources are organized and searchable in a shared space.",
        "Use consistent names and review resource links between modules.",
      ],
      [
        "We can usually find things, but it takes some searching.",
        "Create a simple index for recurring resources and answers.",
      ],
      [
        "We often ask someone to resend a link or explain it again.",
        "Collect recurring links in one cohort resource space.",
      ],
      [
        "Resources are scattered across messages, drives, and chats.",
        "Pick one shared home for materials and link to it from updates.",
      ],
    ],
  },
  {
    area: "Belonging",
    prompt: "How does your team notice when a learner is disengaging?",
    context: "Think about silence, missed check-ins, or requests for help.",
    answers: [
      [
        "Mentors have regular check-ins and a clear way to raise concerns.",
        "Keep check-ins regular and make the support route visible.",
      ],
      [
        "We notice most cases, but often after a learner goes quiet.",
        "Add a predictable check-in before major milestones.",
      ],
      [
        "It depends on an individual mentor spotting a change.",
        "Agree on a lightweight way to flag learners needing support.",
      ],
      [
        "We usually find out only when a learner reaches out.",
        "Offer a weekly pulse check and a clear route to ask for help.",
      ],
    ],
  },
  {
    area: "Belonging",
    prompt: "How easy is it to give feedback or raise a concern?",
    context: "Consider whether the route is clear, welcoming, and followed up.",
    answers: [
      [
        "There is a clear route, and learners hear what happened next.",
        "Keep closing the loop so learners know feedback was heard.",
      ],
      [
        "Learners know where to go, but follow-up is not always visible.",
        "Share a brief summary of actions taken after feedback rounds.",
      ],
      [
        "They can message a mentor, but there is no consistent route.",
        "Name a trusted contact and a private route for sensitive concerns.",
      ],
      [
        "We do not have a dependable feedback process.",
        "Start with a short check-in and explain how responses are handled.",
      ],
    ],
  },
  {
    area: "Responsiveness",
    prompt: "How coordinated are your mentors and instructors?",
    context: "Think about handoffs, learner support, and cohort decisions.",
    answers: [
      [
        "The team shares updates and knows who owns each follow-up.",
        "Keep decisions and follow-up owners in a shared place.",
      ],
      [
        "We coordinate regularly, but some handoffs are missed.",
        "End check-ins with named owners and due dates.",
      ],
      [
        "People coordinate through separate messages and meetings.",
        "Create one shared space for mentor handoffs and decisions.",
      ],
      [
        "There is no regular way for the team to stay aligned.",
        "Set a short weekly staff check-in and keep shared notes.",
      ],
    ],
  },
  {
    area: "Clarity",
    prompt: "How clear are next steps after a lesson or assignment?",
    context: "Consider deadlines, submission details, and where to get help.",
    answers: [
      [
        "Each includes clear actions, dates, and support links.",
        "Keep using the same concise checklist format for each milestone.",
      ],
      [
        "Most are clear, though details vary by instructor.",
        "Share a simple lesson wrap-up template with instructors.",
      ],
      [
        "Learners often need to ask what to do after class.",
        "Post the task, due date, and help route at each lesson's end.",
      ],
      [
        "Instructions are spread across messages and documents.",
        "Bring instructions and due dates together in one update.",
      ],
    ],
  },
] as const;

const areas = [
  "Clarity",
  "Responsiveness",
  "Findability",
  "Belonging",
] as const;
type Area = (typeof areas)[number];

function scoreMessage(score: number) {
  if (score >= 80) {
    return {
      title: "Strong communication foundations",
      text: "Your answers suggest learners can usually find information, get support, and stay connected.",
    };
  }
  if (score >= 55) {
    return {
      title: "A good base with room to improve",
      text: "Several parts of cohort communication are working. A few focused changes could make support more consistent.",
    };
  }
  return {
    title: "A chance to make communication clearer",
    text: "Your answers point to friction for learners or staff. Start with one change that makes updates and help easier to find.",
  };
}

export function CohortCommunicationHealthCheck() {
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [complete, setComplete] = useState(false);
  const choice = answers[step];
  const score = Math.round(
    (answers.reduce((total, answer) => total + (3 - answer), 0) /
      (questions.length * 3)) *
      100
  );
  const result = scoreMessage(score);
  const areaScores = areas.map((area) => {
    const indexes = questions.flatMap((question, index) =>
      question.area === area ? [index] : []
    );
    const earned = indexes.reduce(
      (total, index) =>
        total + (answers[index] === undefined ? 0 : 3 - answers[index]),
      0
    );
    return { area, score: Math.round((earned / (indexes.length * 3)) * 100) };
  });
  const recommendations = answers
    .map((answer, index) => ({
      area: questions[index].area,
      text: questions[index].answers[answer][1],
      rank: answer,
    }))
    .filter((item) => item.rank > 0)
    .sort((first, second) => second.rank - first.rank)
    .slice(0, 3);

  function reset() {
    setStarted(false);
    setStep(0);
    setAnswers([]);
    setComplete(false);
  }

  function next() {
    if (choice === undefined) return;
    if (step === questions.length - 1) setComplete(true);
    else setStep((current) => current + 1);
  }

  return (
    <main className="min-h-[calc(100vh-3rem)] w-screen max-w-screen overflow-x-hidden bg-gradient-to-b from-violet-50 via-white to-white px-4 py-10 sm:px-6 sm:py-16">
      <div className="mx-auto w-full min-w-0 max-w-5xl">
        <p className="mb-6 text-sm font-semibold text-violet-700">
          A free, practical self-assessment
        </p>
        <div className="grid w-full min-w-0 grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-start">
          <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/50 sm:p-8">
            {!started ? (
              <div className="py-3 sm:py-8">
                <p className="mb-4 text-xs font-bold uppercase tracking-wide text-violet-700">
                  About 3 minutes · 8 questions
                </p>
                <h1 className="max-w-2xl break-words text-3xl font-bold tracking-tight text-slate-950 sm:text-5xl">
                  How healthy is communication in your cohort?
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                  Get a quick reflection on how learners find updates,
                  resources, and support in your bootcamp or learning community.
                </p>
                <ul className="mt-7 grid gap-3 text-sm text-slate-700 sm:grid-cols-3">
                  {[
                    "Four areas to reflect on",
                    "Practical next steps",
                    "Results right away",
                  ].map((item) => (
                    <li className="flex items-center gap-2" key={item}>
                      <CheckCircle2
                        aria-hidden="true"
                        className="shrink-0 text-emerald-600"
                        size={17}
                      />
                      {item}
                    </li>
                  ))}
                </ul>
                <button
                  className="mt-9 min-h-12 w-full rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white hover:bg-violet-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-300 sm:w-auto"
                  onClick={() => setStarted(true)}
                  type="button"
                >
                  Start the free check{" "}
                  <ArrowRight
                    aria-hidden="true"
                    className="ml-1 inline"
                    size={18}
                  />
                </button>
                <p className="mt-3 text-xs text-slate-500">
                  No sign-up or email required to see your results.
                </p>
              </div>
            ) : complete ? (
              <div aria-live="polite">
                <div className="flex flex-col gap-5 border-b border-slate-100 pb-7 sm:flex-row sm:items-center">
                  <div className="flex size-28 shrink-0 flex-col items-center justify-center rounded-full border-[7px] border-violet-100 bg-violet-50 text-violet-800">
                    <span className="text-3xl font-bold">{score}</span>
                    <span className="text-[10px] font-bold uppercase">
                      out of 100
                    </span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-violet-700">
                      Your cohort snapshot
                    </p>
                    <h2 className="mt-1 text-2xl font-bold text-slate-950 sm:text-3xl">
                      {result.title}
                    </h2>
                    <p className="mt-2 leading-6 text-slate-600">
                      {result.text}
                    </p>
                  </div>
                </div>
                <h3 className="mt-7 text-lg font-bold text-slate-950">
                  Your communication areas
                </h3>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {areaScores.map(({ area, score: areaScore }) => (
                    <div key={area}>
                      <div className="mb-2 flex justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {area}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {areaScore}%
                        </span>
                      </div>
                      <div
                        aria-label={`${area}: ${areaScore}%`}
                        aria-valuemax={100}
                        aria-valuemin={0}
                        aria-valuenow={areaScore}
                        className="h-2.5 overflow-hidden rounded-full bg-slate-100"
                        role="progressbar"
                      >
                        <div
                          className="h-full rounded-full bg-violet-600"
                          style={{ width: `${areaScore}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <h3 className="mt-8 text-lg font-bold text-slate-950">
                  A few ideas to try
                </h3>
                <ul className="mt-3 space-y-3">
                  {(recommendations.length
                    ? recommendations
                    : [
                        {
                          area: "Clarity" as Area,
                          text: "Share your communication habits with new learners so they can take part from day one.",
                          rank: 0,
                        },
                      ]
                  ).map((item, index) => (
                    <li
                      className="flex gap-3 rounded-xl bg-slate-50 p-4"
                      key={`${item.area}-${item.text}`}
                    >
                      <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-800">
                        {index + 1}
                      </span>
                      <span className="text-sm leading-6 text-slate-700">
                        <strong className="text-slate-900">
                          {item.area}:{" "}
                        </strong>
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8 rounded-2xl bg-violet-700 p-5 text-white sm:p-6">
                  <h3 className="text-xl font-bold">
                    Bring your cohort into one clear workspace.
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-violet-100">
                    Zedu brings organized conversations, cohort collaboration,
                    and learning support together.
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <a
                      className="inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-violet-800 hover:bg-violet-50"
                      href="/auth/sign-up"
                    >
                      Try Zedu for free{" "}
                      <ArrowRight
                        aria-hidden="true"
                        className="ml-2"
                        size={17}
                      />
                    </a>
                    <a
                      className="text-sm font-semibold text-white underline underline-offset-4"
                      href="/solutions/bootcamps"
                    >
                      Explore Zedu for bootcamps
                    </a>
                  </div>
                </div>
                <p className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
                  <strong>About this score:</strong> It is a simple reflection
                  of your answers, not a certified industry benchmark, formal
                  audit, or measure of learner outcomes.
                </p>
                <button
                  className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"
                  onClick={reset}
                  type="button"
                >
                  <RotateCcw aria-hidden="true" size={16} /> Take the check
                  again
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-7">
                  <div className="mb-3 flex justify-between text-sm">
                    <span className="font-semibold text-slate-700">
                      Question {step + 1} of {questions.length}
                    </span>
                    <span className="text-slate-500">
                      {questions[step].area}
                    </span>
                  </div>
                  <div
                    aria-label={`Question ${step + 1} of ${questions.length}`}
                    aria-valuemax={questions.length}
                    aria-valuemin={1}
                    aria-valuenow={step + 1}
                    className="h-2 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                  >
                    <div
                      className="h-full rounded-full bg-violet-600"
                      style={{
                        width: `${((step + 1) / questions.length) * 100}%`,
                      }}
                    />
                  </div>
                </div>
                <fieldset>
                  <legend className="text-xl font-bold leading-snug text-slate-950 sm:text-2xl">
                    {questions[step].prompt}
                  </legend>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {questions[step].context}
                  </p>
                  <div className="mt-6 space-y-3">
                    {questions[step].answers.map(([label], index) => {
                      const selected = choice === index;
                      return (
                        <label
                          className={`flex min-h-14 cursor-pointer items-start gap-3 rounded-xl border p-4 transition focus-within:ring-4 focus-within:ring-violet-100 ${selected ? "border-violet-500 bg-violet-50" : "border-slate-200 hover:border-violet-300 hover:bg-slate-50"}`}
                          key={label}
                        >
                          <input
                            checked={selected}
                            className="sr-only"
                            name={`question-${step}`}
                            onChange={() =>
                              setAnswers((previous) => {
                                const nextAnswers = [...previous];
                                nextAnswers[step] = index;
                                return nextAnswers;
                              })
                            }
                            type="radio"
                            value={index}
                          />
                          <span
                            aria-hidden="true"
                            className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${selected ? "border-violet-700 bg-violet-700 text-white" : "border-slate-300 bg-white"}`}
                          >
                            {selected ? (
                              <Check size={13} strokeWidth={3} />
                            ) : null}
                          </span>
                          <span className="text-sm leading-6 text-slate-700">
                            {label}
                          </span>
                        </label>
                      );
                    })}
                  </div>
                </fieldset>
                <div className="mt-7 flex items-center justify-between gap-3 border-t border-slate-100 pt-5">
                  <button
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 disabled:opacity-40"
                    disabled={step === 0}
                    onClick={() => setStep((current) => current - 1)}
                    type="button"
                  >
                    <ArrowLeft aria-hidden="true" size={16} /> Back
                  </button>
                  <button
                    className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-violet-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-800 disabled:cursor-not-allowed disabled:bg-violet-300"
                    disabled={choice === undefined}
                    onClick={next}
                    type="button"
                  >
                    {step === questions.length - 1
                      ? "See my results"
                      : "Next question"}
                    <ArrowRight aria-hidden="true" size={16} />
                  </button>
                </div>
              </div>
            )}
          </section>

          <aside className="w-full min-w-0 rounded-3xl border border-violet-100 bg-violet-50 p-5 sm:p-7">
            <p className="text-sm font-bold uppercase tracking-wide text-violet-800">
              Your cohort, better connected
            </p>
            <h2 className="mt-3 text-2xl font-bold leading-tight text-slate-950">
              Clear spaces help learning communities move forward.
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Zedu helps organize conversations, share resources, and keep
              learners and educators connected.
            </p>
            <ul className="mt-6 space-y-3 text-sm font-medium text-slate-700">
              {[
                "Focused channels for every cohort",
                "Conversations and resources in one place",
                "Tools to keep educators and learners aligned",
              ].map((item) => (
                <li
                  className="flex items-start gap-3 rounded-xl bg-white/80 p-3"
                  key={item}
                >
                  <CheckCircle2
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-violet-700"
                    size={17}
                  />{" "}
                  {item}
                </li>
              ))}
            </ul>
            <a
              className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-violet-800 underline underline-offset-4"
              href="/solutions/bootcamps"
            >
              See how Zedu supports bootcamps{" "}
              <ArrowRight aria-hidden="true" size={16} />
            </a>
          </aside>
        </div>
        <p className="mx-auto mt-8 max-w-3xl text-center text-xs leading-5 text-slate-500">
          Your answers stay in this browser session and are used only for your
          on-screen summary. No email or account is required.
        </p>
      </div>
    </main>
  );
}
