import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import './CssFiles/login.css'



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()
  // Enable sending cookies with cross-origin requests
  axios.defaults.withCredentials = true;
  // Update the email state when the input value changes

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };
  // Update the password state when the input value changes

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  // Handle form submission

  const handleSubmit = (event) => {
    event.preventDefault();

    // Send a POST request to the login endpoint with the email and password
    axios.post('http://localhost:5000/login', { email, password })
      .then((res) => {
        if (res.data.Status === "Success") {
          // Redirect to the home page after successful login
           if(res.data.role==="Manager")
           {
            navigate('/');
           }
       else{
            navigate('/employeePage/'+res.data.Result.id);
           }
        } else 
        {
          setError(res.data.error);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };


  return (

    <div className='d-flex justify-content-center align-items-center vh-100 loginPage'>
    

<div class="loginBackground">
        <div class="shape"></div>
        <div class="shape"></div>
    </div>
    <form id='loginForm' onSubmit={handleSubmit}>
        <h3>Login Here</h3>

        <label for="email">Email</label>
        <input type="email" placeholder="Email" id="username" name='email'
                  onChange={handleEmailChange} className='form-control rounded-0' autoComplete='off' style={{color:'black'}}/>

        <label for="password">Password</label>
        <input type="password" placeholder="Password" id="password" name='password'
         onChange={handlePasswordChange} className='form-control rounded-0' />

        <button type='submit'>LogIn</button>
        <div className='text-danger'>
            {error && error}
        </div>
    </form>


</div>

  );
}

export default Login;
