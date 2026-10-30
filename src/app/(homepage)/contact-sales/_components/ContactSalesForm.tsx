"use client";

import { useState } from "react";
import { Loader2, Mail } from "lucide-react";
import { z } from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Textarea } from "~/components/ui/textarea";
import { useToast } from "~/components/ui/use-toast";
import { cn } from "~/lib/utils";
import { contactSalesUrl } from "~/lib/env-urls";

const phoneNumberPattern = /^\+?[0-9\s()-]+$/;

/**
 * Extracts only digits from a phone number string.
 * @param value Raw phone number input.
 * @returns String containing only numeric digits.
 */
const getPhoneDigits = (value: string) => value.replace(/\D/g, "");

const contactSalesSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name is too long"),
  email: z
    .string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .refine(
      (value) => phoneNumberPattern.test(value),
      "Phone number can only contain digits and standard phone formatting"
    )
    .refine((value) => {
      const digits = getPhoneDigits(value);
      return digits.length >= 10 && digits.length <= 15;
    }, "Phone number must contain between 10 and 15 digits"),
  organization_type: z
    .string()
    .trim()
    .min(1, "Please select an organization type"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(2000, "Message is too long"),
});

type ContactSalesFormData = z.infer<typeof contactSalesSchema>;
type FormField = keyof ContactSalesFormData;
type FormErrors = Partial<Record<FormField, string>>;

const initialFormData: ContactSalesFormData = {
  name: "",
  email: "",
  phone: "",
  organization_type: "",
  message: "",
};

/**
 * Validates a single form field value using the Zod schema.
 * @param field Form field key to validate.
 * @param value Current field value.
 * @returns Error message string, or empty string if valid.
 */
const getFieldError = (field: FormField, value: string) => {
  const result = contactSalesSchema.shape[field].safeParse(value);
  return result.success
    ? ""
    : result.error.issues[0]?.message || "Invalid value";
};

/**
 * Validates the entire contact sales form dataset.
 * @param data Form data object to validate.
 * @returns Map of field names to error messages.
 */
const getFormErrors = (data: ContactSalesFormData): FormErrors => {
  const parsed = contactSalesSchema.safeParse(data);

  if (parsed.success) {
    return {};
  }

  const nextErrors: FormErrors = {};
  parsed.error.issues.forEach((issue) => {
    const path = issue.path[0] as FormField | undefined;
    if (!path || nextErrors[path]) {
      return;
    }
    nextErrors[path] = issue.message;
  });

  return nextErrors;
};

const fieldClassName =
  "h-[52px] rounded-[14px] border border-[#6f4ef6]/25 bg-white px-3.5 text-[#222] focus:border-[#6f4ef6] focus:ring-2 focus:ring-[#6f4ef6]/30";

/**
 * Interactive contact sales form supporting organization type and phone validation.
 * @returns Rendered contact sales form component.
 */
