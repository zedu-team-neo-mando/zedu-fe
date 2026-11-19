import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import {
  shareCardDisplayUrl,
  type ShareCardContent,
  type ShareCardHighlight,
} from "./share-cards";

export const shareCardSize = { width: 1200, height: 630 };
export const shareCardContentType = "image/png";

// Brand colours (tailwind.config.ts: primary-500, primary-50/100, neutral text).
const PURPLE = "#7141f8";
const LAVENDER = "#f4f1ff";
const LAVENDER_DEEP = "#e3d9fe";
const INK = "#1f2530";
const MUTED = "#5a6170";

type HeadlineWord = { word: string; accent: boolean };

function headlineWords(parts: ShareCardContent["headline"]): HeadlineWord[] {
  return parts.flatMap((part) => {
    const accent = typeof part !== "string";
    const text = typeof part === "string" ? part : part.accent;
    return text
      .split(/\s+/)
      .filter(Boolean)
      .map((word) => ({ word, accent }));
  });
}

// Lato is the site font (public/fonts/Lato.ttf). It ships one weight, and
// ImageResponse cannot make text bold, so headings get a thin same-colour
// outline to match the weight of the site's headings.
async function loadAssets() {
  const publicDir = path.join(process.cwd(), "public");
  const [font, logo] = await Promise.all([
    readFile(path.join(publicDir, "fonts", "Lato.ttf")),
    readFile(path.join(publicDir, "Zedu.png")),
  ]);
  return {
    font,
    logoSrc: `data:image/png;base64,${logo.toString("base64")}`,
  };
}

const NAIRA = "\u20A6";

// Lato has no naira sign, and without it ImageResponse tries to download a
// fallback font at render time. Draw the sign instead so nothing is fetched.
function NairaSign({ color }: { color: string }) {
  return (
    <svg width={22} height={24} viewBox="0 0 22 24" style={{ marginRight: 2 }}>
      <path
        d="M3.5 21.5V3L18.5 21.5V3"
        fill="none"
        stroke={color}
        strokeWidth={3.2}
      />
      <path
        d="M0 9.5H22M0 15.5H22"
        fill="none"
        stroke={color}
        strokeWidth={2.2}
      />
    </svg>
  );
}

function PriceText({ value, color }: { value: string; color: string }) {
  if (!value.startsWith(NAIRA)) return <>{value}</>;
  return (
    <>
      <NairaSign color={color} />
      {value.slice(NAIRA.length)}
    </>
  );
}

function HighlightCard({ item }: { item: ShareCardHighlight }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "22px 28px",
        borderRadius: 20,
        backgroundColor: "#ffffff",
        border: `2px solid ${item.featured ? PURPLE : "#ffffff"}`,
        boxShadow: "0 10px 30px rgba(113, 65, 248, 0.12)",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
        <div
          style={{
            display: "flex",
            fontSize: 28,
            color: INK,
            lineHeight: 1.2,
            WebkitTextStroke: `0.8px ${INK}`,
          }}
        >
          {item.title}
        </div>
        {item.detail ? (
          <div
            style={{
              display: "flex",
              marginTop: 6,
              fontSize: 20,
              color: MUTED,
              lineHeight: 1.25,
            }}
          >
            {item.detail}
          </div>
        ) : null}
      </div>
      {item.value ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: 20,
            fontSize: 28,
            color: PURPLE,
            WebkitTextStroke: `0.8px ${PURPLE}`,
          }}
        >
          <PriceText value={item.value} color={PURPLE} />
        </div>
      ) : null}
    </div>
  );
}

/** One 1200x630 share card for a marketing page. */
export async function renderShareCard(card: ShareCardContent) {
  const { font, logoSrc } = await loadAssets();
  const words = headlineWords(card.headline);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        position: "relative",
        backgroundColor: LAVENDER,
        fontFamily: "Lato",
      }}
    >
      <div
        style={{
          position: "absolute",
          right: -160,
          bottom: -260,
          width: 640,
          height: 640,
          borderRadius: 320,
          backgroundColor: LAVENDER_DEEP,
          opacity: 0.7,
        }}
      />

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 600,
          height: "100%",
          padding: "56px 0 52px 72px",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} width={115} height={50} alt="Zedu" />

        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            marginTop: 40,
            padding: "8px 22px",
            borderRadius: 999,
            backgroundColor: PURPLE,
            color: "#ffffff",
            fontSize: 24,
            lineHeight: 1.2,
          }}
        >
          {card.eyebrow}
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            marginTop: 24,
            fontSize: 54,
            lineHeight: 1.12,
            color: INK,
          }}
        >
          {words.map(({ word, accent }, index) => (
            <span
              key={`${word}-${index}`}
              style={{
                marginRight: 14,
                color: accent ? PURPLE : INK,
                WebkitTextStroke: `1.6px ${accent ? PURPLE : INK}`,
              }}
            >
              {word}
            </span>
          ))}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 24,
            lineHeight: 1.35,
            color: MUTED,
            maxWidth: 500,
          }}
        >
          {card.subtitle}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: "auto",
            fontSize: 26,
            color: PURPLE,
            WebkitTextStroke: `0.6px ${PURPLE}`,
          }}
        >
          {shareCardDisplayUrl(card.path)}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 18,
          width: 480,
          marginLeft: 20,
        }}
      >
        {card.highlights.slice(0, 3).map((item) => (
          <HighlightCard key={item.title} item={item} />
        ))}
      </div>
    </div>,
    {
      ...shareCardSize,
      fonts: [{ name: "Lato", data: font, style: "normal", weight: 400 }],
    }
  );
}
