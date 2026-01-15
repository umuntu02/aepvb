"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, Sun, Moon, Contrast } from "lucide-react";
import { useTranslations } from "@/components/LanguageProvider";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

export function Header() {
  const { t, language, setLanguage } = useTranslations();
  const { theme, toggleMode, toggleContrast } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: Event) => {
      if (
        mobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMobileMenuOpen(false);
      }
    };

    // Close menu on route change
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = "hidden";
    }

    // Cleanup
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { href: "/", label: t("nav.home") },
    { href: "/about", label: t("nav.about") },
    { href: "/programs", label: t("nav.programs") },
    { href: "/news", label: t("nav.news") },
    { href: "/events", label: t("nav.events") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/donate", label: t("nav.donate") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname?.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Skip to content link */}
      <a
        href="#main-content"
        className="skip-to-content sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md"
      >
        {t("nav.skipToContent")}
      </a>

      <div className="container flex h-16 items-center justify-between gap-4 px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center space-x-2 font-bold text-lg sm:text-xl"
          aria-label="A.E.P.V.B Home"
        >
          <Image
            src="/favicon_io/android-chrome-512x512.png"
            alt="A.E.P.V.B Logo"
            width={48}
            height={48}
            className="h-8 w-8 sm:h-10 sm:w-10 object-contain"
            priority
          />
          <span className=" inline-block">A.E.P.V.B</span>
        </Link>

        {/* Desktop Navigation */}
        <nav
          className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-center max-w-4xl"
          aria-label={t("a11y.navigation")}
        >
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-xs xl:text-sm font-medium transition-colors hover:text-primary whitespace-nowrap px-1 xl:px-2",
                isActive(item.href)
                  ? "text-primary border-b-2 border-primary"
                  : "text-muted-foreground"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Controls - Desktop */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center gap-2 border-r pr-2 xl:pr-4">
            <span className="sr-only">{t("a11y.language")}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === "fr" ? "en" : "fr")}
              aria-label={t("a11y.language")}
            >
              {language === "fr" ? "FR" : "EN"}
            </Button>
          </div>

          {/* Theme Controls */}
          <div className="flex items-center gap-2 xl:gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMode}
              aria-label={t("a11y.theme")}
            >
              {theme.mode === "light" ? (
                <Moon className="h-5 w-5" aria-hidden="true" />
              ) : (
                <Sun className="h-5 w-5" aria-hidden="true" />
              )}
            </Button>
            <label className="flex items-center gap-2 cursor-pointer">
              <Contrast className="h-5 w-5" aria-hidden="true" />
              <Checkbox
                checked={theme.contrast === "high"}
                onCheckedChange={toggleContrast}
                aria-label={t("a11y.contrast")}
              />
            </label>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <Button
          ref={buttonRef}
          variant="ghost"
          size="icon"
          className="lg:hidden shrink-0"
          onClick={() => {
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          aria-label={mobileMenuOpen ? t("a11y.close") : t("a11y.open")}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </Button>
      </div>

      {/* Backdrop Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <nav
          ref={menuRef}
          className="lg:hidden border-t bg-background relative z-50"
          aria-label={t("a11y.navigation")}
        >
          <div className="container px-4 py-4 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "block px-3 py-2 rounded-md text-base font-medium transition-colors",
                  isActive(item.href)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="pt-4 border-t space-y-2">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  setLanguage(language === "fr" ? "en" : "fr");
                  setMobileMenuOpen(false);
                }}
              >
                {t("a11y.language")}: {language === "fr" ? "FR" : "EN"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => {
                  toggleMode();
                  setMobileMenuOpen(false);
                }}
              >
                {t("a11y.theme")}: {theme.mode === "light" ? "Clair" : "Sombre"}
              </Button>
              <label
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-md border cursor-pointer"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Contrast className="h-5 w-5" />
                <Checkbox
                  checked={theme.contrast === "high"}
                  onCheckedChange={(checked) => {
                    toggleContrast();
                    // Close menu after a small delay to allow the toggle to complete
                    setTimeout(() => setMobileMenuOpen(false), 100);
                  }}
                />
                <span>{t("a11y.contrast")}</span>
              </label>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
