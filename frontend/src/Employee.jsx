import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import "../src/Theme.css"

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
      <div className="col-3 mt-3">
        <div class="input-group col-9 mt-3">
          <input type="search" class="form-control rounded" placeholder="Search" aria-label="Search" aria-describedby="search-addon" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          <button type="button" class="btn-design btn-search">search</button>
        </div>
      </div>

      <div className='mt-4'>
        <table className='table table-bordered table-stripped border-0 text-center' >
          <thead >
            <tr style={{ backgroundColor: '#93C0A4', borderColor: '#f2f2f3' ,fontSize:'18px',textDecoration:'underline'}} >
              <th scope="col"> </th>
              <th scope="col">ID</th>
              <th scope="col">First Name</th>
              <th scope="col">Last Name</th>
              <th scope="col">Email</th>
              <th scope="col">Address</th>
              <th scope="col">Salary</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((employee, i) => (
                <tr className={`row${i % 2}`} key={i} style={{ borderColor: '#f2f2f3',fontSize:'18px' }} >
                  <td >
                    <img
                      src={`http://localhost:5000/images/` + employee.image}
                      className='employee_image'
                      class='rounded-circle'
                      alt='Cinque Terre'
                      width='50'
                      height='50'
                    />
                  </td>
                  <td scope='row'>{employee.id}</td>
                  <td>{employee.fname}</td>
                  <td>{employee.lname}</td>
                  <td>{employee.email}</td>
                  <td>{employee.address}</td>
                  <td>${employee.salary}</td>
                  <td>
                    <Link
                      to={`/employeeEdit/` + employee.id}
                      style={{ color: 'black' }}
                    >
                      <i class="bi bi-pen"></i>
                    </Link>
                    <button
                      onClick={e => handleDelete(employee.id)}
                      style={{border: 'none'}} className={`row${i % 2}`}
                      
                    >
                      <i class="bi bi-trash" backgroundColor="white" borderColor="white" outline="none"></i>
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

      <div className="d-flex justify-content-end w-100">
        <Link to='/create' className='btn text-white ' style={{ backgroundColor: '#93C0A4' }}>Add Employee</Link>
      </div>

    </div>
  );
}

export default Employee;
