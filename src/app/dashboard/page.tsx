import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import React from "react";
import TopSection from "./_components/TopSection";
import SecondSection from "./_components/SecondSection";

async function page() {
  const supabase = await createClient();
  const session = await supabase.auth.getUser();

  if (!session.data.user) {
    redirect("/auth");
  }

  const { data: budgetData, error } = await supabase
    .from("budgets")
    .select("total_budget")
    .eq("user_id", session.data.user.id)
    .maybeSingle();

  if (error) {
    console.error("Error fetching budget:", error);
    return <div>Error loading budget</div>;
  }

  const totalBudget = budgetData ? budgetData.total_budget : 0;

  return (
    <div className="min-h-screen w-full flex flex-col flex-1 py-20 items-center bg-gray-200">
      <div className="flex flex-col gap-4 items-center max-w-7xl ">
        <div className="w-full flex justify-start">
          <h1 className="font-sans text-3xl font-bold">
            Your Budget: ${totalBudget}
          </h1>
        </div>
        <div className="flex gap-4 h-full w-full justify-center flex-col items-center ">
          <div className="max-w-7xl h-full w-full flex-col items-center ">
            <TopSection />
          </div>
          <div className="max-w-7xl w-full">
            <SecondSection />
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
