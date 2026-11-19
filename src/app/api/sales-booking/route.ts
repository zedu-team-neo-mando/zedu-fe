import { z } from "zod";

const reply = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
const details = z.object({
  start: z.string().datetime(),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  organisation: z.string().trim().max(200),
  interests: z.string().trim().max(2000),
});
function configuration() {
  const event = new URL(process.env.CALENDLY_EVENT_TYPE_URI || "");
  if (
    event.protocol !== "https:" ||
    event.hostname !== "api.calendly.com" ||
    !/^\/event_types\/[\w-]+$/.test(event.pathname) ||
    event.username ||
    event.password ||
    event.port ||
    event.search ||
    event.hash ||
    !process.env.CALENDLY_API_TOKEN
  )
    throw new Error("configuration");
  return event;
}
async function calendly(url: URL, body?: unknown) {
  return fetch(url, {
    method: body ? "POST" : "GET",
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${process.env.CALENDLY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
    signal: AbortSignal.timeout(15000),
    redirect: "error",
  });
}
export async function GET(request: Request) {
  const day = new URL(request.url).searchParams.get("date") || "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day))
    return reply({ error: "Choose a valid date." }, 400);
  if (!z.string().date().safeParse(day).success)
    return reply({ error: "Choose a valid date." }, 400);
  const midnight = Date.parse(`${day}T00:00:00+01:00`);
  const start = Math.max(midnight, Date.now() + 1000);
  const end = midnight + 86400000;
  if (
    !Number.isFinite(start) ||
    end <= start ||
    start > Date.now() + 366 * 86400000
  )
    return reply({ error: "Choose a future date within the next year." }, 400);
  try {
    const event = configuration();
    const url = new URL("/event_type_available_times", event);
    url.search = new URLSearchParams({
      event_type: event.href,
      start_time: new Date(start).toISOString(),
      end_time: new Date(end).toISOString(),
    }).toString();
    const response = await calendly(url);
    if (!response.ok)
      return reply(
        { error: "Availability could not be loaded. Please try again." },
        503
      );
    const data = await response.json();
    const slots = z
      .array(
        z.object({ start_time: z.string().datetime(), status: z.string() })
      )
      .parse(data.collection);
    return reply({
      times: slots
        .filter((s) => s.status === "available")
        .map((s) => s.start_time),
    });
  } catch {
    return reply(
      {
        error:
          "Online availability is temporarily unavailable. Please use our booking link or send an enquiry.",
      },
      503
    );
  }
}
export async function POST(request: Request) {
  const expectedOrigin = `${new URL(request.url).protocol}//${request.headers.get("host")}`;
  if (request.headers.get("origin") !== expectedOrigin)
    return reply({ error: "Invalid request origin." }, 403);
  try {
    if ((await request.clone().text()).length > 5000)
      return reply({ error: "Request too large." }, 413);
    const parsed = details.safeParse(await request.json());
    if (!parsed.success || Date.parse(parsed.data.start) <= Date.now())
      return reply(
        { error: "Check your details and choose a future time." },
        400
      );
    const data = parsed.data;
    const event = configuration();
    const metadata = await calendly(event);
    if (!metadata.ok)
      return reply(
        { error: "Booking is temporarily unavailable. Please try later." },
        503
      );
    const { resource: type } = await metadata.json();
    if (type.duration !== 30)
      return reply(
        { error: "This demo is not configured for 30 minutes." },
        503
      );
    const answers = [data.interests, data.organisation]
      .map((answer, position) => ({
        question: type.custom_questions?.find(
          (q: { position: number }) => q.position === position
        )?.name,
        answer,
        position,
      }))
      .filter((a) => a.answer && a.question);
    const response = await calendly(new URL("/invitees", event), {
      event_type: event.href,
      start_time: data.start,
      invitee: { name: data.name, email: data.email, timezone: "Africa/Lagos" },
      location: { kind: "zoom_conference" },
      questions_and_answers: answers,
    });
    if (!response.ok) {
      if ([400, 409, 422].includes(response.status))
        return reply(
          {
            error:
              "This time could not be booked. Your details have been kept; please choose another time.",
            chooseAnother: true,
          },
          409
        );
      return reply(
        {
          error:
            "Calendly could not accept this booking. Please use our booking link or try later.",
        },
        503
      );
    }
    const result = await response.json();
    if (response.status !== 201 || result.resource?.status !== "active")
      return reply(
        {
          error:
            "Booking status is uncertain. Please check your calendar or contact us before trying again.",
          uncertain: true,
        },
        502
      );
    return reply({ confirmed: true });
  } catch {
    return reply(
      {
        error:
          "Booking status is uncertain. Please check your calendar or contact us before trying again.",
        uncertain: true,
      },
      502
    );
  }
}
