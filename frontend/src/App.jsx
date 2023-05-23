import React from 'react'
import Login from './Login'
import Dashboard from './Dashboard'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Employee from './Employee'
import Profile from './Profile'
import Schedule from './Schedule'
import Home from './Home'
import AddEmployee from './AddEmployee'
import EditEmployee from './EditEmployee'
import EmployeePage from './EmployeePage'
import EmployeeProfile from './EmployeeProfile'
import EmployeeSchedule from './EmployeeSchedule'
import EmployeeHome from './EmployeeHome'
import VacationRequest from './VacationRequest'
import LoginPageSimple from './LoginPageSimple'
import 'bootstrap/dist/css/bootstrap.min.css';
import ExchangeShifts from './ExchangeShifts'

function App() {
  
  return (
    
    <BrowserRouter>
     
    <Routes>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/' element={<Dashboard />}>
      <Route path='' element={<Home />}></Route>
      <Route path='/employee' element={<Employee />}></Route>
      <Route path='/profile' element={<Profile />}></Route>
      <Route path='/schedule' element={<Schedule />}></Route>
      <Route path='/create' element={<AddEmployee />}></Route>
      <Route path='/employeeEdit/:id' element={<EditEmployee />}></Route>
      <Route path='/VacationRequest' element={<VacationRequest />}></Route>
      <Route  path='/ExchangeShifts' element={<ExchangeShifts />}></Route>
      
      </Route>
      <Route path='/employeePage/:id' element={<EmployeePage />}>
      <Route path='' element={<EmployeeHome />}></Route>
      <Route path='/employeePage/:id/employeeProfile/:id' element={<EmployeeProfile />}></Route>
      <Route path='/employeePage/:id/employeeSchedule/:id' element={<EmployeeSchedule />}></Route>
      </Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/simplelogin'  element={<LoginPageSimple />}></Route>
      
      
    </Routes>
    </BrowserRouter>
    
  )
    
      
  
}

export default App
