'use server'

import { redirect } from 'next/navigation'
import { createClient } from './supabase/server'

const SignInWith = (provider: string) => {
  return async (formData: FormData) => {
    const supabase = await createClient()

    const auth_callback_url = `${process.env.SITE_URL}/auth/callback`

    const {data, error} = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: auth_callback_url,
      },
    })

    console.log(data);

    if (error) {
      console.log(error)
    }

    if (data.url) {
      redirect(data.url)
    }
  }
}

const signinWithGoogle = SignInWith('google')

const signOut = async () => {
   const supabase = await createClient();
   await supabase.auth.signOut();
}

const updateTotalBudget = async ( totalBudget: number) => {
  const supabase = await createClient();

    const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error("Not authenticated")
  
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const monthDate = `${year}-${month}-01`

  
  const { error } = await supabase.from('budgets').upsert({
    month: monthDate,
    total_budget: totalBudget,
    user_id: user.id,
  },
  {onConflict: "user_id,month"}
)

  if (error) throw error;
}

export { signinWithGoogle, signOut, updateTotalBudget }




