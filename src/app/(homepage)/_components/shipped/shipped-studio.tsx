"use client";

import { useEffect, useMemo, useState } from "react";
import { Copy, Download } from "lucide-react";
import { showError, showSuccess } from "~/components/toast/sonner";
import {
  SHIPPED_HASHTAG,
  SHIPPED_TRACKER_KEY,
  SHIPPED_TRACKS,
  captionTemplates,
  cardFields,
  trackerCsv,
  type ShippedCardInput,
  type ShippedTrackerRow,
} from "~/lib/shipped-on-zedu";

const EMPTY_CARD: ShippedCardInput = {
  title: "",
  name: "",
  track: "Frontend",
  cohort: "",
  before: "",
  after: "",
};

const EMPTY_LOG = {
  platform: "LinkedIn",
  postUrl: "",
  likes: "",
  reposts: "",
  signups: "",
};

const fieldClass =
  "h-12 w-full rounded-xl border border-neutral-200 bg-white px-4 text-base text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";

function readTracker(): ShippedTrackerRow[] {
  try {
    const saved = JSON.parse(localStorage.getItem(SHIPPED_TRACKER_KEY) || "[]");
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

async function copyText(value: string, success: string) {
  try {
    await navigator.clipboard.writeText(value);
    showSuccess(success);
  } catch {
    showError("Could not copy that. Select it and copy it manually.");
  }
}

function drawCard(
  canvas: HTMLCanvasElement,
  card: ShippedCardInput
): Promise<void> {
  const size = 1080;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return Promise.resolve();

  ctx.fillStyle = "#7141F8";
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = "#ffffff";
  roundRect(ctx, 72, 72, size - 144, size - 144, 36);
  ctx.fill();

  ctx.fillStyle = "#7141F8";
  ctx.font = "700 28px Lato, sans-serif";
  ctx.fillText("ZEDU", 120, 160);

  ctx.fillStyle = "#1F2530";
  ctx.font = "700 64px Lato, sans-serif";
  ctx.fillText("Shipped on Zedu", 120, 260);

  ctx.fillStyle = "#344054";
  ctx.font = "600 40px Lato, sans-serif";
  wrapText(ctx, card.title, 120, 350, 840, 52);

  let y = 560;
  if (card.before || card.after) {
    ctx.font = "600 28px Lato, sans-serif";
    ctx.fillStyle = "#667085";
    ctx.fillText("Before", 120, y);
    ctx.fillText("After", 560, y);
    ctx.font = "500 32px Lato, sans-serif";
    ctx.fillStyle = "#1F2530";
    wrapText(ctx, card.before || "—", 120, y + 48, 380, 40);
    wrapText(ctx, card.after || "—", 560, y + 48, 380, 40);
    y = 760;
  }

  ctx.fillStyle = "#5A6170";
  ctx.font = "600 30px Lato, sans-serif";
  ctx.fillText(`${card.name}  ·  ${card.track}  ·  ${card.cohort}`, 120, y);

  ctx.fillStyle = "#F4F1FF";
  roundRect(ctx, 120, 900, 320, 64, 32);
  ctx.fill();
  ctx.fillStyle = "#7141F8";
  ctx.font = "700 28px Lato, sans-serif";
  ctx.fillText(SHIPPED_HASHTAG, 148, 942);

  return Promise.resolve();
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + width, y, x + width, y + height, radius);
  ctx.arcTo(x + width, y + height, x, y + height, radius);
  ctx.arcTo(x, y + height, x, y, radius);
  ctx.arcTo(x, y, x + width, y, radius);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(/\s+/);
  let line = "";
  let cursor = y;
  let lines = 0;
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (ctx.measureText(next).width > maxWidth && line) {
      ctx.fillText(line, x, cursor);
      line = word;
      cursor += lineHeight;
      lines += 1;
      if (lines === 3) break;
    } else {
      line = next;
    }
  }
  if (lines < 3 && line) ctx.fillText(line, x, cursor);
}

