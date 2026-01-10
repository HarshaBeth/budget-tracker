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

export { signinWithGoogle, signOut }





//  'use server'

//  import { Provider } from "@supabase/supabase-js"
// import { createClient } from "./supabase/server"

//  const SignInWith = async (provider: Provider) => {
//    return async (formData: FormData) => {

//       const supabase = await createClient();
      
//       const auth_callback_url = `${process.env.SITE_URL}/auth/callback`;
      
//       const {data, error} = await supabase.auth.signInWithOAuth({
//          provider: provider,
//          options: {
//             redirectTo: auth_callback_url,
//          },
//       })
      
//       console.log(data)
//       if (error) {
//          console.log(error)
//       }
//       //  if(data.url) {
//          //    redirect(data.url);
//          //  }
         
//    }
//  }

//  const signinWithGoogle = SignInWith('google');

//  export { signinWithGoogle };