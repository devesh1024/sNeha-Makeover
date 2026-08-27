import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import type { ReactNode } from "react";

import appCss from "../styles.css?url";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-off-white">
      <div className="max-w-md text-center">
        <p className="eyebrow text-gold">404</p>
        <h1 className="mt-4 font-serif text-4xl">Page not found</h1>
        <p className="mt-4 text-sm text-off-white/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link to="/" className="btn btn-gold mt-8">
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 text-off-white">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl">This page didn&apos;t load</h1>
        <p className="mt-4 text-sm text-off-white/60">
          Something went wrong. You can try again or head back home.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn btn-gold"
          >
            Try again
          </button>
          <a href="/" className="btn btn-outline-gold">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "sNeha's Makeover | Beauty, Makeup, Hair, Nails & Skin Care" },
      {
        name: "description",
        content:
          "sNeha's Makeover is a personal beauty and makeover studio offering makeup, hair, nail and skin care services. Khud Se Milo – Naye Look Ke Saath.",
      },
      { property: "og:site_name", content: "sNeha's Makeover" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#0B0B0B" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/favicon.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;1,400&family=Inter:wght@300;400;500&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <main id="main">
        {/* Required: nested routes render here. */}
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </QueryClientProvider>
  );
}
