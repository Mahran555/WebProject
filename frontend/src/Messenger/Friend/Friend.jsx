import React , {useContext} from 'react'
import './Friend.css'
import { useParams } from 'react-router-dom'


function Friend({FriendName , FriendImg  , FriendId , onFriendClick})  {
    const { id } = useParams();
    const MyId = id;
   

    function HandleFriendClick() {
        setReceiverId(FriendId);  // Update the receiverId state
    }

    return (
            <div className="FriendBox" onClick={() => onFriendClick(FriendId)} >
                <img src={FriendImg} className='FriendImg' />
                <span className='FriendName'>{FriendName}</span>
            </div>
    )
}

export default Friend
