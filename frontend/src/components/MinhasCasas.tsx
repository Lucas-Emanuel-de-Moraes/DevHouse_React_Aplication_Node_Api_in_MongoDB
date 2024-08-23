import React, { useEffect, useState } from 'react'
import { HouseType } from './Reservas'
import api from '../../service/api'
import Image from 'next/image'
import { FaMapLocation, FaTrash } from 'react-icons/fa6'

const MinhasCasas = (props: { id: string }) => {
  const [houses, setHouses] = useState<HouseType[]>([])
  const [house, setHouse] = useState<HouseType>({
    _id: '',
    description: '',
    id: '',
    location: '',
    price: 0,
    status: false,
    thumbnail: '',
    thumbnail_url: '',
    user: ''
  })
  const [file, setFile] = useState<File | string | null>('')
  const [selected, setSelected] = useState('Disponível')
  const [view, setView] = useState('Lista')
  const [msg, setMsg] = useState<string>('')

  const handleHouses = async(status: boolean, all: boolean) => {
    try {
      if(all) {
        const response = await api.get('/dashboard', { headers: { user_id: props.id, all: true }})
        setHouses(response.data)
      } else {
        if(status) {
          console.log(status)
          const response = await api.get('/dashboard', { headers: { user_id: props.id, status: true }})
          setHouses(response.data)
          console.log(response)
        } else {
          console.log(status)
          const response = await api.get('/dashboard', { headers: { user_id: props.id, status: false }})
          setHouses(response.data)
          console.log(response)
        }
      }
    } catch(error) {
      console.log(error)
    }
  }

  const houseSubmit = async (status: string) => {
    try {
      if (house.description !== '' && house.location !== '' && house.price !== 0 && file !== null) {
        const data = new FormData()
        file && data.append('thumbnail', file)
        data.append('description', house.description)
        data.append('price', house.price.toString())
        data.append('location', house.location)
        data.append('status', status)
        await api.post('/houses', data, { headers: { user_id: props.id }})
        setView('Lista')
        setSelected('Disponível')
        setHouse({
          _id: '',
          description: '',
          id: '',
          location: '',
          price: 0,
          status: false,
          thumbnail: '',
          thumbnail_url: '',
          user: ''
        })
        setFile(null)
        handleHouses(true, false)
        setMsg('')
      } else {
        setMsg('Preencha todos os campos.')
      }
    } catch(error) {
      console.log(error)
    }
  }

  const houseEdit = async (status: string) => {
    try {
      if (house.description !== '' && house.location !== '' && house.price !== 0 && file !== null) {
        const data = new FormData()
        file && data.append('thumbnail', file)
        data.append('description', house.description)
        data.append('price', house.price.toString())
        data.append('location', house.location)
        data.append('status', status)
        await api.put('/houses', data, { headers: { user_id: props.id, house_id: house._id }})
        setView('Lista')
        setSelected('Disponível')
        setHouse({
          _id: '',
          description: '',
          id: '',
          location: '',
          price: 0,
          status: false,
          thumbnail: '',
          thumbnail_url: '',
          user: ''
        })
        handleHouses(true, false)
        setFile(null)
        setMsg('')
      } else {
        setMsg('Preencha todos os campos.')
      }
    } catch(error) {
      console.log(error)
    }
  }

  const houseDelete = async(id:string) => {
    try {
      await api.delete('/houses', { headers: { user_id: props.id, house_id: id }} )
    } catch(error) {
      console.log(error)
    }
  }

  useEffect(() => {
    handleHouses(true, false)
  }, [])
  if(view === 'Lista') {
    return (
      <div className='w-full max-w-5xl flex flex-col'>
        <div className='flex justify-between'>
          <p className='text-lg text-white'>Minhas Casas</p>
          <button 
            className='p-1 w-40 bg-sky-700 text-white rounded'
            onClick={() => setView('Cadastro')}>Nova Casa</button>
        </div>
        <div className='w-full my-4 p-2 bg-white rounded'>
          <div className='flex justify-center'>
            <div className='border rounded'>
              <button 
                className={`${selected === 'Disponível' && 'bg-slate-100'} px-2 py-1 border-r`}
                onClick={() => {
                  setSelected('Disponível')
                  handleHouses(true, false)
                }}>Disponível</button>
              <button 
                className={`${selected === 'Indisponível' && 'bg-slate-100'} px-2 py-1 border-r`}
                onClick={() => {
                  setSelected('Indisponível')
                  handleHouses(false, false)
                }}>Indisponível</button>
              <button 
                className={`${selected === 'Todas' && 'bg-slate-100'} px-2 py-1 `}
                onClick={() => {
                  setSelected('Todas')
                  handleHouses(true, true)
                }}>Todas</button>
            </div>
          </div>
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
                <p className='text-gray-600 text-lg font-semibold'>{house.status ? 'Disponível': 'Indisponível'}</p>
                <div className='w-full flex gap-2'>
                  <button 
                    className='p-1 w-8 flex justify-center items-center bg-red-600 text-white rounded'
                    onClick={() => {
                      houseDelete(house._id)
                      handleHouses(
                        selected === 'Disponível' ? true : false,
                        selected === 'Todas' ? true: false
                      )
                    }}><FaTrash /></button>
                  <button 
                    className='p-1 w-full bg-sky-700 text-white rounded'
                    onClick={() => {
                      setView('Editar')
                      setHouse(house)
                    }}>Editar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        {msg !== '' && (<span onClick={() => setMsg('')} className='w-full text-center bg-red-600 p-2 rounded text-sm mb-4 text-white '>{msg}. Clique para retirar a mensagem.</span>)}
      </div>
    )
  } else if (view === 'Cadastro') {
    return (
      <div className='w-full max-w-5xl flex flex-col'>
        <div className='flex justify-between'>
          <p className='text-lg text-white'>Cadastrar</p>
          <button 
            className='p-1 w-40 bg-sky-700 text-white rounded'
            onClick={() => {
              setView('Lista')
              setSelected('Disponível')
              handleHouses(true, false)
              setHouse({
                _id: '',
                description: '',
                id: '',
                location: '',
                price: 0,
                status: false,
                thumbnail: '',
                thumbnail_url: '',
                user: ''
              })
              setFile(null)
            }}>Cancelar</button>
        </div>
        <div className='w-full my-4 p-2 bg-white rounded flex'>
          <div className='w-1/2 px-2'>
            <input 
              className='w-full bg-[#00000033] p-2 my-1 rounded text-xl'
              value={house.description}
              onChange={(e) => setHouse((h) => { 
                setMsg('')
                return { ...h, description: e.target.value }
              })}
              type='text'
              placeholder='Digite a descrição da casa...'
            />
            <input 
              className='w-full bg-[#00000033] p-2 my-1 rounded text-xl'
              value={house.location}
              onChange={(e) => setHouse((h) => { 
                setMsg('')
                return { ...h, location: e.target.value }
              })}
              type='text'
              placeholder='Digite o endereço da casa...'
            />
            <button 
              className='w-full p-2 my-1 bg-sky-700 text-white rounded'
              onClick={() => houseSubmit('true')}>Cadastrar como Disponível</button>
          </div>
          <div className='w-1/2 px-2'>
            <input 
              className='w-full bg-[#00000033] p-2 my-1 rounded text-xl'
              value={house.price}
              onChange={(e) => setHouse((h) => { 
                setMsg('')
                return { ...h, price: Number(e.target.value) }
              })}
              type='number'
              placeholder='Digite o preço da casa...'
            />
            <input 
              className='w-full bg-[#00000033] h-[44px] p-2 my-1 rounded text-sm'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const img = Array.from(e.target.files || [])
                setFile(img[0])
              }}
              type='file'
              accept=".jpg, .jpeg, .png"
            />
            <button 
              className='w-full p-2 my-1 bg-sky-700 text-white rounded'
              onClick={() => houseSubmit('false')}>Cadastrar como Indisponíveil</button>
          </div>
        </div>
        {msg !== '' && (<span onClick={() => setMsg('')} className='w-full text-center bg-red-600 p-2 rounded text-sm mb-4 text-white '>{msg}. Clique para retirar a mensagem.</span>)}
      </div>
    )
  } else {
    return (
      <div className='w-full max-w-5xl flex flex-col'>
        <div className='flex justify-between'>
          <p className='text-lg text-white'>Editar</p>
          <button 
            className='p-1 w-40 bg-sky-700 text-white rounded'
            onClick={() => {
              setView('Lista')
              setSelected('Disponível')
              handleHouses(true, false)
              setHouse({
                _id: '',
                description: '',
                id: '',
                location: '',
                price: 0,
                status: false,
                thumbnail: '',
                thumbnail_url: '',
                user: ''
              })
              setFile(null)
            }}>Cancelar</button>
        </div>
        <div className='w-full my-4 p-2 bg-white rounded flex'>
          <div className='w-1/2 px-2'>
            <input 
              className='w-full bg-[#00000033] p-2 my-1 rounded text-xl'
              value={house.description}
              onChange={(e) => setHouse((h) => { 
                setMsg('')
                return { ...h, description: e.target.value }
              })}
              type='text'
              placeholder='Digite a descrição da casa...'
            />
            <input 
              className='w-full bg-[#00000033] p-2 my-1 rounded text-xl'
              value={house.location}
              onChange={(e) => setHouse((h) => { 
                setMsg('')
                return { ...h, location: e.target.value }
              })}
              type='text'
              placeholder='Digite o endereço da casa...'
            />
            <button 
              className='w-full p-2 my-1 bg-sky-700 text-white rounded'
              onClick={() => houseEdit('true')}>Cadastrar como Disponível</button>
          </div>
          <div className='w-1/2 px-2'>
            <input 
              className='w-full bg-[#00000033] p-2 my-1 rounded text-xl'
              value={house.price}
              onChange={(e) => setHouse((h) => { 
                setMsg('')
                return { ...h, price: Number(e.target.value) }
              })}
              type='number'
              placeholder='Digite o preço da casa...'
            />
            <input 
              className='w-full bg-[#00000033] h-[44px] p-2 my-1 rounded text-sm'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const img = Array.from(e.target.files || [])
                setFile(img[0])
              }}
              type='file'
              accept=".jpg, .jpeg, .png"
            />
            <button 
              className='w-full p-2 my-1 bg-sky-700 text-white rounded'
              onClick={() => houseEdit('false')}>Cadastrar como Indisponíveil</button>
          </div>
        </div>
        {msg !== '' && (<span onClick={() => setMsg('')} className='w-full text-center bg-red-600 p-2 rounded text-sm mb-4 text-white '>{msg}. Clique para retirar a mensagem.</span>)}
      </div>
    )
  }
}

export default MinhasCasas