import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {

  return (
    <div className='text-center'>
        <div className='text-stone-500 inline-flex items-center gap-2 bg-white px-6 py-1 rounded-full border border-neutral-500 mt-20'>
            <p>Best text to <span className='text-lime-500'>image</span> AI-generator</p>
        </div>
        
        <h1 className='text-center mx-auto mt-10 text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px]'>Ture text to <span className='text-lime-700'>image</span>, in seconds.</h1>
        <p className='text-center max-w-xl mx-auto mt-5'>Unleash your creativity with AI. Turn your imagination into visual art in seconds - just type, and watch the magic happen.</p>
    
        <button className='sm:text-lg text-white bg-black w-auto mt-8 px-12 py-2.5 flex-wrap items-center gap-2 rounded-full'>
            Generate Images
        </button>

        <div className='flex flex-wrap justify-center mt-8 gap-3'>
            {Array(6).fill('').map((item, index) => (
                <img className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10'
                  src={index%2===0 ? assets.sample_img_1 : assets.sample_img_2} 
                  alt="" key={index} width={70} 
                />
            ))}
        </div>
        <p className='mt-2 text-neutral-500'>Generated images from AI</p>

    </div>
  )
}

export default Header