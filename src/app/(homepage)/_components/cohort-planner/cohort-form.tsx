import { zodResolver } from "@hookform/resolvers/zod";
import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Wand2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/lib/utils";
import {
  COHORT_SIZE_IDS,
  COHORT_SIZE_OPTIONS,
  DURATION_IDS,
  DURATION_OPTIONS,
  NEED_IDS,
  NEED_OPTIONS,
  SESSION_IDS,
  SESSION_OPTIONS,
} from "./content";

export const formSchema = z.object({
  cohortSize: z.enum(COHORT_SIZE_IDS),
  duration: z.enum(DURATION_IDS),
  liveSessions: z.enum(SESSION_IDS),
  needs: z
    .array(z.enum(NEED_IDS))
    .min(1, "Select at least one coordination need to plan around."),
  goal: z
    .string()
    .max(240, "Keep the programme goal to 240 characters or fewer."),
  topics: z
    .string()
    .max(4000, "Keep weekly topics to 4,000 characters or fewer."),
});

export type FormValues = z.infer<typeof formSchema>;

export const DEFAULT_VALUES: FormValues = {
  cohortSize: "21-50",
  duration: "5-8",
  liveSessions: "1",
  needs: [],
  goal: "",
  topics: "",
};

/** Reusable radio-card option inside a fieldset question. */
interface OptionCardProps<T extends string> {
  group: string;
  value: T;
  selected: boolean;
  label: string;
}

const OptionCard = <T extends string>({
  group,
  value,
  selected,
  label,
}: OptionCardProps<T>) => {
  const id = `${group}-${value.replace(/[^a-z0-9]+/gi, "-")}`;
  return (
    <Label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer items-center gap-2.5 rounded-lg border border-neutral-200 px-3 py-2.5 text-sm font-normal transition-colors",
        selected
          ? "border-primary-500 bg-primary-50/50 ring-1 ring-primary-500"
          : "hover:border-primary-300 hover:bg-neutral-50"
      )}
    >
      <RadioGroupItem id={id} value={value} className="size-4 shrink-0" />
      <span className="text-neutral-800">{label}</span>
    </Label>
  );
};

interface CohortFormProps {
  form: UseFormReturn<FormValues>;
  hasPlan: boolean;
  onSubmit: () => void;
  onExample: () => void;
}

