import axios from 'axios'; // Importing the axios library for making HTTP requests
import React, { useState } from 'react'; // Importing the useState hook from React for managing component state
import { useNavigate } from 'react-router-dom'; // Importing the useNavigate hook from react-router-dom for programmatic navigation
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; // Importing the FontAwesomeIcon component from the react-fontawesome library
import { Link } from 'react-router-dom'; // Importing the Link component from react-router-dom for creating links
import { faIdCard, faUser, faEnvelope, faLock, faSackDollar, faLocationDot, faPhone } from '@fortawesome/free-solid-svg-icons'; // Importing specific FontAwesome icons
import "./CssFiles/addEmp.css" // Importing a CSS file

function AddEmployee() {
  // Using the useState hook to create a state variable named 'data' and a function to update it named 'setData'
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
    // Using the useNavigate hook to get the navigate function 
    const navigate = useNavigate()
    // Using the useState hook to create a state variable named 'error' 
    const [error, setError] = useState('');
    // Event handler function for form submission
    const handleSubmit = (event) => {
        event.preventDefault();
         // Appending form data to the FormData object
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
        // Making a POST request to the server using axios
        axios.post('http://localhost:5000/create', formdata)
            .then(res => {
                if (res.data.Status === "Success") {
                    navigate('/employee')// Navigating to the '/employee' route
                }
                else {
                    setError(res.data.error);// Setting the error message received from the server
                }
            })
            .catch(err => console.log(err));
    };

	return (
   <div className='d-flex flex-column align-items-center pt-4'>
      <div className='breadcrumbs'>
        <Link to="/employee" className='bLink'>
          <span className="breadcrumbs-full">Manage Employees</span>
        </Link>
        <span className='breakL'> &gt; </span>
        <Link to="/create" className='bLink'>
          <span className="breadcrumbs-full">Add Employee</span>
        </Link>
      </div>
			
			<div className="form_wrapper">
  <div className="form_container">
    <div className="title_container">
      <h2>Add New Employee</h2>
    </div>
    <div className="row clearfix">
      <div className="">
        <form  onSubmit={handleSubmit}>
          <div className="input_field"> <span><FontAwesomeIcon icon={faIdCard} /></span>
            <input type="text" name="id" placeholder="ID" required autoComplete='off'  
						onChange={e => setData({ ...data, id: e.target.value })} />
          </div>
          <div className="row clearfix">
            <div className="col_half">
              <div className="input_field"><span><FontAwesomeIcon icon={faUser} /></span>
                <input type="text" name="name" placeholder="First Name" required autoComplete='off'
						onChange={e => setData({ ...data, fname: e.target.value })} />
              </div>
            </div>
            <div className="col_half">
              <div className="input_field"><span><FontAwesomeIcon icon={faUser} /></span>
                <input type="text" name="name" placeholder="Last Name" required autoComplete='off'
						onChange={e => setData({ ...data, lname: e.target.value })} />
              </div>
            </div>
          </div>
          
            <div className="input_field"><span><FontAwesomeIcon icon={faEnvelope} /></span>
            <input type="email" name="email" placeholder="Email" required autoComplete='off'
						onChange={e => setData({ ...data, email: e.target.value })} />
          </div>
          <div className="input_field"><span><FontAwesomeIcon icon={faLock} /></span>
            <input type="password" name="password" placeholder="Password" required autoComplete='off'
						onChange={e => setData({ ...data, password: e.target.value })} />
          </div>
		  <div className="input_field"> <span><FontAwesomeIcon icon={faSackDollar} /></span>
            <input type="number" name="salary" placeholder="Salary" required autoComplete='off'
						onChange={e => setData({ ...data, salary: e.target.value })} />
          </div>
		  <div className="input_field"> <span><FontAwesomeIcon icon={faLocationDot} /></span>
            <input type="text" name="address" placeholder="Address" required autoComplete='off'
						onChange={e => setData({ ...data, address: e.target.value })} />
          </div>
		  <div className="input_field"> <span><FontAwesomeIcon icon={faPhone} /></span>
            <input type="text" name="phoneNumber" placeholder="Phone Number" required autoComplete='off'
						onChange={e => setData({ ...data, phone: e.target.value })} />
          </div>
		  <div className="input_field">
      <label className="form-label" htmlFor="inputGroupFile01">Select Profile Image</label>
					<input type="file" className="form-control" id="inputGroupFile01"
						onChange={e => setData({ ...data, image: e.target.files[0] })} accept='.jpeg, .png, .jpg' />
		  </div>
          <input className="button" type="submit" value="Add Employee" />
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