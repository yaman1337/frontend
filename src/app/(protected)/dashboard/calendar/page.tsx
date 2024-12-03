import { Text } from "@/components/ui/text";
import { Plus } from "lucide-react";
import { DateCard } from "./date-card";
import CalendarSection from "./calendar-section";
import { getCalendars } from "@/server/calendar/get-calendars";
import Link from "next/link";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: { available: boolean; active?: number };
}) {
  const { available, active } = searchParams;
  const calendars = await getCalendars({ available });
  return (
    <section className="space-y-8 font-poppins @container">
      <span className="flex gap-x-3">
        <Text variant="display-sm" bold>
          Calendar
        </Text>

        <Link
          href="/dashboard/calendar/add"
          className="btn-primary gap-x-3 bg-black text-sm text-white"
        >
          <Plus size={16} />
          Add activity
        </Link>
      </span>
      <span className="flex flex-col items-start gap-x-4 gap-y-10 @4xl:flex-row">
        {calendars.data && (
          <CalendarSection
            data={
              active
                ? calendars?.data?.find((i) => i.id === Number(active))
                : calendars?.data?.[0]
            }
          />
        )}
        <div className="flex flex-wrap gap-4">
          {calendars.data.map((i, index) => (
            <DateCard
              key={`calendar-${i.id}`}
              data={i}
              active={active ? i.id === Number(active) : index === 0}
            />
          ))}
        </div>
      </span>
    </section>
  );
}
