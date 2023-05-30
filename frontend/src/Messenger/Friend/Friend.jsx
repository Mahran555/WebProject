import React , {useContext} from 'react'
import './Friend.css'
import { useParams } from 'react-router-dom'


function Friend({FriendName , FriendImg  , FriendId , onFriendClick})  {
    const { id } = useParams();
    const MyId = id;
    console.log('MyId='+ MyId)
    console.log('FriendId='+ FriendId)

    function HandleFriendClick() {
        setReceiverId(FriendId);  // Update the receiverId state
        console.log('im at clicked function FriendId='+FriendId)
        console.log('recieverId='+receiverId)
    }

    return (
            <div className="FriendBox" onClick={() => onFriendClick(FriendId)} >
                <img src={FriendImg} className='FriendImg' />
                <span className='FriendName'>{FriendName}</span>
            </div>
    )
}

export default Friend
