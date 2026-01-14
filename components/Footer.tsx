"use client";

import Link from "next/link";
import { Facebook, Twitter, Instagram, Mail } from "lucide-react";
import { useTranslations } from "@/components/LanguageProvider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { BurundiFlag } from "@/components/Flag";

export function Footer() {
  const { t, language } = useTranslations();
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { href: "/about", label: t("nav.about") },
    { href: "/programs", label: t("nav.programs") },
    { href: "/news", label: t("nav.news") },
    { href: "/events", label: t("nav.events") },
    { href: "/gallery", label: t("nav.gallery") },
    { href: "/contact", label: t("nav.contact") },
  ];

  return (
    <footer className="border-t bg-muted/50" aria-label="Footer">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">{t("footer.about")}</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {language === "fr"
                ? "Action pour l'Encadrement et la Promotion des Vulnérables au Burundi"
                : "Action for the Support and Promotion of Vulnerable People in Burundi"}
            </p>
            <address className="text-sm text-muted-foreground not-italic">
              Kigobe, Avenue Adolphe Nshimirimana<br />
              Immeuble Robbialac n°8<br />
              Bujumbura-Burundi
            </address>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">{t("footer.quickLinks")}</h3>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">
              {t("footer.newsletter.title")}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {t("footer.newsletter.subtitle")}
            </p>
            <form className="space-y-2" onSubmit={(e) => e.preventDefault()}>
              <Input
                type="email"
                placeholder={t("footer.newsletter.placeholder")}
                aria-label={t("footer.newsletter.placeholder")}
                required
              />
              <Button type="submit" className="w-full">
                {t("footer.newsletter.subscribe")}
              </Button>
            </form>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="mb-4 font-semibold text-lg">{t("footer.social")}</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t pt-8 flex flex-col items-center justify-center gap-3">
          <div className="flex items-center justify-center gap-2">
            <BurundiFlag size={20} />
            <p className="text-sm text-muted-foreground">
              {t("footer.copyright", { year: currentYear.toString() })}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
