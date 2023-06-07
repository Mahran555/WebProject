import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { faIdCard, faUser, faEnvelope, faLock, faSackDollar, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import "./CssFiles/addEmp.css"

function EditEmployee() {
	// States
	const [data, setData] = useState({
        id:'',
        fname: '',
		lname: '',
		email: '',
		password: '',
		address: '',
		salary: '',
		phone:'',
		image: ''
	})
	const [error, setError] = useState('');
    const navigate = useNavigate(); // Navigate function from react-router-dom
    const { id } = useParams(); // Accessing the 'id' parameter from the URL
	// Fetch employee information for editing
	useEffect(()=> {
		axios.get('http://localhost:5000/getInfo/'+id)
        .then((res) => {
            if(res.data.Status === "Success") {
                setData({...data, id: res.data.Result.id,
                    fname: res.data.Result.fname,
					lname:res.data.Result.lname,
					email: res.data.Result.email,
					password: res.data.Result.password,
					address:res.data.Result.address,
					salary: res.data.Result.salary,
					phone: res.data.Result.phone,
					image: res.data.Result.image
                    
                })
            }
		})
		.catch(err =>console.log(err));
	}, [])
	// Handle form submission for updating employee details
	const handleSubmit = (event) => {
		event.preventDefault();
		axios.put('http://localhost:5000/update/'+id, data)
		.then(res => {
			if(res.data.Status === "Success") {
				navigate('/employee')
			}
			else{
				setError(res.data.error);
			}
		})
		.catch(err => console.log(err));
	}
  return (
	<div className='d-flex flex-column align-items-center pt-4'>
	<div className='breadcrumbs'>
	  <Link to="/employee" className='bLink'>
		<span className="breadcrumbs-full">Manage Employees</span>
	  </Link>
	  <span className='breakL'> &gt; </span>
	  <Link to="/create" className='bLink'>
		<span className="breadcrumbs-full">Edit Employee</span>
	  </Link>
	</div>
			
			<div className="form_wrapper">
  <div className="form_container">
    <div className="title_container">
      <h2>Update Employee Details</h2>
    </div>
    <div className="row clearfix">
      <div className="">
        <form  onSubmit={handleSubmit}>
          <div className="input_field"> <span><FontAwesomeIcon icon={faIdCard} /></span>
            <input type="text" name="id" placeholder="ID" required  
						onChange={e => setData({ ...data, id: e.target.value })} value={data.id}/>
          </div>
          <div className="row clearfix">
            <div className="col_half">
              <div className="input_field"><span><FontAwesomeIcon icon={faUser} /></span>
                <input type="text" name="name" placeholder="First Name" 
						onChange={e => setData({ ...data, fname: e.target.value })} value={data.fname}/>
              </div>
            </div>
            <div className="col_half">
              <div className="input_field"><span><FontAwesomeIcon icon={faUser} /></span>
                <input type="text" name="name" placeholder="Last Name" required 
						onChange={e => setData({ ...data, lname: e.target.value })} value={data.lname} />
              </div>
            </div>
          </div>
          
            <div className="input_field"><span><FontAwesomeIcon icon={faEnvelope} /></span>
            <input type="email" name="email" placeholder="Email" required 
						onChange={e => setData({ ...data, email: e.target.value })} value={data.email}/>
          </div>
		  <div className="input_field"> <span><FontAwesomeIcon icon={faSackDollar} /></span>
            <input type="number" name="salary" placeholder="Salary" required 
						onChange={e => setData({ ...data, salary: e.target.value })} value={data.salary}/>
          </div>
		  <div className="input_field"> <span><FontAwesomeIcon icon={faLocationDot} /></span>
            <input type="text" name="address" placeholder="Address" required 
						onChange={e => setData({ ...data, address: e.target.value })} value={data.address} />
          </div>
		  <div className="input_field"> <span><FontAwesomeIcon icon={faPhone} /></span>
            <input type="text" name="phoneNumber" placeholder="Phone Number" required 
						onChange={e => setData({ ...data, phone: e.target.value })} value={data.phone} />
          </div>
          <input className="button" type="submit" value="Update" />
					<span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<label className='text-danger'>{error && error}</label>
					</span>
        </form>
      </div>
    </div>
  </div>
</div>
		</div>
  )
}

export default EditEmployee