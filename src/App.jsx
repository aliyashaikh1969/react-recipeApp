import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Home } from './Pages/Home/Home'
import { Favourite } from './Pages/Favoutite/Favourite'
import { Details } from './Pages/Details/Details'
import { Navbar } from './components/Navbar/Navbar'

function App() {

  return (
    <>
      <div className="min-h-screen p-6 bg-white text-gray-600 text-lg">
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/favourite' element={<Favourite />}></Route>
          <Route path='/recipe-item/:id' element={<Details />}></Route>

        </Routes>
      </div>

    </>
  )
}

export default App