export function ShippedStudio() {
  const [input, setInput] = useState<ShippedCardInput>(EMPTY_CARD);
  const [rows, setRows] = useState<ShippedTrackerRow[]>([]);
  const [log, setLog] = useState(EMPTY_LOG);
  const card = useMemo(() => cardFields(input), [input]);
  const captions = useMemo(() => captionTemplates(input), [input]);

  useEffect(() => {
    setRows(readTracker());
  }, []);

  const update = (key: keyof ShippedCardInput, value: string) => {
    setInput((current) => ({ ...current, [key]: value }));
  };

  const downloadCard = async () => {
    const canvas = document.createElement("canvas");
    await drawCard(canvas, card);
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "shipped-on-zedu.png";
    link.click();
  };

  const addRow = () => {
    if (!log.postUrl.trim()) {
      showError("Add the link to the post before logging it.");
      return;
    }
    const next = [
      {
        date: new Date().toISOString().slice(0, 10),
        intern: card.name,
        track: card.track,
        cohort: card.cohort,
        ticket: card.title,
        platform: log.platform,
        postUrl: log.postUrl.trim(),
        likes: log.likes.trim() || "0",
        reposts: log.reposts.trim() || "0",
        signups: log.signups.trim() || "0",
      },
      ...rows,
    ];
    setRows(next);
    localStorage.setItem(SHIPPED_TRACKER_KEY, JSON.stringify(next));
    setLog(EMPTY_LOG);
    showSuccess("Post added to your tracker");
  };

  const downloadTracker = () => {
    const blob = new Blob([trackerCsv(rows)], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "shipped-on-zedu-tracker.csv";
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-16 px-4 py-12 sm:px-8 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-wide text-primary-500">
          {SHIPPED_HASHTAG}
        </p>
        <h1 className="mt-3 text-4xl font-black text-neutral-900 sm:text-5xl">
          Shipped on Zedu
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-neutral-600">
          Fill in the ticket you shipped. The card, the three captions, and the
          hashtag update as you type. No design tool needed.
        </p>
      </header>

      <section className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_420px]">
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => event.preventDefault()}
        >
          <label className="flex flex-col gap-1.5 text-sm font-bold text-neutral-900">
            Ticket title
            <input
              className={fieldClass}
              value={input.title}
              maxLength={140}
              placeholder="Fixed: DM message box now shows the person's name"
              onChange={(event) => update("title", event.target.value)}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-bold text-neutral-900">
              Your name
              <input
                className={fieldClass}
                value={input.name}
                maxLength={80}
                onChange={(event) => update("name", event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-bold text-neutral-900">
              Track
              <select
                className={fieldClass}
                value={input.track}
                onChange={(event) => update("track", event.target.value)}
              >
                {SHIPPED_TRACKS.map((track) => (
                  <option key={track}>{track}</option>
                ))}
              </select>
            </label>
          </div>
          <label className="flex flex-col gap-1.5 text-sm font-bold text-neutral-900">
            Cohort
            <input
              className={fieldClass}
              value={input.cohort}
              maxLength={60}
              placeholder="HNG 13"
              onChange={(event) => update("cohort", event.target.value)}
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm font-bold text-neutral-900">
              Before
              <textarea
                className={`${fieldClass} h-24 py-3`}
                value={input.before}
                maxLength={140}
                onChange={(event) => update("before", event.target.value)}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-bold text-neutral-900">
              After
              <textarea
                className={`${fieldClass} h-24 py-3`}
                value={input.after}
                maxLength={140}
                onChange={(event) => update("after", event.target.value)}
              />
            </label>
          </div>
          <button
            type="button"
            onClick={downloadCard}
            className="inline-flex h-12 items-center justify-center gap-2 self-start rounded-xl bg-primary-500 px-5 text-sm font-bold text-white hover:bg-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            <Download className="size-4" aria-hidden="true" />
            Download card
          </button>
        </form>

        <CardPreview card={card} />
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-black text-neutral-900">
          Caption templates
        </h2>
        <p className="max-w-3xl text-neutral-600">
          Copy one, then edit it before you post. Every caption already includes{" "}
          {SHIPPED_HASHTAG}.
        </p>
        <div className="grid gap-4 lg:grid-cols-3">
          {captions.map((caption) => (
            <article
              key={caption.id}
              className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5"
            >
              <h3 className="text-lg font-bold text-neutral-900">
                {caption.label}
              </h3>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-neutral-700">
                {caption.text}
              </p>
              <button
                type="button"
                onClick={() =>
                  copyText(caption.text, `${caption.label} caption copied`)
                }
                className="mt-auto inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-neutral-200 text-sm font-bold text-neutral-900 hover:border-primary-500 hover:bg-primary-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                <Copy className="size-4" aria-hidden="true" />
                Copy caption
              </button>
            </article>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-2xl font-black text-neutral-900">Post tracker</h2>
        <p className="max-w-3xl text-neutral-600">
          Log each post here, then download the CSV and paste new rows into the
          team sheet. Columns are date, intern, track, cohort, ticket, platform,
          post URL, likes, reposts, and sign-ups.
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <select
            className={fieldClass}
            aria-label="Platform"
            value={log.platform}
            onChange={(event) =>
              setLog((current) => ({
                ...current,
                platform: event.target.value,
              }))
            }
          >
            <option>LinkedIn</option>
            <option>X</option>
            <option>Other</option>
          </select>
          <input
            className={`${fieldClass} lg:col-span-2`}
            aria-label="Post URL"
            placeholder="Link to the post"
            value={log.postUrl}
            onChange={(event) =>
              setLog((current) => ({ ...current, postUrl: event.target.value }))
            }
          />
          <input
            className={fieldClass}
            aria-label="Likes"
            inputMode="numeric"
            placeholder="Likes"
            value={log.likes}
            onChange={(event) =>
              setLog((current) => ({ ...current, likes: event.target.value }))
            }
          />
          <input
            className={fieldClass}
            aria-label="Reposts"
            inputMode="numeric"
            placeholder="Reposts"
            value={log.reposts}
            onChange={(event) =>
              setLog((current) => ({ ...current, reposts: event.target.value }))
            }
          />
          <input
            className={fieldClass}
            aria-label="Sign-ups"
            inputMode="numeric"
            placeholder="Sign-ups"
            value={log.signups}
            onChange={(event) =>
              setLog((current) => ({ ...current, signups: event.target.value }))
            }
          />
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addRow}
            className="inline-flex h-12 items-center justify-center rounded-xl bg-primary-500 px-5 text-sm font-bold text-white hover:bg-primary-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
          >
            Add post
          </button>
          <button
            type="button"
            onClick={downloadTracker}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-neutral-200 px-5 text-sm font-bold text-neutral-900 hover:border-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
          >
            <Download className="size-4" aria-hidden="true" />
            Download tracker
          </button>
        </div>
        {rows.length > 0 && (
          <div className="overflow-x-auto rounded-2xl border border-neutral-200">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-neutral-50 text-neutral-600">
                <tr>
                  <th className="px-4 py-3 font-semibold">Date</th>
                  <th className="px-4 py-3 font-semibold">Platform</th>
                  <th className="px-4 py-3 font-semibold">Ticket</th>
                  <th className="px-4 py-3 font-semibold">Likes</th>
                  <th className="px-4 py-3 font-semibold">Reposts</th>
                  <th className="px-4 py-3 font-semibold">Sign-ups</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr
                    key={`${row.date}-${row.postUrl}`}
                    className="border-t border-neutral-200"
                  >
                    <td className="px-4 py-3">{row.date}</td>
                    <td className="px-4 py-3">{row.platform}</td>
                    <td className="px-4 py-3">{row.ticket}</td>
                    <td className="px-4 py-3">{row.likes}</td>
                    <td className="px-4 py-3">{row.reposts}</td>
                    <td className="px-4 py-3">{row.signups}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function CardPreview({ card }: { card: ShippedCardInput }) {
  return (
    <aside
      aria-label="Shipped on Zedu card preview"
      className="rounded-[28px] bg-primary-500 p-5 text-neutral-900 shadow-lg sm:p-6"
    >
      <div className="flex min-h-[420px] flex-col rounded-3xl bg-white p-6">
        <p className="text-sm font-black tracking-wide text-primary-500">
          ZEDU
        </p>
        <p className="mt-6 text-3xl font-black">Shipped on Zedu</p>
        <p className="mt-4 text-lg font-semibold leading-snug">{card.title}</p>
        {(card.before || card.after) && (
          <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-bold text-neutral-500">Before</p>
              <p className="mt-1">{card.before || "—"}</p>
            </div>
            <div>
              <p className="font-bold text-neutral-500">After</p>
              <p className="mt-1">{card.after || "—"}</p>
            </div>
          </div>
        )}
        <p className="mt-auto pt-8 text-sm font-semibold text-neutral-600">
          {card.name} · {card.track} · {card.cohort}
        </p>
        <p className="mt-4 inline-flex w-fit rounded-full bg-primary-50 px-4 py-2 text-sm font-bold text-primary-500">
          {SHIPPED_HASHTAG}
        </p>
      </div>
    </aside>
  );
}
