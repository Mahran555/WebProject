import React from 'react'
import ManagerLogin from './ManagerLogin'
import Dashboard from './Dashboard'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Employee from './Employee'
import Profile from './Profile'
import Schedule from './Schedule'
import Home from './Home'
import AddEmployee from './AddEmployee'
import EditEmployee from './EditEmployee'
import Start from './Start'

function App() {

  return (
    
 
    
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Dashboard />}>
      <Route path='' element={<Home />}></Route>
      <Route path='/employee' element={<Employee />}></Route>
      <Route path='/profile' element={<Profile />}></Route>
      <Route path='/schedule' element={<Schedule />}></Route>
      <Route path='/create' element={<AddEmployee />}></Route>
      <Route path='/employeeEdit/:id' element={<EditEmployee />}></Route>
      </Route>
      <Route path='//managerLogin' element={<ManagerLogin />}></Route>
      <Route path='/start' element={<Start />}></Route>
    </Routes>
    </BrowserRouter>
    
  )
    
      
  
}

export default App
