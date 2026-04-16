import { getAllPrograms } from "@/lib/db/queries/programs";
import ProgramsClient from "./ProgramsClient";

export default async function ProgramsPage({
  searchParams: _searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  // DECISION: searchParams accepted for Next.js typing completeness;
  // language selection for DB content happens in ProgramsClient via
  // useTranslations() context which syncs from the URL param.
  const programs = await getAllPrograms();
  return <ProgramsClient programs={programs} />;
}
