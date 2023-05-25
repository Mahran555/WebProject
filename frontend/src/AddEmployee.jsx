import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faIdCard, faUser, faEnvelope, faLock, faSackDollar, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons';
import "./addEmp.css"

function AddEmployee() {
	const [data, setData] = useState({
        id: '',
        fname: '',
        lname: '',
        email: '',
        password: '',
        address: '',
        salary: '',
        phone: '',
        image: ''
    })
    const navigate = useNavigate()
    const [error, setError] = useState('');
    const handleSubmit = (event) => {
        event.preventDefault();
        const formdata = new FormData();
        formdata.append("id", data.id);
        formdata.append("fname", data.fname);
        formdata.append("lname", data.lname);
        formdata.append("email", data.email);
        formdata.append("password", data.password);
        formdata.append("address", data.address);
        formdata.append("salary", data.salary);
        formdata.append("phone", data.phone);
        formdata.append("image", data.image);
        axios.post('http://localhost:5000/create', formdata)
            .then(res => {
                if (res.data.Status === "Success") {
                    navigate('/employee')
                }
                else {
                    setError(res.data.error);
                }
            })
            .catch(err => console.log(err));
    };

	return (
		<div className='d-flex flex-column align-items-center pt-4'>
			
			<div class="form_wrapper">
  <div class="form_container">
    <div class="title_container">
      <h2>Add New Employee</h2>
    </div>
    <div class="row clearfix">
      <div class="">
        <form  onSubmit={handleSubmit}>
          <div class="input_field"> <span><FontAwesomeIcon icon={faIdCard} /></span>
            <input type="text" name="id" placeholder="ID" required autoComplete='off'  
						onChange={e => setData({ ...data, id: e.target.value })} />
          </div>
          <div class="row clearfix">
            <div class="col_half">
              <div class="input_field"><span><FontAwesomeIcon icon={faUser} /></span>
                <input type="text" name="name" placeholder="First Name" required autoComplete='off'
						onChange={e => setData({ ...data, fname: e.target.value })} />
              </div>
            </div>
            <div class="col_half">
              <div class="input_field"><span><FontAwesomeIcon icon={faUser} /></span>
                <input type="text" name="name" placeholder="Last Name" required autoComplete='off'
						onChange={e => setData({ ...data, lname: e.target.value })} />
              </div>
            </div>
          </div>
          
            <div class="input_field"><span><FontAwesomeIcon icon={faEnvelope} /></span>
            <input type="email" name="email" placeholder="Email" required autoComplete='off'
						onChange={e => setData({ ...data, email: e.target.value })} />
          </div>
          <div class="input_field"><span><FontAwesomeIcon icon={faLock} /></span>
            <input type="password" name="password" placeholder="Password" required autoComplete='off'
						onChange={e => setData({ ...data, password: e.target.value })} />
          </div>
		  <div class="input_field"> <span><FontAwesomeIcon icon={faSackDollar} /></span>
            <input type="number" name="salary" placeholder="Salary" required autoComplete='off'
						onChange={e => setData({ ...data, salary: e.target.value })} />
          </div>
		  <div class="input_field"> <span><FontAwesomeIcon icon={faLocationDot} /></span>
            <input type="text" name="address" placeholder="Address" required autoComplete='off'
						onChange={e => setData({ ...data, address: e.target.value })} />
          </div>
		  <div class="input_field"> <span><FontAwesomeIcon icon={faPhone} /></span>
            <input type="text" name="phoneNumber" placeholder="Phone Number" required autoComplete='off'
						onChange={e => setData({ ...data, phone: e.target.value })} />
          </div>
		  <div class="input_field">
		  <label class="form-label" for="inputGroupFile01">Select Profile Image</label>
					<input type="file" className="form-control" id="inputGroupFile01"
						onChange={e => setData({ ...data, image: e.target.files[0] })} accept='.jpeg, .png, .jpg' />
		  </div>
          <input class="button" type="submit" value="Add Employee" />
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

export default AddEmployee