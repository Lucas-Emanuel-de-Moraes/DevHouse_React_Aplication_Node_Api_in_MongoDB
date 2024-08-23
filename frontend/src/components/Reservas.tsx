import React, { useEffect, useState } from 'react'
import api from '../../service/api'
import Image from 'next/image'
import { FaMapLocation } from 'react-icons/fa6'

export interface HouseType {
  description: string,
  id: string,
  location: string,
  price: number,
  status: boolean,
  thumbnail: string,
  thumbnail_url: string,
  user: string,
  _id: string
}

const Reservas = (props: { id: string }) => {
  const [houses, setHouses] = useState<HouseType[]>([])
  const [msg, setMsg] = useState<string>('')

  const handleHouses = async() => {
    try {
      const response = await api.get('/houses', { headers: { status: true }})
      setHouses(response.data)
    } catch(error) {
      console.log(error)
    }
  }

  const reserveSubmit = async( id: string ) => {
    try {
      const date = new Date()
      console.log(date)
      await api.post('/reserve/', { date, house_id: id }, { headers: { user_id: props.id }})
      setMsg('Casa Reservada com sucesso, para recarregar, troque de página e volte')
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleHouses()
  }, [])
  return (
    <div className='w-full max-w-5xl flex flex-col'>
      <p className='text-lg text-white'>Reserve casas, hotéis e muito mais...</p>
      <div className='w-full my-4 py-2 px-8 bg-white rounded'>
        <div className='flex flex-wrap'>
          {houses.map((house) => (
            <div className='w-1/3 p-2 flex flex-col gap-1' key={house._id}>
              <div className='h-52 w-full my-4'>
                <Image 
                  className='object-cover h-full'
                  src={house.thumbnail_url} 
                  alt={house.description} 
                  width={800} 
                  height={800} 
                />
              </div>
              <p className='text-gray-600 text-lg'>{house.description}</p>
              <p className='text-gray-600 text-lg flex gap-2 items-center'><FaMapLocation color='red'/>{house.location}</p>
              <p className='text-gray-600 text-lg font-semibold'>R$ {house.price},00 / Dia</p>
              <button 
                className='p-1 bg-sky-700 text-white rounded'
                onClick={() => reserveSubmit(house._id)}>Reservar</button>
            </div>
          ))}
        </div>
      </div>
      {msg !== '' && (<span onClick={() => setMsg('')} className='w-full text-center bg-red-600 p-2 rounded text-sm mb-4 text-white '>{msg}. Clique para retirar a mensagem.</span>)}
    </div>
  )
}

export default Reservas