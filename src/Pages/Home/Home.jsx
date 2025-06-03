import React, { useContext } from 'react'
import { GlobalContext } from '../../context/Context'
import { RecipeItem } from '../../components/recipe-item/RecipeItem'

export const Home = () => {
    const {loading,recipeList} = useContext(GlobalContext)

    if(loading) return <div>loading... please wait!</div>
  return (
    <div className= 'py-8 mx-auto container flex flex-wrap justify-center gap-10 '>

    {
        recipeList && recipeList.length>0 ? recipeList.map((item,index)=>(
            <RecipeItem key={index} item={item}/>
        )):<p className='lg:text-4xl text-2xl text-center text-black font-bold'>Nothing to show please seacrh something...</p> 
    }
    </div>
  )
}
