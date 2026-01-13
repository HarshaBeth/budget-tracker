'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import HomeImage from '../../../public/overview_icon.png';
import ViewSpendingsIcon from '../../../public/view_icon.png';
import AddSpendingIcon from '../../../public/add_icon.png';
import SideBarOpen from '../../../public/sidebar_open_icon.png';
import SideBarClose from '../../../public/sidebar_close_icon.png';
import { signOut } from '@/lib/actions';

type SideBarProps = {
    user_name?: string;
};

function SideBar({user_name}: SideBarProps) {

    const [isOpen, setIsOpen] = useState(true);
    const [userButtonOpen, setUserButtonOpen] = useState(false);

    const handleClose = () => {
        setIsOpen(!isOpen);
    };

    const handleUserButton = () => {
        setUserButtonOpen(!userButtonOpen);
    }

    useEffect(() => {
    const handleClickOutside = () => {
      setUserButtonOpen(false);
    };

    if (userButtonOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [userButtonOpen]);

  return (
    <>
      <div className={`flex flex-col gap-4 sticky top-0 left-0 h-screen bg-black text-white font-sans transition-all duration-300 ease-in-out ${isOpen ? 'w-60' : 'w-20'} ${!isOpen && 'items-center'}`}>
        <span className='absolute -right-4 top-4 cursor-pointer' onClick={handleClose}>{isOpen ? <span className='bg-green-500 px-2.5 pt-0.5 pb-1 text-black font-bold flex '>x</span> : <Image src={SideBarOpen} alt="Open" className='bg-black h-7 w-7' width={50} height={50} />}</span>
        <div className='flex flex-col h-full justify-between w-full p-4'>
            <div className='flex flex-col'>
                <Link href={'/dashboard'} className={`mt-20 flex gap-3 ${!isOpen && 'justify-center'} hover:bg-gray-700 rounded-lg py-3 px-2`}> <Image className='h-5 w-5' src={HomeImage} alt="Home" /> {isOpen && <span className={`transition ease-in-out duration-500 ${isOpen? "opacity-100" : "opacity-0"}`}>Overview</span>}</Link>
                <Link href="/view-spendings" className={`flex gap-3 ${!isOpen && 'justify-center'} hover:bg-gray-700 rounded-lg py-3 px-2`}><Image className='h-5 w-5' src={ViewSpendingsIcon} alt="View Spendings" /> {isOpen && <span className={`transition ease-in-out duration-500 ${isOpen? "opacity-100" : "opacity-0"}`}>View Spendings</span>}</Link>
                <Link href="/add-spending" className={`flex gap-3 ${!isOpen && 'justify-center'} hover:bg-gray-700 rounded-lg py-3 px-2`}><Image className='h-5 w-5' src={AddSpendingIcon} alt="Add Spending" /> {isOpen && <span className={`transition ease-in-out duration-500 ${isOpen? "opacity-100" : "opacity-0"}`}>Add Spending</span>}</Link>
                <Link href="/add-budget" className={`flex gap-3 ${!isOpen && 'justify-center'} hover:bg-gray-700 rounded-lg py-3 px-2`}><Image className='h-5 w-5' src={AddSpendingIcon} alt="Add Budget" /> {isOpen && <span className={`transition ease-in-out duration-500 ${isOpen? "opacity-100" : "opacity-0"}`}>Add Budget</span>}</Link>
            </div>

            <div className={`flex flex-col gap-4 ${isOpen ? 'relative': ''}`}>
              {userButtonOpen ? <span onClick={signOut} className={`border-2 px-2 py-3 rounded-lg hover:cursor-pointer min-w-50 max-w-50 absolute ${isOpen ? '-top-16 bg-red-500/45 border-red-400/45' : '-right-52 bg-red-600 border-red-500 bottom-2.5'} text-center font-serif`}>Sign Out</span> : null}

              <div onClick={handleUserButton} className={`flex gap-2 items-center font-sans font-semibold ${!isOpen && 'justify-center'} hover:cursor-pointer`}>
                  <div className='bg-red-400 rounded-full py-2 px-3.5 w-fit'>{user_name?.charAt(0)}</div>
                  {isOpen && <span className={`${isOpen ? "":""}`}>{user_name}</span>}
                  
              </div>
            </div>
        </div>
      </div>
    </>
  );
}

export default SideBar
