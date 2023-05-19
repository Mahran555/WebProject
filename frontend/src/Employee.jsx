import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

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
      <Link to='/create' className='btn btn-success'>Add Employee</Link>

      {/* Search input */}
      <div className='mt-3'>
        <input
          type='text'
          placeholder='Search by first name'
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className='mt-3'>
        <table className='table'>
          <thead>
            <tr>
              <th> </th>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((employee, i) => (
                <tr key={i}>
                  <td>
                    <img
                      src={`http://localhost:5000/images/` + employee.image}
                      className='employee_image'
                      class='rounded-circle'
                      alt='Cinque Terre'
                      width='50'
                      height='50'
                    />
                  </td>
                  <td>{employee.id}</td>
                  <td>{employee.fname}</td>
                  <td>{employee.lname}</td>
                  <td>{employee.email}</td>
                  <td>{employee.address}</td>
                  <td>${employee.salary}</td>
                  <td>
                    <Link
                      to={`/employeeEdit/` + employee.id}
                      className='btn btn-primary btn-sm me-2'
                    >
                      Edit
                    </Link>
                    <button
                      onClick={e => handleDelete(employee.id)}
                      className='btn btn-sm btn-danger'
                    >
                      Delete
                    </button>
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
