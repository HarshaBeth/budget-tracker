"use client";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { supabase } from "@/lib/supabase/client";
import React, { useEffect, useState } from "react";
import DeleteIcon from "../../../../public/delete_icon.png";
import Image from "next/image";

type Spending = {
  id: number;
  category: string;
  item: string;
  cost: number;
  created_at: string;
};

function ViewSpending() {
  const [spending, setSpending] = useState<Spending[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState<string>("User");
  const [totalSpending, setTotalSpending] = useState<number>(0);

  useEffect(() => {
    const fetchSpending = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error(profileError);
      } else {
        setUserName(profileData?.full_name || "User");
      }

      const { data, error } = await supabase
        .from("Spendings")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error(error);
      } else {
        setSpending(data as Spending[]);
      }

      const { data: spendingCosts } = await supabase
        .from("Spendings")
        .select("cost")
        .eq("user_id", user.id);

      const totalCost =
        spendingCosts?.reduce((sum, item) => sum + item.cost, 0) || 0;

      setTotalSpending(totalCost);
      setLoading(false);
    };

    fetchSpending();
  }, [spending.length]);

  const handleDelete = async (id: number) => {
    const { error } = await supabase.from("Spendings").delete().eq("id", id);

    if (error) {
      console.error(error);
      return;
    }

    // Update UI immediately
    setSpending((prev) => prev.filter((item) => item.id !== id));
  };

  if (loading)
    return (
      <LoadingScreen
        title="Loading spending history"
        description="Gathering your latest transactions and totals."
        variant="section"
        panelCount={1}
      />
    );
  if (spending.length === 0 && userName !== "User")
    return (
      <p className="text-3xl font-mono mt-4">
        You have not added any spending {userName}
      </p>
    );

  return (
    <div className="flex flex-col items-center gap-4 h-full w-full">
      <h1 className="text-2xl font-serif font-semibold text-gray-700 max-md:text-xl">
        {userName}&apos;s Spending History
      </h1>
      <table className="w-full border-collapse max-md:w-full">
        <thead>
          <tr className="bg-gray-400">
            <th className="border px-4 py-2">Category</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Item</th>
            <th className="border px-4 py-2">Cost</th>
          </tr>
        </thead>
        <tbody className="bg-gray-300">
          {spending.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border px-4 py-2">{item.category}</td>
              <td className="border px-4 py-2">
                {new Date(item.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </td>
              <td className="border px-4 py-2">{item.item}</td>
              <td className="border px-4 py-2">${item.cost}</td>
              <td className="border px-4 py-2 bg-gray-200 max-md:px-1">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-400/45 px-1 py-1 rounded-md hover:bg-red-500/60 hover:cursor-pointer"
                >
                  <Image
                    src={DeleteIcon}
                    alt="Delete"
                    className="h-5 w-5 mx-auto max-md:mx-0"
                  />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <span className="font-bold font-serif text-2xl">
        Total Spending: ${totalSpending}
      </span>
    </div>
  );
}

export default ViewSpending;
