import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import "../src/Theme.css"

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
			<h2>Add Employee</h2>
			<form class="row g-3 w-50" onSubmit={handleSubmit}>
				<div class="col-12">
					<label for="inputID" class="form-label">ID</label>
					<input type="number" class="form-control" id="inputID" placeholder='Enter ID' autoComplete='off'
						onChange={e => setData({ ...data, id: e.target.value })} />
				</div>
				<div class="col-12">
					<label for="inputFname" class="form-label">First Name</label>
					<input type="text" class="form-control" id="inputFname" placeholder='Enter First Name' autoComplete='off'
						onChange={e => setData({ ...data, fname: e.target.value })} />
				</div>
				<div class="col-12">
					<label for="inputLname" class="form-label">Last Name</label>
					<input type="text" class="form-control" id="inputLname" placeholder='Enter Last Name' autoComplete='off'
						onChange={e => setData({ ...data, lname: e.target.value })} />
				</div>
				<div class="col-12">
					<label for="inputEmail4" class="form-label">Email</label>
					<input type="email" class="form-control" id="inputEmail4" placeholder='Enter Email' autoComplete='off'
						onChange={e => setData({ ...data, email: e.target.value })} />
				</div>
				<div class="col-12">
					<label for="inputPassword4" class="form-label">Password</label>
					<input type="password" class="form-control" id="inputPassword4" placeholder='Enter Password'
						onChange={e => setData({ ...data, password: e.target.value })} />
				</div>
				<div class="col-12">
					<label for="inputSalary" class="form-label">Salary</label>
					<input type="number" class="form-control" id="inputSalary" placeholder="Enter Salary" autoComplete='off'
						onChange={e => setData({ ...data, salary: e.target.value })} />
				</div>
				<div class="col-12">
					<label for="inputAddress" class="form-label">Address</label>
					<input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St" autoComplete='off'
						onChange={e => setData({ ...data, address: e.target.value })} />
				</div>
				<div class="col-12">
					<label for="inputPhone" class="form-label">Phone Number</label>
					<input type="text" class="form-control" id="inputPhone" placeholder="Enter Phone Number" autoComplete='off'
						onChange={e => setData({ ...data, phone: e.target.value })} />
				</div>
				<div class="col-12 mb-3">
					<label class="form-label" for="inputGroupFile01">Select Image</label>
					<input type="file" className="form-control" id="inputGroupFile01"
						onChange={e => setData({ ...data, image: e.target.files[0] })}
						accept='.jpeg, .png, .jpg' />
				</div>
				
				<div class="col-12">
					<button type="submit" class="btn-design btn-bgc">Create</button>
					<span >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<label className='text-danger'>{error && error}</label>
					</span>
				</div>
			</form>
		</div>

	)
}

export default AddEmployee