"use client";
import { ChartPieDonutText } from "@/components/ui/DonutWithText";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { supabase } from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";

function TopSection() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalBudgetUsed, setTotalBudgetUsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [categoriesBudgetUsed, setCategoriesBudgetUsed] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const [{ data: budgetData, error: budgetError }, { data: spendingData, error: spendingError }] =
          await Promise.all([
            supabase
              .from("budgets")
              .select("total_budget")
              .eq("user_id", user.id)
              .maybeSingle(),
            supabase
              .from("Spendings")
              .select("cost, category")
              .eq("user_id", user.id),
          ]);

        if (budgetError) {
          console.error("Error fetching budget:", budgetError);
        } else if (budgetData) {
          setTotalBudget(budgetData.total_budget);
        }

        if (spendingError) {
          console.error("Error fetching spending:", spendingError);
          return;
        }

        const totalUsed =
          spendingData?.reduce((acc, curr) => acc + (curr.cost || 0), 0) || 0;
        setTotalBudgetUsed(totalUsed);

        const categoryTotals: { [key: string]: number } = {};
        spendingData?.forEach((spending) => {
          if (spending.category) {
            if (!categoryTotals[spending.category]) {
              categoryTotals[spending.category] = 0;
            }
            categoryTotals[spending.category] += spending.cost || 0;
          }
        });
        setCategoriesBudgetUsed(categoryTotals);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <LoadingScreen
        title="Loading dashboard charts"
        description="Preparing your budget usage and category insights."
        variant="section"
        panelCount={2}
      />
    );
  }

  return (
    <div className="flex gap-4 font-serif max-lg:flex-col w-full h-full justify-center items-center">
      <ChartPieDonutText
        title="Budget Usage"
        data={[
          {
            label: "Remaining Budget",
            value: totalBudget - totalBudgetUsed,
            fill: "#34D399",
          },
          { label: "Used Budget", value: totalBudgetUsed, fill: "#EF4444" },
        ]}
        centerAmount={totalBudgetUsed.toLocaleString()}
        date={new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        centerLabel="Budget Used"
        footerLabel={
          totalBudget - totalBudgetUsed <= 0
            ? "Warning: You have used up your budget!"
            : totalBudget - totalBudgetUsed <= 200
            ? "Caution: Low remaining budget"
            : "Sufficient budget remaining"
        }
      />

      <ChartPieDonutText
        title="Category Budget Usage"
        data={Object.entries(categoriesBudgetUsed).map(
          ([category, amount]) => ({
            label: category,
            value: amount,
          })
        )}
        centerAmount={totalBudgetUsed.toLocaleString()}
        date={new Date().toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
        centerLabel="All Categories"
        footerLabel={"Showing budget used by category"}
      />
    </div>
  );
}

export default TopSection;