/** The cohort configuration form: four core inputs plus programme context. */
export const CohortForm = ({
  form,
  hasPlan,
  onSubmit,
  onExample,
}: CohortFormProps) => {
  const legendClass = "text-sm font-medium text-neutral-900";
  const hintClass = "mb-2 text-xs text-neutral-500";
  const cardClass =
    "rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5";

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
        <fieldset className="flex flex-col gap-4">
          <legend className={legendClass}>Your cohort</legend>

          <div className={cardClass}>
            <fieldset className="flex flex-col">
              <legend className={legendClass}>
                Number of learners{" "}
                <span className="font-normal text-neutral-500">(required)</span>
              </legend>
              <p className={hintClass}>
                Drives channel structure, moderation guidance, and how work is
                split across your team.
              </p>
              <FormField
                control={form.control}
                name="cohortSize"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        aria-label="Number of learners"
                        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                      >
                        {COHORT_SIZE_OPTIONS.map((o) => (
                          <OptionCard
                            key={o.id}
                            group="cohort-size"
                            value={o.id}
                            label={o.label}
                            selected={field.value === o.id}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>

          <div className={cardClass}>
            <fieldset className="flex flex-col">
              <legend className={legendClass}>
                Programme duration{" "}
                <span className="font-normal text-neutral-500">(required)</span>
              </legend>
              <p className={hintClass}>
                The plan models the top of your range — e.g. 5–8 weeks is
                modelled as 8 weeks.
              </p>
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        aria-label="Programme duration"
                        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                      >
                        {DURATION_OPTIONS.map((o) => (
                          <OptionCard
                            key={o.id}
                            group="duration"
                            value={o.id}
                            label={o.label}
                            selected={field.value === o.id}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>

          <div className={cardClass}>
            <fieldset className="flex flex-col">
              <legend className={legendClass}>
                Live sessions per week{" "}
                <span className="font-normal text-neutral-500">(required)</span>
              </legend>
              <p className={hintClass}>
                Zero sessions removes every live-session reminder from your
                plan.
              </p>
              <FormField
                control={form.control}
                name="liveSessions"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RadioGroup
                        value={field.value}
                        onValueChange={field.onChange}
                        aria-label="Live sessions per week"
                        className="grid grid-cols-2 gap-2 sm:grid-cols-3"
                      >
                        {SESSION_OPTIONS.map((o) => (
                          <OptionCard
                            key={o.id}
                            group="sessions"
                            value={o.id}
                            label={o.label}
                            selected={field.value === o.id}
                          />
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </div>
        </fieldset>

        <fieldset className="flex flex-col">
          <legend className={legendClass}>
            What do you need to coordinate?{" "}
            <span className="text-red-500" aria-hidden="true">
              *
            </span>
          </legend>
          <p className={hintClass}>
            Select everything you want help coordinating — only the matching
            channels and activities are generated. Required.
          </p>
          <FormField
            control={form.control}
            name="needs"
            render={({ field }) => (
              <FormItem>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {NEED_OPTIONS.map((o) => (
                    <div key={o.id} className="flex items-start gap-2.5">
                      <Checkbox
                        id={`need-${o.id}`}
                        checked={field.value.includes(o.id)}
                        onCheckedChange={(checked) =>
                          field.onChange(
                            checked
                              ? [...field.value, o.id]
                              : field.value.filter((n) => n !== o.id)
                          )
                        }
                        className="mt-0.5 size-4 shrink-0"
                      />
                      <Label
                        htmlFor={`need-${o.id}`}
                        className="flex-1 cursor-pointer font-normal"
                      >
                        <span className="block text-sm font-medium text-neutral-800">
                          {o.label}
                        </span>
                        <span className="block text-xs text-neutral-500">
                          {o.hint}
                        </span>
                      </Label>
                    </div>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <legend className={legendClass}>Programme context</legend>
          <p className={hintClass}>
            Optional, but the more you give it, the more relevant the plan.
          </p>

          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="planner-goal" className="text-sm font-medium">
                  Programme goal or subject{" "}
                  <span className="font-normal text-neutral-500">
                    (optional)
                  </span>
                </Label>
                <FormControl>
                  <Textarea
                    id="planner-goal"
                    rows={2}
                    maxLength={240}
                    placeholder="e.g. A six-week web development bootcamp"
                    className="mt-1.5 resize-none"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-neutral-500">
                  What is the programme about, and what should learners be able
                  to do by the end?
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="topics"
            render={({ field }) => (
              <FormItem>
                <Label htmlFor="planner-topics" className="text-sm font-medium">
                  Weekly topics or curriculum outline{" "}
                  <span className="font-normal text-neutral-500">
                    (optional)
                  </span>
                </Label>
                <FormControl>
                  <Textarea
                    id="planner-topics"
                    rows={6}
                    maxLength={4000}
                    placeholder={
                      "Week 1: Introduction to web development\nWeek 2: HTML and CSS\nWeek 3: JavaScript fundamentals"
                    }
                    className="mt-1.5"
                    {...field}
                  />
                </FormControl>
                <p className="text-xs text-neutral-500">
                  One week per line. Skip any weeks you don&apos;t know yet —
                  they get general operational milestones instead.
                </p>
                <FormMessage />
              </FormItem>
            )}
          />
        </fieldset>

        <div className="flex flex-col gap-2">
          <Button type="submit" size="lg" className="w-full">
            <Wand2 className="mr-2 size-4" aria-hidden="true" />
            {hasPlan ? "Regenerate plan" : "Generate my plan"}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={onExample}
          >
            Preview an example plan
          </Button>
          <p className="text-center text-xs text-neutral-500">
            Runs entirely in your browser — your answers are never sent
            anywhere.
          </p>
        </div>
      </form>
    </Form>
  );
};
