import { getUpcomingEvents, getPastEvents } from "@/lib/db/queries/events";
import EventsClient from "./EventsClient";

export default async function EventsPage() {
  const [upcoming, past] = await Promise.all([
    getUpcomingEvents(),
    getPastEvents(),
  ]);
  return <EventsClient upcoming={upcoming} past={past} />;
}
