import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { GlobalContext } from '../../context/Context'

export const Navbar = () => {
    const {searchParams,setSearchParams,handleSubmit}=useContext(GlobalContext)

  return (
    <div>
        <ul className='flex justify-between items-center py-8 container mx-auto flex-col lg:flex-row gap-5 lg:gap-0'>
            <li >
                <NavLink to="/" className="text-2xl font-semibold">
                Food recipe
                </NavLink>
            </li>

            <li>
                <form onSubmit={handleSubmit} >
                    <input type="text" placeholder='enter recipe name'  className=' p-3 px-8 rounded-full outline-none lg:w-96 shadow-lg shadow-red-100 focus:shadow-red-200  bg-white/75 ' value={searchParams} onChange={(e)=>setSearchParams(e.target.value)}/>
                </form>
            </li>
            <li>
                <NavLink to="/favourite" className="hover:text-black duration-300">Favourite</NavLink>
            </li>
            {/* <button onClick={handleSubmit}>hjshjhjd</button> */}
        </ul>
    </div>
  )
}
