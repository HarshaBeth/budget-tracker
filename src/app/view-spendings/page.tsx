import { createClient } from "../../lib/supabase/server";
import { Suspense } from "react";
import ViewSpending from "./_components/ViewSpending";

async function TotalSpending() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    return null;
  }
  const { data: spending, error } = await supabase
    .from("Spendings")
    .select("cost")
    .eq("user_id", user.data.user?.id);

  if (error) {
    console.error("Error fetching total spending:", error);
    return <div>Error calculating total</div>;
  }

  const total = spending?.reduce((sum, item) => sum + (item.cost || 0), 0) || 0;
  return (
    <div className="text-gray-900 text-xl font-bold mt-4">
      Total Spending: ${total}
    </div>
  );
}

export default function ViewSpendings() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-200 flex-1">
      <div className=" flex flex-col items-center p-4 max-w-7xl  h-full">
        <Suspense
          fallback={<div className="text-gray-200">Loading spending...</div>}
        >
          <div className="w-full max-w-7xl flex items-center">
            <ViewSpending />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
