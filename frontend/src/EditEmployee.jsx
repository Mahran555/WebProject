import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

function EditEmployee() {
	const [data, setData] = useState({
        id:'',
        fname: '',
		lname: '',
		email: '',
		password: '',
		userType: '',
		address: '',
		salary: '',
		image: ''
	})
	const navigate = useNavigate()
	
	const {id} = useParams();
	useEffect(()=> {
		axios.get('http://localhost:5000/getInfo/'+id)
        .then((res) => {
            if(res.data.Status === "Success") {
                setData({...data, id: res.data.Result.id,
                    fname: res.data.Result.fname,
					lname:res.data.Result.lname,
					email: res.data.Result.email,
					password: res.data.Result.password,
					userType: res.data.Result.userType,
					address:res.data.Result.address,
					salary: res.data.Result.salary,
					image: res.data.Result.image
                    
                })
            }
		})
		.catch(err =>console.log(err));
	})

	const handleSubmit = (event) => {
		event.preventDefault();
		axios.get('http://localhost:5000/update/'+id, data)
		.then(res => {
			if(res.data.Status === "Success") {
				console.log(data.id)
				navigate('/employee')
			}
		})
		.catch(err => console.log(err));
	}
  return (
    <div className='d-flex flex-column align-items-center pt-4'>
			<h2>Update Employee</h2>
			<form class="row g-3 w-50" onSubmit={handleSubmit}>
			<div class="col-12">
					<label for="inputID" class="form-label">ID</label>
					<input type="number" class="form-control" id="inputID" placeholder='Enter ID' autoComplete='off'
					onChange={e => setData({...data, id: e.target.value})} value={data.id}/>
				</div>
                <div class="col-12">
					<label for="inputFname" class="form-label">First Name</label>
					<input type="text" class="form-control" id="inputFname" placeholder='Enter First Name' value={data.fname} autoComplete='off'
					onChange={e => setData({...data, fname: e.target.value})} />
				</div>
                <div class="col-12">
					<label for="inputLname" class="form-label">Last Name</label>
					<input type="text" class="form-control" id="inputLname" placeholder='Enter Last Name' autoComplete='off'
					onChange={e => setData({...data, lname: e.target.value})} />
				</div>
				<div class="col-12">
					<label for="inputEmail4" class="form-label">Email</label>
					<input type="email" class="form-control" id="inputEmail4" placeholder='Enter Email' autoComplete='off'
					onChange={e => setData({...data, email: e.target.value})} value={data.email}/>
				</div>
				<div class="col-12">
					<label for="inputSalary" class="form-label">Salary</label>
					<input type="number" class="form-control" id="inputSalary" placeholder="Enter Salary" autoComplete='off'
					onChange={e => setData({...data, salary: e.target.value})} value={data.salary}/>
				</div>
				<div class="col-12">
					<label for="inputAddress" class="form-label">Address</label>
					<input type="text" class="form-control" id="inputAddress" placeholder="1234 Main St" autoComplete='off'
					onChange={e => setData({...data, address: e.target.value})} value={data.address}/>
				</div>
				<div class="col-12">
					<button type="submit" class="btn btn-primary">Update</button>
				</div>
			</form>
		</div>
  )
}

export default EditEmployee