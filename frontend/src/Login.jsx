import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import './login.css'



function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate()

  axios.defaults.withCredentials = true;
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
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
    {/* <div className='p-3 rounded w-25 border loginForm'>
        <div className='text-danger'>
            {error && error}
        </div>
        <br></br>
        <h2>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Welcome</h2>
        <br></br>
        <form onSubmit={handleSubmit}>
            <div className='mb-3'>
                <label htmlFor="email"><strong>Email</strong></label>
                <input type="email" placeholder='Enter Email' name='email' 
                  onChange={handleEmailChange} className='form-control rounded-0' autoComplete='off'/>
            </div>
            <div className='mb-3'>
                <label htmlFor="password"><strong>Password</strong></label>
                <input type="password" placeholder='Enter Password' name='password'
                  onChange={handlePasswordChange} className='form-control rounded-0' />
            </div>
            <button type='submit' className='btn btn-success w-100 rounded-0'> Log in</button>
            <p>You are agree to aour terms and policies</p>
        </form>
     </div> */}




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
