// LineChart.jsx
import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { useState } from 'react';
import "../src/LoginPage.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons';
import "../src/Theme.css"

function LoginPage() {
    return (
        <>
            <div class="container center-screen">
                <div class="d-flex justify-content-center h-100">
                    <div class="card">
                        <div class="card-header text-center">
                            <h3>Sign In</h3>
                        </div>
                        <div class="card-body">
                            <form>
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span className="input-group-text"><FontAwesomeIcon icon={faUser} style={{ height: '25px'  }} /></span>
                                    </div>
                                    <input type="text" class="form-control mb-3 " placeholder="username" />

                                </div>
                                <div class="input-group form-group">
                                    <div class="input-group-prepend">
                                        <span className="input-group-text"><FontAwesomeIcon icon={faKey}  style={{ height: '25px' }}/></span>
                                    </div>
                                    <input type="password" class="form-control" placeholder="password" />
                                </div>
                                <div class="row align-items-center remember mt-2">
                                    <input type="checkbox" />Remember Me
                                </div>
                                <div className="form-group text-center">
                                    <input type="submit" value="Login" className="btn login_btn"
                                        style={{ backgroundColor: '#FFC312', width: '100px', border: 'none', borderRadius: '10px' , color:'#000000'}}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginPage;