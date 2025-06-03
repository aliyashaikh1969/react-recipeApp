import React from 'react'
import { Link } from 'react-router-dom'

export const RecipeItem = ({item}) => {

    console.log(item)
  return (
    <div className='flex flex-col w-80 overflow-hidden p-5 bg-white/75 border-white rounded-2xl shadow-xl gap-5'>
        <div className='h-40 flex justify-center overflow-hidden items-center rounded-2xl'>
            <img src={item.image_url} alt="recipe-image" className='block w-full' />
        </div>
        <span className='text-sm text-cyan-700 font-medium'>{item.publisher}</span>
        <h3 className='font-bold text-xl truncate text-black'>{item.title}</h3>
        <Link to={`/recipe-item/${item.id}`}
        className='text-sm p-3 mt-5 px-8 rounded-lg uppercase font-medium tracking-wide inline-block shadow-md bg-black text-center text-white'>details</Link>
    </div>
  )
}
