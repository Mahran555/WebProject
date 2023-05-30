import React from 'react'
import './OnlineFriend.css'
function OnlineFriend({ FriendName, FriendImg }) {
    return (
        <div className="OnlineFriendBox">
            <div className="ImgContainer">
            <img src={FriendImg} className='FriendImg' />
            <span className='ImgBadge' />
            </div>
            <span className='FriendName'>{FriendName}</span>
        </div>
    )
}

export default OnlineFriend
