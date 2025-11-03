import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const AIGenerator = () => {
    const [image, setImage] = useState(assets.sample_img_1)
    const [isImageLoaded, setIsImageLoaded] = useState(true)
    const [loading, setLoading] = useState(false)
    const [input, setInput] = useState('')
    const {generateImage} = useContext(AppContext)

    const onSumbitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        if (input) {
            const image = await generateImage(input)
            if (image) {
                setIsImageLoaded(true)
                setImage(image)
            }
        }
        setLoading(false)
    }

  return (
    <form  onSubmit={onSumbitHandler} className='flex flex-col justify-center items-center text-center my-20 min-h-[80vh]'>
    <div>
        <div className='relative'>
            <img className='max-w-sm rounded' src={image} alt="" />
            {/* loading bar */}
            <span className={`absolute bottom-0 left-0 h-1 bg-blue-500 ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'}`} />
        </div>
        <p className={!loading ? 'hidden' : ''}>Loading...</p>
    </div>

    {!isImageLoaded && 
        <div className='flex w-full max-w-xl bg-neutral-500 text-white text-sm p-0.5 mt-10 rounded-full'>
            <input 
                onChange={e => setInput(e.target.value)} 
                vaule={input}
                type='text'
                placeholder='Describe what you want to generate'
                className='flex-1 bg-transparent outline-none ml-8 max-sm:w-20 grey-placeholder'
            />
            <button type='submit' className='bg-zinc-900 px-10 sm:px-16 py-3 rounded-full'>Generate</button>
        </div>
    }
    {isImageLoaded && 
        <div className='flex gap-2 flex-wrap justify-center text-white text-sm p-0.5 mt-10 rounded-full'>
            <button onClick={()=>{ setIsImageLoaded(false)}} className='bg-transparent border border-zinc-900 text-black px-8 py-3 rounded-full cursor-pointer'>Generate Another</button>
            <a href={image} download className='bg-zinc-900 px-10 py-3 rounded-full cursor-pointer'>Download</a>
        </div>
    }
    </form>
  )
}

export default AIGenerator