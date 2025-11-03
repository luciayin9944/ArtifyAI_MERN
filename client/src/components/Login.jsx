import React, { useContext, useEffect, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const Login = () => {
    const [state, setState] = useState('Login')
    const { backendURL, setShowLogin, setToken, setUser } = useContext(AppContext)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const onSubmitHandler = async (e) => {
      e.preventDefault();

      try {
        if (state==='Login') {
          const {data} = await axios.post(backendURL+'/api/user/login', 
            {email, password}
          )
          if (data.success) {
            setToken(data.token)
            setUser(data.user)
            localStorage.setItem('token', data.token)
            setShowLogin(false)
          } 
        } else {
          const {data} = await axios.post(backendURL+'/api/user/register', 
            {name, email, password}
          )
          if (data.success) {
            setToken(data.token)
            setUser(data.user)
            localStorage.setItem('token', data.token)
            setShowLogin(false)
          } 
        }
      } catch (error) {
        console.log(error)
      }
    }

    useEffect(() => {
        document.body.style.overflow = 'hidden';

        return ()=>{
            document.body.style.overflow = 'unset';
        }

    }, [])



  return (
    <div className='absolute top-0 left-0 right-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'>
        <form onSubmit={onSubmitHandler} className='relative bg-white p-10 rounded-xl text-slate-500'>
            <h1 className='text-center text-2xl text-neutral-700 font-medium'>{state}</h1>
            <p className='text-center text-sm'>Welcome!</p>
        
            {state !== 'Login' && <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img className='w-6 drop-shadow' src={assets.profile_icon} alt='' />
                <input
                    onChange={e=>setName(e.target.value)}
                    value={name} 
                    type='text'
                    placeholder='User Name' 
                    required
                />
            </div>}

            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.email_icon} alt='' />
                <input 
                  onChange={e=>setEmail(e.target.value)}
                  value={email}
                  type='email'
                  placeholder='Email' 
                  required
                />
            </div>
            <div className='border px-6 py-2 flex items-center gap-2 rounded-full mt-4'>
                <img src={assets.lock_icon} alt='' />
                <input
                  onChange={e=>setPassword(e.target.value)}
                  value={password} 
                  type='password'
                  placeholder='Password' 
                  required
                />
            </div>
            <button className='bg-blue-600 w-full text-white py-2 rounded-full mt-8'>{state==='Login' ? 'login' : 'create account'}</button>
            
           {state === 'Login' ?
                <p className='mt-5 text-center'>Don't have an account?
                  <span onClick={()=>setState('Sign Up')} className='text-blue-600 cursor-pointer'> Sign Up</span>
                </p>
            :
                <p className='mt-5 text-center'>Already have an account?
                  <span onClick={()=>setState('Login')} className='text-blue-600 cursor-pointer'> Login</span>
                </p>
            }

            <img onClick={()=>setShowLogin(false)} src={assets.cross_icon} alt='' className='absolute top-5 right-5 cursor-pointer' />

        </form>
    </div>
  )
}

export default Login