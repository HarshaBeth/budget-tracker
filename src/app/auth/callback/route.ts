import { NextResponse } from 'next/server'
// The client you created from the Server-Side Auth instructions
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // if "next" is in param, use it as the redirect URL
  let next = searchParams.get('next') ?? '/dashboard'
  if (!next.startsWith('/')) {
    // if "next" is not a relative URL, use the default
    next = '/dashboard'
  }

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
        const {data: { user }} = await supabase.auth.getUser();
        console.log("AUTH CALLBACK HIT");

        if (user) {
            // Create profile if it doesn't exist
            const { data: profile } = await supabase
                .from("profiles")
                .select("id")
                .eq("id", user.id)
                .maybeSingle();

            if (!profile) {
                const {error: insertError} = await supabase.from("profiles").insert({
                id: user.id,
                full_name: user.user_metadata.full_name,
                });

                console.log("PROFILE INSERT ERROR:", insertError);
            }
        }

      const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
      const isLocalEnv = process.env.NODE_ENV === 'development'
      if (isLocalEnv) {
        // we can be sure that there is no load balancer in between, so no need to watch for X-Forwarded-Host
        return NextResponse.redirect(`${origin}${next}`)
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`)
      } else {
        return NextResponse.redirect(`${origin}${next}`)
      }
    }

    

    // const {data: { user }} = await supabase.auth.getUser();

    // if (user) {
    // // Create profile if it doesn't exist
    // const { data: profile } = await supabase
    //     .from("profiles")
    //     .select("id")
    //     .eq("id", user.id)
    //     .single();

    // if (!profile) {
    //     await supabase.from("profiles").insert({
    //     id: user.id,
    //     first_name: user.user_metadata.given_name,
    //     last_name: user.user_metadata.family_name,
    //     });
    // }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}


// import { NextResponse } from "next/server";
// import { createClient } from "@/lib/supabase/server";

// export async function GET(request: Request) {
//   const { searchParams, origin } = new URL(request.url);
//   const code = searchParams.get("code");
//   const next = searchParams.get("next") ?? "/dashboard";

//   if (code) {
//     const supabase = await createClient();

//     // REQUIRED: complete the OAuth flow
//     const { error } = await supabase.auth.exchangeCodeForSession(code);
//     console.log('This is the error:', error);

//     if (!error) {
//       // Now the session exists, we can access the user
//       const {
//         data: { user },
//       } = await supabase.auth.getUser();

//       if (user) {
//         // Create profile if it doesn't exist
//         const { data: profile } = await supabase
//           .from("profiles")
//           .select("id")
//           .eq("id", user.id)
//           .single();

//         if (!profile) {
//           await supabase.from("profiles").insert({
//             id: user.id,
//             first_name: user.user_metadata.given_name,
//             last_name: user.user_metadata.family_name,
//           });
//         }
//       }

//       return NextResponse.redirect(`${origin}${next}`);
//     }
//   }

//   return NextResponse.redirect(`${origin}/auth/auth-code-error`);
// }
