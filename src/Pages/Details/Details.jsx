import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { GlobalContext } from '../../context/Context'
import { Favourite } from '../Favoutite/Favourite'

export const Details = () => {

  const { recipeDetails, setRecipeDetails,handleFavourites,favouriteList } = useContext(GlobalContext)
  
  const { id } = useParams()

  useEffect(() => {
    const getRecipeDetails = async () => {
      const response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes/${id}`)
      const data = await response.json();

      if (data?.data?.recipe) {
        setRecipeDetails(data?.data?.recipe)
      }

    }
    getRecipeDetails();
  }, [])


  return (
    <div className='container py-10 mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10'>
      <div className='row-start-2 lg:row-start-auto'>
        <div className='h-96 overflow-hidden rounded-xl group'>
          <img src={recipeDetails?.image_url} alt=""
            className="w-full h-full object-cover block group-hover:scale-105 duration-300"
          />
        </div>
      </div>
      <div className='flex flex-col gap-3'>
        <span className='text-sm text-cyan-700 font-medium'>{recipeDetails?.publisher}</span>
        <h3 className='font-bold text-xl truncate text-black'>{recipeDetails?.title}</h3>
        <div>

          <button onClick={()=>handleFavourites(recipeDetails)} className='text-sm p-3 mt-5 px-8 rounded-lg uppercase font-medium tracking-wide inline-block shadow-md bg-black text-center text-white cursor-pointer'
          > {
           favouriteList.findIndex(item=> item.id ==recipeDetails.id) == -1 ? "save as favourite":"remove from favourite"
          }</button>
        </div>
        <span className='text-2xl font-semibold text-black'>ingredients:</span>
        <ul className='flex flex-col gap-3'>
          {
            recipeDetails?.ingredients && recipeDetails.ingredients.length > 0 ?
              recipeDetails?.ingredients.map((ingredient, index) => (
                <li key={index}>
                  <span className='text-xl font-semibold text-black'>{ingredient.quantity} {ingredient.unit}</span>
                  <span className='text-xl font-semibold text-black'>{ingredient.description}</span>
                </li>
              )) : ""

          }
        </ul>
      </div>
    </div>
  )
}
