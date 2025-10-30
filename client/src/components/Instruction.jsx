import React from 'react'
import { stepsData } from '../assets/assets'
import { useNavigate } from 'react-router'

const Instruction = () => {
    const navigate = useNavigate()

  return (
    <div className="flex flex-col items-center justify-center my-24 p-6 md:px-28 mt-40">
        <h1 className="text-3xl sm:text-4xl font-semibold mb-2">How it works</h1>
        <p className="text-lg text-gray-400 mb-8">Transform Words Into Stunning Images</p>
        
        <div className="space-y-4 w-full max-w-3xl text-sm">
            {stepsData.map((item, index)=>(
                <div key={index} className="flex items-center gap-4 p-5 px-8 bg-white/20 rounded-lg shadow-md border cursor-pointer hover:scale-[1.02] transition-all duration-300">
                    <img src={item.icon} alt='' />
                    <div>
                        <h2 className="text-xl font-medium">{item.title}</h2>
                        <p className="text-gray-500">{item.description}</p>
                    </div>
                </div>
            ))}
        </div>

        <button onClick={()=>navigate('/image')} className='sm:text-lg text-white bg-black w-auto mt-8 px-12 py-2.5 flex-wrap items-center gap-2 rounded-full'>
            Generate Images
        </button>
    </div>
  )
}

export default Instruction