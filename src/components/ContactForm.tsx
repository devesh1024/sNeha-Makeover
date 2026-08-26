import { useState } from "react";
import { z } from "zod";
import { submitInquiry } from "@/lib/content";
import { serviceCategories } from "@/data/services";

const schema = z.object({
  name: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .min(7, "Please enter a valid phone number")
    .max(20, "Phone number is too long"),
  email: z.union([z.string().trim().email("Please enter a valid email").max(255), z.literal("")]),
  inquiry_type: z.enum(["Service", "Product", "General"]),
  service_or_product: z.string().trim().max(120),
  preferred_date: z.string().trim().max(20),
  message: z.string().trim().max(1000, "Message is too long"),
});

type Values = z.infer<typeof schema>;

const initial: Values = {
  name: "",
  phone: "",
  email: "",
  inquiry_type: "Service",
  service_or_product: "",
  preferred_date: "",
  message: "",
};

const fieldClass =
  "mt-2 w-full border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-gold";

export function ContactForm() {
  const [values, setValues] = useState<Values>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof Values, string>>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const set = (key: keyof Values) => (e: { target: { value: string } }) =>
    setValues((v) => ({ ...v, [key]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = schema.safeParse(values);
    if (!parsed.success) {
      const next: Partial<Record<keyof Values, string>> = {};
      parsed.error.issues.forEach((issue) => {
        const key = issue.path[0] as keyof Values;
        if (!next[key]) next[key] = issue.message;
      });
      setErrors(next);
      return;
    }
    setErrors({});
    setStatus("sending");
    try {
      await submitInquiry({
        ...parsed.data,
        preferred_date: parsed.data.preferred_date || null,
      });
      setStatus("sent");
      setValues(initial);
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="border border-gold/50 bg-card p-10 text-center">
        <p className="eyebrow text-gold">Thank you</p>
        <h3 className="mt-4 text-2xl">Your inquiry has been received</h3>
        <div className="mx-auto mt-5 h-px w-14 bg-gold" aria-hidden="true" />
        <p className="mt-5 text-sm text-muted-foreground">
          We will get back to you as soon as possible.
        </p>
        <button type="button" onClick={() => setStatus("idle")} className="btn btn-outline-dark mt-8">
          Send another inquiry
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="border border-border bg-card p-6 sm:p-8">
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="eyebrow text-muted-foreground">
            Name*
          </label>
          <input
            id="name"
            name="name"
            value={values.name}
            onChange={set("name")}
            className={fieldClass}
            placeholder="Your name"
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name ? (
            <p id="name-error" className="mt-2 text-xs text-destructive">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="phone" className="eyebrow text-muted-foreground">
            Phone*
          </label>
          <input
            id="phone"
            name="phone"
            inputMode="tel"
            value={values.phone}
            onChange={set("phone")}
            className={fieldClass}
            placeholder="Your phone number"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone ? (
            <p id="phone-error" className="mt-2 text-xs text-destructive">
              {errors.phone}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="email" className="eyebrow text-muted-foreground">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={values.email}
            onChange={set("email")}
            className={fieldClass}
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email ? (
            <p id="email-error" className="mt-2 text-xs text-destructive">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="inquiry_type" className="eyebrow text-muted-foreground">
            Inquiry type
          </label>
          <select
            id="inquiry_type"
            name="inquiry_type"
            value={values.inquiry_type}
            onChange={set("inquiry_type")}
            className={fieldClass}
          >
            <option value="Service">Service</option>
            <option value="Product">Product</option>
            <option value="General">General</option>
          </select>
        </div>

        <div>
          <label htmlFor="service_or_product" className="eyebrow text-muted-foreground">
            Service / product of interest
          </label>
          <input
            id="service_or_product"
            name="service_or_product"
            list="service-options"
            value={values.service_or_product}
            onChange={set("service_or_product")}
            className={fieldClass}
            placeholder="e.g. Bridal Makeup"
          />
          <datalist id="service-options">
            {serviceCategories.flatMap((c) =>
              c.groups.flatMap((g) => g.items.map((i) => <option key={`${c.slug}-${g.title}-${i.name}`} value={i.name} />)),
            )}
          </datalist>
        </div>

        <div>
          <label htmlFor="preferred_date" className="eyebrow text-muted-foreground">
            Preferred date
          </label>
          <input
            id="preferred_date"
            name="preferred_date"
            type="date"
            value={values.preferred_date}
            onChange={set("preferred_date")}
            className={fieldClass}
          />
        </div>
      </div>

      <div className="mt-5">
        <label htmlFor="message" className="eyebrow text-muted-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={set("message")}
          className={fieldClass}
          placeholder="Tell us a little about what you are looking for"
          aria-invalid={!!errors.message}
        />
        {errors.message ? <p className="mt-2 text-xs text-destructive">{errors.message}</p> : null}
      </div>

      {status === "error" ? (
        <p role="alert" className="mt-5 text-sm text-destructive">
          Something went wrong while sending your inquiry. Please try again or reach us on WhatsApp.
        </p>
      ) : null}

      <button type="submit" disabled={status === "sending"} className="btn btn-dark mt-8 w-full sm:w-auto">
        {status === "sending" ? "Sending…" : "Send Inquiry"}
      </button>
    </form>
  );
}
