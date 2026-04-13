"use client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { supabase } from "@/lib/supabase/client";
import { clearStaleSpendings } from "@/lib/spendings";
import { redirect } from "next/navigation";
import React, { useState, useEffect } from "react";

export default function AddSpending() {
  const [item, setItem] = useState("");
  const [cost, setCost] = useState("");
  const [category, setCategory] = useState("");
  const [loadingCategories, setLoadingCategories] = useState(true);

  const handleItemAdded = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate that item and cost are not empty
    if (!item.trim() || !cost.trim()) {
      alert("Please fill in all fields");
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert("You must be signed in to add spending");
      return;
    }

    const { error: resetError } = await clearStaleSpendings(supabase, user.id);

    if (resetError) {
      console.error("Error clearing old spendings:", resetError);
      alert("Error resetting last month's spendings");
      return;
    }

    const { error } = await supabase.from("Spendings").insert([
      {
        item: item,
        cost: parseFloat(cost),
        category: category,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error adding item:", error);
      alert("Error adding item");
    } else {
      alert("Item added successfully");
      setItem("");
      setCost("");
      setCategory("");
    }
  };

  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          redirect("/auth");
        }

        const { data, error } = await supabase
          .from("budget_categories")
          .select("category")
          .eq("user_id", user?.id);

        if (error) {
          console.error("Error fetching categories:", error);
        } else if (data) {
          const uniqueCategories = Array.from(
            new Set(data.map((cat) => cat.category)),
          ).map((cat, index) => ({ id: index.toString(), name: cat }));
          setCategories(uniqueCategories);
        }
      } finally {
        setLoadingCategories(false);
      }
    };
    fetchCategories();
  }, []);

  if (loadingCategories) {
    return (
      <LoadingScreen
        title="Loading spending form"
        description="Getting your budget categories ready."
        panelCount={1}
      />
    );
  }

  return (
    <div className="flex justify-center bg-gray-200 min-h-screen w-full">
      <div className="max-w-7xl p-10 flex justify-center items-center">
        <form
          onSubmit={handleItemAdded}
          className="flex flex-col gap-4 bg-white p-6 rounded-md shadow-md w-full max-w-md"
        >
          <h1 className="text-2xl font-bold mb-1 text-black font-serif">
            Add Your Spending:
          </h1>
          <hr className=" text-gray-200 mb-4" />
          <label className="flex flex-col text-black font-medium font-serif">
            Add item name:
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
          <label className="flex flex-col text-black font-medium font-serif">
            Cost of item:
            <input
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
              min="0"
              step="0.01"
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>
          <label className="flex flex-col text-black font-medium font-serif">
            <div className="flex flex-col">
              <span>Category:</span>
              <span className="text-xs text-gray-500">
                (Select from existing categories or add one from the &apos;Add
                Budget&apos; page)
              </span>
            </div>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="" disabled>
                Select Category
              </option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors font-sans"
          >
            Add Spending
          </button>
        </form>
      </div>
    </div>
  );
}
