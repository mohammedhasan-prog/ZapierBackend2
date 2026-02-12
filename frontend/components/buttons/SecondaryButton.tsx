"use client"
import React from 'react'
const SecondaryButton = ({children, onClick,size='sm'}: {children: React.ReactNode, onClick: () => void,
    size?: 'sm' | 'md' | 'lg'
}) => {
  return (
    <div className={`${size === 'sm' ? 'px-5 py-1 text-xs ' : size === 'md' ? 'px-4 py-2 text-base' : 'px-8 py-3 text-lg'}  text-black border-black border rounded-xl  cursor-pointer  flex flex-col justify-center hover:shadow-md `} onClick={onClick}>
      {children}
    </div>
  )
}

export default SecondaryButton