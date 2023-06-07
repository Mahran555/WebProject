import React from 'react'
import "./Messenger.css"
import Friend from '../Friend/Friend'
import FriendsBar from '../FriendsBar/FriendsBar'
import OnlineFriendsBar from '../OnlineFriendsBar/OnlineFriendsBar'
import ChatBar from '../Chat/ChatBar'
import { useState, useEffect, useCallback } from 'react';
import { useLocation ,useParams } from 'react-router-dom'
import TopBar from '../Topbar/Topbar'

function Messenger() {
     // Retrieve the 'id' parameter from the URL
    const { id } = useParams();
    // Access the current location
    const location = useLocation();
    // Get the query parameter named 'param1' from the URL search params

    const searchParams = new URLSearchParams(location.search);
    const param1Value = searchParams.get('param1');
    // State for storing the receiver ID
    const [RecieverId, SetReceiverId] = useState(Number(param1Value));
    console.log(Number(RecieverId))
    // Callback function to handle friend click

    const onFriendClick = useCallback((newRecieverId) => {
        SetReceiverId(newRecieverId);
        console.log('ReceiverId inside callback = ', newRecieverId);
    }, []);


    return (
        <>
        <TopBar />
        <div className='Messenger'>
            <div className="FriendsBox">
                <FriendsBar id={id} onFriendClick={onFriendClick} />
            </div>
            <div className="ChatBox">
                <ChatBar SenderId={id} RecieverId={RecieverId}/>
            </div>
            <div className="OnlineBox" >
                <OnlineFriendsBar id={id} />
            </div>

        </div>
        </>
    )
}

export default Messenger

