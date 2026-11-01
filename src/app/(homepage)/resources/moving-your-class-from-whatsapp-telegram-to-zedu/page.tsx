import Link from "next/link";

export const metadata = {
  title: "Move Your Class from WhatsApp/Telegram to Zedu",
  description:
    "Is your class group a mess of lost messages and buried files? Learn how to move from WhatsApp or Telegram to organised channels on Zedu, step by step.",
  alternates: {
    canonical: "/resources/moving-your-class-from-whatsapp-telegram-to-zedu",
  },
};

const GuidePage = () => {
  return (
    <section className="px-4 py-12 max-w-4xl mx-auto">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-semibold mb-3">
          MOVING YOUR CLASS FROM
          <span className="text-primary-500"> WHATSAPP/TELEGRAM</span>
          <span className="text-neutral-900"> TO ZEDU</span>
        </h1>
        <p className="max-w-2xl mx-auto text-neutral-600">
          If you teach in Nigeria or anywhere in Africa, your classroom may live
          in a WhatsApp or Telegram group. It works at first — but convenience
          becomes chaos. This guide explains why chat apps get messy for classes
          and how to move to organised channels on
          <span className="text-primary-500 font-semibold"> Zedu</span> without
          losing students.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="col-span-2 bg-white rounded-lg p-6 shadow-sm border border-primary-50">
          <h2 className="text-lg font-semibold text-neutral-900 mb-2">
            Why chat apps get messy for classes
          </h2>
          <p className="text-neutral-700">
            What starts as a convenient shortcut slowly turns into a source of
            stress for you and your students. Below are the common pain points
            teachers face.
          </p>
        </div>

        <div className="flex flex-col items-center justify-center bg-primary-50/40 rounded-lg p-4">
          <img
            src="/images/homepage/resources/image-5.jfif"
            alt="class online"
            className="rounded-md shadow-sm w-full h-auto object-cover mb-3"
          />
          <span className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm">
            Most popular
          </span>
        </div>
      </div>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        WHY CHAT APPS GET MESSY FOR CLASSES
      </h2>

      <ol className="list-decimal list-inside space-y-3 text-neutral-700">
        <li>
          <strong>Messages get lost</strong>
          <p>
            A student asks a question at 9 a.m. By noon, two hundred other
            messages have buried it. You never answer it, and the student stops
            asking.
          </p>
        </li>
        <li>
          <strong>Everything is in one stream</strong>
          <p>
            There are no topics, no sections and no way to tell what matters.
          </p>
        </li>
        <li>
          <strong>Files get buried</strong>
          <p>
            Slides, PDFs, past questions, recordings and reading lists are
            shared once and then disappear into the chat history.
          </p>
        </li>
        <li>
          <strong>No structure for learning</strong>
        </li>
        <li>
          <strong>Distractions are everywhere</strong>
        </li>
        <li>
          <strong>Hard to manage as you grow</strong>
        </li>
      </ol>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        WHAT CHANGES WITH ORGANISED CHANNELS
      </h2>
      <p className="mb-4 text-neutral-700">
        On Zedu, your class is organised into channels, each one with a clear
        purpose. Instead of one long stream, you can have separate spaces for
        announcements, lessons, resources, questions and general discussion.
        Students always know where to look, and you always know where to post.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        HOW TO MOVE YOUR CLASS, STEP BY STEP
      </h2>
      <p className="mb-4 text-neutral-700">
        You do not have to move everything in one day, and you do not have to
        abandon your chat group overnight. A gentle, planned move works best.
      </p>

      <h3 className="font-semibold mt-4">Step 1: Create your Zedu account</h3>
      <p className="mb-3 text-neutral-700">
        Sign up for free and set up your space. It only takes a few minutes, and
        you do not need any technical skills.
      </p>

      <div className="mb-6">
        <Link
          href="/auth/sign-up"
          className="inline-block bg-primary-500 text-white px-4 py-2 rounded-md font-medium"
        >
          Get started for free
        </Link>
      </div>

      <h3 className="font-semibold mt-4">
        Step 2: Plan your channels before you create them
      </h3>
      <ul className="list-disc list-inside mb-3 text-neutral-700">
        <li>
          Announcements, for deadlines, schedule changes and important news
        </li>
        <li>Lessons, for each topic or week</li>
        <li>Resources, for slides, notes, past questions and links</li>
        <li>Questions, so students can ask and get answers in one place</li>
        <li>General discussion, for everything else</li>
      </ul>

      <h3 className="font-semibold mt-4">
        Step 3: Add your existing materials
      </h3>
      <p className="mb-3 text-neutral-700">
        Take the files you have been resending again and again and place them in
        the right channels...
      </p>

      <h3 className="font-semibold mt-4">Step 4: Invite your students</h3>
      <p className="mb-3 text-neutral-700">
        Share your invitation with your class, and post it in your existing
        WhatsApp or Telegram group...
      </p>

      <h3 className="font-semibold mt-4">Step 5: Explain why you are moving</h3>
      <p className="mb-3 text-neutral-700">
        Students are more willing to switch when they understand the benefit to
        them...
      </p>

      <h3 className="font-semibold mt-4">
        Step 6: Run both for a short transition period
      </h3>
      <p className="mb-3 text-neutral-700">
        For one or two weeks, keep your old group open but use it only to point
        students to Zedu...
      </p>

      <h3 className="font-semibold mt-4">
        Step 7: Close the old group, or switch it to announcements only
      </h3>
      <p className="mb-3 text-neutral-700">
        Once most of your students have moved, either archive the chat group or
        leave it only as a place for reminders...
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">
        TIPS FOR A SMOOTH TRANSITION
      </h2>
      <ul className="list-disc list-inside text-neutral-700">
        <li>
          Pick a start date, such as the beginning of a new week, module or
          month, and tell everyone in advance.
        </li>
        <li>
          Help students who are less comfortable with technology. A short voice
          note or a simple screenshot guide can go a long way.
        </li>
        <li>
          Be consistent. If you keep answering questions in the old chat,
          students will keep using it.
        </li>
        <li>
          Give students a reason to move: the notes, recordings and answers they
          need will be waiting for them in one place.
        </li>
        <li>
          Ask for feedback after the first week and adjust your channels based
          on what your students tell you.
        </li>
      </ul>

      <p className="mt-6 text-neutral-700">
        Education should not be a privilege. That is why moving to Zedu is free
        to start, and why we care about tools that work for teachers and
        learners everywhere, whether you are teaching ten students from your
        living room or an entire cohort across several countries. Good
        organisation should not cost more than the chat app you already use.
      </p>

      <div className="mt-8 mb-12">
        <Link
          href="/auth/sign-up"
          className="inline-block bg-primary-500 text-white px-4 py-2 rounded-md font-medium"
        >
          Get started for free
        </Link>
      </div>
    </section>
  );
};

export default GuidePage;
