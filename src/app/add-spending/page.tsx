'use client'
import { supabase } from '@/lib/supabase/client'
import React, {useState} from 'react'

export default function AddSpending() {
    const [item, setItem] = useState('');
    const [cost, setCost] = useState('');
    const [category, setCategory] = useState('');

    const handleItemAdded = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validate that item and cost are not empty
        if (!item.trim() || !cost.trim()) {
          alert('Please fill in all fields');
          return;
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        const {data, error} = await supabase.from('Spendings').insert([
          { item: item, cost: parseFloat(cost), category: category, user_id: user?.id },
        ]);
    
        if (error) {
          console.error('Error adding item:', error);
          alert('Error adding item');
        } else {
          alert('Item added successfully');
          setItem('');
          setCost('');
          setCategory('');
        }
    }

  return (
    <div className='flex justify-center bg-gray-200 h-screen flex-1'>
        <div className='max-w-7xl p-10 w-5xl flex justify-center  items-center'>

            
            <form onSubmit={handleItemAdded} className='flex flex-col gap-4 bg-white p-6 rounded-md shadow-md w-full max-w-md '>
              <h1 className="text-2xl font-bold mb-1 text-black font-serif">Add Your Spendings:</h1>
              <hr className=' text-gray-200 mb-4' />
                <label className='flex flex-col text-black font-medium font-serif'>
                    Add item name:
                    <input type="text" value={item} onChange={(e) => setItem(e.target.value)} className='border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500' required />
                </label>
                <label className='flex flex-col text-black font-medium font-serif'>
                    Cost of item:
                    <input type="number" value={cost} onChange={(e) => setCost(e.target.value)} min="0" className='border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500' required />
                </label>
                <label className='flex flex-col text-black font-medium font-serif'>
                  Category:
                  <input type="text" value={category} onChange={(e) => setCategory(e.target.value)} className='border border-gray-300 rounded-md p-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-500' required />
                </label>
                <button type="submit" className='bg-black text-white px-4 py-2 rounded-md hover:bg-gray-900 transition-colors font-sans'>Add Spending</button>
            </form>
        </div>
    </div>
  )
}
