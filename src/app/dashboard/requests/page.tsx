import { createClient } from "@/lib/supabase/server";
import { BookingCard } from "@/components/dashboard/BookingCard";
import { getReceivedBookings } from "@/lib/queries/bookings";
import { redirect } from "next/navigation";

export default async function ReceivedRequestsPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard/requests");
  }

  const bookings = await getReceivedBookings(user.id);

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-xl font-medium text-gray-900 sm:text-2xl">
        受け取った申込
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        あなたのサービスに届いた申込を確認し、承認・辞退できます。
      </p>

      {bookings.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">
          まだ届いている申込はありません。
        </p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              otherPartyLabel="申込者"
              showActions
            />
          ))}
        </div>
      )}
    </main>
  );
}
