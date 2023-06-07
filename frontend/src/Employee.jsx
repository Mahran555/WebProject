import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import "./CssFiles/employee.css"

function Employee() {
  // States
  const [data, setData] = useState([]); // State for employee data
  const [searchTerm, setSearchTerm] = useState(''); // State for search term
  // Fetch employee data
  useEffect(() => {
    axios.get('http://localhost:5000/getEmployee')
      .then((res) => {
        if (res.data.Status === 'Success') {
          setData(res.data.Result);
        }
      })
      .catch(err => console.log('Failed'));
  }, []);
  // Handle employee deletion
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
        <h1 id='titleEmpP'>Employee List</h1>
      </div>
      <div id='aboveTable'>
      <Link id='addBTND' to='/create'><button className='addEmpBTN'>Add Employee</button></Link>
        <div className="search-box">
          <button className="btn-search"><FontAwesomeIcon icon={faMagnifyingGlass} /></button>
          <input type="search" className="input-search" placeholder="Type to Search..." onChange={e => setSearchTerm(e.target.value)}/>
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
                <tr key={employee.id}>
                  <td className='imgCol'>
                  <img
                      src={`http://localhost:5000/images/` + employee.image}
                      className='employee_image rounded-circle'
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
                  <td className='actionCol'>
                    <Link className='editIcon'
                      to={`/employeeEdit/` + employee.id}
                    >
                      <i className="bi bi-pen"></i>
                    </Link>
                    <div  className='deleteIcon'>
                    <button onClick={e => handleDelete(employee.id)}>
                      <i className="bi bi-trash"  outline="none"></i>
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
