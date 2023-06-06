import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './TopBar.css'
import Chat from '../../Chat.jsx'
import { useParams } from 'react-router-dom';



function TopBar() {

    return (
        <div className='TopBar d-flex'>
           
            <div className="flex-fill d-flex justify-content-center align-items-center">
                <h3><b>Work manager chat</b></h3>
            </div>
        </div>
    )
}

export default TopBar
