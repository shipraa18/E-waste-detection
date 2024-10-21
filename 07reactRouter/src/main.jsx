import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'
import Home from './components/Home/Home.jsx'
import About from './components/About/About.jsx'
import App from './App.jsx'
import Contact from './components/Contact/Contact.jsx'
import { Route } from 'react-router-dom'
import User from './components/User/User.jsx'
import Login from './components/Login/Login.jsx'
import RecyclingCenters from './components/recyclingCentres/recyclingCentres.jsx'
import ImageUpload from './components/ImageUpload/ImageUpload.jsx'
import Signup from './components/SignUp/SignUp.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App/>}>
      <Route path='' element={<Home/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='user/:userid' element={<User/>}/>
      <Route path="/login" element={<Login />} />
      <Route path="/recycling-centers" element={<RecyclingCenters />} />
      <Route path="/ImageUpload" element={<ImageUpload/>}/>
      <Route path="/SignUp" element={<Signup/>}/>
    </Route>
  )
)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router}/> 
  </React.StrictMode>
)

