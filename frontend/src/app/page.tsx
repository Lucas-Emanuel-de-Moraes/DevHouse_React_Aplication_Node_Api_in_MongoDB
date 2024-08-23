'use client'
import React, { useState } from 'react'
import api from '../../service/api'
import Header from '@/components/Header'
import Reservas from '@/components/Reservas'
import MinhasReservas from '@/components/MinhasReservas'
import MinhasCasas from '@/components/MinhasCasas'

const Home = () => {
  const [login, setLogin] = useState<{email: string, password: string}>({
    email: '',
    password: ''
  })
  const [msg, setMsg] = useState<string>('')
  const [page, setPage] = useState('Home')
  const [id, setId] = useState('')

  const handleLogin = async() => {
    if(login.email !== '' && login.password !== ''){
      try{
        const response = await api.post('/sessions', login)
        setId(response.data)
      } catch(error: any) {
        console.log(error.response.data.error)
        setMsg(error.response.data.error)
      }
    } else {
      setMsg('Preencha Todos os Campos')
    }
  }

  if (id === '') {
    return (
      <div className='flex flex-col gap-4'>
        <h1 className='text-5xl font-semibold text-white text-center m-4'>DEVHOUSE</h1>
        <input 
          className='w-96 bg-[#ffffff33] p-2 rounded text-xl text-white'
          onChange={(e) => setLogin((login) => { 
            setMsg('')
            return { email: e.target.value, password: login.password }
          })}
          type='text'
          placeholder='Digite seu email...'
        />
        <input 
          className='w-96 bg-[#ffffff33] p-2 rounded text-xl text-white'
          onChange={(e) => setLogin((login) => {
            setMsg('')
            return { password: e.target.value, email: login.email }
          })}
          type='password'
          placeholder='Digite sua senha...'
        />
        <button onClick={handleLogin} className='p-2 text-xl bg-white rounded'>Acessar</button>
        {msg !== '' && (<span className='w-full text-center bg-red-600 p-2 rounded text-xl text-white'>{msg}</span>)}
      </div>
    )
  } else {
    return (
      <div className='w-full h-screen flex flex-col items-center'>
        <Header set={setPage}/>
        {page === 'Home' ? (
          <>
            <Reservas id={id} />
            <MinhasReservas id={id} />
          </>
        ) : (
          <>
            <MinhasCasas id={id} />
          </>
        )}
      </div>
    )
  }
}

export default Home