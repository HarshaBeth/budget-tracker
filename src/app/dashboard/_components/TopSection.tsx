"use client";
import { ChartPieDonutText } from "@/components/ui/DonutWithText";
import { supabase } from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";

function TopSection() {
  const [totalBudget, setTotalBudget] = useState(0);
  const [totalBudgetUsed, setTotalBudgetUsed] = useState(0);

  useEffect(() => {
    const fetchBudget = async () => {
      const { data } = await supabase.auth.getUser();
      const { data: budgetData, error } = await supabase
        .from("budgets")
        .select("total_budget")
        .eq("user_id", data.user?.id)
        .single();
      if (error) {
        console.error("Error fetching budget:", error);
      } else if (budgetData) {
        setTotalBudget(budgetData.total_budget);
      }
    };
    fetchBudget();
  }, [totalBudget]);

  useEffect(() => {
    const fetchTotalBudgetUsed = async () => {
      const { data } = await supabase.auth.getUser();
      const { data: spendingData, error } = await supabase
        .from("Spendings")
        .select("cost")
        .eq("user_id", data.user?.id);
      if (error) {
        console.error("Error fetching spending:", error);
      } else if (spendingData) {
        const totalUsed = spendingData.reduce(
          (acc, curr) => acc + (curr.cost || 0),
          0
        );
        setTotalBudgetUsed(totalUsed);
        console.log(totalUsed);
      }
    };
    fetchTotalBudgetUsed();
  }, []);

  const [categoriesBudgetUsed, setCategoriesBudgetUsed] = useState<{
    [key: string]: number;
  }>({});
  useEffect(() => {
    const fetchCategoryBudgetUsed = async () => {
      const { data } = await supabase.auth.getUser();
      const { data: spendingData, error } = await supabase
        .from("Spendings")
        .select("cost, category")
        .eq("user_id", data.user?.id);

      if (error) {
        console.error("Error fetching spending by category:", error);
      } else if (spendingData) {
        const categoryTotals: { [key: string]: number } = {};
        spendingData.forEach((spending) => {
          if (spending.category) {
            if (!categoryTotals[spending.category]) {
              categoryTotals[spending.category] = 0;
            }
            categoryTotals[spending.category] += spending.cost || 0;
          }
        });
        setCategoriesBudgetUsed(categoryTotals);
        console.log(categoryTotals);
      }
    };
    fetchCategoryBudgetUsed();
  }, []);

  return (
    <div className="flex gap-4">
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
