import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import "./employee.css"

function Employee() {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    axios.get('http://localhost:5000/getEmployee')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
        }
      })
      .catch(err => console.log('Failed'));
  }, []);

  const handleDelete = (id) => {
    axios.get(`http://localhost:5000/delete/${id}`)
      .then(res => {
        if (res.data.Status === 'Success') {
          window.location.reload(true);
        } else {
          alert('Error');
        }
      })
      .catch(err => console.log(err));
  };

  // Filter the data based on the search term
  const filteredData = data.filter(employee =>
    employee.fname.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className='px-5 py-3'>
      <div className='d-flex justify-content-center mt-2'>
        <h3>Employee List</h3>
      </div>
      <div id='aboveTable'>
      <Link id='addBTND' to='/create'><button class='addEmpBTN'>Add Employee</button></Link>
        <div class="search-box">
          <button class="btn-search"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
          <input type="search" class="input-search" placeholder="Type to Search..." onChange={e => setSearchTerm(e.target.value)}/>
        </div>
      </div>


      <div id='searchDiv'>
      
      </div>
      <div className='mt-4'>
        <table id='empTable'>
          <thead >
            <tr>
              <th scope="col"> </th>
              <th scope="col">ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">Phone</th>
              <th scope="col">Salary</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((employee, i) => (
                <tr>
                  <td class='imgCol'>
                    <img
                      src={`http://localhost:5000/images/` + employee.image}
                      className='employee_image'
                      class='rounded-circle'
                      alt='Cinque Terre'
                      width='60'
                      height='60'
                    />
                  </td>
                  <td scope='row'>{employee.id}</td>
                  <td>{employee.fname}</td>
                  <td>{employee.lname}</td>
                  <td>{employee.email}</td>
                  <td>{employee.address}</td>
                  <td>{employee.phone}</td>
                  <td>${employee.salary}</td>
                  <td class='actionCol'>
                    <Link class='editIcon'
                      to={`/employeeEdit/` + employee.id}
                      style={{ color: 'black' }}
                    >
                      <i class="bi bi-pen"></i>
                    </Link>
                    <div  class='deleteIcon'>
                    <button
                      onClick={e => handleDelete(employee.id)}
                      style={{border: 'none'}} className={`row${i % 2}`}
                      
                    >
                      <i class="bi bi-trash" backgroundColor="white" borderColor="white" outline="none"></i>
                    </button></div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7}>No Employees</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
}

export default Employee;
