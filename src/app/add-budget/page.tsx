import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation';
import React from 'react'
import EditTotalBudget from './_components/EditTotalBudget';
import { updateTotalBudget } from '@/lib/actions';

async function page() {
    const supabase = await createClient();
    const session = await supabase.auth.getUser();

    if(!session.data.user) {
        redirect('/auth');
    }



  return (
    <div className='h-screen w-full flex items-center justify-center flex-1 flex-col bg-gray-200'>
      <EditTotalBudget handleTotalBudgetUpdate={updateTotalBudget} />
    </div>
  )
}

export default page
