"use server";

import { redirect } from "next/navigation";
import { createClient } from "./supabase/server";

type BudgetRow = {
  id: string;
  total_budget: number;
};

const SignInWith = (provider: "google") => {
  return async () => {
    const supabase = await createClient();

    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: auth_callback_url,
      },
    });

    console.log(data);

    if (error) {
      console.log(error);
    }

    if (data.url) {
      redirect(data.url);
    }
  };
};

const signinWithGoogle = SignInWith("google");

const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
};

const updateTotalBudget = async (totalBudget: number): Promise<BudgetRow> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const budgetValues = {
    total_budget: totalBudget,
    user_id: user.id,
  };

  let result = await supabase
    .from("budgets")
    .upsert(budgetValues, { onConflict: "user_id" })
    .select("id, total_budget")
    .single();

  if (
    result.error?.code === "23502" &&
    result.error.message.toLowerCase().includes("month")
  ) {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const monthDate = `${now.getFullYear()}-${month}-01`;

    result = await supabase
      .from("budgets")
      .upsert(
        {
          ...budgetValues,
          month: monthDate,
        },
        { onConflict: "user_id" },
      )
      .select("id, total_budget")
      .single();
  }

  const { data, error } = result;

  if (error) throw error;

  return data;
};

export { signinWithGoogle, signOut, updateTotalBudget };

