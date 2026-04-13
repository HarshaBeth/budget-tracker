"use client";
import AccordionComponent from "@/components/ui/AccordionComponent";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { supabase } from "@/lib/supabase/client";
import React, { useState, useEffect } from "react";

type CategoryBudget = {
  category: string;
  allocated: number;
  used: number;
};

function SecondSection() {
  const [data, setData] = useState<CategoryBudget[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        /** 1️⃣ Fetch budget categories */
        const { data: categories, error: categoriesError } = await supabase
          .from("budget_categories")
          .select("category, amount")
          .eq("user_id", user.id);

        if (categoriesError) {
          console.error(categoriesError);
          return;
        }

        /** 2️⃣ Fetch spending */
        const { data: spending, error: spendingError } = await supabase
          .from("Spendings")
          .select("category, cost")
          .eq("user_id", user.id);

        if (spendingError) {
          console.error(spendingError);
          return;
        }

        /** 3️⃣ Aggregate spendings by category */
        const spentByCategory = (spending ?? []).reduce<Record<string, number>>(
          (acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + curr.cost;
            return acc;
          },
          {}
        );

        /** 4️⃣ Merge budgets + usage */
        const merged: CategoryBudget[] = categories.map((cat) => ({
          category: cat.category,
          allocated: cat.amount,
          used: spentByCategory[cat.category] ?? 0,
        }));

        setData(merged);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div>
      {loading ? (
        <LoadingScreen
          title="Loading category details"
          description="Calculating allocated and used amounts by category."
          variant="section"
          panelCount={1}
        />
      ) : (
        <AccordionComponent data={data} />
      )}
    </div>
  );
}

export default SecondSection;
