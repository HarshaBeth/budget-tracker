"use client";
import React, { useState } from "react";

type Props = {
  handleTotalBudgetUpdate: (totalBudget: number) => Promise<void>;
};

function EditTotalBudget({ handleTotalBudgetUpdate }: Props) {
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return now.toLocaleString("default", { month: "long" });
  });
  const [totalBudget, setTotalBudget] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(totalBudget);
    if (isNaN(amount)) return;
    handleTotalBudgetUpdate(amount)
      .then(() => {
        alert("Total budget updated successfully");
        setTotalBudget("");
      })
      .catch((error) => {
        alert("Failed to update total budget: " + error.message);
      });
  };

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
      <div className="bg-white p-6 rounded-md shadow-md w-full max-w-md mt-4">
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
            className="flex-1 border rounded-md p-2"
          />

          <input
            type="number"
            placeholder="Amount"
            min="0"
            className="w-32 border rounded-md p-2"
          />

          <button className="bg-black text-white px-4 rounded-md">Add</button>
        </div>

        {/* Categories List */}
        <div className="space-y-2">
          {/* Example row */}
          <div className="flex justify-between items-center border-b pb-2">
            <span>Food</span>
            <span>$500</span>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 border-t pt-4 text-sm text-gray-600">
          <div className="flex justify-between">
            <span>Allocated</span>
            <span>$1800</span>
          </div>
          <div className="flex justify-between font-semibold">
            <span>Remaining</span>
            <span>$200</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditTotalBudget;
