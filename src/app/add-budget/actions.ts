import { createClient } from "@/lib/supabase/server"

async function getCurrentBudgetId() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("budgets")
    .select("id, total_budget")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) throw error;
  return data;
}

async function getCategories(budgetId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("budget_categories")
    .select("id, category, amount")
    .eq("budget_id", budgetId)
    .order("created_at");

  if (error) throw error;
  return data;
}

async function addCategory(budgetId: string, category: string, amount: number) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error("Not authenticated")

  const { error } = await supabase.from("budget_categories").insert({
    budget_id: budgetId,
    user_id: user.id,
    category,
    amount,
  })

  if (error) throw error;
}

export { getCurrentBudgetId, getCategories, addCategory }
