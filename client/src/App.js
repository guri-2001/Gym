import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dasboard'
import ActiveClients from './pages/ActiveClients'
import AddClient from './pages/AddClient'
import Allclients from './pages/Allclients'
import NonActiveClients from './pages/NonActiveClients'
import NoPage from './pages/NoPage'
import Calendar from './pages/Calendar'
import Gallery from './pages/Gallery'
import Reminders from './pages/Reminders'
import Notifications from './pages/Notifications'
import AddGallery from './pages/AddGallery'


const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/activeclients' element={<ActiveClients />} />
        <Route path='/addclients' element={<AddClient />} />
        <Route path='/allclients' element={<Allclients />} />
        <Route path='/nonactiveclients' element={<NonActiveClients />} />
        <Route path='/calendar' element={<Calendar />} />
        <Route path='/gallery' element={<Gallery />} />
        <Route path='/reminders' element={<Reminders />} />
        <Route path='/notifications' element={<Notifications />} />
        <Route path='/addgallery' element={<AddGallery />} />
        <Route path='*' element={<NoPage />} />
      </Routes>
    </div>
  )
}

export default App