"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup } from "@/components/ui/radio-group";
import { useTranslations } from "@/components/LanguageProvider";
import { CreditCard, Smartphone, Banknote } from "lucide-react";

const PRESET_AMOUNTS = [10, 25, 50, 100, 250, 500];

export default function DonatePage() {
  const { t } = useTranslations();
  const [selectedAmount, setSelectedAmount] = useState<string>("");
  const [customAmount, setCustomAmount] = useState("");
  const [recurring, setRecurring] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitStatus("success");
      // In a real app, you would handle payment processing here
    }, 2000);
  };

  const amountOptions = PRESET_AMOUNTS.map((amount) => ({
    value: amount.toString(),
    label: `${amount} $`,
  }));

  const paymentMethods = [
    { value: "card", label: t("donate.payment.method") + " - Carte de crédit", icon: CreditCard },
    { value: "mobile", label: "Mobile Money", icon: Smartphone },
    { value: "bank", label: "Virement bancaire", icon: Banknote },
  ];

  return (
    <div className="container mx-auto px-4  max-w-2xl">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-bold">{t("donate.title")}</h1>
        <p className="text-lg text-muted-foreground">{t("donate.subtitle")}</p>
      </div>

      {submitStatus === "success" ? (
        <Card className="border-green-500">
          <CardHeader>
            <CardTitle className="text-green-600">{t("donate.success")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Merci pour votre générosité ! Votre don contribuera à améliorer la vie des personnes vulnérables au Burundi.
            </p>
            <Button
              className="mt-4 w-full"
              onClick={() => {
                setSubmitStatus("idle");
                setSelectedAmount("");
                setCustomAmount("");
                setRecurring(false);
                setPaymentMethod("");
              }}
            >
              Faire un autre don
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Amount Selection */}
          <Card>
            <CardHeader>
              <CardTitle>{t("donate.amount.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <RadioGroup
                options={amountOptions}
                name="amount"
                value={selectedAmount}
                onChange={(e) => {
                  setSelectedAmount(e.target.value);
                  setCustomAmount("");
                }}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium">{t("donate.amount.custom")}</label>
                <Input
                  type="number"
                  placeholder={t("donate.amount.enter")}
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedAmount("");
                  }}
                  min="1"
                  step="1"
                />
              </div>
            </CardContent>
          </Card>

          {/* Recurring Donation */}
          <Card>
            <CardContent className="pt-6">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={recurring}
                  onCheckedChange={(checked) => setRecurring(checked === true)}
                />
                <div>
                  <p className="font-medium">{t("donate.recurring")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("donate.recurring.description")}
                  </p>
                </div>
              </label>
            </CardContent>
          </Card>

          {/* Payment Method */}
          <Card>
            <CardHeader>
              <CardTitle>{t("donate.payment.title")}</CardTitle>
              <CardDescription>{t("donate.payment.method")}</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                options={paymentMethods.map((method) => ({
                  value: method.value,
                  label: method.label,
                }))}
                name="paymentMethod"
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={isSubmitting || (!selectedAmount && !customAmount) || !paymentMethod}
          >
            {isSubmitting ? t("common.loading") : t("donate.submit")}
          </Button>

          {submitStatus === "error" && (
            <p className="text-sm text-destructive text-center">{t("donate.error")}</p>
          )}
        </form>
      )}
    </div>
  );
}
