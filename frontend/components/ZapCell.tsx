import React from 'react'

const ZapCell = ({name,index,onClick}:{
    name: string,
    index: number,
    onClick?: () => void
}) => {
  return (
    <div className=' w-2/6 border border-black rounded-md px-4 py-6 flex  justify-center items-center bg-white shadow-md cursor-pointer hover:shadow-lg hover:bg-slate-100' onClick={onClick}>
       <div className='font-bold'>
        {index}.
       </div>
       <div className='font-bold '>
        {name}
       </div>
      
    </div>
  )
}

export default ZapCell
