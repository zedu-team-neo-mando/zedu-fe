export type CalculatorResult = {
  learnerCount: number;
  durationMonths: number;
  slackMonthlyEstimate: number;
  slackDurationTotal: number;
  zeduMonthlyPrice: number;
  zeduDurationTotal: number;
  monthlySavings: number;
  durationSavings: number;
  savingsPercentage: number;
};

const currency = (value: number) =>
  "₦" + Math.round(value).toLocaleString("en-NG");

/** Render a fixed-size card so exports are legible on every screen size. */
export async function createCalculatorResultImage(
  result: CalculatorResult
): Promise<File> {
  const canvas = document.createElement("canvas");
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Image creation is unavailable in this browser.");
  ctx.textBaseline = "top";

  const card = (
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, 24);
    ctx.fill();
  };
  const text = (
    value: string,
    x: number,
    y: number,
    size: number,
    color: string,
    weight = 400,
    maxWidth = 936
  ) => {
    let fontSize = size;
    ctx.font = `${weight} ${fontSize}px "Segoe UI", Arial, sans-serif`;
    while (ctx.measureText(value).width > maxWidth && fontSize > 18) {
      fontSize -= 2;
      ctx.font = `${weight} ${fontSize}px "Segoe UI", Arial, sans-serif`;
    }
    ctx.fillStyle = color;
    ctx.fillText(value, x, y);
  };

  ctx.fillStyle = "#F5F3FF";
  ctx.fillRect(0, 0, 1080, 1080);
  const gradient = ctx.createLinearGradient(0, 0, 1080, 260);
  gradient.addColorStop(0, "#7141F8");
  gradient.addColorStop(1, "#48249A");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1080, 240);
  text("Zedu", 72, 40, 44, "#FFFFFF", 700);
  text("Your cohort. More savings.", 72, 110, 48, "#FFFFFF", 700);
  text(
    "Slack vs. Zedu Pro · Estimated cost comparison",
    72,
    178,
    24,
    "#EDE9FE"
  );

  card(48, 272, 984, 616, "#FFFFFF");
  card(72, 296, 936, 64, "#EDE9FE");
  const months = `${result.durationMonths} month${result.durationMonths === 1 ? "" : "s"}`;
  text(
    `${result.learnerCount.toLocaleString("en-NG")} learners · ${months}`,
    100,
    313,
    28,
    "#48249A",
    600
  );

  const costs = (
    x: number,
    platform: string,
    monthly: number,
    total: number,
    highlight: boolean
  ) => {
    card(x, 384, 456, 266, highlight ? "#F5F3FF" : "#F7F7F8");
    const color = highlight ? "#7141F8" : "#344054";
    text(platform, x + 24, 408, 26, color, 600, 408);
    text(currency(monthly), x + 24, 458, 42, color, 700, 408);
    text("per month", x + 24, 511, 21, "#667085");
    text(`Total for ${months}`, x + 24, 563, 20, "#667085");
    text(currency(total), x + 24, 598, 34, "#1D2939", 600, 408);
  };
  costs(
    72,
    "Slack (estimated)",
    result.slackMonthlyEstimate,
    result.slackDurationTotal,
    false
  );
  costs(
    552,
    "Zedu Pro (flat price)",
    result.zeduMonthlyPrice,
    result.zeduDurationTotal,
    true
  );

  card(72, 676, 936, 184, "#7141F8");
  text(
    `ESTIMATED SAVINGS OVER ${months.toUpperCase()}`,
    100,
    702,
    20,
    "#EDE9FE",
    600,
    850
  );
  text(currency(result.durationSavings), 100, 741, 54, "#FFFFFF", 700, 570);
  text(
    `${result.savingsPercentage.toFixed(1)}%`,
    748,
    741,
    48,
    "#FFFFFF",
    700,
    232
  );
  text(
    `${currency(result.monthlySavings)} saved per month`,
    100,
    811,
    21,
    "#EDE9FE",
    400,
    600
  );
  text("lower cost", 748, 807, 21, "#EDE9FE");

  text(
    `Slack estimate: ${currency(result.slackMonthlyEstimate / result.learnerCount)} per learner/month.`,
    72,
    924,
    21,
    "#667085"
  );
  text(
    "Illustrative estimate only. Actual Slack pricing may vary.",
    72,
    958,
    21,
    "#667085"
  );
  text("Plan your next cohort with Zedu", 72, 1020, 22, "#7141F8", 600);

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((value) => {
      if (value) resolve(value);
      else reject(new Error("Could not create the result image."));
    }, "image/png");
  });
  return new File(
    [blob],
    `zedu-vs-slack-${result.learnerCount}-learners-${result.durationMonths}-months.png`,
    { type: "image/png" }
  );
}

export function downloadCalculatorResultImage(file: File): void {
  const url = URL.createObjectURL(file);
  const link = document.createElement("a");
  try {
    link.href = url;
    link.download = file.name;
    document.body.append(link);
    link.click();
  } finally {
    link.remove();
    // Let the browser consume the file before releasing its object URL.
    window.setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}

/** Call with a prepared file, directly from a click, to retain user activation. */
export async function shareCalculatorResultImage(
  file: File
): Promise<"shared" | "downloaded" | "cancelled"> {
  try {
    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: "My Slack vs. Zedu estimate",
        text: "See my estimated cohort costs and savings with Zedu.",
      });
      return "shared";
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError")
      return "cancelled";
  }
  downloadCalculatorResultImage(file);
  return "downloaded";
}
