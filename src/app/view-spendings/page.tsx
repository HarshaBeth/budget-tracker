import { createClient } from "../../lib/supabase/server";
import { Suspense } from "react";

async function SpendingsData() {
  const supabase = await createClient();
  const { data: spendings, error } = await supabase
    .from("Spendings")
    .select("*");

  if (error) {
    return <div>Error fetching data: {error.message}</div>;
  }

  if (!spendings || spendings.length === 0) {
    return <div>No spendings found.</div>;
  }
  return (
    <table className="w-full border border-gray-900 max-h-32 overflow-y-auto">
      <thead>
        <tr className="bg-gray-400">
          <th className="border px-4 py-2">Category</th>
          <th className="border px-4 py-2">Date</th>
          <th className="border px-4 py-2">Item</th>
          <th className="border px-4 py-2">Cost</th>
        </tr>
      </thead>
      <tbody className="bg-gray-300">
        {spendings.map((spending) => (
          <tr key={spending.id} className="text-center">
            <td className="border px-4 py-2">{spending.category}</td>
            <td className="border px-4 py-2">
              {new Date(spending.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </td>
            <td className="border px-4 py-2">{spending.item}</td>
            <td className="border px-4 py-2">${spending.cost}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

async function TotalSpendings() {
  const supabase = await createClient();
  const { data: spendings, error } = await supabase
    .from("Spendings")
    .select("cost");

  if (error) {
    console.error("Error fetching total spendings:", error);
    return <div>Error calculating total</div>;
  }

  const total =
    spendings?.reduce((sum, spending) => sum + (spending.cost || 0), 0) || 0;
  return (
    <div className="text-gray-900 text-xl font-bold mt-4">
      Total Spendings: ${total}
    </div>
  );
}

export default function ViewSpendings() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-200 flex-1">
      <div className=" flex flex-col items-center p-4 max-w-7xl  h-full">
        <h1 className="text-2xl font-bold mb-4 font-serif">My Spendings</h1>
        <Suspense
          fallback={<div className="text-gray-200">Loading spendings...</div>}
        >
          <div className="w-full max-w-7xl flex items-center">
            <SpendingsData />
          </div>
          <TotalSpendings />
        </Suspense>
      </div>
    </div>
  );
}
