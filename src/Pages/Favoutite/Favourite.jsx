import React, { useContext } from 'react'
import { GlobalContext } from '../../context/Context'
import { RecipeItem } from '../../components/recipe-item/RecipeItem'

export const Favourite = () => {
 const {favouriteList} = useContext(GlobalContext)
 
   return (
     <div className= 'py-8 mx-auto container flex flex-wrap justify-center gap-10 '>
 
     {
         favouriteList && favouriteList.length>0 ? favouriteList.map((item,index)=>(
             <RecipeItem key={index} item={item}/>
         )):
null     }
     </div>
   )
}
