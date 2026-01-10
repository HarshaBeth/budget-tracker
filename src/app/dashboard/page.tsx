import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation';
import React from 'react'

async function page() {

  const supabase = await createClient();
  const session = await supabase.auth.getUser();

  if(!session.data.user) {
    redirect('/auth');
  }
  return (
    <div className='h-screen flex flex-1 justify-center py-20 bg-gray-200'>
      <div className='max-w-7xl'>

        <h1>This is the Dashboard Page</h1>
      </div>
    </div>
  )
}

export default page
