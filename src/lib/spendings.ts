import type { SupabaseClient } from "@supabase/supabase-js";

const getCurrentMonthStartIso = (date = new Date()) => {
  const monthStart = new Date(date.getFullYear(), date.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);
  return monthStart.toISOString();
};

const clearStaleSpendings = async (
  supabase: SupabaseClient,
  userId: string,
) => {
  return supabase
    .from("Spendings")
    .delete()
    .eq("user_id", userId)
    .lt("created_at", getCurrentMonthStartIso());
};

export { clearStaleSpendings, getCurrentMonthStartIso };
