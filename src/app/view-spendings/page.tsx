import { createClient } from "../../lib/supabase/server";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { Suspense } from "react";
import ViewSpending from "./_components/ViewSpending";
import { redirect } from "next/navigation";

export default async function ViewSpendings() {
  const supabase = await createClient();
  const user = await supabase.auth.getUser();

  if (!user.data.user) {
    redirect("/auth");
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-200 flex-1">
      <div className=" flex flex-col items-center p-4 max-w-7xl  h-full">
        <Suspense
          fallback={
            <LoadingScreen
              title="Loading spending history"
              description="Gathering your latest transactions and totals."
              variant="section"
              panelCount={1}
            />
          }
        >
          <div className="w-full max-w-7xl flex items-center">
            <ViewSpending />
          </div>
        </Suspense>
      </div>
    </div>
  );
}
