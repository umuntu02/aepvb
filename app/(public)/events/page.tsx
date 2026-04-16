import { getUpcomingEvents, getPastEvents } from "@/lib/db/queries/events";
import EventsClient from "./EventsClient";

export default async function EventsPage({
  searchParams: _searchParams,
}: {
  searchParams: Promise<{ lang?: string }>;
}) {
  // DECISION: language selection in EventsClient is via useTranslations()
  // context which syncs from the URL param — no server-side lang needed here.
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);
  return <EventsClient upcoming={upcoming} past={past} />;
}
