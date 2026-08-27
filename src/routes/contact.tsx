import { createFileRoute } from "@tanstack/react-router";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { siteConfig, whatsappLink, telLink } from "@/config/site";
import { Reveal } from "@/components/Reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Appointments | sNeha's Makeover" },
      {
        name: "description",
        content:
          "Get in touch with sNeha's Makeover for makeup, hair, nail and skin care appointments, or send a product inquiry.",
      },
      { property: "og:title", content: "Contact & Appointments | sNeha's Makeover" },
      {
        property: "og:description",
        content: "Send an inquiry or message sNeha's Makeover on WhatsApp.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const details = [
    { label: "Parlour", value: siteConfig.name },
    { label: "Address", value: siteConfig.address },
    { label: "Phone", value: siteConfig.phone, href: telLink() },
    { label: "WhatsApp", value: "Message us on WhatsApp", href: whatsappLink() },
    { label: "Email", value: siteConfig.email },
    { label: "Opening hours", value: siteConfig.openingHours },
    { label: "Instagram", value: siteConfig.instagramHandle, href: siteConfig.instagram },
  ];

  return (
    <>
      <section className="bg-black px-5 pb-16 pt-32 text-off-white sm:px-8 md:pt-40">
        <div className="mx-auto max-w-7xl">
          <SectionHeading
            eyebrow="Get in touch"
            tone="dark"
            title="Contact Us"
            description="Tell us what you are looking for and we will get back to you with availability and details."
          />
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_1.2fr]">
          <Reveal>
            <h2 className="font-serif text-2xl">Studio details</h2>
            <div className="mt-5 h-px w-12 bg-gold" aria-hidden="true" />
            <dl className="mt-8 space-y-6">
              {details.map((d) => (
                <div key={d.label} className="border-b border-border pb-5">
                  <dt className="eyebrow text-muted-foreground">{d.label}</dt>
                  <dd className="mt-2 text-sm text-foreground">
                    {d.href ? (
                      <a
                        href={d.href}
                        target={d.href.startsWith("http") ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="link-underline"
                      >
                        {d.value}
                      </a>
                    ) : (
                      d.value
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <div className="mt-8 border border-border bg-muted/50 p-5">
              <p className="eyebrow text-gold-muted">Location</p>
              {siteConfig.mapsUrl ? (
                <a
                  href={siteConfig.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-dark mt-4"
                >
                  Open in Google Maps
                </a>
              ) : (
                <p className="mt-3 text-sm text-muted-foreground">
                  Your Google Maps link here — add it and the map button will appear.
                </p>
              )}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="font-serif text-2xl">Send an inquiry</h2>
            <div className="mt-5 mb-8 h-px w-12 bg-gold" aria-hidden="true" />
            <ContactForm />
          </Reveal>
        </div>
      </section>
    </>
  );
}
