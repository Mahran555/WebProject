import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './TopBar.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Chat from '../../Chat.jsx'
import { useParams } from 'react-router-dom';
import { useState } from 'react';


function TopBar() {
    const {id} = useParams();

    function HandleBackArrowClicked() {
        window.location.href = 'http://localhost:5173/employeePage/'+id
    }

    return (
        <div className='TopBar d-flex'>
            <div className="flex-start align-items-center d-flex ms-1">
                <FontAwesomeIcon className='BackArrow' icon={faArrowLeft} onClick={HandleBackArrowClicked} />
            </div>
            <div className="flex-fill d-flex justify-content-center align-items-center">
                <h3><b>Work manager chat</b></h3>
            </div>
            <div className="flex-end align-items-center d-flex me-2">
                <Chat />
            </div>
        </div>
    )
}

export default TopBar
