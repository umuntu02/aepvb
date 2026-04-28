import { getCTA } from "@/lib/db/queries/cta";
import CTAForm from "./_components/CTAForm";

export default async function CTASectionPage() {
  const cta = await getCTA();
  return <CTAForm initialData={cta ?? undefined} />;
}
