import Link from "next/link";

const title = "Running student office hours with Zedu Buzz";

const agenda = [
  [
    "0–3 minutes",
    "Welcome learners, introduce the topic and explain how to ask questions.",
  ],
  ["3–8 minutes", "Explain one common question with a short example."],
  [
    "8–23 minutes",
    "Work through selected questions, grouping similar ones and checking understanding.",
  ],
  [
    "23–27 minutes",
    "Invite learners to explain their next step or summarise what they learned.",
  ],
  [
    "27–30 minutes",
    "List unresolved questions, agree on follow-up actions and close the session.",
  ],
];

export default function StudentOfficeHoursGuide() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-8 sm:py-20">
      <Link
        href="/resources"
        className="text-primary-500 underline underline-offset-4"
      >
        Back to resources
      </Link>
      <article className="prose prose-slate mt-8 max-w-none prose-headings:scroll-mt-24 prose-a:text-primary-500">
        <header>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary-500">
            Guide · Teaching with Buzz
          </p>
          <h1>{title}</h1>
          <p className="lead">
            Office hours give learners a regular place to ask questions they
            could not resolve during class. Collect questions in a class
            channel, discuss them in a Buzz meeting, and post a written recap
            afterward. The agenda below is a suggested teaching routine, not a
            built-in scheduling feature.
          </p>
        </header>

        <section aria-labelledby="before-session">
          <h2 id="before-session">Before the session</h2>
          <p>
            Announce the date, time, time zone, audience and topics in the class
            channel. Ask learners to submit questions beforehand so you can
            group related questions. Ask for the exact step that failed and what
            they have tried. Remove passwords, access tokens and personal
            information from examples.
          </p>
          <h3>Announcement template</h3>
          <div className="rounded-xl border bg-slate-50 p-5">
            <p className="m-0 whitespace-pre-line break-words">{`Office hours: [course or cohort]
Date and time: [date, time, time zone]
Topic: [lesson or assignment]
Question deadline: [deadline]
Joining information: [meeting link or instructions once available]
A written recap will be posted here afterward.`}</p>
          </div>
        </section>

        <section aria-labelledby="student-question">
          <h2 id="student-question">Student question template</h2>
          <div className="rounded-xl border bg-slate-50 p-5">
            <p className="m-0 whitespace-pre-line break-words">{`Topic or lesson:
What I am trying to understand or do:
Where I got stuck:
What I have already tried:
Example or error message, with private information removed:
My specific question:`}</p>
          </div>
          <p>
            For example: “I am filtering a list of assignments, but the result
            is empty even when items should match. I checked the field names and
            printed the input. Which comparison should I investigate?”
          </p>
        </section>

        <section aria-labelledby="prepare-meeting">
          <h2 id="prepare-meeting">Prepare the meeting</h2>
          <p>
            Open Buzz in your workspace and use <strong>New meeting</strong>.
            Share the joining information shown by the app in your class
            channel. Check your microphone, connection and teaching materials
            before the session, and make sure learners know where to find the
            joining information.
          </p>
          <p>
            Plan announcements and follow-up yourself; this routine does not
            depend on automated reminders, attendance tracking or recording.
          </p>
        </section>

        <section aria-labelledby="session-agenda">
          <h2 id="session-agenda">Suggested 30-minute agenda</h2>
          <ol className="list-none space-y-4 pl-0">
            {agenda.map(([time, activity]) => (
              <li key={time} className="rounded-xl border p-4 sm:flex sm:gap-6">
                <strong className="block shrink-0 sm:w-32">{time}</strong>
                <span>{activity}</span>
              </li>
            ))}
          </ol>
          <p>
            Adjust the timing to your group. If a learner needs individual
            attention, arrange a separate follow-up so the remaining questions
            still get time.
          </p>
        </section>

        <section aria-labelledby="participation">
          <h2 id="participation">Make participation easier</h2>
          <ul>
            <li>
              Accept written questions before the session and read them aloud.
            </li>
            <li>Explain technical terms and allow time for a response.</li>
            <li>
              Offer written follow-up for learners with unreliable connections
              or those who cannot attend.
            </li>
          </ul>
          <p>
            If you record using an available tool, explain the plan and obtain
            any required consent first. Do not promise a recording unless you
            have confirmed how you will make and share it.
          </p>
        </section>

        <section aria-labelledby="after-session">
          <h2 id="after-session">After the session</h2>
          <p>
            Post a concise recap in the same class channel without private
            learner details. Include useful explanations and resources, not just
            a list of attendees.
          </p>
          <h3>Recap template</h3>
          <div className="rounded-xl border bg-slate-50 p-5">
            <p className="m-0 whitespace-pre-line break-words">{`Office hours recap: [date and topic]
Questions discussed:
Key explanations or resources:
Questions still open:
Next action and person responsible:
Next session, if confirmed:`}</p>
          </div>
          <p>
            Ask whether the recap answers learners’ questions and give realistic
            dates for follow-up. Start with one session and adapt the next one
            from the feedback you receive.
          </p>
        </section>

        <aside
          aria-labelledby="next-steps"
          className="mt-10 rounded-xl bg-slate-50 p-6"
        >
          <h2 id="next-steps" className="mt-0">
            Plan your next session
          </h2>
          <p>
            Explore <Link href="/products/buzz">Zedu Buzz</Link> and learn how
            Zedu supports{" "}
            <Link href="/solutions/bootcamps">bootcamp cohorts</Link>. Ready to
            get started? <Link href="/auth/sign-up">Create a Zedu account</Link>
            .
          </p>
        </aside>
      </article>
    </main>
  );
}
