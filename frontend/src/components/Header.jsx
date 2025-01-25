import React from 'react'
import Lilo from '../components/Lilo';

const Header = ({title}) => {
  return (
    <div className='w-full flex justify-between border-y-2 border-black items-center h-[58px]'>
        <h1 className='text-black px-[72px] font-bold text-3xl'>{title}</h1>
        <div className='flex flex-row '>
            <h1 className='text-black font-semibold px-[64px] py-[32px] text-xl'>User@882003</h1>
            <Lilo></Lilo>
        </div>
    </div>
  )
}

export default Header