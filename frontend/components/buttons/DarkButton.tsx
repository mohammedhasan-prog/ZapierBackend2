"use client"
import React, { useEffect } from 'react'
import axios from 'axios'
import { BACKEND_URL } from '@/app/config';



const DarkButton = ({children, onClick,size='sm'}: {children: React.ReactNode, onClick: () => void,
    size?: 'sm' | 'md' | 'lg'
}) => {
  return (
    <div className={`${size === 'sm' ? 'px-5 py-1 text-xs ' : size === 'md' ? 'px-4 py-2 text-base' : 'px-8 py-2 text-lg'} bg-purple-700 text-white rounded-sm  cursor-pointer  flex flex-col justify-center hover:shadow-md `} onClick={onClick}>
      {children}
    </div>
  )
}

export default DarkButton 
