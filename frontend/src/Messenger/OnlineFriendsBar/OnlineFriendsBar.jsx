import React from 'react'
import OnlineFriend from '../OnlineFriend/OnlineFriend'
import './OnlineFriendsBar.css'
import { useState , useEffect } from 'react';
import axios from 'axios';

function OnlineFriendsBar({id}) {
    // State for storing the list of employees
    const [Employees , setEmployees ] = useState([])
    // Fetch the list of employees in the current shift
    useEffect(() => {
        axios
          .get('http://localhost:5000/EmployeesInCurrentShift/'+id)
          .then((res) => {
            if (res.data.Status === 'Success') {
              setEmployees(res.data.Result)
            }
          })
          .catch((err) => {
            console.log('failed');
          });
      }, []);

  return (
    <div >
       <div className='OnlineFriendsTitle'><b>Shift employees</b></div>
       {Employees.map((employee) => {
        return (
        <OnlineFriend key={employee._id} FriendName={employee.fname} FriendImg={'http://localhost:5000/images/'+employee.image} />
        )
       })}
    </div>
  )
}

export default OnlineFriendsBar
