import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../src/LoginPageSimple.css"

export default function (props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate()


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
                    if (res.data.Role === "Manager") {
                        navigate('/');
                    }
                    else {
                        navigate('/employeePage/' + res.data.Result.id);
                    }
                } else {
                    setError(res.data.error);
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <div className="Auth-form-containe center-screen">
            <form className="Auth-form">
                <div className="Auth-form-content" style={{ BackgroundColor: '#f2f2f3' }}>
                    <h3 className="Auth-form-title text-center">Sign In</h3>
                    <div className="form-group mt-3">
                        <label>Email address</label>
                        <input
                            type="email"
                            className="form-control mt-1"
                            placeholder="Enter email"
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="form-group mt-3">
                        <label>Password</label>
                        <input
                            type="password"
                            className="form-control mt-1"
                            placeholder="Enter password"
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <div className="d-grid gap-2 mt-3">
                        <button type="submit" className="btn btn-primary" onClick={handleSubmit}>
                            Submit
                        </button>
                    </div>

                    <div className='text-danger'>
                        {error && error}
                    </div>

                    <p className="forgot-password text-right mt-2">
                        <a href="#">Forgot password?</a>
                    </p>
                </div>
            </form>
        </div>
    )
}