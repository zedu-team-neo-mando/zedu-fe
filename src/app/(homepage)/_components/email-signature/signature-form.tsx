import type { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "~/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { cn } from "~/lib/utils";
import { normaliseUrl } from "./build-signature";

/** Accent colours, each at least 4.5:1 against white so the name stays readable. */
export const ACCENTS = [
  { value: "#7141F8", label: "Zedu violet" },
  { value: "#303073", label: "Navy" },
  { value: "#0F766E", label: "Teal" },
  { value: "#B91C1C", label: "Crimson" },
  { value: "#262626", label: "Charcoal" },
] as const;

const ACCENT_VALUES = ACCENTS.map((a) => a.value) as [
  (typeof ACCENTS)[number]["value"],
  ...(typeof ACCENTS)[number]["value"][],
];

const optionalUrl = (message: string) =>
  z
    .string()
    .max(200, "Keep the link to 200 characters or fewer.")
    .refine((v) => !v.trim() || normaliseUrl(v) !== "", message);

export const signatureSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Add your name.")
    .max(80, "Keep your name to 80 characters or fewer."),
  role: z.string().max(80, "Keep your role to 80 characters or fewer."),
  organisation: z
    .string()
    .max(100, "Keep the organisation name to 100 characters or fewer."),
  email: z
    .string()
    .trim()
    .max(120, "Keep the email to 120 characters or fewer.")
    .refine(
      (v) => !v || z.string().email().safeParse(v).success,
      "Enter an email like name@school.edu."
    ),
  phone: z
    .string()
    .max(30, "Keep the phone number to 30 characters or fewer.")
    .refine(
      (v) => !v.trim() || /^\+?[\d\s().-]{5,}$/.test(v.trim()),
      "Use digits, spaces, brackets or dashes, e.g. +234 801 234 5678."
    ),
  website: optionalUrl("Enter a web address like yourschool.edu."),
  communityUrl: optionalUrl(
    "Paste the invite link from your Zedu workspace, e.g. https://zedu.chat/invite/…"
  ),
  accent: z.enum(ACCENT_VALUES),
  showCredit: z.boolean(),
});

export type SignatureValues = z.infer<typeof signatureSchema>;

export const DEFAULT_VALUES: SignatureValues = {
  fullName: "",
  role: "",
  organisation: "",
  email: "",
  phone: "",
  website: "",
  communityUrl: "",
  accent: ACCENTS[0].value,
  showCredit: true,
};

type TextFieldName = Exclude<keyof SignatureValues, "accent" | "showCredit">;

interface TextFieldProps {
  form: UseFormReturn<SignatureValues>;
  name: TextFieldName;
  label: string;
  placeholder: string;
  description?: string;
  type?: "text" | "email" | "tel" | "url";
  autoComplete?: string;
  required?: boolean;
}

/** One labelled text input with its hint and field-level error. */
const TextField = ({
  form,
  name,
  label,
  placeholder,
  description,
  type = "text",
  autoComplete,
  required,
}: TextFieldProps) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel className="text-sm font-medium text-neutral-900">
          {label}
          {!required && (
            <span className="font-normal text-neutral-500"> (optional)</span>
          )}
        </FormLabel>
        <FormControl>
          <Input
            {...field}
            type={type}
            inputMode={type === "url" ? "url" : undefined}
            autoComplete={autoComplete}
            placeholder={placeholder}
            aria-required={required || undefined}
          />
        </FormControl>
        {description && (
          <FormDescription className="text-xs text-neutral-500">
            {description}
          </FormDescription>
        )}
        <FormMessage />
      </FormItem>
    )}
  />
);

interface SignatureFormProps {
  form: UseFormReturn<SignatureValues>;
}

/** The signature details. Every change updates the preview straight away. */
export const SignatureForm = ({ form }: SignatureFormProps) => {
  const cardClass =
    "flex flex-col gap-4 rounded-lg border border-neutral-200 bg-white p-4 shadow-sm sm:p-5";
  const legendClass = "mb-1 text-sm font-medium text-neutral-900";

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => event.preventDefault()}
        noValidate
        className="flex flex-col gap-5"
      >
        <fieldset className={cardClass}>
          <legend className={cn(legendClass, "float-left w-full")}>
            About you
          </legend>
          <TextField
            form={form}
            name="fullName"
            label="Full name"
            placeholder="Adaeze Okafor"
            autoComplete="name"
            required
          />
          <TextField
            form={form}
            name="role"
            label="Role"
            placeholder="Programme Lead"
            autoComplete="organization-title"
          />
          <TextField
            form={form}
            name="organisation"
            label="School or organisation"
            placeholder="Lagos Coding Academy"
            autoComplete="organization"
          />
        </fieldset>

        <fieldset className={cardClass}>
          <legend className={cn(legendClass, "float-left w-full")}>
            How to reach you
          </legend>
          <TextField
            form={form}
            name="email"
            label="Email"
            type="email"
            placeholder="adaeze@lagoscoding.academy"
            autoComplete="email"
          />
          <TextField
            form={form}
            name="phone"
            label="Phone"
            type="tel"
            placeholder="+234 801 234 5678"
            autoComplete="tel"
          />
          <TextField
            form={form}
            name="website"
            label="Website"
            type="url"
            placeholder="lagoscoding.academy"
            autoComplete="url"
          />
          <TextField
            form={form}
            name="communityUrl"
            label="Zedu community link"
            type="url"
            placeholder="https://zedu.chat/invite/…"
            description="Adds a “Join our community on Zedu” link, so every email you send invites learners in."
          />
        </fieldset>

        <fieldset className={cardClass}>
          <legend className={cn(legendClass, "float-left w-full")}>
            Style
          </legend>
          <FormField
            control={form.control}
            name="accent"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-neutral-900">
                  Accent colour
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    value={field.value}
                    onValueChange={field.onChange}
                    className="flex flex-wrap gap-2"
                  >
                    {ACCENTS.map((accent) => {
                      const id = `accent-${accent.label.toLowerCase().replace(/\s+/g, "-")}`;
                      const selected = field.value === accent.value;
                      return (
                        <Label
                          key={accent.value}
                          htmlFor={id}
                          className={cn(
                            "flex cursor-pointer items-center gap-2 rounded-full border border-neutral-200 py-1.5 pl-1.5 pr-3 text-sm font-normal text-neutral-800 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-primary-500",
                            selected
                              ? "border-primary-500 bg-primary-50/50"
                              : "hover:border-primary-300"
                          )}
                        >
                          <RadioGroupItem
                            id={id}
                            value={accent.value}
                            className="sr-only"
                          />
                          <span
                            aria-hidden="true"
                            className="size-5 rounded-full"
                            style={{ backgroundColor: accent.value }}
                          />
                          {accent.label}
                        </Label>
                      );
                    })}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="showCredit"
            render={({ field }) => (
              <FormItem className="flex items-start gap-2.5 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={(checked) =>
                      field.onChange(checked === true)
                    }
                    className="mt-0.5"
                  />
                </FormControl>
                <div className="flex flex-col gap-0.5">
                  <FormLabel className="text-sm font-normal text-neutral-800">
                    Add a small “Signature made with Zedu” line
                  </FormLabel>
                  <FormDescription className="text-xs text-neutral-500">
                    Optional. Untick it and the line is gone.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </fieldset>
      </form>
    </Form>
  );
};
