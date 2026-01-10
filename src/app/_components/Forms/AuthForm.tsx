'use client'
import { signinWithGoogle } from '@/lib/actions'
import React from 'react'

const AuthForm = () => {
  return (
    <div className='flex justify-center items-center flex-1 w-full h-screen '>

        <form className='bg-black p-20 rounded-md flex flex-col gap-4 max-w-md'>
            <h1 className='text-white font-bold text-3xl'>Welcome to the Budget Tracker!</h1>
            <hr className='border-gray-600 my-4'/>
            <button formAction={signinWithGoogle} className='bg-green-600 hover:cursor-pointer hover:bg-green-700 text-white px-4 py-2 rounded transition'>
                Sign In with Google
            </button>
        </form>
    </div>
  )
}

export default AuthForm
