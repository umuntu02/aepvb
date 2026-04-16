import { getAllPrograms } from "@/lib/db/queries/programs";
import ProgramsClient from "./ProgramsClient";

export default async function ProgramsPage() {
  const programs = await getAllPrograms();
  return <ProgramsClient programs={programs} />;
}
