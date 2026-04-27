import { Suspense } from "react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/components/LanguageProvider";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      {/* DECISION: Suspense required because LanguageProvider uses
          useSearchParams(), which opts the subtree out of static
          rendering. fallback={null} renders nothing during the brief
          SSR pass; client hydration takes over immediately. */}
      <Suspense fallback={null}>
        <LanguageProvider>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
            <ScrollToTop />
          </div>
        </LanguageProvider>
      </Suspense>
    </ThemeProvider>
  );
}
