import { createClient } from "@/lib/supabase/server";
import { BookingCard } from "@/components/dashboard/BookingCard";
import { getSentBookings } from "@/lib/queries/bookings";
import { redirect } from "next/navigation";

export default async function MyRequestsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard/my-requests");
  }

  const bookings = await getSentBookings(user.id);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
        申込状況
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        あなたがCreatorに送った申込の状況を確認できます。
      </p>

      {bookings.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">
          まだ申込はありません。
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              otherPartyLabel="依頼先"
            />
          ))}
        </div>
      )}
    </main>
  );
}