export const ContactSalesForm = () => {
  const [formData, setFormData] =
    useState<ContactSalesFormData>(initialFormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [sending, setSending] = useState<boolean>(false);
  const { toast } = useToast();

  /**
   * Updates a form field value in state and clears active errors when resolved.
   * @param field Field name.
   * @param value New field value.
   */
  const updateField = (field: FormField, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: getFieldError(field, value),
      }));
    }
  };

  /**
   * Validates a single field on blur and updates error state.
   * @param field Field name to validate.
   */
  const validateField = (field: FormField) => {
    setErrors((prev) => ({
      ...prev,
      [field]: getFieldError(field, formData[field]),
    }));
  };

  /**
   * Submits the contact sales form data to the sales endpoint.
   * @param event Form submit event.
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formErrors = getFormErrors(formData);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      return;
    }

    setSending(true);

    const normalizedPhone = getPhoneDigits(formData.phone);
    const orgType = formData.organization_type.trim();
    const rawMessage = formData.message.trim();
    const formattedMessage = orgType
      ? `Organization type: ${orgType}\n\n${rawMessage}`
      : rawMessage;
    const contactData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone_number: normalizedPhone,
      organization_type: orgType,
      message: formattedMessage,
    };

    try {
      const response = await fetch(contactSalesUrl(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contactData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      toast({
        title: "Message Sent!",
        description: `Thank you, ${formData.name}! We've received your message.`,
      });

      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error("Error sending data:", error);
      toast({
        title: "Oops! Something Went Wrong.",
        description: `We're sorry, ${formData.name}. There was an issue sending your message. Please try again later.`,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full min-w-0 rounded-[28px] bg-white p-6 shadow-[0_28px_60px_-18px_rgba(38,24,102,0.28)] ring-1 ring-[#6f4ef6]/5 sm:p-8 lg:p-9"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:gap-x-5 lg:gap-y-6">
        <div className="flex flex-col gap-1.5 lg:gap-4">
          <Label htmlFor="name" className="text-sm font-medium text-[#222]">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={(event) => updateField("name", event.target.value)}
            onBlur={() => validateField("name")}
            placeholder="Enter your full name"
            aria-invalid={Boolean(errors.name)}
            className={cn(fieldClassName, errors.name && "border-red-500")}
          />
          {errors.name ? (
            <p className="text-xs text-red-500">{errors.name}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5 lg:gap-4">
          <Label htmlFor="email" className="text-sm font-medium text-[#222]">
            Email Address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={(event) => updateField("email", event.target.value)}
            onBlur={() => validateField("email")}
            placeholder="Enter your email"
            aria-invalid={Boolean(errors.email)}
            className={cn(fieldClassName, errors.email && "border-red-500")}
          />
          {errors.email ? (
            <p className="text-xs text-red-500">{errors.email}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5 lg:gap-4">
          <Label htmlFor="phone" className="text-sm font-medium text-[#222]">
            Phone Number
          </Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={formData.phone}
            onChange={(event) => updateField("phone", event.target.value)}
            onBlur={() => validateField("phone")}
            placeholder="Enter your phone number"
            aria-invalid={Boolean(errors.phone)}
            className={cn(fieldClassName, errors.phone && "border-red-500")}
          />
          {errors.phone ? (
            <p className="text-xs text-red-500">{errors.phone}</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1.5 lg:gap-4">
          <Label
            htmlFor="organization_type"
            className="text-sm font-medium text-[#222]"
          >
            Organization Type
          </Label>
          <Select
            value={formData.organization_type}
            onValueChange={(value) => updateField("organization_type", value)}
          >
            <SelectTrigger
              id="organization_type"
              aria-required="true"
              aria-invalid={Boolean(errors.organization_type)}
              aria-errormessage={
                errors.organization_type ? "organization_type-error" : undefined
              }
              aria-describedby={
                errors.organization_type ? "organization_type-error" : undefined
              }
              className={cn(
                "h-10 border-[#d9d9df] p-3 text-sm text-[#222] focus:ring-1 focus:ring-primary-500",
                errors.organization_type && "border-red-500"
              )}
            >
              <SelectValue placeholder="Select organization type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Bootcamp">Bootcamp</SelectItem>
              <SelectItem value="University / Higher Ed">
                University / Higher Ed
              </SelectItem>
              <SelectItem value="K-12 School">K-12 School</SelectItem>
              <SelectItem value="Online Learning Platform / Other">
                Online Learning Platform / Other
              </SelectItem>
            </SelectContent>
          </Select>
          {errors.organization_type ? (
            <p id="organization_type-error" className="text-xs text-red-500">
              {errors.organization_type}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-3 flex flex-col gap-1.5 sm:mt-4 lg:mt-6 lg:gap-4">
        <Label htmlFor="message" className="text-sm font-medium text-[#222]">
          Message
        </Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={(event) => updateField("message", event.target.value)}
          onBlur={() => validateField("message")}
          rows={8}
          aria-invalid={Boolean(errors.message)}
          className={cn(
            "min-h-[140px] resize-y rounded-[14px] border border-[#6f4ef6]/25 bg-white px-3.5 py-2 text-[#222] focus:border-[#6f4ef6] focus:ring-2 focus:ring-[#6f4ef6]/30 lg:max-h-[420px]",
            errors.message && "border-red-500"
          )}
        />
        {errors.message ? (
          <p className="text-xs text-red-500 sm:text-sm">{errors.message}</p>
        ) : null}
      </div>

      <Button
        type="submit"
        disabled={sending}
        className="mt-4 flex h-[56px] w-full items-center justify-center gap-2 rounded-full bg-[#6f4ef6] text-base font-semibold text-white hover:bg-[#5c3ce0] lg:mt-6"
      >
        {!sending ? (
          <Mail className="h-4 w-4" />
        ) : (
          <Loader2 className="h-4 w-4 animate-spin" />
        )}
        {!sending ? "Send" : "Sending"}
      </Button>

      <p className="mt-3 text-[12px] leading-5 text-[#4b4b55] md:text-[13px] lg:mt-6">
        By continuing, I authorize Zedu to contact me about Zedu&apos;s
        offerings. I understand I can opt out by contacting Zedu.
      </p>
    </form>
  );
};
