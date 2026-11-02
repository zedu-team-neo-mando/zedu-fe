"use client";
import { useEffect, useRef, useState } from "react";
import {
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Globe,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const sampleTimes = [
  "10:00 AM – 10:30 AM",
  "11:30 AM – 12:00 PM",
  "2:00 PM – 2:30 PM",
];
export function BookingPreview({ live = false }: { live?: boolean }) {
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [date, setDate] = useState<Date | null>(null);
  const [time, setTime] = useState("");
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [uncertain, setUncertain] = useState(false);
  const [sending, setSending] = useState(false);
  const submitting = useRef(false);
  const [organisation, setOrganisation] = useState("");
  const [interests, setInterests] = useState("");
  const selectedDay = date
    ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
    : "";
  const formatTime = (value: string) =>
    new Date(value).toLocaleTimeString("en-US", {
      timeZone: "Africa/Lagos",
      hour: "numeric",
      minute: "2-digit",
    });
  const timeLabel =
    live && time
      ? `${formatTime(time)} – ${formatTime(new Date(Date.parse(time) + 1800000).toISOString())}`
      : time;
  const times = live ? slots : sampleTimes;
  useEffect(() => {
    if (!live || !selectedDay) return;
    const controller = new AbortController();
    setLoading(true);
    setSlots([]);
    setError("");
    fetch(`/api/sales-booking?date=${selectedDay}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error);
        return data;
      })
      .then((data) => {
        setSlots(data.times);
        setLoading(false);
      })
      .catch((cause) => {
        if (!controller.signal.aborted) {
          setError(cause.message || "Availability could not be loaded.");
          setLoading(false);
        }
      });
    return () => controller.abort();
  }, [live, selectedDay]);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting.current || uncertain) return;
    if (!live) {
      setStep(2);
      return;
    }
    submitting.current = true;
    setSending(true);
    setError("");
    let rejected = false;
    try {
      const response = await fetch("/api/sales-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: time,
          name,
          email,
          organisation,
          interests,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.confirmed) {
        rejected = !response.ok && !data.uncertain;
        if (data.uncertain) setUncertain(true);
        if (data.chooseAnother) {
          setStep(0);
          setTime("");
          setSlots((previous) => previous.filter((slot) => slot !== time));
        }
        throw new Error(data.error || "Booking could not be confirmed.");
      }
      setStep(2);
    } catch (cause) {
      if (!rejected) setUncertain(true);
      setError(
        rejected && cause instanceof Error
          ? cause.message
          : "Booking status is uncertain. Please check your calendar or contact us before trying again."
      );
    } finally {
      submitting.current = false;
      setSending(false);
    }
  }
  const dateText = date?.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-950">
          30-minute Zedu demo
        </h2>
        <p className="mt-2 text-slate-600">
          Choose a time that works for you. We’ll show you how Zedu can support
          your school and answer your questions.
        </p>
      </div>
      {error && (
        <p role="alert" className="text-sm text-red-700">
          {error}
        </p>
      )}
      {step === 0 ? (
        <>
          <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
            <div>
              <div className="mb-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Previous month"
                  onClick={() => {
                    setMonth(
                      new Date(month.getFullYear(), month.getMonth() - 1, 1)
                    );
                    setDate(null);
                    setTime("");
                  }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h3 className="font-semibold">
                  {month.toLocaleDateString("en-GB", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Next month"
                  onClick={() => {
                    setMonth(
                      new Date(month.getFullYear(), month.getMonth() + 1, 1)
                    );
                    setDate(null);
                    setTime("");
                  }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-7 gap-1 text-center text-sm">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <span key={day} className="py-2 text-slate-500">
                      {day}
                    </span>
                  )
                )}
                {Array.from({ length: month.getDay() }, (_, i) => (
                  <span key={"blank" + i} />
                ))}
                {Array.from({ length: days }, (_, i) => {
                  const day = new Date(
                    month.getFullYear(),
                    month.getMonth(),
                    i + 1
                  );
                  const selected = date?.getTime() === day.getTime();
                  return (
                    <Button
                      key={i}
                      variant="ghost"
                      aria-label={day.toDateString()}
                      aria-pressed={selected}
                      disabled={
                        day < today ||
                        (!live && (day.getDay() === 0 || day.getDay() === 6))
                      }
                      onClick={() => {
                        setDate(day);
                        setTime("");
                        if (live) {
                          setSlots([]);
                          setLoading(true);
                        }
                      }}
                      className={
                        "h-10 w-full rounded-full p-0 " +
                        (selected
                          ? "bg-[#6f4ef6] text-white hover:bg-[#6f4ef6] hover:text-white"
                          : "")
                      }
                    >
                      {i + 1}
                    </Button>
                  );
                })}
              </div>
            </div>
            <div className="max-h-[300px] space-y-3 overflow-y-auto xl:border-l xl:pl-4">
              <h3 className="font-semibold">Available times</h3>
              {loading ? (
                <p role="status" className="text-sm text-slate-500">
                  Loading available times…
                </p>
              ) : date ? (
                times.map((value) => (
                  <Button
                    key={value}
                    variant="outline"
                    aria-pressed={time === value}
                    onClick={() => setTime(value)}
                    className={
                      "h-auto min-h-12 w-full whitespace-normal text-sm " +
                      (time === value
                        ? "border-[#6f4ef6] bg-purple-50 text-[#6f4ef6]"
                        : "")
                    }
                  >
                    {live
                      ? `${formatTime(value)} – ${formatTime(new Date(Date.parse(value) + 1800000).toISOString())}`
                      : value}
                  </Button>
                ))
              ) : (
                <p className="text-sm text-slate-500">
                  {live
                    ? "Choose a day to see available times."
                    : "Choose a day to see sample times."}
                </p>
              )}
            </div>
          </div>
          {date && !loading && !error && times.length === 0 && (
            <p role="status" className="text-sm text-slate-600">
              No times available. Please choose another day.
            </p>
          )}
          <div className="flex flex-wrap items-start justify-between gap-4 border-t pt-4">
            <div className="flex gap-3">
              <CalendarDays className="h-6 w-6 text-slate-500" />
              <div>
                <p className="text-sm text-slate-500">Selected date and time</p>
                <p className="font-semibold">{dateText || "Choose a date"}</p>
                <p className="text-sm">
                  {timeLabel || "Choose a time"}
                  {time && " (30 minutes)"}
                </p>
              </div>
            </div>
            <p className="flex items-center gap-2 text-xs text-slate-600">
              <Globe className="h-4 w-4" />
              Africa/Lagos (GMT+1)
            </p>
          </div>
          <Button
            disabled={!date || !time || loading || uncertain}
            onClick={() => setStep(1)}
            className="h-12 w-full bg-[#6f4ef6] text-white"
          >
            Continue
          </Button>
        </>
      ) : step === 1 ? (
        <form className="space-y-4" onSubmit={submit}>
          <Button
            type="button"
            variant="ghost"
            disabled={sending}
            onClick={() => setStep(0)}
          >
            ← Back to times
          </Button>
          <p className="rounded-lg bg-purple-50 p-4">
            {dateText}
            <br />
            {timeLabel} · Africa/Lagos (GMT+1)
          </p>
          <h3 className="text-xl font-semibold">Your details</h3>
          <div className="space-y-2">
            <Label htmlFor="demo-name">Name</Label>
            <Input
              disabled={sending || uncertain}
              id="demo-name"
              minLength={2}
              maxLength={100}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-email">Email</Label>
            <Input
              disabled={sending || uncertain}
              id="demo-email"
              maxLength={254}
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-organisation">Organisation (optional)</Label>
            <Input
              disabled={sending || uncertain}
              id="demo-organisation"
              maxLength={200}
              value={organisation}
              onChange={(event) => setOrganisation(event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="demo-interests">Demo interests (optional)</Label>
            <Input
              disabled={sending || uncertain}
              id="demo-interests"
              maxLength={2000}
              value={interests}
              onChange={(event) => setInterests(event.target.value)}
            />
          </div>
          <Button
            type="submit"
            disabled={sending || uncertain}
            className="h-12 w-full bg-[#6f4ef6] text-white"
          >
            {sending
              ? "Confirming…"
              : live
                ? "Confirm demo booking"
                : "Preview confirmation"}
          </Button>
        </form>
      ) : (
        <div role="status" className="space-y-4 text-center">
          <Check className="mx-auto h-12 w-12 rounded-full bg-purple-100 p-2 text-[#6f4ef6]" />
          <h3 className="text-xl font-semibold">
            {live ? "Your demo is booked" : "Booking confirmation preview"}
          </h3>
          <p>
            {live
              ? `${name}, your 30-minute Zedu demo is confirmed.`
              : `${name}, this is how your selected appointment would appear.`}
          </p>
          <p>
            {dateText}
            <br />
            {timeLabel} · Africa/Lagos (GMT+1)
          </p>
          <p className="text-sm text-slate-600">
            {live
              ? `Calendly has confirmed the booking for ${email}. Check your inbox and calendar for meeting details.`
              : `No confirmation or calendar invitation has been sent to ${email}.`}
          </p>
          <Button variant="outline" onClick={() => setStep(0)}>
            Choose another time
          </Button>
        </div>
      )}
    </div>
  );
}
