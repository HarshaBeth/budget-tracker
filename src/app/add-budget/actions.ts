import { createClient } from "@/lib/supabase/server"

async function getCurrentBudgetId() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const monthDate = `${year}-${month}-01`;

  const { data, error } = await supabase
    .from("budgets")
    .select("id, total_budget")
    .eq("user_id", user.id)
    .eq("month", monthDate)
    .single();

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