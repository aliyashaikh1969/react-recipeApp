import { createContext, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const GlobalContext = createContext(null)

export const ContextProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useState("")
    const [loading,setLoading] =useState(false)
    const [recipeList,setrecipeList] =useState([]);
    const [recipeDetails,setRecipeDetails] = useState(null)
    const [favouriteList,setFavouritesList] = useState([])

    const navigate = useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true)
            const response = await fetch(`https://forkify-api.herokuapp.com/api/v2/recipes?search=${searchParams}`);
            const result = await response.json();
            if(result?.data?.recipes){
                setLoading(false)
                setrecipeList(result?.data?.recipes)
                setSearchParams("")
                navigate("/")
            }
            
        } catch (e) {
            console.log(e.message)
            setLoading(false)
            setSearchParams("")
        }
    }
// console.log(recipeDetails)

    const handleFavourites=(getFavouriteItem)=>{
        console.log(getFavouriteItem)
        const copyFavouriteList = [...favouriteList]

        let index = copyFavouriteList.findIndex(item=>item.id === getFavouriteItem.id)

        if(index == -1){
            copyFavouriteList.push(getFavouriteItem)
        }else{
            copyFavouriteList.splice(index)
        }        
        setFavouritesList(copyFavouriteList)
    }
    console.log(favouriteList)
    return <GlobalContext value={{ searchParams,loading,recipeList,recipeDetails,favouriteList,setRecipeDetails, setSearchParams, handleSubmit,handleFavourites }}>{children}</GlobalContext>
}