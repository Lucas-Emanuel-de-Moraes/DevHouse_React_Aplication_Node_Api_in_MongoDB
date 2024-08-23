import React, { useCallback, useEffect, useState } from 'react'
import api from '../../service/api'
import { headers } from 'next/headers'
import Image from 'next/image'
import { HouseType } from './Reservas'
import { FaCalendar, FaMapLocation } from 'react-icons/fa6'

interface ReserveType {
  date: string,
  house: HouseType,
  user: string,
  _id: string
}

const MinhasReservas = (props: { id: string }) => {
  const [reserves, setReserves] = useState<ReserveType[]>([])

  const handleReserves = useCallback(async() => {
    try {
      const response = await api.get('/reserves', { headers: { user_id: props.id }})
      console.log(response)
      setReserves(response.data)
    } catch(error) {
      console.log(error)
    }
  }, [props.id])

  const reserveDelete = async(id: string) => {
    try {
      await api.delete('/reserves/cancel', { headers: { reserve_id: id }})
      handleReserves()
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleReserves()
  }, [handleReserves])
  return (
    <div className='w-full max-w-5xl'>
      <p className='text-lg text-white'>Minhas Reservas</p>
      <div className='w-full my-4 p-2 bg-white rounded'>
        <button className='text-base' onClick={handleReserves}>Atualizar</button>
        <div className='flex flex-wrap'>
          {reserves.map((reserve) => (
            <div className='w-1/4 p-2 flex flex-col gap-1' key={reserve._id}>
              <div className='h-40 w-full my-4'>
                <Image 
                    className='object-cover h-full'
                    src={reserve.house.thumbnail_url} 
                    alt={reserve.house.description} 
                    width={800} 
                    height={800} 
                  />
              </div>
              <p className='text-gray-600 text-base flex gap-2 items-center'><FaCalendar color='red'/>{reserve.date.slice(0,10)}</p>
              <p className='text-gray-600 text-lg flex gap-2 items-center'><FaMapLocation color='red'/>{reserve.house.location}</p>
              <button 
                className='p-1 bg-red-600 text-white rounded'
                onClick={() => reserveDelete(reserve._id)}>Cancelar</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MinhasReservas