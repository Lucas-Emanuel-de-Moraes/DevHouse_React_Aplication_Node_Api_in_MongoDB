import React, { useState } from 'react'

const Header = (props: { set: React.Dispatch<React.SetStateAction<string>>}) => {
  const [selected, setSelected] = useState<string>('Home')
  return (
    <div className='w-full p-5 flex gap-5'>
      <h1 className='text-2xl text-white'>DEVHOUSE</h1>
      <div className='w-full bg-[#FFFFFF22] rounded flex'>
        <button 
          className={`${selected === 'Home' && 'bg-[#FFFFFF22]'} h-full flex items-center px-4 rounded text-white`}
          onClick={() => {
            setSelected('Home')
            props.set('Home')
          }}>Home</button>
        <button className={`${selected === 'Minhas Casas' && 'bg-[#FFFFFF22]'} h-full flex items-center px-4 rounded text-white`}
          onClick={() => {
            setSelected('Minhas Casas')
            props.set('Minhas Casas')
          }}>Minhas Casas</button>
      </div>
    </div>
  )
}

export default Header