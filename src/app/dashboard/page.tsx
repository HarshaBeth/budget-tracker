import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation';
import React from 'react'



async function page() {

  const supabase = await createClient();
  const session = await supabase.auth.getUser();

  if(!session.data.user) {
    redirect('/auth');
  }

  const {data: budgetData, error} = await supabase.from('budgets'). select('total_budget').eq('user_id', session.data.user.id).single();

  if (error) {
    console.error('Error fetching budget:', error);
    return <div>Error loading budget</div>;
  }

  const totalBudget = budgetData ? budgetData.total_budget : 0;

  return (
    <div className='h-screen w-full flex flex-col flex-1 py-20 bg-gray-200'>
      
        <h1 className='font-mono text-3xl font-bold px-40'>Your Monthly Budget: ${totalBudget}</h1>
        <div className='flex h-full w-full justify-center'>

          <h1>This is the Dashboard Page</h1>
        </div>

    </div>
  )
}

export default page
