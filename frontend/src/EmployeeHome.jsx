import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom'

function EmployeeHome() {
  const {id} = useParams();
  const [data, setData] = useState('')
  useEffect(() => {
    console.log("ff")
    axios.get('http://localhost:5000/workData/'+id)
      .then((res) => {
        if (res.data.Status === "Success") {
          setData(res.data.Result);
        
        }
      })   
      .catch(err => console.log("faild"));
  }, [])
    
  return (
    <div>
      <div className='p-3 d-flex justify-content-around mt-3'>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Manager</h4>
          </div>
          <hr />
          <div className=''>
            <h5>Total: </h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>Employee</h4>
          </div>
          <hr />
          <div className=''>
            <h5>Total: </h5>
          </div>
        </div>
        <div className='px-3 pt-2 pb-3 border shadow-sm w-25'>
          <div className='text-center pb-1'>
            <h4>employee</h4>
          </div>
          <hr />
          <div className=''>
            <h5>Total: </h5>
          </div>
        </div>
     
       
      </div>
    </div>
      
  )
}

export default  EmployeeHome