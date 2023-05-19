import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "../src/Theme.css";
import 'bootstrap-icons/font/bootstrap-icons.css';

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

      <div id="search&add" className="container">
        <div className="row parent">
          <div className="col-sm-9 parent">
            <Link to='/create' className="btn-design btn text-white mt-3 " style={{ backgroundColor: '#93C0A4' }}>Add Employee</Link>
          </div>

          <div className="col-3">
            <div class="input-group mt-3 ">
              <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
              <button type="button" class="btn-design btn-outline-bgc">search</button>
            </div>
          </div>
        </div>

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
              <th>Phone</th>
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
                  <td>{employee.phone}</td>

                  <td>
                    <Link
                      to={`/employeeEdit/` + employee.id}
                      className='btn btn-bgc btn-sm me-2 t-text btn-design text-white'
                      style={{ backgroundColor: '#93C0A4' }}
                    >
                      Edit
                    </Link>
                    <button
                      onClick={e => handleDelete(employee.id)}
                      className='btn btn-sm btn-design text-white'
                      style={{ backgroundColor: '#D4CDAB' }}
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
