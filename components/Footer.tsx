"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail, ArrowRight } from "lucide-react";
import { useTranslations } from "@/components/LanguageProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BurundiFlag } from "@/components/Flag";
import { cn } from "@/lib/utils";

export function Footer() {
  const { t, language } = useTranslations();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: "/about", label: t("nav.about") },
    { href: "/programs", label: t("nav.programs") },
    { href: "/news", label: t("nav.news") },
    { href: "/events", label: t("nav.events") },
  ];

  const helpLinks = [
    { id: "contact", href: "/contact", label: language === "fr" ? "Contact" : "Contact" },
    { id: "faq", href: "/contact", label: language === "fr" ? "FAQ" : "FAQ" },
    { id: "ressources", href: "/programs", label: language === "fr" ? "Ressources" : "Resources" },
    { id: "documentaires", href: "/programs", label: language === "fr" ? "Documentaires" : "Documentaries" },
  ];

  return (
    <footer className="bg-primary text-primary-foreground" aria-label="Footer">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-4">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About Section */}
          <div className="lg:col-span-1">
            <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide">
              {t("footer.about")}
            </h3>
            <p className="mb-6 text-sm leading-relaxed text-primary-foreground/90 md:text-base">
              {language === "fr"
                ? "Action pour l'Encadrement et la Promotion des Vulnérables au Burundi"
                : "Action for the Support and Promotion of Vulnerable People in Burundi"}
            </p>
            <address className="mb-6 text-sm not-italic text-primary-foreground/80">
              Kigobe, Avenue Adolphe Nshimirimana
              <br />
              Immeuble Robbialac n°8
              <br />
              Bujumbura-Burundi
            </address>
            
            {/* CTA Button */}
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="group w-full justify-between bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            >
              <Link href="/about">
                <span>{language === "fr" ? "EN SAVOIR PLUS" : "LEARN MORE"}</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>

          



            {/* Quick Links Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide">
              {language === "fr" ? "Les dossiers" : "Files"}
            </h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-2 text-sm text-primary-foreground/90 transition-colors duration-200 hover:text-primary-foreground md:text-base"
                  >
                    <span className="h-1 w-1 rounded-full bg-primary-foreground/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
            {/* Help & Support Section */}
            <div>
              <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide">
                {language === "fr" ? "AIDE & SUPPORT" : "HELP & SUPPORT"}
              </h3>
              <ul className="space-y-3">
                {helpLinks.map((link) => (
                  <li key={link.id}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-sm text-primary-foreground/90 transition-colors duration-200 hover:text-primary-foreground md:text-base"
                    >
                      <span className="h-1 w-1 rounded-full bg-primary-foreground/50 opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

          {/* Newsletter Section */}
          <div>
            <h3 className="mb-4 text-lg font-semibold uppercase tracking-wide">
              {t("footer.newsletter.title")}
            </h3>
            <p className="mb-4 text-sm text-primary-foreground/90 md:text-base">
              {t("footer.newsletter.subtitle")}
            </p>
            <form
              className="space-y-3"
              onSubmit={(e) => {
                e.preventDefault();
                // Handle newsletter subscription
              }}
            >
              <Input
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                aria-label={t("footer.newsletter.placeholder")}
                className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60 focus:border-primary-foreground/40 focus:ring-primary-foreground/40"
                required
              />
              <Button
                type="submit"
                variant="secondary"
                className="w-full bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
              >
                {t("footer.newsletter.subscribe")}
              </Button>
            </form>

            {/* Social Media */}
            
          </div>
        </div>
        <div className="mt-6">
              <h4 className="mb-3 text-sm font-semibold uppercase tracking-wide">
                {t("footer.social")}
              </h4>
              <div className="flex gap-4">
                {[
                  { icon: Facebook, label: "Facebook", href: "#" },
                  { icon: Twitter, label: "Twitter", href: "#" },
                  { icon: Instagram, label: "Instagram", href: "#" },
                  { icon: Mail, label: "Email", href: "mailto:contact@aepvb.bi" },
                ].map(({ icon: Icon, label, href }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") || href.startsWith("mailto") ? "_blank" : undefined}
                    rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="rounded-full bg-primary-foreground/10 p-2 text-primary-foreground/90 transition-all duration-200 hover:bg-primary-foreground/20 hover:text-primary-foreground hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary-foreground/50 focus:ring-offset-2 focus:ring-offset-primary"
                    aria-label={label}
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
      
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-primary-foreground/20 bg-primary/90">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            {/* Logo/Branding */}
            <div className="flex items-center gap-3">
              <BurundiFlag size={24} />
              <p className="text-sm text-primary-foreground/90 md:text-base">
                {language === "fr"
                  ? "A.E.P.V.B"
                  : "A.E.P.V.B"}
              </p>
            </div>

            {/* Copyright */}
            <p className="text-sm text-primary-foreground/80 md:text-base">
              © {currentYear} A.E.P.V.B – Burundi.{" "}
              {language === "fr" ? "Tous droits réservés." : "All rights reserved."}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
