"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "@/components/LanguageProvider";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  const { t } = useTranslations();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("contact.validation.required");
    }
    if (!formData.email.trim()) {
      newErrors.email = t("contact.validation.required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("contact.validation.email");
    }
    if (!formData.subject.trim()) {
      newErrors.subject = t("contact.validation.required");
    }
    if (!formData.message.trim()) {
      newErrors.message = t("contact.validation.required");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" });
      // In a real app, you would send the form data to your backend
    }, 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="container mx-auto px-4 ">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">{t("contact.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("contact.subtitle")}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Contact Form */}
        <Card>
          <CardHeader>
            <CardTitle>Envoyez-nous un message</CardTitle>
          </CardHeader>
          <CardContent>
            {submitStatus === "success" ? (
              <div className="rounded-lg bg-green-50 p-4 text-green-800">
                <p className="font-semibold">{t("contact.success")}</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => setSubmitStatus("idle")}
                >
                  Envoyer un autre message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium">
                    {t("contact.form.name")} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    aria-invalid={errors.name ? "true" : "false"}
                    aria-describedby={errors.name ? "name-error" : undefined}
                  />
                  {errors.name && (
                    <p id="name-error" className="mt-1 text-sm text-destructive">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="mb-2 block text-sm font-medium">
                    {t("contact.form.email")} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    aria-invalid={errors.email ? "true" : "false"}
                    aria-describedby={errors.email ? "email-error" : undefined}
                  />
                  {errors.email && (
                    <p id="email-error" className="mt-1 text-sm text-destructive">
                      {errors.email}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="subject" className="mb-2 block text-sm font-medium">
                    {t("contact.form.subject")} <span className="text-destructive">*</span>
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    aria-invalid={errors.subject ? "true" : "false"}
                    aria-describedby={errors.subject ? "subject-error" : undefined}
                  />
                  {errors.subject && (
                    <p id="subject-error" className="mt-1 text-sm text-destructive">
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium">
                    {t("contact.form.message")} <span className="text-destructive">*</span>
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={6}
                    aria-invalid={errors.message ? "true" : "false"}
                    aria-describedby={errors.message ? "message-error" : undefined}
                  />
                  {errors.message && (
                    <p id="message-error" className="mt-1 text-sm text-destructive">
                      {errors.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? t("common.loading") : t("contact.form.send")}
                </Button>

                {submitStatus === "error" && (
                  <p className="text-sm text-destructive text-center">
                    {t("contact.error")}
                  </p>
                )}
              </form>
            )}
          </CardContent>
        </Card>

        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("contact.info.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{t("contact.info.address")}</p>
                  <address className="text-sm text-muted-foreground not-italic">
                    Kigobe, Avenue Adolphe Nshimirimana<br />
                    Immeuble Robbialac n°8<br />
                    Bujumbura-Burundi
                  </address>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{t("contact.info.phone")}</p>
                  <p className="text-sm text-muted-foreground">+257 61 098 263 / +257 79 136 228</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="mt-1 h-5 w-5 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-semibold">{t("contact.info.email")}</p>
                  <a
                    href="mailto:contact@aepvb.bi"
                    className="text-sm text-primary hover:underline"
                  >
                    contact@aepvb.bi
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video w-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Carte interactive à venir</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
