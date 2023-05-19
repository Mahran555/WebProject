import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Select from 'react-select';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'
import { Form, Container, Table, Button } from 'react-bootstrap';


function EmployeeSchedule () {
  const {id} = useParams();
  const [data, setData] = useState([])
  useEffect(() => {
    axios.get('http://localhost:5000/employeeSchedule/'+id)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        
        }
      })   
      .catch(err => console.log("faild"));
  }, [])
//////



//////
  return (<div className='px-5 py-3'>
  <div className='d-flex justify-content-center mt-2'>
    <h3>Shift List</h3>
    <table className='table'>
      <thead>
        <tr>
        <th> </th>
          <th>day</th>
          <th>month</th>
          <th>Shift time</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
                    data.map((shift, i) => (
                        <tr key={i}>
            <td>{shift.day}</td>
           < td>{shift.month}</td>
              <td>{shift.shift}</td>
          </tr>
            ))
        ) : (
          <tr>
              <td colSpan={7}>No Shifts</td>
          </tr>
      )}
      </tbody>
    </table>
  </div>
</div>

  )}
export default EmployeeSchedule;
//
