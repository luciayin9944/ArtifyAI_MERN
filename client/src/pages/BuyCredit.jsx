import React, { useContext } from 'react'
import { plans } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import axios from 'axios'

const BuyCredit = () => {
  const {user, backendURL, token, setShowLogin, setAlertMessage } = useContext(AppContext)


  const paymentStripe = async (planId) => {
    try {
      if (!user) {
        setShowLogin(true)
      }

      const { data } = await axios.post(
          `${backendURL}/api/user/payment`,
          { planId },
          { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        const { session_url } = data
        window.location.replace(session_url)
      } else {
        setAlertMessage(data.message || 'Payment init failed')
      }
    } catch (error) {
      const msg =
        error?.response?.data?.message ||
        error.message ||
        'Payment request failed';
      setAlertMessage(msg);
      console.log(error);
    }
  };

  return (
    <div className='min-h-[80vh] text-center pt-14 mb-10'>
      <button className='border border-gray-400 px-10 py-2 rounded-full mb-6'>Our Plans</button>
      <h1 className='text-center text-3xl font-medium mb-6 sm:mb-10'>Choose the plan</h1>
      <div className='flex flex-wrap justify-center gap-6 text-left'>
        {plans.map((item, index) =>(
          <div key={index} className='bg-white drop-shadow-sm border rounded-lg py-12 px-8 text-gray-600 hover:scale-105 transition-all duration-500' >
            <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
            <p className='text-sm'>{item.desc}</p>
            <p className='mt-6'>
              <span className='text-3xl font-medium'>${item.price}</span>/ {item.credits} credits
            </p>

            <button onClick={() => paymentStripe(item.id)} className='bg-zinc-800 px-10 py-3 text-white mt-8 rounded-md cursor-pointer'>{user ? 'Purchase' : 'Get Credits'}</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default BuyCredit