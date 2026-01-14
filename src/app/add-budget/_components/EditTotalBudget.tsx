"use client";
import { supabase } from "@/lib/supabase/client";
import React, { useState, useEffect } from "react";

type Props = {
  handleTotalBudgetUpdate: (totalBudget: number) => Promise<void>;
};

function EditTotalBudget({ handleTotalBudgetUpdate }: Props) {
  const [totalBudget, setTotalBudget] = useState("");
  const [dbTotalBudget, setDbTotalBudget] = useState<number>(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(totalBudget);
    if (isNaN(amount)) return;
    handleTotalBudgetUpdate(amount)
      .then(() => {
        alert("Total budget updated successfully");
        setDbTotalBudget(amount);
        setTotalBudget("");
      })
      .catch((error) => {
        alert("Failed to update total budget: " + error.message);
      });
  };

  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");

  type CategoryRow = {
    id: string;
    category: string;
    amount: number;
  };

  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [budgetId, setBudgetId] = useState<string | null>(null);

  useEffect(() => {
    const loadBudget = async () => {
      const { data } = await supabase
        .from("budgets")
        .select("id, total_budget")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (data) {
        setBudgetId(data.id);
        setDbTotalBudget(data.total_budget);
      }
    };

    loadBudget();
  }, []);

  const fetchCategories = async () => {
    if (!budgetId) return;

    const { data } = await supabase
      .from("budget_categories")
      .select("id, category, amount")
      .eq("budget_id", budgetId)
      .order("created_at");

    if (data) setCategories(data);
  };

  useEffect(() => {
    if (!budgetId) return;

    (async () => {
      await fetchCategories();
    })();
  }, [budgetId]);

  const allocated = categories.reduce((sum, c) => sum + c.amount, 0);
  const remaining = dbTotalBudget - allocated;

  return (
    <div className="flex flex-col justify-center items-center">
      <div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 bg-white p-6 rounded-md shadow-md w-full max-w-md "
        >
          <h1 className="text-2xl font-bold mb-1 text-black font-serif">
            Update Your Monthly Total Budget:
          </h1>
          <input
            required
            type="number"
            min={"0"}
            value={totalBudget}
            onChange={(e) => setTotalBudget(e.target.value)}
            name="totalBudget"
            className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter new total budget"
          />
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors font-sans"
          >
            Update Budget
          </button>
        </form>

        <hr className="border-gray-300 my-4" />
      </div>

      {/* Add Categories Here */}
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md mt-4 ">
        <span className="flex flex-col mb-4">
          <h2 className="text-xl font-semibold">Allocate Your Budget</h2>
          <h5 className="text-gray-500 text-sm ">
            Split your budget to track your expenses effectively
          </h5>
        </span>

        {/* Input Row */}
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Category (e.g. Food)"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 border rounded-md p-2"
            required
          />

          <input
            type="number"
            placeholder="Amount"
            min="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-32 border rounded-md p-2"
            required
          />

          <button
            onClick={async () => {
              if (!category || !amount || !budgetId) return;

              const user = await supabase.auth.getUser();

              const { error } = await supabase
                .from("budget_categories")
                .insert({
                  budget_id: budgetId,
                  user_id: user.data.user?.id,
                  category,
                  amount: Number(amount),
                });

              if (!error) {
                setCategory("");
                setAmount("");
                fetchCategories();
              }
            }}
            className="bg-black text-white px-4 hover:bg-gray-900 transition-colors rounded-md"
          >
            Add
          </button>
        </div>

        {/* Categories List */}
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {/* Example row */}
          {categories.map((c) => (
            <div key={c.id} className="flex justify-between border-b pb-2 ">
              <span>{c.category}</span>
              <span className="flex items-center gap-1">
                <span>${c.amount}</span>
                <button
                  onClick={async () => {
                    const input = prompt(
                      `Enter new budget for "${c.category}":`,
                      String(c.amount)
                    );
                    if (input === null) return;
                    const newAmount = Number(input);
                    if (isNaN(newAmount) || newAmount < 1) {
                      alert("Invalid amount");
                      return;
                    }

                    const { data, error } = await supabase
                      .from("budget_categories")
                      .update({ amount: newAmount })
                      .eq("id", c.id)
                      .select()
                      .single();

                    if (error) {
                      alert("Failed to update category: " + error.message);
                      return;
                    }

                    setCategories((prev) =>
                      prev.map((p) =>
                        p.id === c.id ? { ...p, amount: newAmount } : p
                      )
                    );
                    alert(`Category *${c.category}* budget updated`);
                  }}
                  className="bg-green-600/45 hover:cursor-pointer"
                >
                  Update
                </button>
                <button
                  onClick={async () => {
                    const { error } = await supabase
                      .from("budget_categories")
                      .delete()
                      .eq("id", c.id);
                    if (error) {
                      alert("Failed to delete category: " + error.message);
                      return;
                    }
                    setCategories((prev) => prev.filter((p) => p.id !== c.id));
                    alert(`Category *${c.category}* deleted`);
                  }}
                  className="bg-red-500/45 hover:cursor-pointer"
                >
                  Delete
                </button>
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-4 border-t pt-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Allocated</span>
            <span>${allocated}</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Remaining</span>
            <span>${remaining}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTotalBudget;
