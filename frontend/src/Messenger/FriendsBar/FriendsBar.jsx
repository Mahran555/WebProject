import React, { useState, useEffect } from 'react';
import Friend from '../Friend/Friend';
import SearchBar from '../SearchBar/SearchBar';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './FriendsBar.css';

function FriendsBar({id, onFriendClick }) {
  const [AllFriends, SetAllFriends] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  useEffect(() => {
    axios.get('http://localhost:5000/getEmployee')
      .then((res) => {
        if (res.data.Status === 'Success') {
          SetAllFriends(res.data.Result);
        }
      })
      .catch((err) => {
        console.log('failed');
      });
  }, []);

  const filteredFriends = AllFriends.filter((friend) => 
  friend.id != id && friend.fname.toLowerCase().includes(searchValue.toLowerCase())
);



  return (
    <div className='FriendsBar'>
      <SearchBar 
        id='searchBar' 
        PlaceHolder={'Search for friends'} 
        value={searchValue}
        onChange={e => setSearchValue(e.target.value)} 
      />
      {filteredFriends.map((friend) => {
        return (
          <Friend 
            key={friend.id} 
            onFriendClick={onFriendClick} 
            FriendId={friend.id} 
            FriendName={friend.fname} 
            FriendImg={'http://localhost:5000/images/' + friend.image} 
          />
        )
      })}
    </div>
  );
}

export default FriendsBar;