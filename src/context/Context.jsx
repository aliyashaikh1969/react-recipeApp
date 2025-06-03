import { createContext, useState, useContext } from "react";

export const GlobalContext = createContext(null)

export const ContextProvider = ({ children }) => {
    const [searchParams, setSearchParams] = useState("")
    const [loading,setLoading] =useState(false)
    const [recipeList,setrecipeList] =useState([]);
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
            }

            
            console.log(result)
        } catch (e) {
            console.log(e.message)
            setLoading(false)
            setSearchParams("")
        }
    }
    return <GlobalContext value={{ searchParams,loading,recipeList, setSearchParams, handleSubmit }}>{children}</GlobalContext>
}