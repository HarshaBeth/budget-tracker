import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  const supabase = await createClient();
  const session = await supabase.auth.getUser();

  if (session.data.user) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen w-full flex-col gap-4 items-center p-24 bg-gray-200">
      <div className="flex flex-col justify-center items-center gap-0">
        <h1 className="text-4xl font-bold font-serif">
          Budget & Expense Tracker
        </h1>
        <p className=" text-md text-gray-400">
          Track your expenses and manage your budget effectively.
        </p>
      </div>

      <div className="bg-white px-10 py-4 rounded-lg shadow-md ">
        {/* Steps to follow */}
        <h2 className="font-bold text-lg italic">How to Use:</h2>
        <ul className="font-serif mt-2 list-disc list-inside">
          <li>Set your monthly budget</li>
          <li>Add categories where you spend your money</li>
          <li>Track your expenses within each category</li>
          <li>Review your spending and adjust your budget as needed!</li>
        </ul>

        <div className="w-full flex justify-center">
          <Link
            href={"/auth"}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-2 rounded-md mt-4 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </main>
  );
}
