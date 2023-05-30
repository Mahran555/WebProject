import React from 'react'
import "./Messenger.css"
import Friend from '../Friend/Friend'
import FriendsBar from '../FriendsBar/FriendsBar'
import OnlineFriendsBar from '../OnlineFriendsBar/OnlineFriendsBar'
import ChatBar from '../Chat/ChatBar'
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom'
import TopBar from '../Topbar/Topbar'

function Messenger() {
    const { id } = useParams();
    const [RecieverId, SetReceiverId] = useState(0);

    const onFriendClick = useCallback((newRecieverId) => {
        SetReceiverId(newRecieverId);
        console.log('ReceiverId inside callback = ', newRecieverId);
    }, []);


    return (
        <>
        <TopBar />
        <div className='Messenger'>
            <div className="FriendsBox">
                <FriendsBar onFriendClick={onFriendClick} />
            </div>
            <div className="ChatBox">
                <ChatBar SenderId={id} RecieverId={RecieverId}/>
            </div>
            <div className="OnlineBox" >
                <OnlineFriendsBar />
            </div>

        </div>
        </>
    )
}

export default Messenger

