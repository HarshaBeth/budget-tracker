import React from 'react'
import AuthForm from '../_components/Forms/AuthForm'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation';

async function page() {

    const supabase = await createClient();
    const session = await supabase.auth.getUser();

    if(session.data.user) {
        redirect('/dashboard');
    }

  return (
    <div className='h-screen w-full '>
      
      <AuthForm />
    </div>
  )
}

export default page
